import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type userAwareness = {
    clientId: number;
    userId: string;
    name: string;
    color?: string;
    cursor?: any;
    location: "editor" | "sidebar";
};

export function useCollaborativeAwareness(
    provider: HocuspocusProvider | null,
    currentUser: { name: string; userId: string; color?: string },
    location: "editor" | "sidebar",
    options?: { suppressNotifications?: boolean },
) {
    const [onlineUsers, setOnlineUsers] = useState<userAwareness[]>([]);
    const previousUsersRef = useRef<Map<string, string>>(new Map());
    const mountedRef = useRef(false);
    const localUserIdRef = useRef<string>(String(currentUser.userId));
    const readyToNotifyRef = useRef(false);
    const authenticatedRef = useRef(false);

    useEffect(() => {
        if (!provider) return;

        const awareness = provider.awareness;
        const setLocalAwareness = () => {
            if (!authenticatedRef.current) return;
            const nameReady =
                typeof currentUser.name === "string" &&
                currentUser.name.trim().length > 0 &&
                currentUser.name !== "Anonymous";
            if (!nameReady) return;

            provider.awareness?.setLocalStateField("user", {
                userId: String(currentUser.userId),
                name: currentUser.name,
                color: currentUser.color,
                location,
            });
            if (!readyToNotifyRef.current) {
                readyToNotifyRef.current = true;
            }
        };
        const handleStatus = ({ status }: { status: string }) => {
            if (status === "connected") {
                setLocalAwareness();
            }
        };
        const handleAuthenticated = () => {
            authenticatedRef.current = true;
            setLocalAwareness();
        };
        provider.on("status", handleStatus);
        provider.on("authenticated", handleAuthenticated);
        setLocalAwareness();

        localUserIdRef.current = String(currentUser.userId);

        let timeoutId: NodeJS.Timeout;

        const handleChange = () => {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                const usersByUserId = new Map<string, userAwareness>();

                awareness?.getStates().forEach((state, clientId) => {
                    const userState = state?.user ?? {};
                    const userId = userState.userId
                        ? String(userState.userId)
                        : `client-${clientId}`;
                    const name =
                        typeof userState.name === "string" &&
                        userState.name.trim().length > 0
                            ? userState.name
                            : "Anonymous";

                    const user: userAwareness = {
                        clientId,
                        userId,
                        name,
                        color: userState.color,
                        cursor: userState.cursor,
                        location:
                            userState.location === "sidebar"
                                ? "sidebar"
                                : "editor",
                    };

                    usersByUserId.set(user.userId, user);
                });

                const uniqueUsers = Array.from(usersByUserId.values()).filter(
                    (user) =>
                        user.name.trim().length > 0 &&
                        user.name !== "Anonymous" &&
                        !user.userId.startsWith("client-"),
                );

                const currentUserIds = new Set(
                    uniqueUsers.map((u) => u.userId),
                );

                setOnlineUsers(uniqueUsers);

                if (
                    mountedRef.current &&
                    readyToNotifyRef.current &&
                    !options?.suppressNotifications
                ) {
                    uniqueUsers.forEach((user) => {
                        if (
                            !previousUsersRef.current.has(user.userId) &&
                            user.userId !== localUserIdRef.current
                        ) {
                            toast.info(`${user.name} joined`);
                        }
                    });

                    previousUsersRef.current.forEach((name, userId) => {
                        if (
                            !currentUserIds.has(userId) &&
                            userId !== localUserIdRef.current
                        ) {
                            toast.info(`${name} left`);
                        }
                    });
                }

                previousUsersRef.current = new Map(
                    uniqueUsers.map((user) => [user.userId, user.name]),
                );

                if (!mountedRef.current) {
                    mountedRef.current = true;
                }
            }, 100);
        };

        awareness?.on("change", handleChange);
        handleChange(); // Initial call

        return () => {
            clearTimeout(timeoutId);
            awareness?.off("change", handleChange);
            provider.off("status", handleStatus);
            provider.off("authenticated", handleAuthenticated);
            mountedRef.current = false;
            previousUsersRef.current.clear();
            authenticatedRef.current = false;
        };
    }, [
        provider,
        currentUser.name,
        currentUser.color,
        currentUser.userId,
        location,
    ]);

    return {
        onlineUsers,
        editorUsers: onlineUsers.filter((u) => u.location === "editor"),
        sidebarUsers: onlineUsers.filter((u) => u.location === "sidebar"),
        totalUsers: onlineUsers.length,
    };
}
