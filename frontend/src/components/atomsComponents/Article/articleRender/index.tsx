"use client";

import "highlight.js/styles/tokyo-night-dark.css";
import "@/styles/render.css"
import { JetBrains_Mono } from "next/font/google";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/shadcnUI/button";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcnUI/dialog";
import Link from "next/link";
import { ZoomableImage } from "@/components/atomsComponents/ZoomableImage";

const jetBrains_Mono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
    variable: "--font-JetBrains_Mono",
});

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// Collects the full plain-text string from React children, then slugifies
// once — exactly matching what extractToc does on the raw markdown.
function extractId(node: React.ReactNode): string {
    return slugify(extractText(node));
}

function extractText(node: React.ReactNode): string {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);

    if (Array.isArray(node)) {
        return node.map(extractText).join("");
    }

    if (React.isValidElement(node)) {
        return extractText(
            (node.props as { children?: React.ReactNode }).children,
        );
    }

    return "";
}

export const ArticleRender = ({ content }: { content: string }) => {
    const [buttonText, setButtonText] = React.useState<Record<string, boolean>>(
        {},
    );

    const handleCopy = (key: string, text: string) => {
        navigator.clipboard.writeText(text);
        setButtonText((prev) => ({ ...prev, [key]: true }));
        setTimeout(() => {
            setButtonText((prev) => ({ ...prev, [key]: false }));
        }, 2000);
    };
    const processedContent = React.useMemo(() => {
        if (!content) return "";
        let md = content;
        md = md.replace(/(?<!=)==(?!=)([^=]+)==(?!=)/g, "<mark>$1</mark>");
        // ++inserted text++ → <u>inserted text</u>
        md = md.replace(/\+\+([^+]+)\+\+/g, "<u>$1</u>");
        // ^superscript^ → <sup>superscript</sup> (avoid ^^)
        md = md.replace(/(?<!\^)\^(?!\^)([^^]+)\^(?!\^)/g, "<sup>$1</sup>");
        // ~subscript~ → <sub>subscript</sub> (avoid ~~ strikethrough)
        md = md.replace(/(?<!~)~(?!~)([^~]+)~(?!~)/g, "<sub>$1</sub>");
        return md;
    }, [content]);


    return (
        <div className="article-render-root">

            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                    /* ── Headings ── */
                    h1: ({ children, ...props }) => (
                        <h1
                            id={extractId(children)}
                            {...props}
                            className="article-heading text-2xl sm:text-3xl lg:text-4xl scroll-m-20 font-extrabold tracking-tight text-foreground mt-10 mb-4 first:mt-0 leading-[1.50]"
                        >
                            {children}
                        </h1>
                    ),
                    h2: ({ children, ...props }) => (
                        <h2
                            id={extractId(children)}
                            className="article-heading text-xl sm:text-2xl lg:text-3xl scroll-m-20 font-bold tracking-tight text-foreground mt-10 mb-4 pb-2 border-b border-border/40 first:mt-0"
                            {...props}
                        >
                            {children}
                        </h2>
                    ),
                    h3: ({ children, ...props }) => (
                        <h3
                            id={extractId(children)}
                            className="article-heading text-lg sm:text-xl lg:text-2xl scroll-m-20 font-semibold tracking-tight text-foreground mt-8 mb-3 first:mt-0"
                            {...props}
                        >
                            {children}
                        </h3>
                    ),
                    h4: ({ children, ...props }) => (
                        <h4
                            id={extractId(children)}
                            className="article-heading text-base sm:text-lg scroll-m-20 font-semibold text-foreground mt-6 mb-2"
                            {...props}
                        >
                            {children}
                        </h4>
                    ),
                    h5: ({ children, ...props }) => (
                        <h5
                            id={extractId(children)}
                            className="article-heading text-sm sm:text-base scroll-m-20 font-semibold text-foreground mt-6 mb-2"
                            {...props}
                        >
                            {children}
                        </h5>
                    ),
                    h6: ({ children, ...props }) => (
                        <h6
                            id={extractId(children)}
                            className="article-heading text-xs sm:text-sm scroll-m-20 font-semibold mt-6 mb-2 tracking-wider"
                            {...props}
                        >
                            {children}
                        </h6>
                    ),
                    /* ── Paragraph ── */
                    p: ({ ...props }) => (
                        <p
                            className="text-[15px] sm:text-base leading-[1.8] text-foreground/90 mb-5 hyphens-auto [&:has(img)]:mb-0"
                            {...props}
                        />
                    ),
                    /* ── Image ── */
                    img: ({ src, alt, width, height, ...props }) => {
                        if (!src) return null;

                        const imageWidth =
                            typeof width === "string"
                                ? parseInt(width, 10)
                                : width;
                        const imageHeight =
                            typeof height === "string"
                                ? parseInt(height, 10)
                                : height;

                        return (
                            <>
                                <Dialog >
                                    <DialogTrigger asChild>
                                        <Image
                                            width={imageWidth || 800}
                                            height={imageHeight || 450}
                                            alt={alt || "Image"}
                                            className="my-6 sm:my-8 rounded-xl transition-all duration-300 w-fit max-h-[300px] sm:max-h-[450px] mx-auto"
                                            src={src}
                                            {...props}
                                        />
                                    </DialogTrigger>
                                    <DialogContent showCloseButton={true} className="sm:!max-w-6xl max-h-[calc(100vh-4rem)] overflow-hidden p-0">
                                        <DialogHeader className="sr-only">
                                            <DialogTitle>{alt || "Image"}</DialogTitle>
                                        </DialogHeader>
                                        <ZoomableImage
                                            src={src}
                                            alt={alt || "Image"}
                                            width={imageWidth || 800}
                                            height={imageHeight || 450}
                                        />
                                    </DialogContent>
                                </Dialog>

                            </>
                        );
                    },

                    /* ── Code Block / Inline Code ── */
                    code: (props) => {
                        const { className, children, ...rest } = props;
                        const rawLang = className?.split("language-")[1];
                        const language = rawLang == "null" ? "Plain" :
                            (rawLang ? rawLang.charAt(0).toUpperCase() + rawLang.slice(1) : "");

                        const codeText = extractText(children);
                        const copyKey = `${language ?? "plain"}-${codeText.slice(0, 50)}`;

                        return language ? (
                            <div
                                className={`relative my-6 sm:my-8 group ${jetBrains_Mono.className}`}
                            >
                                {/* Header Bar */}
                                <div className="flex items-center justify-between rounded-t-xl px-4 py-2.5 sticky top-14 z-10"
                                    style={{ background: "var(--article-code-header)" }}
                                >
                                    <div className="flex items-center gap-2">
                                        {/* Terminal dots */}
                                        <div className="hidden sm:flex items-center gap-1.5 mr-1">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/80" />
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
                                        </div>
                                        <span className="text-[11px] font-medium text-white/60 uppercase tracking-wider">
                                            {language}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleCopy(copyKey, codeText)}
                                        className="code-block-copy-btn h-7 px-2.5 gap-1.5 text-[11px] text-white/50 hover:text-white/90 border-none shadow-none bg-transparent hover:bg-white/10 rounded-lg"
                                    >
                                        {buttonText[copyKey] ? (
                                            <>
                                                <Check className="w-3 h-3 text-emerald-400" />
                                                <span className="text-emerald-400">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Code Body */}
                                <pre
                                    className="overflow-x-auto custom-scroll max-h-[32rem] rounded-b-xl"
                                    style={{ background: "var(--article-code-bg)" }}
                                >
                                    <code
                                        className={`text-xs sm:text-[13px] leading-relaxed custom-scroll ${className} ${jetBrains_Mono.className}`}
                                        style={{ background: "var(--article-code-bg)" }}
                                        {...rest}
                                    >
                                        {typeof children === "string" ? children.trim() : children}
                                    </code>
                                </pre>
                            </div>
                        ) : (
                            <code
                                className={`article-inline-code px-1.5 py-0.5 mx-0.5 rounded-md font-bold text-foreground border border-border/60 bg-muted/60 ${jetBrains_Mono.className}`}
                                {...rest}
                            >
                                {children}
                            </code>
                        );
                    },

                    /* ── Horizontal Rule ── */
                    hr: ({ ...props }) => (
                        <hr
                            className="my-10 sm:my-12 bg-border/10"
                            {...props}
                        />
                    ),

                    /* ── Lists ── */
                    ul: ({ ...props }) => (
                        <ul
                            className="list-disc pl-6 my-4 space-y-1.5 marker:text-primary/50"
                            {...props}
                        />
                    ),
                    ol: ({ ...props }) => (
                        <ol
                            className="list-decimal pl-6 my-4 space-y-1.5 marker:text-primary/50"
                            {...props}
                        />
                    ),
                    li: ({ ...props }) => (
                        <li
                            className="text-[15px] sm:text-base leading-[1.75] text-foreground/90 pl-1"
                            {...props}
                        />
                    ),

                    /* ── Table ── */
                    table: ({ ...props }) => (
                        <div className="my-6 sm:my-8 overflow-x-auto rounded-xl border border-border/60">
                            <table
                                className="w-full border-collapse text-sm"
                                {...props}
                            />
                        </div>
                    ),
                    thead: ({ ...props }) => (
                        <thead
                            className="bg-muted/50 border-b border-border/60"
                            {...props}
                        />
                    ),
                    tbody: ({ ...props }) => (
                        <tbody className="divide-y divide-border/40" {...props} />
                    ),
                    tr: ({ ...props }) => (
                        <tr
                            className="article-table-row hover:bg-muted/30"
                            {...props}
                        />
                    ),
                    td: ({ ...props }) => (
                        <td
                            className="px-4 py-3 text-foreground/85 text-[13px] sm:text-sm"
                            {...props}
                        />
                    ),
                    th: ({ ...props }) => (
                        <th
                            className="px-4 py-3 text-left text-xs font-semibold text-foreground tracking-wider"
                            {...props}
                        />
                    ),

                    /* ── Links ── */
                    a: ({ href, children, ...props }) => {
                        const isExternal =
                            typeof window !== "undefined" &&
                            href &&
                            /^https?:\/\//.test(href) &&
                            !href.includes(window.location.hostname);

                        return (
                            <Link
                                className="article-link text-foreground/80 font-medium items-center inline-flex gap-0.5"
                                href={href || "#"}
                                target={isExternal ? "_blank" : undefined}
                                rel={
                                    isExternal
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                                {...props}
                            >
                                {children}
                                {isExternal && (
                                    <SquareArrowOutUpRight className="w-3 h-3 inline-block ml-0.5 opacity-50 flex-shrink-0" />
                                )}
                            </Link>
                        );
                    },

                    /* ── Blockquote ── */
                    blockquote: ({ ...props }) => (
                        <blockquote
                            className="article-blockquote relative border-l-[3px] rounded-r-xl pl-5 pr-4 py-4 my-6 sm:my-8 bg-muted/20 text-foreground/80 italic [&>p]:mb-0"
                            {...props}
                        />
                    ),

                    /* ── Strong / Em ── */
                    strong: ({ ...props }) => (
                        <strong className="font-bold text-foreground" {...props} />
                    ),
                    em: ({ ...props }) => (
                        <em className="italic text-foreground/80" {...props} />
                    ),

                    /* ── Mark (highlight) ── */
                    mark: ({ children, node, style, ...props }) => {
                        const dataColor = (props as Record<string, unknown>)["data-color"] as string | undefined;
                        const bgColor = dataColor || (typeof style === "object" && style && "backgroundColor" in style ? (style as Record<string, string>).backgroundColor : undefined);
                        // Strip data-color from DOM props
                        const { "data-color": _, ...domProps } = props as Record<string, unknown>;
                        return (
                            <mark
                                className={`text-foreground px-0.5 rounded-sm ${!bgColor ? "bg-yellow-200/70 dark:bg-yellow-500/30" : ""}`}
                                style={bgColor ? { backgroundColor: bgColor } : undefined}
                                {...domProps}
                            >
                                {children}
                            </mark>
                        );
                    },

                    /* ── Ins / Underline ── */
                    ins: ({ children, node, ...props }) => (
                        <ins className="underline decoration-foreground/50 no-underline-offset" {...props}>
                            {children}
                        </ins>
                    ),
                    u: ({ children, node, ...props }) => (
                        <u className="underline decoration-foreground/50" {...props}>
                            {children}
                        </u>
                    ),

                    /* ── Subscript / Superscript ── */
                    sub: ({ children, node, ...props }) => (
                        <sub className="text-[0.75em]" {...props}>{children}</sub>
                    ),
                    sup: ({ children, node, ...props }) => (
                        <sup className="text-[0.75em]" {...props}>{children}</sup>
                    ),

                    /* ── Abbreviation ── */
                    abbr: ({ children, node, ...props }) => (
                        <abbr
                            className="underline decoration-dotted decoration-foreground/40 cursor-help"
                            {...props}
                        >
                            {children}
                        </abbr>
                    ),

                    /* ── Definition List ── */
                    dl: ({ children, node, ...props }) => (
                        <dl className="my-6 space-y-4" {...props}>{children}</dl>
                    ),
                    dt: ({ children, node, ...props }) => (
                        <dt className="font-semibold text-foreground text-base" {...props}>{children}</dt>
                    ),
                    dd: ({ children, node, ...props }) => (
                        <dd className="pl-6 text-foreground/80 text-[15px] leading-[1.75] border-l-2 border-border/40 ml-2" {...props}>{children}</dd>
                    ),

                    /* ── Footnote section ── */
                    section: ({ children, className, node, ...props }) => {
                        if (className?.includes("footnotes")) {
                            return (
                                <section
                                    className="mt-12 pt-6 border-t border-border/40 text-sm text-foreground/70"
                                    {...props}
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Footnotes</p>
                                    {children}
                                </section>
                            );
                        }
                        return <section className={className} {...props}>{children}</section>;
                    },

                    /* ── Custom containers ── */
                    div: ({ children, className, node, ...props }) => {
                        if (className?.includes("custom-container")) {
                            const type = className.replace("custom-container", "").trim();
                            const colorMap: Record<string, string> = {
                                warning: "border-yellow-500/60 bg-yellow-500/5",
                                danger: "border-red-500/60 bg-red-500/5",
                                tip: "border-green-500/60 bg-green-500/5",
                                info: "border-blue-500/60 bg-blue-500/5",
                                note: "border-blue-500/60 bg-blue-500/5",
                            };
                            const colors = colorMap[type] || "border-primary/60 bg-primary/5";
                            return (
                                <div
                                    className={`my-6 rounded-xl border-l-4 px-5 py-4 ${colors}`}
                                    {...props}
                                >
                                    {children}
                                </div>
                            );
                        }
                        return <div className={className} {...props}>{children}</div>;
                    },
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
};
