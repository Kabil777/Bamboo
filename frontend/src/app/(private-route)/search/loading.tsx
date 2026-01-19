import { Skeleton } from "@/components/shadcnUI/skeleton";

export default function Loading() {
    return (
        <main className="flex justify-center">
            <div className="container py-8 space-y-6">
                {/* Search bar skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full max-w-2xl mx-auto" />
                    <div className="flex gap-2 justify-center flex-wrap">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-28" />
                    </div>
                </div>

                {/* Results count */}
                <Skeleton className="h-6 w-48" />

                {/* Search results grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-40 w-full rounded-lg" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/5" />
                            <div className="flex gap-2 items-center">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
