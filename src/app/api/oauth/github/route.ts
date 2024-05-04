import { github } from "@/lib/auth/oauth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/db";
import { oauthAccountTable, userTable } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { lucia } from "@/lib/auth";
import { generateId } from "lucia";
import { getUserByEmail } from "@/lib/auth/helpers/getUserByEmail";

interface GitHubUser {
    id: string;
    login: string;
    email: string;
    name: string;
    avatar_url: string;
}

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const url = req.nextUrl;

        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        if (!code || !state) {
            return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        const savedState = cookies().get("state")?.value;

        if (!savedState) {
            return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        if (savedState !== state) {
            return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        const { accessToken } = await github.validateAuthorizationCode(code);

        const githubRes = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            method: "GET"
        });
        const githubData = await githubRes.json() as GitHubUser;

        let githubEmail = githubData.email;

        if (!githubEmail) {
            const githubRes = await fetch("https://api.github.com/user/emails", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                method: "GET"
            });
            const githubEmails = await githubRes.json() as any[];
            const primaryEmail = githubEmails.find((email) => email.primary).email;
            githubEmail = primaryEmail;
        }

        const user = await getUserByEmail(githubEmail);

        let userId = user?.id;

        await db.transaction(async (db) => {
            let oauthAccountExists: boolean = false;

            if (!user) {
                const generatedUserId = generateId(15);

                const createdUser = await db.insert(userTable).values({
                    id: generatedUserId,
                    email: githubEmail,
                    name: githubData.name,
                    profilePictureUrl: githubData.avatar_url
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
                    where: eq(oauthAccountTable.id, githubData.id)
                }));
            }

            if (!oauthAccountExists) {
                await db.insert(oauthAccountTable).values({
                    accessToken,
                    id: githubData.id,
                    provider: "github",
                    providerUserId: githubData.id,
                    userId: userId as string
                });
            } else {
                const updatedOAuthAccountRes = await db.update(oauthAccountTable).set({
                    accessToken,
                }).where(eq(oauthAccountTable.id, githubData.id));

                if (updatedOAuthAccountRes.rowCount === 0) {
                    db.rollback();
                    return Response.json({ error: "An error occurred. Please try again later." }, { status: 500 });
                }
            }
        });

        const session = await lucia.createSession(userId as string, {
            expiresIn: 60 * 60 * 24 * 30 // 30 days
        });
        const sessionCookie = lucia.createSessionCookie(session.id);

        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        cookies().set("state", "", {
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