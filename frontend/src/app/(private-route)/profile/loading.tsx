import { Skeleton } from "@/components/shadcnUI/skeleton";

export default function Loading() {
    return (
        <main className="flex justify-center">
            <div className="container py-8 space-y-8">
                {/* Profile header skeleton */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <Skeleton className="h-32 w-32 rounded-full" />
                    
                    {/* Profile info */}
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-6 w-96" />
                        <div className="flex gap-4">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </div>
                </div>

                {/* Tabs skeleton */}
                <Skeleton className="h-10 w-full" />

                {/* Content grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-48 w-full rounded-lg" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
