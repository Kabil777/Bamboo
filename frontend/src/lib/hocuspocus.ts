import { HocuspocusProvider } from "@hocuspocus/provider";

let provider: HocuspocusProvider | null = null;

export function getHocuspocusProvider() {
    if (!provider) {
        provider = new HocuspocusProvider({
            url: "ws://127.0.0.1:1234/collaboration",
            name: "test-document",
        });
    }

    return provider;
}
