import { Skeleton } from "@/components/shadcnUI/skeleton";

export default function Loading() {
    return (
        <main className="flex justify-center">
            <div className="container grid grid-cols-4 gap-4 md:gap-6 py-8">
                {/* Main content skeleton */}
                <div className="col-span-full xl:col-span-3 space-y-6">
                    {/* Article title */}
                    <Skeleton className="h-14 w-4/5" />
                    
                    {/* Author info */}
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>

                    {/* Cover image */}
                    <Skeleton className="h-64 w-full rounded-lg" />

                    {/* Article content */}
                    <div className="space-y-4 mt-8">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-4/5" />
                        <Skeleton className="h-32 w-full mt-6 rounded-lg" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                    </div>
                </div>

                {/* Sidebar skeleton */}
                <div className="hidden xl:flex flex-col xl:col-span-1 gap-4 sticky top-[140px]">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-6 w-4/5" />
                    <Skeleton className="h-6 w-full mt-4" />
                    <Skeleton className="h-6 w-5/6" />
                </div>
            </div>
        </main>
    );
}
