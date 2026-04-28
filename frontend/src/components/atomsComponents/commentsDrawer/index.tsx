"use client";

import api from "@/api/axios";
import { Button } from "@/components/shadcnUI/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/shadcnUI/drawer";
import { MessageCircle, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcnUI/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/shadcnUI/textarea";
import { useCommentWebSocket } from "@/lib/CommentWs";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";


// ─── Types ───────────────────────────────────────────
interface CommentAuthor {
    id: string;
    name: string;
    handle?: string;
    avatarUrl?: string | null;
}

interface Comment {
    id: string;
    room: string;
    content: string;
    author: CommentAuthor | null;
    createdAt: string;
    replies?: CommentReply[];
}

interface CommentReply {
    id: string;
    content: string;
    author: CommentAuthor | null;
    createdAt?: string;
}

interface CommentCursorResponse {
    items: Comment[];
    hasNext: boolean;
    cursor: string | null;
}

type CommentWsMessage =
    | {
          status: "TYPING";
          userId: string;
          userName: string;
          timestamp: string;
      }
    | {
          type: "COMMENT_PUBLISHED" | "COMMENT_DELETED";
          room: string;
          userId: string;
          userName?: string;
          content?: string;
          commentId?: string;
          timestamp: string;
          isReply: boolean;
          replyId: string | null;
      };

function buildCommentRoomName(contentType: "blog" | "docs", contentId: string) {
    return `comment:${contentType}:${contentId}`;
}

function formatTypingUsers(users: string[]) {
    if (users.length === 0) {
        return "";
    }

    if (users.length === 1) {
        return `${users[0]} is typing...`;
    }

    return `${users[0]} +${users.length - 1} is typing...`;
}

function isTemporaryCommentId(commentId: string) {
    return commentId.startsWith("temp-");
}

function isOwnedByCurrentUser(
    author: CommentAuthor | null,
    currentUser: RootState["userReducer"]["user"],
) {
    if (!author || !currentUser) {
        return false;
    }

    if (author.handle && currentUser.handle) {
        return author.handle === currentUser.handle;
    }

    return author.name === currentUser.name;
}

function isSameAuthor(a: CommentAuthor | null, b: CommentAuthor | null) {
    if (!a || !b) {
        return false;
    }

    if (a.id && b.id) {
        if (a.id === b.id) {
            return true;
        }
    }

    if (a.handle && b.handle) {
        if (a.handle === b.handle) {
            return true;
        }
    }

    return !!a.name && !!b.name && a.name === b.name;
}

function isNearInTime(a?: string, b?: string, thresholdMs = 2 * 60 * 1000) {
    if (!a || !b) {
        return true;
    }

    const aTime = new Date(a).getTime();
    const bTime = new Date(b).getTime();

    if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
        return true;
    }

    return Math.abs(aTime - bTime) <= thresholdMs;
}

function mergeRepliesWithOptimistic(
    serverReplies: CommentReply[] | undefined,
    previousReplies: CommentReply[] | undefined,
) {
    const nextReplies = serverReplies ?? [];
    const optimisticReplies = (previousReplies ?? []).filter((reply) =>
        isTemporaryCommentId(reply.id),
    );

    if (optimisticReplies.length === 0) {
        return nextReplies;
    }

    const unsyncedReplies = optimisticReplies.filter(
        (reply) =>
            !nextReplies.some(
                (serverReply) =>
                    serverReply.content === reply.content &&
                    (isSameAuthor(serverReply.author, reply.author) ||
                        !serverReply.author ||
                        !reply.author) &&
                    isNearInTime(serverReply.createdAt, reply.createdAt),
            ),
    );

    return [...nextReplies, ...unsyncedReplies];
}

