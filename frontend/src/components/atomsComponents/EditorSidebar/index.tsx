"use client";

import { Plus, Trash } from "lucide-react";
import { Input } from "@/components/shadcnUI/input";
import { Button } from "@/components/shadcnUI/button";
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

import { useState } from "react";
import { useDocsMetaProvider } from "@/hooks/useDocsMetaProvider";
import { useDocsTree } from "@/hooks/useDocsTree";

export function EditorSidebar({
    docId,
    ...props
}: { docId: string } & React.ComponentProps<typeof Sidebar>) {
    const provider = useDocsMetaProvider(
        "0b428649-7ad9-453b-8619-79ed9b099925",
    );

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

    const renderNode = (node: any) => (
        <SidebarMenuItem key={node.id}>
            <div className="flex items-center justify-between group">
                {editingId === node.id ? (
                    <Input
                        autoFocus
                        defaultValue={node.title}
                        onBlur={(e) => {
                            updateTitle(node.id, e.target.value);
                            setEditingId(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                updateTitle(
                                    node.id,
                                    (e.target as HTMLInputElement).value,
                                );
                                setEditingId(null);
                            }
                        }}
                        className="w-full rounded border px-1 text-sm"
                    />
                ) : (
                    <SidebarMenuButton onClick={() => setEditingId(node.id)}>
                        <span className="cursor-text">{node.title}</span>
                    </SidebarMenuButton>
                )}

                <div className="flex gap-1 invisible group-hover:visible">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => addPage(node.id)}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deletePage(node.id)}
                    >
                        <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            </div>

            {node.children?.length > 0 && (
                <SidebarMenuSub>{node.children.map(renderNode)}</SidebarMenuSub>
            )}
        </SidebarMenuItem>
    );

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">Pages</SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>{tree.map(renderNode)}</SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <Button className="w-full" onClick={() => addPage(null)}>
                    <Plus className="w-4 h-4" /> Add Section
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
