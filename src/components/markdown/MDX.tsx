"use client";

import Markdown from "markdown-to-jsx";
import Image from "next/image";
import React, { ReactNode } from "react";

export interface MDXProps {
  code: string;
  className?: string;
}

export interface MDXComponentProps {
  children: ReactNode;
  className?: string;
  href?: string;
  src?: string;
}

const sanitizeString = (children: ReactNode): string => {
  if (!children) return "";
  return children
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\p{Emoji}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace("--", "-")
    .replace(/-$/, "");
};

const MDX: React.FC<MDXProps> = ({ code, className }) => {
  return (
    <Markdown
      className={`${className || ""}`}
      options={{
        overrides: {
          table: {
            component: ({ children }: MDXComponentProps) => (
              <div>
                <table>{children}</table>
              </div>
            ),
          },
          thead: {
            component: ({ children }: MDXComponentProps) => (
              <thead>{children}</thead>
            ),
          },
          tbody: {
            component: ({ children }: MDXComponentProps) => (
              <tbody>{children}</tbody>
            ),
          },
          tr: {
            component: ({ children }: MDXComponentProps) => <tr>{children}</tr>,
          },
          th: {
            component: ({ children }: MDXComponentProps) => <th>{children}</th>,
          },
          td: {
            component: ({ children }: MDXComponentProps) => <td>{children}</td>,
          },
          blockquote: {
            component: ({ children }: MDXComponentProps) => (
              <blockquote>
                <span>“</span>
                {children}
              </blockquote>
            ),
          },
          a: {
            component: ({ href = "", children }: MDXComponentProps) => {
              const isExternal =
                href.startsWith("http") &&
                !href.startsWith("https://techstaunch.com");
              return (
                <a
                  href={href}
                  target={isExternal ? "_blank" : "_self"}
                  aria-label={
                    isExternal
                      ? String(children) + " (opens in a new tab)"
                      : String(children)
                  }
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              );
            },
          },
          h1: {
            component: ({ children }: MDXComponentProps) => {
              const modifiedId = sanitizeString(children);
              return (
                <h1 id={modifiedId} className="headLink">
                  {children}
                </h1>
              );
            },
          },
          h2: {
            component: ({ children }: MDXComponentProps) => {
              const modifiedId = sanitizeString(children);
              return (
                <h2 id={modifiedId} className="headLink">
                  {children}
                </h2>
              );
            },
          },
          h3: {
            component: ({ children }: MDXComponentProps) => {
              const modifiedId = sanitizeString(children);
              return (
                <h3 id={modifiedId} className="headLink">
                  {children}
                </h3>
              );
            },
          },
          h4: {
            component: ({ children }: MDXComponentProps) => {
              const modifiedId = sanitizeString(children);
              return (
                <h4 id={modifiedId} className="headLink">
                  {children}
                </h4>
              );
            },
          },
          img: {
            component: ({ src = "" }: MDXComponentProps) => {
              const imgUrl = src.includes("?") ? src.split("?")[0] : src;
              return (
                <Image
                  height={3000}
                  width={3000}
                  quality={100}
                  src={imgUrl}
                  alt="blog-sub-image"
                  loading="lazy"
                />
              );
            },
          },
          p: {
            component: ({ children }: MDXComponentProps) => <p>{children}</p>,
          },
          ul: {
            component: ({ children }: MDXComponentProps) => <ul>{children}</ul>,
          },
          ol: {
            component: ({ children }: MDXComponentProps) => (
              <ol type="a">{children}</ol>
            ),
          },
          li: {
            component: ({ children }: MDXComponentProps) => (
              <li className="text-[#334155]">{children}</li>
            ),
          },
          strong: {
            component: ({ children }: MDXComponentProps) => (
              <strong className="text-[#334155] font-bold">{children}</strong>
            ),
          },
        },
      }}
    >
      {code}
    </Markdown>
  );
};

export default MDX;
