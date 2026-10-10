/**
 * Charts and diagrams rendered to HTML strings at build time, so they work both
 * in Astro pages (via <Visual />) and inside markdown (via `[[chart:capacity]]`
 * placeholders, see rehype-visuals.ts). Hover/focus tooltips come from the
 * global [data-tip] handler in BaseLayout.
 *
 * Palette: teal #0e7c86 (AHAM/honest), aqua #5eead4 (accents), amber #ffc21a
 * (marketed/saturation warning). Text always uses ink tokens.
 */
import { MODELS, priceTier, PRICE_TIERS, type DehumidifierModel } from "../data/models";

const TEAL = "#0e7c86";
const AQUA = "#5eead4";
const AMBER = "#e8a100";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function figure(title: string, sub: string, body: string, note?: string) {
  return `<figure class="viz">
  <figcaption class="viz-head"><strong>${esc(title)}</strong><span>${esc(sub)}</span></figcaption>
  ${body}
  ${note ? `<p class="viz-note">${note}</p>` : ""}
</figure>`;
}

/** Horizontal bars: honest AHAM pints (teal) vs the marketed box number (amber) when they differ. */
export function capacityChart(models: DehumidifierModel[] = MODELS): string {
  const rows = [...models].sort((a, b) => b.pintsAham - a.pintsAham);
  const max = Math.max(...rows.map((m) => m.pintsMarketed));
  const bars = rows
    .map((m) => {
      const ahamW = (m.pintsAham / max) * 100;
      const marketedW = (m.pintsMarketed / max) * 100;
      const inflated = m.marketedBasis === "saturation";
      return `<div class="cap-row">
        <span class="cap-name"><a href="/dehumidifiers/${m.id}/">${esc(m.shortName)}</a></span>
        <div class="cap-bars">
          <div class="cap-bar cap-marketed" style="width:${marketedW}%" title="Marketed: ${m.pintsMarketed} pints/day (${m.marketedBasis})"></div>
          <div class="cap-bar cap-aham" style="width:${ahamW}%;${inflated ? `background:${TEAL}` : ""}" title="AHAM: ${m.pintsAham} pints/day"></div>
        </div>
        <span class="cap-num">${m.pintsAham}<small> AHAM</small>${inflated ? ` <em>(${m.pintsMarketed} box)</em>` : ""}</span>
      </div>`;
    })
    .join("");
  return figure(
    "Honest capacity vs. the box number",
    "Teal = AHAM rating (80°F, 60% RH), the comparable figure. Amber = the marketed number when a brand uses saturation testing.",
    `<div class="cap-chart">${bars}</div>
     <div class="cap-legend"><span><i style="background:${TEAL}"></i>AHAM rating</span><span><i style="background:${AMBER}"></i>Marketed (saturation) figure</span></div>`,
    `AprilAire and Santa Fe market AHAM numbers, so their bars match. AlorAir markets saturation figures — always compare AHAM to AHAM.`
  );
}

