"use client";
import { ProfileRoutes } from "@/components/atomsComponents";
import { SectionCards } from "@/components/atomsComponents/sectionCard";

const tabs = [
	{ label: "All", value: "all" },
	{ label: "Posts", value: "posts" },
	{ label: "Docs", value: "docs" },
	{ label: "Bookmarks", value: "bookmark" },
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
		<div className="min-h-screen">
			<div className="mx-auto py-8 space-y-6 container">
				<SectionCards />
				<div className="sticky top-[56px] z-10 bg-background/30 backdrop-blur-md -mx-4 px-4">
					<div>
						<ProfileRoutes tabs={tabs} onTabChange={handleTabChange} />
					</div>
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
}
