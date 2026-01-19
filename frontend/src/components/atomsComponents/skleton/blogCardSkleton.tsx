import { Skeleton } from "@/components/shadcnUI/skeleton";

export function BlogCardSkeleton() {
    return (
        <div className="flex gap-4 py-6 border-b">
            <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                </div>
            </div>
            <Skeleton className="h-28 w-44 rounded-lg" />
        </div>
    );
}
