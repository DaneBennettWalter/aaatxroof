/**
 * Sample project portfolio.
 *
 * IMPORTANT: These are placeholder/sample projects using stock Unsplash
 * imagery. They are realistic but not real customer projects.
 * Replace with actual completed work as photography becomes available.
 */

import type { ServiceSlug } from "@/lib/services-data";

export interface Project {
  slug: string;
  title: string;
  city: string;
  /** Service category — must match a ServiceSlug for filtering */
  category: ServiceSlug;
  categoryLabel: string;
  /** Year completed (for realism — these are sample dates) */
  year: number;
  summary: string;
  description: string;
  /** Hero image (Unsplash) */
  image: {
    src: string;
    alt: string;
  };
  /** Quick stats — keep generic, do NOT fabricate hard numbers */
  highlights: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: "austin-craftsman-reroof",
    title: "Craftsman home reroof",
    city: "Austin, TX",
    category: "residential",
    categoryLabel: "Residential",
    year: 2025,
    summary: "Full asphalt shingle replacement on a 1920s craftsman.",
    description:
      "Tear-off, decking inspection, full underlayment replacement, and architectural shingle install on a historic craftsman home in central Austin. Original drip edge and flashing replaced; soffit ventilation upgraded.",
    image: {
      src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80",
      alt: "Craftsman-style home with new shingle roof",
    },
    highlights: [
      "Architectural asphalt shingles",
      "Decking and underlayment replaced",
      "Soffit ventilation upgrade",
    ],
  },
  {
    slug: "san-antonio-warehouse-tpo",
    title: "Warehouse TPO recover",
    city: "San Antonio, TX",
    category: "commercial",
    categoryLabel: "Commercial",
    year: 2025,
    summary: "60-mil TPO recover over an aging built-up roof.",
    description:
      "Phased weekend installs to keep operations running. Full insulation board, 60-mil TPO, and reworked drains and curbs on a 40,000+ sqft distribution warehouse.",
    image: {
      src: "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1600&q=80",
      alt: "Commercial warehouse with white TPO roof",
    },
    highlights: [
      "60-mil TPO single-ply membrane",
      "Phased weekend installs",
      "Reworked drains and HVAC curbs",
    ],
  },
  {
    slug: "round-rock-hail-rebuild",
    title: "Hail damage rebuild",
    city: "Round Rock, TX",
    category: "storm-damage",
    categoryLabel: "Storm Damage",
    year: 2025,
    summary: "Full reroof following a documented hail claim.",
    description:
      "Hail-impact damage documented across the entire roof slope. Worked with the homeowner's insurance adjuster on-site, then completed a full tear-off and rebuild with impact-resistant shingles.",
    image: {
      src: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&w=1600&q=80",
      alt: "Home with newly installed impact-resistant shingles",
    },
    highlights: [
      "Impact-resistant Class 4 shingles",
      "Full insurance coordination",
      "Documented adjuster meeting",
    ],
  },
  {
    slug: "georgetown-metal-roof",
    title: "Standing seam metal roof",
    city: "Georgetown, TX",
    category: "residential",
    categoryLabel: "Residential",
    year: 2024,
    summary: "Standing seam metal install on a Hill Country home.",
    description:
      "26-gauge standing seam metal roof installed over high-temp underlayment. Custom flashing for chimney and dormer details, integrated snow guards optional but skipped at homeowner's request.",
    image: {
      src: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1600&q=80",
      alt: "Home with standing seam metal roof",
    },
    highlights: [
      "26-gauge standing seam panels",
      "High-temp underlayment",
      "Custom dormer flashing",
    ],
  },
  {
    slug: "san-marcos-retail-tpo",
    title: "Retail strip recover",
    city: "San Marcos, TX",
    category: "commercial",
    categoryLabel: "Commercial",
    year: 2024,
    summary: "TPO recover across a multi-tenant retail strip.",
    description:
      "Coordinated with property management to recover the existing roof system without interrupting tenant operations. Tapered insulation added at low spots; drain flow corrected.",
    image: {
      src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
      alt: "Multi-tenant retail building with flat roof",
    },
    highlights: [
      "Multi-tenant coordination",
      "Tapered insulation for drainage",
      "Zero tenant disruption",
    ],
  },
  {
    slug: "new-braunfels-inspection",
    title: "Pre-purchase roof inspection",
    city: "New Braunfels, TX",
    category: "inspections",
    categoryLabel: "Inspections",
    year: 2025,
    summary: "Pre-purchase inspection that flagged hidden decking damage.",
    description:
      "Buyer's inspection on a home under contract. Surface looked clean, but decking inspection from the attic and a drone overflight revealed soft decking and an undocumented past repair. Buyer renegotiated based on the report.",
    image: {
      src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
      alt: "Inspector evaluating a residential roof",
    },
    highlights: [
      "Drone-assisted documentation",
      "Attic decking review",
      "Written report with photos",
    ],
  },
  {
    slug: "austin-insurance-claim",
    title: "Wind damage claim & rebuild",
    city: "Austin, TX",
    category: "insurance-claims",
    categoryLabel: "Insurance Claims",
    year: 2024,
    summary: "Wind-damage claim filed, approved, and rebuilt.",
    description:
      "After a severe wind event, helped the homeowner file with their carrier, met the adjuster on the roof for documentation, and rebuilt the affected slopes plus full ridge to match.",
    image: {
      src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
      alt: "Homeowner reviewing insurance documents",
    },
    highlights: [
      "Adjuster meeting attendance",
      "Approved scope rebuild",
      "Ridge and slope match",
    ],
  },
  {
    slug: "buda-maintenance-program",
    title: "Annual maintenance program",
    city: "Buda, TX",
    category: "maintenance",
    categoryLabel: "Maintenance",
    year: 2025,
    summary: "Two-visit-per-year maintenance plan on a multifamily property.",
    description:
      "Spring and fall maintenance visits on a small multifamily property. Pipe boots replaced, sealants refreshed, and flashing touch-ups completed on each visit. Documented condition reports filed with ownership.",
    image: {
      src: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=1600&q=80",
      alt: "Roofer servicing pipe boots and flashings",
    },
    highlights: [
      "Twice-annual visits",
      "Pipe boot and sealant refresh",
      "Documented condition reports",
    ],
  },
  {
    slug: "kyle-tile-repair",
    title: "Concrete tile repair",
    city: "Kyle, TX",
    category: "maintenance",
    categoryLabel: "Maintenance",
    year: 2024,
    summary: "Cracked tile replacement and underlayment patch.",
    description:
      "Targeted repair on a concrete tile roof: replaced cracked tiles, patched the failing underlayment beneath, and resealed the surrounding flashings.",
    image: {
      src: "https://images.unsplash.com/photo-1632759145355-8b8f4f9f8a2f?auto=format&fit=crop&w=1600&q=80",
      alt: "Concrete tile roof under repair",
    },
    highlights: [
      "Tile replacement",
      "Underlayment patch",
      "Flashing reseal",
    ],
  },
  {
    slug: "san-antonio-residential-reroof",
    title: "Stucco home reroof",
    city: "San Antonio, TX",
    category: "residential",
    categoryLabel: "Residential",
    year: 2025,
    summary: "Full reroof on a Spanish-style stucco home.",
    description:
      "Tear-off and architectural shingle install on a stucco home in north San Antonio. Stucco-to-roof flashings reworked to current code; ridge ventilation added.",
    image: {
      src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80",
      alt: "Spanish-style stucco home with new roof",
    },
    highlights: [
      "Architectural shingles",
      "Stucco flashing rework",
      "Ridge ventilation added",
    ],
  },
  {
    slug: "cedar-park-storm-emergency",
    title: "Emergency storm response",
    city: "Cedar Park, TX",
    category: "storm-damage",
    categoryLabel: "Storm Damage",
    year: 2025,
    summary: "Same-day tarping after a tree fell during a wind event.",
    description:
      "Tree took out a portion of the roof structure during an overnight storm. Same-day tarp, structural repair coordination, and a full rebuild of the affected section.",
    image: {
      src: "https://images.unsplash.com/photo-1590004845575-cc18b13d1d0a?auto=format&fit=crop&w=1600&q=80",
      alt: "Roof damage after a fallen tree",
    },
    highlights: [
      "Same-day emergency tarp",
      "Structural coordination",
      "Section rebuild",
    ],
  },
  {
    slug: "leander-office-metal",
    title: "Office building metal reroof",
    city: "Leander, TX",
    category: "commercial",
    categoryLabel: "Commercial",
    year: 2024,
    summary: "R-panel metal roof on a small office building.",
    description:
      "R-panel metal roof install on a single-story office. Worked around tenant hours; clean handoff to ownership with full warranty registration and maintenance schedule.",
    image: {
      src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1600&q=80",
      alt: "Single-story office building with metal roof",
    },
    highlights: [
      "R-panel metal system",
      "Tenant-hour-aware schedule",
      "Full warranty registration",
    ],
  },
];

/** Filter options derived from the SERVICE catalog so they stay in sync. */
export interface ProjectFilter {
  value: "all" | ServiceSlug;
  label: string;
}

export const PROJECT_FILTERS: ProjectFilter[] = [
  { value: "all", label: "All projects" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "storm-damage", label: "Storm Damage" },
  { value: "inspections", label: "Inspections" },
  { value: "insurance-claims", label: "Insurance Claims" },
  { value: "maintenance", label: "Maintenance" },
];
