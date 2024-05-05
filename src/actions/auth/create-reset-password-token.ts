"use server";

import { eq } from 'drizzle-orm';
import { db } from "@/lib/database/db";
import { userEmailSchema } from "@/lib/validationSchema";
import { passwordResetTokenTable } from '@/lib/database/schema';
import { getUserByEmail } from '@/lib/auth/helpers/getUser';
import { generateId } from 'lucia';
import config from '@/lib/config';
import { sendEmail } from '@/lib/email';

export async function createResetPasswordToken(email: string) {
    const validation = userEmailSchema.safeParse({
        email,
    });

    if (!validation.success) {
        const errorsString = validation.error.issues.map((issue) => issue.message).join(", ");
        return {
            error: errorsString
        }
    }

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            return {
                error: "No user found with that email address."
            }
        }

        let token;
        token = await db.query.passwordResetTokenTable.findFirst({
            where: eq(passwordResetTokenTable.userId, user.id)
        })

        if (token) {
            const sentAt = new Date(token.sentAt);
            const oneMinuteHasPassed = new Date().getTime() - sentAt.getTime() > 60000;

            if (!oneMinuteHasPassed) {
                return {
                    error: `Email already sent. Next email in ${Math.ceil((60000 - (new Date().getTime() - sentAt.getTime())) / 1000)} seconds.`
                }
            }
        }

        if (token && token.expiresAt < new Date()) {
            await db.delete(passwordResetTokenTable).where(eq(passwordResetTokenTable.id, token.id));
        }

        if (!token || token.expiresAt < new Date()) {
            token = await db.insert(passwordResetTokenTable).values({
                id: generateId(15),
                token: crypto.randomUUID(),
                userId: user.id,
                expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
                sentAt: new Date()
            }).returning({
                id: passwordResetTokenTable.id,
                token: passwordResetTokenTable.token
            })
            token = token[0];
        }

        await db.update(passwordResetTokenTable).set({ sentAt: new Date() }).where(eq(passwordResetTokenTable.id, token.id));

        const url = `${config.NEXT_PUBLIC_BASE_URL}/auth/reset-password/${user.id}?token=${token.token}`;

        await sendEmail(email, "Reset your password", `Click <a href="${url}">here</a> to reset your password.`);

        return {
            success: "Email sent successfully. Please check your email to reset your password."
        }
    } catch (error) {
        console.error(error);
        return {
            error: "An error occurred. Please try again later."
        }
    }
}