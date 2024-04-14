import config from "@/lib/config"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from './schema';

let sslmode = "";
if (config.APP_ENV === "prod") {
    sslmode = "?sslmode=require"
}

export const pool = new Pool({
    connectionString: config.POSTGRES_URL + sslmode,
})

export const db = drizzle(pool, { schema, logger: true })