"use server"

import { getUserByEmail } from "@/lib/auth/helpers/getUser";
import { hashPassword } from "@/lib/auth/helpers/hashPassword";
import { db } from "@/lib/database/db";
import { emailVerificationTable, userTable } from "@/lib/database/schema";
import { generateId } from "lucia";
import jwt from "jsonwebtoken";
import config from "@/lib/config";
import { sendEmail } from "@/lib/email";
import { userSignupSchema } from "@/lib/auth/validation-schemas";

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const validation = userSignupSchema.safeParse({
        email,
        password,
        confirmPassword
    });

    if (!validation.success) {
        const errorsString = validation.error.issues.map((issue) => issue.message).join(", ");
        console.log(validation.error.issues)
        return {
            error: errorsString
        }
    }

    try {
        const user = await getUserByEmail(email);

        if (user && user.password) {
            return {
                error: "Email already exists."
            }
        }

        const userId = generateId(15);
        const hashedPassword = await hashPassword(password);

        const createdUser = await db.insert(userTable).values({ id: userId, email, password: hashedPassword }).onConflictDoUpdate({
            target: userTable.email,
            set: { password: hashedPassword },
        }).returning({
            id: userTable.id
        });

        const codeId = generateId(15);
        const code = Math.random().toString(36).substring(2, 15);

        await db.insert(emailVerificationTable).values({ id: codeId, userId: createdUser[0].id, code, sentAt: new Date() });

        const token = jwt.sign({ email, userId: createdUser[0].id, code }, config.JWT_SECRET as string, {
            expiresIn: "5m"
        });

        const url = `${config.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`;

        await sendEmail(email, "Verify your email", `Click <a href="${url}">here</a> to verify your email.`);

        return {
            success: "You have successfully registered. We've sent you a verification email."
        }
    } catch (err) {
        console.error(err);
        return {
            error: "An error occurred. Please try again later."
        }
    }
}