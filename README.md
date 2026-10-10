# Dehumidifier Guide — dehumidifier-guide.pages.dev

Whole-house and crawl-space dehumidifier buyer's guide: Astro static site with buying guides,
comparisons, a review page per model, a sortable comparison chart, and 3 interactive
calculators (capacity sizer, running cost, portable vs. whole-house).
Deploys to Cloudflare Pages on every merge to `main`.

## Develop

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # outputs to dist/
```

## Content structure

| What | Where | URL |
|---|---|---|
| Model database (specs, AHAM ratings, prices, scores, pros/cons) | `src/data/models.ts` | drives `/dehumidifiers/`, `/dehumidifiers/<id>/`, all tools |
| Long-form review bodies (filename must match a model id) | `src/content/reviews/<id>.md` | `/dehumidifiers/<id>/` |
| Buying guides & comparisons | `src/content/posts/*.md` | `/posts/<slug>/` |
| Calculators | `src/pages/tools/*.astro` | `/tools/<name>/` |
| Site name, URL, Amazon tag | `src/lib/site.ts` (+ `SITE` in `astro.config.mjs`) | — |

## Key conventions

- Capacity is always compared at **AHAM** conditions (80°F, 60% RH). Saturation
  marketing numbers are labeled as such, never trusted.
- Prices are shown as ranges ("~$X") or "check current price" — never as live facts.
- Reviews are research-based, never lab tests; no invented specs or star ratings.
- Amazon links go through `src/lib/amazon.ts` (`amazonLink`), which appends the
  Associates tag from `src/lib/site.ts`.
- In markdown, `[text](amazon:<model-id>)` and `[text](asin:B0…)` are rewritten
  to tagged Amazon links at build time (unknown ids fail the build).
