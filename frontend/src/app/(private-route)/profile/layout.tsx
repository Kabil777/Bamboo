"use client"
import { ProfileRoutes } from "@/components/atomsComponents";
import { SectionCards } from "@/components/atomsComponents/sectionCard";
const tabs = [
    { label: "All", value: "all" },
    { label: "Posts", value: "posts" },
    { label: "Docs", value: "docs" },
    { label: "Bookmarks", value: "bookmark" }
];

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const handleTabChange = (selecttab: string) => {
        console.log("Selected Tab:", selecttab);
    };
    return (
        <>
            <div className="container mx-auto p-2 sm:p-4 relative">
                <div className="flex items-center space-x-4 w-full">
                    <SectionCards />
                </div>
                <div className="border-y border-border sticky top-[56px] z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-4 mb-2">
                    <ProfileRoutes tabs={tabs} onTabChange={handleTabChange} />
                </div>
                {children}
            </div>
        </>
    );
}
