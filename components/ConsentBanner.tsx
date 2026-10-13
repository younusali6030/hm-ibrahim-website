"use client";

import { useSyncExternalStore } from "react";
import LocaleLink from "@/components/LocaleLink";
import { T } from "@/lib/i18n";
import { CONSENT_EVENT, readConsent, saveConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function subscribe(cb: () => void) {
  window.addEventListener(CONSENT_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CONSENT_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** "unset" until the visitor chooses; "server" while rendering on the server so nothing flashes. */
function snapshot(): string {
  return readConsent() ?? "unset";
}

export function ConsentBanner() {
  const state = useSyncExternalStore(subscribe, snapshot, () => "server");
  if (!GA_ID || state !== "unset") return null;
  const btn =
    "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-white/25 px-4 text-sm font-semibold text-white transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
  return (
    <div
      role="region"
      aria-label="Analytics consent"
      className="glass-strong fixed inset-x-3 bottom-[calc(4.9rem+env(safe-area-inset-bottom,0px))] z-50 rounded-2xl p-4 text-sm text-white print:hidden md:inset-x-auto md:bottom-4 md:left-4 md:max-w-sm"
    >
      <p className="leading-relaxed text-white/90">
        <T
          en="We use Google Analytics to count visits and see which pages help buyers. Allow it?"
          hi="हम विज़िट गिनने और यह देखने के लिए गूगल एनालिटिक्स इस्तेमाल करते हैं कि कौन से पेज खरीदारों के काम आते हैं। अनुमति दें?"
        />{" "}
        <LocaleLink href="/privacy" className="underline underline-offset-4 hover:text-primary">
          <T en="Privacy" hi="गोपनीयता" />
        </LocaleLink>
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" className={btn} onClick={() => saveConsent("denied")}>
          <T en="No thanks" hi="नहीं, धन्यवाद" />
        </button>
        <button type="button" className={btn} onClick={() => saveConsent("granted")}>
          <T en="Allow" hi="अनुमति दें" />
        </button>
      </div>
    </div>
  );
}
