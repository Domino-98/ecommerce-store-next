import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth from "next-auth"
import GitHub from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google"
import CredentialProvider from "next-auth/providers/credentials"
import { db } from "./db"
import { verifyPassword } from "@/app/auth/_lib/verifyPassword"
import { users } from "./schema"

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
        }),
        CredentialProvider({
            name: "credentials",
            authorize: async (credentials) => {
                console.log(credentials)

                const user = await db.query.users.findFirst({
                    where: (users, { eq }) => eq(users.email, credentials.email as string),
                })

                if (!user) {
                    return null;
                }

                const isValid = await verifyPassword(credentials!.password as string, user.password!);

                if (!isValid) {
                    return null
                }

                // // return object that is encoded for JWT token
                console.log({ email: user.email })
                return { email: user.email, role: user.role };
            },
            credentials: {
                email: {},
                password: {},
            },
        })
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async session({ session, token }) {
            console.log("session => ", session)
            console.log({ token })

            return {
                ...session,
                user: {
                    email: token.email,
                }
            }
        },
    }
})
