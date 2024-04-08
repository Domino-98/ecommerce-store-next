import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth from "next-auth"
import GitHub from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google"
import { db } from "./db"

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    adapter: DrizzleAdapter(db),
    providers: [
        GoogleProvider({
            allowDangerousEmailAccountLinking: true,
        }),
        GitHub({
            allowDangerousEmailAccountLinking: true
        })
    ],
    // callbacks: {
    //     async session({ session, user, token }) {
    //         return session
    //     }
    // }
})
