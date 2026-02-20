import { AnimatePresence, motion } from "framer-motion";
import { UserCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/shadcnUI/avatar";
import { Badge } from "@/components/shadcnUI/badge";
import { Button } from "@/components/shadcnUI/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/shadcnUI/hover-card";

export function ProfileHoverTag({ profileId }: { profileId?: string }) {
	const [follow, setFollow] = useState(false);

	return (
		<HoverCard key={profileId} openDelay={50} closeDelay={50}>
			<HoverCardTrigger asChild>
				<p className="text-sm text-muted-foreground italic flex items-center gap-1 font-medium cursor-pointer">
					@Kowsik
				</p>
			</HoverCardTrigger>
			<HoverCardContent
				className="w-64 border-2 shadow-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4"
				side="right"
				align="start"
			>
				<div className="flex gap-3 mb-3">
					<Avatar className="w-14 h-14 flex-shrink-0">
						<AvatarImage src="https://i.pravatar.cc/150?img=12" />
						<AvatarFallback>VC</AvatarFallback>
					</Avatar>

					<div className="flex flex-col flex-1 min-w-0">
						<h4 className="text-sm font-bold text-foreground truncate">
							Kowsik
						</h4>
						<p className="text-xs text-muted-foreground mb-1.5">@Kowsik</p>
						<Badge className="bg-gradient-to-br from-foreground to-foreground/80 hover:from-foreground hover:to-foreground border-0 px-2 py-0.5 text-[10px] font-semibold w-fit">
							Software Developer
						</Badge>
					</div>
				</div>

				<div className="flex items-center justify-around py-2 border-y border-border/50 mb-3">
					<div className="flex flex-col items-center">
						<span className="text-sm font-bold text-foreground">1.2K</span>
						<span className="text-[10px] text-muted-foreground">Followers</span>
					</div>
					<div className="w-px h-8 bg-border"></div>
					<div className="flex flex-col items-center">
						<span className="text-sm font-bold text-foreground">324</span>
						<span className="text-[10px] text-muted-foreground">Following</span>
					</div>
				</div>

				<motion.div
					className="w-full"
					whileTap={{ scale: 0.96 }}
					transition={{ type: "spring", stiffness: 400, damping: 17 }}
				>
					<Button
						onClick={() => setFollow(!follow)}
						variant={follow ? "outline" : "default"}
						size="sm"
						className="w-full rounded-full px-6 h-9 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden group"
					>
						<AnimatePresence mode="wait">
							4 h-8 text-xs font-semibold shadow-sm hover:shadow-md
							<motion.div
								key={follow ? "following" : "follow"}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className="flex items-center gap-2"
							>
								{follow ? (
									<>
										<UserCheck className="w-4 h-4" />
										<span>Following</span>
									</>
								) : (
									<>
										<UserPlus className="w-4 h-4" />
										<span>Follow</span>
									</>
								)}
							</motion.div>
						</AnimatePresence>

						{/* Shimmer effect on hover */}
						<motion.div
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
							initial={{ x: "-100%" }}
							whileHover={{ x: "100%" }}
							transition={{ duration: 0.6 }}
						/>
					</Button>
				</motion.div>
			</HoverCardContent>
		</HoverCard>
	);
}
