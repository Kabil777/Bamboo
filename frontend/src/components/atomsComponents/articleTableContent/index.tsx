import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub
} from "@/components/shadcnUI/sidebar"

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
  return items.map((item) => (
    <SidebarMenuItem key={item.id} className="!w-full">
      <SidebarMenuButton asChild>
        <a href={`#${item.id}`} className="font-normal !text-sm h-fit !w-full">
          {item.value}
        </a>
      </SidebarMenuButton>

      {item.items?.length ? (
        <SidebarMenuSub className="mr-0 pr-0">{renderSidebarItems(item.items)}</SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  ))
}
export const ArticleTableContent = ({ toc }: { toc: TocItem[] }) => {
  const tocTree = buildTocTree(toc)

  return (
    <div className="space-y-6">
      <SidebarMenu>{renderSidebarItems(tocTree)}</SidebarMenu>
    </div>
  )
}
