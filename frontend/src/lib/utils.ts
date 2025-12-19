import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PhrasingContent, Heading } from "mdast";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function extractTextFromNode(node: PhrasingContent): string {
    if (node.type === "text") return node.value;
    if (node.type === "inlineCode") return node.value;
    if ("children" in node && Array.isArray(node.children)) {
        return node.children.map(extractTextFromNode).join("");
    }
    return "";
}
function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function extractToc(markdown: string) {
    const tree = unified().use(remarkParse).parse(markdown);

    const toc: { depth: number; value: string; id: string }[] = [];

    visit(tree, "heading", (node: Heading) => {
        const text = node.children.map(extractTextFromNode).join(" ").trim();
        if (!text) return;

        const id = slugify(text);
        toc.push({ depth: node.depth, value: text, id });
    });
    return toc;
}