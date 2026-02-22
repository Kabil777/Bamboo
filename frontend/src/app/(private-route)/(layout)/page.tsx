"use client";
import {
    BlogCard,
    DocsCard,
    MoreAbout,
    TabChips,
} from "@/components/atomsComponents";
import { BlogCardSkeleton } from "@/components/atomsComponents/skleton/blogCardSkleton";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { DocsHome } from "@/components/ui";
import type { RootState } from "@/store/store";
import { Separator } from "@/components/shadcnUI/separator";
import { useSelector } from "react-redux";
import { SidebarSkeleton } from "@/components/atomsComponents/skleton/sidebarSkleton";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { getCoverBlog } from "@/store/reducers/BlogCoverReducer";
import { DocsCoverRtk } from "@/store/reducers/DocsCoverReducer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
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
        { label: "C", value: "c" },
        { label: "Go", value: "go" },
        { label: "Rust", value: "rust" },
        { label: "Ruby", value: "ruby" },
        { label: "PHP", value: "php" },
        { label: "Next.js", value: "next-js" },
        { label: "React", value: "react" },
        { label: "Vue", value: "vue" },
        { label: "Svelte", value: "svelte" },
        { label: "Angular", value: "angular" },
        { label: "DevOps", value: "devops" },
        { label: "Cloud", value: "cloud" },
        { label: "AI/ML", value: "ai-ml" },
        { label: "Data Science", value: "data-science" },
        { label: "Cybersecurity", value: "cybersecurity" },
        { label: "Blockchain", value: "blockchain" },
        { label: "AR/VR", value: "ar-vr" },
    ];

    const { blogLoading, data } = useSelector((s: RootState) => s.blogReducer);
    const { isDocsLoading, docs } = useAppState((s) => s.docsHomeReducer);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!data || data.length === 0) {
            dispatch(getCoverBlog({ cursor: null, mode: "init" }));
        }
    }, [dispatch, data]);

    useEffect(() => {
        if (!docs || docs.length === 0) {
            dispatch(DocsCoverRtk());
        }
    }, [dispatch]);

    return (
        <main className="flex justify-center">
            <div className="container grid grid-cols-4 gap-4 md:gap-6">
                <div className="col-span-full sticky top-[58px] z-10 bg-background">
                    {blogLoading ? (
                        <Skeleton className="h-8 w-full mt-2.5" />
                    ) : (
                        <TabChips tabs={tabs} onTabChange={() => {}} />
                    )}
                </div>

                {/* Main content */}
                <div className="col-span-full xl:col-span-3 relative sm:border-r sm:p-3">
                    {blogLoading ? (
                        <div className="absolute inset-0 z-10">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <BlogCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div>
                            {data == null || data.length === 0 ? (
                                <div className="p-4 justify-center flex">
                                    <p className="text-sm text-muted-foreground px-2">
                                        No blogs available
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {(() => {
                                        const MIN_BLOGS = 3;
                                        const MAX_BLOGS = 8;
                                        const DOCS_PER_ROW = 4;
                                        const blogList = data ?? [];
                                        const docList = docs ?? [];
                                        const chunks: React.ReactNode[] = [];

                                        // Shuffle helper (Fisher-Yates)
                                        const shuffle = <T,>(arr: T[]): T[] => {
                                            const a = [...arr];
                                            for (let j = a.length - 1; j > 0; j--) {
                                                const k = Math.floor(Math.random() * (j + 1));
                                                [a[j], a[k]] = [a[k], a[j]];
                                            }
                                            return a;
                                        };

                                        let i = 0;
                                        while (i < blogList.length) {
                                            const chunkSize = Math.floor(Math.random() * (MAX_BLOGS - MIN_BLOGS + 1)) + MIN_BLOGS;
                                            const blogChunk = blogList.slice(i, i + chunkSize);

                                            // Blog cards chunk
                                            chunks.push(
                                                ...blogChunk.map((d) => (
                                                    <BlogCard key={d.id} {...d} isOwner={false} />
                                                ))
                                            );

                                            // Insert docs row with random docs after each chunk
                                            if (docList.length > 0) {
                                                const finalDocs = shuffle(docList).slice(0, DOCS_PER_ROW);

                                                chunks.push(
                                                    <div
                                                        key={`docs-row-${i}`}
                                                        className="my-6"
                                                    >
                                                        <div className="flex items-center justify-between mb-4 px-2">
                                                            <div>
                                                                <h2 className="text-lg font-semibold text-foreground">
                                                                    Docs for you
                                                                </h2>
                                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                                    Explore documentation
                                                                </p>
                                                            </div>
                                                            <Link
                                                                href="/docs"
                                                                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                                            >
                                                                View all
                                                                <ArrowRight size={14} />
                                                            </Link>
                                                        </div>
                                                        <div
                                                            className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory"
                                                            style={{
                                                                scrollbarWidth: "none",
                                                                msOverflowStyle: "none",
                                                                WebkitOverflowScrolling: "touch",
                                                            }}
                                                        >
                                                            {finalDocs.map((doc, idx) => (
                                                                <div
                                                                    key={`${doc.id}-${i}-${idx}`}
                                                                    className="snap-start flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px]"
                                                                >
                                                                    <DocsCard
                                                                        doc={doc}
                                                                        hoverOpen={false}
                                                                        active=""
                                                                        setActiveCard={() => { }}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );


                                            }
                                            i += chunkSize;
                                        }
                                        return chunks;
                                    })()}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="hidden xl:flex flex-col xl:col-span-1 line-clamp-2 p-2 gap-4 xl:sticky top-[140px] z-8 max-h-[calc(100vh-150px)] overflow-y-auto custom-scroll">
                    {isDocsLoading ? (
                        <SidebarSkeleton />
                    ) : (
                        <>
                            {/* <DocsHome docs={docs} /> */}
                            {/* <Separator orientation="horizontal" /> */}
                            <MoreAbout />
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
