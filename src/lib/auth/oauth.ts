import { GitHub, Google } from "arctic"
import config from "../config"

export const github = new GitHub(process.env.GITHUB_CLIENT_ID!, process.env.GITHUB_CLIENT_SECRET!, {
    redirectURI: config.AUTH_TRUST_HOST + "/api/oauth/github"
})

export const google = new Google(config.GOOGLE_CLIENT_ID!, config.GOOGLE_CLIENT_SECRET!, config.AUTH_TRUST_HOST + "/api/oauth/google")