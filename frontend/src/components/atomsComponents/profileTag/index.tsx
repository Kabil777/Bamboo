"use client";
import { motion } from "framer-motion";
import { Bookmark, BookOpen, Ellipsis } from "lucide-react";
import { useState } from "react";
import { ProfileHoverTag } from "../profileHoverTag";
import { BlogUpdateDetails, VisibilityPopover } from "../blogUpdateDetials";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";
import { Pencil, Trash2, Eye, ExternalLink, Share2 } from "lucide-react";
import { SharePopover } from "../sharePopover";

export const ProfileTag = ({ profileId }: { profileId?: string }) => {
	const [bookmark, setBookmark] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [copyPopoverOpen, setCopyPopoverOpen] = useState(false);
	const [visibilityPopoverOpen, setVisibilityPopoverOpen] = useState(false);
	const handleVisibilityPopoverOpen = () => {
		setDropdownOpen(false);
		setTimeout(() => {
			setVisibilityPopoverOpen(true);
		}, 100);
	};
	const handleCopyPopoverOpen = () => {
		setDropdownOpen(false);
		setTimeout(() => {
			setCopyPopoverOpen(true);
		}, 100);
	};
	const handleEditClick = () => {
		setDropdownOpen(false);
		setTimeout(() => {
			setIsEditDialogOpen(true);
		}, 100);
	};

	return (
		<>
			<div className="flex flex-wrap gap-2 mt-2 items-center justify-start gap-x-3">
				<ProfileHoverTag profileId={profileId} />
				<p className="text-sm text-muted-foreground italic">~ a month ago</p>

				<p className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium ">
					<BookOpen size={14} />
					165k
				</p>

				<p
					onClick={() => setBookmark(!bookmark)}
					className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium cursor-pointer"
				>
					<motion.span
						key={bookmark ? "bookmark" : "unbookmark"}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1.1, opacity: 1 }}
						exit={{ scale: 0.8, opacity: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 15 }}
						className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium cursor-pointer"
					>
						<Bookmark
							className={`text-muted-foreground ${bookmark && "fill-muted-foreground"}`}
							size={14}
						/>
					</motion.span>
					165k
				</p>

				<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
					<DropdownMenuTrigger
						className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium cursor-pointer"
						asChild
					>
						<p>
							<Ellipsis size={14} />
						</p>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-40">
						<DropdownMenuItem onClick={handleEditClick}>
							<Pencil className="h-4 w-4" />
							<span>Edit</span>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<ExternalLink className="h-4 w-4" />
							<span>Open in Editor</span>
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={handleVisibilityPopoverOpen}>
							<Eye className="h-4 w-4" />
							<span>Visibility</span>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleCopyPopoverOpen}>
							<Share2 className="h-4 w-4" />
							<span>Share</span>
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<DropdownMenuItem variant="destructive">
							<Trash2 className="h-4 w-4" />
							<span>Delete</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<SharePopover
				text={`https://bamboo.dev/blog/${profileId ? `?ref=${profileId}` : ""}`}
				open={copyPopoverOpen}
				setOpen={setCopyPopoverOpen}
			>
				{""}
			</SharePopover>
			<VisibilityPopover
				open={visibilityPopoverOpen}
				setOpen={setVisibilityPopoverOpen}
			/>
			<BlogUpdateDetails
				open={isEditDialogOpen}
				setOpen={setIsEditDialogOpen}
			/>
		</>
	);
};
