"use server";

import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";

export async function logout() {
    try {
        const { session } = await validateRequest();

        if (!session) {
            return {
                error: "Unauthorized"
            };
        }

        await lucia.invalidateSession(session.id);

        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    } catch (error) {
        console.error(error);
        return {
            error: "An error occurred. Please try again later."
        }
    }
}