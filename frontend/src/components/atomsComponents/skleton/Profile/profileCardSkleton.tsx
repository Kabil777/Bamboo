"use client";

import { Skeleton } from "@/components/shadcnUI/skeleton";

export function SectionCardsSkeleton() {
	return (
		<div className="w-full space-y-3">
			{/* Card 1 skeleton */}
			<div className="w-full border border-border rounded-2xl p-8 relative">
				<div className="absolute top-8 right-8">
					<Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full" />
				</div>
				<div className="pr-32 space-y-4">
					<Skeleton className="h-9 w-56" />
					<Skeleton className="h-5 w-40" />
					<div className="flex gap-3 pt-1">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-16" />
					</div>
				</div>
				<div className="flex justify-end gap-2 mt-6">
					<Skeleton className="h-10 w-28 rounded-md" />
					<Skeleton className="h-10 w-12 rounded-md" />
				</div>
			</div>
			{/* Card 2 skeleton */}
			<div className="w-full border border-border rounded-2xl p-8 space-y-4">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-2/3" />
				<div className="flex gap-2 pt-2">
					<Skeleton className="h-7 w-16 rounded-full" />
					<Skeleton className="h-7 w-20 rounded-full" />
					<Skeleton className="h-7 w-14 rounded-full" />
				</div>
			</div>
			{/* Card 3 skeleton */}
			<div className="w-full border border-border rounded-2xl p-8">
				<Skeleton className="h-5 w-32 mb-5" />
				<div className="flex gap-5">
					<Skeleton className="h-5 w-24" />
					<Skeleton className="h-5 w-24" />
					<Skeleton className="h-5 w-24" />
				</div>
			</div>
		</div>
	);
}
