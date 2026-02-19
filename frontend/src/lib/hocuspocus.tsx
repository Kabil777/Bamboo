import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildCollabRoomName, type CollabRoomType } from "./collabRoomName";
import { COLLAB_URL } from "./collabConfig";
import {
    isWsForbidden,
    refreshSessionForCollab,
    shouldRefreshWsAuth,
} from "./collabAuth";

export function useHocuspocusProvider(
    documentId: string,
    roomType: CollabRoomType,
    parentId?: string,
    options?: { enabled?: boolean },
) {
    const router = useRouter();
    const providerRef = useRef<HocuspocusProvider | null>(null);
    const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

    useEffect(() => {
        const enabled = options?.enabled ?? true;
        if (!enabled) {
            if (providerRef.current) {
                providerRef.current.destroy();
                providerRef.current = null;
            }
            setProvider(null);
            return;
        }
        const roomName = buildCollabRoomName(roomType, documentId, parentId);

        if (
            !providerRef.current ||
            providerRef.current.configuration.name !== roomName
        ) {
            if (providerRef.current) {
                providerRef.current.destroy();
            }

            const newProvider = new HocuspocusProvider({
                url: COLLAB_URL,
                name: roomName,
                onAuthenticationFailed: async ({ reason }) => {
                    if (isWsForbidden(undefined, reason)) {
                        providerRef.current?.destroy();
                        router.push("/forbidden");
                        return;
                    }

                    if (!shouldRefreshWsAuth(undefined, reason)) return;

                    try {
                        await refreshSessionForCollab();
                        await providerRef.current?.connect();
                    } catch {
                        // Keep default provider behavior when refresh fails.
                    }
                },
                onClose: async ({ event }) => {
                    if (isWsForbidden(event?.code, event?.reason)) {
                        providerRef.current?.destroy();
                        router.push("/forbidden");
                        return;
                    }

                    if (!shouldRefreshWsAuth(event?.code, event?.reason)) {
                        return;
                    }

                    try {
                        await refreshSessionForCollab();
                        await providerRef.current?.connect();
                    } catch {
                        // Keep default provider behavior when refresh fails.
                    }
                },
            });

            providerRef.current = newProvider;
            setProvider(newProvider);
        }

        return () => {
            // Cleanup on unmount
            if (providerRef.current) {
                providerRef.current.destroy();
                providerRef.current = null;
            }
        };
    }, [documentId, roomType, parentId, router, options?.enabled]);

    return provider;
}
