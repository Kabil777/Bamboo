"use client";

import {
    ChevronRight,
    FileText,
    Folder,
    Home,
    Plus,
    Trash,
    Pencil,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/shadcnUI/sidebar";
import { Input } from "@/components/shadcnUI/input";
import { Button } from "@/components/shadcnUI/button";

import { useDocsMetaProvider } from "@/hooks/useDocsMetaProvider";
import { useDocsTree } from "@/hooks/useDocsTree";
import * as Y from "yjs";

export function EditorSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const { id } = useParams() as { id: string | string[] };
    const docId = Array.isArray(id) ? id[0] : id;
    const provider = useDocsMetaProvider(docId, {
        enabled:
            typeof id === "string"
                ? id.length > 0
                : Array.isArray(id) && id.length > 0,
    });
    const { tree, addPage, deletePage } = useDocsTree(provider);

    const [editingId, setEditingId] = useState<string | null>(null);

    if (!provider) return null;

    const updateTitle = (id: string, title: string) => {
        const ydoc = provider.document;
        const pages = ydoc.getArray<Y.Map<any>>("pages");

        ydoc.transact(() => {
            const page = pages.toArray().find((p) => p.get("id") === id);
            if (page) {
                page.set("title", title);
            }
        });
    };
    // First part is always the doc ID when using catch-all routes.

    return (
        <Sidebar
            {...props}
            variant="sidebar"
            collapsible="offcanvas"
            className="top-14 h-[calc(100svh-56px)] bg-white text-black"
        >
            <SidebarHeader className="bg-white">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="group-data-[collapsible=icon]:justify-center"
                            tooltip="Docs"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black text-white shadow-sm">
                                    <div className="h-3 w-3 rounded-full bg-white/90" />
                                </div>
                                <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                                    <span className="text-sm font-semibold">
                                        Docs
                                    </span>
                                    <span className="text-xs text-black/60">
                                        Editor
                                    </span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="custom-scroll scroll-smooth px-3 pb-3 flex-1 bg-white">
                <SidebarGroup className="px-1">
                    <SidebarMenu className="gap-2">
                        {/* Overview - Cannot be edited or deleted */}
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={id.length === 1}
                                tooltip="Overview"
                                className="h-10 rounded-xl px-3 text-sm font-medium data-[active=true]:bg-black/5 data-[active=true]:text-black"
                            >
                                <Link
                                    href={`/editor/docs/${docId}`}
                                    className="flex items-center gap-3"
                                >
                                    <Home className="h-4 w-4 text-black/70" />
                                    Overview
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {tree.map((item, sectionIndex) => (
                            <SidebarMenuItem key={sectionIndex}>
                                <div className="flex items-center justify-between group/btnvisible">
                                    {editingId === item.id ? (
                                        <Input
                                            autoFocus
                                            defaultValue={item.title}
                                            onBlur={(e) => {
                                                updateTitle(
                                                    item.id,
                                                    e.target.value,
                                                );
                                                setEditingId(null);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    updateTitle(
                                                        item.id,
                                                        (
                                                            e.target as HTMLInputElement
                                                        ).value,
                                                    );
                                                    setEditingId(null);
                                                }
                                                if (e.key === "Escape")
                                                    setEditingId(null);
                                            }}
                                            className="w-full rounded border px-1 text-sm"
                                        />
                                    ) : (
                                        <SidebarMenuButton
                                            asChild
                                            isActive={
                                                id.length === 2 &&
                                                id[1] === item.id
                                            }
                                            tooltip={item.title}
                                            className="h-10 rounded-xl px-3 text-sm font-medium data-[active=true]:bg-black/5 data-[active=true]:text-black"
                                        >
                                            <Link
                                                href={`/editor/docs/${docId}/${item.id}`}
                                                className="flex items-center gap-3"
                                            >
                                                <Folder className="h-4 w-4 text-black/70" />
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    )}

                                    <div className="flex items-center ml-2 gap-2 group-hover/btnvisible:visible invisible">
                                        {/* Add sub-item button */}
                                        <Button
                                            onClick={() => addPage(item.id)}
                                            variant="link"
                                            size="icon"
                                            className="w-fit h-fit text-black/60 hover:text-black"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                        {/* Edit button */}
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setEditingId(item.id);
                                            }}
                                            className="w-fit h-fit"
                                            variant="link"
                                            size="icon"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        {/* Delete main section */}
                                        <Button
                                            onClick={() => deletePage(item.id)}
                                            variant="link"
                                            size="icon"
                                            className="text-red-500 w-fit h-fit"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {item.children?.length ? (
                                    <SidebarMenuSub className="!pr-0 mr-0 ml-4 border-l border-black/30 pl-4">
                                        {item.children.map((sub) => (
                                            <SidebarMenuSubItem key={sub.id}>
                                                <div className="flex items-center justify-between w-full group/btnvisible relative">
                                                    <span className="pointer-events-none absolute left-[-18px] top-1/2 h-4 w-4 -translate-y-1/2 border-b-2 border-l-2 border-black/40 rounded-bl-md" />
                                                    {editingId === sub.id ? (
                                                        <Input
                                                            autoFocus
                                                            defaultValue={
                                                                sub.title
                                                            }
                                                            onBlur={(e) => {
                                                                updateTitle(
                                                                    sub.id,
                                                                    e.target
                                                                        .value,
                                                                );
                                                                setEditingId(
                                                                    null,
                                                                );
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                    "Enter"
                                                                ) {
                                                                    updateTitle(
                                                                        sub.id,
                                                                        (
                                                                            e.target as HTMLInputElement
                                                                        ).value,
                                                                    );
                                                                    setEditingId(
                                                                        null,
                                                                    );
                                                                }
                                                                if (
                                                                    e.key ===
                                                                    "Escape"
                                                                )
                                                                    setEditingId(
                                                                        null,
                                                                    );
                                                            }}
                                                            className="w-full rounded border px-1 !h-fit text-sm !py-1"
                                                        />
                                                    ) : (
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={
                                                                id.length ===
                                                                    3 &&
                                                                id[1] ===
                                                                    item.id &&
                                                                id[2] === sub.id
                                                            }
                                                            className="w-full rounded-xl px-3 py-2 text-sm data-[active=true]:bg-black/5 data-[active=true]:text-black"
                                                        >
                                                            <Link
                                                                href={`/editor/docs/${docId}/${item.id}/${sub.id}`}
                                                                className="flex items-center gap-3"
                                                            >
                                                                <FileText className="h-3.5 w-3.5 text-black/60" />
                                                                {sub.title}
                                                                <ChevronRight className="ml-auto h-3.5 w-3.5 text-black/30 group-data-[collapsible=icon]:hidden" />
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    )}

                                                    <div className="flex items-center ml-2 gap-2 group-hover/btnvisible:visible invisible">
                                                        {/* Edit sub-item */}
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setEditingId(
                                                                    sub.id,
                                                                );
                                                            }}
                                                            className="w-fit h-fit"
                                                            variant="link"
                                                            size="icon"
                                                        >
                                                            <Pencil className="w-3 h-3" />
                                                        </Button>
                                                        {/* Delete sub-item */}
                                                        <Button
                                                            onClick={() =>
                                                                deletePage(
                                                                    sub.id,
                                                                )
                                                            }
                                                            variant="link"
                                                            size="icon"
                                                            className={`text-red-500 w-fit h-fit`}
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                ) : null}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="mt-auto bg-white">
                <Button
                    onClick={() => addPage(null)}
                    className="w-full rounded-xl bg-black/5 text-black hover:bg-black/10"
                >
                    <Plus className="w-4 h-4" /> Add Section
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
