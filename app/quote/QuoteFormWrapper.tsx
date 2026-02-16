"use client";

import { Suspense } from "react";
import { QuoteForm } from "./QuoteForm";

export function QuoteFormWrapper() {
  return (
    <Suspense fallback={<div className="mx-auto mt-10 max-w-2xl">Loading form...</div>}>
      <QuoteForm />
    </Suspense>
  );
}
