import { BlogCardSkeleton } from "@/components/atomsComponents/skleton/blogCardSkleton";
import { SidebarSkeleton } from "@/components/atomsComponents/skleton/sidebarSkleton";
import { Skeleton } from "@/components/shadcnUI/skeleton";

export default function Loading() {
    return (
        <main className="flex justify-center">
            <div className="container grid grid-cols-4 gap-4 md:gap-6">
                <div className="col-span-full sticky top-[58px] z-10 bg-background">
                    <Skeleton className="h-8 w-full mt-2.5" />
                </div>

                {/* Main content */}
                <div className="col-span-full xl:col-span-3">
                    {
                        Array.from({ length: 6 }).map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))
                    }
                </div>

                {/* Sidebar */}
                <div className="hidden xl:flex flex-col xl:col-span-1 line-clamp-2 p-2 gap-4 xl:sticky top-[140px] z-8 max-h-[calc(100vh-150px)] overflow-y-auto custom-scroll">
                    <SidebarSkeleton />
                </div>
            </div>

        </main>
    )
}