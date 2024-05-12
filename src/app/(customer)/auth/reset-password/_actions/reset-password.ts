"use server";

import { and, eq } from 'drizzle-orm';
import { db } from "@/lib/database/db";
import { passwordResetTokenTable, userTable } from '@/lib/database/schema';
import { getUserById } from '@/lib/auth/helpers/getUser';
import { hashPassword } from '@/lib/auth/helpers/hashPassword';
import { canResetPassword } from '../_lib/canResetPassword';
import { userResetPasswordSchema } from '@/lib/auth/validation-schemas';

export async function resetPassword(formData: FormData, userId: string, token: string) {
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const validation = userResetPasswordSchema.safeParse({
        newPassword,
        confirmPassword
    });

    if (!validation.success) {
        const errorsString = validation.error.issues.map((issue) => issue.message).join(", ");
        return {
            error: errorsString
        }
    }

    try {
        const user = await getUserById(userId);

        if (!user) {
            return {
                error: "No user found."
            }
        }

        const valid = await canResetPassword(userId, token);

        console.log(valid)

        if (!valid.ok) {
            return valid;
        }

        const hashedPassword = await hashPassword(newPassword);

        await db.update(userTable).set({ password: hashedPassword }).where(eq(userTable.id, user.id));

        await db.delete(passwordResetTokenTable).where(and(eq(passwordResetTokenTable.userId, userId), eq(passwordResetTokenTable.token, valid.resetToken!.token)));

        return {
            success: "Password reset successfully."
        }
    } catch (error) {
        console.error(error);
        return {
            error: "An error occurred. Please try again later."
        }
    }
}