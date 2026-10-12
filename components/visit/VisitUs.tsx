"use client";

import { useEffect, useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { site } from "@/content/site";
import { T, useT, useLang } from "@/lib/i18n";
import { siteHi } from "@/content/hi/site";
import { cn } from "@/lib/utils";
import { getShopState, type ShopState } from "./shopStatus";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.fullAddress)}`;
const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(site.fullAddress)}&output=embed`;
const telHref = `tel:${site.phone.replace(/\s/g, "")}`;

function useShopState(): ShopState | null {
  // null on the server and for the first client render, so markup matches and hydration stays quiet.
  const [state, setState] = useState<ShopState | null>(null);
  useEffect(() => {
    const tick = () => setState(getShopState());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return state;
}

/**
 * Live open/closed line. Neutral (the plain hours) until the browser has the time in Asia/Kolkata.
 * `tone="dark"` is for the footer and other dark panels.
 */
export function ShopStatus({ className = "", tone = "auto" }: { className?: string; tone?: "auto" | "dark" }) {
  const state = useShopState();
  const t = useT();
  let text = t("Mon to Sat, 9 am to 8 pm. Sunday closed.", "सोम से शनि, सुबह 9 से रात 8 बजे। रविवार बंद।");
  let open = false;
  if (state) {
    switch (state.kind) {
      case "open":
        open = true;
        text = t("Open now. Closes 8 pm", "अभी खुला है। रात 8 बजे बंद होगा");
        break;
      case "before-open":
        text = t("Closed now. Opens 9 am", "अभी बंद है। सुबह 9 बजे खुलेगी");
        break;
      case "after-close":
        text =
          state.reopens === "monday"
            ? t("Closed now. Opens Monday 9 am", "अभी बंद है। सोमवार सुबह 9 बजे खुलेगी")
            : t("Closed now. Opens 9 am tomorrow", "अभी बंद है। कल सुबह 9 बजे खुलेगी");
        break;
      case "sunday":
        text = t("Closed on Sunday. Opens Monday 9 am", "आज रविवार है, दुकान बंद। सोमवार सुबह 9 बजे खुलेगी");
        break;
    }
  }
  return (
    <p
      className={cn("flex min-h-[1.75rem] items-center gap-2 text-[15px] font-semibold", tone === "dark" ? "text-white" : "text-foreground", className)}
      data-shop-state={state ? (open ? "open" : "closed") : "unknown"}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-2.5 w-2.5 shrink-0 rounded-full",
          !state ? "bg-white/30" : open ? "bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.2)]" : "bg-amber-400"
        )}
      />
      <span>{text}</span>
    </p>
  );
}

function MapEmbed() {
  const [on, setOn] = useState(false);
  const t = useT();
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] border border-border bg-muted lg:aspect-auto lg:min-h-[22rem]">
      {on ? (
        <iframe
          title={t("HM Ibrahim & Co on the map, Siyaganj, Indore", "नक्शे पर एच एम इब्राहिम एंड कंपनी, सियागंज, इंदौर")}
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <button
          type="button"
          onClick={() => setOn(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center font-semibold text-foreground hover:bg-secondary/60"
        >
          <MapPin className="h-8 w-8 text-primary" aria-hidden />
          <span>
            <T en="Show the map here" hi="नक्शा यहीं देखें" />
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            <T en="Loads only when you tap, to save your data." hi="टैप करने पर ही खुलेगा, ताकि आपका डेटा बचे।" />
          </span>
        </button>
      )}
    </div>
  );
}

type Props = {
  /** strip: one compact band (footer). full: address, hours, actions, optional map (contact page, home). */
  variant?: "strip" | "full";
  /** Value for data-track on the actions, so analytics knows where the tap came from. */
  source?: string;
  /** Tap-to-load Google map beside the details (full only). */
  embed?: boolean;
  className?: string;
};

