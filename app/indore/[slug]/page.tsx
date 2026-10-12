import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { indorePageSlugs, getIndorePage } from "@/content/indorePages";
import { getProductBySlug, getProductImages, getCategoryBySlug } from "@/content/products";
import { site, baseUrl } from "@/lib/site";
import { getWhatsAppLink } from "@/lib/utils";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { ReviewsList } from "@/components/trust/ReviewsList";
import { SectionHead } from "@/components/story/SectionHead";
import { ContactStrip } from "@/components/story/ContactStrip";
import { T } from "@/lib/i18n";
import "@/components/story/story.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return indorePageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getIndorePage(slug);
  if (!page) return { title: "Products in Indore" };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `${baseUrl}/indore/${page.slug}` },
  };
}

export default async function IndoreLandingPage({ params }: Props) {
  const { slug } = await params;
  const page = getIndorePage(slug);
  if (!page) notFound();

  const products = page.productSlugs.map((s) => getProductBySlug(s)).filter((p): p is NonNullable<typeof p> => !!p);
  const hero = products[0] ? getProductImages(products[0], getCategoryBySlug(products[0].categorySlug))[0] : undefined;
  const waMessage = `Hi, I'm interested in ${page.h1.replace(/ in Indore$/, "")}. Please share price and availability.`;

  return (
    <>
      <JsonLdBreadcrumb
        items={[
          { name: "Home", url: "/" },
          { name: "Indore", url: "/indore" },
          { name: page.h1, url: `/indore/${page.slug}` },
        ]}
      />
      <PageHero
        eyebrow={
          <>
            <Link href="/indore" className="hover:text-white">Indore</Link> / {page.h1}
          </>
        }
        title={page.h1}
        lede={page.intro}
        compact
        image={hero ? { src: hero, alt: `${page.h1} from H M Ibrahim & Co, Siyaganj` } : undefined}
      >
        <Link href={`/contact?product=${page.productSlugs[0] ?? ""}`} className={btnMain}><T en="Get a quote" hi="कोटेशन पाएँ" /></Link>
        <a href={getWhatsAppLink(site.whatsapp, waMessage)} target="_blank" rel="noopener noreferrer" className={btnGhostDark}>
          WhatsApp for a rate
        </a>
      </PageHero>

      <section className="st-sec">
        <div className="page-container grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            {page.intro2 && <p className="text-lg leading-relaxed text-muted-foreground">{page.intro2}</p>}
            <p className="mt-4 text-muted-foreground">
              We are in <strong className="text-foreground">Siyaganj, Indore</strong>, and supply Siyaganj, Loha Mandi, New Siyaganj, Dewas, Ujjain, Mhow, Pithampur and nearby areas.
            </p>

            {page.specs.length > 0 && (
              <>
                <h2 className="mt-12 text-foreground">What we offer</h2>
                <ul className="st-ledger mt-5">
                  {page.specs.map((s) => (
                    <li key={s} className="border-b border-border py-3.5 text-foreground">{s}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside>
            {page.useCases.length > 0 && (
              <>
                <p className="st-eyebrow">Used for</p>
                <ul className="st-ledger mt-4">
                  {page.useCases.map((u) => (
                    <li key={u} className="border-b border-border py-3 font-semibold text-foreground">{u}</li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        </div>
      </section>

      {products.length > 0 && (
        <section className="st-sec st-sec-tint" aria-labelledby="related-heading">
          <div className="page-container">
            <SectionHead eyebrow="Product pages" id="related-heading" title="Related products" />
            <ul className="st-ledger mt-8" style={{ ["--st-cols" as string]: "6rem minmax(0,1fr) auto" }}>
              {products.map((p) => {
                const img = getProductImages(p, getCategoryBySlug(p.categorySlug))[0];
                return (
                  <li key={p.slug} className="st-row items-center !py-4">
                    <span className="relative block aspect-[4/3] w-24 overflow-hidden rounded-[10px] bg-secondary">
                      {img && <Image src={img} alt="" fill sizes="96px" className="object-cover" />}
                    </span>
                    <h3 className="st-title" style={{ fontSize: "1.5rem" }}>{p.name}</h3>
                    <Link href={`/products/${p.slug}`} className="st-link">
                      Ask for rate<span className="sr-only">: {p.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <div className="page-container st-sec">
        <ReviewsList max={3} productSlug={page.productSlugs[0]} />
      </div>

      <ContactStrip
        heading={`Need ${page.h1.replace(/ in Indore$/, "")}?`}
        quoteHref={`/contact?product=${page.productSlugs[0] ?? ""}`}
        waMessage={waMessage}
      />
    </>
  );
}
