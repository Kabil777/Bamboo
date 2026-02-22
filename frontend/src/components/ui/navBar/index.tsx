"use client";

import React from "react";
import { Book, CirclePlay, File, LifeBuoy, Zap } from "lucide-react";
import {
    DropDownProfileMenu,
    EditorModel,
    Logo,
    NavigationMenuBar,
    SearchBox,
    SideNavBarMenu,
} from "@/components/atomsComponents";
import { StaticImageData } from "next/image";

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface NavbarProps {
    logo?: {
        url: string;
        src: string | StaticImageData;
        alt: string;
        title: string;
    };
    menu?: MenuItem[];
    auth?: {
        login: {
            title: string;
            url: string;
        };
        signup: {
            title: string;
            url: string;
        };
    };
}

const NavBar = ({
    menu = [
        { title: "Home", url: "/" },
        {
            title: "Docs",
            url: "/docs",
        },
        {
            title: "Resources",
            url: "#",
            items: [
                {
                    title: "Blog",
                    description: "The latest industry news, updates and info.",
                    icon: <Book className="size-5 shrink-0" />,
                    url: "/blog/hvjbfjh",
                },
                {
                    title: "Customer stories",
                    description:
                        "Learn how our customers are making big changes.",
                    icon: <Zap className="size-5 shrink-0" />,
                    url: "/customerStories",
                },
                {
                    title: "Video tutorials",
                    description:
                        "Get up and running on new features and techniques.",
                    icon: <CirclePlay className="size-5 shrink-0" />,
                    url: "/",
                },
                {
                    title: "Documentation",
                    description:
                        "All the boring stuff that you (hopefully won’t) need.",
                    icon: <File className="size-5 shrink-0" />,
                    url: "/",
                },
                {
                    title: "Help and support",
                    description:
                        "Learn, fix a problem, and get answers to your questions.",
                    icon: <LifeBuoy className="size-5 shrink-0" />,
                    url: "/",
                },
            ],
        },
    ],
    auth = {
        login: { title: "Login", url: "/login" },
        signup: { title: "Sign up", url: "#" },
    },
}: NavbarProps) => {
    return (
        <header className="py-2 z-50 border border-accent fixed top-0 bg-background shadow-none w-full ">
            <div className="justify-between md:px-12 px-2 sm:px-6 flex">
                <div className="flex items-center ">
                    <div className="flex items-center gap-1">
                        <div className="md:hidden flex items-center">
                            <SideNavBarMenu menu={menu} />
                        </div>
                        <Logo />
                    </div>
                    <div className="hidden items-center md:flex">
                        <NavigationMenuBar menu={menu} />
                    </div>
                </div>
                <div className="flex gap-5 items-center">
                    <SearchBox /> 
                    <EditorModel />
                    <DropDownProfileMenu  />
                </div>
            </div>
        </header>
    );
};

export { NavBar };
