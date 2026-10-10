import { visit, SKIP } from "unist-util-visit";
import { VISUALS } from "./visuals";

/**
 * Replaces a paragraph containing only `[[chart:capacity]]`, `[[diagram:sizing]]`, etc.
 * with the pre-rendered visual from visuals.ts. Unknown names fail the build.
 */
export default function rehypeVisuals() {
  return (tree: any, file: any) => {
    visit(tree, "element", (node: any, index: number | undefined, parent: any) => {
      if (node.tagName !== "p" || node.children?.length !== 1 || node.children[0].type !== "text") return;
      const m = node.children[0].value.trim().match(/^\[\[([a-z]+:[a-z-]+)\]\]$/);
      if (!m || !parent || index === undefined) return;
      const render = VISUALS[m[1]];
      if (!render) throw new Error(`Unknown visual "[[${m[1]}]]" in ${file?.path ?? "markdown"}`);
      parent.children[index] = { type: "raw", value: render() };
      return SKIP;
    });
  };
}
