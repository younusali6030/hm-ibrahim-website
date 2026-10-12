import Link from "next/link";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { T } from "@/lib/i18n";
import { GaugeRule } from "@/components/motif/Motif";
import { btnMain } from "@/components/site/PageHero";
import "./story.css";

/**
 * Visit / Call / Quote: the same three ways in that the sticky bar carries, laid out as a ruled strip.
 * Sits at the end of a page, so it keeps clear of MobileStickyCTA with bottom padding on phones.
 */
export function ContactStrip({
  heading = "Come to the counter",
  quoteHref = "/contact",
  waMessage = "Hi, I'd like a rate. Product, size and quantity: ",
  headingId = "visit-strip-heading",
}: {
  heading?: string;
  quoteHref?: string;
  waMessage?: string;
  headingId?: string;
}) {
  const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;
  return (
    <section className="bg-nav pb-28 pt-14 text-white md:pb-16 md:pt-16" aria-labelledby={headingId}>
      <div className="page-container">
        <p className="st-eyebrow !text-white/60">
          <T en="Visit · Call · Quote" hi="आइए · कॉल करें · कोटेशन" />
        </p>
        <h2 id={headingId} className="mt-3 text-white">
          {heading}
        </h2>
        <GaugeRule className="mt-8" />
        <div className="st-strip !border-t-0 text-white/80">
          <div>
            <p className="st-meta !text-white/60">Visit</p>
            <p className="mt-2 text-white">
              {site.address.line1}
              <br />
              {site.address.line2}, {site.address.city} {site.address.pincode}
            </p>
            <p className="mt-2 text-sm">{site.hours.weekdays}. {site.hours.sunday}.</p>
          </div>
          <div>
            <p className="st-meta !text-white/60">Call</p>
            <p className="mt-2">
              <a href={tel(site.phone)}>{site.phone}</a>
              {site.phoneLabel && <span className="text-white/60"> · {site.phoneLabel}</span>}
            </p>
            {site.phoneAlt && (
              <p>
                <a href={tel(site.phoneAlt)}>{site.phoneAlt}</a>
                {site.phoneAltLabel && <span className="text-white/60"> · {site.phoneAltLabel}</span>}
              </p>
            )}
            <p>
              <a href={getWhatsAppLink(site.whatsapp, waMessage)} target="_blank" rel="noopener noreferrer">
                WhatsApp <span className="sr-only">(opens in a new tab)</span>
              </a>
            </p>
          </div>
          <div>
            <p className="st-meta !text-white/60">Quote</p>
            <p className="mt-2">Send the product, size and quantity. We confirm stock and call back with the rate.</p>
            <Link href={quoteHref} className={btnMain + " st-btn mt-4"}>
              <T en="Get a quote" hi="कोटेशन पाएँ" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
