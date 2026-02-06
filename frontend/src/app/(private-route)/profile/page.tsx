"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { BlogCard } from "@/components/atomsComponents";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/shadcnUI/avatar";
import { Button } from "@/components/shadcnUI/button";
import { Separator } from "@/components/shadcnUI/separator";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { getAllProfileBlog } from "@/store/reducers/Profile/profile.read";
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

export default function Profile() {
    const dispatch = useAppDispatch();
    const { blogLoading, blogs } = useAppState((s) => s.getProfileReducers);
    useEffect(() => {
        if (!blogLoading && !blogs) {
            dispatch(getAllProfileBlog());
        }
    }, [blogs, dispatch, blogLoading]);
    return (
        <div className="container grid grid-cols-4 transition-all duration-200 ease-linear gap-4 md:gap-6 relative">
            <div className="col-span-full xl:col-span-3 mx-2 md:mx-0 xl:border-r-1 p-0 sm:p-2 relative">
                {blogLoading && <BlogCardSkeleton />}

                {!blogLoading &&
                    blogs?.blogPagesDto?.map((item) => (
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
                        />
                    ))}
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
