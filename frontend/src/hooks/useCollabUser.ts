import React from "react";
import { useAppState } from "./ReduxHooks";

export function useCollabUser() {
    const user = useAppState((s) => s.userReducer.user);

    // Generate a random light color (RGB values between 180 and 255)
    function randomLightColor() {
        const r = Math.floor(180 + Math.random() * 75);
        const g = Math.floor(180 + Math.random() * 75);
        const b = Math.floor(180 + Math.random() * 75);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    const stableDataRef = React.useRef<{
        id: string;
        color: string;
    }>();
    const stableNameRef = React.useRef<string>("");

    if (!stableDataRef.current) {
        const storageKey = "bamboo_collab_user_id";
        const nameKey = "bamboo_collab_user_name";
        let persistedId = "";
        let persistedName = "";
        try {
            persistedId = sessionStorage.getItem(storageKey) || "";
            persistedName = sessionStorage.getItem(nameKey) || "";
        } catch {
            // Ignore storage errors (private mode, etc.)
        }

        const fallbackId = persistedId || crypto.randomUUID();
        stableDataRef.current = {
            id: fallbackId,
            color: randomLightColor(),
        };
        const inferredName =
            persistedId && !persistedId.startsWith("client-")
                ? persistedId
                : "";
        stableNameRef.current = persistedName || inferredName || "";

        if (!persistedId) {
            try {
                sessionStorage.setItem(storageKey, fallbackId);
            } catch {
                // Ignore storage errors
            }
        }
    }

    React.useEffect(() => {
        if (!user) return;
        const storageKey = "bamboo_collab_user_id";
        const nameKey = "bamboo_collab_user_name";
        let persistedId = "";
        try {
            persistedId = sessionStorage.getItem(storageKey) || "";
        } catch {
            // Ignore storage errors
        }

        if (!persistedId) {
            const preferredId = user.email?.trim() || user.handle?.trim();
            if (!preferredId) return;
            try {
                sessionStorage.setItem(storageKey, preferredId);
            } catch {
                // Ignore storage errors
            }
            stableDataRef.current = {
                id: preferredId,
                color: stableDataRef.current!.color,
            };
        }

        const preferredName =
            user.name?.trim() || user.handle?.trim() || user.email?.trim();
        if (preferredName) {
            try {
                sessionStorage.setItem(nameKey, preferredName);
            } catch {
                // Ignore storage errors
            }
            stableNameRef.current = preferredName;
        }
    }, [user]);

    return React.useMemo(
        () => ({
            id: stableDataRef.current!.id,
            name: stableNameRef.current || "",
            avatarUrl: user?.profileImg || "",
            color: stableDataRef.current!.color,
        }),
        [user?.name, user?.handle, user?.email, user?.profileImg],
    );
}
