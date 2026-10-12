"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Phone, Check } from "lucide-react";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { trackWhatsAppClick, trackCallClick } from "@/lib/analytics";

const QUOTE_STORAGE_KEY = "hmQuoteSuccess";

type Stored = { reference: string; catalogSent: boolean; name: string; message: string };

export function QuoteSuccessContent() {
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
  const wa = getWhatsAppLink(
    site.whatsapp,
    data?.message ?? "Hi, I just sent a quote request on your website."
  );

  return (
    <div className="page-container section-padding">
      <div className="mx-auto max-w-2xl">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-hidden>
          <Check className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-foreground">{first ? `Thank you, ${first}.` : "Request received."}</h1>
        <p className="mt-4 text-base text-muted-foreground">
          Your quote request is with our team in Siyaganj. We will call or WhatsApp you with rates and availability during shop hours ({site.hours.weekdays.replace("Mon - Sat: ", "Mon to Sat, ")}).
        </p>

        {data?.reference && (
          <p className="mt-6 inline-block rounded-sm border border-border bg-card px-4 py-3 text-sm">
            <span className="font-mono-brand text-xs uppercase tracking-[0.16em] text-muted-foreground">Your reference</span>
            <br />
            <span className="font-display text-3xl font-extrabold tracking-wide text-foreground">{data.reference}</span>
          </p>
        )}

        {data?.catalogSent && (
          <p className="mt-4 text-sm text-muted-foreground">
            We also emailed you the product catalog. Check spam if you do not see it.
          </p>
        )}

        <div className="mt-8 rounded-sm bg-nav p-6 text-white">
          <p className="text-lg font-semibold">Need it sooner?</p>
          <p className="mt-1 text-sm text-white/80">Message us on WhatsApp with your reference and your list is already filled in.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("quote_success")}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-primary px-5 font-bold text-primary-foreground"
            >
              <MessageCircle className="h-5 w-5" aria-hidden /> Send on WhatsApp
            </a>
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              onClick={() => trackCallClick("quote_success")}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-white/40 px-5 font-semibold text-white"
            >
              <Phone className="h-5 w-5" aria-hidden /> Call {site.phone}
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/products" className="underline underline-offset-4">Keep browsing products</Link>
          <Link href="/" className="underline underline-offset-4">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
