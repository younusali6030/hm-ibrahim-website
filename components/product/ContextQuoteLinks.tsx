"use client";

import Link from "@/components/LocaleLink";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { enquiryText, enquiryTextHi, quoteHrefFor } from "@/lib/enquiry";
import { useEnquiryLinks } from "@/lib/enquiryStore";

/** Closing quote / WhatsApp line of a product page. Carries the brand the visitor picked above, if any. */
export function ContextQuoteLinks({
  productSlug,
  productName,
  categorySlug,
  fields,
  lang,
}: {
  productSlug: string;
  productName: string;
  categorySlug: string;
  fields?: string[];
  lang: "en" | "hi";
}) {
  const base = { productSlug, productName, categorySlug, fields };
  const live = useEnquiryLinks(
    lang,
    lang === "hi" ? `नमस्ते, ${enquiryTextHi(base)}। कृपया भाव बताइए।` : `Hi, ${enquiryText(base)}. Please share the price and availability.`
  );
  const href = live.hasContext ? live.quoteHref : quoteHrefFor(base);
  const hi = lang === "hi";
  const cls = "inline-flex min-h-[44px] items-center text-primary underline underline-offset-4";
  return (
    <p className="text-sm text-muted-foreground">
      {hi ? "इंदौर या सियागंज में कोटेशन माँगें:" : "Request a quote in Indore or Siyaganj:"}{" "}
      <Link href={href} className={cls}>
        {hi ? "कोटेशन माँगें" : "Request a Quote"}
      </Link>
      {" · "}
      <a href={getWhatsAppLink(site.whatsapp, live.waText)} target="_blank" rel="noopener noreferrer" className={cls}>
        {hi ? "व्हाट्सएप" : "WhatsApp"}
      </a>
    </p>
  );
}
