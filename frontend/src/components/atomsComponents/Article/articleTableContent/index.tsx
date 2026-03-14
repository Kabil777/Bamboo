"use client"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/shadcnUI/collapsible"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub
} from "@/components/shadcnUI/sidebar"
import { ChevronRight } from "lucide-react"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "motion/react"
import Link from "next/link"

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

function renderSidebarItems(items: TocItem[], activeId: string | null, depth: number = 0) {
  return items.map((item) => {
    const hasChildren = item.items && item.items.length > 0
    const [open, setOpen] = useState<boolean>(true)
    const isActive = activeId === item.id

    return (
      <Collapsible
        key={item.id}
        asChild
        open={open}
        onOpenChange={setOpen}
        className="group/collapsible min-w-0 w-full"
      >
        <div>
          <SidebarMenuItem className="!w-full min-w-0 !list-none">
            <div className="flex items-center w-full min-w-0 group/tocitem relative">
              {/* Smooth sliding active indicator — shared layoutId makes it glide between items */}
              {isActive && (
                <motion.div
                  layoutId="toc-active-indicator"
                  className="absolute left-0 top-[3px] bottom-[3px] w-[2.5px] rounded-full bg-primary"
                  style={{ originY: 0.5 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                    mass: 0.8,
                  }}
                />
              )}
              <SidebarMenuButton asChild className="hover:bg-transparent focus:!bg-transparent data-[active=true]:bg-transparent active:bg-transparent min-w-0 w-full !h-auto">
                <span className="!py-[5px] !px-0 !gap-0 flex items-center min-w-0 w-full">
                  <Link
                    href={`#${item.id}`}
                    className={`
                      block w-full text-left truncate min-w-0 flex-1
                      transition-all duration-200 ease-out !pl-2
                      ${depth === 0 ? "!text-[13px] font-semibold" : "!text-[12px] font-medium"}
                      ${isActive
                        ? "text-primary"
                        : "text-muted-foreground/70 hover:text-foreground"
                      }
                    `}
                    title={item.value}
                  >
                    {item.value}
                  </Link>
                  {/* Chevron toggle */}
                  {hasChildren && (
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="p-1 rounded-md flex-shrink-0 hover:bg-muted/50 transition-colors duration-150 ml-1"
                        aria-label={open ? "Collapse" : "Expand"}
                      >
                        <ChevronRight
                          size={14}
                          className={`text-muted-foreground/50 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
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
                      opacity: 0,
                    }
                  }}
                  transition={{
                    duration: 0.25,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{
                    overflow: "hidden",
                    transformOrigin: "top",
                    willChange: "height"
                  }}
                >
                  <SidebarMenuSub className="mr-0 pr-0 min-w-0 overflow-hidden !ml-2 !pl-2.5 !border-l">
                    {renderSidebarItems(item.items!, activeId, depth + 1)}
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
  const [activeId, setActiveId] = useState<string | null>(null)

  // Track the active heading via IntersectionObserver
  useEffect(() => {
    if (toc.length === 0) return

    const headingIds = toc.map((t) => t.id)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible?.target?.id) {
          setActiveId(visible.target.id)
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    )

    const elements = headingIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [toc])

  return (
    <div className="space-y-0.5 min-w-0 overflow-hidden">
      <LayoutGroup>
        <SidebarMenu className="min-w-0 gap-0">{renderSidebarItems(tocTree, activeId)}</SidebarMenu>
      </LayoutGroup>
    </div>
  )
}
