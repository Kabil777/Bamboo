"use client";

import { motion } from "framer-motion";
import { PencilIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	FaFacebook,
	FaGithub,
	FaGlobe,
	FaInstagram,
	FaLinkedin,
	FaTwitter,
	FaYoutube,
} from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoIosShareAlt } from "react-icons/io";
import { MdOutlineArticle } from "react-icons/md";

import { Badge } from "@/components/shadcnUI/badge";
import { Button } from "@/components/shadcnUI/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcnUI/dialog";
import { Skeleton } from "@/components/shadcnUI/skeleton";

import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { useImageColors } from "@/hooks/useImageColors";
import {
	getProfileDetials,
	getUserProfileByHandle,
} from "@/store/reducers/Profile/profile.read";
import { SharePopover } from "../sharePopover";
import { SectionCardsSkeleton } from "../skleton/Profile/profileCardSkleton";

const platformIcons = {
	github: FaGithub,
	linkedin: FaLinkedin,
	twitter: FaTwitter,
	website: FaGlobe,
	youtube: FaYoutube,
	facebook: FaFacebook,
	instagram: FaInstagram,
};

const platformNames = {
	github: "GitHub",
	linkedin: "LinkedIn",
	twitter: "Twitter",
	website: "Website",
	youtube: "YouTube",
	facebook: "Facebook",
	instagram: "Instagram",
};

