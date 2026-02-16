import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { inHouseBrands, getBrandById } from "@/content/brands";
import type { BrandId } from "@/content/brands";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

const validSlugs: BrandId[] = ["cm", "boarder"];

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandById(slug as BrandId);
  if (!brand?.pageContent) return { title: "Brand" };
  return {
    title: brand.pageContent.title,
    description: brand.pageContent.subtitle,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  if (!validSlugs.includes(slug as BrandId)) notFound();

  const brand = getBrandById(slug as BrandId);
  if (!brand?.pageContent) notFound();

  const { title, subtitle, body, prominentTagline } = brand.pageContent;

  return (
    <div className="container mx-auto px-4 py-16 md:py-20">
      <nav className="mb-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/#inhouse-brands-heading" className="hover:text-primary">
              Our Brands
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{brand.name}</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-3xl">
        <div className="flex justify-center">
          <span className="relative h-24 w-48">
            <Image
              src={brand.logo}
              alt={brand.name}
              width={192}
              height={96}
              className="object-contain"
              priority
            />
          </span>
        </div>

        <h1 className="mt-8 text-4xl font-bold text-foreground md:text-5xl">{title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>

        {prominentTagline && (
          <p className="mt-6 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-center font-medium italic text-foreground">
            {prominentTagline}
          </p>
        )}

        <div className="mt-10 space-y-4 text-muted-foreground leading-relaxed">
          {body.split(/\n\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <section className="mt-12 rounded-xl border border-border bg-card/50 p-6" aria-labelledby="brand-cta-heading">
          <h2 id="brand-cta-heading" className="text-lg font-semibold text-foreground">
            Explore {brand.name} products
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Barbed wire and chain link fencing (jali) available under {brand.name}.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button asChild>
              <Link href={`/products/barbed-wire`}>View Barbed Wire</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/products/chain-link-fencing`}>View Chain Link Fencing</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={`/quote?brand=${brand.id}`}>Request a Quote</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
