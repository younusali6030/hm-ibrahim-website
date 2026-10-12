import type { Metadata } from "next";
import { QuoteSuccessContent } from "./QuoteSuccessContent";

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return {
    title: params.lang === "hi" ? "कोटेशन अनुरोध मिल गया" : "Quote request received",
    robots: { index: false, follow: false },
  };
}

export default function QuoteSuccessPage() {
  return <QuoteSuccessContent />;
}
