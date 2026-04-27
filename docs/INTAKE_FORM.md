# Intake Form (Quote Form)

Customer-facing multi-step quote form for aaatxroof.com.

## Goals

- **Feel like Uber, not a loan app.** Show value fast (3 fields → forward).
- **Mobile-first.** Tap targets, no cramped inputs, smooth step transitions.
- **Validated per step.** Don't dump errors at the end.
- **Always a path forward.** Phone CTA is visible even on success.

## File map

| File                                            | What it is                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| `components/sections/quote-form.tsx`            | Multi-step form + dialog wrapper (`QuoteForm`, `QuoteFormDialog`). |
| `app/api/leads/route.ts`                        | `POST /api/leads` — validates and persists submissions.             |
| `lib/types.ts`                                  | `Lead` type + service/timeline/budget label maps.                   |
| `data/leads.jsonl`                              | Append-only JSONL store (gitignored). Created on first submit.      |

## Steps

1. **Get started** — name, phone, address (required), email (optional).
2. **Property** — type (residential/commercial, required), age, size, stories.
3. **Services** — multi-select from 6 service types (≥1 required).
4. **Details** — timeline (required), budget (optional), notes (optional).

After submit, a success state thanks the user and offers a phone CTA + a Done
button. Storm damage / emergency callers are nudged to call the 24/7 line.

## Components

### `<QuoteForm onSuccess?={...} />`

The bare form. Use this when you want to embed the form inside a page or
custom container (no dialog).

```tsx
import { QuoteForm } from "@/components/sections/quote-form";

<QuoteForm onSuccess={() => router.push("/thanks")} />;
```

### `<QuoteFormDialog>`

Drop-in CTA button that opens the form in a modal dialog. Use this for
homepage CTAs and section CTAs.

```tsx
import { QuoteFormDialog } from "@/components/sections/quote-form";

<QuoteFormDialog triggerClassName="text-lg px-8 h-12">
  Get Free Quote
  <ArrowRight className="ml-2 h-5 w-5" />
</QuoteFormDialog>;
```

Props:

- `triggerClassName?: string` — class on the trigger button.
- `triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"` — defaults to `"secondary"` (burnt orange).
- `triggerSize?: "default" | "sm" | "lg" | "xs"` — defaults to `"lg"`.
- `children: ReactNode` — trigger button content (label + icons).

## API

### `POST /api/leads`

**Request body** (JSON):

```json
{
  "name": "Jane Doe",
  "phone": "(555) 555-5555",
  "address": "123 Main St, Austin, TX",
  "email": "jane@example.com",            // optional
  "propertyType": "residential",          // | "commercial"
  "propertyAge": "5-15",                  // optional
  "propertySize": "2400 sqft",            // optional
  "stories": "2",                         // optional
  "services": ["storm-damage", "insurance-claim"],
  "timeline": "1-2-weeks",                // | "emergency" | "1-3-months" | "flexible"
  "budget": "15k-30k",                    // optional
  "notes": "Hail from last week's storm." // optional
}
```

**Responses:**

- `201 Created` — `{ ok: true, id: "<uuid>" }`
- `400 Bad Request` — `{ ok: false, error: "...", issues?: [...] }`
- `500 Internal Server Error` — `{ ok: false, error: "Failed to save lead" }`

The route writes a one-line JSON entry to `./data/leads.jsonl`. Each line is
a complete `Lead` object (see `lib/types.ts`), including server-assigned
`id`, `createdAt`, `status: "new"`, and `source: "web-quote-form"`.

### Validation

Both client and server use Zod. The server schema is the source of truth and
re-validates everything (do not trust the client). Phone is regex-checked
(digits, spaces, `+()-.`); name/address have length floors.

## Storage (v1)

Append-only JSONL at `data/leads.jsonl`. Why:

- Zero-config — no DB to provision.
- Append-only is crash-safe — concurrent appends are atomic for short writes
  on POSIX.
- Trivial to migrate later: `cat data/leads.jsonl | jq -s . > leads.json`,
  then bulk-import to a real datastore.

`/data` is gitignored. Do not check in lead data.

**When to upgrade:** the moment we want indexing, search, or multi-instance
deploys. Likely candidates: Postgres (Vercel Postgres / Neon) or Supabase.
Replace the body of `appendLead()` in `app/api/leads/route.ts`.

## Adding it to a page

The homepage hero and bottom CTA already use `QuoteFormDialog`. To add
elsewhere:

```tsx
<QuoteFormDialog triggerVariant="default">Request a Quote</QuoteFormDialog>
```

## Behavior notes

- **Step 1 doesn't ask for email.** Email is optional everywhere — phone is
  the canonical contact. Don't add email to the required list without
  explicit product input.
- **Services step** is a tap-to-toggle grid (multi-select); the rest of the
  optional choice fields are tap-to-toggle (single-select with deselect).
- **Validation runs per step** before advancing (`trigger(stepFields)`).
  Final submit re-validates everything via Zod resolver.
- **Phone link** in the success state uses `tel:+15555555555` — update to
  the real number before launch.

## Testing locally

```bash
npm run dev
# open http://localhost:3000, click "Get Free Quote"
# fill out the form, submit
cat data/leads.jsonl
```

## Future work (out of scope for v1)

- Email/SMS notifications on new lead (Twilio / Resend).
- Replace JSONL with a real datastore.
- Address autocomplete (Google Places).
- File upload for photos of damage (storm claims especially).
- A/B test step order and copy.
