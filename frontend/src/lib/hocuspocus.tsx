import { useAppState } from "@/hooks/ReduxHooks";
import { HocuspocusProvider } from "@hocuspocus/provider";
import React from "react";

export function useHocuspocusProvider(
  documentId: string,
  room: "blog" | "docs",
) {
  const providerRef = React.useRef<HocuspocusProvider | null>(null);

  if (!providerRef.current) {
    providerRef.current = new HocuspocusProvider({
      url: "ws://127.0.0.1:1234/collaboration",
      name: documentId,
    });
  }

  React.useEffect(() => {
    return () => {
      providerRef.current?.destroy();
      providerRef.current = null;
    };
  }, []);

  return providerRef.current;
}
