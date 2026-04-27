import type { Metadata } from "next";

/**
 * SEO configuration for AAA Texas Roofing.
 *
 * One source of truth for site URL, brand strings, social card defaults, and
 * the per-page metadata helper. Keep this file lean and dependency-free so it
 * can be imported by `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx`, and
 * any individual page that needs `generateMetadata`.
 */

// ---------------------------------------------------------------------------
// Site identity
// ---------------------------------------------------------------------------

/** Canonical site URL. Override per environment via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://aaatxroof.com";

export const SITE_NAME = "AAA Texas Roofing";

export const SITE_TAGLINE = "Best Roofers in Central Texas";

export const DEFAULT_TITLE = `${SITE_NAME} | ${SITE_TAGLINE}`;

export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

export const DEFAULT_DESCRIPTION =
  "Professional roofing services for Austin, San Antonio, and Central Texas. Residential and commercial roofing, storm damage repair, inspections, and insurance claim assistance.";

export const KEYWORDS = [
  "roofing",
  "roofers",
  "Texas roofing",
  "Austin roofing",
  "San Antonio roofing",
  "Central Texas roofers",
  "storm damage repair",
  "insurance claims roofing",
  "roof inspection",
  "residential roofing",
  "commercial roofing",
];

/** Service area cities (also referenced by JSON-LD schema). */
export const SERVICE_AREA_CITIES = [
  "Austin",
  "San Antonio",
  "Round Rock",
  "Georgetown",
  "New Braunfels",
  "San Marcos",
] as const;

/**
 * Public service slugs. Mirrors `lib/types.ts#ServiceType` minus admin-only
 * categories. Kept here so SEO files don't depend on the full data layer.
 *
 * If services change, update both this list and `lib/types.ts`.
 */
export const SERVICE_SLUGS = [
  "residential",
  "commercial",
  "storm-damage",
  "inspection",
  "insurance-claim",
  "maintenance",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

// ---------------------------------------------------------------------------
// Social / Open Graph
// ---------------------------------------------------------------------------

/**
 * Default OG image. Replace `og-default.png` with a real 1200x630 image
 * in `/public/` before launch. Documented in `docs/SEO.md`.
 */
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og-default.png`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
};

export const TWITTER_HANDLE = "@aaatxroof"; // Update if/when account exists.

// ---------------------------------------------------------------------------
// Metadata helper
// ---------------------------------------------------------------------------

export interface PageMetaInput {
  /** Page-specific title segment. Becomes "<title> | AAA Texas Roofing". */
  title?: string;
  /** Override the title template (e.g. for the homepage). */
  absoluteTitle?: string;
  description?: string;
  /** Path beginning with `/`. Used for canonical + OG URL. */
  path?: string;
  /** Override OG image. */
  image?: string;
  /** Set true for blog posts. */
  isArticle?: boolean;
  /** Discourage indexing (e.g. for thank-you pages). */
  noIndex?: boolean;
  /** Extra keywords merged with the global list. */
  keywords?: string[];
}

/**
 * Build a `Metadata` object for a page.
 *
 * Designed to be called from a route's `generateMetadata` (or used directly
 * as `export const metadata = pageMetadata({ ... })` for static pages).
 *
 * @example
 *   export const metadata = pageMetadata({
 *     title: "Storm Damage Repair",
 *     description: "Hail and wind damage repair across Central Texas.",
 *     path: "/services/storm-damage",
 *   });
 */
export function pageMetadata(input: PageMetaInput = {}): Metadata {
  const {
    title,
    absoluteTitle,
    description = DEFAULT_DESCRIPTION,
    path = "/",
    image,
    isArticle = false,
    noIndex = false,
    keywords,
  } = input;

  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const ogImage = image
    ? { url: image, alt: absoluteTitle || title || DEFAULT_TITLE }
    : DEFAULT_OG_IMAGE;

  const resolvedTitle: Metadata["title"] = absoluteTitle
    ? { absolute: absoluteTitle }
    : title
      ? title
      : { absolute: DEFAULT_TITLE };

  return {
    title: resolvedTitle,
    description,
    keywords: keywords ? [...KEYWORDS, ...keywords] : KEYWORDS,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: isArticle ? "article" : "website",
      url,
      siteName: SITE_NAME,
      title: absoluteTitle || title || DEFAULT_TITLE,
      description,
      locale: "en_US",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle || title || DEFAULT_TITLE,
      description,
      images: [ogImage.url],
      // creator: TWITTER_HANDLE, // Uncomment when Twitter handle is live.
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

/**
 * Pre-baked metadata for known page types. Use as a starting point and
 * override fields you want to customize.
 */
export const PAGE_DEFAULTS = {
  home: {
    absoluteTitle: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: "/",
  },
  services: {
    title: "Roofing Services",
    description:
      "Full roofing services for Central Texas: residential, commercial, storm damage repair, inspections, insurance claims, and maintenance.",
    path: "/services",
  },
  projects: {
    title: "Projects",
    description:
      "Recent roofing projects across Austin, San Antonio, and Central Texas.",
    path: "/projects",
  },
  about: {
    title: "About",
    description: `Learn about ${SITE_NAME}, a locally owned roofing contractor serving Central Texas.`,
    path: "/about",
  },
  contact: {
    title: "Contact",
    description: `Get in touch with ${SITE_NAME}. Free estimates and insurance claim support across Central Texas.`,
    path: "/contact",
  },
  schedule: {
    title: "Schedule a Free Inspection",
    description:
      "Book a free roof inspection with AAA Texas Roofing. Same-week appointments available across Central Texas.",
    path: "/schedule",
  },
  blog: {
    title: "Roofing Blog",
    description:
      "Roofing tips, storm prep, and homeowner advice from AAA Texas Roofing.",
    path: "/blog",
  },
} as const satisfies Record<string, PageMetaInput>;
