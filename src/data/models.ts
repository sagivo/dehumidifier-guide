export type Tier = "budget" | "mid" | "premium";

export interface DehumidifierModel {
  /** URL slug: /dehumidifiers/<id>/ */
  id: string;
  name: string;
  /** Compact name for tables and buttons, e.g. "E100 Pro". */
  shortName: string;
  brand: string;
  tier: Tier;
  /** pints/day at AHAM conditions (80°F, 60% RH) — the honest, comparable number */
  pintsAham: number;
  /** pints/day at saturation (usually 90°F, 90% RH) — the marketed number, when published */
  pintsSaturation?: number;
  /** the capacity number the brand puts on the box */
  pintsMarketed: number;
  /** which test condition the marketed number is measured at */
  marketedBasis: "AHAM" | "saturation" | "DOE";
  /** max rated coverage in square feet */
  maxSqFt: number;
  /** drainage method */
  drainage: string;
  /** dimensions as L x W x H in inches */
  dimensionsIn: string;
  weightLbs: number;
  amps: number;
  watts?: number;
  cfm?: number;
  noiseDb?: string;
  energyStar: boolean;
  warrantyYears: number;
  filter: string;
  /** typical US street price range (lowest observed → highest observed) */
  priceLow: number;
  priceHigh: number;
  /** Amazon search query for the buy link */
  query: string;
  /** Amazon ASIN — when set, links go straight to the product page */
  asin?: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  /** Editorial score out of 10 — research-based, see /how-we-research/ */
  score: number;
  scores: { capacity: number; efficiency: number; build: number; value: number };
  /** One-paragraph verdict */
  verdict: string;
  sources: string[];
  /** Caveats shown under the spec table (variant differences, unverified figures). */
  specNotes?: string[];
}

/**
 * Specs and US street prices as of October 10, 2026, compiled from manufacturer
 * pages, retailer listings and spec sheets (see `sources`).
 * Treat as guidance — prices move weekly; verify before buying.
 * Capacity figures always lead with the AHAM number; saturation numbers are the
 * inflated figures brands put on the box (see our AHAM vs saturation guide).
 */
