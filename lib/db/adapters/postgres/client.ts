/**
 * Drizzle Postgres client.
 *
 * Uses postgres.js for serverless compatibility (Vercel, edge functions).
 * Auto-runs migration on first connection if schema doesn't exist.
 */

import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../../schema";
import { ensureSchema } from "./migrate";

export type AppDb = PostgresJsDatabase<typeof schema>;

let cached: AppDb | null = null;
let migrationRun = false;

export function getDb(): AppDb {
  if (cached) return cached;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable not set. Postgres adapter requires a database connection string.",
    );
  }

  // Create postgres.js client (serverless-optimized)
  const client = postgres(connectionString, {
    ssl: { rejectUnauthorized: false }, // Required for Supabase/Neon
    max: 1, // Serverless: one connection per function instance
  });

  cached = drizzle(client, { schema });

  // Run migration on first connection (async, non-blocking)
  if (!migrationRun) {
    migrationRun = true;
    ensureSchema(cached).catch((err) => {
      console.error("[db/postgres] Auto-migration failed:", err);
    });
  }

  return cached;
}

export { schema };
