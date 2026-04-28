# AAA Texas Roofing - Site Audit
**Date:** 2026-04-27  
**Auditor:** Roan  
**Build:** a84a8fc

---

## 🐛 Critical Bugs (Blocking Core Function)

### 1. Scheduler: "Could not load times"
- **Path:** /schedule
- **Error:** Availability API failing → `/api/appointments/availability` returns 500
- **Impact:** Cannot book appointments (critical user path)
- **Root cause:** Database migration or connection issue
- **Fix needed:** Debug Postgres adapter connection

### 2. Quote Form (untested)
- **Path:** Homepage → "Get Free Quote" button
- **Status:** Unknown - needs manual test
- **Expected:** Opens modal, submits to `/api/leads`
- **Verify:** Submission saves to database, appears in `/admin`

---

## 🔍 Functional Audit (Click-by-Click)

### Homepage (/)
- [ ] Hero loads
- [ ] "Get Free Quote" button opens modal
- [ ] "Schedule Free Inspection" link goes to /schedule
- [ ] "Call Now" phone link works
- [ ] Service cards clickable → go to service detail pages
- [ ] Recent Projects visible
- [ ] CTA section functional

### Services (/services)
- [ ] All 6 service cards load
- [ ] Click each card → goes to detail page
- [ ] Detail pages render correctly

### Individual Service Pages (/services/[slug])
Test each:
- [ ] /services/residential
- [ ] /services/commercial
- [ ] /services/storm-damage
- [ ] /services/inspections
- [ ] /services/insurance-claims
- [ ] /services/repairs

### Projects (/projects)
- [ ] Filter chips work (all, residential, commercial, etc.)
- [ ] Project cards clickable
- [ ] Lightbox modal opens with project details
- [ ] Close button works

### Blog (/blog)
- [ ] Blog index loads
- [ ] Article cards clickable
- [ ] Individual articles render
- [ ] Test 3-5 sample articles

### Schedule (/schedule)
- [ ] **BROKEN:** Cannot load times
- [ ] Calendar view (when fixed)
- [ ] Time slot selection (when fixed)
- [ ] Form submission (when fixed)

### Contact (/contact)
- [ ] Page loads
- [ ] Quote form functional
- [ ] Form validation works
- [ ] Submission saves to database

### Admin (/admin)
- [ ] Login page loads
- [ ] Correct password accepts
- [ ] Incorrect password rejects
- [ ] Leads dashboard loads
- [ ] Appointments dashboard loads
- [ ] Individual lead detail pages
- [ ] Individual appointment detail pages
- [ ] Status updates work
- [ ] CSV export works

---

## 🎨 UX/Design Issues

### Overuse of Stock Images
- Service cards: may not need full images (icons + subtle backgrounds could work)
- Homepage: too many competing visual elements
- Projects section: appropriate use (portfolio needs images)

### Design Feels Stale
**Symptoms:**
- Generic color palette (blue + orange is safe but common)
- Stock photo aesthetic (Unsplash sameness)
- Layout follows Bootstrap patterns (predictable, not distinctive)
- No unique brand personality

**What's missing:**
- Memorable visual hook (logo, custom illustration, unique layout)
- Texas-specific character (feels like it could be anywhere)
- Professionalism without blandness
- Trust signals that don't look like template content

---

## 🎯 Proposed UX Redesign: Two-Option Close Funnel

### Current Flow (Problematic)
Homepage → Overwhelm (Hero, Services, Projects, CTA, Forms, etc.)

### Proposed Flow (Focused)
```
Landing
  ↓
┌─────────────────────────────────┐
│  What kind of property?         │
│                                 │
│  [Commercial]  [Residential]    │  ← Big, clear buttons
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  How can we help?               │
│                                 │
│  [Call Now]  [Schedule]         │  ← Action-focused
└─────────────────────────────────┘
  ↓
Execution (phone call or scheduler)
```

**Benefits:**
- Reduces decision paralysis
- Guides user to action
- Segments traffic (commercial vs residential)
- Two-option close = proven sales technique

**Implementation:**
- New hero/splash page (replaces current homepage)
- Property type selection sets context for everything downstream
- Call/Schedule buttons adapt based on property type
- Secondary nav for "About," "Projects," etc. (not primary path)

---

## 🛠 Immediate Action Items

1. **Fix scheduler bug** (blocks core function)
2. **Complete functional audit** (30-60 min manual testing)
3. **Decide on design direction:**
   - Option A: Iterate ourselves (design-focused sprint)
   - Option B: Hire designer (Dribbble, Upwork, 99designs)
   - Option C: Premium template as foundation (Tailwind UI, etc.)

---

## 💭 Design Direction Recommendation

**Honest assessment:** The current design is *competent but forgettable*. It won't hurt you, but it won't help you stand out. For a roofing company competing in Central Texas, you need:
- **Immediate trust** (insurance claims, storm damage = high stakes)
- **Local credibility** (Texas pride, community presence)
- **Professional polish** (not cheap, not flashy)

**My recommendation:**
1. **Short-term (this week):** Fix bugs, implement two-option funnel (clean UX wins)
2. **Medium-term (next 2 weeks):** Hire a designer for brand identity + homepage hero
   - Budget: $500-1500 for logo + homepage mockup
   - Platforms: Dribbble, Behance, Upwork
   - Brief: "Premium roofing brand, Central Texas, trust + competence"
3. **Long-term (ongoing):** Replace stock photos with real projects as they complete

**Why not DIY design sprint?**
- We can iterate layout/UX (that's code)
- Brand identity + visual design is a different skill
- A good designer will give you a foundation we can build on
- Faster than trial-and-error iterations

**Alternative:** If budget is tight, use a premium template (Tailwind UI Pro, $300) and adapt it. Better foundation than building from scratch.

---

**Your call. Want to:**
- A) Fix bugs + audit now, design later
- B) Fix bugs + audit + start designer search
- C) Fix bugs + implement two-option funnel first (validate UX before visual redesign)
