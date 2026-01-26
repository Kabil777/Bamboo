// components/skeletons/ProfileBlogListSkeleton.tsx
"use client";

import { Skeleton } from "@/components/shadcnUI/skeleton";

export function ProfileBlogListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-6">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="border rounded-lg p-4 space-y-4 bg-muted/30"
                >
                    {/* Cover */}
                    <Skeleton className="h-48 w-full rounded-md" />

                    {/* Title */}
                    <Skeleton className="h-6 w-3/4" />

                    {/* Description */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}
