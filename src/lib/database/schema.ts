import { relations } from "drizzle-orm";
import { AnyPgColumn, boolean, pgEnum, pgTable, text, timestamp, uuid, serial } from "drizzle-orm/pg-core";

export const userRoles = pgEnum('role', ['USER', 'ADMIN']);

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    isEmailVerified: boolean("is_email_verified").default(false),
    password: text("password"),
    profilePictureUrl: text("profile_picture_url"),
    name: text("name"),
    role: userRoles("role").notNull().default("USER")
});

export const emailVerificationTable = pgTable("email_verification", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => userTable.id),
    code: text("code").notNull(),
    sentAt: timestamp("sent_at", {
        withTimezone: true,
        mode: "date",
    }).notNull()
});

export const passwordResetTokenTable = pgTable("password_reset_token", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => userTable.id),
    token: text("token").notNull(),
    sentAt: timestamp("sent_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date"
    }).notNull()
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

export const categoryTable = pgTable('category', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    slug: text('slug').notNull().unique(),
    parentId: uuid('parentId').references((): AnyPgColumn => categoryTable.id),
    image: text('image'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull()
});

export const categoryRelation = relations(categoryTable, ({ many, one }) => ({
    parent: one(categoryTable, {
        fields: [categoryTable.parentId],
        references: [categoryTable.id],
        relationName: "subcategories"
    }),
    subcategories: many(categoryTable, { relationName: "subcategories" }),
}));

export type Category = typeof categoryTable.$inferSelect;
