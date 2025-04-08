import React from 'react'
import Link from "next/link"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/shadcnUI/navigation-menu"
import { cn } from "@/lib/utils"
import { Book } from 'lucide-react';

interface linksContent {
    title: string
    href: string
    description: string
}

interface NavigationMenuBarItem {
    key: string
    href?: string
    links?: linksContent[]
}

interface NavigationMenuBarProps {
    navLinks: NavigationMenuBarItem[]
}


export const NavigationMenuBar = ({ navLinks }: NavigationMenuBarProps) => {

    return (
        <>
            <NavigationMenu>
                <NavigationMenuList>

                    {navLinks.map((navLink) => (
                        navLink.links && navLink.links.length > 0 ? (
                            <NavigationMenuItem key={navLink.key}>
                                <NavigationMenuTrigger>{navLink.key}</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[300px] gap-4 p-1">
                                        {navLink.links.map((link) => (
                                            <ListItem
                                                key={link.href ?? link.title} // safer key
                                                title={link.title}
                                                href={link.href}
                                            >
                                                {link.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        ) : (
                            <NavigationMenuItem key={navLink.key}>
                                <Link href={navLink.href || "/"} legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        {navLink.key}
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        )
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </>
    )
}



const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>

                <a
                    ref={ref}
                    className={cn(
                        "flex flex-row select-none rounded-md no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    < Book size={24} className='!w-[24px] !h-[24px]' />
                    <div className="font-semibold text-[16px]"> {title}
                        <p className="text-sm font-normal text-muted-foreground">
                            {children}
                        </p>
                    </div>

                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
