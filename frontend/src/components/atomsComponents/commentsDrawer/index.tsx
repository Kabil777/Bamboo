"use client";

import api from "@/api/axios";
import { Button } from "@/components/shadcnUI/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/shadcnUI/drawer";
import { MessageCircle, MoreVertical, SendHorizonal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    }

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
            setComments(data?.items ?? []);
        } catch (error) {
            setComments([]);
        }
    }, [room]);

    const syncCommentsSoon = useCallback(() => {
        window.setTimeout(() => {
            void loadComments();
        }, 500);
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
                markUserTyping(parsed.userName);
                return;
            }

            if (
                "type" in parsed &&
                (parsed.type === "COMMENT_PUBLISHED" ||
                    parsed.type === "COMMENT_DELETED")
            ) {
                void loadComments();
            }
        } catch {
            // Ignore malformed ws payloads.
        }
    }, [lastMessage, loadComments, markUserTyping]);

    useEffect(() => {
        return () => {
            Object.values(typingTimersRef.current).forEach((timerId) => {
                window.clearTimeout(timerId);
            });
            typingTimersRef.current = {};
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
        syncCommentsSoon();
    }, [commentText, currentUser?.handle, currentUser?.name, currentUser?.profileImg, room, sendMessage, syncCommentsSoon]);

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
        syncCommentsSoon();
    }, [currentUser?.handle, currentUser?.name, currentUser?.profileImg, replyText, sendMessage, syncCommentsSoon]);

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
                className="h-full w-full mx-auto border border-border/40 bg-background/95 backdrop-blur-sm shadow-2xl data-[vaul-drawer-direction=bottom]:border-t-0 data-[vaul-drawer-direction=bottom]:max-h-[80vh] rounded-t-3xl"
            >
                <div className="w-full md:max-w-xl mx-auto flex h-full flex-col">
                    <DrawerHeader className="pt-6">
                        <DrawerTitle>
                            <div className="flex gap-2">

                                <MessageCircle size={24} />Comments
                            </div>
                        </DrawerTitle>
                    </DrawerHeader>


                    <div className="relative flex-1 overflow-y-auto custom-scroll pb-28">

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
                                <AnimatePresence>
                                    {comments.map((comment) => (
                                        (() => {
                                            const canDeleteComment = isOwnedByCurrentUser(
                                                comment.author,
                                                currentUser,
                                            );

                                            return (
                                        <motion.div
                                            key={comment.id}
                                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -12, scale: 0.98 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="group flex gap-3 p-4 rounded-2xl transition-all duration-300"
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
                                                                className="ml-auto h-7 w-7 rounded-full"
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
                                                    <motion.div
                                                        key={comment.id}
                                                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -12, scale: 0.98 }}
                                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                                        className="mt-3 rounded-xl border border-border/30 bg-background/60 p-3">
                                                        <Textarea
                                                            placeholder="Write a reply..."
                                                            value={replyText}
                                                            onChange={(e) => {
                                                                setReplyText(e.target.value);
                                                                if (e.target.value.trim()) {
                                                                    sendTypingSignal();
                                                                }
                                                            }}
                                                            rows={2}
                                                            className="focus-visible:ring-0 focus:ring-0 focus-visible:border-foreground focus-visible:border-2 resize-none rounded-xl"
                                                        />
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-[10px] text-muted-foreground/50">
                                                                {replyText.length > 0 &&
                                                                    `${replyText.length} characters`}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 px-2 text-[11px]"
                                                                    onClick={() => {
                                                                        setReplyToId(null);
                                                                        setReplyText("");
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    className="h-7 px-2 text-[11px]"
                                                                    onClick={() => handleAddReply(comment.id)}
                                                                    disabled={!replyText.trim()}
                                                                >
                                                                    Reply
                                                                </Button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                                {(comment.replies?.length ?? 0) > 0 && (
                                                    <motion.div
                                                        key={comment.id}
                                                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -12, scale: 0.98 }}
                                                        transition={{ duration: 0.3, ease: "easeOut" }}
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
                                                    </motion.div>
                                                )}


                                            </div>
                                        </motion.div>
                                            );
                                        })()
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    <div className="sticky bottom-0 z-20 border-t border-border/30 bg-background/85 backdrop-blur-md px-4 py-3">
                        <div className="mb-2 min-h-5 text-[11px] text-muted-foreground/70">
                            {formatTypingUsers(typingUsers)}
                        </div>
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
                            rows={2}
                            className="focus-visible:ring-0 focus:ring-0 focus-visible:border-foreground focus-visible:border-2 resize-none rounded-xl"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-muted-foreground/50">
                                {!isConnected
                                    ? "Connecting..."
                                    : commentText.length > 0
                                      ? `${commentText.length} characters`
                                      : ""}
                            </span>
                            <Button
                                size="sm"
                                className="gap-1.5 rounded-xl text-xs h-8 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-all duration-300 disabled:bg-foreground/70 disabled:opacity-100"
                                onClick={handleAddComment}
                                disabled={!commentText.trim()}
                            >
                                Comment
                                <SendHorizonal className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>)
}
