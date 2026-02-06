import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";

export function useDocsMetaProvider(docId: string | undefined) {
    const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

    useEffect(() => {
        if (!docId) return;

        const p = new HocuspocusProvider({
            url: "ws://127.0.0.1:1234/",
            name: `docs:sidebar:20b16ed6-50da-41a8-bc3a-e29b6920e3ba`,
        });

        setProvider(p);

        return () => {
            p.destroy();
            setProvider(null);
        };
    }, [docId]);

    return provider;
}
