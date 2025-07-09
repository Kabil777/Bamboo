'use client';
import { useParams } from "next/navigation";
import React from "react";
const cardData = [
  { id: 1, title: "React", updated: "Jan 2025" , description: "A JavaScript library for building user interfaces" },
  { id: 2, title: "Vue", updated: "Feb 2025", description: "A progressive JavaScript framework for building user interfaces" },
  { id: 3, title: "Angular", updated: "Mar 2025", description: "A platform for building mobile and desktop web applications" },
  { id: 4, title: "Svelte", updated: "Apr 2025", description: "A radical new approach to building user interfaces" },
  { id: 5, title: "Next.js", updated: "May 2025", description: "The React Framework for Production" },
  { id: 6, title: "Bamboo", updated: "Jun 2025", description: "A modern CSS framework" },
  { id: 7, title: "Tailwind CSS", updated: "Jul 2025", description: "A utility-first CSS framework" },
  { id: 8, title: "Framer Motion", updated: "Aug 2025", description: "A library for creating animations in React" },
  { id: 9, title: "TypeScript", updated: "Sep 2025", description: "A superset of JavaScript that adds static types" },
  { id: 10, title: "GraphQL", updated: "Oct 2025", description: "A query language for your API" },
  { id: 11, title: "Node.js", updated: "Nov 2025", description: "JavaScript runtime built on Chrome's V8 engine" },
  { id: 12, title: "Express.js", updated: "Dec 2025", description: "Fast, unopinionated, minimalist web framework for Node.js" },
  { id: 13, title: "MongoDB", updated: "Jan 2026", description: "A document database with the scalability and flexibility that you want" },
  { id: 14, title: "PostgreSQL", updated: "Feb 2026", description: "The world's most advanced open source relational database" },
  { id: 15, title: "Redis", updated: "Mar 2026", description: "In-memory data structure store, used as a database, cache, and message broker" },
  { id: 16, title: "Docker", updated: "Apr 2026", description: "Platform for developing, shipping, and running applications in containers" },
  { id: 17, title: "Kubernetes", updated: "May 2026", description: "Open-source system for automating deployment, scaling, and management of containerized applications" },
  { id: 18, title: "GraphQL", updated: "Jun 2026", description: "A query language for your API" },
  { id: 19, title: "Apollo Client", updated: "Jul 2026", description: "A comprehensive state management library for JavaScript" },
  { id: 20, title: "Jest", updated: "Aug 2026", description: "A delightful JavaScript testing framework" },
  { id: 21, title: "Cypress", updated: "Sep 2026", description: "A next generation front end testing tool" },
  { id: 22, title: "Storybook", updated: "Oct 2026", description: "UI component workshop for React, Vue, and Angular" },
  { id: 23, title: "Webpack", updated: "Nov 2026", description: "A static module bundler for modern JavaScript applications" },
  { id: 24, title: "Babel", updated: "Dec 2026", description: "A JavaScript compiler" },
  { id: 25, title: "ESLint", updated: "Jan 2027", description: "A static code analysis tool for identifying problematic patterns in JavaScript code" },
];
export default function DocsReadPage() {

    const { id } = useParams();
    const numericId = typeof id === "string" ? parseInt(id, 10) : Array.isArray(id) ? parseInt(id[0], 10) : NaN;

    if (isNaN(numericId) || numericId < 1 || numericId > cardData.length) {
      return <div>Invalid document ID.</div>;
    }

    return (
      <>
        <h1 className="text-2xl font-bold">{cardData[numericId - 1].title}</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {cardData[numericId - 1].updated}

        </p>
        <p className="mt-4 text-base text-accent-foreground">
          {cardData[numericId - 1].description || "No description available."}
        </p>
        <div className="mt-6">
            <p className="text-lg font-semibold">Content of {cardData[numericId - 1].title}:</p>
            <p className="mt-2 text-base text-muted-foreground">
                {`This is the content for ${cardData[numericId - 1].title}. It contains detailed information about the topic, including examples, best practices, and more.`}
            </p>
        </div>
      </>
    )
}
