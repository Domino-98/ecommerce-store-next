import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { NextAuthConfig, Session, User } from "next-auth"
import GitHub from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google"
import CredentialProvider from "next-auth/providers/credentials"
import { db } from "./db"
import { verifyPassword } from "./auth/verifyPassword"
import { getUserByEmail } from "./auth/getUserByEmail"

export default {
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

                const user = await getUserByEmail(credentials.email as string);

                if (!user) {
                    return null;
                }

                const isValid = await verifyPassword(credentials!.password as string, user.password!);

                if (!isValid) {
                    return null
                }

                if (user.role === "USER" && credentials.type === 'admin') {
                    return null;
                }

                // // return object that is encoded for JWT token
                console.log({ user })
                return { email: user.email, role: user.role };
            },
            credentials: {
                email: {},
                password: {},
                type: {}
            },
        })
    ],
    session: { strategy: "jwt", maxAge: 365 * 24 * 60 * 60 },
    callbacks: {
        async jwt({ token, user }) {
            if (!token.email) return token;

            const userInDb = await getUserByEmail(token.email);

            if (!userInDb) return token;

            token.role = userInDb.role;

            console.log({ token, user })

            token.data = user

            return token;
        },
        async session({ session, token }: { session: Session, token: User }) {
            console.log({ session, token })
            if (token?.role && session.user) {
                session.user.role = token.role;
            }
            console.log({ session })
            return session;
        },
    }
} satisfies NextAuthConfig