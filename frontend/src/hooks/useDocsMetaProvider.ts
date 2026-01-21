import { HocuspocusProvider } from "@hocuspocus/provider";
import { useRef } from "react";

export function useDocsMetaProvider(docId: string) {
    const ref = useRef<HocuspocusProvider | null>(null);

    if (!ref.current) {
        ref.current = new HocuspocusProvider({
            url: "ws://127.0.0.1:1234/collaboration",
            name: `docs-meta:${docId}`,
        });
    }

    return ref.current;
}
