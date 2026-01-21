import { useAppState } from "@/hooks/ReduxHooks";
import { HocuspocusProvider } from "@hocuspocus/provider";

let provider: HocuspocusProvider | null = null;

export function getHocuspocusProvider() {
    if (!provider) {
        provider = new HocuspocusProvider({
            url: "ws://127.0.0.1:1234/collaboration",
            name: "0b428649-7ad9-453b-8619-79ed9b099925",
        });
    }

    return provider;
}
