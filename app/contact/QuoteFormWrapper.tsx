"use client";

import { Suspense } from "react";
import { QuoteForm } from "./QuoteForm";
import { T } from "@/lib/i18n";

export function QuoteFormWrapper() {
  return (
    <Suspense
      fallback={
        <div className="mt-8 min-h-[24rem] text-muted-foreground" role="status">
          <T en="Loading the form…" hi="फ़ॉर्म खुल रहा है…" />
        </div>
      }
    >
      <QuoteForm />
    </Suspense>
  );
}
