import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/** Buying guides, comparisons, explainers. URL: /posts/<file-name>/ */
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    /** Optional shorter <title> tag when the H1 is long (keep under ~60 chars). */
    seoTitle: z.string().optional(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z
      .enum(["best", "comparison", "guide", "cost", "explainer"])
      .default("guide"),
    /** Short badge shown on cards, e.g. "Head-to-head". */
    tag: z.string().optional(),
    heroKeywords: z.array(z.string()).optional(),
    /** Model ids (src/data/models.ts) shown as a "Top picks" box under the intro. */
    picks: z
      .array(z.object({ id: z.string(), label: z.string() }))
      .optional(),
    /** 3–5 bullet "key takeaways" rendered above the article body. */
    takeaways: z.array(z.string()).optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    /** Lower = higher on hub pages. */
    order: z.number().default(50),
  }),
});

/** Long-form review body for each model page. File name must match a model id. */
const reviews = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reviews" }),
  schema: z.object({
    updatedDate: z.coerce.date(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

export const collections = { posts, reviews };
