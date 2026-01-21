"use client";
import { Button } from "@/components/shadcnUI/button";
import { Input } from "@/components/shadcnUI/input";
import { DocsCards } from "@/components/ui";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import * as React from "react";
import { BiSearchAlt } from "react-icons/bi";

export default function Search() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  React.useEffect(() => {
    const currentQuery = searchParams.get("query") || "";
    setQuery(currentQuery);
  }, [searchParams]);

  return (
    <>
      <main className="flex flex-col p-5 md:py-10 md:px-24 gap-5 md:gap-10">
        <p className="text-base md:text-2xl font-bold break-words whitespace-normal">
          {query ? `Search Result - '${query}'` : "Bamboo's Search"}
        </p>
        <div className="flex items-center gap-2 md:gap-3 sticky top-[58px] z-9 py-3 w-full bg-background">
          <div className="relative w-full">
            <Input
              placeholder="Search..."
              autoFocus
              ref={inputRef}
              type="search"
              className="flex h-12 items-center transition-all delay-75 justify-between md:pl-10 pl-8 pr-2 md:pr-15 font-medium md:flex py-1 text-sm text-muted-foreground border border-input  rounded-md hover:bg-accent hover:text-foreground "
            />

            <span className="font-medium flex gap-1 items-center transition-all delay-75 absolute left-3 md:left-4 top-1/2 -translate-y-1/2 ">
              <BiSearchAlt className="pointer-events-none" />
            </span>
            <kbd className="hidden md:flex transition-all delay-75 items-center gap-1 px-1 py-0.5 rounded bg-muted font-mono absolute right-3 md:right-5 top-1/2 -translate-y-1/2 text-xs">
              ⌘ K
            </kbd>
          </div>
          <Button
            onClick={() =>
              router.push(`/search?query=${inputRef.current?.value}`)
            }
            variant="outline"
            className="h-12"
          >
            Search
          </Button>
        </div>
        <div className="break-words">{query ? query : <DocsCards />}</div>
      </main>
    </>
  );
}
