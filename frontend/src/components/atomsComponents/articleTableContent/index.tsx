"use client"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/shadcnUI/collapsible"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub
} from "@/components/shadcnUI/sidebar"
import { ChevronRight } from "lucide-react"
import React, { useState } from "react"

type TocItem = {
  id: string
  value: string
  depth: number
  items?: TocItem[]
}
function buildTocTree(flatItems: TocItem[]): TocItem[] {
  const root: TocItem[] = []
  const stack: TocItem[] = []

  flatItems.forEach((item) => {
    const newItem = { ...item, items: [] }
    while (stack.length > 0 && stack[stack.length - 1].depth >= item.depth) {
      stack.pop()
    }

    if (stack.length === 0) {
      root.push(newItem)
    } else {
      stack[stack.length - 1].items!.push(newItem)
    }

    stack.push(newItem)
  })

  return root
}
function renderSidebarItems(items: TocItem[]) {
  return items.map((item) => {
    const hasChildren = item.items && item.items.length > 0
    const [open, setOpen] = useState<boolean>(true) 

    return (
      <Collapsible
        key={item.id}
        asChild
        open={open}
        onOpenChange={setOpen}
        className="group/collapsible"
      >
        <SidebarMenuItem className="!w-full">
          <div className="flex items-center w-full">
            {/* Text link (just navigates) */}
            <SidebarMenuButton asChild className="flex-1 justify-start">
              <a
                href={`#${item.id}`}
                className="font-normal !text-sm h-fit text-left w-full"
              >
                {item.value}
              </a>
            </SidebarMenuButton>

            {/* Chevron (just toggles) */}
            {hasChildren && (
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="p-1 ml-1"
                  aria-label={open ? "Collapse" : "Expand"}
                >
                  <ChevronRight
                    className={`transition-transform duration-200 ${
                      open ? "rotate-90" : ""
                    }`}
                  />
                </button>
              </CollapsibleTrigger>
            )}
          </div>

          {/* Children */}
          {hasChildren && (
            <CollapsibleContent>
              <SidebarMenuSub className="mr-0 pr-0">
                {renderSidebarItems(item.items!)}
              </SidebarMenuSub>
            </CollapsibleContent>
          )}
        </SidebarMenuItem>
      </Collapsible>
    )
  })
}
export const ArticleTableContent = ({ toc }: { toc: TocItem[] }) => {
  const tocTree = buildTocTree(toc)

  return (
    <div className="space-y-6">
      <SidebarMenu>{renderSidebarItems(tocTree)}</SidebarMenu>
    </div>
  )
}
