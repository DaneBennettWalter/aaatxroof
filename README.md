# AAA Texas Roofing

**Market:** Central Texas (Austin to San Antonio corridor)  
**Positioning:** Best roofers in Central Texas — professional, trustworthy, premium

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** shadcn/ui + Tailwind CSS
- **TypeScript:** Full type safety
- **Deployment:** Vercel-ready

---

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
aaatxroof.com/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout (Header + Footer)
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles + Tailwind config
├── components/
│   ├── layout/            # Header, Footer, Container
│   ├── sections/          # Hero, Services, CTA, etc.
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities
└── public/                # Static assets
```

---

## Brand Colors (Texas Sky Palette)

- **Primary (Deep Blue):** `#1E3A5F` — Trust, stability
- **Secondary (Burnt Orange):** `#D97706` — Energy, warmth, Texas pride
- **Accent (Slate):** `#475569` — Neutral strength
- **Success (Roof Green):** `#059669` — Quality, completion
- **Neutral Light:** `#F8FAFC` — Backgrounds
- **Neutral Dark:** `#0F172A` — Text

See `~/aaatxroof-branding/BRAND_OPTIONS.md` for full palette details and alternatives.

---

## Design System

Built with **shadcn/ui** for professional, accessible components.

### Installed Components

- Button, Input, Card, Form, Label, Textarea
- Navigation Menu, Dropdown Menu
- Dialog, Alert, Badge

### Layout Components

- `<Container>` — Max-width wrapper with responsive padding
- `<Header>` — Sticky header with navigation + phone CTA
- `<Footer>` — 4-column footer with service links

### Section Components

- `<Hero>` — Homepage hero with CTA + trust indicators
- `<Services>` — 6 service cards grid
- `<CTA>` — Call-to-action section

---

## Next Steps

### Phase 2: Core Pages
- [ ] Services pages (individual service detail pages)
- [ ] Projects/portfolio section
- [ ] About page
- [ ] Contact page with quote form
- [ ] Lead capture API routes

### Phase 3: Content & CMS
- [ ] Headless CMS setup (Sanity or Payload)
- [ ] Blog structure
- [ ] Service area map
- [ ] Reviews system

### Phase 4: Polish & Launch
- [ ] Performance optimization (Lighthouse 95+)
- [ ] SEO (schema markup, meta tags, sitemap)
- [ ] Analytics setup (GA4, call tracking)
- [ ] Real logo + finalized branding
- [ ] Mobile testing
- [ ] Deploy to Vercel

### Phase 5: Post-Launch
- [ ] AI quote assistant
- [ ] Replace stock photos with real projects
- [ ] A/B testing
- [ ] CRM integration

---

## Environment Variables

Copy `.env.local.template` to `.env.local` and fill in values when ready.

---

## Deployment

This project is optimized for **Vercel**:

1. Push to GitHub
2. Import in Vercel
3. Deploy

Vercel automatically detects Next.js and configures build settings.

---

## Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

**Built by Roan 🦅**  
**Spec:** `~/aaatxroof-spec.md`  
**Branding:** `~/aaatxroof-branding/`
