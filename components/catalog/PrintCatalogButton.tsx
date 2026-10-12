"use client";

import { T } from "@/lib/i18n";

export function PrintCatalogButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      <T en="Download or print as PDF" hi="डाउनलोड / पीडीएफ़ के रूप में प्रिंट करें" />
    </button>
  );
}
