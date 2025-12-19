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
import { motion } from "motion/react"
import { AccordionTrigger } from "@radix-ui/react-accordion"

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
        <div >
          <SidebarMenuItem className="!w-full">
            <div className="flex items-center w-full ">
              <SidebarMenuButton asChild className="hover:bg-transparent focus:!bg-transparent data-[active=true]:bg-transparent active:bg-transparent">
                <span className="group !p-1 !gap-1" >
                  <a
                    href={`#${item.id}`}
                    className="font-medium !text-xs h-fit text-left group-hover:text-muted-foreground transition-colors"

                  >

                    {item.value}

                  </a>
                  {/* Chevron (just toggles) */}
                  {hasChildren && (
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="p-0 m-0"
                        aria-label={open ? "Collapse" : "Expand"}
                      >
                        <ChevronRight
                          size={20}
                          className={`transition-transform duration-200 ${open ? "rotate-90" : ""
                            }`}
                        />
                      </button>
                    </CollapsibleTrigger>
                  )}
                </span>
              </SidebarMenuButton>
            </div>

            {hasChildren && (
              <CollapsibleContent forceMount asChild>
                <motion.div
                  initial={false}
                  animate={open ? "open" : "closed"}
                  variants={{
                    open: {
                      height: "auto",
                      opacity: 1,
                    },
                    closed: {
                      height: 0,

                    }
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{
                    overflow: "hidden",
                    transformOrigin: "top",
                    willChange: "height"
                  }}
                >
                  <SidebarMenuSub className="mr-0 pr-0">
                    {renderSidebarItems(item.items!)}
                  </SidebarMenuSub>
                </motion.div>
              </CollapsibleContent>
            )}
          </SidebarMenuItem>
        </div>
      </Collapsible>
    )
  })
}
export const ArticleTableContent = ({ toc }: { toc: TocItem[] }) => {
  const tocTree = buildTocTree(toc)

  return (
    <div className="space-y-1">
      <SidebarMenu>{renderSidebarItems(tocTree)}</SidebarMenu>
    </div>
  )
}