/** Scatter: Guide score (x) vs street price (y). Lower and further right is better value. */
export function valueChart(models: DehumidifierModel[] = MODELS): string {
  const xMin = 8.0;
  const xMax = 9.5;
  const yMax = 3500;
  const labels: Record<string, "right" | "left" | "above" | "below"> = {
    "aprilaire-e100-pro": "above",
    "alorair-sentinel-hd55": "right",
    "alorair-sentinel-hdi90": "above",
    "santa-fe-compact70": "left",
    "aprilaire-e130": "below",
  };
  const dots = models
    .map((m) => {
      const x = ((m.score - xMin) / (xMax - xMin)) * 100;
      const y = (m.priceLow / yMax) * 100;
      const label = labels[m.id] ? `<span class="sc-lbl ${labels[m.id]}">${esc(m.shortName)}</span>` : "";
      return `<a class="sc-dot" href="/dehumidifiers/${m.id}/" style="left:${x}%;bottom:${y}%" data-tip-value="${priceTier(m).sym} ${priceTier(m).label} · ${m.pintsAham} pints/day AHAM" data-tip-label="${esc(m.shortName)}" aria-label="${esc(m.shortName)}: ${priceTier(m).label} price tier, score ${m.score}"><i></i>${label}</a>`;
    })
    .join("");
  const yTicks = [0, 1000, 2000, 3000];
  const yBands = [500, 1500, 2500, 3250];
  const xTicks = [8.0, 8.5, 9.0, 9.5];
  const grid =
    yTicks.map((t) => `<span class="sc-gy" style="bottom:${(t / yMax) * 100}%"></span>`).join("") +
    yBands.map((t, i) => `<span class="sc-gy sc-band" style="bottom:${(t / yMax) * 100}%"><em>${PRICE_TIERS[i].sym}</em></span>`).join("") +
    xTicks.map((t) => `<span class="sc-gx" style="left:${((t - xMin) / (xMax - xMin)) * 100}%"><em>${t.toFixed(1)}</em></span>`).join("");
  return figure(
    "Guide score vs. street price",
    "Each dot is one model (Guide score vs. cheapest observed street price). Lower and further right is better value.",
    `<div class="sc-wrap"><div class="sc-plot">${grid}${dots}</div><div class="sc-xlab">Guide score (out of 10)</div></div>`,
    `Hover or tap a dot for details. Full numbers are in the <a href="/dehumidifiers/">comparison chart</a>.`
  );
}

/** Simple sizing ladder: square footage → AHAM pints needed. */
export function sizingDiagram(): string {
  const steps: [string, string, string][] = [
    ["Up to 1,300 sq ft", "55 pints/day", "Small basements, large crawl spaces"],
    ["1,300–2,200 sq ft", "70 pints/day", "Typical crawl spaces and basements"],
    ["2,200–3,000 sq ft", "90 pints/day", "Large basements, divided spaces"],
    ["3,000–5,500 sq ft", "100 pints/day", "Whole homes, ducted systems"],
    ["5,500–7,200 sq ft", "130 pints/day", "Large / very damp homes"],
  ];
  const rows = steps
    .map(
      ([space, pints, note]) => `<div class="size-row">
        <span class="size-space">${esc(space)}</span>
        <span class="size-arrow" aria-hidden="true">→</span>
        <strong class="size-pints">${esc(pints)} <small>AHAM</small></strong>
        <span class="size-note">${esc(note)}</span>
      </div>`
    )
    .join("");
  return figure(
    "Sizing ladder (humid climates)",
    "Starting points at AHAM conditions — add 20–30% headroom and size up for damp crawl spaces.",
    `<div class="size-ladder">${rows}</div>`,
    `For your exact space, use the <a href="/tools/capacity-sizer/">capacity sizer</a>.`
  );
}

/** Gravity drain vs condensate pump explainer. */
export function drainageDiagram(): string {
  return figure(
    "Drainage: gravity vs. pump",
    "Every whole-house dehumidifier drains continuously — the question is where the water goes.",
    `<div class="drain-grid">
      <div class="drain-card">
        <strong>Gravity drain</strong>
        <p>Water flows downhill through a hose to a floor drain or outside. Simple and reliable — but the unit must sit <em>above</em> the drain, which rules out most crawl spaces.</p>
        <span class="drain-models">E070 Pro · E080 · E100 Pro · E130 · HD55 · HD90 · Compact70 · Advance90</span>
      </div>
      <div class="drain-card hi">
        <strong>Built-in condensate pump</strong>
        <p>A small pump pushes water up and out — to a sink, a window, or outside — so the unit can sit anywhere. The fix for crawl spaces with no nearby drain.</p>
        <span class="drain-models">Sentinel HDi90 (pump kits also exist for Santa Fe units)</span>
      </div>
    </div>`
  );
}

export const VISUALS: Record<string, () => string> = {
  "chart:capacity": () => capacityChart(),
  "chart:value": () => valueChart(),
  "diagram:sizing": sizingDiagram,
  "diagram:drainage": drainageDiagram,
};
