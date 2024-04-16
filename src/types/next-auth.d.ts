import { DefaultUser } from 'next-auth';
import NextAuth from "next-auth";
import { AdapterUser } from "next-auth/adapters"


declare module "next-auth" {
    /**
     * Leveraged by session callback's user object (AdapterUser extends User)
     */
    export interface User extends DefaultUser {
        /** Define any user-specific variables here to make them available to other code inferences */
        role?: "USER" | "ADMIN";
        // Any other attributes you need from either your User table columns or additional fields during a session callback
    }

    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    export interface Session {
        user: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: number;
    }
}