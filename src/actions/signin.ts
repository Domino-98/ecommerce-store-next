"use server"

import { lucia, validateRequest } from "@/lib/auth";
import { getUserByEmail } from "@/lib/auth/helpers/getUserByEmail";
import { userSigninSchema } from "@/lib/validationSchema"
import { cookies } from "next/headers";
import { verifyPassword } from "@/lib/auth/helpers/verifyPassword";
import { logout } from "./logout";

export async function signin(formData: FormData, isAdmin?: boolean) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validation = userSigninSchema.safeParse({
        email,
        password
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

        if (!user) {
            return {
                error: "Incorrect username or password"
            }
        }

        const isValid = await verifyPassword(password, user.password ?? '');

        console.log({ isValid })

        if (!isValid) {
            return {
                error: "Incorrect username or password"
            }
        }

        if (!user.isEmailVerified) {
            return {
                error: "Please verify your email address.",
                key: "emailVerification"
            }
        }

        console.log({ user, isAdmin })

        if (user.role === "USER" && isAdmin) {
            return {
                error: "Unauthorized"
            }
        }

        const { session: currentSession } = await validateRequest();

        if (currentSession) {
            await logout();
        }

        const session = await lucia.createSession(user.id, {
            expiresIn: 60 * 60 * 24 * 30 // 30 days
        })
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    } catch (err) {
        console.error(err);
        return {
            error: "An error occurred. Please try again later."
        }
    }
}