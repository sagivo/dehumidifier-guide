import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import rehypeAffiliate from './src/lib/rehype-affiliate.ts';
import rehypeVisuals from './src/lib/rehype-visuals.ts';

const SITE = 'https://dehumidifier-guide.pages.dev';

// Real per-page lastmod from frontmatter (Google ignores lastmod that's always "now").
function lastmodMap() {
  const map = new Map();
  for (const [dir, prefix] of [['src/content/posts', '/posts/'], ['src/content/reviews', '/dehumidifiers/']]) {
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      const src = readFileSync(`${dir}/${f}`, 'utf8');
      const m = src.match(/^updatedDate:\s*["']?([\d-]+)/m) ?? src.match(/^pubDate:\s*["']?([\d-]+)/m);
      if (m) map.set(`${SITE}${prefix}${f.replace(/\.md$/, '')}/`, new Date(m[1]).toISOString());
    }
  }
  return map;
}
const LASTMOD = lastmodMap();

// Keep in sync with SITE_URL in src/lib/site.ts.
export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !/\/(contact|privacy|404)\/?$/.test(page),
      serialize(item) {
        const lastmod = LASTMOD.get(item.url);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  markdown: { rehypePlugins: [rehypeVisuals, rehypeAffiliate] },
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: { ssr: { external: ['@resvg/resvg-js', 'satori'] } },
});
