import { db } from "@/lib/database/db";

export async function getUserByEmail(email: string) {
    const user = await db.query.userTable.findFirst({
        where: (users, { eq }) => eq(users.email, email)
    })
    return user;
}

export async function getUserById(userId: string) {
    const user = await db.query.userTable.findFirst({
        where: (users, { eq }) => eq(users.id, userId)
    })
    return user;
}