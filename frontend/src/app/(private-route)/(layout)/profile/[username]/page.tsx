"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { BlogCard, DocsProfileCard, useProfileTab } from "@/components/atomsComponents";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/shadcnUI/avatar";
import { Button } from "@/components/shadcnUI/button";
import { Separator } from "@/components/shadcnUI/separator";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { getAllProfileBlogByHandle, getAllProfileDocsByHandle } from "@/store/reducers/Profile/profile.read";
import { BlogCardSkeleton } from "@/components/atomsComponents/skleton/blogCardSkleton";

const cardData = [
    {
        id: 1,
        title: "React",
        description: "A JavaScript library for building user interfaces",
        follower: "112k",
        follow: false,
    },
    {
        id: 2,
        title: "Vue",
        description:
            "A progressive JavaScript framework for building user interfaces",
        follower: "112k",
        follow: false,
    },
    {
        id: 3,
        title: "Angular",
        description:
            "A platform for building mobile and desktop web applications",
        follower: "112k",
        follow: false,
    },
    {
        id: 4,
        title: "Svelte",
        description: "A radical new approach to building user interfaces",
        follower: "112k",
        follow: false,
    },
];

export default function UserProfile() {
    const dispatch = useAppDispatch();
    const { blogLoading, blogs, docsLoading, docs } = useAppState((s) => s.getProfileReducers);
    const { user } = useAppState((s) => s.userReducer);
    const params = useParams();
    const username = params.username as string;
    const handle = username?.startsWith("@") ? username.slice(1) : username;
    const isOwnProfile = !!user?.handle && user.handle === handle;
    const { selectedTab } = useProfileTab();
    const visibleBlogs = useMemo(() => {
        if (!blogs?.blogPagesDto) return [];
        if (isOwnProfile) return blogs.blogPagesDto;
        return blogs.blogPagesDto.filter(
            (item) =>
                item.visibility === "PUBLIC" && item.status === "PUBLISHED",
        );
    }, [blogs, isOwnProfile]);
    
    useEffect(() => {
        if ((selectedTab === "posts" || selectedTab === "all") && !blogLoading && !blogs) {
            dispatch(getAllProfileBlogByHandle(handle));
        }
        if ((selectedTab === "docs" || selectedTab === "all") && !docsLoading && !docs) {
            dispatch(getAllProfileDocsByHandle(handle));
        }
    }, [blogs, dispatch, blogLoading, docsLoading, docs, handle, selectedTab]);

    return (
        <div className="container grid grid-cols-4 transition-all duration-200 ease-linear gap-4 md:gap-6 relative">
            <div className="col-span-full xl:col-span-3 mx-2 md:mx-0 xl:border-r-1 p-0 sm:p-2 relative">
                {(selectedTab === "posts" || selectedTab === "all") && (
                    <>
                        {blogLoading && <BlogCardSkeleton />}
                        {!blogLoading &&
                            visibleBlogs.map((item) => (
                                <BlogCard
                                    key={item.id}
                                    title={item.title}
                                    description={item.description}
                                    coverUrl={item.coverUrl}
                                    authorId={item.authorId}
                                    authorName={item.authorId}
                                    id={item.id}
                                    tags={item.tags}
                                    createdAt={item.createdAt}
                                    visibility={item.visibility}
                                    status={item.status}
                                    isOwner={isOwnProfile}
                                />
                            ))}
                    </>
                )}

                {(selectedTab === "docs" || selectedTab === "all") && (
                    <>
                        {docsLoading && <BlogCardSkeleton />}
                        {!docsLoading && docs?.docs?.length
                            ? docs.docs.map((doc) => (
                                  <DocsProfileCard
                                      key={doc.id}
                                      id={doc.id}
                                      title={doc.title}
                                      description={doc.description}
                                      coverUrl={doc.coverUrl}
                                      createdAt={doc.createdAt}
                                      visibility={doc.visibility}
                                      status={doc.status}
                                      isOwner={isOwnProfile}
                                      authorName={doc.authorName}
                                  />
                              ))
                            : null}
                    </>
                )}
            </div>
            <div className="hidden xl:flex flex-col xl:col-span-1 line-clamp-2 p-2 gap-4 xl:sticky top-[140px] z-8 max-h-[calc(100vh-150px)] overflow-y-auto custom-scroll">
                <div>
                    <p className="font-semibold">Recommended Profiles : </p>
                    {cardData.map((card) => {
                        return (
                            <span key={card.id}>
                                <div className="mb-4 flex flex-row items-center gap-3 justify-between my-5">
                                    <div className="flex flex-row gap-2">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                                            <AvatarFallback>VC</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col justify-center">
                                            <p>{card.title}</p>
                                            <p
                                                className="text-xs text-muted-foreground line-clamp-1"
                                                title={card.description}
                                            >
                                                {card.description}
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        initial={!card.follow}
                                        animate={{
                                            backgroundColor: card.follow
                                                ? "hsl(var(--accent-foreground))"
                                                : "hsl(var(--foreground))",
                                            scale: 1,
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                    >
                                        <Button className="p-2 py-1 h-fit text-xs font-normal align-[4px]">
                                            <motion.span
                                                key={
                                                    card.follow
                                                        ? "following"
                                                        : "follow"
                                                }
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {card.follow
                                                    ? "Following"
                                                    : "Follow"}
                                            </motion.span>
                                        </Button>
                                    </motion.div>
                                </div>
                                <Separator orientation="horizontal" />
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
