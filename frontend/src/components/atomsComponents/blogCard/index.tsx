"use client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/shadcnUI/card";
import { Badge } from "@/components/shadcnUI/badge";
import { ProfileTag } from "@/components/atomsComponents";
import { BlogHomeCard } from "@/types/blog/blog-base";
import { useState } from "react";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { useRouter } from "next/navigation";
import { NextRouter } from "next/router";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useDispatch } from "react-redux";
import { BlogPageRtk } from "@/store/reducers/BlogPageReducer";
import Link from "next/link";

function pushRoute(id: string, router: AppRouterInstance, dispatch: any) {
    dispatch(BlogPageRtk(id));
    router.push(`blog/${id}`);
}

export const BlogCard: React.FC<BlogHomeCard> = ({
    id,
    title,
    description,
    coverUrl,
    authorId,
    createdAt,
    tags,
    authorName,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    console.log("BlogCard Rendered:", coverUrl);
    return (
      <div key={id}>
        <Card className="shadow-none rounded-none overflow-hidden items-center p-2 sm:p-4 gap-2 border-none transition duration-200 ease-in-out">
          <CardContent className="p-0 w-full grid grid-cols-5 items-center gap-2 md:gap-5 justify-between">
            <div className="p-0 col-span-full sm:row-start-1 sm:col-span-3 flex flex-col gap-0 md:gap-2">
              <Link href={`/blog/${id}`} className="cursor-pointer">
                <CardTitle className="text-base md:text-2xl font-semibold line-clamp-2">
                  {title}
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 text-xs md:text-sm">
                  {description}
                </CardDescription>
              </Link>
              <ProfileTag profileId={authorName ? authorName : "user101"} />
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="capitalize bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            {coverUrl && !imageError ? (
              <>
                {/* {
                  !isLoaded && (
                    <Skeleton className="sm:col-span-2 h-full row-start-1 col-span-full rounded-lg m-auto max-h-[160px] bg-border dark:bg-border w-full" />
                  )
                } */}
                <Image
                  src={coverUrl}
                  loading="eager"
                  alt="Blog Cover Image"
                  width={300}
                  height={200}
                  className="sm:col-span-2 row-start-1 col-span-full max-h-[160px] rounded-lg m-auto"
                  style={{ aspectRatio: "300/300", objectFit: "cover" }}
                  onLoad={() => setIsLoaded(true)}
                  onError={() => {
                    setImageError(true);
                  }}
                />
              </>
            ) : (
              <Skeleton className="sm:col-span-2 h-full row-start-1 col-span-full rounded-lg m-auto max-h-[160px]  bg-border dark:bg-border w-full" />
            )}
          </CardContent>
        </Card>
        <br />
        <hr />
        <br />
      </div>
    );
};
