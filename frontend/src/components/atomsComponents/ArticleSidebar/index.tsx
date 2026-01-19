"use client";

import { ChevronDown } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/shadcnUI/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/shadcnUI/collapsible";
import { useAppState } from "@/hooks/ReduxHooks";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DocsTreeNode } from "@/types/docs/docs-base";

type ArticleSidebarProps = React.ComponentProps<typeof Sidebar> & {
    navData: DocsTreeNode[];
    activeId?: string;
};

export function ArticleSidebar({
    navData,
    activeId,
    ...props
}: ArticleSidebarProps) {
    const { id } = useParams() as { id: string | string[] };
    console.log("Params ID:", id);
    const NavData = navData;
    return (
        <Sidebar {...props}>
            <SidebarContent className="custom-scroll scroll-smooth !bg-background px-3">
                <div className="from-background via-background/80 to-background/0 sticky -top-1 z-10 h-6 shrink-0 bg-gradient-to-b"></div>

                <SidebarGroup className="px-0">
                    <SidebarMenu className="gap-2">
                        {NavData.map((item) => (
                            <Collapsible
                                key={item.id}
                                defaultOpen
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 rounded-md hover:bg-accent transition-colors">
                                        <SidebarMenuButton
                                            asChild
                                            isActive={id[1] === item.id}
                                            className="hover:bg-transparent"
                                        >
                                            <Link
                                                href={
                                                    "/docs/" +
                                                    id[0] +
                                                    "/" +
                                                    item.id
                                                }
                                                className="font-semibold text-sm"
                                            >
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                        {item.subTree &&
                                            item.subTree.length > 0 && (
                                                <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180 text-muted-foreground" />
                                            )}
                                    </CollapsibleTrigger>
                                    {item.subTree?.length ? (
                                        <CollapsibleContent>
                                            <SidebarMenuSub className="ml-2 border-l border-border ">
                                                {item.subTree.map((subitem) => (
                                                    <SidebarMenuSubItem
                                                        key={subitem.id}
                                                        className="my-0.5"
                                                    >
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={
                                                                id[2] ===
                                                                subitem.id
                                                            }
                                                            className="text-sm py-1"
                                                        >
                                                            <Link
                                                                href={
                                                                    "/docs/" +
                                                                    id[0] +
                                                                    "/" +
                                                                    item.id +
                                                                    "/" +
                                                                    subitem.id
                                                                }
                                                            >
                                                                {subitem.title}
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    ) : null}
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                <div className="from-background via-background/80 to-background/0 sticky -bottom-2 z-10 h-12 shrink-0 bg-gradient-to-t"></div>
            </SidebarContent>
        </Sidebar>
    );
}
