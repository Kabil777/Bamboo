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


import { useDocsMetaProvider } from "@/hooks/useDocsMetaProvider";
import { useDocsTree } from "@/hooks/useDocsTree";
import * as Y from "yjs";

export function EditorSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { id } = useParams() as { id: string | string[] };
  const provider = useDocsMetaProvider("1add6f66-f67f-4e18-8f2f-405a8de5cdc0");
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
  const docId = id[0]; // First part is always the doc ID
  

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <span className="font-medium" />
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
                <Link
                  href={`/editor/docs/${docId}`}
                  className="font-semibold text-sm"
                >
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
                      className="w-full rounded border px-1 text-sm"
                    />
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={id.length === 2 && id[1] === item.id}
                    >
                      <Link
                        href={`/editor/docs/${docId}/${item.id}`}
                        className="font-medium"
                      >
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  )}

                  <div className="flex items-center ml-2 gap-3 group-hover/btnvisible:visible invisible">
                    {/* Add sub-item button */}
                    <Button
                      onClick={() => addPage(item.id)}
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
                  <SidebarMenuSub className="!pr-0 mr-0">
                    {item.children.map((sub) => (
                      <SidebarMenuSubItem key={sub.id}>
                        <div className="flex items-center justify-between w-full group/btnvisible">
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
                              className="w-full rounded border px-1 !h-fit text-sm !py-1"
                            />
                          ) : (
                            <SidebarMenuSubButton
                              asChild
                              isActive={
                                id.length === 3 &&
                                id[1] === item.id &&
                                id[2] === sub.id
                              }
                              className="w-full"
                            >
                              <Link
                                href={`/editor/docs/${docId}/${item.id}/${sub.id}`}
                              >
                                {sub.title}
                              </Link>
                            </SidebarMenuSubButton>
                          )}

                          <div className="flex items-center ml-2 gap-3 group-hover/btnvisible:visible invisible">
                            {/* Edit sub-item */}
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                setEditingId(sub.id);
                              }}
                              className="w-fit h-fit"
                              variant="link"
                              size="icon"
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            {/* Delete sub-item */}
                            <Button
                              onClick={() => deletePage(sub.id)}
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
        <Button onClick={() => addPage(null)} className="w-full">
          <Plus className="w-4 h-4" /> Add Section
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
