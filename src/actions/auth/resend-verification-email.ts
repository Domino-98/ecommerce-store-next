"use server";

import { getUserByEmail } from "@/lib/auth/helpers/getUser";
import { db } from "@/lib/database/db";
import { emailVerificationTable } from "@/lib/database/schema";
import jwt from "jsonwebtoken";
import config from "@/lib/config";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email";

export async function resendVerificationEmail(email: string) {
    try {
        const user = await getUserByEmail(email);

        if (!user) {
            return {
                error: "User not found"
            }
        }

        if (user.isEmailVerified) {
            return {
                error: "Email is already verified"
            }
        }

        const existingCode = await db.query.emailVerificationTable.findFirst({
            where: eq(emailVerificationTable.userId, user.id)
        });

        if (!existingCode) {
            return {
                error: "Verification code not found"
            }
        }

        const sentAt = new Date(existingCode.sentAt);
        const oneMinuteHasPassed = new Date().getTime() - sentAt.getTime() > 60000;

        if (!oneMinuteHasPassed) {
            return {
                error: `Email already sent. Next email in ${Math.ceil((60000 - (new Date().getTime() - sentAt.getTime())) / 1000)} seconds.`
            }
        }

        const code = Math.random().toString(36).substring(2, 15);

        await db.update(emailVerificationTable).set({ code, sentAt: new Date() });

        const token = jwt.sign({ email, userId: user.id, code }, config.JWT_SECRET as string, {
            expiresIn: "5m"
        });

        const url = `${config.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`;

        await sendEmail(email, "Verify your email", `Click <a href="${url}">here</a> to verify your email.`);

        return {
            success: "Email sent successfully. Please check your email to verify your account."
        }
    } catch (error) {
        console.error(error);
        return {
            error: "An error occurred. Please try again later."
        }
    }
}