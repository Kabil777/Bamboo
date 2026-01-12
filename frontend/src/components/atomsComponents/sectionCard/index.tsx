"use client";

/* eslint-disable @next/next/no-img-element */
import { Badge } from "@/components/shadcnUI/badge";
import { Button } from "@/components/shadcnUI/button";
import { CardDescription } from "@/components/shadcnUI/card";
import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import { BsGithub, BsLinkedin, BsTwitter } from "react-icons/bs";
import { IoIosShareAlt } from "react-icons/io";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SharePopover } from "../sharePopover";

export function SectionCards() {
    const [follow, setFollow] = useState(false);
    const [profilePath, setProfilePath] = useState("");

    useEffect(() => {
        setProfilePath(window.location.href);
    }, []);

    return (
        <div className="flex items-center justify-center flex-col sm:flex-row gap-2 sm:gap-4 mb-3 sm:mb-0 sm:p-4 rounded-md w-full relative">
            <span className="w-40 sm:w-fit sm:h-fit shrink-0 items-center justify-self-center ">
                <img
                    src="https://github.com/shadcn.png"
                    className="aspect-square object-cover w-full h-full max-w-60 border-4 border-border rounded-xl"
                />
            </span>
            <div className="font-semibold p-5 text-wrap space-y-1 border border-border rounded-md bg-muted/50 relative w-full">
                {/*Profile dashboard*/}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-2 items-center text-muted-foreground ">
                    <BiEdit
                        className="cursor-pointer hover:text-foreground"
                        size={20}
                    />
                    <SharePopover text={profilePath}>
                        <IoIosShareAlt
                            className="cursor-pointer hover:text-foreground"
                            size={20}
                        />
                    </SharePopover>
                </div>
                <div className="flex space-x-2 flex-wrap items-center">
                    <h1 className="text-lg sm:text-2xl">Kowsik Y</h1>
                    <motion.div
                        initial={false}
                        animate={{
                            backgroundColor: follow
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
                <Badge variant="outline" className="text-xs sm:text-sm">
                    Creator
                </Badge>
                <p className="text-muted-foreground text-sm font-medium">
                    <b>@kowsik</b> • 5B followers •{" "}
                    <Button variant="link" size={"sm"} className="text-sm p-0">
                        50 following
                    </Button>{" "}
                    • 10 posts • 15 docs
                </p>

                <CardDescription>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Debitis quas facilis official
                </CardDescription>

                <div className="flex flex-wrap gap-2 my-4">
                    <Badge className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        Java
                    </Badge>
                    <Badge className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        Video editor
                    </Badge>
                    <Badge className="bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        PhotoGrapher
                    </Badge>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Link
                        className="flex space-x-2 items-center text-sm"
                        href="https://github.com/kowsik"
                        target="_blank"
                    >
                        <BsGithub />
                        <span>GitHub</span>
                    </Link>
                    <Link
                        className="flex space-x-2 items-center text-sm"
                        href="https://twitter.com/kowsik"
                        target="_blank"
                    >
                        <BsTwitter />
                        <span>Twitter</span>
                    </Link>
                    <Link
                        className="flex space-x-2 items-center text-sm"
                        href="https://linkedin.com/in/kowsik"
                        target="_blank"
                    >
                        <BsLinkedin />
                        <span>LinkedIn</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
