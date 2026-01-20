import { Docs } from "@/types/docs/docs-base";

export default function injectOverview(
    tree: Docs["tree"],
    content: string,
): Docs["tree"] {
    const hasOverview = tree.some((n) => n.id === "overview");

    if (hasOverview) return tree;

    return [
        {
            id: "overview",
            title: "Overview",
            content: content,
            subTree: [],
        },
        ...tree,
    ];
}
