"use client"
import { BlogHomeCard } from "@/types/blog/blog-base";
import { ArrowLeft, ArrowRight, BookOpenText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

function formatDateLabel(createdAt: string) {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "Fresh today";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(date);
}

export function FeaturedCarousel({
    stories,
    onSlideChange,
}: {
    stories: BlogHomeCard[];
    onSlideChange?: (index: number) => void;
}) {
    const [active, setActive] = useState(0);
    const [dir, setDir] = useState<"left" | "right">("right");
    const [animating, setAnim] = useState(false);

    const go = useCallback(
        (next: number, direction: "left" | "right") => {
            if (animating || next === active) return;
            setDir(direction);
            setAnim(true);
            setTimeout(() => {
                setActive(next);
                setAnim(false);
                onSlideChange?.(next);
            }, 280);
        },
        [animating, active, onSlideChange],
    );

    if (stories.length === 0) {
        return (
            <div className="flex min-h-[220px] items-center justify-center rounded-[28px] border border-dashed border-foreground/10 bg-foreground/[0.02] p-8">
                <div className="max-w-md text-center">
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        Featured stories will appear here
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-foreground/40">
                        We're waiting for the next highlighted posts.
                    </p>
                </div>
            </div>
        );
    }

    const prev = () =>
        go((active - 1 + stories.length) % stories.length, "left");
    const next = () => go((active + 1) % stories.length, "right");
    const story = stories[active];

    return (
        <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-none dark:ring-1 dark:ring-border/40">
            <div
                style={{
                    opacity: animating ? 0 : 1,
                    transform: animating
                        ? `translateX(${dir === "right" ? "-1.5%" : "1.5%"})`
                        : "translateX(0)",
                    transition:
                        "opacity 250ms ease, transform 280ms cubic-bezier(.4,0,.2,1)",
                }}
            >
                {/* Mobile: image on top, text below. md+: side-by-side */}
                <div className="flex flex-col md:grid md:grid-cols-[1fr_minmax(260px,0.65fr)] lg:grid-cols-[1fr_minmax(300px,0.7fr)]">

                    {/* ── Image side — top on mobile, right on desktop ── */}
                    <div className="relative h-52 sm:h-64 md:h-auto md:min-h-[340px] overflow-hidden order-first md:order-last border-b md:border-b-0 md:border-l border-border/50">
                        {story.coverUrl ? (
                            <>
                                <Image
                                    src={story.coverUrl}
                                    alt={story.title}
                                    fill
                                    className="object-cover transition-transform duration-500 "
                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 40vw, 400px"
                                    priority
                                />
                                {/* Bottom-fade on mobile, left-fade on desktop */}
                                <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent md:bg-gradient-to-r md:from-card/20 md:via-transparent md:to-transparent pointer-events-none" />
                            </>
                        ) : (
                            <div className="flex h-full items-center justify-center bg-muted/50">
                                <BookOpenText className="size-12 text-muted-foreground/20" />
                            </div>
                        )}
                    </div>

                    {/* ── Text side ── */}
                    <div className="flex flex-col p-5 sm:p-7 lg:p-8 order-last md:order-first">
                        <div className="flex-1 space-y-3 sm:space-y-4">
                            {/* Badge row */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                                    Featured
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                    {formatDateLabel(story.createdAt)}
                                </span>
                                <span className="ml-auto text-[10px] tabular-nums text-muted-foreground/50">
                                    {active + 1}&thinsp;/&thinsp;{stories.length}
                                </span>
                            </div>

                            {/* Title + description */}
                            <div className="space-y-2">
                                <h1 className="max-w-[26ch] text-xl sm:text-2xl lg:text-[1.85rem] font-bold leading-[1.2] tracking-tight text-foreground">
                                    {story.title}
                                </h1>
                                <p className="max-w-[50ch] text-sm leading-[1.72] text-muted-foreground line-clamp-3">
                                    {story.description}
                                </p>
                            </div>

                            {/* Tags */}
                            {story.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {story.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full border border-border/80 bg-muted/70 px-2.5 py-0.5 text-[11px] capitalize text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* bottom — written by + CTA + controls, all inside the card */}
                        <div className="mt-auto space-y-3 pt-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/28">
                                        Written by
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                                        {story.author?.name?.trim() || "Bamboo Editorial"}
                                    </p>
                                </div>
                                <Link
                                    href={`/blog/${story.id}`}
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-xs font-semibold text-background transition-all hover:opacity-80 active:scale-95 transition-all duration-300"
                                >
                                    Read now
                                    <ArrowRight size={11} />
                                </Link>
                            </div>

                            {/* Pagination controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prev}
                                    aria-label="Previous slide"
                                    className="flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-foreground/40 hover:text-foreground hover:bg-muted active:scale-90"
                                >
                                    <ArrowLeft size={12} />
                                </button>
                                <button
                                    onClick={next}
                                    aria-label="Next slide"
                                    className="flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-foreground/40 hover:text-foreground hover:bg-muted active:scale-90"
                                >
                                    <ArrowRight size={12} />
                                </button>
                                <div className="flex items-center gap-1.5 pl-1">
                                    {stories.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() =>
                                                go(i, i > active ? "right" : "left")
                                            }
                                            aria-label={`Go to slide ${i + 1}`}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${i === active
                                                ? "w-6 bg-foreground"
                                                : "w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/50"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}