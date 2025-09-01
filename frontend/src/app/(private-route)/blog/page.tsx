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

const savedJson = {
  type: "doc",
  content: [
    { type: "paragraph", content: [{ type: "text", text: "Hello again 🚀" }] },
  ],
};
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
  ],
};
export default function Blog() {
  const data = useAppState((state) => state.postReducer.content);
  const extensions = [StarterKit];
  const md = renderToMarkdown({ content: data, extensions });
  console.log(md);

  return (
    <>
      <main className="flex flex-col items-center justify-between p-5 md:py-10 md:px-24 reactMarkdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
        >
          {md}
        </ReactMarkdown>
      </main>
    </>
  );
}
