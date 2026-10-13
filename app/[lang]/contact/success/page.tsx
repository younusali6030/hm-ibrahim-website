import type { Metadata } from "next";
import { QuoteSuccessContent } from "./QuoteSuccessContent";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  return {
    title: params.lang === "hi" ? "कोटेशन अनुरोध मिल गया" : "Quote request received",
    robots: { index: false, follow: false },
  };
}

export default function QuoteSuccessPage() {
  return <QuoteSuccessContent />;
}
