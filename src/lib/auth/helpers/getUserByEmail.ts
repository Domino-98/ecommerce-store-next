import { db } from "@/lib/db";

export async function getUserByEmail(email: string) {
    const user = await db.query.userTable.findFirst({
        where: (users, { eq }) => eq(users.email, email),
    })
    return user;
}