/**
 * The shop's address as a first-class thing: map pin out to Google Maps, landmark, hours and a live open/closed line.
 * No parking or entry notes are shown because none exist in the repo copy yet (see docs/design/handoff-C.md).
 */
export function VisitUs({ variant = "full", source = "visit_us", embed = false, className }: Props) {
  const t = useT();
  const { lang } = useLang();
  const a = lang === "hi" ? siteHi.address : site.address;

  if (variant === "strip") {
    return (
      <div
        data-track={source}
        className={cn("grid gap-5 border-b border-white/15 pb-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10", className)}
      >
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0">
            <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60">
              <T en="Visit us" hi="दुकान पर आइए" />
            </p>
            <p className="mt-1 text-base font-semibold text-white">
              {a.line1}, {a.line2}, {a.city} {a.pincode}
            </p>
            <p className="mt-0.5 text-[15px] text-white/75">
              <T en="Landmark: Opposite Tijori Gali" hi="पहचान: तिजोरी गली के सामने" />
            </p>
            <ShopStatus tone="dark" className="mt-2" />
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track={`${source}_map`}
            aria-label={t("Open in Google Maps (opens in a new tab)", "गूगल मैप्स पर खोलें (नए टैब में)")}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-primary px-5 font-bold text-primary-foreground transition hover:brightness-110"
          >
            <MapPin className="h-4 w-4" aria-hidden />
            <T en="Open in Google Maps" hi="गूगल मैप्स पर खोलें" />
          </a>
          <a
            href={telHref}
            data-track={`${source}_call`}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-white/40 px-5 font-semibold text-white hover:bg-white/10"
          >
            <Phone className="h-4 w-4" aria-hidden />
            <T en="Call the shop" hi="दुकान पर कॉल करें" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div data-track={source} className={cn("grid gap-6 lg:gap-12", embed && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]", className)}>
      <div>
        <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          <T en="Visit the shop" hi="दुकान पर आइए" />
        </p>
        <h2 className="mt-2 text-foreground">
          <T en="Find us on Siyaganj Main Road" hi="सियागंज मेन रोड पर आइए" />
        </h2>
        <dl className="mt-4 space-y-3 text-base md:mt-7 md:space-y-5">
          <div>
            <dt className="text-sm font-semibold text-foreground">
              <T en="Address" hi="पता" />
            </dt>
            <dd className="mt-1 text-muted-foreground">
              {a.line1}, {a.line2}, {a.city}, {a.state} {a.pincode}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-foreground">
              <T en="Landmark" hi="पहचान" />
            </dt>
            <dd className="mt-1 text-muted-foreground">
              <T en="Opposite Tijori Gali. Ask for HM Ibrahim & Co." hi="तिजोरी गली के सामने। एच एम इब्राहिम एंड कंपनी पूछ लीजिए।" />
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-foreground">
              <T en="Hours" hi="समय" />
            </dt>
            <dd className="mt-1 text-muted-foreground">
              <T en="Mon to Sat, 9 am to 8 pm. Sunday closed." hi="सोम से शनि, सुबह 9 से रात 8 बजे। रविवार बंद।" />
              <ShopStatus className="mt-2" />
            </dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-7">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track={`${source}_map`}
            aria-label={t("Open in Google Maps (opens in a new tab)", "गूगल मैप्स पर खोलें (नए टैब में)")}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm bg-primary px-6 font-bold text-primary-foreground transition hover:brightness-110"
          >
            <MapPin className="h-5 w-5" aria-hidden />
            <T en="Open in Google Maps" hi="गूगल मैप्स पर खोलें" />
          </a>
          <a
            href={telHref}
            data-track={`${source}_call`}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm border border-input bg-card px-6 font-semibold text-foreground hover:border-foreground/50"
          >
            <Phone className="h-5 w-5" aria-hidden />
            <T en="Call before you come" hi="आने से पहले कॉल करें" />
          </a>
        </div>
      </div>
      {embed && <MapEmbed />}
    </div>
  );
}
