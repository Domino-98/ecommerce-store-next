import { GitHub, Google } from "arctic"
import config from "../config"

export const github = new GitHub(process.env.GITHUB_CLIENT_ID!, process.env.GITHUB_CLIENT_SECRET!, {
    redirectURI: config.NEXT_PUBLIC_BASE_URL + "/api/oauth/github"
})

export const google = new Google(config.GOOGLE_CLIENT_ID!, config.GOOGLE_CLIENT_SECRET!, config.NEXT_PUBLIC_BASE_URL + "/api/oauth/google")