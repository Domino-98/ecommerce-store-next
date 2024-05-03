import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userRoles = pgEnum('role', ['USER', 'ADMIN']);

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password"),
    profilePictureUrl: text("profile_picture_url"),
    name: text("name"),
    role: userRoles("role").notNull().default("USER"),
});

export const oauthAccountTable = pgTable("oauth_account", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => userTable.id),
    provider: text("provider").notNull(),
    providerUserId: text("provider_user_id").notNull().unique(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date"
    })
});

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date"
    }).notNull()
});
