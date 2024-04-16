"use server"

import { hashPassword } from "@/lib/auth/hashPassword";
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { userSignupSchema } from "@/lib/validationSchema"

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const validation = userSignupSchema.safeParse({
        email,
        password,
        confirmPassword
    })

    if (!validation.success) {
        const errorsString = validation.error.issues.map((issue) => issue.message).join(", ");
        console.log(validation.error.issues)
        setTimeout(() => ({ errors: "" }), 5000)
        return {
            error: errorsString
        }
    }

    try {
        const userExists = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
        })

        if (userExists) {
            setTimeout(() => ({ errors: "" }), 5000)
            return {
                error: "Email already exists"
            }
        }

        const hashedPassword = await hashPassword(password);

        await db.insert(users).values({ email, password: hashedPassword });
    } catch (err) {
        console.error(err);
    }
}