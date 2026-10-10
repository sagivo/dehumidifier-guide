// Checks every internal link and #anchor in dist/ resolves. Run after `npm run build`:
//   node scripts/check-links.mjs
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const pages = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".html")) pages.push(p);
  }
})(DIST);

const idsCache = new Map();
function idsOf(file) {
  if (!idsCache.has(file)) {
    const html = readFileSync(file, "utf8");
    idsCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
}
function resolve(path) {
  const clean = decodeURI(path.split("?")[0]);
  const candidates = [join(DIST, clean), join(DIST, clean, "index.html"), join(DIST, clean + ".html")];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
}

let broken = 0;
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(href) || href.startsWith("//") || href.includes("${")) continue;
    const [path, hash] = href.split("#");
    const target = path ? resolve(path) : page;
    if (!target) {
      console.log(`✗ ${page} → ${href} (missing page)`);
      broken++;
    } else if (hash && target.endsWith(".html") && !idsOf(target).has(hash)) {
      console.log(`✗ ${page} → ${href} (missing #${hash})`);
      broken++;
    }
  }
}
console.log(broken ? `\n${broken} broken link(s) across ${pages.length} pages` : `✓ All internal links OK across ${pages.length} pages`);
process.exit(broken ? 1 : 0);
