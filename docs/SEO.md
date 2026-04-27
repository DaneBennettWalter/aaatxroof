# SEO

How search-engine and social-share metadata works on aaatxroof.com, and what
needs to be filled in before launch.

## What's set up

### Files

| File | Purpose |
| --- | --- |
| `app/sitemap.ts` | Dynamic XML sitemap served at `/sitemap.xml`. Lists `/`, `/schedule`, `/contact`, `/services`, `/services/[slug]` (× 6), `/projects`, `/about`, `/blog`. Priorities and `changefreq` are tuned per page type. |
| `app/robots.ts` | Robots policy at `/robots.txt`. Allows all user-agents, disallows `/admin` and `/api`, references the sitemap. |
| `app/manifest.ts` | PWA manifest at `/manifest.webmanifest`. Theme color `#1E3A5F`. Icon paths point to `/icons/*` (placeholders — see below). |
| `app/layout.tsx` | Root metadata: title template `"%s | AAA Texas Roofing"`, default title, description, OpenGraph, Twitter card, canonical, robots, viewport, preconnect hints, JSON-LD injection. |
| `lib/seo.ts` | Shared SEO constants (`SITE_URL`, `SITE_NAME`, `SERVICE_AREA_CITIES`, `SERVICE_SLUGS`, …) and the `pageMetadata()` helper for per-page metadata. |
| `components/seo/schema-markup.tsx` | JSON-LD `RoofingContractor` (LocalBusiness) + `WebSite` schemas, rendered globally from the root layout. |

### Verified behavior

- `npm run build` — clean, no warnings.
- `GET /robots.txt` — returns proper directives + sitemap pointer.
- `GET /sitemap.xml` — returns 13 URLs (7 static + 6 service pages).
- `GET /manifest.webmanifest` — valid PWA manifest.
- `GET /` — emits canonical, full OG/Twitter tags, theme color, and two JSON-LD blocks (RoofingContractor + WebSite).

## How to add metadata to a new page

Use the `pageMetadata()` helper from `lib/seo.ts`:

```ts
// app/(site)/about/page.tsx
import { pageMetadata, PAGE_DEFAULTS } from "@/lib/seo";

export const metadata = pageMetadata(PAGE_DEFAULTS.about);

export default function AboutPage() {
  return <main>...</main>;
}
```

Or with a custom override:

```ts
export const metadata = pageMetadata({
  title: "Storm Damage Repair in Austin",
  description: "Hail and wind damage repair across Central Texas...",
  path: "/services/storm-damage",
});
```

For dynamic routes:

```ts
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getService(slug); // your data fetcher
  return pageMetadata({
    title: service.title,
    description: service.shortDescription,
    path: `/services/${slug}`,
  });
}
```

## Configuration knobs

### Environment variables

| Var | Default | Used by |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://aaatxroof.com` | sitemap, robots, canonical, OG URLs, JSON-LD `@id`s |

Set this in production to the canonical URL. Local dev can leave it unset.

If we ever decide `aaatexasroof.com` is canonical instead, change this one
env var and everything downstream updates.

### Brand strings

All in `lib/seo.ts`:

- `SITE_NAME`, `SITE_TAGLINE`, `DEFAULT_TITLE`, `DEFAULT_DESCRIPTION`
- `KEYWORDS` — global keyword list, merged per page
- `SERVICE_AREA_CITIES` — also drives JSON-LD `areaServed`
- `SERVICE_SLUGS` — also drives sitemap entries

## Pre-launch checklist (must do)

These are placeholders / TODOs that **must** be replaced before going live.
Search the codebase for the markers below to find each one.

### 1. JSON-LD business profile (`components/seo/schema-markup.tsx`)

Replace these constants at the top of the file:

- `PLACEHOLDER_PHONE` → real business phone
- `PLACEHOLDER_STREET`, `PLACEHOLDER_CITY`, `PLACEHOLDER_REGION`, `PLACEHOLDER_POSTAL` → real registered address
- `PLACEHOLDER_LAT`, `PLACEHOLDER_LNG` → real coordinates of the office

Also update the `sameAs` array with real social profile URLs.

### 2. Aggregate rating (commented out)

Inside `LocalBusinessSchema()` there's a commented `aggregateRating` block.
**Do not enable it until we have real, verifiable reviews** (Google Business
Profile, BBB, etc.). Fabricating review counts is a hard no — it violates
Schema.org guidelines and will get the listing penalized.

### 3. Open Graph image

`/public/og-default.png` needs to be created. Spec:

- Size: 1200 × 630 px
- Format: PNG (or JPG)
- Content: Brand wordmark + tagline, on a deep navy `#1E3A5F` background
- Should look good when scaled down to thumbnail in Slack / iMessage previews

### 4. Logo

`/public/logo.png` is referenced by JSON-LD. Drop in the real brand logo
(square or near-square, transparent PNG, ≥ 512px on the long side).

### 5. PWA icons

`app/manifest.ts` references three icons under `/public/icons/`:

- `icon-192.png` — 192×192, any
- `icon-512.png` — 512×512, any
- `icon-maskable-512.png` — 512×512, maskable (safe area: inner 80%)

Plus optionally an `apple-touch-icon.png` (180×180). Uncomment the matching
lines in `app/layout.tsx#metadata.icons` once the assets exist.

Easiest path: generate from the master logo with
[realfavicongenerator.net](https://realfavicongenerator.net) or
[`@vercel/og`](https://vercel.com/docs/og-image-generation).

### 6. Search-console verification

In `app/layout.tsx`, the `verification` block is commented out. Once we
have:

- Google Search Console (`google-site-verification` token)
- Bing Webmaster Tools (`msvalidate.01` token)

…uncomment the block and paste the tokens in.

### 7. Twitter handle

Search for `TWITTER_HANDLE` in `lib/seo.ts` and `app/layout.tsx`. Once a
real Twitter/X account exists, uncomment the `creator` line in both
locations.

### 8. Canonical domain decision

Memory log notes both `aaatxroof.com` and `aaatexasroof.com` were
mentioned. Pick one as canonical, then:

- Set `NEXT_PUBLIC_SITE_URL` to that domain
- Configure the other domain to 301 → canonical (DNS / hosting layer)

## Performance hints

`app/layout.tsx` includes `<link rel="preconnect">` for `fonts.googleapis.com`
and `fonts.gstatic.com`. `next/font` already handles this, but the explicit
hints help any later additions (Maps, Analytics, Tag Manager, etc.) warm up
the same connection.

If you add third-party scripts, prefer `next/script` with `strategy="lazyOnload"`
or `"afterInteractive"` to keep LCP healthy.

## Notes for the marketing sub-agent

When you build out `/services`, `/services/[slug]`, `/projects`, `/about`,
`/contact`, and `/blog`:

- Use `pageMetadata()` from `lib/seo.ts` to set per-page metadata. Don't
  duplicate the shape inline — the helper keeps OG, Twitter, canonical, and
  robots aligned automatically.
- If you add or remove a service slug, update `SERVICE_SLUGS` in
  `lib/seo.ts` (and `ServiceType` in `lib/types.ts`). The sitemap reads
  from `SERVICE_SLUGS`, so anything not listed there won't be crawled.
- Hero images: use `next/image` with explicit `width`/`height` and
  `priority` for above-the-fold images. This is critical for LCP on
  mobile — the conversion path lives or dies on it.

## Notes for the database sub-agent

- Don't import from `lib/seo.ts` in the data layer; SEO is presentation
  concern. The dependency direction is one-way: pages → `lib/seo.ts`,
  pages → data layer.
