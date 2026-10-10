/**
 * Amazon product photos via the Creators API, fetched once per build.
 *
 * Amazon's Associates policies require product images to come from the Creators
 * API (PA-API's replacement), forbid storing or caching the images, allow keeping
 * an image *link* for at most 24 hours, and require each image to link to its
 * Amazon product page. So we only hotlink the URLs the API returns, rebuild the
 * site at least daily (.github/workflows/rebuild.yml), and ProductImage wraps
 * every Amazon photo in an affiliate link.
 *
 * Disabled (returns an empty map) until these build env vars are set, e.g. in
 * Cloudflare Pages → Settings → Environment variables:
 *   AMAZON_CREATORS_CREDENTIAL_ID, AMAZON_CREATORS_CREDENTIAL_SECRET
 * Creators API access requires 10+ qualifying sales in the past 30 days.
 * Any API failure falls back to the illustrations; the build never fails.
 */
import { MODELS } from "../data/models";
import { AMAZON_TAG } from "./site";

export interface AmazonImage {
  url: string;
  width: number;
  height: number;
  /** Product page URL returned by the API (already carries the partner tag). */
  detailUrl?: string;
}

const TOKEN_URL = process.env.AMAZON_CREATORS_TOKEN_URL ?? "https://api.amazon.com/auth/o2/token";
const API_URL = process.env.AMAZON_CREATORS_API_URL ?? "https://creatorsapi.amazon/catalog/v1/getItems";
const MARKETPLACE = "www.amazon.com";
const BATCH = 10;

let cache: Promise<Map<string, AmazonImage>> | null = null;

/** Map of ASIN → primary product image. Empty when the API isn't configured. */
export function getAmazonImages(): Promise<Map<string, AmazonImage>> {
  cache ??= fetchAll().catch((err) => {
    console.warn(`[amazon-images] disabled for this build: ${err instanceof Error ? err.message : err}`);
    return new Map();
  });
  return cache;
}

async function fetchAll(): Promise<Map<string, AmazonImage>> {
  const id = process.env.AMAZON_CREATORS_CREDENTIAL_ID;
  const secret = process.env.AMAZON_CREATORS_CREDENTIAL_SECRET;
  if (!id || !secret || !AMAZON_TAG) return new Map();

  const token = await getToken(id, secret);
  const asins = [...new Set(MODELS.flatMap((m) => [m.asin, ...(m.tiers ?? []).map((t) => t.asin)]).filter(Boolean))] as string[];
  const images = new Map<string, AmazonImage>();

  for (let i = 0; i < asins.length; i += BATCH) {
    const data = await post(API_URL, {
      headers: { Authorization: `Bearer ${token}`, "x-marketplace": MARKETPLACE },
      body: {
        itemIds: asins.slice(i, i + BATCH),
        itemIdType: "ASIN",
        marketplace: MARKETPLACE,
        partnerTag: AMAZON_TAG,
        resources: ["images.primary.large", "images.primary.medium"],
      },
    });
    for (const item of data?.itemsResult?.items ?? []) {
      const img = item?.images?.primary?.large ?? item?.images?.primary?.medium;
      if (item?.asin && img?.url) {
        images.set(item.asin, { url: img.url, width: img.width, height: img.height, detailUrl: item.detailPageURL });
      }
    }
  }
  console.log(`[amazon-images] fetched ${images.size}/${asins.length} product images`);
  return images;
}

async function getToken(id: string, secret: string): Promise<string> {
  const data = await post(TOKEN_URL, {
    body: { grant_type: "client_credentials", client_id: id, client_secret: secret, scope: "creatorsapi::default" },
  });
  if (!data?.access_token) throw new Error("no access_token in token response");
  return data.access_token;
}

async function post(url: string, opts: { headers?: Record<string, string>; body: unknown }): Promise<any> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...opts.headers },
    body: JSON.stringify(opts.body),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`${new URL(url).host} responded ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}
