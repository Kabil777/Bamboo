"use client";

import {
    ChevronDown,
    FileText,
    Folder,
    Home,
    Plus,
    Trash2,
    Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/shadcnUI/collapsible";
import { Input } from "@/components/shadcnUI/input";
import { Button } from "@/components/shadcnUI/button";

import { useDocsMetaProvider } from "@/hooks/useDocsMetaProvider";
import { useDocsTree } from "@/hooks/useDocsTree";
import { useAppState, useAppDispatch } from "@/hooks/ReduxHooks";
import { DocsRTK } from "@/store/reducers/DocsReducer";
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
    const sections = tree.filter(
        (item) =>
            item.id !== docId &&
            item.title?.trim().toLowerCase() !== "overview",
    );
    const dispatch = useAppDispatch();
    const doc = useAppState((s) => s.docsReducer?.entities?.[docId]);

    useEffect(() => {
        if (docId) dispatch(DocsRTK(docId));
    }, [docId, dispatch]);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [openSectionId, setOpenSectionId] = useState<string | null>(
        Array.isArray(id) && id.length >= 2 ? id[1] : sections[0]?.id ?? null,
    );

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

    return (
        <Sidebar
            {...props}
            variant="sidebar"
            collapsible="offcanvas"
            className="top-14 h-[calc(100svh-56px)] bg-background text-foreground"
        >
            <SidebarHeader className="bg-background border-b border-border/40 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
                        <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex min-w-0 flex-col leading-tight">
                        <span className="text-sm font-semibold text-foreground truncate">
                            {doc?.title || "Docs Editor"}
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="custom-scroll scroll-smooth px-3 py-3 flex-1 bg-background">
                <SidebarGroup className="px-0">
                    <SidebarMenu className="gap-1">
                        {/* Overview — fixed item, no edit/delete */}
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={id.length === 1}
                                tooltip="Overview"
                                className="h-9 rounded-lg px-3 text-sm font-medium transition-colors data-[active=true]:bg-primary/10 hover:bg-muted"
                            >
                                <Link
                                    href={`/editor/docs/${docId}`}
                                    className="flex items-center gap-2.5"
                                >
                                    <Home className="h-4 w-4 shrink-0 text-foreground" />
                                    <span className="truncate">Overview</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {/* Separator */}
                        <div className="h-px bg-border/50 mx-2 my-1.5" />

                        {/* Tree sections */}
                        {sections.map((item, sectionIndex) => {
                            const hasChildren = item.children && item.children.length > 0;
                            const isActiveSection =
                                (id.length === 2 && id[1] === item.id) ||
                                (id.length === 3 && id[1] === item.id);
                            const isOpen = isActiveSection || openSectionId === item.id;

                            return (
                                <Collapsible
                                    key={sectionIndex}
                                    open={isOpen}
                                    onOpenChange={(open) => {
                                        if (isActiveSection) return; // prevent closing active section
                                        setOpenSectionId(open ? item.id : null);
                                    }}
                                    className="group/collapsible"
                                >
                                    <SidebarMenuItem>
                                        <div className={`flex min-w-0 items-center group/section rounded-lg transition-colors hover:bg-muted ${isActiveSection ? "bg-primary/10" : ""}`}>
                                            {editingId === item.id ? (
                                                <Input
                                                    autoFocus
                                                    defaultValue={item.title}
                                                    onBlur={(e) => {
                                                        updateTitle(item.id, e.target.value);
                                                        setEditingId(null);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            updateTitle(
                                                                item.id,
                                                                (e.target as HTMLInputElement).value,
                                                            );
                                                            setEditingId(null);
                                                        }
                                                        if (e.key === "Escape") setEditingId(null);
                                                    }}
                                                    className="min-w-0 flex-1 h-9 rounded-lg border-primary/30 px-3 text-sm focus-visible:ring-primary/30"
                                                />
                                            ) : (
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={id.length === 2 && id[1] === item.id}
                                                    tooltip={item.title}
                                                    className="min-w-0 flex-1 h-9 rounded-lg px-3 text-sm font-medium transition-colors data-[active=true]:text-primary data-[active=true]:bg-transparent"
                                                >
                                                    <Link
                                                        href={`/editor/docs/${docId}/${item.id}`}
                                                        className="flex min-w-0 items-center gap-2.5"
                                                    >
                                                        <Folder className="h-4 w-4 shrink-0 text-foreground" />
                                                        <span className="truncate">{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            )}

                                            {/* Collapse toggle + action buttons */}
                                            <div className="ml-1 flex items-center gap-0.5 shrink-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                                                <Button
                                                    onClick={() => addPage(item.id)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setEditingId(item.id);
                                                    }}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => deletePage(item.id)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {hasChildren && (
                                                <CollapsibleTrigger asChild>
                                                    <button className="ml-0.5 p-1.5 rounded-full hover:bg-muted transition-colors shrink-0">
                                                        <ChevronDown className="h-4 w-4 transition-transform duration-200 text-muted-foreground group-data-[state=open]/collapsible:rotate-180" />
                                                    </button>
                                                </CollapsibleTrigger>
                                            )}
                                        </div>

                                        {/* Sub-items (collapsible) */}
                                        {hasChildren && (
                                            <CollapsibleContent>
                                                <SidebarMenuSub className="!pr-0 mr-0 ml-4 border-l border-border/50 pl-0 mt-0.5">
                                                    {item.children.map((sub) => {
                                                        const isActiveSub = id.length === 3 && id[1] === item.id && id[2] === sub.id;
                                                        return (
                                                            <SidebarMenuSubItem key={sub.id}>
                                                                <div className={`flex min-w-0 items-center group/sub rounded-lg transition-colors hover:bg-muted ${isActiveSub ? "bg-primary/10" : ""}`}>
                                                                    {editingId === sub.id ? (
                                                                        <Input
                                                                            autoFocus
                                                                            defaultValue={sub.title}
                                                                            onBlur={(e) => {
                                                                                updateTitle(sub.id, e.target.value);
                                                                                setEditingId(null);
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === "Enter") {
                                                                                    updateTitle(
                                                                                        sub.id,
                                                                                        (e.target as HTMLInputElement).value,
                                                                                    );
                                                                                    setEditingId(null);
                                                                                }
                                                                                if (e.key === "Escape")
                                                                                    setEditingId(null);
                                                                            }}
                                                                            className="min-w-0 flex-1 h-8 rounded-lg border-primary/30 px-3 text-sm focus-visible:ring-primary/30"
                                                                        />
                                                                    ) : (
                                                                        <SidebarMenuSubButton
                                                                            asChild
                                                                            isActive={
                                                                                id.length === 3 &&
                                                                                id[1] === item.id &&
                                                                                id[2] === sub.id
                                                                            }
                                                                            className="min-w-0 flex-1 rounded-lg px-3 py-1.5 text-sm transition-colors data-[active=true]:bg-transparent data-[active=true]:text-primary"
                                                                        >
                                                                            <Link
                                                                                href={`/editor/docs/${docId}/${item.id}/${sub.id}`}
                                                                                className="flex min-w-0 items-center gap-2.5"
                                                                            >
                                                                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                                                                                <span className="truncate flex-1">{sub.title}</span>
                                                                            </Link>
                                                                        </SidebarMenuSubButton>
                                                                    )}

                                                                    {/* Sub-item action buttons */}
                                                                    <div className="ml-1 flex items-center gap-0.5 shrink-0 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                                                        <Button
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                setEditingId(sub.id);
                                                                            }}
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                                                                        >
                                                                            <Pencil className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() => deletePage(sub.id)}
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </SidebarMenuSubItem>
                                                        );
                                                    })}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        )}
                                    </SidebarMenuItem>
                                </Collapsible>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="mt-auto bg-background border-t border-border/40 p-3">
                <Button
                    onClick={() => addPage(null)}
                    variant="outline"
                    className="w-full h-9 rounded-lg gap-2 text-sm font-medium border-dashed border-border hover:bg-muted hover:border-primary/30 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Section
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
