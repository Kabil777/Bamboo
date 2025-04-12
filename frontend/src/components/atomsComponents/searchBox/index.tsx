'use client'
import { BiSearchAlt } from "react-icons/bi";
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle
} from "@/components/shadcnUI/dialog"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/shadcnUI/command"

import { Button } from "@/components/shadcnUI/button"

export function SearchBox() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(prev => !prev) // toggle open/close
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="flex items-center transition-all delay-75 justify-between md:pl-3 pl-2 pr-2 py-1 text-sm text-muted-foreground border border-input bg-accent rounded-md hover:bg-accent hover:text-foreground"
        >

          <span className="font-medium flex gap-1 items-center transition-all delay-75">
            <BiSearchAlt className='pointer-events-none' />
            <span className="font-medium hidden items-center md:flex transition-all delay-75">Search...</span></span>
          <kbd className="hidden md:flex transition-all delay-75 items-center gap-1 px-1 py-0.5 rounded bg-muted font-mono">⌘ K</kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 top-45">
        <DialogTitle className="hidden" />
        <Command className="p-2 md:min-w-[450px]">
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Calendar />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <Smile />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem disabled>
                <Calculator />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCard />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
