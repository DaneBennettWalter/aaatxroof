import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  SERVICE_AREA_CITIES,
} from "@/lib/seo";

/**
 * JSON-LD structured data for AAA Texas Roofing.
 *
 * Rendered in the root layout so every page advertises a LocalBusiness /
 * RoofingContractor profile to search engines.
 *
 * Notes:
 *  - `aggregateRating` is intentionally omitted. We won't fabricate reviews.
 *    Add it back once we have real, verifiable reviews (Google / BBB / etc.)
 *    and update with actual counts. See the commented block below.
 *  - Phone number, address, and image are placeholders. Replace before launch.
 *  - Coordinates are an approximate centroid for the Central Texas service
 *    area (between Austin and San Antonio); refine when the physical office
 *    address is finalized.
 */

// --- Placeholders to replace before launch ---------------------------------
const PLACEHOLDER_PHONE = "+1-512-000-0000";
const PLACEHOLDER_STREET = "TBD";
const PLACEHOLDER_CITY = "Austin";
const PLACEHOLDER_REGION = "TX";
const PLACEHOLDER_POSTAL = "78701";
const PLACEHOLDER_LAT = 30.0;
const PLACEHOLDER_LNG = -97.75;
// ---------------------------------------------------------------------------

const services = [
  {
    name: "Residential Roofing",
    description:
      "Full residential roof installation and replacement across Central Texas.",
  },
  {
    name: "Commercial Roofing",
    description:
      "Commercial roofing systems, repair, and replacement for Central Texas businesses.",
  },
  {
    name: "Storm Damage Repair",
    description:
      "Hail, wind, and storm damage repair with rapid response across the Austin–San Antonio corridor.",
  },
  {
    name: "Roof Inspection",
    description:
      "Free, no-obligation roof inspections for homeowners and property managers.",
  },
  {
    name: "Insurance Claims",
    description:
      "End-to-end support for roof-related insurance claims, from documentation to repair.",
  },
  {
    name: "Roof Maintenance",
    description:
      "Preventive roof maintenance to extend roof life and avoid costly repairs.",
  },
];

export function LocalBusinessSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: ["AAA Texas Roof", "AAA TX Roofing"],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    image: `${SITE_URL}/og-default.png`,
    logo: `${SITE_URL}/logo.png`,
    telephone: PLACEHOLDER_PHONE,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: PLACEHOLDER_STREET,
      addressLocality: PLACEHOLDER_CITY,
      addressRegion: PLACEHOLDER_REGION,
      postalCode: PLACEHOLDER_POSTAL,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: PLACEHOLDER_LAT,
      longitude: PLACEHOLDER_LNG,
    },
    areaServed: SERVICE_AREA_CITIES.map((city) => ({
      "@type": "City",
      name: city,
      containedInPlace: {
        "@type": "State",
        name: "Texas",
      },
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Roofing Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          provider: { "@id": `${SITE_URL}/#business` },
        },
      })),
    },
    // ----------------------------------------------------------------------
    // Add when reviews exist. Do NOT fabricate counts or ratings.
    // Replace with real, verifiable totals from Google Business Profile / BBB.
    // ----------------------------------------------------------------------
    // aggregateRating: {
    //   "@type": "AggregateRating",
    //   ratingValue: "4.9",
    //   reviewCount: "123",
    // },
    sameAs: [
      // Add real social profiles before launch.
      // "https://www.facebook.com/aaatxroof",
      // "https://www.instagram.com/aaatxroof",
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify is safe here — no user input. dangerouslySetInnerHTML
      // is the standard pattern for JSON-LD in Next.js App Router.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Site-wide WebSite schema. Useful for sitelinks search box eligibility once
 * an internal search route exists. Currently no `potentialAction` is emitted
 * because there's no /search endpoint yet.
 */
export function WebSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#business` },
    inLanguage: "en-US",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Convenience wrapper: render all global schemas at once. */
export function GlobalSchemaMarkup() {
  return (
    <>
      <LocalBusinessSchema />
      <WebSiteSchema />
    </>
  );
}
