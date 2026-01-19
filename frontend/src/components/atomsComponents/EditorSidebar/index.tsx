"use client";

import { Plus, Trash, Pencil } from "lucide-react";
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

import { useAppDispatch, useAppState } from "@/hooks/ReduxHooks";
import { updatePageTitle, updateSubPageTitle, addMainSection, addSubItem, deleteMainSection, deleteSubItem } from "@/store/reducers/DocsEditor";


export function EditorSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const dispatch = useAppDispatch();
    const { id } = useParams() as { id: string | string[] };
    const docId = id[0]; // First part is always the doc ID
    const type = useAppState((s) => s.docsReducer?.type || "docs");
    const pages = useAppState((s) => s.docsReducer?.Pages || []);

    const [editing, setEditing] = useState<{
        type: "main" | "sub" | null;
        sectionIndex?: number;
        subIndex?: number;
    }>({ type: null });

    if (type !== "docs") return null;

    /* ------------------ Add ------------------ */

    const handleAddMainSection = () => {
        dispatch(addMainSection());
    };

    const handleAddSubItem = (sectionIndex: number) => {
        dispatch(addSubItem(sectionIndex));
    };

    /* ------------------ Delete ------------------ */

    const handleDeleteMainSection = (sectionIndex: number) => {
        dispatch(deleteMainSection(sectionIndex));
    };

    const handleDeleteSubItem = (sectionIndex: number, subIndex: number) => {
        dispatch(deleteSubItem({ sectionIndex, subIndex }));
    };

    /* ------------------ Edit ------------------ */

    const saveTitle = (title: string) => {
        if (editing.type === "main" && editing.sectionIndex !== undefined) {
            dispatch(updatePageTitle({ pageIndex: editing.sectionIndex, title }));
        }

        if (
            editing.type === "sub" &&
            editing.sectionIndex !== undefined &&
            editing.subIndex !== undefined
        ) {
            dispatch(
                updateSubPageTitle({
                    pageIndex: editing.sectionIndex,
                    subPageIndex: editing.subIndex,
                    title,
                })
            );
        }

        setEditing({ type: null });
    };
    console.log('pages', pages);
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <span className="font-medium">Pages</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="custom-scroll scroll-smooth">
                <SidebarGroup>
                    <SidebarMenu>
                        {/* Overview - Cannot be edited or deleted */}
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={id.length === 1}
                                className="hover:bg-transparent"
                            >
                                <Link href={`/editor/docs/${docId}`} className="font-semibold text-sm">
                                    Overview
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {pages.map((item, sectionIndex) => (
                            <SidebarMenuItem key={sectionIndex}>
                                <div className="flex items-center justify-between group/btnvisible">
                                    {editing.type === "main" && editing.sectionIndex === sectionIndex ? (
                                        <Input
                                            autoFocus
                                            defaultValue={item.title}
                                            onBlur={(e) => saveTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveTitle((e.target as HTMLInputElement).value)
                                                if (e.key === "Escape") setEditing({ type: null })
                                            }}
                                            className="w-full rounded border px-1 text-sm"
                                        />
                                    ) : (
                                        <SidebarMenuButton
                                            asChild
                                            isActive={id.length === 2 && id[1] === item.id}
                                        >
                                            <Link href={`/editor/docs/${docId}/${item.id}`} className="font-medium">
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    )}

                                    <div className="flex items-center ml-2 gap-3 group-hover/btnvisible:visible invisible">
                                        {/* Add sub-item button */}
                                        <Button
                                            onClick={() => handleAddSubItem(sectionIndex)}
                                            variant="link"
                                            size="icon"
                                            className="w-fit h-fit"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                        {/* Edit button */}
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setEditing({ type: "main", sectionIndex });
                                            }}
                                            className="w-fit h-fit"
                                            variant="link"
                                            size="icon"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        {/* Delete main section */}
                                        <Button
                                            onClick={() => handleDeleteMainSection(sectionIndex)}
                                            variant="link"
                                            size="icon"

                                            className="text-red-500 w-fit h-fit"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {item.subPages?.length ? (
                                    <SidebarMenuSub className="!pr-0 mr-0">
                                        {item.subPages.map((sub, subIndex) => (
                                            <SidebarMenuSubItem key={subIndex}>
                                                <div className="flex items-center justify-between w-full group/btnvisible">
                                                    {editing.type === "sub" &&
                                                        editing.sectionIndex === sectionIndex &&
                                                        editing.subIndex === subIndex ? (
                                                        <Input
                                                            autoFocus
                                                            defaultValue={sub.title}
                                                            onBlur={(e) => saveTitle(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter")
                                                                    saveTitle((e.target as HTMLInputElement).value)
                                                                if (e.key === "Escape") setEditing({ type: null })
                                                            }}
                                                            className="w-full rounded border px-1 !h-fit text-sm !py-1"
                                                        />
                                                    ) : (
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={id.length === 3 && id[1] === item.id && id[2] === sub.id}
                                                            className="w-full"
                                                        >
                                                            <Link href={`/editor/docs/${docId}/${item.id}/${sub.id}`}>
                                                                {sub.title}
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    )}

                                                    <div className="flex items-center ml-2 gap-3 group-hover/btnvisible:visible invisible">
                                                        {/* Edit sub-item */}
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setEditing({
                                                                    type: "sub",
                                                                    sectionIndex,
                                                                    subIndex,
                                                                });
                                                            }}
                                                            className="w-fit h-fit"
                                                            variant="link"
                                                            size="icon"
                                                        >
                                                            <Pencil className="w-3 h-3" />
                                                        </Button>
                                                        {/* Delete sub-item */}
                                                        <Button
                                                            onClick={() => handleDeleteSubItem(sectionIndex, subIndex)}
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

            <SidebarFooter>
                <Button onClick={handleAddMainSection} className="w-full">
                    <Plus className="w-4 h-4" /> Add Section
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}
