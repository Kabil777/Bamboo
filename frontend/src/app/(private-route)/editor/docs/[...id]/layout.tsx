import { EditorSidebar } from "@/components/atomsComponents";
import { SidebarProvider, SidebarTrigger } from "@/components/shadcnUI/sidebar";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider >
      <EditorSidebar />
        <SidebarTrigger className="fixed border-border shadow-2xl border-y-2 border-r-2 sm:border-none bottom-15 bg-accent/95 sm:bg-accent backdrop-blur supports-[backdrop-filter]:bg-background/60  z-10" />
        {children}
    </SidebarProvider>
  )
}