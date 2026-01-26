import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useRef, useState } from "react";

export function useHocuspocusProvider(
  documentId: string,
  room: "blog" | "docs",
) {
  const providerRef = useRef<HocuspocusProvider | null>(null);
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

  useEffect(() => {
    // Create provider only once when documentId changes
    if (!providerRef.current || providerRef.current.configuration.name !== documentId) {
      // Destroy existing provider if documentId changed
      if (providerRef.current) {
        providerRef.current.destroy();
      }

      const newProvider = new HocuspocusProvider({
        url: "ws://127.0.0.1:1234/",
        name: documentId,
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
  }, [documentId]);

  return provider;
}
