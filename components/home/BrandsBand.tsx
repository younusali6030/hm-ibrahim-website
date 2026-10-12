import Link from "@/components/LocaleLink";
import Image from "next/image";
import { brandPageVisuals } from "@/content/brandPages";
import { StencilTag } from "@/components/motif/Motif";
import { getBrandById } from "@/content/brands";
import { T } from "@/lib/i18n";
import { tt, type Lang } from "@/lib/locale";
import { localize } from "@/lib/localize";

export function BrandsBand({ lang = "en" }: { lang?: Lang }) {
  const t = tt(lang);
  const ITEMS = [
    { id: "cm", name: t("CM", "सीएम"), blurb: t("Barbed wire and chain link, our own brand.", "कांटेदार तार और चेन लिंक, हमारा अपना ब्रांड।") },
    {
      id: "border",
      name: t("Border", "बॉर्डर"),
      blurb: localize(getBrandById("border")?.pageContent?.prominentTagline, lang) ?? t("Built for strength. Designed for security.", "मज़बूती के लिए बना। सुरक्षा के लिए तैयार।"),
    },
  ] as const;
  return (
    <section className="border-y border-border py-9 text-white md:py-20" aria-labelledby="brands-heading">
      <div className="page-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60"><T en="Our brands" hi="हमारे ब्रांड" /></p>
            <h2 id="brands-heading" className="mt-2 text-white"><T en="Fencing that carries our name" hi="फेंसिंग जिस पर हमारा नाम है" /></h2>
          </div>
          <Link href="/brands" className="inline-flex min-h-[44px] items-center font-semibold text-white underline decoration-primary underline-offset-4 hover:text-primary">
            <T en="All brands we stock" hi="हमारे पास उपलब्ध सभी ब्रांड" />
          </Link>
        </div>
        <ul className="mt-5 grid gap-3 md:mt-8 md:grid-cols-2 md:gap-4">
          {ITEMS.map((it) => {
            const v = brandPageVisuals[it.id];
            if (!v) return null;
            return (
              <li key={it.id} data-reveal>
                <Link
                  href={`/brands/${it.id}`}
                  className="group relative block aspect-[16/8] overflow-hidden rounded-sm md:aspect-[16/9] bg-[#0b121a]"
                >
                  <Image src={v.hero.src} alt={v.hero.alt} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#0b121a]/95 via-[#0b121a]/30 to-transparent" aria-hidden="true" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                    <span>
                      <StencilTag className="!text-white/80">{it.name} · {t("Own brand", "अपना ब्रांड")}</StencilTag>
                      <span className="mt-2 block font-display text-4xl font-extrabold uppercase leading-none">{it.name}</span>
                      <span className="mt-1 block text-sm text-white/85">{it.blurb}</span>
                    </span>
                    <span className="relative block h-12 w-20 shrink-0">
                      <Image src={v.logoClear} alt="" fill sizes="80px" className="object-contain object-right" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
