// Central site config. Domain: dehumidifier-guide.pages.dev
// (also update `SITE` in astro.config.mjs and public/robots.txt).
export const SITE_NAME = "Dehumidifier Guide";
export const SITE_URL = "https://dehumidifier-guide.pages.dev";
export const SITE_TAGLINE = "Whole-house and crawl-space dehumidifier guides, comparisons, and calculators.";
export const SITE_DESCRIPTION =
  "Independent guides to whole-house and crawl-space dehumidifiers: honest AHAM capacity ratings, brand comparisons, sizing calculators, and running-cost breakdowns so you buy the right unit the first time.";
export const OG_DEFAULT = `${SITE_URL}/og-default.png`;

// Amazon Associates Store ID. Every product link on the site picks it up.
// After changing it, clear Astro's content cache (rm -rf node_modules/.astro)
// so already-rendered markdown links are rebuilt with the new tag.
export const AMAZON_TAG = "room4205-20";

// Primary navigation, shared by header and footer.
export const NAV = [
  { href: "/posts/best-whole-house-dehumidifiers-2026/", label: "Best Units" },
  { href: "/dehumidifiers/", label: "Compare" },
  { href: "/guides/", label: "Guides" },
  { href: "/tools/", label: "Tools" },
];
