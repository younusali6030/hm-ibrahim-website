import Link from "next/link";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { GaugeRule } from "@/components/motif/Motif";
import { btnMain, btnGhostDark } from "@/components/site/PageHero";

type Props = {
  title?: string;
  description?: string;
  quoteLabel?: string;
  whatsAppMessage?: string;
};

/** Closing band: one statement, two ways in. Static, so it never shifts layout. */
export function CTASection({
  title = "Ready to order?",
  description = "Send the list. We confirm stock and call back with the rate.",
  quoteLabel = "Request a quote",
  whatsAppMessage = "Hi, I'm interested in your products. Please share price/availability.",
}: Props) {
  return (
    <section className="bg-nav pb-28 pt-14 text-white md:pb-16 md:pt-16" aria-labelledby="cta-heading">
      <div className="page-container">
        <GaugeRule />
        <div className="mt-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 id="cta-heading" className="text-white">{title}</h2>
            <p className="mt-3 max-w-xl text-white/80">{description}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/contact" className={btnMain}>{quoteLabel}</Link>
            <a href={getWhatsAppLink(site.whatsapp, whatsAppMessage)} target="_blank" rel="noopener noreferrer" className={btnGhostDark}>
              WhatsApp<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
