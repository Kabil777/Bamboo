"use client";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/shadcnUI/card";
import { Badge } from "@/components/shadcnUI/badge";
import { ProfileTag } from "@/components/atomsComponents";
import type { BlogHomeCard } from "@/types/blog/blog-base";
import { useState } from "react";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import Link from "next/link";
import { toast } from "sonner";
import { getAllProfileBlog } from "@/store/reducers/Profile/profile.read";

export const BlogCard: React.FC<BlogHomeCard & { isOwner?: boolean }> = ({
    id,
    title,
    description,
    coverUrl,
    authorId,
    createdAt,
    tags,
    authorName,
    visibility,
    status,
    isOwner = false,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const dispatch = useAppDispatch();
    const isDraft = status && status !== "PUBLISHED";
    const handleBlockedOpen = (e: React.MouseEvent) => {
        if (isOwner && isDraft) {
            e.preventDefault();
            toast.error("This blog is a draft. Publish it to view.");
        }
    };

    return (
        <div key={id}>
            <Card className="shadow-none rounded-none overflow-hidden items-center p-2 sm:p-4 gap-2 border-none transition duration-200 ease-in-out my-3">
                <CardContent className="p-0 w-full grid grid-cols-5 items-center gap-2 md:gap-5 justify-between">
                    <div className="p-0 col-span-full sm:row-start-1 sm:col-span-3 flex flex-col gap-0 md:gap-2">
                        {isOwner && isDraft ? (
                            <div
                                role="button"
                                tabIndex={0}
                                className="cursor-pointer"
                                onClick={handleBlockedOpen}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        handleBlockedOpen(e as unknown as React.MouseEvent);
                                    }
                                }}
                            >
                                <CardTitle className="text-base md:text-2xl font-semibold line-clamp-2">
                                    {title}
                                </CardTitle>
                                <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 text-xs md:text-sm">
                                    {description}
                                </CardDescription>
                            </div>
                        ) : (
                            <Link href={`/blog/${id}`} className="cursor-pointer">
                                <CardTitle className="text-base md:text-2xl font-semibold line-clamp-2">
                                    {title}
                                </CardTitle>
                                <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 text-xs md:text-sm">
                                    {description}
                                </CardDescription>
                            </Link>
                        )}
                        <ProfileTag
                            idBlog={id}
                            profileId={authorName ? authorName : "user101"}
                            createdAt={createdAt}
                            authorName={authorName}
                            visibility={visibility}
                            status={status}
                            isOwner={isOwner}
                            showMenu={isOwner}
                            onVisibilityUpdated={() => {
                                if (isOwner) {
                                    dispatch(getAllProfileBlog());
                                }
                            }}
                        />
                        <div className="flex flex-wrap gap-2 mt-3">
                            {tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    className={`capitalize border ${getTagClass(tag)}`}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    {coverUrl && !imageError ? (
                        <div className="sm:col-span-2 row-start-1 col-span-full flex items-center justify-center w-full h-full max-h-[160px]">
                            <div className="relative w-full h-[160px]">
                                <Image
                                    src={coverUrl}
                                    loading="eager"
                                    alt="Blog Cover Image"
                                    fill
                                    className={`object-cover rounded-lg border transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                                    sizes="(max-width: 640px) 100vw, 300px"
                                    onLoadingComplete={() => setIsLoaded(true)}
                                    onError={() => {
                                        setImageError(true);
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <Skeleton className="sm:col-span-2 h-full row-start-1 col-span-full rounded-lg m-auto max-h-[160px] bg-border dark:bg-border w-full" />
                    )}
                </CardContent>
            </Card>
            <hr />
        </div>
    );
};
    const tagColors = [
        "bg-emerald-100 text-emerald-800 border-emerald-200",
        "bg-sky-100 text-sky-800 border-sky-200",
        "bg-amber-100 text-amber-800 border-amber-200",
        "bg-rose-100 text-rose-800 border-rose-200",
        "bg-indigo-100 text-indigo-800 border-indigo-200",
    ];
    const getTagClass = (tag: string) => {
        let hash = 0;
        for (let i = 0; i < tag.length; i += 1) {
            hash = (hash * 31 + tag.charCodeAt(i)) % 1000;
        }
        return tagColors[hash % tagColors.length];
    };
