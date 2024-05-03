"use server"

import { lucia } from "@/lib/auth";
import { getUserByEmail } from "@/lib/auth/helpers/getUserByEmail";
import { hashPassword } from "@/lib/auth/helpers/hashPassword";
import { db } from "@/lib/db";
import { userTable } from "@/lib/schema";
import { userSignupSchema } from "@/lib/validationSchema"
import { generateId } from "lucia";
import { cookies } from "next/headers";

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
        const userExists = await getUserByEmail(email);

        if (userExists) {
            return {
                error: "Email already exists."
            }
        }

        const userId = generateId(15);
        const hashedPassword = await hashPassword(password);

        await db.insert(userTable).values({ id: userId, email, password: hashedPassword });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    } catch (err) {
        console.error(err);
        return {
            error: "An error occurred. Please try again later."
        }
    }
}