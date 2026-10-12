import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugifyHeading } from "@/content/blog/toc";
import "@/components/story/story.css";

type Props = { content: string; className?: string };

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) return textOf((node as React.ReactElement<{ children?: React.ReactNode }>).props.children);
  return "";
}

/** Server-rendered Markdown with anchored headings, scrollable tables and callouts. */
export function MarkdownContent({ content, className = "" }: Props) {
  const seen = new Map<string, number>();
  const idFor = (children: React.ReactNode) => {
    const base = slugifyHeading(textOf(children)) || "section";
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 id={idFor(children)} className="scroll-mt-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 id={idFor(children)} className="scroll-mt-2">
              {children}
            </h3>
          ),
          table: ({ children }) => (
            <>
              <div className="blog-table-scroll" role="region" aria-label="Table, scrolls sideways on small screens" tabIndex={0}>
                <table>{children}</table>
              </div>
              <p className="blog-table-hint" aria-hidden="true">Table scrolls sideways</p>
            </>
          ),
          img: ({ src, alt }) => (
            <figure className="my-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" decoding="async" className="w-full rounded-[14px]" />
              {alt && <figcaption className="mt-2 text-sm text-muted-foreground">{alt}</figcaption>}
            </figure>
          ),
          a: ({ href, children }) => {
            if (href?.startsWith("/")) {
              return (
                <Link href={href} className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
                  {children}
                </Link>
              );
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
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
