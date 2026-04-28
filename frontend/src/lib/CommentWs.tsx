"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
    isWsForbidden,
    refreshSessionForCollab,
    shouldRefreshWsAuth,
} from "./collabAuth";

export function useCommentWebSocket(
    room: string | null,
    options?: { enabled?: boolean },
) {
    const router = useRouter();
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<number | null>(null);
    const queuedMessagesRef = useRef<string[]>([]);
    const reconnectAttemptRef = useRef(0);
    const manuallyClosedRef = useRef(false);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);
    const forbiddenNotifiedRef = useRef(false);
    const expiredNotifiedRef = useRef(false);

    useEffect(() => {
        const enabled = options?.enabled ?? true;
        if (!enabled || !room) {
            manuallyClosedRef.current = true;
            if (reconnectTimerRef.current) {
                window.clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
            socketRef.current?.close();
            socketRef.current = null;
            setIsConnected(false);
            setLastMessage(null);
            return;
        }

        const wsUrl = process.env.NEXT_PUBLIC_COMMENT_WS_URL;
        if (!wsUrl) {
            console.error("NEXT_PUBLIC_COMMENT_WS_URL is not configured");
            return;
        }

        forbiddenNotifiedRef.current = false;
        expiredNotifiedRef.current = false;
        manuallyClosedRef.current = false;

        const socket = new WebSocket(
            `${wsUrl}?room=${encodeURIComponent(room)}`,
        );

        socketRef.current = socket;

        socket.onopen = () => {
            reconnectAttemptRef.current = 0;
            setIsConnected(true);
            if (queuedMessagesRef.current.length > 0) {
                const pending = [...queuedMessagesRef.current];
                queuedMessagesRef.current = [];
                pending.forEach((message) => socket.send(message));
            }
        };

        socket.onmessage = (event) => {
            if (typeof event.data === "string") {
                setLastMessage(event.data);
            }
        };

        socket.onclose = async (event) => {
            setIsConnected(false);
            if (reconnectTimerRef.current) {
                window.clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }

            if (manuallyClosedRef.current) {
                return;
            }

            if (isWsForbidden(event.code, event.reason)) {
                if (!forbiddenNotifiedRef.current) {
                    forbiddenNotifiedRef.current = true;
                    toast.error(
                        "You do not have access to this comment thread.",
                    );
                }
                router.push("/forbidden");
                return;
            }

            if (!shouldRefreshWsAuth(event.code, event.reason)) {
                const attempt = reconnectAttemptRef.current;
                const nextDelay = Math.min(1000 * 2 ** attempt, 12000);
                reconnectAttemptRef.current = Math.min(attempt + 1, 5);
                reconnectTimerRef.current = window.setTimeout(() => {
                    setRetryKey((value) => value + 1);
                }, nextDelay);
                return;
            }

            try {
                await refreshSessionForCollab();
                setRetryKey((value) => value + 1);
            } catch {
                if (!expiredNotifiedRef.current) {
                    expiredNotifiedRef.current = true;
                    toast.warning("Session expired. Please sign in again.");
                }
                router.replace("/login");
            }
        };

        return () => {
            manuallyClosedRef.current = true;
            if (reconnectTimerRef.current) {
                window.clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
            socket.close();
            socketRef.current = null;
            setIsConnected(false);
        };
    }, [room, router, options?.enabled, retryKey]);

    const sendMessage = useCallback((payload: unknown) => {
        const socket = socketRef.current;
        const serialized = JSON.stringify(payload);

        if (!socket) {
            return false;
        }

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(serialized);
            return true;
        }

        if (socket.readyState === WebSocket.CONNECTING) {
            queuedMessagesRef.current.push(serialized);
            return true;
        }

        return false;
    }, []);

    return {
        socketRef,
        isConnected,
        lastMessage,
        sendMessage,
    };
}
