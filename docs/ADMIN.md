# Admin Dashboard

Internal-only dashboard for viewing and triaging captured leads and
appointments. Lives at `/admin` on the same Next.js app as the public
marketing site.

## What it does

- Overview at `/admin` — stats (leads this week, leads this month,
  conversion rate, upcoming appointments) plus the 5 most recent leads
  and the next 5 upcoming inspections.
- Leads view at `/admin/leads` — sortable table (newest first), filter
  by status / date range / free-text search, click a row for full
  detail at `/admin/leads/[id]`, change status inline, export the
  current filtered view to CSV.
- Appointments view at `/admin/appointments` — same shape as leads,
  with the extra ability to switch the date filter between
  "Scheduled for" (default) and "Created at".
- Detail pages let you walk a lead through `new → contacted → quoted →
  won / lost` and an appointment through `scheduled →
  completed / cancelled`. Status writes go through API routes and
  rewrite the JSONL file in place.

## Auth

Single shared password, set in `.env.local`:

```env
ADMIN_PASSWORD=pick-something-strong
# Optional but recommended in production:
ADMIN_SESSION_SECRET=long-random-string
```

- If `ADMIN_PASSWORD` is unset, `/admin` shows an "Admin disabled"
  notice and refuses to serve anything sensitive. This is intentional —
  no env, no admin.
- Sign in at `/admin/login`. On success we set an HTTP-only cookie
  (`aaatx_admin`) signed with HMAC-SHA256 using `ADMIN_SESSION_SECRET`
  (falling back to `ADMIN_PASSWORD` for dev). Cookie lives 12 hours.
- Sign out via the header link; that clears the cookie.
- The PATCH API routes also require the cookie, so the dashboard
  surface is the only way to mutate status.

This is deliberately lightweight. When we move off JSONL onto a real
DB we should also move auth onto a real provider (Auth.js / Clerk /
whatever) and probably IP-restrict the admin surface at the edge.

## Storage

We read/write two JSONL files under `./data/` at the project root:

- `data/leads.jsonl` — written by the intake form
  (`app/api/leads/route.ts`, append-only). Status is updated in place
  by the admin PATCH route.
- `data/appointments.jsonl` — written by the scheduling system
  (`lib/appointments-store.ts`). Same pattern.

Both files are gitignored (`data/.gitignore`). They're operational
data, not source.

The dashboard never caches. Each request re-reads the file. Files are
small enough that this is fine until we have thousands of records,
at which point we should be on Postgres anyway.

### Schema

Leads and appointments use the canonical types from `lib/types.ts` and
`lib/types/appointments.ts`. The admin dashboard never invents fields
— it only renders what those types expose:

- **Lead** — `id`, `createdAt`, `name`, `phone`, `address`, `email?`,
  `propertyType`, `propertyAge?`, `propertySize?`, `stories?`,
  `services[]`, `timeline`, `budget?`, `notes?`, `status`, `source?`.
- **Appointment** — `id`, `createdAt`, `scheduledFor`, `customerName`,
  `customerPhone`, `customerEmail`, `address`, `inspectionType`,
  `notes?`, `status`.

## API

Both endpoints require the `aaatx_admin` cookie.

```http
PATCH /api/leads/:id
Content-Type: application/json

{ "status": "new" | "contacted" | "quoted" | "won" | "lost" }
```

```http
PATCH /api/appointments/:id
Content-Type: application/json

{ "status": "scheduled" | "completed" | "cancelled" }
```

Responses:

- `200 { lead | appointment: {...} }` on success
- `400` — invalid JSON or status value
- `401` — not signed in
- `404` — record not found

## CSV export

Each list view has an "Export CSV" button. It exports the **filtered**
view, not the full file — so if you want only "new" leads from this
week, filter first, then export. CSV generation runs entirely in the
browser (`lib/csv.ts`).

## File map

```
app/admin/
  actions.ts                          # login / logout server actions
  login/page.tsx                      # password prompt
  (protected)/                        # everything inside requires auth
    layout.tsx                        # admin chrome + auth check
    page.tsx                          # /admin overview
    leads/
      page.tsx                        # /admin/leads (server)
      leads-view.tsx                  # client filter / table / CSV
      [id]/
        page.tsx                      # /admin/leads/[id]
        status-control.tsx            # PATCH /api/leads/:id
    appointments/
      page.tsx
      appointments-view.tsx
      [id]/
        page.tsx
        status-control.tsx

app/api/
  leads/[id]/route.ts                 # PATCH lead status
  appointments/[id]/route.ts          # PATCH appointment status

lib/
  admin-auth.ts                       # cookie + HMAC helpers
  admin-data.ts                       # JSONL read/write + stats (server)
  admin-constants.ts                  # status enums (client-safe)
  csv.ts                              # CSV helpers (client + server safe)
```

The split between `admin-data.ts` (server-only, imports `node:fs`) and
`admin-constants.ts` (client-safe re-export of the status enums) is
deliberate — without it Next.js pulls `node:fs` into the client bundle
and the build fails.

## Local dev

```bash
echo 'ADMIN_PASSWORD=devpass' >> .env.local
npm run dev
# open http://localhost:3000/admin → password gate
```

If `data/leads.jsonl` and `data/appointments.jsonl` don't exist yet,
the dashboard renders empty states instead of crashing.

## Future work

- Move storage to Postgres (Supabase or Neon per the spec) and ditch
  the JSONL rewrite-on-update pattern.
- Real auth (Auth.js or Clerk) with per-user accounts and audit log.
- Lead → appointment linking (currently independent — once leads have
  an explicit `appointmentIds[]` we can show "Book inspection" from
  the lead detail page).
- Activity timeline per lead (status changes, calls, notes).
- Bulk status updates from the table view.
