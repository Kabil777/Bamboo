"use client";
import { motion } from "framer-motion";
import {
    Bookmark,
    BookOpen,
    Ellipsis,
    ExternalLink,
    Eye,
    Pencil,
    Share2,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";
import { BlogUpdateDetails, VisibilityPopover } from "../blogUpdateDetials";
import { ProfileHoverTag } from "../profileHoverTag";
import { SharePopover } from "../sharePopover";

export const ProfileTag = ({
    profileId,
    idBlog,
    contentType = "blog",
    createdAt,
    authorName,
    visibility,
    status,
    isOwner = false,
    resourceId,
    showMenu = true,
    onVisibilityUpdated,
}: {
    profileId?: string;
    idBlog?: string;
    contentType?: "blog" | "docs";
    createdAt?: string | number | Date;
    authorName?: string | null;
    visibility?: "PUBLIC" | "PRIVATE";
    status?: "PUBLISHED" | "ARCHIVED" | "DRAFT";
    isOwner?: boolean;
    resourceId?: string;
    showMenu?: boolean;
    onVisibilityUpdated?: () => void;
}) => {
    const [bookmark, setBookmark] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [copyPopoverOpen, setCopyPopoverOpen] = useState(false);
    const [visibilityPopoverOpen, setVisibilityPopoverOpen] = useState(false);
    const handleVisibilityPopoverOpen = () => {
        setDropdownOpen(false);
        setTimeout(() => {
            setVisibilityPopoverOpen(true);
        }, 100);
    };
    const handleCopyPopoverOpen = () => {
        setDropdownOpen(false);
        setTimeout(() => {
            setCopyPopoverOpen(true);
        }, 100);
    };
    const handleEditClick = () => {
        setDropdownOpen(false);
        setTimeout(() => {
            setIsEditDialogOpen(true);
        }, 100);
    };
    const getRelativeTime = (dateInput?: string | number | Date) => {
        if (!dateInput) return "just now";
        const date =
            dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (Number.isNaN(date.getTime())) return "just now";
        const diffMs = Date.now() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        if (diffSec < 60) return "just now";
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin} min ago`;
        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? "s" : ""} ago`;
        const diffDay = Math.floor(diffHr / 24);
        if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
        const diffMonth = Math.floor(diffDay / 30);
        if (diffMonth < 12)
            return `${diffMonth} month${diffMonth > 1 ? "s" : ""} ago`;
        const diffYear = Math.floor(diffMonth / 12);
        return `${diffYear} year${diffYear > 1 ? "s" : ""} ago`;
    };
    const relativeTime = getRelativeTime(createdAt);
    const showPrivate = isOwner && visibility === "PRIVATE";
    const showUnpublished = isOwner && status && status !== "PUBLISHED";
    const showVisibilityBadge =
        isOwner && (visibility || status || showPrivate || showUnpublished);
    const canManage = showMenu && isOwner;
    const statusLabel = status ? status.toLowerCase() : undefined;
    const visibilityLabel = visibility ? visibility.toLowerCase() : undefined;

    return (
        <>
            <div className="flex flex-wrap gap-2 mt-2 items-center justify-start gap-x-3">
                <ProfileHoverTag profileId={profileId} />
                <p className="text-sm text-muted-foreground italic">
                    {relativeTime}
                </p>

                <p className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium ">
                    <BookOpen size={14} />
                    165k
                </p>

                <p
                    onClick={() => setBookmark(!bookmark)}
                    className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium cursor-pointer"
                >
                    <motion.span
                        key={bookmark ? "bookmark" : "unbookmark"}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                        }}
                        className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium cursor-pointer"
                    >
                        <Bookmark
                            className={`text-muted-foreground ${bookmark && "fill-muted-foreground"}`}
                            size={14}
                        />
                    </motion.span>
                    165k
                </p>

                {showVisibilityBadge && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1 capitalize">
                        {visibilityLabel}
                        {visibilityLabel && statusLabel && " • "}
                        {statusLabel}
                    </span>
                )}
                {canManage && (
                    <DropdownMenu
                        open={dropdownOpen}
                        onOpenChange={setDropdownOpen}
                    >
                        <DropdownMenuTrigger
                            className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium cursor-pointer"
                            asChild
                        >
                            <p>
                                <Ellipsis size={14} />
                            </p>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                            <DropdownMenuItem onClick={handleEditClick}>
                                <Pencil className="h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={
                                        contentType === "docs"
                                            ? `/editor/docs/${idBlog}`
                                            : `/editor/blog/${idBlog}`
                                    }
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    <span>Open in Editor</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={handleVisibilityPopoverOpen}
                            >
                                <Eye className="h-4 w-4" />
                                <span>Visibility</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCopyPopoverOpen}>
                                <Share2 className="h-4 w-4" />
                                <span>Share</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem variant="destructive">
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            {canManage && (
                <>
                    <SharePopover
                        text={`https://bamboo.dev/${
                            contentType === "docs" ? "docs" : "blog"
                        }/${profileId ? `?ref=${profileId}` : ""}`}
                        open={copyPopoverOpen}
                        setOpen={setCopyPopoverOpen}
                    >
                        {""}
                    </SharePopover>
                    <VisibilityPopover
                        open={visibilityPopoverOpen}
                        setOpen={setVisibilityPopoverOpen}
                        contentType={contentType}
                        resourceId={resourceId || idBlog}
                        initialStatus={status}
                        initialVisibility={visibility}
                        onUpdated={onVisibilityUpdated}
                    />
                    <BlogUpdateDetails
                        open={isEditDialogOpen}
                        setOpen={setIsEditDialogOpen}
                    />
                </>
            )}
        </>
    );
};
