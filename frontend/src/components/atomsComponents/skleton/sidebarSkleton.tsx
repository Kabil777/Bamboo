import { Skeleton } from "@/components/shadcnUI/skeleton";

export function SidebarSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
            </div>
            <Skeleton className="h-2 w-1/2" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
}
