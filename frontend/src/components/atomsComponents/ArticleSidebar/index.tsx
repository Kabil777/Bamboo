import * as React from "react"
import { ChevronDown } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/shadcnUI/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/shadcnUI/collapsible"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
    {
      title: "Building Your Application",
      url: "#",
      items: [
        {
          title: "Routing",
          url: "#",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
        {
          title: "Caching",
          url: "#",
        },
        {
          title: "Styling",
          url: "#",
        },
        {
          title: "Optimizing",
          url: "#",
        },
        {
          title: "Configuring",
          url: "#",
        },
        {
          title: "Testing",
          url: "#",
        },
        {
          title: "Authentication",
          url: "#",
        },
        {
          title: "Deploying",
          url: "#",
        },
        {
          title: "Upgrading",
          url: "#",
        },
        {
          title: "Examples",
          url: "#",
        },
      ],
    },
    {
      title: "API Reference",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
        {
          title: "Functions",
          url: "#",
        },
        {
          title: "next.config.js Options",
          url: "#",
        },
        {
          title: "CLI",
          url: "#",
        },
        {
          title: "Edge Runtime",
          url: "#",
        },
      ],
    },
    {
      title: "Architecture",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
        {
          title: "Next.js Compiler",
          url: "#",
        },
        {
          title: "Supported Browsers",
          url: "#",
        },
        {
          title: "Turbopack",
          url: "#",
        },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [
        {
          title: "Contribution Guide",
          url: "#",
        },
      ],
    },
  ],
}

export function ArticleSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}  >
      <SidebarContent className="custom-scroll scroll-smooth !bg-background px-3">    
         <div className="from-background via-background/80 to-background/0 sticky -top-1 z-10 h-6 shrink-0 bg-gradient-to-b"></div>

        <SidebarGroup className="px-0">
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <Collapsible key={item.title} defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-accent transition-colors">
                    <SidebarMenuButton asChild className="hover:bg-transparent">
                      <a href={item.url} className="font-semibold text-sm">
                        {item.title}
                      </a>
                    </SidebarMenuButton>
                    <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180 text-muted-foreground" />
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-2 mt-1 border-l border-border pl-3">
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title} className="my-0.5">
                            <SidebarMenuSubButton asChild isActive={item.isActive} className="text-sm py-1.5">
                              <a href={item.url}>{item.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>

            ))}
          </SidebarMenu>
        </SidebarGroup>
        <div className="from-background via-background/80 to-background/0 sticky -bottom-2 z-10 h-12 shrink-0 bg-gradient-to-t"></div>
      </SidebarContent>
    </Sidebar>
  )
}
