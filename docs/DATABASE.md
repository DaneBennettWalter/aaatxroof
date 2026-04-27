# Database Layer

The app uses a **repository pattern** so we can swap storage backends
without rewriting routes, admin pages, or business logic.

```
                ┌─────────────────────────────────────┐
                │ app/api/* + app/admin/* + lib/*     │
                │ (consumers — never touch storage)   │
                └────────────────┬────────────────────┘
                                 │
                          getLeadRepo()
                       getAppointmentRepo()
                                 │
                ┌────────────────┴────────────────────┐
                │   LeadRepo / AppointmentRepo        │
                │   (interfaces in lib/db/types.ts)   │
                └────────────────┬────────────────────┘
                                 │
            ┌────────────────────┴────────────────────┐
            │                                         │
   ┌────────▼────────┐                       ┌────────▼────────┐
   │ JSONL adapter   │                       │ Postgres adapter│
   │ (default)       │                       │ (DATABASE_URL)  │
   │ data/*.jsonl    │                       │ Drizzle ORM     │
   └─────────────────┘                       └─────────────────┘
```

## Layout

```
lib/db/
├── index.ts                          Public API + adapter selection
├── types.ts                          LeadRepo / AppointmentRepo interfaces
├── schema.ts                         Drizzle schema (Postgres-bound)
└── adapters/
    ├── jsonl/
    │   ├── leads.ts                  JsonlLeadRepo
    │   ├── appointments.ts           JsonlAppointmentRepo
    │   └── shared.ts                 file locking + atomic writes
    └── postgres/
        ├── leads.ts                  PostgresLeadRepo (stub)
        ├── appointments.ts           PostgresAppointmentRepo (stub)
        └── client.ts                 Drizzle client (stub)
```

## Adapter selection

```ts
// lib/db/index.ts
function selectedAdapter() {
  if (process.env.DB_ADAPTER === "jsonl") return "jsonl";
  if (process.env.DB_ADAPTER === "postgres") return "postgres";
  return process.env.DATABASE_URL ? "postgres" : "jsonl";
}
```

- **No env set** → JSONL (default; appropriate for early production).
- **`DATABASE_URL` set** → Postgres adapter is selected (currently throws
  until wired — see *Phase 2* below).
- **`DB_ADAPTER=jsonl|postgres`** → manual override (useful in tests).

## Phase 1 — JSONL adapter (current)

### What it does

- Appends one JSON line per record to `data/leads.jsonl` and
  `data/appointments.jsonl`.
- Reads on every request — no in-process cache, so concurrent Next.js
  workers always see the latest data.
- Wraps every multi-step operation (read → mutate → write) in an
  exclusive lock via [`proper-lockfile`].
- Status updates use a temp-file + `rename()` for atomic replacement, so
  a crash mid-write can't leave a half-written file.
- Append + status-update operations serialize through the same lock.

### Concurrency guarantees

| Scenario                              | Old behavior              | New behavior        |
| ------------------------------------- | ------------------------- | ------------------- |
| 50 simultaneous lead intakes          | Possible interleave/loss  | All 50 land cleanly |
| Status update during another append   | Last-writer-wins (corrupt)| Serialized          |
| Crash during status update            | Truncated/empty file      | Old file preserved  |
| Stale lock from a crashed process     | Manual cleanup            | Auto-released @ 10s |

A smoke test exercising these scenarios lives at
`scripts/verify-db.mts`. Run it with `npx tsx scripts/verify-db.mts`.

### Limits

- Local-disk only. Won't survive moving to a multi-node deployment
  (Vercel serverless, Fly.io with multiple instances, etc.).
- Rewriting on every status update is `O(n)` in file size. Fine for
  tens of thousands of rows, then time to migrate.
- No indexes, no transactional reads-for-display.

### When to migrate

Migrate to Postgres when *any* of:

- We want multiple Next.js instances behind a load balancer.
- Lead/appointment volume grows past ~50K rows.
- We need richer queries (status counts by week, attribution, etc.).
- We want managed backups instead of file backups.

## Phase 2 — Postgres adapter (ready to wire)

Postgres pieces are scaffolded but stubbed; every method throws

