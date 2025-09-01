"use client";
import { useState } from "react";
import { Button } from "@/components/shadcnUI/button";
import { DocsCard } from "@/components/atomsComponents";
import Link from "next/link";

const cardData = [
  { id: 1, title: "React", created: "Jan 2025" , description: "A JavaScript library for building user interfaces" },
  { id: 2, title: "Vue", created: "Feb 2025", description: "A progressive JavaScript framework for building user interfaces" },
  { id: 3, title: "Angular", created: "Mar 2025", description: "A platform for building mobile and desktop web applications" },
  { id: 4, title: "Svelte", created: "Apr 2025", description: "A radical new approach to building user interfaces" },

  { id: 5, title: "Next.js", created: "May 2025" },
];

export const DocsHome = () => {
  const [activeCard, setActiveCard] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <span className="flex items-center justify-between px-2">
        <p className="font-semibold">Docs...</p>
        <Link href="/docs"><Button variant={"outline"} className="text-sm rounded-lg">
          View all
        </Button></Link>
      </span>

      {cardData.map((card) => {
        return <DocsCard key={card.id} card={card} hoverOpen active={activeCard} setActiveCard={setActiveCard} />;
      })}
    </div>
  );
};
