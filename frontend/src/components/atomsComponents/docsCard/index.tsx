"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { DocsHomeCard } from "@/types/docs/docs-base";
import { UUID } from "@/types/blog/blog-base";
import Image from "next/image";
import { ProfileTag } from "@/components/atomsComponents";
import type { Author } from "@/components/atomsComponents/profileTag";
import { useState, useMemo } from "react";

// Demo authors for multi-user display — replace with real data when available
const DEMO_AUTHORS: Author[] = [
    { id: "1", name: "Kowsik" },
    { id: "2", name: "Thirisha" },
    { id: "3", name: "Kabil" },
    { id: "4", name: "Ravi" },
];

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
            /*
                CHANGED: removed border entirely, removed bg-card, removed shadow.
                Replaced with a transparent base + very faint hover bg.
                Rounded corners tightened (rounded-[20px] → rounded-xl).
                No "promo tile" feel — clean content card.
            */
            className={`
                group relative rounded-xl overflow-hidden flex flex-col
                bg-transparent transition-all duration-300 ease-in-out
                hover:bg-foreground/[0.025]
            `}
        >
            {/*
                CHANGED: removed the p-2 pb-0 framed wrapper padding so image
                sits flush at the top — no padded inset border treatment.
                Image dimensions / aspect ratio UNCHANGED.
            */}
            <div className="p-0">
                {!hoverOpen && doc?.coverUrl && !imageError ? (
                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-xl bg-muted/20">
                        {/* shimmer — UNCHANGED */}
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-muted/60 animate-pulse" />
                        )}
                        <Image
                            src={doc.coverUrl}
                            alt={doc?.title || "Cover"}
                            fill
                            /*
                                CHANGED: removed inner border on the image wrapper,
                                removed scale-on-hover transform (kept fade-in).
                                Image fill + object-cover UNCHANGED.
                            */
                            className={`object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                            onLoadingComplete={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                        />
                        {/* time badge — UNCHANGED */}
                        {relativeTime && (
                            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 dark:bg-black/40 backdrop-blur-md text-[11px] font-medium text-white flex items-center gap-1.5 pointer-events-none">
                                <Clock size={10} className="opacity-70" />
                                {relativeTime}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Fallback — UNCHANGED structure, removed inner border */
                    <div className="relative w-full aspect-[16/9] rounded-t-xl bg-foreground/[0.03] flex flex-col items-center justify-center gap-2">
                        <BookOpen size={24} className="text-foreground/25" />
                        {relativeTime && (
                            <span className="text-[11px] font-medium text-foreground/40 flex items-center gap-1">
                                <Clock size={10} />
                                {relativeTime}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Content — structure UNCHANGED */}
            <div className="flex flex-col gap-3 p-4 flex-1">
                <div className="flex flex-col gap-1">
                    {/*
                        CHANGED: title — tracking-tight added, color explicitly
                        text-foreground (not inheriting card muted tones),
                        hover:text-primary removed (too reactive for calm feel).
                    */}
                    <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground line-clamp-2">
                        {doc?.title || "Untitled Document"}
                    </h3>

                    {/*
                        CHANGED: description — color lightened to text-foreground/50,
                        line-clamp stays at 2, size unchanged at [13px].
                    */}
                    {doc?.description && (
                        <p className="text-[13px] text-foreground/50 leading-relaxed line-clamp-2">
                            {doc.description}
                        </p>
                    )}
                </div>

                <div className="flex-1 min-h-2" />

                {/* ProfileTag — UNCHANGED */}
                <ProfileTag
                    idBlog={doc?.id}
                    contentType="docs"
                    createdAt={doc?.createdAt}
                    showMenu={false}
                    variant="compact"
                    authors={DEMO_AUTHORS}
                />

                {/*
                    CHANGED: divider color softened from border/40 → foreground/[0.06]
                    to match the rest of the page's separator language
                */}
                <div className="h-px bg-foreground/[0.06] w-full" />

                {/* Action link — UNCHANGED structure */}
                <Link
                    href={`/docs/${doc?.id}`}
                    className="flex items-center justify-between"
                >
                    {/*
                        CHANGED: label text lightened, removed group-hover color shift
                        so it stays quiet (functional, not promotional)
                    */}
                    <span className="text-[13px] font-medium text-foreground/40 group-hover:text-foreground/70 transition-colors duration-200">
                        Read documentation
                    </span>
                    <ArrowRight
                        size={14}
                        className="text-foreground/25 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-foreground/50"
                    />
                </Link>
            </div>
        </motion.div>
    );
};
