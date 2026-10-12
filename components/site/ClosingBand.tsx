import Link from "next/link";
import type { ReactNode } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { T } from "@/lib/i18n";
import { btnMain, btnGhostDark } from "@/components/site/PageHero";

/**
 * The one closing call to action every page ends on, above the footer.
 * Address, hours and phone numbers live in the footer, so this carries a single line and the three ways in.
 */
export function ClosingBand({
  heading,
  sub = "Send the product, size and quantity. We confirm stock and call back with the rate.",
  quoteHref = "/contact",
  quoteLabel,
  waMessage = "Hi, I'd like a rate. Product, size and quantity: ",
  headingId = "closing-heading",
}: {
  heading: ReactNode;
  sub?: ReactNode;
  quoteHref?: string;
  quoteLabel?: ReactNode;
  waMessage?: string;
  headingId?: string;
}) {
  return (
    <section className="border-t border-white/10 bg-nav text-white" aria-labelledby={headingId}>
      <div className="page-container flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between md:gap-10 md:py-10">
        <div className="min-w-0 max-w-2xl">
          <h2
            id={headingId}
            className="font-display font-extrabold uppercase leading-[1.05] text-white"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
          >
            {heading}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-white/70">{sub}</p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-3 sm:flex">
          <Link href={quoteHref} className={btnMain + " col-span-2 sm:col-auto"}>
            {quoteLabel ?? <T en="Get a quote" hi="कोटेशन पाएँ" />}
          </Link>
          <a
            href={getWhatsAppLink(site.whatsapp, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={btnGhostDark + " gap-2"}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={btnGhostDark + " gap-2"}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            <T en="Call" hi="कॉल" />
          </a>
        </div>
      </div>
    </section>
  );
}
