import NextAuth, { Session, User } from "next-auth"
import authConfig from "./authConfig"

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth(authConfig)
