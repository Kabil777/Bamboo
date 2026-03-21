import { Button } from "@/components/shadcnUI/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/shadcnUI/drawer";
import { MessageCircle, MoreVertical, SendHorizonal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/shadcnUI/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/shadcnUI/textarea";


// ─── Types ───────────────────────────────────────────
interface Comment {
    id: string;
    name: string;
    text: string;
    timestamp: Date;
    replies?: CommentReply[];
}

interface CommentReply {
    id: string;
    text: string;
    timestamp: Date;
}


export default function CommentsDrawer({ children, comment }: { children: React.ReactNode, comment: Comment[] }) {


    // ─── Comments State ──────────────────────────

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [replyToId, setReplyToId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");

    const avatarGradients = [
        "from-rose-400 to-pink-500",
        "from-violet-400 to-purple-500",
        "from-blue-400 to-indigo-500",
        "from-emerald-400 to-teal-500",
        "from-amber-400 to-orange-500",
        "from-cyan-400 to-sky-500",
    ];
    const formatCommentDate = (date: Date) => {
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
    // ─── Comment Handlers ────────────────────────
    const handleAddComment = useCallback(() => {
        const trimmedText = commentText.trim();
        if (!trimmedText) {
            toast.error("Please write a comment");
            return;
        }
        const newComment: Comment = {
            id: crypto.randomUUID(),
            name: "Anonymous",
            text: trimmedText,
            timestamp: new Date(),
            replies: [],
        };
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");
        toast.success("Comment added!");
    }, [commentText]);

    const handleAddReply = useCallback((commentId: string) => {
        const trimmedText = replyText.trim();
        if (!trimmedText) {
            toast.error("Please write a reply");
            return;
        }
        const newReply: CommentReply = {
            id: crypto.randomUUID(),
            text: trimmedText,
            timestamp: new Date(),
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
        toast.success("Reply added!");
    }, [replyText]);

    const handleDeleteComment = useCallback((commentId: string) => {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        toast.success("Comment deleted");
    }, []);

    const handleReportComment = useCallback(() => {
        toast.success("Reported. Thanks for the feedback.");
    }, []);

    return (
        <Drawer>
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
                                        <motion.div
                                            key={comment.id}
                                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -12, scale: 0.98 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="group flex gap-3 p-4 rounded-2xl transition-all duration-300"
                                        >
                                            <Avatar className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarGradient(comment.name)} flex items-center justify-center shrink-0 shadow-sm`}>
                                                <span className="text-xs font-bold text-background uppercase drop-shadow-sm">
                                                    {comment.name.charAt(0)}
                                                </span>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-foreground">
                                                        Anonymous
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground/50 font-medium">
                                                        {formatCommentDate(comment.timestamp)}
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
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <p className="text-[13px] text-foreground/75 leading-relaxed break-words">
                                                    {comment.text}
                                                </p>
                                                <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setReplyToId(comment.id);
                                                            setReplyText("");
                                                        }}
                                                        className="rounded-full px-2 py-0.5 hover:bg-muted/50 transition"
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
                                                            onChange={(e) =>
                                                                setReplyText(e.target.value)
                                                            }
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
                                                        </div>
                                                    </motion.div>
                                                )}
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
                                                                        Anonymous
                                                                    </span>
                                                                    <span className="text-[10px] text-muted-foreground/50 font-medium">
                                                                        {formatCommentDate(reply.timestamp)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[12px] text-foreground/75 leading-relaxed break-words">
                                                                    {reply.text}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}


                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    <div className="sticky bottom-0 z-20 border-t border-border/30 bg-background/85 backdrop-blur-md px-4 py-3">
                        <Textarea
                            placeholder="Share your thoughts..."
                            value={commentText}
                            onChange={(e) =>
                                setCommentText(e.target.value)
                            }
                            rows={2}
                            className="focus-visible:ring-0 focus:ring-0 focus-visible:border-foreground focus-visible:border-2 resize-none rounded-xl"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-muted-foreground/50">
                                {commentText.length > 0 && `${commentText.length} characters`}
                            </span>
                            <Button
                                size="sm"
                                className="gap-1.5 rounded-xl text-xs h-8 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25 transition-all duration-300"
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
