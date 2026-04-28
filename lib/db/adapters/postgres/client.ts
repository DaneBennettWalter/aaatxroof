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
let migrationPromise: Promise<void> | null = null;

export async function getDb(): Promise<AppDb> {
  if (cached && !migrationPromise) return cached;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable not set. Postgres adapter requires a database connection string.",
    );
  }

  // Create postgres.js client (serverless-optimized)
  if (!cached) {
    const client = postgres(connectionString, {
      ssl: "require",
      max: 1, // Serverless: one connection per function instance
      idle_timeout: 20,
      connect_timeout: 10,
    });
    cached = drizzle(client, { schema });
  }

  // Run migration synchronously on first connection
  if (!migrationPromise) {
    migrationPromise = ensureSchema(cached);
    await migrationPromise;
    migrationPromise = null; // Clear after completion
  }

  return cached;
}

export { schema };
