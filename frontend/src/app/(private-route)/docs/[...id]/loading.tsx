import { Skeleton } from "@/components/shadcnUI/skeleton";

export default function Loading() {
    return (
        <main className="flex justify-center">
            <div className="container grid grid-cols-4 gap-4 md:gap-6">
                {/* Main content skeleton */}
                <div className="col-span-full xl:col-span-3 space-y-6">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-40 w-full mt-4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-4/5" />
                </div>

                {/* Sidebar skeleton */}
                <div className="hidden xl:flex flex-col xl:col-span-1 gap-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-6 w-4/5" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                </div>
            </div>
        </main>
    );
}
