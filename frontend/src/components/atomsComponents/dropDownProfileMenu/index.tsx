"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/shadcnUI/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/shadcnUI/avatar";
import { Button } from "@/components/shadcnUI/button";
import Link from "next/link";
import { useTheme } from "next-themes";
import React from "react";
import { SadProfile } from "@/components/assets";
import { useLogout } from "@/hooks/logoutHandler";

interface ProfileMode {
    profile: {
        profiledetails?: {
            title?: string;
            url?: string;
        };
    };
    auth?: never;
}

interface AuthMode {
    auth: {
        login: {
            title: string;
            url: string;
        };
        signup: {
            title: string;
            url: string;
        };
    };
    profile?: never;
}

type ProfileProps = ProfileMode | AuthMode;

export function DropDownProfileMenu(props: ProfileProps) {
    const { profile, auth } = props;
    const { profiledetails } = profile || {};
    const { setTheme, theme } = useTheme();

    const logout = useLogout();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"default"}
                    className="!p-0 w-10 h-10 rounded-full"
                >
                    {profiledetails ? (
                        <Avatar>
                            <AvatarImage
                                src={profiledetails?.url}
                                alt={profiledetails?.title}
                            />
                        </Avatar>
                    ) : (
                        <SadProfile className="!w-full !h-full" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2 w-45 md:w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href={"/profile"}>
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>My Wishlist</DropdownMenuItem>
                    <DropdownMenuItem>Bookmarks</DropdownMenuItem>
                    <DropdownMenuItem>Your Blogs</DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem>New Team</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <DropdownMenuTrigger>Theme</DropdownMenuTrigger>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup
                                value={theme}
                                onValueChange={setTheme}
                            >
                                <DropdownMenuRadioItem value="light">
                                    Light
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="dark">
                                    Dark
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="system">
                                    System
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Help Center</DropdownMenuItem>
                <DropdownMenuItem disabled>Add</DropdownMenuItem>
                <DropdownMenuSeparator />
                {!profiledetails ? (
                    <DropdownMenuGroup className="flex flex-col gap-2">
                        <Button asChild variant="outline">
                            <Link href={auth?.login.url || "#"}>
                                {auth?.login.title}
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={auth?.signup.url || "#"}>
                                {auth?.signup.title}
                            </Link>
                        </Button>
                    </DropdownMenuGroup>
                ) : (
                    <DropdownMenuItem
                        className="text-red-500 active:text-white hover:bg-red-100 hover:text-red-500 focus:bg-red-500 focus:text-white"
                        onClick={logout}
                    >
                        Log out
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
