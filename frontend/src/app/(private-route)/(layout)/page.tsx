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
        <div className="relative h-[420px] overflow-hidden rounded-[28px] bg-background shadow-[inset_0_0_0_1px_rgb(0,0,0,0.07)]">
            <div
                className="h-full"
                style={{
                    opacity: animating ? 0 : 1,
                    transform: animating
                        ? `translateX(${dir === "right" ? "-2%" : "2%"})`
                        : "translateX(0)",
                    transition:
                        "opacity 260ms ease, transform 280ms cubic-bezier(.4,0,.2,1)",
                }}
            >
                {/* FIX #1 — image column narrowed: was minmax(380px,0.85fr), now minmax(300px,0.75fr) */}
                <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(300px,0.75fr)] lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
                    {/* text side — FIX #1: padding reduced p-8→p-6, p-10→p-8 */}
                    <div className="flex flex-col p-6 lg:p-8">
                        {/* top content */}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="rounded-full border border-foreground/[0.09] bg-foreground/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
                                    Featured
                                </span>
                                <span className="text-xs text-foreground/35">
                                    {formatDateLabel(story.createdAt)}
                                </span>
                                <span className="ml-auto text-[10px] tabular-nums text-foreground/25">
                                    {active + 1} / {stories.length}
                                </span>
                            </div>

                            {/* FIX #1 — title breathes horizontally: max-w-[22ch] instead of [18ch], slightly smaller size */}
                            <div className="space-y-2">
                                <h1 className="max-w-[22ch] text-2xl font-semibold leading-[1.18] tracking-tight text-foreground sm:text-3xl xl:text-[2.2rem]">
                                    {story.title}
                                </h1>
                                <p className="max-w-[54ch] text-sm leading-[1.75] text-foreground/50">
                                    {story.description.length > 100
                                        ? story.description.slice(0, 180) +
                                          "..."
                                        : story.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {story.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-foreground/[0.08] px-2.5 py-0.5 text-[11px] capitalize text-foreground/40"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* bottom — written by + CTA + controls, all inside the card */}
                        <div className="mt-auto space-y-3 pt-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/28">
                                        Written by
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                                        {story.authorName || "Bamboo Editorial"}
                                    </p>
                                </div>
                                <Link
                                    href={`/blog/${story.id}`}
                                    className="group flex items-center gap-2 rounded-sm bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-75"
                                >
                                    Read now
                                </Link>
                            </div>

                            {/* controls — no absolute, no overlap */}
                            <div className="flex items-center gap-2 border-t border-foreground/[0.06] pt-3">
                                <button
                                    onClick={prev}
                                    className="flex size-6 items-center justify-center rounded-full border border-foreground/[0.1] text-foreground/35 transition-all hover:border-foreground/20 hover:text-foreground"
                                >
                                    <ArrowLeft size={11} />
                                </button>
                                <button
                                    onClick={next}
                                    className="flex size-6 items-center justify-center rounded-full border border-foreground/[0.1] text-foreground/35 transition-all hover:border-foreground/20 hover:text-foreground"
                                >
                                    <ArrowRight size={11} />
                                </button>
                                <div className="flex items-center gap-1.5 pl-1">
                                    {stories.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() =>
                                                go(
                                                    i,
                                                    i > active
                                                        ? "right"
                                                        : "left",
                                                )
                                            }
                                            aria-label={`Slide ${i + 1}`}
                                            className={`h-1 rounded-full transition-all duration-300 ${
                                                i === active
                                                    ? "w-5 bg-foreground"
                                                    : "w-1 bg-foreground/18 hover:bg-foreground/35"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* image side — bleed to edge */}
                    <div className="relative h-full overflow-hidden border-l border-foreground/[0.05]">
                        {story.coverUrl ? (
                            <Image
                                src={story.coverUrl}
                                alt={story.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1280px) 45vw, 500px"
                                priority
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-foreground/[0.03]">
                                <BookOpenText className="size-10 text-foreground/15" />
                            </div>
                        )}
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
                        setActiveCard={() => {}}
                    />
                ))}
            </div>
        </section>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
    const { blogLoading, data } = useSelector((s: RootState) => s.blogReducer);
    const { isDocsLoading, docs } = useAppState((s) => s.docsHomeReducer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!data || data.length === 0)
            dispatch(getCoverBlog({ cursor: null, mode: "init" }));
    }, [dispatch, data]);

    useEffect(() => {
        if (!docs || docs.length === 0) dispatch(DocsCoverRtk());
    }, [dispatch, docs]);

    const blogList = data ?? [];
    const docsList = docs ?? [];

    // carousel: first 3 posts
    const carouselStories = blogList.slice(0, 3);
    // feed: posts 3–9
    const recentStories = blogList.slice(3, 9);
    // What to read next: posts 9–13 — genuinely beyond what's already visible
    const whatToReadNext = blogList.slice(0, 3);
    // docs shelf in main: first 4
    const curatedDocs = pickCuratedDocs(docsList, 4);
    // recently updated docs in sidebar: next 5 (skip the 4 already in shelf)
    const sidebarDocs = pickCuratedDocs(docsList.slice(1), 2);

    return (
        <main className="w-full">
            <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-5 lg:px-8">
                {/* sticky tab bar */}
                <div className="sticky top-[58px] z-20 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
                    {blogLoading ? (
                        <Skeleton className="mt-3 h-9 w-full rounded-full" />
                    ) : (
                        <TabChips tabs={tabs} onTabChange={() => { }} />
                    )}
                    <hr className="border-foreground/[0.06]" />
                </div>

                <div className="space-y-0 pt-6">
                    {/* ROW 1 — full-width carousel */}
                    {blogLoading ? (
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
