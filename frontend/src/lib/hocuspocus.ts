import { HocuspocusProvider } from "@hocuspocus/provider";

let provider: HocuspocusProvider | null = null;

export function getHocuspocusProvider() {
    if (!provider) {
        provider = new HocuspocusProvider({
          url: "ws://127.0.0.1:1234/collaboration",
          name: "1add6f66-f67f-4e18-8f2f-405a8de5cdc0",
        });
    }

    return provider;
}
