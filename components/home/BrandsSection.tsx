import Link from "next/link";
import { stockedBrands } from "@/content/stockedBrands";

/** Other makers on the shelf, as a plain ruled list from content/stockedBrands.ts. */
export function BrandsSection() {
  return (
    <section className="py-12 md:py-16" aria-labelledby="brands-heading">
      <div className="page-container">
        <h2 id="brands-heading" className="text-foreground">Brands we stock</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Stock changes, so check availability with us for the brand you need.
        </p>
        <ul className="mt-6 border-t border-foreground/40">
          {stockedBrands.map((b) => (
            <li key={b.name} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border py-3">
              <span className="font-semibold text-foreground">{b.name}</span>
              <span className="text-sm text-muted-foreground">{b.specialty}</span>
            </li>
          ))}
        </ul>
        <Link href="/brands" className="mt-5 inline-flex min-h-[44px] items-center font-semibold text-foreground underline decoration-primary underline-offset-4">
          All brands
        </Link>
      </div>
    </section>
  );
}
