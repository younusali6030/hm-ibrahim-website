import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/LocaleLink";
import { reels, reelText, clock } from "@/content/reels";
import { buildPageMeta, pageUrl } from "@/lib/seo";
import { tt, type Lang } from "@/lib/locale";
import { itemList } from "@/lib/schema";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PageHero } from "@/components/site/PageHero";
import { ContactStrip } from "@/components/story/ContactStrip";
import "@/components/story/story.css";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const lang = (await props.params).lang as Lang;
  return buildPageMeta({
    lang,
    path: "videos",
    title: "Shop Videos: Wire, Mesh, Jali and Nails, Indore",
    description:
      "Short videos filmed at HM Ibrahim & Co, Siyaganj, Indore: kabootar jali, mosquito net, binding wire, FRP bars, weldmesh, nails and customers on camera.",
    hi: {
      title: "दुकान के वीडियो: तार, जाली और कीलें, इंदौर",
      description: "एचएम इब्राहिम एंड कंपनी, सियागंज, इंदौर में फ़िल्माए छोटे वीडियो: कबूतर जाली, मच्छर जाली, बाइंडिंग तार, एफआरपी बार, वेल्डमेश, कीलें और ग्राहक।",
    },
  });
}

export default async function VideosPage(props: Props) {
  const lang = (await props.params).lang as Lang;
  const t = tt(lang);
  return (
    <>
      <SeoJsonLd
        data={itemList(
          t("Videos from HM Ibrahim & Co, Siyaganj, Indore", "एचएम इब्राहिम एंड कंपनी, सियागंज, इंदौर के वीडियो"),
          reels.map((r) => ({ name: reelText(r, lang).title, url: pageUrl(`videos/${r.id}`, lang) }))
        )}
        lang={lang}
      />
      <PageHero
        compact
        eyebrow={t("Videos", "वीडियो")}
        title={t("See it before you buy it", "खरीदने से पहले देख लीजिए")}
        lede={t(
          "Real stock and real customers, filmed at our counter on Siyaganj Main Road, Indore. Each video has its own page with the product it shows.",
          "असली माल और असली ग्राहक, सियागंज मेन रोड, इंदौर के हमारे काउंटर पर फ़िल्माए गए। हर वीडियो का अपना पेज है, उसमें दिखे उत्पाद के साथ।"
        )}
      />
      <section className="st-sec" aria-label={t("All videos", "सभी वीडियो")}>
        <div className="page-container">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {reels.map((r, i) => {
              const rt = reelText(r, lang);
              return (
                <li key={r.id}>
                  <Link href={`/videos/${r.id}`} className="group block rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <span className="relative block aspect-[9/16] overflow-hidden rounded-[14px] bg-secondary ring-1 ring-border">
                      <Image
                        src={`/reels/${r.id}.jpg`}
                        alt=""
                        fill
                        priority={i < 2}
                        sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                        className="object-cover transition-transform group-hover:scale-[1.03]"
                      />
                      <span className="absolute bottom-2 right-2 rounded-sm bg-black/70 px-1.5 py-0.5 font-mono-brand text-xs text-white">{clock(r.duration)}</span>
                    </span>
                    <span className="mt-3 block font-display text-xl font-extrabold uppercase leading-none text-foreground group-hover:text-primary">{rt.short}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{rt.note}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <ContactStrip headingId="close-heading" />
    </>
  );
}
