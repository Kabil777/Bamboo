"use client"

import { TabChips } from "@/components/atomsComponents";
import * as React from "react"

export default function Home() {

  return (
    <>
      <main className="pt-3 md:p-6 md:px-12 flex justify-center">
        <div className="container grid grid-cols-4 transition-all duration-200 ease-linear gap-4 md:gap-6 max-w-[100%]">
          <div className="col-span-full border-b border-border pl-1 pb-3">
            <TabChips />
          </div>

          <div className="col-span-full md:col-span-3 mx-2 md:mx-0  bg-amber-500 h-screen ">
            Bamboo Home Page
          </div>
          <div className="hidden md:flex md:col-span-1 bg-accent-foreground">
            Side
          </div>

        </div>


      </main>
    </>
  );
}
