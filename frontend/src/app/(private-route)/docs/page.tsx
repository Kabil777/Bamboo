"use client";
import { DocsCards } from "@/components/ui";
import * as React from "react";

export default function Docs() {
    return (
        <>
            <main className="flex flex-col p-5 md:py-10 md:px-24 gap-10">
                <p className="text-base md:text-2xl font-bold text-start">
                    Bamboo&apos;s Documentations
                </p>
                <DocsCards />
            </main>
        </>
    );
}
