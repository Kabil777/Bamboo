"use client";
import { BlogCard, MoreAbout, TabChips } from "@/components/atomsComponents";
import { BlogCardSkeleton } from "@/components/atomsComponents/skleton/blogCardSkleton";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { DocsHome } from "@/components/ui";
import { RootState } from "@/store/store";
import { Separator } from "@/components/shadcnUI/separator";
import { useDispatch, useSelector } from "react-redux";
import { SidebarSkeleton } from "@/components/atomsComponents/skleton/sidebarSkleton";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import { getCoverBlog } from "@/store/reducers/BlogCoverReducer";

export default function Home() {
    const tabs = [
        { label: "All", value: "all" },
        { label: "Design", value: "design" },
        { label: "Development", value: "development" },
        { label: "UX", value: "ux" },
        { label: "UI", value: "ui" },
        { label: "Marketing", value: "marketing" },
        { label: "Sales", value: "sales" },
        { label: "Product", value: "product" },
        { label: "Business", value: "business" },
        { label: "Startup", value: "startup" },
        { label: "JavaScript", value: "javascript" },
        { label: "TypeScript", value: "typescript" },
        { label: "Java", value: "java" },
        { label: "Python", value: "python" },
        { label: "C++", value: "cpp" },
        { label: "C", value: "c" },
        { label: "Go", value: "go" },
        { label: "Rust", value: "rust" },
        { label: "Ruby", value: "ruby" },
        { label: "PHP", value: "php" },
        { label: "Next.js", value: "next-js" },
        { label: "React", value: "react" },
        { label: "Vue", value: "vue" },
        { label: "Svelte", value: "svelte" },
        { label: "Angular", value: "angular" },
        { label: "DevOps", value: "devops" },
        { label: "Cloud", value: "cloud" },
        { label: "AI/ML", value: "ai-ml" },
        { label: "Data Science", value: "data-science" },
        { label: "Cybersecurity", value: "cybersecurity" },
        { label: "Blockchain", value: "blockchain" },
        { label: "AR/VR", value: "ar-vr" },
    ];

    const { status } = useSelector((s: RootState) => s.userReducer);

    const loading = status === "loading";
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getCoverBlog({ cursor: null }));
    }, [dispatch]);
    return (
        <main className="flex justify-center">
            <div className="container grid grid-cols-4 gap-4 md:gap-6">
                <div className="col-span-full sticky top-[58px] z-10 bg-background">
                    {loading ? (
                        <Skeleton className="h-8 w-full mt-2.5" />
                    ) : (
                        <TabChips tabs={tabs} onTabChange={() => {}} />
                    )}
                </div>

                {/* Main content */}
                <div className="col-span-full xl:col-span-3">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))
                    ) : (
                        <>
                            <BlogCard />
                            <BlogCard />
                            <BlogCard />
                        </>
                    )}
                </div>

                {/* Sidebar */}
                <div className="hidden xl:flex flex-col xl:col-span-1 line-clamp-2 p-2 gap-4 xl:sticky top-[140px] z-8 max-h-[calc(100vh-150px)] overflow-y-auto custom-scroll">
                    {loading ? (
                        <SidebarSkeleton />
                    ) : (
                        <>
                            <DocsHome />
                            <Separator orientation="horizontal" />
                            <MoreAbout />
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
