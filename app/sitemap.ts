import type { MetadataRoute } from "next";
import { SITE_URL, SERVICE_SLUGS } from "@/lib/seo";

/**
 * Dynamic sitemap for AAA Texas Roofing.
 *
 * Next.js will serve this at /sitemap.xml.
 *
 * Priorities are tuned for a local-services site:
 *  - 1.0  homepage
 *  - 0.9  primary conversion routes (schedule, contact)
 *  - 0.8  services index + individual service pages
 *  - 0.7  projects, about
 *  - 0.6  blog index
 *
 * Service slugs are mirrored from `lib/seo.ts` so they stay in sync with
 * any service pages built by the marketing sub-agent.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/schedule`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const serviceEntries: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...serviceEntries];
}
