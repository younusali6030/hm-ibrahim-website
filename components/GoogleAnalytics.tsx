"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { trackPageView } from "@/lib/analytics";
import { captureLanding } from "@/lib/attribution";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) captureLanding(pathname);
    if (GA_ID && pathname) trackPageView(pathname);
  }, [pathname]);

  // gtag.js (~180 KB, ~120 ms of main-thread time) loads on the first touch, key or scroll, or after 8 s idle.
  // The inline stub below queues every event meanwhile, so nothing is lost; only a visit that ends with no input
  // inside 8 s is not counted.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!GA_ID || ready) return;
    const go = () => setReady(true);
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const timer = window.setTimeout(go, 8000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, go));
      window.clearTimeout(timer);
    };
  }, [ready]);

  if (!GA_ID) return null;

  return (
    <>
      {ready && (
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      )}
      {/* Tiny inline stub: gtag() exists straight away and queues events, so nothing is lost while gtag.js loads late. */}
      <Script id="ga-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
