"use client"
import * as React from "react"
import { GalleryVerticalEnd, Plus, Trash } from "lucide-react"

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
    SidebarRail,
} from "@/components/shadcnUI/sidebar"
import { Input } from "@/components/shadcnUI/input"
import { Button } from "@/components/shadcnUI/button"

type NavItem = {
    title: string
    url: string
    isActive?: boolean
}

type NavMainItem = {
    title: string
    url: string
    items?: NavItem[]
}

export function EditorSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [navData, setNavData] = React.useState<NavMainItem[]>([
        {
            title: "Click To edit",
            url: "#",
            items: [
                { title: "Installation", url: "#" },
                { title: "Project Structure", url: "#" },
            ],
        },
        {
            title: "Building Your Application",
            url: "#",
            items: [{ title: "Routing", url: "#" }],
        },
    ])

    // Track which item is being edited
    const [editing, setEditing] = React.useState<{
        type: "main" | "sub" | null
        sectionIndex?: number
        subIndex?: number
    }>({ type: null })

    // Add new main section
    const addMainSection = () => {
        const newSection: NavMainItem = {
            title: `Section ${navData.length + 1}`,
            url: "#",
            items: [],
        }
        setNavData([...navData, newSection])
    }

    // Add new sub-item to a section
    const addSubItem = (sectionIndex: number) => {
        const updated = [...navData]
        const section = updated[sectionIndex]
        const newSub: NavItem = {
            title: `Sub Page ${section.items?.length ? section.items.length + 1 : 1}`,
            url: "#",
        }
        if (!section.items) section.items = []
        section.items.push(newSub)
        setNavData(updated)
    }

    // Delete main section
    const deleteMainSection = (sectionIndex: number) => {
        const updated = [...navData]
        updated.splice(sectionIndex, 1)
        setNavData(updated)
    }

    // Delete sub-item
    const deleteSubItem = (sectionIndex: number, subIndex: number) => {
        const updated = [...navData]
        updated[sectionIndex].items?.splice(subIndex, 1)
        setNavData(updated)
    }

    // Save edited title
    const saveTitle = (newTitle: string) => {
        if (editing.type === "main" && editing.sectionIndex !== undefined) {
            const updated = [...navData]
            updated[editing.sectionIndex].title = newTitle
            setNavData(updated)
        } else if (
            editing.type === "sub" &&
            editing.sectionIndex !== undefined &&
            editing.subIndex !== undefined
        ) {
            const updated = [...navData]
            updated[editing.sectionIndex].items![editing.subIndex].title = newTitle
            setNavData(updated)
        }
        setEditing({ type: null })
    }

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
                        {navData.map((item, sectionIndex) => (
                            <SidebarMenuItem key={sectionIndex}>
                                <div className="flex items-center justify-between">
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

                                    <div className="flex items-center">
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
                                            className="text-red-500"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {item.items?.length ? (
                                    <SidebarMenuSub className="!pr-0 mr-0">
                                        {item.items.map((sub, subIndex) => (
                                            <SidebarMenuSubItem key={subIndex}>
                                                <div className="flex items-center justify-between w-full">
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
                                                            className="w-full rounded border px-1 !h-fit text-sm !py-0"
                                                        />
                                                    ) : (
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={sub.isActive}
                                                            onClick={() =>
                                                                setEditing({
                                                                    type: "sub",
                                                                    sectionIndex,
                                                                    subIndex,
                                                                })
                                                            }
                                                        >
                                                            <span className="cursor-text">{sub.title}</span>
                                                        </SidebarMenuSubButton>
                                                    )}

                                                    {/* Delete sub-item */}
                                                    <Button
                                                        onClick={() => deleteSubItem(sectionIndex, subIndex)}
                                                        variant="link"
                                                        size="icon"
                                                        className="text-red-500"
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
            <SidebarRail />
        </Sidebar>
    )
}
