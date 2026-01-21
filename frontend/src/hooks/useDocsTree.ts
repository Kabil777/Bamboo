import * as Y from "yjs";
import { v7 as uuidv7 } from "uuid";
import { useEffect, useState } from "react";

function buildTree(nodes: any[]) {
    const pages = nodes.filter((n) => n.level === 0);
    const subs = nodes.filter((n) => n.level === 1);

    return pages.map((page) => ({
        ...page,
        children: subs.filter((s) => s.parentId === page.id),
    }));
}

export function useDocsTree(provider: any) {
    const [tree, setTree] = useState<any[]>([]);

    useEffect(() => {
        const ydoc = provider.document;
        const pages = ydoc.getArray<Y.Map<any>>("pages");

        const sync = () => {
            const nodes = pages.toArray().map((p) => ({
                id: p.get("id"),
                title: p.get("title"),
                parentId: p.get("parentId"),
                level: p.get("level"),
                order: p.get("order"),
            }));
            setTree(buildTree(nodes));
        };

        pages.observeDeep(sync);
        sync();

        return () => pages.unobserveDeep(sync);
    }, [provider]);

    const addPage = (parentId: string | null) => {
        const ydoc = provider.document;
        const pages = ydoc.getArray<Y.Map<any>>("pages");

        ydoc.transact(() => {
            let level = 0;

            if (parentId) {
                const parent = pages
                    .toArray()
                    .find((p) => p.get("id") === parentId);
                if (!parent || parent.get("level") === 1) return;
                level = 1;
            }

            const page = new Y.Map();
            page.set("id", uuidv7());
            page.set("title", "Untitled");
            page.set("parentId", parentId);
            page.set("level", level);
            page.set("order", Date.now());

            pages.push([page]);
        });
    };

    const deletePage = (pageId: string) => {
        const pages = provider.document.getArray("pages");
        const index = pages.toArray().findIndex((p) => p.get("id") === pageId);
        if (index !== -1) pages.delete(index, 1);
    };

    return { tree, addPage, deletePage };
}
