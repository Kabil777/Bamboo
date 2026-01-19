"use client";
import { Button } from "@/components/shadcnUI/button";
import { Calendar } from "lucide-react";
import { FaReact } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { DocsHomeCard } from "@/types/docs/docs-base";
import { UUID } from "@/types/blog/blog-base";

interface card {
    id: number;
    title: string;
    created: string;
    description?: string;
}

export const DocsCard = ({
    hoverOpen = true,
    doc,
    active,
    setActiveCard,
}: {
    hoverOpen: boolean;
    doc: DocsHomeCard;
    active: UUID;
    setActiveCard: (id: UUID) => void;
}) => {
    const isActive = active === doc.id;
    return (
        <motion.div
            key={doc.id}
            layout
            onMouseEnter={() => setActiveCard(doc.id)}
            transition={{ layout: { duration: 0.3, type: "spring" } }}
            className={`border rounded-xl p-4 flex flex-col justify-between gap-3 transition-colors  ${
                isActive ? "bg-muted/50" : ""
            }`}
        >
            {!isActive && hoverOpen ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xl font-medium">
                        <FaReact size={30} />
                        {doc.title}
                    </div>
                    <Button className="text-sm font-semibold px-3 py-2 rounded-lg">
                        View Docs
                    </Button>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-2 text-xl font-medium">
                        <FaReact size={30} />
                        {doc.title}
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-base text-accent-foreground font-normal"
                    >
                        {doc.description || "No description available."}
                    </motion.p>

                    <div className="flex items-center justify-between text-sm text-accent-foreground">
                        <div className="flex font-semibold items-center gap-2">
                            <Calendar size={18} />
                            Created on{" "}
                            {new Date(doc.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                },
                            )}
                        </div>
                        <Link href={`/docs/${doc.id}`}>
                            <Button className="h-fit text-sm px-3 py-2 rounded-lg font-semibold">
                                View Docs
                            </Button>
                        </Link>
                    </div>
                </>
            )}
        </motion.div>
    );
};
