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
) {
    const [onlineUsers, setOnlineUsers] = useState<userAwareness[]>([]);
    const previousUsersRef = useRef<Map<string, string>>(new Map());
    const mountedRef = useRef(false);
    const localUserIdRef = useRef<string>(String(currentUser.userId));

    useEffect(() => {
        if (!provider) return;

        const awareness = provider.awareness;
        const setLocalAwareness = () => {
            provider.awareness?.setLocalStateField("user", {
                userId: String(currentUser.userId),
                name: currentUser.name,
                color: currentUser.color,
                location,
            });
        };
        const handleStatus = ({ status }: { status: string }) => {
            if (status === "connected") {
                setLocalAwareness();
            }
        };
        provider.on("status", handleStatus);
        setLocalAwareness();

        localUserIdRef.current = String(currentUser.userId);

        let timeoutId: NodeJS.Timeout;

        const handleChange = () => {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                const usersByUserId = new Map<string, userAwareness>();

                awareness?.getStates().forEach((state, clientId) => {
                    const userId = state.user?.userId
                        ? String(state.user.userId)
                        : `client-${clientId}`;
                    const name =
                        typeof state.user?.name === "string" &&
                        state.user.name.trim().length > 0
                            ? state.user.name
                            : "Anonymous";

                    const user: userAwareness = {
                        clientId,
                        userId,
                        name,
                        color: state.user.color,
                        cursor: state.user.cursor,
                        location: state.user.location === "sidebar" ? "sidebar" : "editor",
                    };

                    usersByUserId.set(user.userId, user);
                });

                const uniqueUsers = Array.from(usersByUserId.values());

                const currentUserIds = new Set(
                    uniqueUsers.map((u) => u.userId),
                );

                setOnlineUsers(uniqueUsers);

                if (mountedRef.current) {
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
            mountedRef.current = false;
            previousUsersRef.current.clear();
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
