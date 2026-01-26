"use client";

import { Skeleton } from "@/components/shadcnUI/skeleton";

export function SectionCardsSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Skeleton className="w-40 h-40 rounded-xl" />

            <div className="flex-1 p-4 border rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                </div>

                <Skeleton className="h-5 w-28" />

                <Skeleton className="h-4 w-32" />

                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                <div className="flex gap-2 flex-wrap pt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                </div>

                <div className="flex gap-4 pt-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
    );
}
