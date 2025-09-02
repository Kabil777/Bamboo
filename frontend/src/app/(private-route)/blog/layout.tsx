import { ArticleSidebar } from "@/components/atomsComponents";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/shadcnUI/sidebar";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider >
      <ArticleSidebar />
      <SidebarInset>
        <SidebarTrigger className="fixed border-border shadow-2xl border-y-2 border-r-2 sm:border-none bottom-15 bg-accent/95 sm:bg-accent backdrop-blur supports-[backdrop-filter]:bg-background/60  z-10" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}