export type CollabRoomType = "blog" | "docs-page" | "docs-sidebar";

export function buildCollabRoomName(
    roomType: CollabRoomType,
    documentId: string,
) {
    if (roomType === "blog") return `blog:${documentId}`;
    if (roomType === "docs-page") return `docs:page:${documentId}`;
    return `docs:sidebar:${documentId}`;
}
