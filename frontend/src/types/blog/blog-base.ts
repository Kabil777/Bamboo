type UUID = string;

interface BlogBase {
    id: UUID;
    title: string;
    authorId: UUID;
}

interface BlogHomeCard extends BlogBase {
    coverUrl: string;
    description: string;
    createdAt: string;
    tags: string[];
    authorName: string | null;
}

interface BlogPage extends BlogHomeCard {
    content: string;
}

interface BlogContentState {
    entities: Record<UUID, BlogPage>;
    loadingById: Record<UUID, boolean>;
    errorById: Record<UUID, string | null>;
}
interface BlogCursorResponse {
    blogLoading: Boolean;
    blogLoadMore: Boolean;
    error: string | null;
    data: BlogHomeCard[];
    cursor: UUID | null;
    hasNext: Boolean;
}

export type {
    UUID,
    BlogBase,
    BlogHomeCard,
    BlogPage,
    BlogCursorResponse,
    BlogContentState,
};
