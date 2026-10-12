"use client";

import { site } from "@/content/site";
import { T, useT } from "@/lib/i18n";

const FACTS = [
  { big: "1939", bigHi: "1939", small: "Founded in Siyaganj", smallHi: "सियागंज में स्थापना" },
  { big: "Retail + wholesale", bigHi: "रिटेल + थोक", small: "One counter, every order size", smallHi: "एक काउंटर, हर ऑर्डर साइज़" },
  { big: "Tata Wiron", bigHi: "टाटा वायरॉन", small: "Authorised dealer", smallHi: "अधिकृत डीलर" },
  { big: "All India", bigHi: "पूरे भारत में", small: "Shipping on request", smallHi: "ऑर्डर पर शिपिंग" },
];

export function ProofStrip() {
  const t = useT();
  return (
    <section className="border-b border-border" aria-label={t("Why buyers trust us", "खरीदार हम पर भरोसा क्यों करते हैं")}>
      <ul className="page-container grid grid-cols-2 gap-px bg-border bg-clip-content md:grid-cols-4">
        {FACTS.map((f) => (
          <li key={f.big} data-reveal className="bg-card px-4 py-6 md:py-8">
            <p className="font-display text-3xl font-extrabold uppercase leading-none text-foreground md:text-4xl">
              <T en={f.big} hi={f.bigHi} />
            </p>
            <p className="mt-2 text-sm text-muted-foreground"><T en={f.small} hi={f.smallHi} /></p>
          </li>
        ))}
      </ul>
      <p className="sr-only">{t(site.name, "एचएम इब्राहिम एंड कंपनी")}, {t(site.address.city, "इंदौर")}</p>
    </section>
  );
}
