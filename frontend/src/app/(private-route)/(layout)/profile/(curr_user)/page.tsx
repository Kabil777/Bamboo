"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BlogCard, DocsProfileCard, useProfileTab } from "@/components/atomsComponents";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/shadcnUI/avatar";
import { Button } from "@/components/shadcnUI/button";
import { Separator } from "@/components/shadcnUI/separator";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import {
    getAllProfileBlog,
    getAllProfileDocs,
} from "@/store/reducers/Profile/profile.read";
import { ProfileBlogListSkeleton } from "@/components/atomsComponents/skleton/Profile/profileBlogSkleton";
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

const fadeTransition = { duration: 0.18, ease: "easeOut" as const };

const fadePanelProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: fadeTransition,
};

export default function Profile() {
    const dispatch = useAppDispatch();
    const { profileLoading, blogLoading, blogs, docsLoading, docs, blogError, docsError } = useAppState(
        (s) => s.getProfileReducers,
    );
    const { user } = useAppState((s) => s.userReducer);
    const [activeDocId, setActiveDocId] = useState<string>("");
    const { selectedTab } = useProfileTab();
    const isOwner = true;
    const isFeedLoading =
        (selectedTab === "posts" && (profileLoading || blogLoading || blogs === null)) ||
        (selectedTab === "docs" && (profileLoading || docsLoading || docs === null));
    const showEmptyPosts =
        selectedTab === "posts" &&
        !isFeedLoading &&
        (blogs?.items?.length ?? 0) === 0;
    const showEmptyDocs =
        selectedTab === "docs" &&
        !isFeedLoading &&
        (docs?.items?.length ?? 0) === 0;


    useEffect(() => {
        const shouldLoadPosts =
            selectedTab === "posts" && !blogLoading && (blogs === null || !!blogError);
        const shouldLoadDocs =
            selectedTab === "docs" && !docsLoading && (docs === null || !!docsError);

        if (shouldLoadPosts) {
            dispatch(getAllProfileBlog());
        }

        if (shouldLoadDocs) {
            dispatch(getAllProfileDocs());
        }
    }, [selectedTab, dispatch, blogLoading, blogs, blogError, docsLoading, docs, docsError]);

    
    return (
        <div className="container grid grid-cols-4 transition-all duration-200 ease-linear gap-4 md:gap-6 relative">
            <div className="col-span-full xl:col-span-3 mx-2 md:mx-0 xl:border-r-1 p-0 sm:p-2 relative">
                <AnimatePresence mode="wait" initial={false}>
                    {selectedTab === "posts" && (
                        isFeedLoading ? (
                            <motion.div key="posts-loading" {...fadePanelProps}>
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <BlogCardSkeleton key={index} />
                                    ))}
                                </div>
                            </motion.div>
                        ) : blogs?.items?.length ? (
                            <motion.div key="posts-content" {...fadePanelProps} className="space-y-4">
                                {blogs.items.map((item) => (
                                    <BlogCard
                                        key={item.id}
                                        title={item.title}
                                        description={item.description}
                                        coverUrl={item.coverUrl}
                                        author={item.author}
                                        id={item.id}
                                        tags={item.tags}
                                        createdAt={item.createdAt}
                                        visibility={item.visibility}
                                        status={item.status}
                                        collaborators={item.collaborators}
                                        isOwner={isOwner}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="posts-empty" {...fadePanelProps} className="min-h-[220px] rounded-xl p-8 flex items-center justify-center text-center text-sm text-muted-foreground">
                                No posts yet.
                            </motion.div>
                        )
                    )}

                    {selectedTab === "docs" && (
                        isFeedLoading ? (
                            <motion.div key="docs-loading" {...fadePanelProps}>
                                <ProfileBlogListSkeleton count={3} />
                            </motion.div>
                        ) : docs?.items?.length ? (
                            <motion.div key="docs-content" {...fadePanelProps} className="space-y-4">
                                {docs.items.map((doc) => (
                                    <DocsProfileCard
                                        key={doc.id}
                                        id={doc.id}
                                        title={doc.title}
                                        description={doc.description}
                                        coverUrl={doc.coverUrl}
                                        createdAt={doc.createdAt}
                                        visibility={doc.visibility}
                                        status={doc.status}
                                        isOwner={isOwner}
                                        authorName={doc.author?.name || user?.name}
                                        author={doc.author!}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div key="docs-empty" {...fadePanelProps} className="min-h-[220px] rounded-xl p-8 flex items-center justify-center text-center text-sm text-muted-foreground">
                                No docs yet.
                            </motion.div>
                        )
                    )}

                    {selectedTab === "bookmark" && (
                        <motion.div key="bookmark-empty" {...fadePanelProps} className="min-h-[220px] rounded-xl p-8 flex items-center justify-center text-center text-sm text-muted-foreground">
                            No bookmarks yet.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="hidden xl:flex flex-col xl:col-span-1 line-clamp-2 p-2 gap-4 xl:sticky top-[140px] z-8 max-h-[calc(100vh-150px)] overflow-y-auto custom-scroll">
                <div>
                    <p className="font-semibold">Recommmend Profile : </p>
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
                                        initial={false}
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

