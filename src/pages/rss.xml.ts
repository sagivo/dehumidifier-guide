import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../lib/posts";
import { SITE_NAME, SITE_DESCRIPTION } from "../lib/site";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${SITE_NAME}: dehumidifier guides`,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.updatedDate ?? p.data.pubDate,
      link: `/posts/${p.id}/`,
    })),
  });
}
