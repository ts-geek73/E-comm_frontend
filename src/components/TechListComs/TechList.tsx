import React, { useState } from "react";
import { TechCard } from ".";

export interface ITech {
  title: string;
  description: string;
}

export const techList: ITech[] = [
  {
    title: "React",
    description: "Building interactive user interfaces",
  },
  {
    title: "Nextjs",
    description: "React framework for server-side rendering and static generation",
  },
  {
    title: "Nodejs",
    description: "Server-side JavaScript runtime",
  },
  {
    title: "Android",
    description: "Mobile application development",
  },
  {
    title: "Python",
    description: "Versatile programming language for web, data science, and AI",
  },
  {
    title: "TypeScript",
    description: "A typed superset of JavaScript",
  },
  {
    title: "JavaScript",
    description: "The core language of the web",
  },
  {
    title: "Java",
    description: "A popular, object-oriented programming language",
  },
  {
    title: "Docker",
    description: "Platform for containerizing applications",
  },
  { title: "React", description: "Building interactive user interfaces" },
  { title: "Next.js", description: "React framework for production" },
  { title: "Node.js", description: "JavaScript runtime for backend" },
  { title: "MongoDB", description: "NoSQL document database" },
  { title: "TypeScript", description: "Typed superset of JavaScript" },
  { title: "GraphQL", description: "API query language" },
  { title: "Tailwind CSS", description: "Utility-first CSS framework" },
  { title: "Redux", description: "State management for React" },
  { title: "Express", description: "Web framework for Node.js" },
  { title: "Firebase", description: "Backend-as-a-Service by Google" },
  {
    title: "Kubernetes",
    description: "Container orchestration system",
  },
  {
    title: "PostgreSQL",
    description: "Powerful open-source relational database",
  },
  {
    title: "MongoDB",
    description: "NoSQL document database",
  },
  {
    title: "Sass",
    description: "CSS pre-processor",
  },
  {
    title: "Figma",
    description: "Collaborative interface design tool",
  },
  {
    title: "Git",
    description: "Version control system",
  },
  {
    title: "GitHub",
    description: "Hosting service for Git repositories",
  },
  {
    title: "VS Code",
    description: "Lightweight but powerful code editor",
  },
  {
    title: "Terraform",
    description: "Infrastructure as Code tool",
  },
  {
    title: "GraphQL",
    description: "Query language for your API",
  },
  {
    title: "React",
    description: "Building interactive user interfaces",
  },
  {
    title: "Nextjs",
    description: "React framework for server-side rendering and static generation",
  },
  {
    title: "Nodejs",
    description: "Server-side JavaScript runtime",
  },
  {
    title: "Android",
    description: "Mobile application development",
  },
  {
    title: "Python",
    description: "Versatile programming language for web, data science, and AI",
  },
  {
    title: "TypeScript",
    description: "A typed superset of JavaScript",
  },
  {
    title: "JavaScript",
    description: "The core language of the web",
  },
  {
    title: "Java",
    description: "A popular, object-oriented programming language",
  },
  {
    title: "Docker",
    description: "Platform for containerizing applications",
  },
  { title: "React", description: "Building interactive user interfaces" },
  { title: "Next.js", description: "React framework for production" },
  { title: "Node.js", description: "JavaScript runtime for backend" },
  { title: "MongoDB", description: "NoSQL document database" },
  { title: "TypeScript", description: "Typed superset of JavaScript" },
  { title: "GraphQL", description: "API query language" },
  { title: "Tailwind CSS", description: "Utility-first CSS framework" },
  { title: "Redux", description: "State management for React" },
  { title: "Express", description: "Web framework for Node.js" },
  { title: "Firebase", description: "Backend-as-a-Service by Google" },
  {
    title: "Kubernetes",
    description: "Container orchestration system",
  },
  {
    title: "PostgreSQL",
    description: "Powerful open-source relational database",
  },
  {
    title: "MongoDB",
    description: "NoSQL document database",
  },
  {
    title: "Sass",
    description: "CSS pre-processor",
  },
  {
    title: "Figma",
    description: "Collaborative interface design tool",
  },
  {
    title: "Git",
    description: "Version control system",
  },
  {
    title: "GitHub",
    description: "Hosting service for Git repositories",
  },
  {
    title: "VS Code",
    description: "Lightweight but powerful code editor",
  },
  {
    title: "Terraform",
    description: "Infrastructure as Code tool",
  },
  {
    title: "GraphQL",
    description: "Query language for your API",
  },
];

  export const TechLists = [...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList,...techList, ...techList, ...techList, ]

export const TechList = () => {
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties | null>(null);

  const handleHover = (rect: DOMRect) => {
    // rect top and left it according to view Port, so add scroll offset for true position

    setHighlightStyle({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
      opacity: 1,
    });
  };

  const handleLeave = () => {
    setHighlightStyle((prev) => (prev ? { ...prev, opacity: 0 } : null));
  };
  return (
    <div className="flex justify-center items-center">
      {highlightStyle && (
        <span
          className="absolute z-0 rounded-xl bg-blue-500 transition-all duration-300 ease-out"
          style={highlightStyle}
        />
      )}

      <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-8 z-10">
        {techList.map((tech, i) => (
          <TechCard
            key={i}
            title={tech.title}
            description={tech.description}
            onHover={handleHover}
            onLeave={handleLeave}
          />
        ))}
      </div>
    </div>
  );
};
