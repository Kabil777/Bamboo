"use client";

import { Skeleton } from "@/components/shadcnUI/skeleton";

const paragraphWidths = ["w-full", "w-[96%]", "w-[88%]", "w-[93%]", "w-[72%]"];
const tocWidths = ["w-40", "w-32", "w-36", "w-28", "w-24"];

export function BlogPageSkeleton() {
    return (
        <div className="mt-4 flex w-full justify-center gap-10">
            <article className="min-w-0 w-full max-w-2xl flex-1">
                <div className="flex flex-col gap-8 py-6 lg:py-8">
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-[82%]" />
                        <Skeleton className="h-10 w-[58%]" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {['w-16', 'w-20', 'w-14', 'w-24'].map((width) => (
                            <Skeleton key={width} className={`h-6 rounded-full ${width}`} />
                        ))}
                    </div>

                    <Skeleton className="h-[280px] w-full rounded-2xl" />

                    <div className="flex items-center gap-4 border-y py-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex flex-1 items-center justify-between gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-full" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[84%]" />
                    </div>

                    <div className="mt-2 space-y-6">
                        <div className="space-y-3">
                            {paragraphWidths.map((width, index) => (
                                <Skeleton key={`intro-${index}`} className={`h-4 ${width}`} />
                            ))}
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-7 w-52" />
                            {['w-full', 'w-[94%]', 'w-[90%]', 'w-[68%]'].map((width, index) => (
                                <Skeleton key={`section-${index}`} className={`h-4 ${width}`} />
                            ))}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Skeleton className="h-32 rounded-xl" />
                            <Skeleton className="h-32 rounded-xl" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-7 w-40" />
                            {['w-full', 'w-[91%]', 'w-[86%]', 'w-[74%]'].map((width, index) => (
                                <Skeleton key={`outro-${index}`} className={`h-4 ${width}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </article>

            <aside className="mt-4 hidden w-56 shrink-0 sticky top-24 xl:w-64 lg:block">
                <div className="space-y-3 rounded-2xl border border-border/50 p-4">
                    <Skeleton className="mb-3 h-5 w-28" />
                    {tocWidths.map((width, index) => (
                        <Skeleton key={index} className={`h-4 ${width}`} />
                    ))}
                </div>
            </aside>
        </div>
    );
}
