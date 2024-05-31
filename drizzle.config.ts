import config from "./src/lib/config"
import { defineConfig } from "drizzle-kit"

let sslmode = ""
if (config.APP_ENV === "production") {
    sslmode = "?sslmode=require"
}

export default defineConfig({
    schema: "./src/lib/database/schema.ts",
    out: "./drizzle",
    dialect: 'postgresql',
    dbCredentials: {
        url: config.POSTGRES_URL + sslmode
    },
    verbose: true,
    strict: true
})