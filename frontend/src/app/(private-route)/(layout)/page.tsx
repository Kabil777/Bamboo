"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
    BlogCard,
    DocsShelf,
    FeaturedCarousel,
    TabChips,
} from "@/components/atomsComponents";
import { BlogCardSkeleton } from "@/components/atomsComponents/skleton/blogCardSkleton";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { getCoverBlog } from "@/store/reducers/BlogCoverReducer";
import { DocsCoverRtk } from "@/store/reducers/DocsCoverReducer";
import { getFeaturedBlogs } from "@/store/reducers/FeaturedBlogReducer";
import type { RootState } from "@/store/store";
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

function pickCuratedDocs(docs: DocsHomeCard[], size: number) {
    return docs.slice(0, Math.min(size, docs.length));
}


// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
    const { blogLoading, data, fetched: blogFetched } = useSelector((s: RootState) => s.blogReducer);
    const { loading: featuredLoading, data: featuredStories, fetched: featuredFetched } = useAppState(
        (s) => s.featuredBlogReducer,
    );
    const { isDocsLoading, docs, fetched: docsFetched } = useAppState((s) => s.docsHomeReducer);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!blogFetched)
            dispatch(getCoverBlog({ cursor: null, mode: "init" }));
    }, [dispatch, blogFetched]);

    useEffect(() => {
        if (!featuredFetched) {
            dispatch(getFeaturedBlogs());
        }
    }, [dispatch, featuredFetched]);

    useEffect(() => {
        if (!docsFetched) dispatch(DocsCoverRtk());
    }, [dispatch, docsFetched]);

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
                    ) : (
                        <div className="flex min-h-[220px] items-center justify-center rounded-[28px] border border-dashed border-foreground/10 bg-foreground/[0.02] p-8">
                            <div className="max-w-md text-center">
                                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                                    Featured stories will appear here
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-foreground/40">
                                    We&apos;re waiting for the next highlighted posts.
                                </p>
                            </div>
                        </div>
                    )}

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
                            ) : (
                                <div className="space-y-0">
                                    {/* Recent stories */}
                                    <section>
                                        <div className="space-y-2 pb-5">
                                            <div className="flex items-center gap-3">
                                                <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/60">
                                                    Latest dispatches
                                                </p>
                                                <div className="h-px flex-1 bg-foreground/[0.08]" />
                                                <Link
                                                    href="/search"
                                                    className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/55 transition-colors hover:text-foreground"
                                                >
                                                    Explore all
                                                </Link>
                                            </div>
                                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                                Fresh writing from the network
                                            </h2>
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
                                                                authorName={blog.author?.name ?? null}
                                                                authorHandle={blog.author?.handle ?? null}
                                                                authorAvatarUrl={blog.author?.avatarUrl ?? null}
                                                                isOwner={false}
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </section>

                                    <div className="pt-10">
                                        <DocsShelf docs={curatedDocs} />
                                    </div>
                                </div>
                            )}
                        </section>

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
