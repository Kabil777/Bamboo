import React from "react";
import { useAppState } from "./ReduxHooks";

export function useCollabUser() {
    const user = useAppState((s) => s.userReducer.user);

    const stableDataRef = React.useRef<{
        id: string;
        color: string;
    }>({
        id: crypto.randomUUID(),
        color: `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`,
    });

    return React.useMemo(
        () => ({
            id: stableDataRef.current.id,
            name: user?.name || "Anonymous",
            color: stableDataRef.current.color,
        }),
        [user?.name],
    );
}
