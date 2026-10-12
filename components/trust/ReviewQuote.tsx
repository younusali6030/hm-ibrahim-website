"use client";

import { useState } from "react";

/** A verbatim Google review, clamped to a few lines with a toggle so long item lists don't push the page down. */
export function ReviewQuote({ text, more, less }: { text: string; more: string; less: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 180 || text.split("\n").length > 3;
  return (
    <div>
      <blockquote
        lang="en"
        className={
          "whitespace-pre-line text-[15px] leading-relaxed text-foreground/90 " + (long && !open ? "line-clamp-3" : "")
        }
      >
        {text}
      </blockquote>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-1 inline-flex min-h-[36px] items-center text-sm font-semibold text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {open ? less : more}
        </button>
      )}
    </div>
  );
}
