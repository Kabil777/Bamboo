"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as Y from "yjs";

const CollabContext = createContext<HocuspocusProvider | null>(null);

export function CollabProvider({
    documentId,
    children,
}: {
    documentId: string;
    children: React.ReactNode;
}) {
    const providerRef = useRef<HocuspocusProvider | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!documentId) return;

        const provider = new HocuspocusProvider({
            url: "ws://localhost:1234",
            name: `docs-meta:${documentId}`,
            document: new Y.Doc(),
            connect: true,
        });

        providerRef.current = provider;
        setReady(true); // 🔥 trigger re-render

        return () => {
            provider.destroy();
            providerRef.current = null;
            setReady(false);
        };
    }, [documentId]);

    if (!ready || !providerRef.current) return null;

    return (
        <CollabContext.Provider value={providerRef.current}>
            {children}
        </CollabContext.Provider>
    );
}

export const useCollab = () => {
    const ctx = useContext(CollabContext);
    if (!ctx) {
        throw new Error("useCollab must be used inside CollabProvider");
    }
    return ctx;
};