function mergeCommentsWithOptimistic(serverComments: Comment[], previousComments: Comment[]) {
    const mergedServerComments = serverComments.map((serverComment) => {
        const previousMatch = previousComments.find(
            (previousComment) => previousComment.id === serverComment.id,
        );

        return {
            ...serverComment,
            replies: mergeRepliesWithOptimistic(
                serverComment.replies,
                previousMatch?.replies,
            ),
        };
    });

    const optimisticComments = previousComments.filter((comment) =>
        isTemporaryCommentId(comment.id),
    );

    const unsyncedComments = optimisticComments.filter(
        (comment) =>
            !mergedServerComments.some(
                (serverComment) =>
                    serverComment.content === comment.content &&
                    (isSameAuthor(serverComment.author, comment.author) ||
                        !serverComment.author ||
                        !comment.author) &&
                    isNearInTime(serverComment.createdAt, comment.createdAt),
            ),
    );

    return [...unsyncedComments, ...mergedServerComments];
}

type PublishedCommentEvent = {
    type: "COMMENT_PUBLISHED";
    room: string;
    userId: string;
    userName?: string;
    content?: string;
    commentId?: string;
    timestamp: string;
    isReply: boolean;
    replyId: string | null;
};

function matchesPublishedEvent(
    item: { content: string; author: CommentAuthor | null },
    event: PublishedCommentEvent,
) {
    const eventContent = (event.content || "").trim();
    if (!eventContent) return false;
    if (item.content.trim() !== eventContent) return false;

    const author = item.author;
    if (!author) return false;

    if (author.id && event.userId) {
        if (author.id === event.userId) {
            return true;
        }
    }
    if (author.handle && event.userName) {
        if (author.handle === event.userName) {
            return true;
        }
    }
    return !!author.name && !!event.userName && author.name === event.userName;
}

