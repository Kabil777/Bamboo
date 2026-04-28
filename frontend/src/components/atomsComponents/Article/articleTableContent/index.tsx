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
import { motion } from "motion/react"
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

// ─── Proper React component so hooks are legal ─────────────────────────────
function TocItemNode({
  item,
  activeId,
  depth = 0,
}: {
  item: TocItem
  activeId: string | null
  depth?: number
}) {
  const hasChildren = item.items && item.items.length > 0
  const [open, setOpen] = useState<boolean>(true)
  const isActive = activeId === item.id

  return (
    <Collapsible
      asChild
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible min-w-0 w-full"
    >
      <div>
        <SidebarMenuItem className="!w-full min-w-0 !list-none">
          <div
            className={`flex items-center w-full min-w-0 group/tocitem relative border-l-2 transition-colors ${
              isActive
                ? "border-primary bg-accent/70"
                : "border-transparent hover:bg-accent/40"
            }`}
          >
            <SidebarMenuButton asChild className="hover:bg-transparent focus:!bg-transparent data-[active=true]:bg-transparent active:bg-transparent min-w-0 w-full !h-auto">
              <span className="!py-[5px] !px-0 !gap-0 flex items-center min-w-0 w-full pr-1">
                <Link
                  href={`#${item.id}`}
                  className={`
                    block w-full text-left truncate min-w-0 flex-1 !pl-2
                    transition-all duration-200 ease-out
                    ${depth === 0 ? "!text-[13px] font-semibold" : "!text-[12px] font-medium"}
                    ${isActive
                      ? "text-foreground"
                      : "text-muted-foreground/80 hover:text-foreground"
                    }
                  `}
                  title={item.value}
                >
                  {item.value}
                </Link>
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
                  open: { height: "auto", opacity: 1 },
                  closed: { height: 0, opacity: 0 },
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  overflow: "hidden",
                  transformOrigin: "top",
                  willChange: "height",
                }}
              >
                <SidebarMenuSub className="mr-0 pr-0 min-w-0 overflow-hidden !ml-2 !pl-2.5 !border-l">
                  {item.items!.map((child) => (
                    <TocItemNode key={child.id} item={child} activeId={activeId} depth={depth + 1} />
                  ))}
                </SidebarMenuSub>
              </motion.div>
            </CollapsibleContent>
          )}
        </SidebarMenuItem>
      </div>
    </Collapsible>
  )
}

export const ArticleTableContent = ({ toc }: { toc: TocItem[] }) => {
  const tocTree = buildTocTree(toc)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (toc.length === 0) return

    const headingIds = toc.map((t) => t.id)

    const THRESHOLD = 80 // px: navbar (~80px) + comfortable read offset

    let rafId: number

    const updateActive = () => {
      const elements = headingIds
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[]

      const vh = window.innerHeight

      // Pick exactly one current section: the last heading above threshold.
      let currentSection: string | null = null
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= THRESHOLD) {
          currentSection = el.id
        } else {
          break
        }
      }

      // If above all headings, use the first visible heading.
      if (!currentSection && elements.length > 0) {
        const firstTop = elements[0].getBoundingClientRect().top
        if (firstTop < vh * 0.9) {
          currentSection = elements[0].id
        }
      }

      setActiveId((prev) => (prev === currentSection ? prev : currentSection))
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateActive)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    updateActive() // initial call on mount

    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [toc])

  return (
    <div className="space-y-0.5 min-w-0 overflow-hidden">
      <SidebarMenu className="min-w-0 gap-0">
        {tocTree.map((item) => (
          <TocItemNode key={item.id} item={item} activeId={activeId} />
        ))}
      </SidebarMenu>
    </div>
  )
}
