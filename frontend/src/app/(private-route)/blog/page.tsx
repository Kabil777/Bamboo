"use client";
import StarterKit from "@tiptap/starter-kit";
import "./dummy.css";

import { renderToMarkdown } from "@tiptap/static-renderer";
import * as React from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/tokyo-night-dark.css";
import { useAppState } from "@/hooks/ReduxHooks";

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

  return (
    <main className="flex flex-col md:flex-row p-5 md:py-10 md:px-24 gap-10">
      <article className="prose max-w-none flex-1 reactMarkdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            h1: ({ node, children, ...props }) => {
              const text = String(children);
              return (
                <h1 id={slugify(text)} {...props}>
                  {children}
                </h1>
              );
            },
            h2: ({ node, children, ...props }) => {
              const text = String(children);
              return (
                <h2 id={slugify(text)} {...props}>
                  {children}
                </h2>
              );
            },
            h3: ({ node, children, ...props }) => {
              const text = String(children);
              return (
                <h3 id={slugify(text)} {...props}>
                  {children}
                </h3>
              );
            },
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
  );
}
