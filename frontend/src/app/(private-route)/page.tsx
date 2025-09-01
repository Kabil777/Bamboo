"use client";

import {
  BlogCard,
  MoreAbout,
  TabChips,
} from "@/components/atomsComponents";
import { Separator } from "@/components/shadcnUI/separator";
import { DocsHome } from "@/components/ui";
import * as React from "react";
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

export default function Home() {
  const handleTabChange = (selecttab: string) => {
    console.log("Selected Tab:", selecttab);
  };
  return (
    <>
      <main className="flex justify-center">
        <div className="container grid grid-cols-4 transition-all duration-200 ease-linear gap-4 md:gap-6 relative">
          <div className="col-span-full border-b border-border sticky top-[58px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-9 p-0 md:p-1">
            <TabChips tabs={tabs} onTabChange={handleTabChange} />
          </div>

          <div className="col-span-full xl:col-span-3 mx-2 md:mx-0 xl:border-r-1 p-0 sm:p-2 relative">
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
          </div>
          <div className="hidden xl:flex flex-col xl:col-span-1 line-clamp-2 p-2 gap-4 xl:sticky top-[140px] z-8 max-h-[calc(100vh-150px)] overflow-y-auto custom-scroll">
            <DocsHome />
            <Separator orientation="horizontal" />
            <MoreAbout />
          </div>
        </div>
      </main>
    </>
  );
}
