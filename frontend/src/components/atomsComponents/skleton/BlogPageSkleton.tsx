"use client";

import { Skeleton } from "@/components/shadcnUI/skeleton";

export function BlogPageSkeleton() {
    return (
        <div className="flex justify-center w-full gap-10 mt-4">
            {/* Main Content */}
            <article className="flex-1 min-w-0 w-full max-w-2xl">
                <div className="flex flex-col gap-8 py-6 lg:py-8">
                    {/* Title */}
                    <Skeleton className="h-10 w-3/4" />

                    {/* Tags */}
                    <div className="flex gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-6 w-16 rounded-full"
                            />
                        ))}
                    </div>

                    {/* Cover Image */}
                    <Skeleton className="w-full h-[280px] rounded-xl" />

                    {/* Author Row */}
                    <div className="flex items-center gap-4 py-4 border-y">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>

                    {/* Description */}
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />

                    {/* Content Blocks */}
                    <div className="flex flex-col gap-4 mt-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                    </div>
                </div>
            </article>

            {/* TOC Sidebar */}
            <aside className="hidden lg:block shrink-0 w-56 xl:w-64 sticky top-24 mt-4">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-5 w-32 mb-2" />
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                    ))}
                </div>
            </aside>
        </div>
    );
}
