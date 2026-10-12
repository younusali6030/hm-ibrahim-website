"use client";

import Link from "@/components/LocaleLink";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { homeReels } from "@/content/reels";

type Reel = { id: string; title: string; note: string; href?: string; cta?: string };

/** Order and files come from content/reels.ts (also feeds the video sitemap and VideoObject schema). Files live in /public/reels. */
const REEL_UI: Record<string, Omit<Reel, "id">> = {
  "shop-par-bharosa": { title: "Shop par bharosa", note: "Walk in. See the stock. Decide." },
  "check-the-strength": { title: "Check the strength", note: "Wire and mesh, tested in front of you." },
  "machhar-full-stop": { title: "Machhar ka full stop", note: "Mosquito net, cut at the counter.", href: "/products/mosquito-net", cta: "Mosquito net" },
  "perforated-sheet-customer": { title: "Perforated sheet", note: "A customer on why he buys it here.", href: "/categories/perforated-sheets", cta: "Perforated sheets" },
  "nail-reel": { title: "Nails, by weight", note: "Every length in the bins.", href: "/categories/nails", cta: "Nails" },
  "kala-taar-wholesale": { title: "Kala taar, wholesale", note: "Binding wire by the coil.", href: "/products/binding-wire", cta: "Binding wire" },
  "frp-bars": { title: "FRP bars", note: "Light, rust-proof, cut to length.", href: "/products/frp-bars", cta: "FRP bars" },
  "weldmesh-jali": { title: "Weldmesh jali", note: "Rolls and panels, any gauge.", href: "/categories/welded-mesh", cta: "Welded mesh" },
  "kabootar-jali": { title: "Kabootar jali", note: "Pigeon net for balconies and shafts.", href: "/products/pigeon-nets", cta: "Pigeon nets" },
  "pvc-hexa-mesh": { title: "PVC hexa mesh", note: "Garden and poultry fencing.", href: "/products/plastic-hexagonal-poultry-mesh", cta: "Hexa mesh" },
  "tata-wire-rate": { title: "Tata wire, firm rate", note: "Tata Wiron, straight from the shelf.", href: "/products/gi-wire", cta: "GI wire" },
  "rat-jaali-customer": { title: "A customer, on camera", note: "Rat jaali, from our customer." },
};

const REELS: Reel[] = homeReels.map((v) => {
  const id = v.src.replace("/reels/", "");
  return { id, ...(REEL_UI[id] ?? { title: v.title, note: v.description }) };
});

const REELS_HI: Record<string, Pick<Reel, "title" | "note" | "cta">> = {
  "shop-par-bharosa": { title: "दुकान पर भरोसा", note: "आइए। माल देखिए। फिर तय कीजिए।" },
  "check-the-strength": { title: "मज़बूती परखिए", note: "तार और जाली, आपके सामने जाँची गई।" },
  "machhar-full-stop": { title: "मच्छर का फुल स्टॉप", note: "मच्छरदानी जाली, काउंटर पर कटती हुई।", cta: "मच्छरदानी जाली" },
  "perforated-sheet-customer": { title: "परफोरेटेड शीट", note: "एक ग्राहक बताते हैं कि यहीं से क्यों लेते हैं।", cta: "परफोरेटेड शीट" },
  "nail-reel": { title: "कीलें, वज़न के हिसाब से", note: "हर लंबाई डिब्बों में।", cta: "कीलें" },
  "kala-taar-wholesale": { title: "काला तार, थोक में", note: "कॉइल के हिसाब से बाइंडिंग तार।", cta: "बाइंडिंग तार" },
  "frp-bars": { title: "एफआरपी बार", note: "हल्के, ज़ंग-रहित, नाप से कटे।", cta: "एफआरपी बार" },
  "weldmesh-jali": { title: "वेल्डमेश जाली", note: "रोल और पैनल, हर गेज।", cta: "वेल्डेड मेश" },
  "kabootar-jali": { title: "कबूतर जाली", note: "बालकनी और शाफ्ट के लिए कबूतर रोकने वाली जाली।", cta: "कबूतर जाली" },
  "pvc-hexa-mesh": { title: "पीवीसी हेक्सा मेश", note: "बगीचे और पोल्ट्री की फेंसिंग।", cta: "हेक्सा मेश" },
  "tata-wire-rate": { title: "टाटा तार, पक्का रेट", note: "टाटा वायरॉन, सीधे शेल्फ से।", cta: "जीआई तार" },
  "rat-jaali-customer": { title: "एक ग्राहक, कैमरे पर", note: "चूहा जाली, हमारे ग्राहक की ज़ुबानी।" },
};

