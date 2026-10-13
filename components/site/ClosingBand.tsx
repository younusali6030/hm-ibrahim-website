"use client";

import Link from "@/components/LocaleLink";
import type { ReactNode } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink, telHref } from "@/lib/utils";
import { T, useT, useLang } from "@/lib/i18n";
import { useEnquiryLinks } from "@/lib/enquiryStore";
import { btnMain, btnGhostDark } from "@/components/site/PageHero";

/**
 * The one closing call to action every page ends on, above the footer.
 * Address, hours and phone numbers live in the footer, so this carries a single line and the three ways in.
 */
export function ClosingBand({
  heading,
  sub,
  quoteHref,
  quoteLabel,
  waMessage,
  headingId = "closing-heading",
}: {
  heading: ReactNode;
  sub?: ReactNode;
  quoteHref?: string;
  quoteLabel?: ReactNode;
  waMessage?: string;
  headingId?: string;
}) {
  const t = useT();
  const { lang } = useLang();
  const subText =
    sub ??
    t(
      "Send the product, size and quantity. We confirm stock and call back with the rate.",
      "उत्पाद, साइज़ और मात्रा भेजिए। हम स्टॉक देखकर रेट के साथ वापस कॉल करेंगे।"
    );
  const enq = useEnquiryLinks(lang, t("Hi, I'd like a rate. Product, size and quantity: ", "नमस्ते, मुझे रेट चाहिए। उत्पाद, साइज़ और मात्रा: "));
  // A page that names its own destination keeps it; otherwise a product the visitor was just looking at carries over.
  const waText = waMessage ?? enq.waText;
  const quoteTo = quoteHref ?? enq.quoteHref;
  return (
    <section className="border-t border-white/10 bg-nav text-white" aria-labelledby={headingId}>
      <div className="page-container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:gap-10 md:py-9">
        <div className="min-w-0 max-w-2xl">
          <h2
            id={headingId}
            className="font-display font-extrabold uppercase leading-[1.05] text-white"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
          >
            {heading}
          </h2>
          <p className="mt-1.5 text-sm leading-snug text-white/70 md:text-[15px] md:leading-relaxed">{subText}</p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-3 sm:flex">
          <Link href={quoteTo} className={btnMain + " col-span-2 sm:col-auto"}>
            {quoteLabel ?? <T en="Get a quote" hi="कोटेशन पाएँ" />}
          </Link>
          <a
            href={getWhatsAppLink(site.whatsapp, waText)}
            target="_blank"
            rel="noopener noreferrer"
            className={btnGhostDark + " gap-2"}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <T en="WhatsApp" hi="व्हाट्सएप" /><span className="sr-only"> {t("(opens in a new tab)", "(नए टैब में खुलेगा)")}</span>
          </a>
          <a href={telHref(site.phone)} className={btnGhostDark + " gap-2"}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            <T en="Call" hi="कॉल" />
          </a>
        </div>
      </div>
    </section>
  );
}
