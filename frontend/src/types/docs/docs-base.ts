type UUID = string;

interface DocsBase {
    id: UUID;
    title: string;
}

interface DocsHomeCard extends DocsBase {
    coverUrl: string;
    description: string;
    createdAt: string;
}

interface DocsTreeNode {
    id: UUID;
    title: string;
    content: string;
    subTree: DocsTreeNode[];
}

interface Docs extends DocsHomeCard {
    content: string;
    authorId: UUID;
    tags: string[];
    tree: DocsTreeNode[];
}

interface DocsState {
    entities: Record<UUID, Docs>;
    loadingById: Record<UUID, boolean>;
    errorById: Record<UUID, boolean>;
}

export type { DocsHomeCard, Docs, DocsState, DocsTreeNode };
