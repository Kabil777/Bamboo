'use client'
import React from 'react'

import { User } from 'lucide-react';
import Icon from '@/app/favicon.ico';


import { DropDownMenu, NavigationMenuBar } from '@/components/atomsComponents';
import Image from 'next/image';
import { Agbalumo } from 'next/font/google'
import Link from 'next/link';
interface linksContent {
    title: string;
    href: string;
    description: string;
}

const agbalumo = Agbalumo({ subsets: ['latin'], weight: '400' })
const navBarLinks: { key: string; href?: string; links?: linksContent[] }[] = [
    {
        key: 'Home',
        href: '/',

    }, {
        key: 'Blog',
        href: '/blog',
    },
    {
        key: 'Resources',
        links: [
            {
                title: "Blog",
                href: "/blog",
                description:
                    "The latest industry news, updates and info.",
            },
            {
                title: "Customer stories",
                href: "/",
                description:
                    "Learn how our customers are making big changes.",
            },
            {
                title: "Video tutorials",
                href: "/",
                description:
                    "Get up and running on new features and techniques.",
            },
            {
                title: "Documentation",
                href: "/docs/primitives/scroll-area",
                description: "All the boring stuff that you (hopefully won’t) need.",
            },
            {
                title: "Help and support",
                href: "/docs/primitives/tabs",
                description:
                    "Learn, fix a problem, and get answers to your questions.",
            },
        ],
    },
];

export const NavBar = () => {

    return (
        <nav>
            <div className="flex items-center justify-around py-3 px-13 bg-background border-b ">

                <div className='flex justify-start items-center w-full'>

                    <div >
                        <Link href="/" legacyBehavior passHref>
                            <div className={`${agbalumo.className} cursor-pointer gap-3 text-primary h-9 inline-flex w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium  disabled:opacity-50 transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 pointer hover:bg-accent hover:text-accent-foreground`}>
                                <Image src={Icon} alt="logo" className='w-7 h-7' />
                                <h1 className="text-xl font-normal text-[#374151]">Bamboo</h1>
                            </div>
                        </Link>
                    </div>
                    <div>
                        <NavigationMenuBar navLinks={navBarLinks} />
                    </div>
                </div>
                <div>
                    <div className='flex items-center gap-4'>

                        <User />
                        <DropDownMenu />

                    </div>
                </div>
            </div>
        </nav>
    );
};

