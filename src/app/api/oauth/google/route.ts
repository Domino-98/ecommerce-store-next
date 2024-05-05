import { google } from "@/lib/auth/oauth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/db";
import { oauthAccountTable, userTable } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { lucia } from "@/lib/auth";
import { generateId } from "lucia";
import { getUserByEmail } from "@/lib/auth/helpers/getUser";

interface GoogleUser {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    picture: string;
    locale: string;
}

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const url = req.nextUrl;

        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        if (!code || !state) {
            return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        const codeVerifier = cookies().get("codeVerifier")?.value;
        const savedState = cookies().get("state")?.value;

        if (!codeVerifier || !savedState) {
            return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        if (savedState !== state) {
            return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        const { accessToken, accessTokenExpiresAt, refreshToken } = await google.validateAuthorizationCode(code, codeVerifier);

        const googleRes = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            method: "GET"
        });

        const googleData = await googleRes.json() as GoogleUser;

        console.log({ googleData })

        const user = await getUserByEmail(googleData.email);

        let userId = user?.id;

        await db.transaction(async (db) => {
            let oauthAccountExists: boolean = false;

            if (!user) {
                const generatedUserId = generateId(15);

                const createdUser = await db.insert(userTable).values({
                    id: generatedUserId,
                    email: googleData.email,
                    name: googleData.name,
                    profilePictureUrl: googleData.picture
                }).returning({
                    id: userTable.id
                });

                userId = generatedUserId;

                if (createdUser.length === 0) {
                    db.rollback();
                    return Response.json({ error: "An error occurred. Please try again later." }, { status: 500 });
                }
            } else {
                oauthAccountExists = !!(await db.query.oauthAccountTable.findFirst({
                    where: eq(oauthAccountTable.id, googleData.id)
                }));
            }

            if (!oauthAccountExists) {
                await db.insert(oauthAccountTable).values({
                    accessToken,
                    expiresAt: accessTokenExpiresAt,
                    id: googleData.id,
                    provider: "google",
                    providerUserId: googleData.id,
                    userId: userId as string,
                    refreshToken
                });
            } else {
                const updatedOAuthAccountRes = await db.update(oauthAccountTable).set({
                    accessToken,
                    expiresAt: accessTokenExpiresAt,
                    refreshToken
                }).where(eq(oauthAccountTable.id, googleData.id));

                if (updatedOAuthAccountRes.rowCount === 0) {
                    db.rollback();
                    return Response.json({ error: "An error occurred. Please try again later." }, { status: 500 });
                }
            }
        });

        const session = await lucia.createSession(userId as string, {
            expiresIn: 60 * 60 * 24 * 30 // 30 days
        })
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        cookies().set("state", "", {
            expires: new Date(0),
        })
        cookies().set("codeVerifier", "", {
            expires: new Date(0),
        })

        return NextResponse.redirect(new URL('/', req.url), {
            status: 302
        });
    } catch (err: any) {
        console.error(err);
        return Response.json({ error: err.message }, { status: 500 });
    }
}
