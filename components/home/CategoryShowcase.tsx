import Link from "next/link";
import Image from "next/image";
import { categories, getCategoryThumbnails } from "@/content/products";

export function CategoryShowcase() {
  return (
    <section className="py-14 md:py-20" aria-labelledby="categories-heading">
      <div className="page-container">
        <p data-reveal className="font-mono-brand text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          The counter
        </p>
        <h2 id="categories-heading" data-reveal className="mt-2 max-w-3xl text-foreground">
          Every wire, mesh, sheet and bar a build calls for
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          In stock at our Siyaganj counter, for retail and wholesale. Choose a category, then ask for a rate.
        </p>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.slice(0, 6).map((cat, i) => {
            const src = getCategoryThumbnails(cat, 1)[0]?.src ?? cat.image;
            return (
              <li key={cat.slug} data-reveal style={{ ["--rd" as string]: `${(i % 4) * 80}ms` }} className={i === 0 ? "col-span-2" : ""}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-sm bg-secondary focus-visible:outline-2"
                >
                  {src && (
                    <Image
                      src={src}
                      alt={cat.imageAlt || `${cat.name} at H M Ibrahim & Co`}
                      fill
                      sizes={i === 0 ? "(max-width:1024px) 100vw, 50vw" : "(max-width:1024px) 50vw, 25vw"}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  )}
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-[#0b121a]/90 via-[#0b121a]/25 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <span className="block font-display text-2xl font-extrabold uppercase leading-none text-white sm:text-3xl">
                      {cat.name}
                    </span>
                    <span className="mt-2 inline-block text-sm font-semibold text-white/85 transition-colors group-hover:text-primary">
                      See range
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
          <li data-reveal>
            <Link
              href="/products"
              className="group flex aspect-[4/3] flex-col items-start justify-end rounded-sm bg-primary p-4 text-primary-foreground transition hover:brightness-110 sm:p-5"
            >
              <span className="block font-display text-2xl font-extrabold uppercase leading-none sm:text-3xl">
                All {categories.length} categories
              </span>
              <span className="mt-2 inline-block text-sm font-bold">Browse the full range</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