export const MODELS: DehumidifierModel[] = [
  {
    id: "aprilaire-e070-pro",
    name: "AprilAire E070 Pro",
    shortName: "E070 Pro",
    brand: "AprilAire",
    tier: "mid",
    pintsAham: 70,
    pintsMarketed: 70,
    marketedBasis: "AHAM",
    maxSqFt: 2200,
    drainage: "Gravity drain (10-ft hose included)",
    dimensionsIn: '25" L x 12.5" W x 12.5" H',
    weightLbs: 56,
    amps: 5.8,
    cfm: 200,
    noiseDb: "53 dBA (ducted)",
    energyStar: true,
    warrantyYears: 5,
    filter: "Washable MERV 8",
    priceLow: 1550,
    priceHigh: 1770,
    query: "AprilAire E070 Pro dehumidifier",
    bestFor:
      "Crawl spaces and basements up to 2,200 sq ft where a compact, pro-grade unit has to fit through tight access doors.",
    pros: [
      "True 70-pint AHAM rating — no inflated saturation math",
      "Compact 12.5\" x 12.5\" footprint slides through crawl space doors",
      "Corrosion-resistant aluminum coils",
      "Energy Star certified",
      "5-year warranty, designed and built in the USA",
    ],
    cons: [
      "Gravity drain only — no built-in pump version",
      "Premium price for the 70-pint class",
      "MERV 8 filter is basic next to Santa Fe's MERV 13",
    ],
    score: 8.9,
    scores: { capacity: 8.5, efficiency: 9.0, build: 9.2, value: 8.8 },
    verdict:
      "The E070 Pro is the crawl-space specialist's default pick: an honest 70-pint AHAM rating in the smallest pro-grade cabinet here, with aluminum coils that shrug off damp crawl space air. You pay for the AprilAire name and the compact form, but for tight encapsulated crawl spaces there is nothing easier to live with.",
    sources: [
      "https://filterzdirect.com/product/aprilaire-e070-dehumidifier-crawlspace-unit-70-pints-day/",
      "https://supply.crawlspaceninja.com/products/aprilaire-e070-dehumidifier-70-pint?revpage=2",
    ],
  },
  {
    id: "aprilaire-e080",
    name: "AprilAire E080",
    shortName: "E080",
    brand: "AprilAire",
    tier: "mid",
    pintsAham: 80,
    pintsMarketed: 80,
    marketedBasis: "AHAM",
    maxSqFt: 4400,
    drainage: "Gravity drain",
    dimensionsIn: '26" L x 14" W x 15" H',
    weightLbs: 63,
    amps: 5.1,
    energyStar: true,
    warrantyYears: 5,
    filter: "Washable MERV 8",
    priceLow: 1750,
    priceHigh: 1900,
    query: "AprilAire E080 dehumidifier",
    asin: "B094PWS7K2",
    bestFor:
      "Basements up to 4,400 sq ft that need a step up from the E070 without jumping to whole-house 100-pint pricing.",
    pros: [
      "80-pint AHAM rating with the lowest amp draw in the AprilAire line (5.1A)",
      "Energy Star Most Efficient 2025",
      "Covers up to 4,400 sq ft — true basement scale",
      "Top or front-mount digital control",
      "5-year warranty, made in the USA",
    ],
    cons: [
      "No Wi-Fi or remote monitoring option",
      "Gravity drain only",
      "Priced close to the more capable E100 Pro",
    ],
    score: 8.7,
    scores: { capacity: 8.6, efficiency: 9.2, build: 9.0, value: 8.4 },
    verdict:
      "The E080 is the efficiency pick of the AprilAire line: 80 honest pints at just 5.1 amps with a Most Efficient badge. It sits in an awkward price spot near the E100 Pro, so it makes most sense when your space needs 80 pints and you value the lowest running cost over maximum capacity.",
    sources: [
      "https://bestdehumidifierchoice.com/aprilaire-dehumidifier/",
      "https://www.amazon.com/dp/B094PWS7K2/ref=cm_sw_r_cso_cp_apin_dp_E04XVMPFHAB49FYY721A",
    ],
    specNotes: [
      "The DOE integrated test rates this unit at 65 pints/day; AprilAire's 80-pint figure is the AHAM rating.",
    ],
  },
  {
    id: "aprilaire-e100-pro",
    name: "AprilAire E100 Pro",
    shortName: "E100 Pro",
    brand: "AprilAire",
    tier: "premium",
    pintsAham: 100,
    pintsMarketed: 100,
    marketedBasis: "AHAM",
    maxSqFt: 5500,
    drainage: "Gravity drain (duct collars and damper included)",
    dimensionsIn: '26" L x 14" W x 15" H',
    weightLbs: 64,
    amps: 6.9,
    cfm: 280,
    energyStar: true,
    warrantyYears: 5,
    filter: "Washable MERV 8",
    priceLow: 2015,
    priceHigh: 2300,
    query: "AprilAire E100 Pro dehumidifier",
    bestFor:
      "Whole homes up to 5,500 sq ft — the one-unit answer for humid-climate houses with a ducted HVAC tie-in.",
    pros: [
      "100-pint AHAM rating, ductable to the whole house",
      "Energy Star Most Efficient 2025",
      "280 CFM moves air through real duct runs",
      "Duct collars and damper included in the box",
      "5-year warranty, made in the USA",
    ],
    cons: [
      "Needs professional installation for ducted setups",
      "No built-in pump — plan the drain route",
      "Premium price, and the E130 tempts upsizing",
    ],
    score: 9.1,
    scores: { capacity: 9.4, efficiency: 9.0, build: 9.3, value: 8.8 },
    verdict:
      "The E100 Pro is our best overall whole-house dehumidifier: a genuine 100-pint AHAM machine with the airflow to serve 5,500 sq ft through ducts, top-tier efficiency credentials, and AprilAire's pro-grade build. If one unit has to protect the whole house, this is the one contractors reach for.",
    sources: [
      "https://bestdehumidifierchoice.com/aprilaire-dehumidifier/",
      "https://www.paddleroundthepier.com/best-whole-house-dehumidifiers-for-humid-climates/",
    ],
    specNotes: [
      "The DOE integrated test rates this unit at 85 pints/day; AprilAire's 100-pint figure is the AHAM rating.",
    ],
  },
  {
    id: "aprilaire-e130",
    name: "AprilAire E130",
    shortName: "E130",
    brand: "AprilAire",
    tier: "premium",
    pintsAham: 130,
    pintsMarketed: 130,
    marketedBasis: "AHAM",
    maxSqFt: 7200,
    drainage: "Gravity drain (inlet/outlet collars included)",
    dimensionsIn: '30" L x 19.5" W x 18.75" H',
    weightLbs: 98,
    amps: 8.3,
    energyStar: true,
    warrantyYears: 5,
    filter: "Washable MERV 8",
    priceLow: 2495,
    priceHigh: 2600,
    query: "AprilAire E130 dehumidifier",
    bestFor:
      "Large homes up to 7,200 sq ft and light commercial spaces that need maximum moisture removal from a single unit.",
    pros: [
      "130-pint AHAM rating — the biggest residential unit here",
      "Energy Star Most Efficient certified",
      "Covers up to 7,200 sq ft",
      "Interactive digital display, top or inlet-side mount",
      "5-year warranty, made in the USA",
    ],
    cons: [
      "98 lbs and the largest cabinet — plan the install",
      "8.3A draw is the hungriest here",
      "Overkill (and overpriced) for anything under ~4,000 sq ft",
    ],
    score: 8.8,
    scores: { capacity: 9.8, efficiency: 8.8, build: 9.2, value: 8.0 },
    verdict:
      "The E130 is the heavyweight: 130 honest pints for the biggest homes, with the efficiency badge to keep running costs sane. It is a lot of machine — and a lot of money — so it earns its keep only in large or very damp houses where smaller units would run flat-out.",
    sources: [
      "https://bestdehumidifierchoice.com/aprilaire-dehumidifier/",
      "https://hvacsurplus.com/products/aprilaire-e130-130-pint-whole-house-professional-grade-dehumidifier",
    ],
    specNotes: [
      "The DOE integrated test rates this unit at 105 pints/day; AprilAire's 130-pint figure is the AHAM rating.",
    ],
  },
  {
    id: "alorair-sentinel-hd55",
    name: "AlorAir Sentinel HD55",
    shortName: "HD55",
    brand: "AlorAir",
    tier: "budget",
    pintsAham: 55,
    pintsSaturation: 120,
    pintsMarketed: 120,
    marketedBasis: "saturation",
    maxSqFt: 1300,
    drainage: "Gravity drain",
    dimensionsIn: '19.2" L x 12.2" W x 13.3" H',
    weightLbs: 57.3,
    amps: 4.1,
    cfm: 130,
    noiseDb: "<52 dBA",
    energyStar: true,
    warrantyYears: 5,
    filter: "MERV-8",
    priceLow: 506,
    priceHigh: 638,
    query: "AlorAir Sentinel HD55 dehumidifier",
    bestFor:
      "Budget crawl space and basement jobs up to 1,300 sq ft — the cheapest way into a real pro-grade unit.",
    pros: [
      "By far the lowest price of any pro-grade unit here",
      "Compact 13.3\" height fits low crawl spaces",
      "Quietest in the lineup at under 52 dBA",
      "Energy Star certified",
      "5-year warranty",
    ],
    cons: [
      "55 honest pints — the box's '120 pint' figure is saturation marketing",
      "Gravity drain only, short 1.3-ft drain hose in some bundles",
      "MERV-8 filter is basic; no ducting collars included",
    ],
    score: 8.6,
    scores: { capacity: 7.8, efficiency: 8.8, build: 8.4, value: 9.6 },
    verdict:
      "The HD55 is the value king: a genuine pro-grade crawl space dehumidifier for roughly a third of the AprilAire E070's price. Read past the '120 pint' box claim — it is 55 pints at AHAM, which is still plenty for spaces up to 1,300 sq ft. For budget jobs, nothing else is close.",
    sources: [
      "https://aloraircrawlspace.com/products/alorair-120-ppd-crawl-space-dehumidifiers-sentinel-hd55-white",
      "https://www.airpurifierblog.com/products/alorair-sentinel-hd55-white-basement-crawl-space-dehumidifier",
    ],
    specNotes: [
      "AlorAir markets this as 120 pints/day (saturation, 90°F/90% RH); the AHAM rating is 55 pints/day. Always compare AHAM to AHAM.",
    ],
  },
  {
    id: "alorair-sentinel-hd90",
    name: "AlorAir Sentinel HD90",
    shortName: "HD90",
    brand: "AlorAir",
    tier: "mid",
    pintsAham: 90,
    pintsSaturation: 198,
    pintsMarketed: 198,
    marketedBasis: "saturation",
    maxSqFt: 2600,
    drainage: "Gravity drain",
    dimensionsIn: '23.2" L x 15.2" W x 17.7" H',
    weightLbs: 67.2,
    amps: 5.56,
    cfm: 210,
    noiseDb: "58 dBA",
    energyStar: true,
    warrantyYears: 5,
    filter: "MERV-1 (MERV-8 optional)",
    priceLow: 1000,
    priceHigh: 1100,
    query: "AlorAir Sentinel HD90 dehumidifier",
    bestFor:
      "Basements and crawl spaces up to 2,600 sq ft where you want 90 honest pints without paying the AprilAire premium.",
    pros: [
      "90 pints at AHAM for about $1,000 — strong capacity per dollar",
      "Energy Star rated with a solid 2.69 L/kWh COP",
      "210 CFM and ducting options for divided spaces",
      "Auto-defrost works down to 33.8°F",
      "Optional remote monitoring",
    ],
    cons: [
      "The '198 pint' headline is saturation marketing, not AHAM",
      "Stock MERV-1 filter is thin — budget for the MERV-8 upgrade",
      "67 lbs is heavy for a crawl space carry",
    ],
    score: 8.8,
    scores: { capacity: 9.0, efficiency: 8.8, build: 8.6, value: 9.0 },
    verdict:
      "The HD90 is AlorAir's sweet spot: the same 90 AHAM pints as units costing twice as much, Energy Star rated, with ducting options the cheaper HD55 lacks. Ignore the 198-pint box claim and judge it on the 90 honest pints — on that basis it is one of the best values in crawl space dehumidification.",
    sources: [
      "https://www.alorair.com/product-details/alorair-sentinel-hd90?page=3",
      "https://www.sylvane.com/products/alorair-sentinel-90-pint-crawl-space-basement-water-damage-dehumidifier-drain-hose-2600-square-feet",
    ],
    specNotes: [
      "AlorAir markets this as 198 pints/day (saturation, 90°F/90% RH); the AHAM rating is 90 pints/day.",
      "AlorAir's own site advertises a 6-year limited warranty on this model; most resellers list 5 years.",
    ],
  },
  {
    id: "alorair-sentinel-hdi90",
    name: "AlorAir Sentinel HDi90",
    shortName: "HDi90",
    brand: "AlorAir",
    tier: "mid",
    pintsAham: 90,
    pintsSaturation: 198,
    pintsMarketed: 198,
    marketedBasis: "saturation",
    maxSqFt: 2600,
    drainage: "Built-in condensate pump",
    dimensionsIn: '23.2" L x 15.2" W x 17.7" H',
    weightLbs: 70.5,
    amps: 5.56,
    cfm: 210,
    noiseDb: "<58 dBA",
    energyStar: false,
    warrantyYears: 6,
    filter: "MERV-1 (MERV-8 optional)",
    priceLow: 1032,
    priceHigh: 1147,
    query: "AlorAir Sentinel HDi90 dehumidifier",
    bestFor:
      "Crawl spaces up to 2,600 sq ft with no floor drain nearby — the built-in pump pushes condensate up and out.",
    pros: [
      "Built-in condensate pump — no gravity-drain routing needed",
      "90 pints at AHAM for around $1,000",
      "6-year limited warranty, longest in its price class",
      "Auto-defrost down to 33.8°F for cold crawl spaces",
      "Optional remote monitoring for sealed spaces",
    ],
    cons: [
      "'198 pint' headline is saturation marketing; real figure is 90 AHAM",
      "Stock MERV-1 filter is thin",
      "70.5 lbs — the heaviest 90-pint unit here",
    ],
    score: 9.0,
    scores: { capacity: 9.0, efficiency: 8.7, build: 8.9, value: 9.2 },
    verdict:
      "The HDi90 is our best crawl space pick: everything that makes the HD90 a value standout, plus a built-in condensate pump that solves the number-one crawl space headache — where the water goes. For sealed crawl spaces with no nearby drain, the pump alone justifies the small premium over the HD90.",
    sources: [
      "https://www.alorair.com/product-details/alorair-sentinel-hdi90-build-in-pump?page=3",
      "https://thedryair.com/products/alorair-basement-dehumidifier-90-pint-with-pump",
    ],
    specNotes: [
      "AlorAir markets this as 198 pints/day (saturation, 90°F/90% RH); the AHAM rating is 90 pints/day.",
    ],
  },
  {
    id: "santa-fe-compact70",
    name: "Santa Fe Compact70",
    shortName: "Compact70",
    brand: "Santa Fe",
    tier: "mid",
    pintsAham: 70,
    pintsMarketed: 70,
    marketedBasis: "AHAM",
    maxSqFt: 2200,
    drainage: "Gravity drain (8-ft hose included)",
    dimensionsIn: '21" L x 12" W x 12" H',
    weightLbs: 55,
    amps: 5.1,
    cfm: 150,
    noiseDb: "55 dBA",
    energyStar: false,
    warrantyYears: 6,
    filter: "MERV-13",
    priceLow: 1300,
    priceHigh: 1450,
    query: "Santa Fe Compact70 dehumidifier",
    asin: "B07HCLL7FY",
    bestFor:
      "Low-clearance crawl spaces where 12 inches of height is all you get — it hangs between floor joists.",
    pros: [
      "Only 12\" tall — fits the lowest crawl spaces and hangs between joists",
      "MERV-13 filtration, best stock filter here",
      "6-year warranty, longest standard coverage",
      "Made in Madison, Wisconsin, steel cabinet",
      "Rotatable exhaust for horizontal or vertical discharge",
    ],
    cons: [
      "No Energy Star rating",
      "Knob-style humidity control feels dated",
      "150 CFM is modest for larger basements",
    ],
    score: 8.7,
    scores: { capacity: 8.5, efficiency: 8.4, build: 9.4, value: 8.6 },
    verdict:
      "The Compact70 is the build-quality pick for tight crawl spaces: a 12-inch-tall steel tank with the best stock filtration (MERV-13) and a 6-year warranty. It gives up some efficiency paperwork to AprilAire, but for low-clearance installs nothing fits — or lasts — like it.",
    sources: [
      "https://www.santa-fe-products.com/product/compact-70-dehumidifier/",
      "https://www.amazon.com/dp/B07HCLL7FY",
    ],
    specNotes: [
      "70 pints/day is rated at 80°F/60% RH; at a more crawl-space-like 65°F/60% RH it removes about 43.7 pints/day.",
    ],
  },
  {
    id: "santa-fe-advance90",
    name: "Santa Fe Advance90",
    shortName: "Advance90",
    brand: "Santa Fe",
    tier: "mid",
    pintsAham: 90,
    pintsMarketed: 90,
    marketedBasis: "AHAM",
    maxSqFt: 3000,
    drainage: "Gravity drain (pump kit optional)",
    dimensionsIn: '26" L x 14.5" W x 19.4" H',
    weightLbs: 80,
    amps: 5.7,
    watts: 640,
    cfm: 309,
    noiseDb: "59 dBA",
    energyStar: false,
    warrantyYears: 6,
    filter: "MERV-13",
    priceLow: 1800,
    priceHigh: 3200,
    query: "Santa Fe Advance90 dehumidifier",
    bestFor:
      "Large basements up to 3,000 sq ft that need dual-zone airflow — the twin exhausts feed two spaces at once.",
    pros: [
      "Dual exhaust outlets serve two spaces from one unit",
      "309 CFM — the strongest airflow here",
      "MERV-13 filtration standard",
      "6-year warranty, made in the USA",
      "Exceeds Energy Star efficiency requirements (2.88 L/kWh)",
    ],
    cons: [
      "Street price varies wildly — shop carefully",
      "80 lbs and 19.4\" tall needs real install planning",
      "No Energy Star label despite the efficiency",
    ],
    score: 8.5,
    scores: { capacity: 9.0, efficiency: 8.8, build: 9.1, value: 7.6 },
    verdict:
      "The Advance90 is the airflow king: dual exhausts and 309 CFM make it the pick for large or divided basements one unit can't otherwise reach. The catch is pricing — street prices swing from under $1,800 to over $3,000, so it only makes sense when you buy it right.",
    sources: [
      "https://www.supplyhouse.com/Santa-Fe-4034180-Advance90-Horizontal-Dual-Airflow-Outlet-Dehumidifier",
      "https://www.flexomeric.com/santa-fe-advance90-dehumidifier.html",
    ],
    specNotes: [
      "90 pints/day is rated at 80°F/60% RH; at 70°F/60% RH it removes about 71 pints/day.",
      "Street pricing varies widely between HVAC suppliers; the low end of our range comes from SupplyHouse, the high end from specialty retailers.",
    ],
  },
];

