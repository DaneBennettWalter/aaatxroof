import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Robots policy for AAA Texas Roofing.
 *
 * Next.js serves this at /robots.txt.
 *
 *  - All public crawlers allowed by default.
 *  - /admin and /api are disallowed (admin dashboard + internal endpoints).
 *  - Sitemap is referenced explicitly so search engines pick it up on first crawl.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
