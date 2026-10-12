import type { Metadata } from "next";
import { QuoteSuccessContent } from "./QuoteSuccessContent";

export const metadata: Metadata = {
  title: "Quote request received",
  robots: { index: false, follow: false },
};

export default function QuoteSuccessPage() {
  return <QuoteSuccessContent />;
}
