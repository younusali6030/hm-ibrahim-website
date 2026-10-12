"use client";

import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { T, useT } from "@/lib/i18n";

type Props = {
  variant?: "page" | "product";
  className?: string;
};

const link =
  "inline-flex min-h-[44px] items-center font-semibold text-primary underline underline-offset-4 hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function LookingForMoreSection({ variant = "page", className = "" }: Props) {
  const t = useT();
  const tel = `tel:${site.phone.replace(/\s/g, "")}`;
  if (variant === "product") {
    return (
      <p className={`border-t border-border pt-4 text-sm text-muted-foreground ${className}`}>
        <T
          en="Not the size or item you need? The counter stocks more than the page shows."
          hi="जो साइज़ या आइटम चाहिए वो नहीं दिखा? काउंटर पर इससे ज़्यादा माल है।"
        />{" "}
        <a href={tel} className={link}><T en="Call" hi="कॉल करें" /></a>
        <span className="mx-2" aria-hidden="true">/</span>
        <a
          href={getWhatsAppLink(site.whatsapp, t("Hi, I'm looking for a product. Do you have it available?", "नमस्ते, मुझे एक उत्पाद चाहिए। क्या यह उपलब्ध है?"))}
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          <T en="WhatsApp" hi="व्हाट्सएप" />
        </a>
      </p>
    );
  }

  return (
    <section className={`border-y border-border py-5 ${className}`} aria-labelledby="stock-more-heading">
      <h2 id="stock-more-heading" className="text-xl text-foreground">
        <T en="Need something specific?" hi="कुछ ख़ास चाहिए?" />
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        <T
          en="We stock more hardware than is listed here. Call or WhatsApp for availability."
          hi="लिस्ट से ज़्यादा हार्डवेयर दुकान में है। फ़ोन या WhatsApp पर पूछिए।"
        />
      </p>
      <div className="mt-2 flex flex-wrap gap-x-6">
        <a href={tel} className={link} aria-label={t("Call us", "कॉल करें")}><T en="Call" hi="कॉल करें" /></a>
        <a
          href={getWhatsAppLink(site.whatsapp, t("Hi, I'm looking for [item]. Do you have it available?", "नमस्ते, मुझे [आइटम] चाहिए। क्या यह उपलब्ध है?"))}
          target="_blank"
          rel="noopener noreferrer"
          className={link}
          aria-label={t("WhatsApp us", "व्हाट्सएप करें")}
        >
          <T en="WhatsApp" hi="व्हाट्सएप" />
        </a>
      </div>
    </section>
  );
}
