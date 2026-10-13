"use client";

import { useEffect, useState } from "react";
import Link from "@/components/LocaleLink";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink, telHref } from "@/lib/utils";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";
import { T, useT, useLang } from "@/lib/i18n";
import { siteHi } from "@/content/hi/site";
import { CounterStamp } from "@/components/motif/Motif";
import { ShopStatus } from "@/components/visit/VisitUs";

const QUOTE_STORAGE_KEY = "hmQuoteSuccess";

type Stored = { reference: string; catalogSent: boolean; name: string; message: string };

export function QuoteSuccessContent() {
  const t = useT();
  const { lang } = useLang();
  const a = lang === "hi" ? siteHi.address : site.address;
  const fullAddress = lang === "hi" ? siteHi.fullAddress : site.fullAddress;
  const [data, setData] = useState<Stored | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(QUOTE_STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as Stored);
    } catch {
      /* page still reads correctly without it */
    }
  }, []);

  const first = data?.name?.split(" ")[0];
  const wa = getWhatsAppLink(site.whatsapp, data?.message ?? t("Hi, I just sent a quote request on your website.", "नमस्ते, मैंने अभी आपकी वेबसाइट पर कोटेशन अनुरोध भेजा है।"));

  return (
    <div className="page-container section-padding pb-28 md:pb-16" data-track="quote_success">
      <div className="mx-auto max-w-2xl">
        <CounterStamp sub={<T en="Siyaganj, Indore" hi="सियागंज, इंदौर" />} className="mb-6">
          <T en="Noted at the counter" hi="काउंटर पर दर्ज" />
        </CounterStamp>

        <h1 className="text-foreground" tabIndex={-1}>
          {first ? (
            <>
              <T en="Thank you," hi="धन्यवाद," /> {first}.
            </>
          ) : (
            <T en="Request received." hi="अनुरोध मिल गया।" />
          )}
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          <T
            en="Your request is with the Siyaganj shop. We call you back during shop hours, Monday to Saturday, 10 am to 8 pm."
            hi="आपका अनुरोध सियागंज की दुकान पर पहुँच गया है। हम दुकान के समय में, सोमवार से शनिवार सुबह 10 से रात 8 बजे के बीच, आपको वापस कॉल करेंगे।"
          />
        </p>

        {data?.reference && (
          <p className="mt-6 inline-block rounded-sm border border-border bg-card px-4 py-3 text-sm">
            <span className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <T en="Your reference" hi="आपका रेफ़रेंस" />
            </span>
            <br />
            <span className="font-display text-3xl font-extrabold tracking-wide text-foreground">{data.reference}</span>
          </p>
        )}

        {data?.catalogSent && (
          <p className="mt-4 text-sm text-muted-foreground">
            <T
              en="We have also emailed you the product catalog. Check your spam folder if it does not arrive."
              hi="हमने प्रोडक्ट कैटलॉग भी ईमेल किया है। न दिखे तो स्पैम देख लीजिए।"
            />
          </p>
        )}

        <div className="mt-8 rounded-[10px] bg-nav p-6 text-white">
          <p className="text-lg font-semibold">
            <T en="Need it sooner?" hi="जल्दी चाहिए?" />
          </p>
          <p className="mt-1 text-sm text-white/80">
            <T
              en="Call the shop, or WhatsApp with your reference. Your list is already filled in."
              hi="दुकान पर कॉल कीजिए, या रेफ़रेंस के साथ व्हाट्सएप कीजिए। आपकी लिस्ट पहले से भरी है।"
            />
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={telHref(site.phone)}
              onClick={() => trackCallClick("quote_success")}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-sm bg-primary px-5 font-bold text-primary-foreground"
            >
              <Phone className="h-5 w-5" aria-hidden /> <T en="Call now" hi="अभी कॉल करें" /> {site.phone}
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("quote_success")}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-sm border border-white/40 px-5 font-semibold text-white hover:bg-white/10"
            >
              <MessageCircle className="h-5 w-5" aria-hidden /> <T en="Send on WhatsApp" hi="व्हाट्सएप पर भेजें" />
            </a>
          </div>
        </div>

        <div className="mt-8 rounded-[10px] border border-border bg-card p-6">
          <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <T en="Walk in" hi="दुकान पर आइए" />
          </p>
          <p className="mt-2 text-base text-foreground">
            {a.line1}, {a.line2}, {a.city}
          </p>
          <ShopStatus className="mt-2" />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            data-track="quote_success_map"
            className="mt-4 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-input px-5 font-semibold text-foreground hover:border-foreground/50"
          >
            <MapPin className="h-5 w-5" aria-hidden /> <T en="Open in Google Maps" hi="गूगल मैप्स पर खोलें" />
          </a>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-6 text-sm font-semibold">
          <Link href="/products" className="inline-flex min-h-[44px] items-center underline underline-offset-4">
            <T en="Keep browsing products" hi="और उत्पाद देखिए" />
          </Link>
          <Link href="/" className="inline-flex min-h-[44px] items-center underline underline-offset-4">
            <T en="Back to home" hi="होम पर जाइए" />
          </Link>
        </div>
      </div>
    </div>
  );
}