function ReelCard({ reel: base }: { reel: Reel }) {
  const { lang } = useLang();
  const reel: Reel = lang === "hi" && REELS_HI[base.id] ? { ...base, ...REELS_HI[base.id] } : base;
  // The poster is fetched only when the card is near the viewport, not for all twelve at page load.
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Warm the first bytes of a reel just before it scrolls into view, so a tap starts instantly.
  useEffect(() => {
    const v = ref.current;
    if (!v || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.poster = `/reels/${reel.id}.jpg`;
          v.preload = "metadata";
          io.disconnect();
        }
      },
      { rootMargin: "0px 400px 0px 400px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reel.id]);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      document.querySelectorAll<HTMLVideoElement>("video[data-reel]").forEach((o) => o !== v && o.pause());
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <figure className="w-[62vw] max-w-[280px] shrink-0 snap-start sm:w-[260px]">
      <button
        type="button"
        onClick={toggle}
        aria-label={lang === "hi" ? `रील ${playing ? "रोकें" : "चलाएँ"}: ${reel.title}` : `${playing ? "Pause" : "Play"} reel: ${reel.title}`}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[22px] bg-[#0b121a] ring-1 ring-white/10"
      >
        <video
          ref={ref}
          data-reel
          className="h-full w-full object-cover"
          preload="none"
          playsInline
          loop
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        >
          <source src={`/reels/${reel.id}.mp4`} type="video/mp4" />
        </video>
        <span
          className={
            "absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity " +
            (playing ? "opacity-0 group-hover:opacity-100" : "opacity-100")
          }
          aria-hidden="true"
        >
          <span className="glass flex h-16 w-16 items-center justify-center rounded-full">
            <Play className="ml-1 h-7 w-7" />
          </span>
        </span>
      </button>
      <figcaption className="mt-3">
        <span className="block font-display text-2xl font-extrabold uppercase leading-none text-foreground">{reel.title}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{reel.note}</span>
        {reel.href && (
          <Link href={reel.href} className="mt-1 inline-block text-sm font-bold text-foreground underline underline-offset-4 hover:text-primary">
            {reel.cta}
          </Link>
        )}
      </figcaption>
    </figure>
  );
}

export function ReelsSection() {
  const { lang } = useLang();
  const hi = lang === "hi";
  return (
    <section className="border-y border-border py-9 md:py-20" aria-labelledby="reels-heading">
      <div className="page-container">
        <p className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {hi ? "दुकान के फ़र्श से" : "From the shop floor"}
        </p>
        <h2 id="reels-heading" data-reveal className="mt-2 max-w-3xl text-foreground">
          {hi ? "खरीदने से पहले देख लीजिए" : "See it before you buy it"}
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          {hi
            ? "असली स्टॉक, असली ग्राहक, हमारे सियागंज काउंटर पर पूरी क्वालिटी में फ़िल्माए गए। आवाज़ के साथ चलाने के लिए रील पर टैप कीजिए, और ज़्यादा देखने के लिए बगल में स्क्रोल कीजिए।"
            : "Real stock, real customers, filmed at our Siyaganj counter in full resolution. Tap a reel to play with sound, and scroll sideways for more."}
        </p>
      </div>
      <div className="mt-10 overflow-x-auto pb-4 [scrollbar-width:thin]" tabIndex={0} aria-label={hi ? "रील, बगल में स्क्रोल करें" : "Reels, scroll sideways"}>
        <div className="page-container">
          <div className="flex snap-x snap-mandatory gap-4 sm:gap-6">
            {REELS.map((r) => (
              <ReelCard key={r.id} reel={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
