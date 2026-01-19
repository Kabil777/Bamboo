'use client'
import { BiSearchAlt } from "react-icons/bi";
import { useEffect } from "react"
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/shadcnUI/button"

export function SearchBox() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        router.push("/search");
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router])

  return (
        <Button
          onClick={() => router.push("/search")}
          variant="outline"
          className="flex items-center transition-all delay-75 justify-between md:pl-3 pl-2 pr-2 py-1 text-sm text-muted-foreground border border-input bg-accent rounded-md hover:bg-accent hover:text-foreground"
        >

          <span className="font-medium flex gap-1 items-center transition-all delay-75">
            <BiSearchAlt className='pointer-events-none' />
            <span className="font-medium hidden items-center md:flex transition-all delay-75">Search...</span></span>
          <kbd className="hidden md:flex transition-all delay-75 items-center gap-1 px-1 py-0.5 rounded bg-muted font-mono">⌘ K</kbd>
        </Button>
  )
}