export function SectionCards({ viewingHandle }: { viewingHandle?: string }) {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const { profileData, profileLoading } = useAppState(
		(s) => s.getProfileReducers,
	);

	// Get current logged-in user's info
	const { user } = useAppState((s) => s.userReducer);

	// Determine if viewing own profile
	const isOwnProfile = !viewingHandle || viewingHandle === user?.handle;

	const [follow, setFollow] = useState(false);
	const [avatarLoaded, setAvatarLoaded] = useState(false);
	const [gradientColors, setGradientColors] = useState({
		start: "transparent",
		middle: "transparent",
	});

	// Extract colors from profile image, with user handle as fallback for color generation
	const { dominant, isLoading: colorLoading } = useImageColors(
		profileData?.coverUrl,
		profileData?.handle || profileData?.name,
	);

	// Update gradient colors when dominant color changes
	useEffect(() => {
		const match = dominant.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
		if (match) {
			const [, r, g, b] = match;
			const newColors = {
				start: `rgba(${r}, ${g}, ${b}, 0.4)`,
				middle: `rgba(${r}, ${g}, ${b}, 0.15)`,
			};
			setGradientColors(newColors);
		}
	}, [dominant]);

	const mockFollowers = [
		{
			id: 1,
			name: "John Doe",
			handle: "johndoe",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
		},
		{
			id: 2,
			name: "Jane Smith",
			handle: "janesmith",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
		},
		{
			id: 3,
			name: "Mike Wilson",
			handle: "mikew",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
		},
		{
			id: 4,
			name: "Sarah Brown",
			handle: "sarahb",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
		},
		{
			id: 5,
			name: "Tom Davis",
			handle: "tomd",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
		},
	];

	const mockFollowing = [
		{
			id: 1,
			name: "Alex Johnson",
			handle: "alexj",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
		},
		{
			id: 2,
			name: "Emily Chen",
			handle: "emilyc",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
		},
		{
			id: 3,
			name: "David Lee",
			handle: "davidl",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
		},
	];

	useEffect(() => {
		// Fetch profile data when component mounts or viewingHandle changes
		if (viewingHandle && viewingHandle !== user?.handle) {
			// Viewing another user's profile
			dispatch(getUserProfileByHandle(viewingHandle));
		} else if (!viewingHandle || viewingHandle === user?.handle) {
			// Viewing own profile
			dispatch(getProfileDetials());
		}
	}, [dispatch, viewingHandle, user?.handle]);

	if (profileLoading || !profileData) {
		return <SectionCardsSkeleton />;
	}

	const UserListDialog = ({
		title,
		label,
		users,
	}: {
		title: string;
		label: string;
		users: typeof mockFollowers;
	}) => (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="link"
					className="hover:underline p-0 underline-offset-2 cursor-pointer transition-colors hover:text-foreground"
				>
					{label}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md rounded-2xl">
				<DialogHeader>
					<DialogTitle className="text-lg">{title}</DialogTitle>
				</DialogHeader>
				<div className="space-y-1 max-h-[400px] overflow-y-auto">
					{users.map((user) => (
						<div
							key={user.id}
							className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/80 transition-colors cursor-pointer"
						>
							<Image
								src={user.avatar}
								alt={user.name}
								width={40}
								height={40}
								className="rounded-full"
							/>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-semibold truncate">{user.name}</p>
								<p className="text-xs text-muted-foreground truncate">
									@{user.handle}
								</p>
							</div>
							<Button
								size="sm"
								variant="outline"
								className="text-xs h-8 rounded-lg"
							>
								View
							</Button>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);

	return (
		<div className="w-full space-y-3">
			{/* Unified Profile Card */}
			<div className="w-full bg-background rounded-2xl overflow-hidden inset-shadow-sm">
				{/* Gradient Banner with Extended Fade */}
				<div className="-mb-5">
					{colorLoading ? (
						<Skeleton className="h-28 sm:h-32 rounded-none" />
					) : (
						<div
							key={`gradient-${dominant}`}
							className="h-28 sm:h-32 transition-all duration-500 "
							style={{
								backgroundImage: `linear-gradient(to bottom, ${gradientColors.start}, ${gradientColors.middle}, transparent)`,
							}}
						/>
					)}
				</div>
				{/* Main Content */}
				<div className="px-5 sm:px-6 space-y-0.5">
					{/* Profile Picture & Action Buttons Row */}
					<div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-4">
						{/* Profile Picture */}
						<div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-background overflow-hidden bg-background z-5">
							{profileData.coverUrl ? (
								<Image
									src={profileData.coverUrl}
									alt="Profile"
									width={144}
									height={144}
									className={`w-full h-full object-cover transition-opacity duration-300 ${avatarLoaded ? "opacity-100" : "opacity-0"}`}
									onLoadingComplete={() => setAvatarLoaded(true)}
								/>
							) : (
								<div className="w-full h-full bg-muted flex items-center justify-center">
									<span className="text-2xl sm:text-3xl font-bold text-muted-foreground">
										{profileData.name?.charAt(0)?.toUpperCase() || "?"}
									</span>
								</div>
							)}
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-2 mb-1">
							{isOwnProfile && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => router.push("/profile/editprofile")}
									className="rounded-full px-3 h-8 text-xs gap-1.5 font-medium shadow-sm"
								>
									<PencilIcon size={14} />
								</Button>
							)}
							<SharePopover
								text={`https://bamboo.com/user/profile/${profileData.handle}`}
							>
								<Button
									variant="outline"
									size="sm"
									className="rounded-full px-3 h-8 text-xs gap-1.5 font-medium shadow-sm"
								>
									<IoIosShareAlt size={14} />
								</Button>
							</SharePopover>
							{!isOwnProfile && (
								<motion.div whileTap={{ scale: 0.96 }}>
									<Button
										onClick={() => setFollow(!follow)}
										variant={follow ? "outline" : "default"}
										size="sm"
										className="rounded-full px-5 h-8 text-xs font-semibold shadow-sm"
									>
										<motion.span
											key={follow ? "ing" : "ow"}
											initial={{ opacity: 0, y: -4 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.15 }}
										>
											{follow ? "Following" : "Follow"}
										</motion.span>
									</Button>
								</motion.div>
							)}
						</div>
					</div>

					{/* Name, Handle & Designation Badge */}
					<div className="mb-3">
						<div className="flex items-center gap-3 flex-wrap ">
							<h1 className="text-xl sm:text-2xl font-bold tracking-tight">
								{profileData.name}
							</h1>
							{profileData.designation && (
								<Badge className="bg-gradient-to-br from-foreground to-foreground/80 hover:from-foreground hover:to-foreground border-0 px-3 py-1 text-[10px] sm:text-xs font-semibold">
									{profileData.designation.charAt(0).toUpperCase() +
										profileData.designation.slice(1).toLowerCase()}
								</Badge>
							)}
						</div>
						<p className="text-xs sm:text-sm lowercase text-muted-foreground font-medium">
							@{profileData.handle}
						</p>
					</div>

					{/* Description */}
					<p className="text-sm sm:text-[15px] leading-relaxed text-foreground/80">
						{profileData.description ||
							"Welcome to my profile! I'm excited to share my work and connect with the community."}
					</p>

					{/* Stats Row */}
					<div className="flex items-center flex-wrap gap-x-1.5 gap-y-2 text-xs sm:text-sm">
						<UserListDialog
							title="Followers"
							label="50k followers"
							users={mockFollowers}
						/>
						<span className="text-primary text-2xl">·</span>
						<UserListDialog
							title="Following"
							label="70 following"
							users={mockFollowing}
						/>
						<span className="text-primary text-2xl">·</span>
						<span className="items-center text-primary inline-flex justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
							<MdOutlineArticle className="w-3.5 h-3.5" /> 100 posts
						</span>
						<span className="text-primary text-2xl">·</span>
						<span className="items-center text-primary inline-flex justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
							<HiOutlineDocumentText className="w-3.5 h-3.5" /> 25 docs
						</span>
					</div>

					{/* Tags */}
					{profileData.profile?.tags?.length > 0 && (
						<div className="mt-2">
							<div className="flex flex-wrap gap-2">
								{profileData.profile.tags.slice(0, 5).map((tag) => (
									<Badge
										key={tag}
										variant="outline"
										className="rounded-full text-muted-foreground text-[10px] sm:text-xs font-medium px-3 py-1"
									>
										{tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()}
									</Badge>
								))}
								{profileData.profile.tags.length > 5 && (
									<Badge
										variant="outline"
										className="rounded-full  text-[8px] sm:text-[10px] font-medium px-3 py-1 text-muted-foreground"
									>
										+{profileData.profile.tags.length - 5} more
									</Badge>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Social Links Card */}
			{profileData.profile?.social &&
				Object.keys(profileData.profile.social).length > 0 && (
					<div className="w-full bg-background border border-border rounded-2xl px-5 sm:px-6 py-5">
						<p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-4">
							Find me on
						</p>
						<div className="flex flex-wrap gap-3">
							{Object.entries(profileData.profile.social).map(
								([platform, url]) => {
									const Icon =
										platformIcons[platform as keyof typeof platformIcons];
									const name =
										platformNames[platform as keyof typeof platformNames];
									return (
										<Link
											key={platform}
											href={url || ""}
											target="_blank"
											className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground border border-border rounded-full px-4 py-2 hover:bg-muted hover:text-foreground transition-colors"
										>
											{Icon && <Icon className="w-3.5 h-3.5" />}
											{name}
										</Link>
									);
								},
							)}
						</div>
					</div>
				)}
		</div>
	);
}
