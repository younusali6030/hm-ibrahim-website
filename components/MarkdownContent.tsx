"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { content: string; className?: string };

export function MarkdownContent({ content, className = "" }: Props) {
  return (
    <div className={`prose prose-invert max-w-none prose-headings:text-foreground prose-headings:font-heading prose-p:text-muted-foreground prose-a:text-primary prose-li:text-muted-foreground prose-headings:font-semibold ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith("/")) {
              return (
                <Link href={href} className="text-primary hover:underline">
                  {children}
                </Link>
              );
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
