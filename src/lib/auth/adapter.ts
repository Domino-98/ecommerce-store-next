import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { sessionTable, userTable } from "../database/schema";
import { db } from "../database/db";

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export default adapter;