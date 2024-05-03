import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from './schema';
import config from "./config";

let sslmode = "";
if (config.APP_ENV === "prod") {
    sslmode = "?sslmode=require"
}

const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_URL + sslmode,
});

export const db = drizzle(pool, { schema, logger: true });
