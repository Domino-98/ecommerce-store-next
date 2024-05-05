import { and, eq } from 'drizzle-orm';
import { db } from "@/lib/database/db";
import { passwordResetTokenTable } from "@/lib/database/schema";

export const canResetPassword = async (userId: string, token: string) => {
    const resetToken = await db.query.passwordResetTokenTable.findFirst({
        where: (tokens, { eq, and }) => and(eq(tokens.userId, userId), eq(tokens.token, token)),
    })

    console.log({ resetToken })

    if (!resetToken) {
        return {
            error: "Invalid token or userId", ok: false
        };
    }

    if (resetToken.expiresAt < new Date()) {
        await db.delete(passwordResetTokenTable).where(and(eq(passwordResetTokenTable.userId, userId), eq(passwordResetTokenTable.token, token)));
        return {
            error: "Token expired. Please reset your password again", ok: false
        }
    }

    return { success: "Token valid", ok: true, resetToken };
}