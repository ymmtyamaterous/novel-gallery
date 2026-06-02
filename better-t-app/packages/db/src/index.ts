import { env } from "@better-t-app/env/server";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as schema from "./schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createDb() {
  const client = createClient({
    url: env.DATABASE_URL,
  });

  return drizzle({ client, schema });
}

export const db = createDb();

export async function runMigrations() {
  const client = createClient({ url: env.DATABASE_URL });
  const migrationDb = drizzle({ client, schema });
  await migrate(migrationDb, {
    migrationsFolder: path.join(__dirname, "migrations"),
  });
  console.log("Migrations applied.");
}

export { schema };
