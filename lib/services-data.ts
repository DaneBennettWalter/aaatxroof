/**
 * Marketing service catalog.
 *
 * Single source of truth for the public-facing /services hub and
 * /services/[slug] detail pages. Keep this file edits-friendly:
 * if you want to change a heading, bullet, or image, do it here.
 *
 * URL slugs intentionally use the SEO-friendly long form
 * ("insurance-claims", "inspections") rather than the internal
 * `ServiceType` enum used by the lead form (which uses singulars
 * like "insurance-claim", "inspection"). The two are mapped in
 * `INTERNAL_SERVICE_TYPE` below.
 */

import type { ServiceType } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  Building2,
  CloudRain,
  ClipboardCheck,
  FileText,
  Wrench,
} from "lucide-react";

export type ServiceSlug =
  | "residential"
  | "commercial"
  | "storm-damage"
  | "inspections"
  | "insurance-claims"
  | "maintenance";

export interface ServiceContent {
  slug: ServiceSlug;
  /** Internal lead-form service type (for prefilling, etc.) */
  internalType: ServiceType;
  title: string;
  /** Short label for navigation/cards */
  shortTitle: string;
  /** One-line teaser used on the services hub */
  teaser: string;
  /** 1–2 sentence intro at the top of the detail page */
  intro: string;
  /** Lucide icon used in cards & section headings */
  icon: LucideIcon;
  /** Hero/portfolio image. All Unsplash so we have remote pattern coverage. */
  heroImage: {
    src: string;
    alt: string;
  };
  /** Detail-page body paragraphs */
  description: string[];
  /** "What's included" bullets — concrete deliverables */
  included: string[];
  /** "Our process" steps */
  process: { title: string; body: string }[];
  /** "Why choose us" reasons specific to this service */
  whyUs: string[];
  /** SEO description override (under 160 chars) */
  metaDescription: string;
}

