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

interface Props {
    title: string
    href: string
    description: string
}
interface NavigationMenuBarProps {
    components: Props[]
}


export const NavigationMenuBar = ({ components }: NavigationMenuBarProps) => {

    return (
        <>
            <NavigationMenu>
                <NavigationMenuList>

                    <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Home
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <Link href="/blog" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Blog
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[300px] gap-4 p-1">
                                {components.map((component) => (
                                    <ListItem
                                        key={component.title}
                                        title={component.title}
                                        href={component.href}
                                    >
                                        {component.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>



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
