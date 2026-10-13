"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, LocateFixed, MapPin } from "lucide-react";
import Link from "@/components/LocaleLink";
import { useLang } from "@/lib/i18n";
import { site } from "@/content/site";

type Photo = { src: string; alt: string; label: string; position?: string };
type Place = { id: string; name: string };

type Props = {
  eyebrow: ReactNode;
  title: ReactNode;
  lede: ReactNode;
  actions: ReactNode;
  stats: ReactNode;
  /** The city (dominant), a second city view, and the shopfront (foreground detail). */
  city: Photo;
  second: Photo;
  counter: Photo;
  places: Place[];
  /** Drawn behind everything: the region map. */
  backdrop?: ReactNode;
};

/** Optional. With it the official Maps Embed API is used; without it the page falls back to Google's keyless embed. */
const EMBED_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
const DEST_TEXT = `${site.googleListingName}, ${site.fullAddress}`;

/** Embedded Google map: the listing on its own, or driving directions from `origin`. Real Google tiles and routing. */
function embedSrc(origin: string | null, hl: string) {
  if (EMBED_KEY) {
    const base = "https://www.google.com/maps/embed/v1/";
    const dest = `place_id:${site.googlePlaceId}`;
    return origin
      ? `${base}directions?key=${EMBED_KEY}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&mode=driving&language=${hl}`
      : `${base}place?key=${EMBED_KEY}&q=${encodeURIComponent(dest)}&zoom=15&language=${hl}`;
  }
  return origin
    ? `https://www.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(DEST_TEXT)}&hl=${hl}&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(DEST_TEXT)}&z=15&hl=${hl}&output=embed`;
}

/** Google Maps itself, with the destination pinned to the shop's listing. Without an origin Google asks for one. */
function directionsUrl(origin: string | null) {
  const q = new URLSearchParams({ api: "1", destination: DEST_TEXT, destination_place_id: site.googlePlaceId, travelmode: "driving" });
  if (origin) q.set("origin", origin);
  return `https://www.google.com/maps/dir/?${q.toString()}`;
}

/**
 * The Indore hero. Left: the page's own headline, promise and figures. Right: two views behind one pair of tabs.
 * "Indore" is a layered composition of real photographs (the city large, the counter a small foreground plane);
 * "Route to our counter" is a Google map with directions from a typed place or, on request, the visitor's position.
 * The position is read once, handed to Google for the route and never stored.
 */
