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
    const previousUserIdsRef = useRef<Set<string>>(new Set());
    const mountedRef = useRef(false);
    const localUserIdRef = useRef<string>(String(currentUser.userId));

    useEffect(() => {
        if (!provider) return;

        const awareness = provider.awareness;

        provider.on("status", ({ status }) => {
            if (status === "connected") {
                provider.awareness?.setLocalStateField("user", {
                    userId: String(currentUser.userId),
                    name: currentUser.name,
                    color: currentUser.color,
                    location,
                });
            }
        });

        localUserIdRef.current = String(currentUser.userId);

        let timeoutId: NodeJS.Timeout;

        const handleChange = () => {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                const usersByUserId = new Map<string, userAwareness>();

                console.log("=== Awareness States ===");
                console.log(
                    "Total awareness states:",
                    awareness?.getStates().size,
                );

                awareness?.getStates().forEach((state, clientId) => {
                    console.log(`Client ${clientId}:`, state);

                    if (!state.user?.userId || !state.user?.name) {
                        return;
                    }

                    const user: userAwareness = {
                        clientId,
                        userId: state.user.userId,
                        name: state.user.name,
                        color: state.user.color,
                        cursor: state.user.cursor,
                        location: state.user.location,
                    };

                    console.log(`Adding user:`, user);
                    usersByUserId.set(user.userId, user);
                });

                const uniqueUsers = Array.from(usersByUserId.values());
                console.log("Unique users:", uniqueUsers);

                const currentUserIds = new Set(
                    uniqueUsers.map((u) => u.userId),
                );

                setOnlineUsers(uniqueUsers);

                if (mountedRef.current) {
                    

                    previousUserIdsRef.current.forEach((userId) => {
                        if (
                            !currentUserIds.has(userId) &&
                            userId !== localUserIdRef.current
                        ) {
                            console.log(`User ${userId} left`);
                            toast.info("User left");
                        }
                    });
                }

                previousUserIdsRef.current = new Set(currentUserIds);

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
            mountedRef.current = false;
            previousUserIdsRef.current.clear();
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
