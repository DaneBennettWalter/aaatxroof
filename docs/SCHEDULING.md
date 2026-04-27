# Inspection Scheduling

Self-serve booking flow for free roof inspections. Customers pick a day, pick a
time, fill in their details, and we save the appointment. Phase 1 — JSONL on
disk, no calendar sync, no notifications. Built to swap for a real DB and
calendar provider later without rewriting the UI.

## Routes

| Path                                  | Method | Purpose                                                 |
| ------------------------------------- | ------ | ------------------------------------------------------- |
| `/schedule`                           | GET    | Customer-facing scheduling page (server component)      |
| `/api/appointments/availability`      | GET    | Returns available 1-hour slots for the next 14 days     |
| `/api/appointments`                   | POST   | Books a new appointment                                 |

## Business hours

All times are **America/Chicago** (Central Time).

| Day        | Window               | Slots / day |
| ---------- | -------------------- | ----------- |
| Mon – Fri  | 8:00 AM – 5:00 PM    | 9           |
| Saturday   | 9:00 AM – 2:00 PM    | 5           |
| Sunday     | Closed               | 0           |

Slots are 1 hour. Last slot of the day starts at the end-hour minus 1
(e.g. last weekday slot starts at 4:00 PM and runs to 5:00 PM).

Edit `windowForDayOfWeek()` in `lib/availability.ts` to change hours.

## Files

```
lib/
  types/appointments.ts     ← appointment types (re-exported from lib/types.ts)
  availability.ts           ← slot generation + slot validation (no deps on fs)
  appointments-store.ts     ← JSONL read/write helpers (server only)
app/
  (site)/schedule/page.tsx  ← public scheduling page
  api/appointments/
    route.ts                ← POST: create appointment
    availability/route.ts   ← GET: list available slots
components/sections/scheduler.tsx   ← 3-step UI (pick slot → details → confirm)
data/
  appointments.jsonl        ← JSONL store (gitignored)
```

## Page placement

The page lives at `app/(site)/schedule/page.tsx` so it inherits the public site
header and footer. The route still resolves at `/schedule` because `(site)` is
a Next.js route group.

## Data shape

```ts
interface Appointment {
  id: string;
  createdAt: string;     // ISO timestamp
  scheduledFor: string;  // ISO timestamp (UTC)
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  inspectionType: "residential" | "commercial" | "storm-damage" | "insurance";
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
}
```

Stored one JSON object per line in `data/appointments.jsonl`. New rows are
appended; existing rows are never rewritten (status changes happen via the
admin layer, not this module).

## Validation

Server-side, every booking goes through:

1. **Zod schema** — validates name, phone, email, address, inspection type,
   notes length.
2. **`isValidSlotInstant`** — confirms the requested timestamp is a real slot
   on a business day, in the future, within the 14-day window.
3. **`getBookedSlotSet`** — re-reads the store and rejects with HTTP 409 if
   the slot was just taken.

Client-side validation mirrors the same Zod schema for instant feedback.

## Concurrency

JSONL append is atomic per line on Linux ext4, so two writers never tear a
record. Two writers *can* still both see an empty slot and both succeed — the
window is microseconds. For Phase 1 traffic that's acceptable. When we move to
a real DB, do this in a transaction or with a unique constraint on
`scheduledFor`.

## Timezone handling

Slot generation and validation are timezone-aware via `Intl.DateTimeFormat`,
no extra dependency. DST transitions are handled by iterating once on the
offset (see `instantForLocal` in `lib/availability.ts`). This keeps us off
`tzdata` libraries until we genuinely need recurring rules.

## Testing manually

```bash
npm run dev

# Get available slots
curl http://localhost:3000/api/appointments/availability | jq '.days[0]'

# Book one
curl -X POST http://localhost:3000/api/appointments \
  -H 'Content-Type: application/json' \
  -d '{
    "scheduledFor":"2026-04-27T13:00:00.000Z",
    "customerName":"Jane Doe",
    "customerPhone":"512-555-1234",
    "customerEmail":"jane@example.com",
    "address":"123 Main St, Austin TX",
    "inspectionType":"residential",
    "notes":"Test"
  }'

# Confirm it's gone from availability
curl http://localhost:3000/api/appointments/availability | jq '.days[0].slots'
```

## Future work

- Email/SMS confirmation (Twilio + Resend)
- Calendar sync (Google Calendar via service account)
- Admin reschedule / cancel UI (status updates live in `app/admin/`)
- Buffer time / travel time between appointments
- Block-out dates (holidays, time off)
- Move from JSONL to Postgres or SQLite — keep the same `Appointment` type so
  callers don't change.

## Hero CTA

The homepage Hero now has a "Schedule Free Inspection" button linking to
`/schedule`. It sits between the "Get Free Quote" dialog and the phone CTA.
