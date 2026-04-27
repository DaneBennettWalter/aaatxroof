# Marketing Pages

Public-facing marketing pages for aaatxroof.com. All pages live under
`app/(site)/` and inherit the `<Header />` + `<Footer />` layout from
`app/(site)/layout.tsx`.

## Pages

| Route | File | Type |
| --- | --- | --- |
| `/services` | `app/(site)/services/page.tsx` | Static |
| `/services/[slug]` | `app/(site)/services/[slug]/page.tsx` | SSG (6 slugs) |
| `/projects` | `app/(site)/projects/page.tsx` | Static |
| `/about` | `app/(site)/about/page.tsx` | Static |
| `/contact` | `app/(site)/contact/page.tsx` | Static |
| `/blog` | `app/(site)/blog/page.tsx` | Static |
| `/blog/[slug]` | `app/(site)/blog/[slug]/page.tsx` | SSG (5 posts) |

All pages export `metadata` (or `generateMetadata` for dynamic routes) with
title, description, and Open Graph tags. SEO sub-agent is responsible for
sitemap, robots, and structured data.

## Data layer

Marketing content lives in three plain-TS files under `lib/` so editing
copy never requires touching a page component.

| File | Owns |
| --- | --- |
| `lib/services-data.ts` | Service catalog (`SERVICES`), slugs, hero copy, included items, process steps, why-us bullets |
| `lib/projects-data.ts` | Sample project portfolio + filter categories |
| `lib/blog-data.ts` | Blog post catalog + body content |

> **Slug note:** marketing URL slugs use the SEO-friendly long form
> (`insurance-claims`, `inspections`). Internally, `lib/types.ts` uses the
> singular `ServiceType` (`insurance-claim`, `inspection`) for the lead
> form. The mapping is kept on each `ServiceContent.internalType` field.

## Dynamic routes

Both dynamic routes use `generateStaticParams` so all pages prerender at
build time:

- `/services/[slug]` — 6 slugs: `residential`, `commercial`,
  `storm-damage`, `inspections`, `insurance-claims`, `maintenance`
- `/blog/[slug]` — 5 posts (see `BLOG_SLUGS`)

`params` is an async `Promise` per Next.js 16 conventions.

## Components

New section components added in `components/sections/`:

- `projects-grid.tsx` — Client component. Filterable grid + lightbox for
  projects.

Existing section components reused on multiple pages:

- `<Hero />`, `<Services />`, `<CTA />`, `<QuoteFormDialog />`,
  `<Scheduler />`

## Images

All marketing imagery comes from Unsplash. `next.config.ts` allows
`images.unsplash.com` and `plus.unsplash.com` via `remotePatterns`. Images
are rendered with `next/image` (`fill` + `sizes`) for proper optimization.

> **Replace before launch:** project photography is sample/stock until
> real on-site photos are available. Note in `lib/projects-data.ts`.

## CTAs

Every marketing page includes at least one of:

- `<QuoteFormDialog>` — opens the multi-step quote form
- `Link href="/schedule"` — sends the user to the inspection scheduler
- `tel:` and `mailto:` direct contact links (contact page)

## Honesty rules followed

Per project guidelines:

- No fabricated reviews, testimonials, or customer quotes
- No fabricated stats (e.g., "500+ projects", "98% satisfaction") on
  marketing pages
- The original homepage hero stats were softened to honest trust
  indicators (Free quotes, 24/7 storm response, Insured, Local crews)
- Sample project content is clearly marked as representative in
  `lib/projects-data.ts` and on the projects page itself

## Other touch-ups (in scope)

- `components/layout/header.tsx` — wired the "Get Free Quote" header
  button to `<QuoteFormDialog>` (was previously a no-op `<Button>`)
- `components/layout/footer.tsx` — fixed broken
  `/services/insurance` link → `/services/insurance-claims`, added
  `/services/maintenance`

## Out of scope (other sub-agents)

- `app/sitemap.ts` / `app/robots.ts` — SEO sub-agent
- Structured data / JSON-LD — SEO sub-agent
- `lib/types.ts`, `lib/admin-data.ts`, `lib/appointments-store.ts`,
  data layer — Database sub-agent

## Build verification

```bash
cd ~/aaatxroof.com
npm run build
```

Should complete with all 24 routes compiled, including 6 statically
generated service detail pages and 5 statically generated blog posts.
