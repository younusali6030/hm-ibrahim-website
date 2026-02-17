import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/content/products";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { PrintCatalogButton } from "@/components/catalog/PrintCatalogButton";

export const metadata: Metadata = {
  title: "Product Catalog",
  description: `Product catalog — ${site.name}. Iron, steel, pipes, wire, mesh, and hardware. Siyaganj, Indore.`,
};

export default function CatalogPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hmibrahimco.com";

  return (
    <div className="catalog-page">
      <div className="no-print container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Product Catalog</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Download or print this catalog for reference. Contact us for pricing and availability.
            </p>
          </div>
          <PrintCatalogButton />
        </div>
      </div>

      <div className="catalog-print-area bg-white text-gray-900 print:block">
        <div className="mx-auto max-w-4xl px-6 py-8 print:px-8 print:py-12">
          {/* Header */}
          <header className="mb-10 border-b-2 border-gray-800 pb-6">
            <h1 className="text-3xl font-bold text-gray-900">{site.name}</h1>
            <p className="mt-1 text-lg text-gray-600">{site.tagline}</p>
            <p className="mt-2 text-sm text-gray-600">{site.manufacturerTagline}</p>
            <div className="mt-4 grid gap-1 text-sm text-gray-700 sm:grid-cols-2">
              <p>{site.fullAddress}</p>
              <p>Landmark: {site.landmark}</p>
              <p>Phone: {site.phone} {site.phoneLabel && `(${site.phoneLabel})`}</p>
              {site.phoneAlt && <p>Phone: {site.phoneAlt} {site.phoneAltLabel && `(${site.phoneAltLabel})`}</p>}
              <p>WhatsApp: {site.whatsapp}</p>
              <p>Email: {site.email} {site.emailLabel && `(${site.emailLabel})`}</p>
              {site.emailAlt && <p>Email: {site.emailAlt} {site.emailAltLabel && `(${site.emailAltLabel})`}</p>}
              <p>
                Hours: {site.hours.weekdays} | {site.hours.sunday}
              </p>
            </div>
          </header>

          {/* Categories & Products */}
          <div className="space-y-10">
            {categories.map((category) => (
              <section key={category.slug}>
                <h2 className="mb-4 text-xl font-bold text-gray-900">{category.name}</h2>
                <p className="mb-6 text-sm text-gray-600">{category.description}</p>

                <div className="space-y-6">
                  {category.products.map((product) => (
                    <div
                      key={product.slug}
                      className="break-inside-avoid border-b border-gray-200 pb-6 last:border-0"
                    >
                      <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-700">{product.shortDesc}</p>

                      {product.specs && product.specs.length > 0 && (
                        <dl className="mt-3 space-y-1 text-sm">
                          {product.specs.map((spec) => (
                            <div key={spec.label} className="flex gap-2">
                              <dt className="font-medium text-gray-700">{spec.label}:</dt>
                              <dd className="text-gray-600">{spec.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                        {product.sizes && product.sizes.length > 0 && (
                          <span>
                            <strong>Sizes:</strong> {product.sizes.slice(0, 8).join(", ")}
                            {product.sizes.length > 8 ? "…" : ""}
                          </span>
                        )}
                        {product.variants && product.variants.length > 0 && (
                          <span>
                            <strong>Variants:</strong> {product.variants.join(", ")}
                          </span>
                        )}
                        {(product.tataOfficial || product.tataAvailable) && (
                          <span className="font-medium">Tata available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-12 border-t-2 border-gray-800 pt-6 text-center text-sm text-gray-600">
            <p className="font-semibold text-gray-900">{site.name}</p>
            <p>{site.fullAddress}</p>
            <p className="mt-1">
              Phone: {site.phone} ({site.phoneLabel}) / {site.phoneAlt} ({site.phoneAltLabel}) | WhatsApp: {site.whatsapp} | Email: {site.email} ({site.emailLabel}) / {site.emailAlt} ({site.emailAltLabel})
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Request a quote: {baseUrl}/quote | Contact: {baseUrl}/contact
            </p>
          </footer>
        </div>
      </div>

      {/* Print button for screen view - inside printable area as duplicate for visibility */}
      <div className="no-print container mx-auto px-4 pb-12">
        <div className="flex flex-wrap gap-4">
          <PrintCatalogButton />
          <a
            href={getWhatsAppLink(site.whatsapp, "Hi, I'd like to request a quote. I've gone through your catalog.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            WhatsApp for Quote
          </a>
          <Link href="/quote" className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">
            Request a Quote
          </Link>
        </div>
      </div>
    </div>
  );
}

