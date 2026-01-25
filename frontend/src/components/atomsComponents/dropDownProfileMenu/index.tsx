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
import { Avatar } from "@/components/shadcnUI/avatar";
import { Button } from "@/components/shadcnUI/button";
import Link from "next/link";
import { useTheme } from "next-themes";
import { SadProfile } from "@/components/assets";
import { useLogout } from "@/hooks/logoutHandler";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { getAuthentication } from "@/store/reducers/AuthReducers";

interface ProfileMode {
    profile: {
        profileDetails?: {
            title?: string;
            url?: string | StaticImport;
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

export function DropDownProfileMenu() {
    const { user } = useAppState((s) => s.userReducer);
    const profile = {
        profile: {
            profiledetails: {
                title: user?.name,
                url: user?.profileImg,
            },
        },
    };
    const { profiledetails } = profile.profile ?? {};
    const { setTheme, theme } = useTheme();
    const [loaded, setLoaded] = useState(false);

    const logout = useLogout();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="!p-0 w-10 h-10 rounded-full bg-transparent hover:bg-transparent">
                    {profiledetails ? (
                        <Avatar className="relative overflow-hidden">
                            {!loaded && (
                                <Skeleton className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                            )}

                            {profiledetails.url && (
                                <Image
                                    src={profiledetails.url}
                                    alt={profiledetails.title ?? "Profile"}
                                    width={96}
                                    height={96}
                                    referrerPolicy="no-referrer"
                                    unoptimized
                                    className={cn("rounded-full")}
                                    onLoad={() => setLoaded(true)}
                                />
                            )}
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
                            <Link href={"/login"}>Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href={"/login"}>Signup</Link>
                        </Button>
                    </DropdownMenuGroup>
                ) : (
                    <DropdownMenuItem
                        className=" m-0.5 bg-black border-2 hover:cursor-pointer
                           text-white
                           hover:text-white
                           active:bg-black
                           focus:bg-black
                             transition-colors
                             duration-200"
                        onClick={logout}
                    >
                        Log out
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
