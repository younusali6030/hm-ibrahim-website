"use client";

export function PrintCatalogButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      Download / Print as PDF
    </button>
  );
}
