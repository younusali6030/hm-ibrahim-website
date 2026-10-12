"use client";

import { useState, useMemo, useEffect, type ReactNode } from "react";
import Link from "@/components/LocaleLink";
import { Phone, MessageCircle } from "lucide-react";
import { getProductImages, getProductMedia, getBrandVariant } from "@/content/products";
import { getBrandById } from "@/content/brands";
import type { Product, Category } from "@/content/products";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductBrandPicker } from "@/components/product/ProductBrandPicker";
import { LookingForMoreSection } from "@/components/LookingForMoreSection";
import { StencilTag, CounterStamp, GaugeRule } from "@/components/motif/Motif";
import { buildSheet, isCutToSize, trimRepeatedPacking } from "@/components/product/specSheet";
import type { BrandId } from "@/content/brands";
import { trackProductView, trackCallClick, trackWhatsAppClick } from "@/lib/analytics";
import { T, useT, useLang } from "@/lib/i18n";

type Props = {
  product: Product;
  category: Category | null;
  defaultImages: string[];
  /** { english: hindi } for the strings of this product, category and brands. Empty in English. */
  tx?: Record<string, string>;
  /** Server-rendered reviews, shown under the photos. */
  reviews?: ReactNode;
};

const ASK = "Ask at counter";
const btn =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm px-5 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function ProductDetailClient({ product, category, tx = {}, reviews }: Props) {
  const t = useT();
  const { lang } = useLang();
  const hi = lang === "hi";
  // The page logic below runs on the English record (spec labels are matched by pattern); only display is translated.
  const L = (s: string): string => tx[s] ?? s;
  const Lj = (s: string): string => (tx[s] ? tx[s] : s.includes(", ") ? s.split(", ").map(L).join(", ") : s);
  useEffect(() => {
    trackProductView(product.slug, product.name, category?.name);
  }, [product.slug, product.name, category?.name]);

  const hasBrandVariants = !!product.brandVariants && product.brandVariants.length > 0;
  const firstBrandId = hasBrandVariants ? (product.brandVariants![0].brandId as BrandId) : null;
  const [selectedBrandId, setSelectedBrandId] = useState<BrandId | null>(firstBrandId);

  const media = useMemo(
    () => getProductMedia(product, category, selectedBrandId ?? undefined),
    [product, category, selectedBrandId]
  );

  const variant = selectedBrandId ? getBrandVariant(product, selectedBrandId) : null;
  const displayUseCases = variant?.useCases ?? product.useCases;
  const displayNotes = variant?.notes ?? product.notes;

  const tataLine = product.tataOfficial
    ? t("Tata products available on request (authorised dealer).", "टाटा उत्पाद माँगने पर उपलब्ध (अधिकृत डीलर)।")
    : product.tataAvailable
      ? t("Tata product available on request.", "टाटा उत्पाद माँगने पर उपलब्ध।")
      : null;
  const sheet = useMemo(
    () =>
      buildSheet(
        {
          specs: variant?.specs ?? product.specs,
          sizes: variant?.sizes ?? product.sizes,
          materials: variant?.materials ?? product.materials,
          variants: product.variants,
          useCases: displayUseCases,
          notes: displayNotes,
        },
        { slug: product.slug, categorySlug: product.categorySlug },
        // brand variant of Tata already says it in its own specs
        variant ? null : tataLine
      ),
    [variant, product, category?.slug, displayUseCases, displayNotes, tataLine]
  );

  const packShown = sheet.rows.some((r) => r.key === "pack" && r.value);
  // Built from translated parts: the joined English sentence is not a dictionary key.
  const baseAlt = product.imageAlt ? L(product.imageAlt) : `${L(product.name)} – ${L(product.shortDesc)}`;
  const sizeList = (variant?.sizes ?? product.sizes)?.slice(0, 3).map(L).join(", ");
  const sizeInfo = sizeList ? (hi ? ` साइज़: ${sizeList}।` : ` Size: ${sizeList}`) : "";
  const brandName = selectedBrandId ? L(getBrandById(selectedBrandId)?.name ?? "") : "";
  const whatsAppMessage = hi
    ? `नमस्ते, मुझे ${L(product.name)}${brandName ? ` (${brandName} ब्रांड)` : ""} में रुचि है।${sizeInfo} कृपया भाव और उपलब्धता बताइए।`
    : `Hi, I'm interested in ${product.name}${brandName ? ` (${brandName} brand)` : ""}.${sizeInfo} Please share the price and availability.`;
  const quoteHref = `/contact?product=${product.slug}&category=${product.categorySlug}${selectedBrandId ? `&brand=${selectedBrandId}` : ""}`;
  const cutToSize = isCutToSize(product);
  const code = product.slug.toUpperCase();

  return (
    <>
      <header data-speakable className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <StencilTag className="!text-base">{code}</StencilTag>
          {category && (
            <Link
              href={`/categories/${category.slug}`}
              className="inline-flex min-h-[44px] items-center font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {L(category.name)}
            </Link>
          )}
        </div>
        <h1 className="mt-1 text-[2.6rem] leading-[0.95] text-foreground sm:text-5xl lg:text-6xl">{L(product.name)}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{L(product.shortDesc)}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          <T
            en="Wholesale and retail in Indore: Siyaganj, Loha Mandi and nearby areas."
            hi="इंदौर में थोक और रिटेल: सियागंज, लोहा मंडी और आसपास।"
          />
        </p>
      </header>

      <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <ProductImageGallery
          key={`${product.slug}-${selectedBrandId ?? "default"}`}
          media={media}
          alt={baseAlt}
          productName={L(product.name)}
          productSlug={product.slug}
          footer={reviews}
        />

        <div className="min-w-0">
          <GaugeRule tone="primary" label={<T en="Spec sheet" hi="स्पेक शीट" />} className="mt-6" />

          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <T en="Rate and stock" hi="रेट और स्टॉक" />
              </p>
              <p className="mt-1 text-sm text-foreground/85">
                <T
                  en="Tell us the size and quantity. We check stock and call back with the rate."
                  hi="साइज़ और मात्रा बताइए। हम स्टॉक देखकर रेट बताते हैं।"
                />
              </p>
            </div>
            {cutToSize && (
              <CounterStamp sub={t("Siyaganj counter", "सियागंज काउंटर")} className="shrink-0">
                {t("Cut to size", "नाप से कटाई")}
              </CounterStamp>
            )}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-[1.4fr_1fr_1fr]">
            <Link href={quoteHref} className={`${btn} bg-primary font-bold text-primary-foreground hover:brightness-110`}>
              <T en="Ask for rate" hi="रेट पूछें" />
            </Link>
            <a
              href={`tel:${site.phone.replace(/\D/g, "")}`}
              onClick={() => trackCallClick(`product_${product.slug}`)}
              className={`${btn} border border-input bg-card text-foreground hover:border-foreground/50`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <T en="Call" hi="कॉल" />
            </a>
            <a
              href={getWhatsAppLink(site.whatsapp, whatsAppMessage)}
              onClick={() => trackWhatsAppClick(`product_${product.slug}`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn} border border-input bg-card text-foreground hover:border-foreground/50`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <T en="WhatsApp" hi="व्हाट्सएप" />
            </a>
          </div>

          {hasBrandVariants && (
            <ProductBrandPicker
              variants={product.brandVariants!}
              selectedBrandId={selectedBrandId}
              onSelect={setSelectedBrandId}
              L={L}
              Lj={Lj}
              className="mt-8"
            />
          )}

          <h2 className="mt-8 font-display text-2xl font-extrabold uppercase leading-none text-foreground">
            <T en="Specifications" hi="स्पेसिफ़िकेशन" />
            {brandName && <span className="ml-2 text-primary">{brandName}</span>}
          </h2>
          <dl className="mt-3 border-t border-border">
            {sheet.rows.map((r) => (
              <div key={r.key} className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-x-4 border-b border-border py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
                <dt className="font-mono-brand text-xs uppercase tracking-[0.1em] text-muted-foreground">{hi ? (r.hi !== r.label ? r.hi : L(r.label)) : r.label}</dt>
                <dd className={r.value ? "text-foreground" : "text-muted-foreground"}>
                  {r.key === "availability"
                    ? t("Depends on stock. Confirm at the counter.", "स्टॉक पर निर्भर। काउंटर पर पुष्टि कर लीजिए।")
                    : r.value
                      ? Lj(r.value)
                      : t(ASK, "काउंटर पर पूछें")}
                </dd>
              </div>
            ))}
            {sheet.extras.map((r) => (
              <div key={r.key} className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-x-4 border-b border-border py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
                <dt className="font-mono-brand text-xs uppercase tracking-[0.1em] text-muted-foreground">{hi ? (r.hi !== r.label ? r.hi : L(r.label)) : r.label}</dt>
                <dd className="text-foreground">{r.value ? Lj(r.value) : r.value}</dd>
              </div>
            ))}
          </dl>

          {displayUseCases && displayUseCases.length > 0 && (
            <>
              <h2 className="mt-8 font-display text-2xl font-extrabold uppercase leading-none text-foreground">
                <T en="Common uses" hi="कहाँ लगता है" />
              </h2>
              <ul className="mt-3 border-t border-border">
                {displayUseCases.map((u) => (
                  <li key={u} className="border-b border-border py-2.5 text-foreground">
                    {L(u)}
                  </li>
                ))}
              </ul>
            </>
          )}

          {displayNotes && (
            <p className="mt-6 border-l-2 border-primary/60 pl-4 text-sm leading-relaxed text-foreground/85">
              {trimRepeatedPacking(L(displayNotes), packShown)}
            </p>
          )}

          <LookingForMoreSection variant="product" className="mt-8" />
        </div>
      </div>
    </>
  );
}
