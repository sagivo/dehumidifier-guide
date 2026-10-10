import { AMAZON_TAG } from "./site";

export const AFFILIATE_REL = "sponsored nofollow noopener";

/** Add the Associates tag to any amazon.com URL (no-op while the tag is unset). */
export function tagAmazonUrl(url: string): string {
  if (!AMAZON_TAG) return url;
  const u = new URL(url);
  u.searchParams.set("tag", AMAZON_TAG);
  return u.toString();
}

/**
 * Build an Amazon link for a product. Prefers a direct product page (ASIN),
 * which converts far better than search results; falls back to a search.
 */
export function amazonLink(searchQuery: string, asin?: string): string {
  const base = asin
    ? `https://www.amazon.com/dp/${encodeURIComponent(asin)}`
    : `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}`;
  return tagAmazonUrl(base);
}
