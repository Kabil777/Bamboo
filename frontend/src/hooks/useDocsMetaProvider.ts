import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import { buildCollabRoomName } from "@/lib/collabRoomName";

const DEFAULT_COLLAB_URL = "ws://127.0.0.1:1234/collab";
const COLLAB_URL = process.env.NEXT_PUBLIC_COLLAB_WS_URL || DEFAULT_COLLAB_URL;

export function useDocsMetaProvider(docId: string | undefined) {
    const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

    useEffect(() => {
        if (!docId) return;

        const p = new HocuspocusProvider({
            url: COLLAB_URL,
            name: buildCollabRoomName("docs-sidebar", docId),
        });

        setProvider(p);

        return () => {
            p.destroy();
            setProvider(null);
        };
    }, [docId]);

    return provider;
}
