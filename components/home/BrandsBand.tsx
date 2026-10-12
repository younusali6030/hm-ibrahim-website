import Link from "next/link";
import Image from "next/image";
import { brandPageVisuals } from "@/content/brandPages";

const ITEMS = [
  { id: "cm", name: "CM", blurb: "Barbed wire and chain link, our own brand." },
  { id: "border", name: "Border", blurb: "Built for strength. Designed for security." },
] as const;

export function BrandsBand() {
  return (
    <section className="border-y border-border py-14 text-white md:py-20" aria-labelledby="brands-heading">
      <div className="page-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono-brand text-xs uppercase tracking-[0.16em] text-white/60">Our brands</p>
            <h2 id="brands-heading" className="mt-2 text-white">Fencing that carries our name</h2>
          </div>
          <Link href="/brands" className="font-semibold text-white underline underline-offset-4 hover:text-primary">
            All brands we stock
          </Link>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {ITEMS.map((it) => {
            const v = brandPageVisuals[it.id];
            if (!v) return null;
            return (
              <li key={it.id} data-reveal>
                <Link
                  href={`/brands/${it.id}`}
                  className="group relative block aspect-[16/9] overflow-hidden rounded-sm bg-[#0b121a]"
                >
                  <Image src={v.hero.src} alt={v.hero.alt} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#0b121a]/95 via-[#0b121a]/30 to-transparent" aria-hidden="true" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                    <span>
                      <span className="block font-display text-4xl font-extrabold uppercase leading-none">{it.name}</span>
                      <span className="mt-1 block text-sm text-white/80">{it.blurb}</span>
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
