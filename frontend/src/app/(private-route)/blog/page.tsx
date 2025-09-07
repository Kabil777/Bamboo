"use client";

import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";


// --- Tiptap UI ---

// --- Lib ---
import "highlight.js/styles/tokyo-night-dark.css";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Underline } from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { TableKit } from '@tiptap/extension-table'
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { all, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import type { PhrasingContent, Heading, Text, InlineCode } from "mdast";
// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript"; import { remark } from "remark";

import { JetBrains_Mono } from "next/font/google";
// import "./dummy.css";
import { StarterKit } from "@tiptap/starter-kit";
import { renderToMarkdown } from "@tiptap/static-renderer";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Copy } from "lucide-react";
import { Button } from "@/components/shadcnUI/button";
const jetBrains_Mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-JetBrains_Mono",
});

import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { useAppState } from "@/hooks/ReduxHooks";
import { ArticleTableContent } from "@/components/atomsComponents";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractTextFromNode(node: PhrasingContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "inlineCode") return node.value;
  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map(extractTextFromNode).join("");
  }
  return "";
}
function extractId(node: React.ReactNode): string {
  if (typeof node === "string") return slugify(node);
  if (Array.isArray(node)) return node.map(extractId).join("");
  if (typeof node === "object" && node && "props" in node) {
    return extractId((node as any).props.children);
  }
  return "";
}
export function extractToc(markdown: string) {
  const tree = unified().use(remarkParse).parse(markdown);

  const toc: { depth: number; value: string; id: string }[] = [];

  visit(tree, "heading", (node: Heading) => {
    const text = node.children.map(extractTextFromNode).join(" ").trim();
    if (!text) return;

    const id = slugify(text);
    toc.push({ depth: node.depth, value: text, id });
  });
  return toc;
}
export default function Blog() {
  const lowlight = createLowlight(all);
  lowlight.register("html", html);
  lowlight.register("css", css);
  lowlight.register("js", js);
  lowlight.register("ts", ts);

  const extensions = [
    StarterKit,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Underline,
    TaskList,
    TaskItem.configure({ nested: true }),
    Highlight.configure({ multicolor: true }),
    Image,
    Typography,
    Superscript,
    Subscript,
    Selection,
    TableKit,
    ImageUploadNode.configure({
      accept: "image/*",
      limit: 3,
      onError: (error) => console.error("Upload failed:", error),
    }),
    TrailingNode,
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https"],
      shouldAutoLink: (url) => {
        try {
          const parsedUrl = url.includes(":")
            ? new URL(url)
            : new URL(`https://${url}`);
          const disallowedDomains = [
            "example-no-autolink.com",
            "another-no-autolink.com",
          ];
          const domain = parsedUrl.hostname;

          return !disallowedDomains.includes(domain);
        } catch {
          return false;
        }
      },
    }),
  ];

  const md = renderToMarkdown({
    content: useAppState((state) => state.postReducer.content),
    extensions,
  });

  const toc = extractToc(md);
  return (
    <>
      <div className="container mx-auto bg-background">
        <main className="grid grid-cols-1 lg:grid-cols-4 p-5 gap-10 scroll-smooth relative">
          <article className="prose max-w-none flex-1 col-span-1 lg:col-span-3 reactMarkdown order-2 lg:order-1">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
              components={{
                h1: ({ children, ...props }) => {
                  return (
                    <h1
                      id={extractId(children)}
                      {...props}
                      className="text-2xl sm:text-4xl scroll-m-36 font-bold text-foreground mb-4"
                    >
                      {children}
                    </h1>
                  );
                },
                h2: ({ children, ...props }) => {
                  return (
                    <h2
                      id={extractId(children)}
                      className="text-lg sm:text-2xl scroll-m-36 font-semibold text-foreground mt-6 mb-2"
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
                      className="text-base sm:text-xl scroll-m-36 font-semibold text-foreground mt-6 mb-2"
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
                      className="text-sm sm:text-lg font-semibold scroll-m-36 text-foreground mt-6 mb-2"
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
                      className="text-xs sm:text-base font-semibold scroll-m-36 text-foreground mt-6 mb-2"
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
                      className="text-[10px] sm:text-sm font-semibold scroll-m-36 text-foreground mt-6 mb-2"
                      {...props}
                    >
                      {children}
                    </h6>
                  );
                },
                p: ({ ...props }) => (
                  <p
                    className="leading-relaxed text-sm sm:text-base text-foreground font-normal mb-4 hyphens-auto"
                    {...props}
                  />
                ),
                code: (props) => {
                  const { className, children, ...rest } = props;
                  const rawLang = className?.split("language-")[1];
                  const language = rawLang
                    ? rawLang.charAt(0).toUpperCase() + rawLang.slice(1)
                    : null;

                  return (language) ? (
                    <div className={`relative mb-4 ${jetBrains_Mono.className}`}>
                      <div className="bg-[#1a1b26] rounded-t-xl py-2 px-3 font-normal flex justify-between items-center sticky top-15 border-border border-b">
                        <p className="text-white text-xs">{language}</p>
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            const codeElement = e.currentTarget.closest('.relative')?.querySelector('code');
                            const textContent = codeElement?.textContent || '';
                            navigator.clipboard.writeText(textContent.trim());
                          }}
                          className="transition-all delay-75 justify-between px-1 !py-1 !h-fit text-xs text-muted-foreground border border-muted-foreground bg-[oklch(0.269 0 0)] rounded-md hover:bg-[oklch(0.269 0 0)] hover:text-white tracking-tight "
                        >
                          Copy
                          <Copy />
                        </Button>
                      </div>
                      <pre
                        className={`overflow-x-auto custom-scroll max-h-100 rounded-b-xl bg-background`}
                      >
                        <code
                          className={`text-xs sm:text-sm custom-scroll ${className} ${jetBrains_Mono.className}`}
                          {...rest}
                        >
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code
                      className={`px-2 mx-1 text-wrap py-0.5 text-sm sm:text-base rounded-lg text-foreground border border-border bg-foreground/5 ${jetBrains_Mono.className}`}
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
                    className="hover:bg-muted-foreground/10 transition-colors"
                    {...props}
                  />
                ),
                td: ({ ...props }) => (
                  <td className="p-4 border-b border-border" {...props} />
                ),
                th: ({ ...props }) => (
                  <th className="p-4 border-b border-border" {...props} />
                ),
                a: ({ ...props }) => (
                  <a
                    className="text-foreground underline"
                    target="_blank"
                    {...props}
                  />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="border-l-4 border-foreground pl-4 italic my-4 text-muted-foreground rounded-md"
                    {...props}
                  />
                ),
              }}
            >
              {md}
            </ReactMarkdown>
          </article>
          {toc.length > 0 && (
            <aside className="w-full col-span-1 shrink-0 order-1 lg:order-2 lg:sticky lg:top-31 self-start border-l-2 border-border pl-4 py-2 overflow-x-hidden max-h-150 overflow-y-auto">
              <h2 className="text-lg font-bold mb-2">Table of Contents</h2>
              <ArticleTableContent toc={toc} />
            </aside>
          )}
        </main>
      </div>
    </>
  );
}
