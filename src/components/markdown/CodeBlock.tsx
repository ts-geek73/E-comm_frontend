"use client";
import React, { useState } from "react";
import { BiChevronsDown, BiChevronsUp, BiClipboard } from "react-icons/bi";
import { BsClipboardCheck } from "react-icons/bs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
// import styles from "@styles/blogs/MDX.module.scss";

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copy, setCopy] = useState(false);
  const trimmedCode = code.trim();
  const shouldCollapse = trimmedCode.split("\n").length > 15;

  const handleClipboard = async () => {
    try {
      await navigator.clipboard.writeText(trimmedCode);
      setCopy(true);
      setTimeout(() => setCopy(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      role="presentation"
      // className={`${styles.code_block} ${isExpanded ? styles.expanded : ""}`}
    >
      <div>
        <h2>{language ? language.split("-")[1] : "undefined"}</h2>
        <div>
          {shouldCollapse && (
            <button
              // className={styles.collapse_button}
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? "Collapse code" : "Expand code"}
            >
              {isExpanded ? (
                <BiChevronsUp size={16} />
              ) : (
                <BiChevronsDown size={16} />
              )}
            </button>
          )}
          <button
            // className={styles.copy_button}
            onClick={() => !copy && handleClipboard()}
            aria-label="Copy code"
          >
            {!copy ? <BiClipboard size={16} /> : <BsClipboardCheck size={16} />}
          </button>
        </div>
      </div>
      <div
      // className={`${styles.code_content} ${isExpanded ? styles.expanded : ""}`}
      >
        <SyntaxHighlighter
          wrapLines={true}
          showLineNumbers={true}
          language={language ? language.split("-")[1] : "code"}
          style={atomOneDark}
          // className={styles.syntax_highlighter}
        >
          {trimmedCode}
        </SyntaxHighlighter>
        {shouldCollapse && (
          <div
          // className={styles.expand_overlay}
          >
            <button
              // className={styles.expand_button}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  Show less <BiChevronsUp />
                </>
              ) : (
                <>
                  Show more <BiChevronsDown />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeBlock;
