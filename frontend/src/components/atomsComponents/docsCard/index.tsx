"use client";
import { useState } from "react";
import { Button } from "@/components/shadcnUI/button";
import { Calendar } from "lucide-react";
import { FaReact } from "react-icons/fa";
import { motion } from "framer-motion";

const cardData = [
  { id: 1, title: "React", updated: "Jan 2025" },
  { id: 2, title: "Vue", updated: "Feb 2025" },
  { id: 3, title: "Angular", updated: "Mar 2025" },
  { id: 4, title: "Svelte", updated: "Apr 2025" },
  { id: 5, title: "Next.js", updated: "May 2025" },
];

export const DocsCard = () => {
  const [activeCard, setActiveCard] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <span className="flex items-center justify-between px-2">
        <p className="font-semibold">Docs...</p>
        <Button variant={"outline"} className="text-sm rounded-lg" >View all</Button>
      </span>

      {cardData.map((card) => {
        const isActive = activeCard === card.id;
        return (
          <motion.div
            key={card.id}
            layout
            onMouseEnter={() => setActiveCard(card.id)}
            transition={{ layout: { duration: 0.3, type: "spring" } }}
            className={`border rounded-xl p-4 flex flex-col gap-3 transition-colors ${
              isActive ? "bg-muted/50" : ""
            }`}
          >
            {!isActive ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xl font-medium">
                  <FaReact size={30} />
                  {card.title}
                </div>
                <Button className="text-base font-normal px-5 py-2 rounded-lg">
                  View Docs
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xl font-medium">
                  <FaReact size={30} />
                  {card.title}
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-base text-accent-foreground font-medium"
                >
                  A JavaScript library for building user interfaces
                </motion.p>

                <div className="flex items-center justify-between text-sm text-accent-foreground">
                  <div className="flex font-semibold items-center gap-2">
                    <Calendar size={18} />
                    Updated {card.updated}
                  </div>
                  <Button className="h-fit text-base font-normal px-5 py-2 rounded-lg">
                    View Docs
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
