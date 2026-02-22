"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { DocsHomeCard } from "@/types/docs/docs-base";
import { UUID } from "@/types/blog/blog-base";
import Image from "next/image";
import { ProfileTag } from "@/components/atomsComponents";
import { useState, useMemo } from "react";

export const DocsCard = ({
    hoverOpen = true,
    doc,
    active,
    setActiveCard,
}: {
    hoverOpen: boolean;
    doc: DocsHomeCard;
    active: UUID;
    setActiveCard: (id: UUID) => void;
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const isActive = active === doc?.id;

    const relativeTime = useMemo(() => {
        if (!doc?.createdAt) return "";
        const date = new Date(doc.createdAt);
        if (Number.isNaN(date.getTime())) return "";
        const diffMs = Date.now() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays < 1) return "Today";
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
        return `${Math.floor(diffDays / 365)}y ago`;
    }, [doc?.createdAt]);

    return (
        <motion.div
            key={doc?.id}
            layout
            onMouseEnter={() => setActiveCard(doc?.id)}
            transition={{ layout: { duration: 0.3, ease: "easeOut" } }}
            className={`
                group relative rounded-[20px] overflow-hidden flex flex-col
                bg-card border transition-all duration-300 ease-in-out
                ${isActive
                    ? "border-primary/20 shadow-lg shadow-black/5 dark:shadow-black/20"
                    : "border-border/50 hover:border-primary/20"
                }
            `}
        >
            {/* Framed Image Container */}
            <div className="p-2 pb-0">
                {!hoverOpen && doc?.coverUrl && !imageError ? (
                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl border border-border/40 bg-muted/20">
                        {/* Shimmer */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-muted/60 animate-pulse" />
                        )}
                        <Image
                            src={doc.coverUrl}
                            alt={doc?.title || "Cover"}
                            fill
                            className={`
                                object-cover transition-transform duration-700 ease-out
                                ${imageLoaded ? "opacity-100" : "opacity-0"}
                            `}
                            onLoadingComplete={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                        />
                        {/* High-contrast Time Badge */}
                        {relativeTime && (
                            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 dark:bg-black/40 backdrop-blur-md text-[11px] font-medium text-white flex items-center gap-1.5 pointer-events-none">
                                <Clock size={10} className="opacity-70" />
                                {relativeTime}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Fallback when no image */
                    <div className="relative w-full aspect-[16/9] rounded-2xl border border-border/40 bg-muted/30 flex flex-col items-center justify-center gap-2 transition-colors group-hover:bg-muted/50">
                        <BookOpen size={24} className="text-muted-foreground/40" />
                        {relativeTime && (
                            <span className="text-[11px] font-medium text-muted-foreground/60 flex items-center gap-1">
                                <Clock size={10} />
                                {relativeTime}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className="flex flex-col gap-4 p-5 flex-1">
                <div className="flex flex-col gap-1.5">
                    {/* Title */}
                    <h3 className="text-base font-semibold leading-snug text-foreground line-clamp-2 tracking-tight group-hover:text-primary transition-colors duration-200">
                        {doc?.title || "Untitled Document"}
                    </h3>

                    {/* Description */}
                    {doc?.description && (
                        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
                            {doc.description}
                        </p>
                    )}
                </div>

                <div className="flex-1 min-h-2" />

                {/* Profile and Metadata */}
                <ProfileTag
                    idBlog={doc?.id}
                    contentType="docs"
                    createdAt={doc?.createdAt}
                    showMenu={false}
                />

                <div className="h-px bg-border/40 w-full" />

                {/* Action Link */}
                <Link
                    href={`/docs/${doc?.id}`}
                    className="flex items-center justify-between"
                >
                    <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                        Read documentation
                    </span>
                    <ArrowRight
                        size={15}
                        className="text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1 group-hover/link:text-primary"
                    />
                </Link>
            </div>
        </motion.div>
    );
};
