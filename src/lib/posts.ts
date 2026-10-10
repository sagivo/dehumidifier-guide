import { getCollection, type CollectionEntry } from "astro:content";

export type Category = CollectionEntry<"posts">["data"]["category"];

export const CATEGORY_LABEL: Record<Category, string> = {
  best: "Best picks",
  comparison: "Head-to-head",
  guide: "Buying advice",
  cost: "Cost breakdown",
  explainer: "Explainer",
};

export const CATEGORY_ORDER: Category[] = ["best", "comparison", "guide", "cost", "explainer"];

export async function getPosts() {
  return (await getCollection("posts")).sort(
    (a, b) => a.data.order - b.data.order || b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

/**
 * Related posts: same category first, then posts sharing picked models, then the rest.
 */
export function relatedPosts(
  post: CollectionEntry<"posts">,
  all: CollectionEntry<"posts">[],
  n = 3
) {
  const myPicks = new Set(post.data.picks?.map((p) => p.id) ?? []);
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => {
      let s = p.data.category === post.data.category ? 3 : 0;
      s += (p.data.picks ?? []).filter((x) => myPicks.has(x.id)).length;
      if (p.data.category === "best") s += 1;
      return { p, s };
    })
    .sort((a, b) => b.s - a.s || a.p.data.order - b.p.data.order)
    .slice(0, n)
    .map((x) => x.p);
}
