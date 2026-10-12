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
        <Link href={`/contact?product=${page.productSlugs[0] ?? ""}`} className={btnMain}>Get a quote</Link>
        <a href={getWhatsAppLink(site.whatsapp, waMessage)} target="_blank" rel="noopener noreferrer" className={btnGhostDark}>
          WhatsApp for a rate
        </a>
      </PageHero>

      <section className="py-14 md:py-20">
        <div className="page-container grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            {page.intro2 && <p className="text-lg leading-relaxed text-muted-foreground">{page.intro2}</p>}
            <p className="mt-4 text-muted-foreground">
              We are in <strong className="text-foreground">Siyaganj, Indore</strong>, and supply Indore, Dewas, Ujjain, Mhow, Pithampur and nearby areas.
            </p>

            {page.specs.length > 0 && (
              <>
                <h2 className="mt-12 text-foreground">What we offer</h2>
                <ul className="mt-5 divide-y divide-border border-y border-border">
                  {page.specs.map((s) => (
                    <li key={s} className="py-3.5 text-foreground">{s}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside>
            {page.useCases.length > 0 && (
              <div className="rounded-sm border border-border bg-card p-6">
                <h2 className="text-foreground" style={{ fontSize: "1.9rem" }}>Used for</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {page.useCases.map((u) => (
                    <li key={u} className="rounded-sm border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground">
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {products.length > 0 && (
        <section className="border-t border-border bg-card py-14 md:py-20" aria-labelledby="related-heading">
          <div className="page-container">
            <h2 id="related-heading" className="text-foreground">Related products</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => {
                const img = getProductImages(p, getCategoryBySlug(p.categorySlug))[0];
                return (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} className="group block overflow-hidden rounded-sm border border-border bg-background">
                      <span className="relative block aspect-[4/3] bg-secondary">
                        {img && <Image src={img} alt="" fill sizes="(max-width:640px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                      </span>
                      <span className="block p-4 font-display text-2xl font-extrabold uppercase leading-none text-foreground">{p.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <div className="page-container py-14 md:py-20">
        <ReviewsList max={3} productSlug={page.productSlugs[0]} />
      </div>

      <section className="bg-nav py-14 text-white md:py-20">
        <div className="page-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="text-white">Need {page.h1.replace(/ in Indore$/, "")}?</h2>
          <Link href={`/contact?product=${page.productSlugs[0] ?? ""}`} className={btnMain}>Get a quote</Link>
        </div>
      </section>
    </>
  );
}