export const ACRE = 43560;

export function getModel(id: string): DehumidifierModel {
  const m = MODELS.find((m) => m.id === id);
  if (!m) throw new Error(`Unknown model id: ${id}`);
  return m;
}

export function formatMoney(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function formatPrice(m: DehumidifierModel): string {
  return m.priceLow === m.priceHigh
    ? formatMoney(m.priceLow)
    : `${formatMoney(m.priceLow)}–${formatMoney(m.priceHigh)}`;
}

/**
 * Price bands shown instead of dollar figures. Amazon Associates rules only
 * allow exact prices pulled live from Amazon's API, so pages show a band and
 * send readers to Amazon for today's price. Bands use the cheapest version.
 */
export const PRICE_TIERS = [
  { level: 1, sym: "$", label: "Budget", range: "under $1,000" },
  { level: 2, sym: "$$", label: "Mid-range", range: "$1,000–$2,000" },
  { level: 3, sym: "$$$", label: "Premium", range: "$2,000–$3,000" },
  { level: 4, sym: "$$$$", label: "Flagship", range: "over $3,000" },
] as const;
export type PriceTier = (typeof PRICE_TIERS)[number];

export function priceTierOf(price: number): PriceTier {
  return PRICE_TIERS[price < 1000 ? 0 : price < 2000 ? 1 : price < 3000 ? 2 : 3];
}

export function priceTier(m: DehumidifierModel): PriceTier {
  return priceTierOf(m.priceLow);
}

/** Human-readable capacity, always leading with the honest AHAM number. */
export function formatCapacity(m: DehumidifierModel): string {
  const base = `${m.pintsAham} pints/day (AHAM)`;
  if (m.pintsSaturation && m.marketedBasis === "saturation") {
    return `${base} — marketed as ${m.pintsSaturation}`;
  }
  return base;
}