> `Postgres adapter not configured. Set DATABASE_URL and follow docs/DATABASE.md.`

### 1. Pick a provider

| Provider     | Free tier              | Notes                                     |
| ------------ | ---------------------- | ----------------------------------------- |
| **Neon**     | 0.5 GB, 191 hrs/mo     | Serverless Postgres, fits Vercel best     |
| **Supabase** | 500 MB, 2 free projects| Postgres + auth + storage                 |
| **Railway**  | $5 trial credit/mo     | Simplest control plane                    |
| **Fly.io**   | Pay-as-you-go          | Best if we're already on Fly              |

For aaatxroof.com today: **Neon** is the recommendation — pure Postgres,
no lock-in, generous free tier, scales to zero when idle.

### 2. Set `DATABASE_URL`

Connection-string format:

```
postgres://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require
```

Drop it in `.env.local` (development) and Vercel/Fly secrets
(production). The adapter selector picks Postgres automatically.

### 3. Generate and apply migrations

`drizzle.config.ts` doesn't exist yet — create it at the repo root:

```ts
// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config;
```

Then:

```bash
npx drizzle-kit generate     # writes ./drizzle/0000_*.sql
npx drizzle-kit migrate      # applies to DATABASE_URL
```

### 4. Add the partial-unique slot index

Drizzle-kit doesn't model partial-unique natively. Add a manual SQL
migration after `0000_*.sql`:

```sql
-- drizzle/0001_appointments_active_slot_uq.sql
CREATE UNIQUE INDEX appointments_active_slot_uq
  ON appointments (scheduled_for)
  WHERE status = 'scheduled';
```

That index enforces "one active appointment per slot" at the DB level —
no application-side race possible.

### 5. Wire `getDb()`

In `lib/db/adapters/postgres/client.ts`, replace the throw with:

```ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../schema";

let cached: AppDb | null = null;

export function getDb(): AppDb {
  if (cached) return cached;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  cached = drizzle(pool, { schema });
  return cached;
}
```

### 6. Implement the repo methods

`PostgresLeadRepo` and `PostgresAppointmentRepo` already have the query
shapes sketched in comments. Fill them in using `db`, `eq`, `and`,
`desc`, `count` from `drizzle-orm`. Return rows mapped through helpers
that re-shape DB rows into the canonical `Lead` / `Appointment` types
(notably: serialize `Date` → ISO string for `createdAt` /
`scheduledFor`, and pass `services` through unchanged from `jsonb`).

### 7. Backfill data (one-time)

A small script reads `data/*.jsonl` and inserts into Postgres — outline:

```ts
// scripts/backfill-jsonl-to-postgres.mts
import { readJsonl } from "../lib/db/adapters/jsonl/shared";
import path from "node:path";
import { getDb } from "../lib/db/adapters/postgres/client";
import * as schema from "../lib/db/schema";

const leads = await readJsonl(path.join("data", "leads.jsonl"));
const appts = await readJsonl(path.join("data", "appointments.jsonl"));
const db = getDb();

for (const l of leads) {
  await db.insert(schema.leads).values({
    ...l,
    createdAt: new Date(l.createdAt),
  }).onConflictDoNothing();
}
for (const a of appts) {
  await db.insert(schema.appointments).values({
    ...a,
    createdAt: new Date(a.createdAt),
    scheduledFor: new Date(a.scheduledFor),
  }).onConflictDoNothing();
}
```

### 8. Switch over

1. Set `DATABASE_URL` in production.
2. Keep `DB_ADAPTER=jsonl` in env until backfill verified.
3. Run backfill against production DB.
4. Diff row counts: `wc -l data/*.jsonl` vs `SELECT count(*) FROM …`.
5. Drop `DB_ADAPTER`. Postgres takes over on next deploy.
6. Archive `data/*.jsonl` somewhere safe (Backblaze, S3, repo `archive/`).

### 9. Verify

- POST `/api/leads` writes into Postgres.
- POST `/api/appointments` writes + collision detection works.
- GET `/api/appointments/availability` reflects DB-booked slots.
- PATCH endpoints update statuses.
- `/admin` dashboard shows correct counts.

[`proper-lockfile`]: https://github.com/moxystudio/node-proper-lockfile
