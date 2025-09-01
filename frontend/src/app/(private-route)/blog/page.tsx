"use client";



// --- Tiptap Core Extensions ---
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

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
import { useAppState } from "@/hooks/ReduxHooks";
import { Copy } from "lucide-react";
import { Button } from "@/components/shadcnUI/button";
const jetBrains_Mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-JetBrains_Mono",
});

export default function Blog() {
  const data = useAppState((state) => state.postReducer.content);
  const md = renderToMarkdown({
    content: data,
    extensions: [
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
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
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
    ],
  });
  console.log(md);
  return (
    <>
      <main className="container p-5 md:py-10 md:px-24">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}


          components={{
            h1: ({ ...props }) => <h1 className="text-3xl font-bold text-foreground mb-4" {...props} />,
            h2: ({ ...props }) => <h2 className="text-2xl font-semibold text-foreground mt-6 mb-2" {...props} />,
            h3: ({ ...props }) => <h3 className="text-xl font-semibold text-foreground mt-6 mb-2" {...props} />,
            h4: ({ ...props }) => <h4 className="text-lg font-semibold text-foreground mt-6 mb-2" {...props} />,
            h5: ({ ...props }) => <h5 className="text-md font-semibold text-foreground mt-6 mb-2" {...props} />,
            h6: ({ ...props }) => <h6 className="text-sm font-semibold text-foreground mt-6 mb-2" {...props} />,
            p: ({ ...props }) => <p className="leading-relaxed text-foreground font-normal mb-4 hyphens-auto" {...props} />,
            code: (props) => {
              const { className, children, ...rest } = props;
              const language = className?.split("language-")[1];
              return (language) ? (
                <div className={`relative mb-4 ${jetBrains_Mono.className}`}>
                  <div className="bg-[#1a1b26] rounded-t-xl py-3 px-3 font-normal flex justify-between items-center sticky top-15 border-border border-b">
                    <p className="text-white">{language}</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(children + "");

                      }}
                      className="transition-all delay-75 justify-between px-1 !py-1 !h-fit text-xs text-muted-foreground border border-muted-foreground bg-[oklch(0.269 0 0)] rounded-md hover:bg-[oklch(0.269 0 0)] hover:text-white tracking-tight "
                    >
                      Copy<Copy />
                    </Button>
                  </div>
                  <pre className={`overflow-x-auto custom-scroll rounded-b-xl bg-background`}>
                    <code className={`text-sm custom-scroll ${className} ${jetBrains_Mono.className}`} {...rest}>
                      {children}
                    </code>
                  </pre>
                </div>
              ) : (
                <code className={`px-2 rounded-lg bg-[#0f16241d] text-[#23252ade] ${jetBrains_Mono.className}`} {...rest}>
                  {children}
                </code>
              );
            },
            hr: ({ ...props }) => <hr className="my-6 border border-border" {...props} />,
            ul: ({ ...props }) => (
              <ul className="list-disc pl-6 my-4" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="list-decimal pl-6 my-4" {...props} />
            ),
            li: ({ ...props }) => (
              <li className="mb-2 leading-relaxed marker:text-foreground" {...props} />
            ),
            table: ({ ...props }) => <table className="w-full my-6 border-collapse border border-border" {...props} />,
            tbody: ({ ...props }) => <tbody className="divide-y divide-border" {...props} />,
            tr: ({ ...props }) => <tr className="hover:bg-muted-foreground/10 transition-colors" {...props} />,
            td: ({ ...props }) => <td className="p-4 border-b border-border" {...props} />,
            th: ({ ...props }) => <th className="p-4 border-b border-border" {...props} />,
            a: ({ ...props }) => <a className="text-foreground underline" target="_blank" {...props} />,
            blockquote: ({ ...props }) => <blockquote className="border-l-4 border-foreground pl-4 italic my-4 text-muted-foreground rounded-md" {...props} />,
            video: ({ ...props }) => <video className="w-full my-4" controls {...props} />


          }}
        >
          {md}
        </ReactMarkdown>

      </main>
    </>
  );
}