export const SERVICES: ServiceContent[] = [
  {
    slug: "residential",
    internalType: "residential",
    title: "Residential Roofing",
    shortTitle: "Residential",
    teaser:
      "New installations, replacements, and repairs for homes across Central Texas.",
    intro:
      "From a single shingle replacement to a full tear-off and reroof, we handle residential roofing for homeowners throughout the Austin–San Antonio corridor.",
    icon: Home,
    heroImage: {
      src: "https://images.unsplash.com/photo-1632759145355-8b8f4f9f8a2f?auto=format&fit=crop&w=1600&q=80",
      alt: "Residential home with new asphalt shingle roof",
    },
    description: [
      "Your roof is the single most important system protecting your home. We approach every residential project with that in mind — clean job sites, careful homes, honest estimates, and craftsmanship built to outlast Texas weather.",
      "Whether you need a leak diagnosed and repaired, a few shingles replaced after a storm, or a full roof replacement, our crews work with the materials best suited for Central Texas heat, hail, and humidity.",
    ],
    included: [
      "Free on-site inspection and written estimate",
      "Asphalt, metal, tile, and synthetic options",
      "Tear-off, decking inspection, and underlayment replacement",
      "Drip edge, flashing, and ventilation upgrades as needed",
      "Manufacturer-backed material warranty",
      "Workmanship warranty on every install",
      "Full debris removal and magnetic nail sweep",
    ],
    process: [
      {
        title: "Free inspection",
        body: "We walk the roof, document conditions with photos, and explain exactly what we find — no scare tactics.",
      },
      {
        title: "Clear written estimate",
        body: "Itemized scope, materials, and timeline. You see what you're paying for before anything starts.",
      },
      {
        title: "Schedule the work",
        body: "We pick a day that works for your schedule and the weather window.",
      },
      {
        title: "Install with care",
        body: "Tarps over landscaping, daily cleanup, and a final walkthrough so you sign off on the work — not just an invoice.",
      },
    ],
    whyUs: [
      "Local crews who know Central Texas building codes and climate",
      "Material options matched to your home's style and budget",
      "Insurance-claim experience if hail or wind is involved",
      "Direct line to the project lead, not a call center",
    ],
    metaDescription:
      "Residential roofing in Central Texas — new roofs, replacements, and repairs. Asphalt, metal, and tile. Free inspections and clear estimates.",
  },
  {
    slug: "commercial",
    internalType: "commercial",
    title: "Commercial Roofing",
    shortTitle: "Commercial",
    teaser:
      "Practical, durable roofing for offices, retail, warehouses, and multifamily.",
    intro:
      "Commercial roofs have to keep working — through tenants, deliveries, and Texas summers. We deliver low-disruption installs and maintenance plans that protect both the building and the operation inside it.",
    icon: Building2,
    heroImage: {
      src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
      alt: "Modern commercial building with flat roof",
    },
    description: [
      "We work with property managers, business owners, and general contractors on flat, low-slope, and standing-seam metal commercial roofing across the Austin–San Antonio corridor.",
      "Our crews schedule around your operations — early mornings, weekends, or phased work — to keep tenants and customers moving while the work gets done.",
    ],
    included: [
      "TPO, PVC, EPDM, modified bitumen, and metal systems",
      "Re-roofs, recovers, and full tear-offs",
      "Detailed scope-of-work documentation for ownership and lenders",
      "Coordination with property management and tenants",
      "Roof drains, scuppers, and HVAC curb flashing",
      "Annual maintenance plans available",
    ],
    process: [
      {
        title: "Site assessment",
        body: "We measure, photograph, and document the existing system, including penetrations and trouble spots.",
      },
      {
        title: "Engineered proposal",
        body: "Material spec, warranty options, and a phased schedule designed around your operating hours.",
      },
      {
        title: "Coordinated install",
        body: "Crews stage work to minimize disruption — including after-hours work where it makes sense.",
      },
      {
        title: "Documented closeout",
        body: "Final inspection report, manufacturer warranty registration, and a maintenance schedule.",
      },
    ],
    whyUs: [
      "Experience with single-ply, built-up, and metal systems",
      "Low-disruption scheduling for occupied buildings",
      "Documentation that satisfies ownership, lenders, and insurers",
      "Maintenance programs that extend roof life year over year",
    ],
    metaDescription:
      "Commercial roofing in Central Texas — TPO, PVC, EPDM, and metal systems for offices, retail, and warehouses. Low-disruption installs and maintenance plans.",
  },
  {
    slug: "storm-damage",
    internalType: "storm-damage",
    title: "Storm Damage Repair",
    shortTitle: "Storm Damage",
    teaser:
      "Fast response after wind, hail, and severe weather. Tarp, document, and rebuild.",
    intro:
      "Texas storms don't wait, and neither do we. From emergency tarping to full storm-damage rebuilds, we move fast — and we document everything for your insurance claim.",
    icon: CloudRain,
    heroImage: {
      src: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&w=1600&q=80",
      alt: "Damaged roof after a severe storm",
    },
    description: [
      "When wind, hail, or a fallen tree opens up your roof, every hour matters. Water that gets past the deck turns into drywall damage, mold, and ruined insulation. The first job is to stop the bleeding.",
      "We respond quickly to storm calls, tarp exposed areas, and put together the full damage documentation you'll need for an insurance claim — then we handle the repair or rebuild from there.",
    ],
    included: [
      "Emergency tarping to prevent further water damage",
      "Detailed photo and measurement documentation",
      "Damage report formatted for insurance carriers",
      "Coordination with your adjuster on-site",
      "Shingle, decking, flashing, and gutter repairs",
      "Full roof replacement when damage exceeds repair threshold",
    ],
    process: [
      {
        title: "Emergency response",
        body: "Tarp the roof, dry the interior where we can, and stop additional damage.",
      },
      {
        title: "Document everything",
        body: "Photos, measurements, and a written report sized to fit your insurance claim.",
      },
      {
        title: "Meet the adjuster",
        body: "We can be on-site when your adjuster inspects, so nothing important gets missed.",
      },
      {
        title: "Repair or rebuild",
        body: "Once the claim is approved, we schedule the work and finish the job.",
      },
    ],
    whyUs: [
      "Quick response across the Austin–San Antonio corridor",
      "Documentation built for insurance carriers, not just contractors",
      "Crews experienced with wind, hail, and impact damage",
      "We work directly with your adjuster — you don't have to translate",
    ],
    metaDescription:
      "Storm damage roof repair in Central Texas. Emergency tarping, full documentation, and direct coordination with your insurance adjuster.",
  },
  {
    slug: "inspections",
    internalType: "inspection",
    title: "Roof Inspections",
    shortTitle: "Inspections",
    teaser:
      "Honest, photo-documented inspections — for buying, selling, or just peace of mind.",
    intro:
      "A roof inspection is the cheapest insurance you can buy. We walk the roof, document everything, and tell you the truth about what we find — even when the answer is \"it's fine, leave it alone.\"",
    icon: ClipboardCheck,
    heroImage: {
      src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
      alt: "Roofer inspecting a residential roof",
    },
    description: [
      "Inspections are useful before a hailstorm goes to claim, before closing on a home, before a major weather season, or just to know where you actually stand. We show up, walk the roof, and send you a written report with photos.",
      "If repairs are needed, we'll tell you exactly what they are and what they should cost. If they aren't, we'll tell you that too.",
    ],
    included: [
      "Full walk of accessible roof surfaces",
      "Photo documentation of every concern",
      "Flashing, penetrations, and drainage check",
      "Attic ventilation and visible decking review",
      "Written report delivered same week",
      "Repair estimate (if needed) — separate from the inspection",
    ],
    process: [
      {
        title: "Schedule the visit",
        body: "Pick a time on our scheduler and we'll confirm with you the day before.",
      },
      {
        title: "On-site walk",
        body: "An inspector walks the roof, takes photos, and notes any problem areas.",
      },
      {
        title: "Written report",
        body: "You get a PDF with annotated photos and a plain-English summary.",
      },
      {
        title: "Optional follow-up",
        body: "If repairs make sense, we'll quote them — no pressure to use us.",
      },
    ],
    whyUs: [
      "Inspector-first, salesperson-second mindset",
      "Same-week written reports with photos",
      "We'll tell you when nothing is wrong",
      "Useful for real estate, insurance, and pre-storm season checks",
    ],
    metaDescription:
      "Roof inspections in Central Texas — written reports with photos, honest findings, and no pressure. Useful for real estate, insurance, and storm season.",
  },
  {
    slug: "insurance-claims",
    internalType: "insurance-claim",
    title: "Insurance Claims",
    shortTitle: "Insurance Claims",
    teaser:
      "We handle the documentation, adjuster meeting, and rebuild — so you handle less.",
    intro:
      "Filing a roof claim shouldn't feel like a part-time job. We work directly with your insurance carrier and adjuster to make sure damage is documented properly and the claim reflects what your roof actually needs.",
    icon: FileText,
    heroImage: {
      src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
      alt: "Person reviewing insurance paperwork at a desk",
    },
    description: [
      "After a hail or wind event, an insurance claim is only as good as the documentation behind it. We've sat through enough adjuster meetings to know what carriers expect — and what they sometimes miss.",
      "We help you file, meet your adjuster on the roof, document damage thoroughly, and rebuild to spec once the claim is approved. You stay informed; we stay on top of it.",
    ],
    included: [
      "Pre-claim damage assessment with photos",
      "Help filing the claim with your carrier",
      "Adjuster meeting attendance and on-roof documentation",
      "Supplement requests when scope is missed",
      "Code-compliant rebuild matched to the approved scope",
      "Final invoice and depreciation paperwork support",
    ],
    process: [
      {
        title: "Free damage assessment",
        body: "Before you file, we walk the roof and tell you whether a claim makes sense.",
      },
      {
        title: "File and document",
        body: "We help with the carrier paperwork and put together the photo evidence package.",
      },
      {
        title: "Meet the adjuster",
        body: "We're on the roof with the adjuster so nothing critical gets missed.",
      },
      {
        title: "Rebuild to scope",
        body: "Once the claim is approved, we install to the approved scope and submit final paperwork.",
      },
    ],
    whyUs: [
      "Direct experience with major Texas insurance carriers",
      "We document the way adjusters need it documented",
      "Clear communication between you, us, and your carrier",
      "We don't pad scope — we build what's covered, well",
    ],
    metaDescription:
      "Insurance claim help for roof damage in Central Texas. We document, meet your adjuster, and rebuild to the approved scope.",
  },
  {
    slug: "maintenance",
    internalType: "maintenance",
    title: "Maintenance & Repairs",
    shortTitle: "Maintenance",
    teaser:
      "Annual care, leak fixes, and small repairs that add years to your roof's life.",
    intro:
      "A roof you maintain lasts a lot longer than a roof you ignore. Our maintenance program catches small issues before they turn into ceiling stains, mold, or full replacements.",
    icon: Wrench,
    heroImage: {
      src: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=1600&q=80",
      alt: "Roofing technician performing maintenance on shingles",
    },
    description: [
      "Most roof failures don't start as failures — they start as a lifted shingle, a cracked boot, or a clogged valley. Routine maintenance is how you find those before they cost you a ceiling.",
      "We offer one-off repairs and annual maintenance programs for both residential and commercial properties.",
    ],
    included: [
      "Annual or semi-annual roof check",
      "Sealant and flashing touch-ups",
      "Pipe boot and vent stack replacement",
      "Minor shingle, tile, and panel repairs",
      "Gutter and valley debris clearing",
      "Documented condition report after each visit",
    ],
    process: [
      {
        title: "Walk and assess",
        body: "We inspect the roof and note anything that needs attention now or soon.",
      },
      {
        title: "Repair on the spot",
        body: "Most small repairs are handled the same visit, included in the service.",
      },
      {
        title: "Document",
        body: "You get a short report with what we found and what we fixed.",
      },
      {
        title: "Schedule the next one",
        body: "We put the next maintenance visit on the calendar so it doesn't slip.",
      },
    ],
    whyUs: [
      "Catches small problems before they become expensive ones",
      "Documented service history helps with insurance and resale",
      "One crew, one point of contact, year after year",
      "Honest about what does and doesn't need attention",
    ],
    metaDescription:
      "Roof maintenance and repairs in Central Texas. Annual care plans, leak fixes, and small repairs that extend roof life.",
  },
];

export function getService(slug: string): ServiceContent | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export const SERVICE_SLUGS: ServiceSlug[] = SERVICES.map((s) => s.slug);
