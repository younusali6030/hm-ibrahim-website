import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/seo";
import Link from "@/components/LocaleLink";
import Image from "next/image";
import { categories, getProductImages, getCategoryBySlug } from "@/content/products";
import { baseUrl, site } from "@/lib/site";
import { getWhatsAppLink } from "@/lib/utils";
import { PrintCatalogButton } from "@/components/catalog/PrintCatalogButton";
import { PageHero, btnGhostDark } from "@/components/site/PageHero";
import { T } from "@/lib/i18n";
import { localize } from "@/lib/localize";
import { tt, type Lang } from "@/lib/locale";
import { pageUrl } from "@/lib/seo";
import { siteText } from "@/content/hi/site";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  return buildPageMeta({
    lang: params.lang as Lang,
    title: "Product Catalog",
    description: `Printable product catalog from ${site.name}: iron, steel, pipes, wire, mesh and hardware. Siyaganj, Indore. Ask for the rate.`,
    path: "catalog",
  });
}

export default async function CatalogPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang as Lang;
  const t = tt(lang);
  const hi = lang === "hi";
  const cats = localize(categories, lang);
  const s = siteText(lang);

  return (
    <div className="catalog-page">
      <div className="no-print">
        <PageHero
          eyebrow={<T en="Catalog · Print or save" hi="कैटलॉग · प्रिंट या सेव करें" />}
          title={<T en="Product catalog" hi="प्रोडक्ट कैटलॉग" />}
          lede={t("Print this sheet or save it as a PDF for reference. Prices are not listed: ask for the rate and we will quote on the day.", "इस शीट को प्रिंट कीजिए या हवाले के लिए पीडीएफ़ सेव कर लीजिए। भाव नहीं लिखे हैं: रेट पूछिए, हम उसी दिन का भाव बताएँगे।")}
          compact
        >
          <span className="contents [&>button]:min-h-[52px] [&>button]:rounded-sm [&>button]:px-7 [&>button]:text-base [&>button]:font-bold"><PrintCatalogButton /></span>
          <Link href="/contact" className={btnGhostDark}><T en="Get a quote" hi="कोटेशन पाएँ" /></Link>
        </PageHero>
      </div>

      <div className="catalog-print-area mx-auto my-10 max-w-4xl overflow-hidden rounded-[10px] bg-white text-gray-900 shadow-2xl ring-1 ring-white/10 print:my-0 print:block print:max-w-none print:rounded-none print:shadow-none">
        <div className="px-4 py-6 sm:px-8 sm:py-10 print:px-8 print:py-12">
          {/* Header */}
          <header className="mb-10 border-b-2 border-gray-800 pb-6">
            <Image src="/logo-dark.png" alt="" width={240} height={83} className="h-20 w-auto object-contain print:h-16" />
            <p className="mt-3 text-3xl font-bold text-gray-900">{s.name}</p>
            <p className="mt-1 text-lg text-gray-600">{s.tagline}</p>
            <p className="mt-2 text-sm text-gray-600">{s.manufacturerTagline}</p>
            <div className="mt-4 grid gap-1 text-sm text-gray-700 sm:grid-cols-2">
              <p>{s.fullAddress}</p>
              <p>{t("Landmark", "पहचान")}: {s.landmark}</p>
              <p>{t("Phone", "फ़ोन")}: {site.phone} {s.phoneLabel && `(${s.phoneLabel})`}</p>
              {site.phoneAlt && <p>{t("Phone", "फ़ोन")}: {site.phoneAlt} {s.phoneAltLabel && `(${s.phoneAltLabel})`}</p>}
              <p>{t("WhatsApp", "व्हाट्सएप")}: {site.whatsapp}</p>
              <p>{t("Email", "ईमेल")}: {site.email} {s.emailLabel && `(${s.emailLabel})`}</p>
              {site.emailAlt && <p>{t("Email", "ईमेल")}: {site.emailAlt} {s.emailAltLabel && `(${s.emailAltLabel})`}</p>}
              <p>
                {t("Hours", "समय")}: {s.hours.weekdays} | {s.hours.sunday}
              </p>
            </div>
          </header>

          {/* Categories & Products */}
          <div className="space-y-10">
            {cats.map((category) => (
              <section key={category.slug}>
                <h2 className="mb-4 text-xl font-bold text-gray-900">{category.name}</h2>
                <p className="mb-6 text-sm text-gray-600">{category.description}</p>

                <div className="space-y-6">
                  {category.products.map((product) => {
                    const productImages = getProductImages(product, category).slice(0, 2); // Max 2 images
                    return (
                      <div
                        key={product.slug}
                        className="break-inside-avoid border-b border-gray-200 pb-6 last:border-0"
                      >
                        <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
                        <p className="mt-1 text-sm text-gray-700">{product.shortDesc}</p>

                        {/* Product Images - Max 2, small size for catalog */}
                        {productImages.length > 0 && (
                          <div className="mt-3 flex gap-2 print:gap-1">
                            {productImages.map((imgSrc, idx) => (
                              <div
                                key={`${product.slug}-img-${idx}`}
                                className="relative h-20 w-20 shrink-0 overflow-hidden rounded border border-gray-300 print:h-16 print:w-16"
                              >
                                <Image
                                  src={imgSrc}
                                  alt={hi ? `${product.name} - फ़ोटो ${idx + 1}` : `${product.name} - Image ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                  quality={75}
                                  unoptimized={false}
                                />
                              </div>
                            ))}
                          </div>
                        )}

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
                            <strong>{t("Sizes", "साइज़")}:</strong> {product.sizes.slice(0, 8).join(", ")}
                            {product.sizes.length > 8 ? "…" : ""}
                          </span>
                        )}
                        {product.variants && product.variants.length > 0 && (
                          <span>
                            <strong>{t("Variants", "किस्में")}:</strong> {product.variants.join(", ")}
                          </span>
                        )}
                        {(product.tataOfficial || product.tataAvailable) && (
                          <span className="font-medium">{t("Tata available", "टाटा उपलब्ध")}</span>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-12 border-t-2 border-gray-800 pt-6 text-center text-sm text-gray-600">
            <Image src="/logo-dark.png" alt="" width={160} height={55} className="mx-auto mb-3 h-12 w-auto object-contain print:h-10" />
            <p className="font-semibold text-gray-900">{s.name}</p>
            <p>{s.fullAddress}</p>
            <p className="mt-1">
              {t("Phone", "फ़ोन")}: {site.phone} ({s.phoneLabel}) / {site.phoneAlt} ({s.phoneAltLabel}) | {t("WhatsApp", "व्हाट्सएप")}: {site.whatsapp} | {t("Email", "ईमेल")}: {site.email} ({s.emailLabel}) / {site.emailAlt} ({s.emailAltLabel})
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {t("Request a quote", "कोटेशन माँगें")}: {pageUrl("contact", lang)} | {t("Contact", "संपर्क")}: {pageUrl("contact", lang)}
            </p>
          </footer>
        </div>
      </div>

      {/* Print button for screen view - inside printable area as duplicate for visibility */}
      <div className="no-print page-container pb-28 md:pb-16">
        <div className="flex flex-wrap gap-4">
          <span className="contents [&>button]:min-h-[52px] [&>button]:rounded-sm [&>button]:px-7 [&>button]:text-base [&>button]:font-bold"><PrintCatalogButton /></span>
          <a
            href={getWhatsAppLink(site.whatsapp, t("Hi, I would like a quote. I have gone through your catalog.", "नमस्ते, मैं कोटेशन माँगना चाहता हूँ। मैंने आपका कैटलॉग देख लिया है।"))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center rounded-sm border border-input px-5 font-semibold text-foreground hover:border-foreground/50"
          >
            {t("WhatsApp for a quote", "कोटेशन के लिए व्हाट्सएप")}
          </a>
          <Link href="/contact" className="inline-flex min-h-[48px] items-center rounded-sm border border-input px-5 font-semibold text-foreground hover:border-foreground/50">
            {t("Request a Quote", "कोटेशन माँगें")}
          </Link>
        </div>
      </div>
    </div>
  );
}

