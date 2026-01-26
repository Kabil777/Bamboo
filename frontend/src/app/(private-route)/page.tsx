"use client";
import { BlogCard, MoreAbout, TabChips } from "@/components/atomsComponents";
import { BlogCardSkeleton } from "@/components/atomsComponents/skleton/blogCardSkleton";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { DocsHome } from "@/components/ui";
import { RootState } from "@/store/store";
import { Separator } from "@/components/shadcnUI/separator";
import {  useSelector } from "react-redux";
import { SidebarSkeleton } from "@/components/atomsComponents/skleton/sidebarSkleton";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { getCoverBlog } from "@/store/reducers/BlogCoverReducer";
import { DocsCoverRtk } from "@/store/reducers/DocsCoverReducer";
import BambooLoader from "@/components/atomsComponents/logo/BambooLoader";
import Link from "next/link";

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

    const { blogLoading, data } = useSelector((s: RootState) => s.blogReducer);
    const { isDocsLoading, docs } = useAppState((s) => s.docsHomeReducer);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!data || data.length === 0) {
            dispatch(getCoverBlog({ cursor: null, mode: "init" }));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!docs || docs.length === 0) {
            dispatch(DocsCoverRtk());
        }
    }, [dispatch]);


    return (
      <main className="flex justify-center">
        <div className="container grid grid-cols-4 gap-4 md:gap-6">
          <div className="col-span-full sticky top-[58px] z-10 bg-background">
            {blogLoading ? (
              <Skeleton className="h-8 w-full mt-2.5" />
            ) : (
              <TabChips tabs={tabs} onTabChange={() => {}} />
            )}
          </div>

          {/* Main content */}
          <div className="col-span-full xl:col-span-3 relative">
            <BambooLoader variant="sway" />
            {blogLoading ? (
              <div className="absolute inset-0 z-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div>
                {data == null || data.length === 0 ? (
                  <div className="p-4 justify-center flex">
                    <p className="text-sm text-muted-foreground px-2">
                      No blogs available
                    </p>
                    <Link
                      href="/editor/blog/ca8ce312-049f-4a3c-98d8-13de43a84a6b"
                      className="text-sm underline px-1"
                    >
                      rediret
                    </Link>
                  </div>
                ) : (
                  (data ?? []).map((d) => <BlogCard key={d.id} {...d} />)
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden xl:flex flex-col xl:col-span-1 line-clamp-2 p-2 gap-4 xl:sticky top-[140px] z-8 max-h-[calc(100vh-150px)] overflow-y-auto custom-scroll">
            {isDocsLoading ? (
              <SidebarSkeleton />
            ) : (
              <>
                <DocsHome docs={docs} />
                <Separator orientation="horizontal" />
                <MoreAbout />
              </>
            )}
          </div>
        </div>
      </main>
    );
}
