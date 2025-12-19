"use client";

import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";


// --- Tiptap UI ---

// --- Lib ---
import "highlight.js/styles/tokyo-night-dark.css";

// import "./dummy.css";
import { renderToMarkdown } from "@tiptap/static-renderer";
import { useAppState } from "@/hooks/ReduxHooks";
import { ArticleRender, ArticleTableContent } from "@/components/atomsComponents";
import { ProfileHoverTag } from "@/components/atomsComponents/profileHoverTag";
import NextImage from "next/image";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/shadcnUI/accordion";
import { motion } from "framer-motion";

import extensions from "@/lib/extensions";
import { extractToc } from "@/lib/utils";




export default function BlogRenderPage() {
    const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);

    

    const md = renderToMarkdown({
        content: useAppState((state) => state.postReducer.content),
        extensions,
    });
    const title = useAppState((state) => state.postReducer.title);
    const description = useAppState((state) => state.postReducer.description);
    const tags = useAppState((state) => state.postReducer.tags);
    const type = useAppState((state) => state.postReducer.type);
    const pages = useAppState((state) => state.postReducer.Pages);
    const toc = extractToc(md);


    return (
        <>
            <div className="flex flex-1 flex-col w-full">
                {/* Mobile Menu Trigger */}
                <div className="sticky top-[var(--header-height)] w-full z-20 lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        value={accordionValue}
                        onValueChange={setAccordionValue}
                    >
                        <AccordionItem value="item-1">
                            <div className="flex items-center gap-2 px-4  justify-end">
                                <AccordionTrigger >
                                    <span className="text-sm font-medium text-muted-foreground">On This Page</span>
                                </AccordionTrigger>
                            </div>

                            <AccordionContent className="overflow-hidden absolute w-full border-b border-border bg-background">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: accordionValue === "item-1" ? "auto" : 0,
                                        opacity: accordionValue === "item-1" ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-y-auto max-h-[60vh] px-4 pb-4"
                                >
                                    {toc.length > 0 ? (
                                        <ArticleTableContent toc={toc} />
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic mt-2 mx-auto">No headings available</p>
                                    )}
                                </motion.div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                <div className="flex justify-center relative w-full gap-10 ">
                    {/* Main Content */}
                    <article className="flex-1 min-w-0 w-full max-w-2xl lg:translate-x-15">
                        <div className="flex w-full min-w-0 flex-1 flex-col gap-8 py-6 lg:py-8 text-neutral-800 dark:text-neutral-300">


                            {/* Article Header */}
                            <header className="mb-6 md:mb-10 w-full">

                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mt-4 md:mt-6 leading-tight">
                                    {title || 'Untitled Article'}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                        {type || 'Article'}
                                    </span>

                                    {tags && tags.length > 0 && tags.map((tag, index) => (
                                        <span key={index} className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-secondary/80 text-secondary-foreground hover:bg-secondary transition-colors">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <hr className="my-3 md:my-4" />

                                <figure className="w-full mb-4 md:mb-5">
                                    <div className="relative overflow-hidden bg-muted ">
                                        <NextImage
                                            width={800}
                                            height={450}
                                            src="https://rukminim2.flixcart.com/image/416/416/j95y4cw0/poster/b/u/v/large-wallpaper-ben-10-ultimate-alien-and-gwen-on-large-print-original-imaew88xg7fwzshd.jpeg"
                                            alt="Article cover"
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                </figure>
                                {/* Author Profile Section */}
                                <div className="flex items-center gap-3 sm:gap-4 py-4 md:py-6 border-y border-border">
                                    <div className="relative flex-shrink-0">
                                        <NextImage
                                            width={800}
                                            height={450}
                                            src="https://i.pravatar.cc/150?img=12"
                                            alt="Author profile"
                                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-offset-2 ring-primary/50 hover:ring-primary transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-center flex-1 min-w-0">
                                        <h3 className="text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors cursor-pointer truncate">Kowsik</h3>
                                        <ProfileHoverTag profileId={"author1"} />

                                    </div>
                                    <div className="ml-auto text-right hidden sm:block flex-shrink-0">
                                        <p className="text-xs text-muted-foreground">Published</p>
                                        <p className="text-xs sm:text-sm font-medium text-foreground">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>

                                {description && (
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-2 mb-4 md:mb-6">
                                        {description}
                                    </p>
                                )}
                            </header>

                            {/* Article Content */}
                            <ArticleRender content={md} />

                            {pages && pages.length > 0 && (
                                <div className="p-4 md:p-5 bg-muted/30 rounded-xl border border-border/50 backdrop-blur-sm mb-4">
                                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Related Pages
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {pages.map((page, index) => (
                                            <span key={index} className="text-xs sm:text-sm px-2.5 sm:px-3 py-1 bg-background/60 rounded-md text-muted-foreground hover:text-foreground hover:bg-background transition-all cursor-pointer border border-border/30">
                                                {page.title}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </article>

                    {/* Table of Contents - Right Sidebar */}
                    <aside className="hidden lg:block shrink-0 w-56 xl:w-64 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pb-8 custom-scroll xl:translate-x-15" >

                        <div className="px-4 py-0">
                            <div className="flex items-center gap-2 sticky top-0 bg-background pt-2 pb-2 z-10">
                                <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                <h2 className="text-sm font-bold text-foreground">On This Page</h2>
                            </div>
                            {toc.length > 0 ? (
                                <ArticleTableContent toc={toc} />
                            ) : (
                                <p className="text-xs text-muted-foreground italic mt-2 pr-2">No headings available</p>
                            )}
                        </div>
                        <div className="from-background via-background/80 to-background/50 sticky -bottom-10 z-10 h-15 shrink-0 bg-gradient-to-t"></div>

                    </aside>
                </div>
            </div>
        </>
    );
}