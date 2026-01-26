"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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
import { IoIosShareAlt } from "react-icons/io";
import { Badge } from "@/components/shadcnUI/badge";
import { Button } from "@/components/shadcnUI/button";
import { CardDescription } from "@/components/shadcnUI/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcnUI/dialog";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import { getProfileDetials } from "@/store/reducers/Profile/setProfileReducers";
import type { Profile } from "@/types/Profile/profile-types";
import { SharePopover } from "../sharePopover";

interface ProfileData extends Profile {
	followers: string;
	following: number;
	posts: number;
	docs: number;
}

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

export function SectionCards() {
	const dispatch = useAppDispatch();

	const [follow, setFollow] = useState(false);
	const [loading, setLoading] = useState(true);

	// Mock followers data
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

	// Mock following data
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

	// Profile data state - this would come from your backend/context

	const [profileData, setProfileData] = useState<ProfileData>({
		name: "",
		designation: "",
		handle: "",
		description: "",
		coverUrl: null,
		profile: { tags: [], social: {} },
		followers: "5B",
		following: 50,
		posts: 10,
		docs: 15,
	});

	useEffect(() => {
		setLoading(true);
		try {
			dispatch(getProfileDetials()).then((data) => {
				const val = data.payload as Profile;
				setProfileData(
					(prev) =>
						({
							...prev,
							name: val.name || "",
							designation: val.designation,
							handle: val.handle || "",
							description: val.description || "",
							coverUrl: val.coverUrl || null,
							profile: val.profile,
						}) as ProfileData,
				);
        setLoading(true);
			});
		} catch {
			setLoading(true);
		}
	}, [dispatch]);

	// const handleProfileUpdate = (updatedData: ProfileData) => {
	// 	setProfileData(updatedData);
	// 	console.log("Profile updated:", updatedData);
	// };

	return (
		<div className="flex items-center justify-center flex-col sm:flex-row gap-2 sm:gap-4 mb-3 sm:mb-0 sm:p-4 rounded-md w-full relative">
			<div className="relative w-full h-full max-w-60">
				{loading && (
					<Skeleton className="aspect-square w-full h-full rounded-xl" />
				)}
				{profileData.coverUrl ? (
					<Image
						src={profileData.coverUrl}
						alt="Profile Image"
						width={160}
						height={160}
						onLoad={() => setLoading(false)}
						className={`aspect-square object-cover w-full h-full border-4 border-white rounded-xl transition-opacity duration-300 ${
							loading ? "opacity-0" : "opacity-100"
						}`}
					/>
				) : (
					!loading && (
						<div className="aspect-square w-full h-full border-4 border-white rounded-xl bg-muted flex items-center justify-center">
							<span className="text-sm text-muted-foreground">No cover</span>
						</div>
					)
				)}
			</div>
			<div className="font-semibold p-5 text-wrap space-y-1 border border-border rounded-md bg-muted/50 relative w-full">
				{/*Profile dashboard*/}
				<div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-2 items-center text-muted-foreground ">
					{/* <ProfileEditPopOver
						profileData={{
							firstName: profileData.name?.split(" ")[0] || "",
							lastName: profileData.name?.split(" ")[1] || "",
							designation: profileData.designation,
							handle: profileData.handle || "",
							description: profileData.description || "",
							tags: profileData.profile?.tags || [],
							socialLinks: profileData.profile?.social
								? Object.entries(profileData.profile.social).map(
										([platform, url], idx) => ({
											id: `${platform}-${idx}`,
											platform,
											url,
											icon: platform,
										}),
									)
								: [],
							profileImage: profileData.coverUrl || "",
						}}
						onSave={handleProfileUpdate}
					>
						<BiEdit
							className="cursor-pointer hover:text-foreground"
							size={20}
						/>
					</ProfileEditPopOver> */}
					<SharePopover
						text={`https://bamboo.com/user/profile/${profileData.handle}`}
					>
						<IoIosShareAlt
							className="cursor-pointer hover:text-foreground"
							size={20}
						/>
					</SharePopover>
				</div>
				<div className="flex space-x-2 flex-wrap items-center">
					{loading ? (
						<Skeleton className="h-6 w-40" />
					) : (
						<h1 className="text-lg sm:text-2xl">{profileData.name}</h1>
					)}
					<motion.div
						initial={false}
						animate={{
							backgroundColor: follow
								? "hsl(var(--accent-foreground))"
								: "hsl(var(--foreground))",
							scale: 1,
						}}
						whileTap={{ scale: 0.95 }}
						transition={{ type: "spring", stiffness: 300, damping: 20 }}
					>
						<Button
							onClick={() => setFollow(!follow)}
							className="p-1 py-0.5 h-fit text-xs font-normal align-[4px]"
						>
							<motion.span
								key={follow ? "following" : "follow"}
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 5 }}
								transition={{ duration: 0.2 }}
							>
								{follow ? "Following" : "Follow"}
							</motion.span>
						</Button>
					</motion.div>
				</div>
				{loading ? (
					<Skeleton className="h-4 w-28 my-2" />
				) : (
					<Badge variant="outline" className="text-xs sm:text-sm">
						{profileData.designation}
					</Badge>
				)}
				<div className="text-muted-foreground text-sm font-medium space-x-2 flex flex-wrap items-center">
					{loading ? (
						<div className="flex items-center gap-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-12" />
						</div>
					) : (
						<>
							<b>@{profileData.handle}</b>
							<p>•</p>
						</>
					)}
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="link"
								className="text-sm p-0 h-auto font-medium text-muted-foreground hover:text-foreground"
							>
								{profileData.followers} followers
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Followers</DialogTitle>
							</DialogHeader>
							<div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
								{mockFollowers.map((follower) => (
									<div
										key={follower.id}
										className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
									>
										<Image
											src={follower.avatar}
											alt={follower.name}
											width={48}
											height={48}
											className="rounded-full"
										/>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-semibold truncate">
												{follower.name}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												@{follower.handle}
											</p>
										</div>
										<Button size="sm" variant="outline" className="text-xs h-8">
											View
										</Button>
									</div>
								))}
							</div>
						</DialogContent>
					</Dialog>
					<p>•</p>
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant="link"
								className="text-sm p-0 h-auto font-medium text-muted-foreground hover:text-foreground"
							>
								{profileData.following} following
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Following</DialogTitle>
							</DialogHeader>
							<div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
								{mockFollowing.map((user) => (
									<div
										key={user.id}
										className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
									>
										<Image
											src={user.avatar}
											alt={user.name}
											width={48}
											height={48}
											className="rounded-full"
										/>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-semibold truncate">
												{user.name}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												@{user.handle}
											</p>
										</div>
										<Button size="sm" variant="outline" className="text-xs h-8">
											View
										</Button>
									</div>
								))}
							</div>
						</DialogContent>
					</Dialog>
					{!loading && (
						<>
							<p>•</p>
							<p>{profileData.posts} posts</p>
							<p>•</p>
							<p>{profileData.docs} docs</p>
						</>
					)}
				</div>

				{loading ? (
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				) : (
					<CardDescription>{profileData.description}</CardDescription>
				)}

				{loading ? (
					<div className="flex gap-2 my-4">
						<Skeleton className="h-6 w-16 rounded-full" />
						<Skeleton className="h-6 w-16 rounded-full" />
						<Skeleton className="h-6 w-16 rounded-full" />
					</div>
				) : (
					profileData.profile?.tags?.length > 0 && (
						<div className="flex flex-wrap gap-2 my-4">
							{profileData.profile.tags.map((tag) => (
								<Badge
									key={tag}
									className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
								>
									{tag}
								</Badge>
							))}
						</div>
					)
				)}

				{loading ? (
					<div className="flex gap-3 mt-2">
						<Skeleton className="h-4 w-12 rounded" />
						<Skeleton className="h-4 w-12 rounded" />
						<Skeleton className="h-4 w-12 rounded" />
					</div>
				) : (
					profileData.profile?.social &&
					Object.keys(profileData.profile.social).length > 0 && (
						<div className="flex flex-wrap gap-4">
							{Object.entries(profileData.profile.social).map(
								([platform, url]) => {
									const IconComponent =
										platformIcons[platform as keyof typeof platformIcons];
									const platformName =
										platformNames[platform as keyof typeof platformNames];
									return (
										<Link
											key={platform}
											className="flex space-x-2 items-center text-sm hover:text-foreground transition-colors"
											href={url || ""}
											target="_blank"
										>
											{IconComponent && <IconComponent className="h-4 w-4" />}
											<span>{platformName}</span>
										</Link>
									);
								},
							)}
						</div>
					)
				)}
			</div>
		</div>
	);
}
