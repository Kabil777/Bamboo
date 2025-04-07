'use client'
import React from 'react'

import { User } from 'lucide-react';
import Icon from '@/app/favicon.ico';


import { DropDownMenu, NavigationMenuBar } from '@/components/atomsComponents';
import Image from 'next/image';
import { Agbalumo } from 'next/font/google'


const agbalumo = Agbalumo({ subsets: ['latin'], weight: '400' })
const components: { title: string; href: string; description: string }[] = [
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
    }
]

export const NavBar = () => {

    return (
        <nav>
            <div className="flex items-center justify-around py-3 px-13 bg-background border-b ">

                <div className='flex justify-start items-center w-full'>

                    <div className={`${agbalumo.className} flex items-center gap-3`}>
                        <Image src={Icon} alt="logo" className='w-7 h-7' />
                        <h1 className="text-xl font-normal text-[#374151]">Bamboo</h1>
                    </div>
                    <div>
                        <NavigationMenuBar components={components} />
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

