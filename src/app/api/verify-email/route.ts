import { lucia } from "@/lib/auth";
import { db } from "@/lib/database/db";
import { emailVerificationTable, userTable } from "@/lib/database/schema";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import config from "@/lib/config";

export async function GET(req: NextRequest, res: NextResponse) {
    const token = req.nextUrl.searchParams.get("token") || '';

    console.log(token)

    try {
        const decoded = jwt.verify(
            token,
            config.JWT_SECRET as string
        ) as {
            userId: string;
            email: string;
            code: string;
        };

        console.log({ decoded })

        const emailVerificationQueryRes =
            await db.query.emailVerificationTable.findFirst({
                where: and(
                    eq(emailVerificationTable.userId, decoded.userId),
                    eq(emailVerificationTable.code, decoded.code)
                ),
            });

        console.log({ emailVerificationQueryRes });

        if (!emailVerificationQueryRes) {
            return NextResponse.json({ error: "Invalid token." }, { status: 400 });
        }

        console.log({ decoded });

        await db
            .delete(emailVerificationTable)
            .where(eq(emailVerificationTable.userId, decoded.userId));

        await db
            .update(userTable)
            .set({
                isEmailVerified: true,
            })
            .where(eq(userTable.email, decoded.email));


        const session = await lucia.createSession(decoded.userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        console.log({ session })

        return NextResponse.redirect(new URL('/', req.url), {
            status: 302
        });
    } catch (err: unknown) {
        console.log(err)
        let error = 'Token expired.';
        if (err instanceof JsonWebTokenError) {
            error = err.message;
        }
        return NextResponse.json(
            { error },
            { status: 500 }
        );
    }
}

