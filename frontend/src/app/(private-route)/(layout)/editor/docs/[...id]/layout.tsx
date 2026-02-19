import { EditorSidebar } from "@/components/atomsComponents";
import { SidebarProvider } from "@/components/shadcnUI/sidebar";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <EditorSidebar />
      {children}
    </SidebarProvider>
  )
}
