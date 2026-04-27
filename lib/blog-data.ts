/**
 * Blog post catalog (scaffold).
 *
 * Posts are written in plain Markdown-ish content arrays so the
 * scaffold doesn't pull in MDX yet. Body sections render as <p>,
 * with optional <h2> headings and bullet lists.
 *
 * Replace with real CMS-driven content (or swap to MDX) when ready.
 */

export type BlogSection =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export interface BlogPost {
  slug: string;
  title: string;
  /** Plain-language summary used on listing + meta description */
  excerpt: string;
  /** ISO date — used by date-fns for formatted display */
  publishedAt: string;
  /** Estimated read time, e.g. "6 min read" */
  readTime: string;
  /** Category — used for filtering and breadcrumbs */
  category: string;
  /** Hero image (Unsplash) */
  image: {
    src: string;
    alt: string;
  };
  /** Article body */
  body: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "file-roof-insurance-claim-texas",
    title: "How to File a Roof Insurance Claim in Texas",
    excerpt:
      "Step-by-step guide to filing a roof insurance claim in Texas — from documenting damage to working with your adjuster.",
    publishedAt: "2026-04-22",
    readTime: "7 min read",
    category: "Insurance",
    image: {
      src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
      alt: "Person reviewing insurance paperwork",
    },
    body: [
      {
        type: "p",
        text: "Filing a roof insurance claim in Texas isn't complicated, but the order of operations matters. Done right, you walk away with your roof repaired or replaced and your deductible covered. Done poorly, you can leave money on the table — or worse, get the claim denied for a procedural mistake.",
      },
      {
        type: "h2",
        text: "1. Document the damage before you call",
      },
      {
        type: "p",
        text: "Before you call your insurance carrier, take photos of the damage. Wide shots and close-ups. If you can do it safely from the ground or with a phone-based zoom, do it. If not, get a roofer out for a free inspection first. Documentation is leverage.",
      },
      {
        type: "h2",
        text: "2. Call your insurance carrier",
      },
      {
        type: "p",
        text: "File the claim with your insurer. Be factual: what happened, when, what you can see. Don't speculate. They'll assign a claim number and schedule an adjuster.",
      },
      {
        type: "h2",
        text: "3. Get a roofer involved before the adjuster comes",
      },
      {
        type: "p",
        text: "Have a qualified roofer on the roof with the adjuster — or at minimum, have your own documented inspection in hand. Adjusters are professionals, but they're working dozens of claims a week. A second set of eyes catches things that get missed.",
      },
      {
        type: "h2",
        text: "4. Review the scope of work carefully",
      },
      {
        type: "p",
        text: "Once the adjuster issues a scope, read it. Compare it to what your roofer documented. If something is missing — a damaged ridge, a code-required upgrade, slope-and-drain rework — your roofer can submit a supplement to add it.",
      },
      {
        type: "h2",
        text: "5. Don't sign anything you don't understand",
      },
      {
        type: "p",
        text: "Texas has specific rules around roofing contracts and insurance work. Don't sign an Assignment of Benefits without understanding what you're giving up. A reputable roofer will walk you through every document.",
      },
      {
        type: "h2",
        text: "When to call us",
      },
      {
        type: "p",
        text: "If you're not sure whether you have a claim — or you're staring at a denial letter and wondering what to do next — call us. We'll walk the roof, look at your paperwork, and give you a straight answer.",
      },
    ],
  },
  {
    slug: "signs-you-need-a-new-roof",
    title: "Signs You Need a New Roof",
    excerpt:
      "Eight visible signs that your roof is at the end of its life — and which ones mean you should call today, not next year.",
    publishedAt: "2026-04-15",
    readTime: "5 min read",
    category: "Maintenance",
    image: {
      src: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=1600&q=80",
      alt: "Aging shingle roof with visible wear",
    },
    body: [
      {
        type: "p",
        text: "Most roofs don't fail dramatically. They wear out gradually — and by the time you can see it from the ground, you've usually had problems brewing in the attic for a while. Here's what to look for.",
      },
      {
        type: "h2",
        text: "Visible signs from the ground",
      },
      {
        type: "ul",
        items: [
          "Curled, cupped, or clawed shingles",
          "Bald spots where granules have washed off",
          "Missing shingles after wind events",
          "Sagging rooflines or visible decking dips",
          "Streaks of dark algae or moss",
        ],
      },
      {
        type: "h2",
        text: "Signs from inside the house",
      },
      {
        type: "ul",
        items: [
          "Water stains on ceilings or upper walls",
          "Daylight visible through attic decking",
          "Sudden spikes in heating or cooling bills",
        ],
      },
      {
        type: "h2",
        text: "Age is the silent factor",
      },
      {
        type: "p",
        text: "A standard asphalt shingle roof in Central Texas typically lasts 15–25 years depending on quality, ventilation, and storms. If yours is at the high end of that range and showing any of the signs above, it's time for an inspection — not a hopeful coat of sealant.",
      },
      {
        type: "h2",
        text: "When to call today",
      },
      {
        type: "p",
        text: "Active leaks, missing shingles after a recent storm, or visible decking sag are not 'next month' problems. Call. A short phone conversation and a free inspection can save you a destroyed ceiling.",
      },
    ],
  },
  {
    slug: "best-roofing-materials-central-texas-heat",
    title: "Best Roofing Materials for Central Texas Heat",
    excerpt:
      "How to choose between asphalt shingles, metal, and tile for the Texas climate — and why the cheapest option isn't always the smartest.",
    publishedAt: "2026-04-08",
    readTime: "6 min read",
    category: "Materials",
    image: {
      src: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1600&q=80",
      alt: "Standing seam metal roof reflecting Texas sunlight",
    },
    body: [
      {
        type: "p",
        text: "Texas heat is a harder test than Texas cold. Roofs in Central Texas spend months a year baking at attic temperatures north of 130°F. The wrong material at the wrong price can mean a roof that looks fine for five years and falls apart in ten.",
      },
      {
        type: "h2",
        text: "Asphalt shingles — the default for a reason",
      },
      {
        type: "p",
        text: "Modern architectural asphalt shingles are the most common choice in Central Texas, and for good reason: they're cost-effective, widely supported by manufacturers, and easy to repair. Look for impact-resistant (Class 4) options if you're in a hail-prone area.",
      },
      {
        type: "h2",
        text: "Metal — the long game",
      },
      {
        type: "p",
        text: "Standing seam metal lasts decades, reflects heat well, and handles wind events better than most alternatives. Higher upfront cost. Lower lifetime cost. Especially worth considering for Hill Country homes and properties you plan to keep.",
      },
      {
        type: "h2",
        text: "Tile — the right look, with caveats",
      },
      {
        type: "p",
        text: "Concrete or clay tile fits Spanish-style and Mediterranean homes beautifully and lasts 50+ years. The catch: it's heavy. Make sure the structure can support it, and budget for the underlayment work that determines whether the roof actually performs.",
      },
      {
        type: "h2",
        text: "What we recommend",
      },
      {
        type: "p",
        text: "For most Central Texas homes, a mid-tier architectural asphalt shingle with good ventilation will give you 20+ years of reliable service. If you're upgrading, metal is worth a serious look. Tile is a style choice — beautiful, but with engineering implications.",
      },
    ],
  },
  {
    slug: "storm-preparation-protecting-roof-texas",
    title: "Storm Preparation: Protecting Your Roof in Texas",
    excerpt:
      "Pre-storm checklist, what to do during a severe weather event, and how to assess damage afterward without putting yourself at risk.",
    publishedAt: "2026-03-30",
    readTime: "5 min read",
    category: "Storm",
    image: {
      src: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?auto=format&fit=crop&w=1600&q=80",
      alt: "Stormy sky over a Texas neighborhood",
    },
    body: [
      {
        type: "p",
        text: "Texas storm season starts earlier and ends later than people expect. Hail, wind, and the occasional tropical system mean every roof in Central Texas is on the line a few times a year. A small amount of preparation saves a lot of money — and a lot of headache.",
      },
      {
        type: "h2",
        text: "Before the season",
      },
      {
        type: "ul",
        items: [
          "Get an annual roof inspection (free with us)",
          "Trim limbs that overhang the roof",
          "Clean gutters and check downspouts",
          "Confirm your homeowners policy covers wind and hail",
          "Save photos of your roof's current condition — useful for claims",
        ],
      },
      {
        type: "h2",
        text: "During a storm",
      },
      {
        type: "p",
        text: "Stay inside. Stay off the roof. If you hear or see something coming through the roof, move people away from the area and call 911 if anyone is hurt. The roof can wait until daylight.",
      },
      {
        type: "h2",
        text: "After the storm",
      },
      {
        type: "ul",
        items: [
          "Photograph anything visible from the ground",
          "Tarp interior damage to limit secondary loss",
          "Call a roofer for a free post-storm inspection — same-day if possible",
          "Don't sign anything from door-to-door 'storm chasers' until you've vetted them",
        ],
      },
      {
        type: "h2",
        text: "When to call us",
      },
      {
        type: "p",
        text: "We run emergency tarping and storm response 24/7. If you're standing in the rain wondering whether your living room is about to flood, that's the call.",
      },
    ],
  },
  {
    slug: "commercial-vs-residential-roofing-differences",
    title: "Commercial vs Residential Roofing: Key Differences",
    excerpt:
      "Why a commercial roof isn't just a bigger residential roof — and what property owners need to understand before choosing a contractor.",
    publishedAt: "2026-03-22",
    readTime: "6 min read",
    category: "Commercial",
    image: {
      src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
      alt: "Commercial building with flat membrane roof",
    },
    body: [
      {
        type: "p",
        text: "Commercial roofs and residential roofs solve different problems. A residential contractor pulled into a commercial job will struggle. A commercial contractor on a residential job will overbuild — and overcharge. Knowing the difference matters when you're choosing who to hire.",
      },
      {
        type: "h2",
        text: "Slope",
      },
      {
        type: "p",
        text: "Residential roofs are typically pitched (steep). Commercial roofs are typically low-slope or flat. That single difference drives almost everything else: materials, drainage, equipment, and warranty terms are all different.",
      },
      {
        type: "h2",
        text: "Materials",
      },
      {
        type: "ul",
        items: [
          "Residential: asphalt shingles, metal, tile, occasionally synthetic",
          "Commercial: TPO, PVC, EPDM, modified bitumen, standing-seam metal",
        ],
      },
      {
        type: "h2",
        text: "Penetrations and equipment",
      },
      {
        type: "p",
        text: "Commercial roofs are full of HVAC curbs, drains, scuppers, vent stacks, and equipment platforms. Each one is a potential leak point and needs to be flashed correctly. Residential roofs have fewer penetrations but tighter cosmetic standards.",
      },
      {
        type: "h2",
        text: "Scheduling and disruption",
      },
      {
        type: "p",
        text: "On a commercial property, the building is often occupied — by tenants, customers, or staff. Scheduling the work to minimize disruption is part of the job. On a residential project, the homeowner is usually the only one affected.",
      },
      {
        type: "h2",
        text: "Choose the right contractor for the job",
      },
      {
        type: "p",
        text: "Ask any contractor for examples of recent work on properties similar to yours. A roofer who can show you ten residential reroofs and zero commercial recovers is not the right call for a 40,000 sqft warehouse.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export const BLOG_SLUGS = BLOG_POSTS.map((p) => p.slug);
