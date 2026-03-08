"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { ArrowRight, ArrowLeft, BookOpenText, BookText } from "lucide-react";
import {
    BlogCard,
    DocsCard,
    MoreAbout,
    TabChips,
} from "@/components/atomsComponents";
import { BlogCardSkeleton } from "@/components/atomsComponents/skleton/blogCardSkleton";
import { SidebarSkeleton } from "@/components/atomsComponents/skleton/sidebarSkleton";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { getCoverBlog } from "@/store/reducers/BlogCoverReducer";
import { DocsCoverRtk } from "@/store/reducers/DocsCoverReducer";
import { getFeaturedBlogs } from "@/store/reducers/FeaturedBlogReducer";
import type { RootState } from "@/store/store";
import type { BlogHomeCard } from "@/types/blog/blog-base";
import type { DocsHomeCard } from "@/types/docs/docs-base";

import { WhatToReadNext } from "@/components/ui/homePage/WhatToReadNext";
import { StartWritingCTA } from "@/components/ui/homePage/StartWritingCta";
import { RecentlyUpdatedDocs } from "@/components/ui/homePage/RecentlyUpdatedDocs";

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const tabs = [
    { label: "All", value: "all" },
    { label: "Design", value: "design" },
    { label: "Development", value: "development" },
    { label: "UX", value: "ux" },
    { label: "UI", value: "ui" },
    { label: "Marketing", value: "marketing" },
    { label: "Sales", value: "sales" },
    { label: "Product", value: "product" },
    { label: "Business", value: "business" },
    { label: "Startup", value: "startup" },
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Java", value: "java" },
    { label: "Python", value: "python" },
    { label: "C++", value: "cpp" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
    { label: "React", value: "react" },
    { label: "Cloud", value: "cloud" },
    { label: "AI/ML", value: "ai-ml" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDateLabel(createdAt: string) {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "Fresh today";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(date);
}

function pickCuratedDocs(docs: DocsHomeCard[], size: number) {
    return docs.slice(0, Math.min(size, docs.length));
}

// ─── Featured Carousel ────────────────────────────────────────────────────────
// FIX #1: h-[480px] → h-[380px], padding p-8/p-10 → p-6/p-8, image col narrower
// FIX #2: stories fed in are carousel-only (slice 0-2); EditorNotes gets slice 6-8
function FeaturedCarousel({
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
                                        {story.authorName?.trim() || "Bamboo Editorial"}
                                    </p>
                                </div>
                                <Link
                                    href={`/blog/${story.id}`}
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-xs font-semibold text-background transition-all hover:opacity-80 active:scale-95"
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

function DocsShelf({ docs }: { docs: DocsHomeCard[] }) {
    return (
        <section className="py-6">
            <div className="mb-5 flex items-center gap-3">
                <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
                    Reference shelf
                </span>
                <div className="h-px flex-1 bg-foreground/[0.08]" />
                <Link
                    href="/docs"
                    className="whitespace-nowrap text-xs font-medium text-foreground/40 transition-colors hover:text-foreground"
                >
                    Browse docs
                </Link>
            </div>
            <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">
                Continue learning
            </h2>
            <div className="grid gap-3 md:grid-cols-1 xl:grid-cols-3">
                {docs.map((doc) => (
                    <DocsCard
                        key={doc.id}
                        doc={doc}
                        hoverOpen={false}
                        active=""
                        setActiveCard={() => { }}
                    />
                ))}
            </div>
        </section>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
    const { blogLoading, data } = useSelector((s: RootState) => s.blogReducer);
    const { loading: featuredLoading, data: featuredStories } = useAppState(
        (s) => s.featuredBlogReducer,
    );
    const { isDocsLoading, docs } = useAppState((s) => s.docsHomeReducer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!data || data.length === 0)
            dispatch(getCoverBlog({ cursor: null, mode: "init" }));
    }, [dispatch, data]);

    useEffect(() => {
        if (!featuredStories || featuredStories.length === 0) {
            dispatch(getFeaturedBlogs());
        }
    }, [dispatch, featuredStories]);

    useEffect(() => {
        if (!docs || docs.length === 0) dispatch(DocsCoverRtk());
    }, [dispatch, docs]);

    const blogList = data ?? [];
    const docsList = docs ?? [];

    const carouselStories = featuredStories ?? [];
    const featuredIds = new Set(carouselStories.map((story) => story.id));
    const nonFeaturedStories = blogList.filter((story) => !featuredIds.has(story.id));
    // feed: next posts after featured selection
    const recentStories = nonFeaturedStories.slice(0, 6);
    // What to read next: posts 9–13 — genuinely beyond what's already visible
    const whatToReadNext = nonFeaturedStories.slice(6, 9);
    // docs shelf in main: first 4
    const curatedDocs = pickCuratedDocs(docsList, 4);
    // recently updated docs in sidebar: next 5 (skip the 4 already in shelf)
    const sidebarDocs = pickCuratedDocs(docsList.slice(1), 2);

    return (
        <main className="w-full">
            <div className="mx-auto w-full md:max-w-6xl 2xl:max-w-[1400px] px-3 sm:px-5 lg:px-8">
                {/* sticky tab bar */}
                <div className="sticky top-[58px] z-20 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/30">
                    {blogLoading ? (
                        <Skeleton className="mt-3 h-9 w-full rounded-full" />
                    ) : (
                        <TabChips tabs={tabs} onTabChange={() => { }} />
                    )}
                    <hr className="border-foreground/[0.06]" />
                </div>

                <div className="space-y-0 pt-6">
                    {/* ROW 1 — full-width carousel */}
                    {featuredLoading ? (
                        <Skeleton className="h-[380px] w-full rounded-[28px]" />
                    ) : carouselStories.length > 0 ? (
                        <FeaturedCarousel stories={carouselStories} />
                    ) : null}

                    {/* ROW 2 — 9-col main + 3-col sidebar */}
                    <div className="grid grid-cols-12 gap-x-8 pt-8">
                        {/* ── Main ── */}
                        <section className="col-span-12 min-w-0 xl:col-span-9">
                            {blogLoading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <BlogCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : carouselStories.length > 0 ? (
                                <div className="space-y-0">
                                    {/* Recent stories */}
                                    <section>
                                        <div className="flex items-end justify-between gap-4 pb-5">
                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/60">
                                                    Latest dispatches
                                                </p>
                                                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                                                    Fresh writing from the
                                                    network
                                                </h2>
                                            </div>
                                            <Link
                                                href="/search"
                                                className="flex items-center gap-1 text-sm font-medium text-foreground/40 transition-colors hover:text-foreground"
                                            >
                                                Explore all
                                            </Link>
                                        </div>
                                        {recentStories.length === 0 ? (
                                            <p className="py-8 text-center text-sm text-foreground/35">
                                                More posts will appear here
                                                soon.
                                            </p>
                                        ) : (
                                            <div>
                                                {recentStories.map(
                                                    (blog, i) => (
                                                        <div key={blog.id}>
                                                            {i > 0 && (
                                                                <hr className="border-foreground/[0.06]" />
                                                            )}
                                                            <BlogCard
                                                                {...blog}
                                                                authorName={blog.authorName ?? blog.handle ?? null}
                                                                authorHandle={blog.authorHandle ?? blog.handle ?? null}
                                                                isOwner={false}
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </section>

                                    {/*
                                        FIX #4 — Docs shelf gets a distinct visual mode:
                                        tinted surface + icon badge + ring, clearly
                                        differentiated from the post feed above
                                    */}
                                    <div className="pt-10">
                                        <DocsShelf docs={curatedDocs} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-[50vh] items-center justify-center rounded-[32px] border border-dashed border-foreground/10 bg-foreground/[0.02] p-10">
                                    <div className="max-w-md text-center">
                                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                            Nothing published yet
                                        </h1>
                                        <p className="mt-3 text-sm leading-6 text-foreground/40">
                                            Start with one strong post and a few
                                            reference docs.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/*
                            Sidebar — 3 elements, clear hierarchy:
                            1. WhatToReadNext  — editorial reading stack
                            2. StartWritingCTA — single elegant author prompt
                            3. RecentlyUpdatedDocs — useful discovery, not telemetry
                        */}
                        <aside className="col-span-12 xl:col-span-3">
                            <div className="flex flex-col gap-4 xl:sticky xl:top-[132px]">
                                <WhatToReadNext stories={whatToReadNext} />
                                <StartWritingCTA />
                                <RecentlyUpdatedDocs docs={sidebarDocs} />
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </main>
    );
}
