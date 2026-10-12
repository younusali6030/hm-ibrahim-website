import Link from "next/link";
import { site } from "@/content/site";
import { categories } from "@/content/products";
import { getWhatsAppLink } from "@/lib/utils";
import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { SectionHead } from "@/components/story/SectionHead";
import { T } from "@/lib/i18n";
import "@/components/story/story.css";

export default function NotFound() {
  const tel = `tel:${site.phone.replace(/\s/g, "")}`;
  return (
    <>
      <PageHero
        eyebrow={<T en="404 · Page not found" hi="404 · पेज नहीं मिला" />}
        title={<T en="That shutter is down." hi="यह शटर बंद है।" />}
        lede="The link may be old, or the page may have moved. Search the products, or ask the counter. We will find it."
        compact
      >
        <form action="/products" method="get" role="search" className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          <label htmlFor="nf-q" className="sr-only">Search products</label>
          <input
            id="nf-q"
            name="q"
            type="search"
            placeholder="Wire, mesh, angle, TMT..."
            className="min-h-[52px] w-full rounded-[6px] border border-white/40 bg-white/5 px-4 text-white placeholder:text-white/60"
          />
          <button type="submit" className={btnMain + " shrink-0"}>
            <T en="Search" hi="खोजें" />
          </button>
        </form>
      </PageHero>

      <section className="st-sec" aria-labelledby="nf-cats">
        <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHead eyebrow="Or pick a shelf" id="nf-cats" title="Browse by category" />
          <ul className="st-ledger self-start sm:columns-2 sm:gap-x-10">
            {categories.map((c) => (
              <li key={c.slug} className="break-inside-avoid border-b border-border">
                <Link href={`/categories/${c.slug}`} className="flex min-h-[48px] items-center font-semibold text-foreground hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="st-sec st-sec-tint pb-28 md:pb-20" aria-labelledby="nf-ask">
        <div className="page-container">
          <SectionHead eyebrow="Ask the counter" id="nf-ask" title="Still not found?" lede="Tell us what you were looking for. Mon to Sat, 9 to 8." />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={tel} className={btnMain}>
              <T en={`Call ${site.phone}`} hi={`कॉल करें ${site.phone}`} />
            </a>
            <a
              href={getWhatsAppLink(site.whatsapp, "Hi, I could not find a page on your website. I was looking for: ")}
              target="_blank"
              rel="noopener noreferrer"
              className={btnGhostDark}
            >
              WhatsApp<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Link href="/" className={btnGhostDark}>
              <T en="Back to home" hi="होम पर जाएँ" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
