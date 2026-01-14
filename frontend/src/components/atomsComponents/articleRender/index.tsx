"use client";

import { JetBrains_Mono } from "next/font/google";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Copy } from "lucide-react";
import { Button } from "@/components/shadcnUI/button";
import Image from "next/image";
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

function extractId(node: React.ReactNode): string {
    if (typeof node === "string") return slugify(node);
    if (Array.isArray(node)) return node.map(extractId).join("");
    if (typeof node === "object" && node && "props" in node) {
        return extractId(
            (node as { props: { children: React.ReactNode } }).props.children,
        );
    }
    return "";
}

function extractText(node: React.ReactNode): string {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);

    if (Array.isArray(node)) {
        return node.map(extractText).join("");
    }

    if (React.isValidElement(node)) {
        return extractText((node.props as { children?: React.ReactNode }).children);
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
    return (
        <div>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                    h1: ({ children, ...props }) => {
                        return (
                            <h1
                                id={extractId(children)}
                                {...props}
                                className="text-2xl sm:text-4xl scroll-m-30 lg:scroll-m-18 font-bold text-foreground mb-4"
                            >
                                {children}
                            </h1>
                        );
                    },
                    h2: ({ children, ...props }) => {
                        return (
                            <h2
                                id={extractId(children)}
                                className="text-lg sm:text-2xl scroll-m-30 lg:scroll-m-18 font-semibold text-foreground mt-6 mb-2"
                                {...props}
                            >
                                {children}
                            </h2>
                        );
                    },
                    h3: ({ children, ...props }) => {
                        return (
                            <h3
                                id={extractId(children)}
                                className="text-base sm:text-xl scroll-m-30 lg:scroll-m-18 font-semibold text-foreground mt-6 mb-2"
                                {...props}
                            >
                                {children}
                            </h3>
                        );
                    },
                    h4: ({ children, ...props }) => {
                        return (
                            <h4
                                id={extractId(children)}
                                className="text-sm sm:text-lg font-semibold scroll-m-30 lg:scroll-m-18 text-foreground mt-6 mb-2"
                                {...props}
                            >
                                {children}
                            </h4>
                        );
                    },
                    h5: ({ children, ...props }) => {
                        return (
                            <h5
                                id={extractId(children)}
                                className="text-xs sm:text-base font-semibold scroll-m-30 lg:scroll-m-18 text-foreground mt-6 mb-2"
                                {...props}
                            >
                                {children}
                            </h5>
                        );
                    },
                    h6: ({ children, ...props }) => {
                        return (
                            <h6
                                id={extractId(children)}
                                className="text-[10px] sm:text-sm font-semibold scroll-m-30 lg:scroll-m-18 text-foreground mt-6 mb-2"
                                {...props}
                            >
                                {children}
                            </h6>
                        );
                    },
                    p: ({ ...props }) => (
                        <p
                            className="leading-relaxed text-sm sm:text-base text-foreground font-normal hyphens-auto"
                            {...props}
                        />
                    ),
                    img: ({ src, alt, width, height, ...props }) => {
                        if (!src) return null;

                        const imageWidth =
                            typeof width === "string" ? parseInt(width, 10) : width;
                        const imageHeight =
                            typeof height === "string" ? parseInt(height, 10) : height;

                        return (
                            <Image
                                width={imageWidth || 600}
                                height={imageHeight || 400}
                                alt={alt || "Image"}
                                className="my-4 rounded-md border border-border max-w-full"
                                src={src}
                                {...props}
                            />
                        );
                    },

                    code: (props) => {
                        const { className, children, ...rest } = props;
                        const rawLang = className?.split("language-")[1];
                        const language = rawLang
                            ? rawLang.charAt(0).toUpperCase() + rawLang.slice(1)
                            : null;
                        const codeText = extractText(children);
                        const copyKey = `${language ?? "plain"}-${codeText.slice(0, 50)}`;

                        return language ? (
                            <div className={`relative my-4 py-4 ${jetBrains_Mono.className}`}>
                                <div className=" !bg-[#1a1b26] rounded-t-xl py-2 px-3 font-normal flex justify-between items-center sticky top-14">
                                    <p className="text-white font-semibold text-xs">
                                        {language}
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            handleCopy(copyKey, codeText);
                                        }}
                                        className="transition-all delay-75 justify-between px-1 !py-1 !h-fit text-xs text-white shadow-none border-none !bg-transparent  hover:text-white/80 tracking-tight"
                                    >
                                        {buttonText[copyKey] ? "Copied" : "Copy"}
                                        <Copy />
                                    </Button>
                                </div>
                                <pre
                                    className={`overflow-x-auto custom-scroll max-h-100 rounded-b-xl bg-background`}
                                >
                                    <code
                                        className={`text-xs sm:text-sm bg-[#1a1b26]  custom-scroll ${className} ${jetBrains_Mono.className}`}
                                        {...rest}
                                    >
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        ) : (
                            <code
                                className={`px-2 mx-1 text-wrap py-0.5 text-xs sm:text-sm rounded-lg text-foreground border border-border bg-foreground/5 ${jetBrains_Mono.className}`}
                                {...rest}
                            >
                                {children}
                            </code>
                        );
                    },
                    hr: ({ ...props }) => (
                        <hr className="my-6 border border-border" {...props} />
                    ),
                    ul: ({ ...props }) => (
                        <ul className="list-disc pl-6 my-4" {...props} />
                    ),
                    ol: ({ ...props }) => (
                        <ol className="list-decimal pl-6 my-4" {...props} />
                    ),
                    li: ({ ...props }) => (
                        <li
                            className="mb-2 leading-relaxed marker:text-foreground"
                            {...props}
                        />
                    ),
                    table: ({ ...props }) => (
                        <table
                            className="w-full my-6 border-collapse border border-border"
                            {...props}
                        />
                    ),
                    tbody: ({ ...props }) => (
                        <tbody className="divide-y divide-border" {...props} />
                    ),
                    tr: ({ ...props }) => (
                        <tr
                            className="hover:bg-muted-foreground/10 transition-colors border border-border"
                            {...props}
                        />
                    ),
                    td: ({ ...props }) => (
                        <td className="p-4 border border-border" {...props} />
                    ),
                    th: ({ ...props }) => (
                        <th className="p-4 border border-border" {...props} />
                    ),
                    a: ({ href, ...props }) => {
                        const isExternal =
                            typeof window !== "undefined" &&
                            href &&
                            /^https?:\/\//.test(href) &&
                            !href.includes(window.location.hostname);

                        return (
                            <a
                                className="text-foreground underline"
                                href={href}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                {...props}
                            />
                        );
                    },
                    blockquote: ({ ...props }) => (
                        <blockquote
                            className="border-l-4 border-foreground pl-4 italic text-muted-foreground"
                            {...props}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
