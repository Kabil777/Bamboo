import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import { buildCollabRoomName } from "@/lib/collabRoomName";
import {
    refreshSessionForCollab,
    shouldRefreshWsAuth,
} from "@/lib/collabAuth";

const DEFAULT_COLLAB_URL = "ws://127.0.0.1:1234/collab";
const COLLAB_URL = process.env.NEXT_PUBLIC_COLLAB_WS_URL || DEFAULT_COLLAB_URL;

export function useDocsMetaProvider(docId: string | undefined) {
    const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

    useEffect(() => {
        if (!docId) return;
        let provider: HocuspocusProvider | null = null;

        const p = new HocuspocusProvider({
            url: COLLAB_URL,
            name: buildCollabRoomName("docs-sidebar", docId),
            onAuthenticationFailed: async ({ reason }) => {
                if (!shouldRefreshWsAuth(undefined, reason)) return;

                try {
                    await refreshSessionForCollab();
                    await provider?.connect();
                } catch {
                    // Keep default provider behavior when refresh fails.
                }
            },
            onClose: async ({ event }) => {
                if (!shouldRefreshWsAuth(event?.code, event?.reason)) {
                    return;
                }

                try {
                    await refreshSessionForCollab();
                    await provider?.connect();
                } catch {
                    // Keep default provider behavior when refresh fails.
                }
            },
        });
        provider = p;

        setProvider(p);

        return () => {
            p.destroy();
            setProvider(null);
        };
    }, [docId]);

    return provider;
}