export function IndoreHero({ eyebrow, title, lede, actions, stats, city, second, counter, places, backdrop }: Props) {
  const { lang } = useLang();
  const hi = lang === "hi";
  const t = (en: string, h: string) => (hi ? h : en);
  const uid = useId();
  const [tab, setTab] = useState<"city" | "route">("city");
  const [mapSeen, setMapSeen] = useState(false);
  const [typed, setTyped] = useState("");
  /** What the route is drawn from: text the visitor typed, or "lat,lng" from a one-time position. */
  const [origin, setOrigin] = useState<{ value: string; mine: boolean } | null>(null);
  const [geo, setGeo] = useState<"idle" | "asking" | "denied" | "unavailable">("idle");
  const [sel, setSel] = useState<string | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (tab === "route") setMapSeen(true);
  }, [tab]);

  /* Pointer parallax: each photo plane slides by its own depth. Planes never rotate or scale, so nothing warps. */
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const step = () => {
      raf = 0;
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      el.style.setProperty("--ih-x", x.toFixed(4));
      el.style.setProperty("--ih-y", y.toFixed(4));
      if (Math.abs(tx - x) > 0.002 || Math.abs(ty - y) > 0.002) raf = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(step);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onTabKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next = e.key === "Home" ? "city" : e.key === "End" ? "route" : tab === "city" ? "route" : "city";
    setTab(next);
    tabs.current[next === "city" ? 0 : 1]?.focus();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = typed.trim();
    setOrigin(v ? { value: v, mine: false } : null);
    if (v) setGeo("idle");
  };

  const useMine = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGeo("unavailable");
      return;
    }
    setGeo("asking");
    // One reading, on this click only. Nothing is watched, cached or saved.
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo("idle");
        setTyped("");
        setOrigin({ value: `${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`, mine: true });
      },
      (err) => setGeo(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 0 }
    );
  }, []);

  const selected = places.find((p) => p.id === sel) ?? null;
  const tabBtn = (id: "city" | "route", i: number, label: string) => (
    <button
      ref={(el) => {
        tabs.current[i] = el;
      }}
      type="button"
      role="tab"
      id={`${uid}-tab-${id}`}
      aria-selected={tab === id}
      aria-controls={`${uid}-panel-${id}`}
      tabIndex={tab === id ? 0 : -1}
      onClick={() => setTab(id)}
      onKeyDown={onTabKey}
      className={"ih-tab" + (tab === id ? " ih-tab-on" : "")}
    >
      {id === "route" && <MapPin className="h-4 w-4" aria-hidden />}
      {label}
    </button>
  );

  return (
    <section className="ih relative isolate overflow-hidden bg-nav text-white">
      {backdrop}
      <div className="page-container relative grid items-center gap-10 py-8 md:py-14 lg:grid-cols-[minmax(0,10fr)_minmax(0,11fr)] lg:gap-14">
        <div className="ih-copy min-w-0">
          <p className="flex items-center gap-3 font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-3 text-balance text-white" style={{ fontSize: "clamp(2.1rem, 3.7vw, 3.6rem)" }}>
            {title}
          </h1>
          <p className="mt-5 max-w-[34rem] text-pretty text-lg leading-relaxed text-white/80">{lede}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>
          {stats}
        </div>

        <div className="min-w-0">
          <div role="tablist" aria-label={t("Indore and the route to our counter", "इंदौर और हमारे काउंटर का रास्ता")} className="ih-tabs">
            {tabBtn("city", 0, t("Indore", "इंदौर"))}
            {tabBtn("route", 1, t("Route to our counter", "हमारे काउंटर का रास्ता"))}
          </div>

          <div className={"ih-stage" + (tab === "route" ? " ih-stage-route" : "")} ref={stage}>
            {/* Indore: the city large, the counter a small plane in front of it. */}
            <div role="tabpanel" id={`${uid}-panel-city`} aria-labelledby={`${uid}-tab-city`} hidden={tab !== "city"} className="ih-panel">
              <figure className="ih-plane ih-city">
                <span className="ih-frame">
                  <Image src={city.src} alt={city.alt} fill priority quality={78} sizes="(max-width:1023px) 92vw, 46vw" style={{ objectPosition: city.position }} />
                </span>
                <figcaption>{city.label}</figcaption>
              </figure>
              <figure className="ih-plane ih-second">
                <span className="ih-frame">
                  <Image src={second.src} alt={second.alt} fill quality={70} sizes="(max-width:1023px) 40vw, 18vw" style={{ objectPosition: second.position }} />
                </span>
                <figcaption>{second.label}</figcaption>
              </figure>
              <figure className="ih-plane ih-counter">
                <span className="ih-frame">
                  <Image src={counter.src} alt={counter.alt} fill quality={72} sizes="(max-width:1023px) 44vw, 20vw" style={{ objectPosition: counter.position }} />
                </span>
                <figcaption className="ih-cap-on">{counter.label}</figcaption>
              </figure>
            </div>

            {/* Route: a level, usable Google map. Loaded only once this tab has been opened. */}
            <div role="tabpanel" id={`${uid}-panel-route`} aria-labelledby={`${uid}-tab-route`} hidden={tab !== "route"} className="ih-panel ih-route">
              <form onSubmit={submit} className="ih-form">
                <label htmlFor={`${uid}-from`} className="sr-only">
                  {t("Starting location", "शुरू करने की जगह")}
                </label>
                <input
                  id={`${uid}-from`}
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder={t("Starting from: area, town or address", "कहाँ से: इलाका, शहर या पता")}
                  autoComplete="off"
                  enterKeyHint="go"
                  className="ih-input"
                />
                <button type="submit" className="ih-go">
                  {t("Show route", "रास्ता दिखाएँ")}
                </button>
                <button type="button" onClick={useMine} disabled={geo === "asking"} className="ih-mine">
                  <LocateFixed className="h-4 w-4" aria-hidden />
                  {geo === "asking" ? t("Finding you…", "खोज रहे हैं…") : t("Use my location", "मेरी लोकेशन लें")}
                </button>
              </form>
              <p className="ih-status" role="status" aria-live="polite">
                {geo === "denied"
                  ? t("Location permission was not given. Type where you are starting from, or open Google Maps below.", "लोकेशन की अनुमति नहीं मिली। जहाँ से चल रहे हैं वह जगह लिखिए, या नीचे गूगल मैप्स खोलिए।")
                  : geo === "unavailable"
                    ? t("We could not read your location here. Type where you are starting from, or open Google Maps below.", "यहाँ आपकी लोकेशन नहीं मिल सकी। जहाँ से चल रहे हैं वह जगह लिखिए, या नीचे गूगल मैप्स खोलिए।")
                    : origin
                      ? origin.mine
                        ? t("Route from your current location to our counter.", "आपकी मौजूदा लोकेशन से हमारे काउंटर तक का रास्ता।")
                        : t(`Route from ${origin.value} to our counter.`, `${origin.value} से हमारे काउंटर तक का रास्ता।`)
                      : t("Our counter on Google Maps. Add a starting point to see the route.", "गूगल मैप्स पर हमारा काउंटर। रास्ता देखने के लिए शुरू की जगह जोड़िए।")}
              </p>
              <div className="ih-map">
                {mapSeen && (
                  <iframe
                    key={origin?.value ?? "place"}
                    src={embedSrc(origin?.value ?? null, hi ? "hi" : "en")}
                    title={t("Google map: route to HM Ibrahim & Co, 60 Siyaganj Main Road, Indore", "गूगल मैप: एचएम इब्राहिम एंड कंपनी, 60 सियागंज मेन रोड, इंदौर का रास्ता")}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                )}
              </div>
              <a href={directionsUrl(origin?.value ?? null)} target="_blank" rel="noopener noreferrer" className="ih-open">
                {t("Open in Google Maps", "गूगल मैप्स में खोलें")}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
                <span className="sr-only">{t("(opens in a new tab)", "(नए टैब में खुलेगा)")}</span>
              </a>
            </div>
          </div>

          {/* Regional towns: pick one to carry it into the enquiry form. */}
          <div className="ih-towns">
            <p className="ih-towns-k">{t("Regional supply enquiries", "क्षेत्रीय सप्लाई पूछताछ")}</p>
            <ul aria-label={t("Places we supply enquiries from", "जिन जगहों से पूछताछ आती है")}>
              {places.map((p) => (
                <li key={p.id}>
                  <button type="button" aria-pressed={sel === p.id} onClick={() => setSel((v) => (v === p.id ? null : p.id))} className="ih-chip">
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
            <div aria-live="polite" className="ih-towns-r">
              {selected ? (
                <Link href={`/contact?location=${encodeURIComponent(selected.name)}`} className="ih-enquire" lang={hi ? "hi" : undefined}>
                  <span>{t(`Enquire for this location: ${selected.name}`, `इस जगह के लिए पूछें: ${selected.name}`)}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : (
                <p>{t("Choose a town to enquire for that location. Delivery is confirmed with each quotation.", "उस जगह के लिए पूछने हेतु कोई शहर चुनिए। डिलीवरी हर कोटेशन के साथ तय होती है।")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
