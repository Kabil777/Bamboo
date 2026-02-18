import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useRef, useState } from "react";
import { buildCollabRoomName, type CollabRoomType } from "./collabRoomName";

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
