"use client";

import { Plus, Trash } from "lucide-react";
import { useState } from "react";

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
import { setPages } from "@/store/reducers/PostContent";


export function EditorSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const dispatch = useAppDispatch();
    const type = useAppState((s) => s.postReducer.type);
    const pages = useAppState((s) => s.postReducer.Pages);

    const [editing, setEditing] = useState<{
        type: "main" | "sub" | null;
        sectionIndex?: number;
        subIndex?: number;
    }>({ type: null });

    if (type !== "docs") return null;

    /* ------------------ Add ------------------ */

    const addMainSection = () => {
        dispatch(
            setPages([
                ...pages,
                {
                    id: crypto.randomUUID(),
                    title: `New Section`,
                    content: { type: "doc", content: [] },
                    subPages: [],
                },
            ])
        );
    };

    const addSubItem = (sectionIndex: number) => {
        dispatch(
            setPages(
                pages.map((section, i) =>
                    i === sectionIndex
                        ? {
                            ...section,
                            subPages: [
                                ...(section.subPages ?? []),
                                {
                                    id: crypto.randomUUID(),
                                    title: "New Sub Page",
                                    content: { type: "doc", content: [] },
                                },
                            ],
                        }
                        : section
                )
            )
        );
    };

    /* ------------------ Delete ------------------ */

    const deleteMainSection = (sectionIndex: number) => {
        dispatch(setPages(pages.filter((_, i) => i !== sectionIndex)));
    };

    const deleteSubItem = (sectionIndex: number, subIndex: number) => {
        dispatch(
            setPages(
                pages.map((section, i) =>
                    i === sectionIndex
                        ? {
                            ...section,
                            subPages: section.subPages?.filter(
                                (_, j) => j !== subIndex
                            ),
                        }
                        : section
                )
            )
        );
    };

    /* ------------------ Edit ------------------ */

    const saveTitle = (title: string) => {
        if (editing.type === "main" && editing.sectionIndex !== undefined) {
            dispatch(
                setPages(
                    pages.map((section, i) =>
                        i === editing.sectionIndex
                            ? { ...section, title }
                            : section
                    )
                )
            );
        }

        if (
            editing.type === "sub" &&
            editing.sectionIndex !== undefined &&
            editing.subIndex !== undefined
        ) {
            dispatch(
                setPages(
                    pages.map((section, i) =>
                        i === editing.sectionIndex
                            ? {
                                ...section,
                                subPages: section.subPages?.map((sub, j) =>
                                    j === editing.subIndex
                                        ? { ...sub, title }
                                        : sub
                                ),
                            }
                            : section
                    )
                )
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
                                            }}
                                            className="w-full rounded border px-1 text-sm"
                                        />
                                    ) : (
                                        <SidebarMenuButton
                                            asChild
                                            onClick={() => setEditing({ type: "main", sectionIndex })}
                                        >
                                            <span className="font-medium cursor-text">{item.title}</span>
                                        </SidebarMenuButton>
                                    )}

                                    <div className="flex items-center group-hover/btnvisible:visible invisible">
                                        {/* Add sub-item button */}
                                        <Button
                                            onClick={() => addSubItem(sectionIndex)}
                                            variant="link"
                                            size="icon"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                        {/* Delete main section */}
                                        <Button
                                            onClick={() => deleteMainSection(sectionIndex)}
                                            variant="link"
                                            size="icon"
                                            className="text-red-500 group-hover/btnvisible:visible invisible"
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
                                                            }}
                                                            className="w-full rounded border px-1 !h-fit text-sm !py-1"
                                                        />
                                                    ) : (
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={sub.id === "1-1"}
                                                            onClick={() =>
                                                                setEditing({
                                                                    type: "sub",
                                                                    sectionIndex,
                                                                    subIndex,
                                                                })
                                                            }
                                                            className="w-full"
                                                        >
                                                            <span className="cursor-text">{sub.title}</span>
                                                        </SidebarMenuSubButton>
                                                    )}

                                                    {/* Delete sub-item */}
                                                    <Button
                                                        onClick={() => deleteSubItem(sectionIndex, subIndex)}
                                                        variant="link"
                                                        size="icon"
                                                        className={`text-red-500 group-hover/btnvisible:visible invisible`}
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
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
                <Button onClick={addMainSection} className="w-full">
                    <Plus className="w-4 h-4" /> Add Section
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}
