const DEFAULT_COLLAB_URL = "ws://localhost:1234/collab";

export const COLLAB_URL =
    process.env.NEXT_PUBLIC_COLLAB_WS_URL || DEFAULT_COLLAB_URL;