export default function CommentsDrawer({
    children,
    contentId,
    contentType,
}: {
    children: React.ReactNode;
    contentId: string;
    contentType: "blog" | "docs";
}) {


    // ─── Comments State ──────────────────────────
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [replyToId, setReplyToId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const currentUser = useSelector((state: RootState) => state.userReducer.user);
    const typingTimersRef = useRef<Record<string, number>>({});
    const syncTimerRef = useRef<number | null>(null);
    const lastTypingSentAtRef = useRef(0);
    const room = useMemo(
        () => buildCommentRoomName(contentType, contentId),
        [contentId, contentType],
    );
    const { isConnected, lastMessage, sendMessage } = useCommentWebSocket(room, {
        enabled: open,
    });

    const avatarGradients = [
        "from-rose-400 to-pink-500",
        "from-violet-400 to-purple-500",
        "from-blue-400 to-indigo-500",
        "from-emerald-400 to-teal-500",
        "from-amber-400 to-orange-500",
        "from-cyan-400 to-sky-500",
    ];
    const formatCommentDate = (dateValue: string | Date) => {
        const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    const getAvatarGradient = (name: string) => {
        const idx = name.charCodeAt(0) % avatarGradients.length;
        return avatarGradients[idx];
    };

    const composerTextareaClass =
        "min-h-[96px] rounded-none border-0 bg-inherit px-0 py-0 text-sm leading-6 shadow-none resize-none focus-visible:ring-0 dark:bg-inherit";

    const loadComments = useCallback(async () => {
        try {
            const response = await api.get<CommentCursorResponse>(
                `${process.env.NEXT_PUBLIC_API_VERSION}/comments`,
                {
                    params: {
                        room,
                        limit: 10,
                    },
                },
            );
            const data =
                response.data && typeof response.data === "object"
                    ? response.data
                    : null;
            setComments((previousComments) =>
                mergeCommentsWithOptimistic(data?.items ?? [], previousComments),
            );
        } catch (error) {
            // Keep optimistic local state if the refresh fails.
        }
    }, [room]);

    const syncCommentsSoon = useCallback(() => {
        if (syncTimerRef.current) {
            window.clearTimeout(syncTimerRef.current);
        }
        syncTimerRef.current = window.setTimeout(() => {
            void loadComments();
            syncTimerRef.current = null;
        }, 350);
    }, [loadComments]);

    const markUserTyping = useCallback((userName: string) => {
        setTypingUsers((prev) =>
            prev.includes(userName) ? prev : [...prev, userName],
        );

        if (typingTimersRef.current[userName]) {
            window.clearTimeout(typingTimersRef.current[userName]);
        }

        typingTimersRef.current[userName] = window.setTimeout(() => {
            setTypingUsers((prev) => prev.filter((entry) => entry !== userName));
            delete typingTimersRef.current[userName];
        }, 1800);
    }, []);

    const sendTypingSignal = useCallback(() => {
        const now = Date.now();
        if (now - lastTypingSentAtRef.current < 1200) {
            return;
        }

        if (
            sendMessage({
                status: "TYPING",
                timestamp: new Date().toISOString(),
            })
        ) {
            lastTypingSentAtRef.current = now;
        }
    }, [sendMessage]);

    useEffect(() => {
        if (!open) return;
        void loadComments();
    }, [loadComments, open]);

    useEffect(() => {
        if (!lastMessage) return;

        try {
            const parsed = JSON.parse(lastMessage) as CommentWsMessage;
            if ("status" in parsed && parsed.status === "TYPING") {
                const currentIdentity =
                    currentUser?.handle || currentUser?.name || "";
                if (
                    currentIdentity &&
                    (parsed.userName === currentIdentity ||
                        parsed.userId === currentIdentity)
                ) {
                    return;
                }
                markUserTyping(parsed.userName);
                return;
            }

            if (
                "type" in parsed &&
                (parsed.type === "COMMENT_PUBLISHED" ||
                    parsed.type === "COMMENT_DELETED")
            ) {
                if (parsed.type === "COMMENT_PUBLISHED") {
                    const published = parsed as PublishedCommentEvent;
                    setComments((prev) =>
                        prev
                            .map((comment) => {
                                if (published.isReply && published.replyId && comment.id === published.replyId) {
                                    return {
                                        ...comment,
                                        replies: (comment.replies ?? []).filter((reply) => {
                                            if (!isTemporaryCommentId(reply.id)) return true;
                                            return !matchesPublishedEvent(reply, published);
                                        }),
                                    };
                                }
                                return comment;
                            })
                            .filter((comment) => {
                                if (published.isReply) return true;
                                if (!isTemporaryCommentId(comment.id)) return true;
                                return !matchesPublishedEvent(comment, published);
                            }),
                    );
                }
                syncCommentsSoon();
            }
        } catch {
            // Ignore malformed ws payloads.
        }
    }, [currentUser?.handle, currentUser?.name, lastMessage, markUserTyping, syncCommentsSoon]);

    useEffect(() => {
        return () => {
            Object.values(typingTimersRef.current).forEach((timerId) => {
                window.clearTimeout(timerId);
            });
            typingTimersRef.current = {};
            if (syncTimerRef.current) {
                window.clearTimeout(syncTimerRef.current);
                syncTimerRef.current = null;
            }
        };
    }, []);

    // ─── Comment Handlers ────────────────────────
    const handleAddComment = useCallback(() => {
        const trimmedText = commentText.trim();
        if (!trimmedText) {
            toast.error("Please write a comment");
            return;
        }
        if (!sendMessage({
            status: "PUBLISHED",
            content: trimmedText,
            timestamp: new Date().toISOString(),
            isReply: false,
            replyId: null,
        })) {
            toast.error("Comment connection is unavailable");
            return;
        }
        const newComment: Comment = {
            id: `temp-${crypto.randomUUID()}`,
            room,
            content: trimmedText,
            createdAt: new Date().toISOString(),
            author: {
                id: currentUser?.handle || currentUser?.email || "current-user",
                name: currentUser?.name || "You",
                handle: currentUser?.handle || "",
                avatarUrl: currentUser?.profileImg || null,
            },
            replies: [],
        };
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");
    }, [commentText, currentUser?.handle, currentUser?.name, currentUser?.profileImg, room, sendMessage]);

    const handleAddReply = useCallback((commentId: string) => {
        if (isTemporaryCommentId(commentId)) {
            toast.info("Wait a moment for the comment to sync before replying.");
            syncCommentsSoon();
            return;
        }
        const trimmedText = replyText.trim();
        if (!trimmedText) {
            toast.error("Please write a reply");
            return;
        }
        if (!sendMessage({
            status: "PUBLISHED",
            content: trimmedText,
            timestamp: new Date().toISOString(),
            isReply: true,
            replyId: commentId,
        })) {
            toast.error("Comment connection is unavailable");
            return;
        }
        const newReply: CommentReply = {
            id: `temp-${crypto.randomUUID()}`,
            content: trimmedText,
            createdAt: new Date().toISOString(),
            author: {
                id: currentUser?.handle || currentUser?.email || "current-user",
                name: currentUser?.name || "You",
                handle: currentUser?.handle || "",
                avatarUrl: currentUser?.profileImg || null,
            },
        };
        setComments((prev) =>
            prev.map((comment) =>
                comment.id === commentId
                    ? {
                        ...comment,
                        replies: [...(comment.replies ?? []), newReply],
                    }
                    : comment,
            ),
        );
        setReplyText("");
        setReplyToId(null);
    }, [currentUser?.handle, currentUser?.name, currentUser?.profileImg, replyText, sendMessage]);

    const handleDeleteComment = useCallback((commentId: string) => {
        if (isTemporaryCommentId(commentId)) {
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
            return;
        }
        if (!sendMessage({
            status: "DELETE",
            id: commentId,
            timestamp: new Date().toISOString(),
            isReply: false,
            replyId: null,
        })) {
            toast.error("Comment connection is unavailable");
            return;
        }
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        syncCommentsSoon();
    }, [sendMessage, syncCommentsSoon]);

    const handleReportComment = useCallback(() => {
        toast.success("Reported. Thanks for the feedback.");
    }, []);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent
                hideOverlay
                showHandle={false}
                className="h-[60vh] w-[96vw] max-w-none mx-auto border-0 bg-card/95 backdrop-blur-sm shadow-none data-[vaul-drawer-direction=bottom]:border-t-0 data-[vaul-drawer-direction=bottom]:max-h-[60vh] rounded-t-2xl"
            >
                <div className="w-full mx-auto flex h-full flex-col border border-border/60">
                    <DrawerHeader className="px-4 py-3 md:px-5">
                        <div className="flex items-center justify-between">
                            <span className="h-7 w-7" />
                            <DrawerTitle className="flex items-center gap-2 text-sm font-semibold">
                                <MessageCircle size={16} />
                                Comments
                            </DrawerTitle>
                            <span className="text-[11px] text-muted-foreground">
                                {isConnected ? "Live" : "Reconnecting..."}
                            </span>
                        </div>
                    </DrawerHeader>


                    <div className="relative flex-1 overflow-y-auto custom-scroll px-2 pb-28 md:px-3">

                        {/* Comments List */}
                        {comments.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted/60 to-muted/20 border border-border/30 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <MessageCircle className="w-7 h-7 text-muted-foreground/30" />
                                </div>
                                <p className="text-sm text-muted-foreground/60 font-medium">
                                    No comments yet
                                </p>
                                <p className="text-xs text-muted-foreground/40 mt-1">
                                    Be the first to share your thoughts!
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-3 pb-2">
                                {comments.map((comment) => (
                                        (() => {
                                            const canDeleteComment = isOwnedByCurrentUser(
                                                comment.author,
                                                currentUser,
                                            );

                                            return (
                                        <div
                                            key={comment.id}
                                            className="group flex gap-3 rounded-xl bg-background/70 p-3.5 transition-all duration-300"
                                        >
                                            <Avatar className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarGradient(comment.author?.name || "U")} flex items-center justify-center shrink-0 shadow-sm`}>
                                                <AvatarImage
                                                    src={comment.author?.avatarUrl || undefined}
                                                    alt={comment.author?.name || "User"}
                                                />
                                                <AvatarFallback className="text-xs font-bold text-background uppercase drop-shadow-sm">
                                                    {(comment.author?.name || "U").charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-foreground">
                                                        {comment.author?.handle || comment.author?.name || "Unknown"}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground/50 font-medium">
                                                        {formatCommentDate(comment.createdAt)}
                                                    </span>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="ml-auto h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                                                                aria-label="Comment actions"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="rounded-xl"
                                                        >
                                                            <DropdownMenuItem onClick={handleReportComment}>
                                                                Report
                                                            </DropdownMenuItem>
                                                            {canDeleteComment && (
                                                                <DropdownMenuItem
                                                                    className="text-destructive focus:text-destructive"
                                                                    onClick={() => handleDeleteComment(comment.id)}
                                                                >
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <p className="text-[13px] text-foreground/75 leading-relaxed break-words">
                                                    {comment.content}
                                                </p>
                                                <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (isTemporaryCommentId(comment.id)) {
                                                                toast.info("Wait a moment for the comment to sync before replying.");
                                                                syncCommentsSoon();
                                                                return;
                                                            }
                                                            setReplyToId(comment.id);
                                                            setReplyText("");
                                                        }}
                                                        className="rounded-full px-2 py-0.5 hover:bg-muted/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={isTemporaryCommentId(comment.id)}
                                                    >
                                                        Reply
                                                    </button>
                                                </div>
                                                {replyToId === comment.id && (
                                                    <div
                                                        className="mt-3 bg-background pl-3">
                                                        <div className="border-l border-border/50 bg-inherit pl-4">
                                                            <Textarea
                                                                placeholder="Write a thoughtful reply..."
                                                                value={replyText}
                                                                onChange={(e) => {
                                                                    setReplyText(e.target.value);
                                                                    if (e.target.value.trim()) {
                                                                        sendTypingSignal();
                                                                    }
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter" && e.shiftKey) {
                                                                        e.preventDefault();
                                                                        handleAddReply(comment.id);
                                                                    }
                                                                }}
                                                                rows={3}
                                                                className={composerTextareaClass}
                                                            />
                                                        </div>
                                                        <div className="mt-2 flex items-center justify-between gap-3 pl-4">
                                                            <span className="text-[10px] text-muted-foreground/55">
                                                                {replyText.length > 0
                                                                    ? `${replyText.length} characters`
                                                                    : "Reply to this thread"}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="rounded-none px-2 text-[11px]"
                                                                    onClick={() => {
                                                                        setReplyToId(null);
                                                                        setReplyText("");
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    className="rounded-xl px-3 text-[11px] font-mono"
                                                                    onClick={() => handleAddReply(comment.id)}
                                                                    disabled={!replyText.trim()}
                                                                >
                                                                    ⇧⏎ Reply
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    )}
                                                {(comment.replies?.length ?? 0) > 0 && (
                                                    <div
                                                        key={comment.id}
                                                        className="mt-2 space-y-2 border-l border-border pl-3">
                                                        {comment.replies?.map((reply) => (
                                                            <div
                                                                key={reply.id}
                                                                className="rounded-xl bg-muted/20 p-3"
                                                            >
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-xs font-semibold text-foreground">
                                                                        {reply.author?.handle || reply.author?.name || "Unknown"}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[12px] text-foreground/75 leading-relaxed break-words">
                                                                    {reply.content}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}


                                            </div>
                                        </div>
                                            );
                                        })()
                                    ))}
                            </div>
                        )}
                    </div>

                    <div className="sticky bottom-0 z-20 border-t border-border/50 bg-card/95 backdrop-blur-md px-4 py-3 md:px-5">
                        <div className="mb-2 min-h-5 text-[11px] text-muted-foreground/70">
                            {formatTypingUsers(typingUsers)}
                        </div>
                        <div className="bg-background">
                            <Textarea
                                autoFocus
                                placeholder="Share your thoughts..."
                                value={commentText}
                                onChange={(e) => {
                                    setCommentText(e.target.value);
                                    if (e.target.value.trim()) {
                                        sendTypingSignal();
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.shiftKey) {
                                        e.preventDefault();
                                        handleAddComment();
                                    }
                                }}
                                rows={4}
                                className={composerTextareaClass}
                            />
                            <div className="mt-3 flex items-center justify-between gap-3">
                                <span className="text-[10px] text-muted-foreground/55">
                                    {!isConnected
                                        ? "Connecting..."
                                        : commentText.length > 0
                                          ? `${commentText.length} characters`
                                          : "Write a comment"}
                                </span>
                                <Button
                                    size="sm"
                                    className="h-8 min-w-8 rounded-md border border-border/70 bg-background px-2 font-mono text-sm leading-none text-foreground hover:bg-accent"
                                    onClick={handleAddComment}
                                    disabled={!commentText.trim()}
                                    aria-label="Post comment"
                                >
                                    ⇧⏎
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>)
}
