import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useRef, useState } from "react";
import { buildCollabRoomName, type CollabRoomType } from "./collabRoomName";
import { refreshSessionForCollab, shouldRefreshWsAuth } from "./collabAuth";

const DEFAULT_COLLAB_URL = "ws://localhost:1234/collab";
const COLLAB_URL = process.env.NEXT_PUBLIC_COLLAB_WS_URL || DEFAULT_COLLAB_URL;

export function useHocuspocusProvider(
    documentId: string,
    roomType: CollabRoomType,
) {
    const providerRef = useRef<HocuspocusProvider | null>(null);
    const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

    useEffect(() => {
        const roomName = buildCollabRoomName(roomType, documentId);

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
                    if (!shouldRefreshWsAuth(undefined, reason)) return;

                    try {
                        await refreshSessionForCollab();
                        await providerRef.current?.connect();
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
    }, [documentId, roomType]);

    return provider;
}
