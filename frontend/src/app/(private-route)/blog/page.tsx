"use client";


import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---

// --- Lib ---
import "highlight.js/styles/tokyo-night-dark.css";

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

const springBootJson = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [
        { type: "text", text: "Spring Boot Dependency Injection Examples" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "This is a " },
        { type: "text", text: "Markdown", marks: [{ type: "bold" }] },
        {
          type: "text",
          text: " block demonstrating code highlighting for Spring Boot.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Dependency Injection (DI) decouples object creation from business logic, making applications easier to test, maintain, and extend.",
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "1. IOC with XML configuration" }],
    },
    {
      type: "codeBlock",
      attrs: { language: "xml" },
      content: [
        {
          type: "text",
          text: `<!-- beans.xml -->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="myService" class="com.example.MyService"/>
    <bean id="myController" class="com.example.MyController">
        <property name="service" ref="myService"/>
    </bean>

</beans>`,
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [
        { type: "text", text: "2. Java Configuration with @Configuration" },
      ],
    },
    {
      type: "codeBlock",
      attrs: { language: "java" },
      content: [
        {
          type: "text",
          text: `@Configuration
public class AppConfig {

    @Bean
    public MyService myService() {
        return new MyService();
    }

    @Bean
    public MyController myController(MyService service) {
        return new MyController(service);
    }
}`,
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "3. Using @Autowired for DI" }],
    },
    {
      type: "codeBlock",
      attrs: { language: "java" },
      content: [
        {
          type: "text",
          text: `@Component
public class MyController {

    private final MyService service;

    @Autowired
    public MyController(MyService service) {
        this.service = service;
    }

    public void doSomething() {
        service.perform();
    }
}`,
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [
        { type: "text", text: "4. Using @Qualifier for Multiple Beans" },
      ],
    },
    {
      type: "codeBlock",
      attrs: { language: "java" },
      content: [
        {
          type: "text",
          text: `@Service("emailService")
public class EmailService implements NotificationService {
    public void send(String msg) {
        System.out.println("Email: " + msg);
    }
}

@Service("smsService")
public class SmsService implements NotificationService {
    public void send(String msg) {
        System.out.println("SMS: " + msg);
    }
}

@Component
public class NotificationController {
    private final NotificationService service;

    @Autowired
    public NotificationController(@Qualifier("smsService") NotificationService service) {
        this.service = service;
    }
}`,
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "5. Constructor vs Field Injection" }],
    },
    {
      type: "codeBlock",
      attrs: { language: "java" },
      content: [
        {
          type: "text",
          text: `// Constructor Injection (Recommended)
@Component
public class OrderController {
    private final OrderService service;

    @Autowired
    public OrderController(OrderService service) {
        this.service = service;
    }
}

// Field Injection (Not Recommended)
@Component
public class LegacyController {
    @Autowired
    private LegacyService service;
}`,
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Conclusion" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Spring Boot provides flexible ways to implement DI. Prefer constructor injection for better testability, and use @Qualifier when multiple beans of the same type exist.",
        },
      ],
    },
  ],
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractToc(markdown: string) {
  const tree = unified().use(remarkParse).parse(markdown);

  const toc: { depth: number; value: string; id: string }[] = [];
  visit(tree, "heading", (node: any) => {
    const text = node.children
      .filter((c: any) => c.type === "text" || c.type === "inlineCode")
      .map((c: any) => c.value)
      .join(" ");

    const id = slugify(text);
    toc.push({ depth: node.depth, value: text, id });
  });
  console.log(toc);
  return toc;
}

export default function Blog() {
  const extensions = [StarterKit];
  const md = renderToMarkdown({ content: springBootJson, extensions });

  const toc = extractToc(md);
  console.log(md);
  return (
   <>
      <main className="flex flex-col md:flex-row p-5 md:py-10 md:px-24 gap-10">
        <article className="prose max-w-none flex-1 reactMarkdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              h1: ({ children, ...props }) => {
                const text = String(children);
                return (
                  <h1 id={slugify(text)} {...props}
                  className="text-3xl font-bold text-foreground mb-4">
                    {children}
                  </h1>
                );
              },
              h2: ({ children, ...props }) => {
                const text = String(children);
                return (
                  <h2
                    id={slugify(text)}
                    className="text-2xl font-semibold text-foreground mt-6 mb-2"
                    {...props}
                  >
                    {children}
                  </h2>
                );
              },
              h3: ({ children, ...props }) => {
                const text = String(children);
                return (
                  <h3
                    id={slugify(text)}
                    className="text-xl font-semibold text-foreground mt-6 mb-2"
                    {...props}
                  >
                    {children}
                  </h3>
                );
              },
              h4: ({ children, ...props }) => {
                const text = String(children);
                return (
                  <h4
                    id={slugify(text)}
                    className="text-lg font-semibold text-foreground mt-6 mb-2"
                    {...props}
                  >
                    {children}
                  </h4>
                );
              },
              h5: ({ children, ...props }) => {
                const text = String(children);
                return (
                  <h5
                    id={slugify(text)}
                    className="text-md font-semibold text-foreground mt-6 mb-2"
                    {...props}
                  >
                    {children}
                  </h5>
                );
              },
              h6: ({ children, ...props }) => {
                const text = String(children);
                return (
                  <h6
                    id={slugify(text)}
                    className="text-sm font-semibold text-foreground mt-6 mb-2"
                    {...props}
                  >
                    {children}
                  </h6>
                );
              },
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
            }}
          >
            {md}
          </ReactMarkdown>
        </article>
        <aside className="w-64 shrink-0">
          <h2 className="text-lg font-bold mb-2">Table of Contents</h2>
          <ul className="space-y-1 text-sm">
            {toc.map((item, i) => (
              <li key={i} style={{ marginLeft: (item.depth - 1) * 16 }}>
                <a href={`#${item.id}`}>{item.value}</a>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </>
  );
}
