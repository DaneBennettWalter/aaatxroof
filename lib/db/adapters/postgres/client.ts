/**
 * Drizzle Postgres client (stub).
 *
 * Activated when `DATABASE_URL` is set. The actual `pg` Pool + drizzle
 * binding is intentionally lazy so that:
 *   1. Builds in environments without `DATABASE_URL` don't try to connect.
 *   2. The JSONL default path doesn't import `pg` at all.
 *
 * Wire-up checklist (when DB credentials become available):
 *   1. Set `DATABASE_URL` in env (Neon/Supabase/etc).
 *   2. Run `npx drizzle-kit generate && npx drizzle-kit migrate`.
 *   3. Replace the `getDb()` body below with the live pool.
 *   4. Remove the throw and the surrounding `// STUB` markers.
 *
 * See `docs/DATABASE.md` for full instructions.
 */

import * as schema from "../../schema";

// Drizzle types only — no runtime import yet to keep the bundle clean.
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export type AppDb = NodePgDatabase<typeof schema>;

// eslint-disable-next-line prefer-const -- becomes mutable when wired
let cached: AppDb | null = null;

export function getDb(): AppDb {
  if (cached) return cached;

  // STUB: actual implementation looks like:
  //
  //   const { Pool } = await import("pg");
  //   const { drizzle } = await import("drizzle-orm/node-postgres");
  //   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  //   cached = drizzle(pool, { schema });
  //   return cached;
  //
  // Left as a throw until DB credentials are wired and migrations applied.
  throw new Error(
    "Postgres adapter not configured. Set DATABASE_URL and follow docs/DATABASE.md.",
  );
}

export { schema };
