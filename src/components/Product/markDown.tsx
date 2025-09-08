"use client";

import { Check, ChevronDown, Copy, Link } from "lucide-react";
import Markdown from "markdown-to-jsx";
import Image from "next/image";
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

export const scrollToHeading = (id: string, offset = 0) => {
  const element = document.getElementById(id);
  if (element) {
    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - 100 - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

export const sanitizeString = (children: ReactNode): string => {
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

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface MarkdownConverterRef {
  tableOfContents: TocItem[];
}

export interface MarkdownConverterProps {
  markdownText: string;
  onTocChange?: (toc: TocItem[]) => void;
}

export interface MDXComponentProps {
  children?: ReactNode & { key: string; props: { children: string[] } };
  className?: string;
  href?: string;
  src?: string;
  alt?: string;
  question?: string;
}

export const CodeBlock = ({ children, className }: MDXComponentProps) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(String(children));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const displayLanguage = className?.replace("lang-", "") || "text";

  if (!className) {
    return (
      <code className="rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-3 py-1.5 text-sm font-mono text-rose-700 dark:text-rose-300 shadow-sm">
        {typeof children === "string" ? children : String(children)}
      </code>
    );
  }

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl shadow-2xl">
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
        <span className="text-sm font-semibold text-gray-300 tracking-wide uppercase">
          {displayLanguage}
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 rounded-lg bg-gray-700/50 px-3 py-1.5 text-xs text-gray-300 transition-all duration-200 hover:bg-gray-600 hover:text-white hover:shadow-lg"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto bg-gradient-to-br from-gray-900 to-black p-6 text-sm text-gray-100 leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
};

const MarkdownConverter = forwardRef<
  MarkdownConverterRef,
  MarkdownConverterProps
>(({ markdownText, onTocChange }, ref) => {
  const [isOpenAccordion, setIsOpenAccordion] = useState(false);

  const processedMarkdown = useMemo(() => {
    if (!markdownText) return "";

    // Extract link references
    const linkRefRegex = /^\[([^\]]+)\]:\s*(.+)$/gm;
    const references: Record<string, string> = {};
    let match;
    while ((match = linkRefRegex.exec(markdownText)) !== null) {
      references[match[1]] = match[2].trim();
    }

    // Process badges
    const badgeRegex = /\[!\[([^\]]*)\]\[([^\]]+)\]\]\[([^\]]+)\]/g;
    const withBadges = markdownText.replace(
      badgeRegex,
      (_, altText, badgeName, linkName) => {
        const badgeUrl = references[badgeName];
        const linkUrl = references[linkName];
        return badgeUrl && linkUrl
          ? `[![${altText}](${badgeUrl})](${linkUrl})`
          : _;
      }
    );

    // Clean markdown - remove link references
    return withBadges.replace(/^\[([^\]]+)\]:\s*.+$/gm, "").trim();
  }, [markdownText]);

  const tableOfContents = useMemo(() => {
    if (!markdownText) return [];

    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const toc: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(markdownText)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = sanitizeString(text);
      toc.push({ id, text, level });
    }

    return toc;
  }, [markdownText]);

  useImperativeHandle(ref, () => ({
    scrollToHeading,
    tableOfContents,
  }));

  useEffect(() => {
    onTocChange?.(tableOfContents);
  }, [tableOfContents, onTocChange]);

  return (
    <Markdown
      className="prose prose-lg max-w-none"
      options={{
        overrides: {
          CallToAction: {
            component: ({ children }: MDXComponentProps) => (
              <div className="my-8 relative overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 shadow-lg backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 p-2 bg-blue-500/10 rounded-lg">
                    <svg
                      className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="font-semibold text-blue-900 dark:text-blue-100">
                    {children}
                  </div>
                </div>
              </div>
            ),
          },

          Accordion: {
            component: ({ question, children }: MDXComponentProps) => {
              return (
                <div className="my-6 overflow-hidden rounded-xl border border-gray-200/50 bg-white/80 dark:border-gray-700/50 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm">
                  <button
                    onClick={() => setIsOpenAccordion(!isOpenAccordion)}
                    className="flex w-full items-center justify-between p-6 text-left transition-all duration-200 hover:bg-gray-50/80 dark:hover:bg-gray-700/50"
                  >
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                      {question}
                    </span>
                    <div
                      className={`transition-transform duration-200 ${isOpenAccordion ? "rotate-180" : ""}`}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </div>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${isOpenAccordion ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
                  >
                    <div className="border-t border-gray-200/50 p-6 dark:border-gray-700/50">
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {children}
                      </div>
                    </div>
                  </div>
                </div>
              );
            },
          },

          code: {
            component: CodeBlock,
          },

          table: {
            component: ({ children }: MDXComponentProps) => (
              <div className="my-8 overflow-hidden rounded-xl shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full bg-white dark:bg-gray-800">
                    {children}
                  </table>
                </div>
              </div>
            ),
          },

          thead: {
            component: ({ children }: MDXComponentProps) => (
              <thead className="bg-gray-100 dark:bg-gray-700">{children}</thead>
            ),
          },

          tbody: {
            component: ({ children }: MDXComponentProps) => (
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {children}
              </tbody>
            ),
          },

          tr: {
            component: ({ children }: MDXComponentProps) => (
              <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                {children}
              </tr>
            ),
          },

          th: {
            component: ({ children }: MDXComponentProps) => (
              <th className="px-6 py-4 text-left font-semibold text-sm tracking-wider uppercase text-gray-700 dark:text-gray-300">
                {children}
              </th>
            ),
          },

          td: {
            component: ({ children }: MDXComponentProps) => (
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {children}
              </td>
            ),
          },

          blockquote: {
            component: ({ children }: MDXComponentProps) => (
              <blockquote className="relative rounded-2xl p-8 italic text-gray-700 dark:text-gray-200 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-l-4 border-purple-400">
                <div className="absolute top-4 left-4 text-6xl text-purple-300/30 font-serif leading-none">{`"`}</div>
                <div className="absolute bottom-4 right-4 text-6xl text-purple-300/30 font-serif leading-none">{`"`}</div>
                <div className="relative z-10 text-lg leading-relaxed">
                  {children}
                </div>
              </blockquote>
            ),
          },

          a: {
            component: ({ href = "", children }: MDXComponentProps) => {
              const isExternal = href.startsWith("http");
              return (
                <a
                  href={href}
                  target={isExternal ? "_blank" : "_self"}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="font-semibold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:underline decoration-2 underline-offset-2 inline-block"
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
                <h1
                  id={modifiedId}
                  className="group relative my-8 text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent scroll-mt-20"
                >
                  {children}
                  <button
                    onClick={() => scrollToHeading(modifiedId, 80)}
                    className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                    aria-label="Link to this heading"
                  >
                    <Link className="h-6 w-6 text-blue-500" />
                  </button>
                </h1>
              );
            },
          },

          h2: {
            component: ({ children }: MDXComponentProps) => {
              const modifiedId = sanitizeString(children);
              return (
                <h2
                  id={modifiedId}
                  className="group relative my-6 text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent scroll-mt-20"
                >
                  {children}
                  <button
                    onClick={() => scrollToHeading(modifiedId, 80)}
                    className="absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                    aria-label="Link to this heading"
                  >
                    <Link className="h-5 w-5 text-blue-500" />
                  </button>
                </h2>
              );
            },
          },

          h3: {
            component: ({ children }: MDXComponentProps) => {
              const modifiedId = sanitizeString(children);
              return (
                <h3
                  id={modifiedId}
                  className="group relative my-5 text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 scroll-mt-20"
                >
                  {children}
                  <button
                    onClick={() => scrollToHeading(modifiedId, 80)}
                    className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                    aria-label="Link to this heading"
                  >
                    <Link className="h-5 w-5 text-blue-500" />
                  </button>
                </h3>
              );
            },
          },

          h4: {
            component: ({ children }: MDXComponentProps) => {
              const modifiedId = sanitizeString(children);
              return (
                <h4
                  id={modifiedId}
                  className="group relative my-4 text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 scroll-mt-20"
                >
                  {children}
                  <button
                    onClick={() => scrollToHeading(modifiedId, 80)}
                    className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                    aria-label="Link to this heading"
                  >
                    <Link className="h-4 w-4 text-blue-500" />
                  </button>
                </h4>
              );
            },
          },

          h5: {
            component: ({ children }: MDXComponentProps) => {
              const modifiedId = sanitizeString(children);
              return (
                <h5
                  id={modifiedId}
                  className="group relative my-4 text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 scroll-mt-20"
                >
                  {children}
                  <button
                    onClick={() => scrollToHeading(modifiedId, 80)}
                    className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                    aria-label="Link to this heading"
                  >
                    <Link className="h-4 w-4 text-blue-500" />
                  </button>
                </h5>
              );
            },
          },

          h6: {
            component: ({ children }: MDXComponentProps) => {
              const modifiedId = sanitizeString(children);
              return (
                <h6
                  id={modifiedId}
                  className="group relative my-3 text-base md:text-lg font-medium text-gray-700 dark:text-gray-300 scroll-mt-20"
                >
                  {children}
                  <button
                    onClick={() => scrollToHeading(modifiedId, 80)}
                    className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                    aria-label="Link to this heading"
                  >
                    <Link className="h-4 w-4 text-blue-500" />
                  </button>
                </h6>
              );
            },
          },

          img: {
            component: ({ src = "", alt }: MDXComponentProps) => {
              const imgUrl = src.includes("?") ? src.split("?")[0] : src;
              return (
                <Image
                  src={imgUrl || "/placeholder.svg"}
                  alt={alt || "Image"}
                  width={0}
                  height={0}
                  unoptimized
                  className="max-w-full rounded-xl shadow-2xl transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              );
            },
          },

          p: {
            component: ({ children }: MDXComponentProps) => (
              <div className="my-6 leading-8 text-gray-700 dark:text-gray-200 text-lg">
                {children}
              </div>
            ),
          },

          ul: {
            component: ({ children }: MDXComponentProps) => {
              const isLinkList = React.Children.toArray(children).some(
                (child) =>
                  React.isValidElement(child) &&
                  typeof child.props === "object" &&
                  child.props &&
                  "children" in child.props &&
                  child.props.children?.toString().includes("http")
              );

              return (
                <ul
                  className={`my-6 space-y-2 pl-6 ${isLinkList ? "sm:flex sm:flex-wrap sm:gap-4 sm:pl-0 sm:space-y-0" : ""}`}
                >
                  {children}
                </ul>
              );
            },
          },

          ol: {
            component: ({ children }: MDXComponentProps) => (
              <ol className="my-6 space-y-2 pl-6 list-decimal">{children}</ol>
            ),
          },

          li: {
            component: ({ children }: MDXComponentProps) => {
              const hasLink = React.Children.toArray(children).some(
                (child) => React.isValidElement(child) && child.type === "a"
              );

              return (
                <li
                  className={`text-gray-700 dark:text-gray-200 leading-relaxed relative ${hasLink ? "sm:inline-block sm:bg-gray-100 dark:sm:bg-gray-800 sm:rounded-lg sm:px-3 sm:py-2 sm:mr-2 sm:mb-2" : "pl-2"}`}
                >
                  {!hasLink && (
                    <span className="absolute -left-4 top-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
                  )}
                  {children}
                </li>
              );
            },
          },

          strong: {
            component: ({ children }: MDXComponentProps) => (
              <strong className="font-bold text-gray-900 dark:text-gray-100">
                {children}
              </strong>
            ),
          },

          em: {
            component: ({ children }: MDXComponentProps) => (
              <em className="italic text-gray-700 dark:text-gray-200 font-medium">
                {children}
              </em>
            ),
          },

          del: {
            component: ({ children }: MDXComponentProps) => (
              <del className="line-through text-gray-500 dark:text-gray-400 opacity-75">
                {children}
              </del>
            ),
          },

          hr: {
            component: () => (
              <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
            ),
          },
        },
      }}
    >
      {processedMarkdown}
    </Markdown>
  );
});

MarkdownConverter.displayName = "MarkdownConverter";

export default MarkdownConverter;
