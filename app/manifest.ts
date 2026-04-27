import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TAGLINE, DEFAULT_DESCRIPTION } from "@/lib/seo";

/**
 * PWA manifest for AAA Texas Roofing. Served at /manifest.webmanifest.
 *
 * Icon paths are placeholders — generate real PNGs at the listed sizes and
 * drop them in `/public/icons/`. See `docs/SEO.md` for the full launch
 * checklist.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "AAA TX Roof",
    description: `${SITE_NAME} — ${SITE_TAGLINE}. ${DEFAULT_DESCRIPTION}`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1E3A5F",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
