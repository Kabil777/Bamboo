"use client"
import { ProfileRoutes } from "@/components/atomsComponents";
import { SectionCards } from "@/components/atomsComponents/sectionCard";
const tabs = [
    { label: "_", value: "all" },
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
            <div className="container mx-auto p-2 sm:p-4">
                <div className="flex items-center space-x-4 w-full">
                    <SectionCards />
                </div>
                <div className="border-y border-border">
                    <ProfileRoutes tabs={tabs} onTabChange={handleTabChange} />
                </div>
                {children}
            </div>
        </>
    );
}
