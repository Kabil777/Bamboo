import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildCollabRoomName } from "@/lib/collabRoomName";
import { COLLAB_URL } from "@/lib/collabConfig";
import {
    isWsForbidden,
    refreshSessionForCollab,
    shouldRefreshWsAuth,
} from "@/lib/collabAuth";

export function useDocsMetaProvider(
    docId: string | undefined,
    options?: { enabled?: boolean },
) {
    const router = useRouter();
    const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

    useEffect(() => {
        const enabled = options?.enabled ?? true;
        if (!enabled) {
            setProvider(null);
            return;
        }
        if (!docId) return;
        let provider: HocuspocusProvider | null = null;

        const p = new HocuspocusProvider({
            url: COLLAB_URL,
            name: buildCollabRoomName("docs-sidebar", docId),
            onAuthenticationFailed: async ({ reason }) => {
                if (isWsForbidden(undefined, reason)) {
                    provider?.destroy();
                    router.push("/forbidden");
                    return;
                }

                if (!shouldRefreshWsAuth(undefined, reason)) return;

                try {
                    await refreshSessionForCollab();
                    await provider?.connect();
                } catch {
                    // Keep default provider behavior when refresh fails.
                }
            },
            onClose: async ({ event }) => {
                if (isWsForbidden(event?.code, event?.reason)) {
                    provider?.destroy();
                    router.push("/forbidden");
                    return;
                }

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
    }, [docId, router, options?.enabled]);

    return provider;
}
