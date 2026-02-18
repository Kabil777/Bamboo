"use client";

import { Skeleton } from "@/components/shadcnUI/skeleton";

export function SectionCardsSkeleton() {
	return (
		<div className="w-full space-y-3">
			{/* Unified Profile Card Skeleton */}
			<div className="w-full bg-background rounded-2xl overflow-hidden">
				{/* Gradient Banner Skeleton */}
				<div className="-mb-5">
					<Skeleton className="h-28 sm:h-32 rounded-none" />
				</div>

				{/* Main Content */}
				<div className="px-5 sm:px-6 space-y-0.5">
					{/* Profile Picture & Action Buttons Row */}
					<div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-4">
						{/* Profile Picture Skeleton */}
						<Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-background" />

						{/* Action Buttons Skeleton */}
						<div className="flex items-center gap-2 mb-1">
							<Skeleton className="rounded-full h-8 w-8" />
							<Skeleton className="rounded-full h-8 w-8" />
							<Skeleton className="rounded-full h-8 w-20" />
						</div>
					</div>

					{/* Name, Handle & Designation Badge Skeleton */}
					<div className="mb-3">
						<div className="flex items-center gap-3 flex-wrap">
							<Skeleton className="h-7 w-40 sm:w-48" />
							<Skeleton className="h-6 w-20 rounded-full" />
						</div>
						<Skeleton className="h-4 w-24 mt-1" />
					</div>

					{/* Description Skeleton */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>

					{/* Stats Row Skeleton */}
					<div className="flex items-center flex-wrap gap-x-1.5 gap-y-2 pt-3">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-16" />
					</div>

					{/* Tags Skeleton */}
					<div className="mt-2 pb-5">
						<div className="flex flex-wrap gap-2">
							<Skeleton className="h-6 w-20 rounded-full" />
							<Skeleton className="h-6 w-24 rounded-full" />
							<Skeleton className="h-6 w-16 rounded-full" />
							<Skeleton className="h-6 w-28 rounded-full" />
							<Skeleton className="h-6 w-14 rounded-full" />
						</div>
					</div>
				</div>
			</div>

			{/* Social Links Card Skeleton */}
			<div className="w-full bg-background border border-border rounded-2xl px-5 sm:px-6 py-5">
				<Skeleton className="h-3 w-20 mb-4" />
				<div className="flex flex-wrap gap-3">
					<Skeleton className="h-8 w-24 rounded-full" />
					<Skeleton className="h-8 w-28 rounded-full" />
					<Skeleton className="h-8 w-20 rounded-full" />
					<Skeleton className="h-8 w-26 rounded-full" />
				</div>
			</div>
		</div>
	);
}
