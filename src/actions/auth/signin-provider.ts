"use server"

import { cookies } from "next/headers";
import { generateCodeVerifier, generateState } from "arctic";
import { github, google } from "@/lib/auth/oauth";

export async function createGoogleAuthorizationURL() {
    try {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();

        const authorizationURL = await google.createAuthorizationURL(state, codeVerifier,
            {
                scopes: [
                    "email",
                    "profile"
                ]
            }
        );

        cookies().set("codeVerifier", codeVerifier, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 10,
            sameSite: "lax"
        })

        cookies().set("state", state, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 10,
            sameSite: "lax"
        })

        return {
            success: true,
            data: authorizationURL.toString(),
        }
    } catch (err: any) {
        return {
            error: err?.message
        }
    }
}

export async function createGithubAuthorizationURL() {
    try {
        const state = generateState();
        const authorizationURL = await github.createAuthorizationURL(state, {
            scopes: [
                "user:email"
            ]
        });

        cookies().set("state", state, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "strict"
        });

        return {
            success: true,
            data: authorizationURL.toString(),
        }
    } catch (err) {
        console.error(err);
        return {
            error: "An error occurred. Please try again later."
        }
    }
}