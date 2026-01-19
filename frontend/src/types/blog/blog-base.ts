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
}

interface BlogPage extends BlogHomeCard {
    content: string;
}

interface BlogCursorResponse {
    loading: Boolean;
    error: string | null;
    data: BlogHomeCard[];
    cursor: UUID | null;
    hasNext: Boolean;
}

export type { UUID, BlogBase, BlogHomeCard, BlogPage, BlogCursorResponse };
