'use client';
import { Button } from "@/components/shadcnUI/button";
import React, { useState } from "react";

export function TabChips() {
    const [activeButton, setActiveButton] = useState(0);
    const handleClick = (index: number) => {
        if (activeButton !== index) {
            setActiveButton(index);
        }
    };

    const buttons = [
        { label: "All" },
        { label: "Design" },
        { label: "Development" },
        { label: "UX" },
        { label: "Marketing" },
        { label: "Java" },
        { label: "C++" },
        { label: "Type Script" },
        { label: "C" },
        { label: "Ruby" },
        { label: "Go" },
        { label: "Next JS" },
        { label: "Development" },
        { label: "Ruby" },
        { label: "Type Script" },
        { label: "C" },
        { label: "Ruby" },
        { label: "Go" },
        { label: "Next JS" },
        { label: "Development" },
        { label: "Ruby" },


    ];

    return (
        <div
            className="overflow-x-auto shrink-0 flex max-w-[100%] gap-1 sm:gap-2 md:gap-4 p-1"
            style={
                {
                    scrollbarWidth: "none",
                }
            }
        >
            {buttons.map((button, index) => (
                <Button
                    key={index}
                    className={`${activeButton === index ? "bg-foreground text-background hover:!bg-foreground hover:!text-background" : "text-foreground hover:text-foreground"} lg:text-base text-xs md:px-6 md:py-3 md:rounded-xl !w-fit !h-fit transition-all duration-200 ease-linear`}
                    variant="ghost"
                    onClick={() => handleClick(index)}
                >
                    {button.label}
                </Button>
            ))}
        </div>
    );
}
