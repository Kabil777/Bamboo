"use client";
import {
	Bookmark,
	FileText,
	Heart,
	HelpCircle,
	LogIn,
	LogOut,
	Palette,
	Plus,
	Settings,
	User,
	Users,
} from "lucide-react";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from "react";
import { SadProfile } from "@/components/assets";
import { Avatar } from "@/components/shadcnUI/avatar";
import { Button } from "@/components/shadcnUI/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { useLogout } from "@/hooks/logoutHandler";
import { useAppState } from "@/hooks/ReduxHooks";
import { cn } from "@/lib/utils";

interface MenuItem {
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	href?: string;
	onClick?: () => void;
	disabled?: boolean;
}

interface MenuSection {
	items: MenuItem[];
}

export function DropDownProfileMenu() {
	const { user } = useAppState((s) => s.userReducer);
	const profile = {
		profile: {
			profiledetails: {
				title: user?.name,
				url: user?.profileImg,
			},
		},
	};
	const { profiledetails } = profile.profile ?? {};
	const { setTheme, theme } = useTheme();
	const [loaded, setLoaded] = useState(false);

	const logout = useLogout();

	// Dynamic menu configuration
	const menuSections: MenuSection[] = [
		{
			items: [
				{ label: "Profile", icon: User, href: "/profile" },
				{ label: "My Wishlist", icon: Heart },
				{ label: "Bookmarks", icon: Bookmark },
				{ label: "Your Blogs", icon: FileText },
			],
		},
		{
			items: [{ label: "New Team", icon: Users }],
		},
	];

	const bottomMenuItems: MenuItem[] = [
		{ label: "Settings", icon: Settings },
		{ label: "Help Center", icon: HelpCircle },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="!p-0 w-10 h-10 rounded-full bg-transparent hover:bg-transparent ring-0 focus:ring-0">
					{profiledetails ? (
						<Avatar className="relative overflow-hidden">
							{!loaded && (
								<Skeleton className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800" />
							)}

							{profiledetails.url && (
								<Image
									src={profiledetails.url}
									alt={profiledetails.title ?? "Profile"}
									width={96}
									height={96}
									referrerPolicy="no-referrer"
									unoptimized
									className={cn("rounded-full")}
									onLoad={() => setLoaded(true)}
								/>
							)}
						</Avatar>
					) : (
						<SadProfile className="!w-full !h-full" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="mr-1 w-45 md:w-56">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{/* Dynamic menu sections */}
				{menuSections.map((section, sectionIndex) => (
					<div key={sectionIndex}>
						<DropdownMenuGroup>
							{section.items.map((item, itemIndex) => {
								const IconComponent = item.icon;
								const menuItem = (
									<DropdownMenuItem
										key={itemIndex}
										onClick={item.onClick}
										disabled={item.disabled}
									>
										<IconComponent className="text-foreground mr-1 h-4 w-4" />
										<span>{item.label}</span>
									</DropdownMenuItem>
								);

								return item.href ? (
									<Link href={item.href} key={itemIndex}>
										{menuItem}
									</Link>
								) : (
									menuItem
								);
							})}
						</DropdownMenuGroup>
						{sectionIndex < menuSections.length - 1 && (
							<DropdownMenuSeparator />
						)}
					</div>
				))}

				<DropdownMenuSeparator />

				{/* Theme submenu */}
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Palette className="text-foreground mr-3 h-4 w-4" />
						<span>Theme</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
								<DropdownMenuRadioItem value="light">
									Light
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="system">
									System
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>

				{/* Dynamic bottom menu items */}
				{bottomMenuItems.map((item, index) => {
					const IconComponent = item.icon;
					const menuItem = (
						<DropdownMenuItem
							key={index}
							onClick={item.onClick}
							disabled={item.disabled}
						>
							<IconComponent className="text-foreground mr-1 h-4 w-4" />
							<span>{item.label}</span>
						</DropdownMenuItem>
					);

					return item.href ? (
						<Link href={item.href} key={index}>
							{menuItem}
						</Link>
					) : (
						menuItem
					);
				})}

				<DropdownMenuSeparator />

				{/* Auth section */}
				{!profiledetails ? (
					<DropdownMenuGroup className="flex flex-col gap-2">
						<Button asChild variant="outline">
							<Link href={"/login"}>
								<LogIn className="text-foreground mr-1 h-4 w-4" />
								Login
							</Link>
						</Button>
						<Button asChild>
							<Link href={"/login"}>
								<LogIn className="mr-1 h-4 w-4" />
								Signup
							</Link>
						</Button>
					</DropdownMenuGroup>
				) : (
					<DropdownMenuItem
						className="m-0.5 bg-black border-2 hover:cursor-pointer text-white hover:text-white active:bg-black focus:bg-black transition-colors duration-200"
						onClick={logout}
					>
						<LogOut className="mr-1 h-4 w-4 text-white" />
						<span>Log out</span>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
