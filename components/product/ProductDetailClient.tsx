"use client";

import { useState, useMemo, useEffect, type ReactNode } from "react";
import Link from "@/components/LocaleLink";
import { Phone, MessageCircle } from "lucide-react";
import { getProductImages, getProductMedia, getBrandVariant } from "@/content/products";
import { getBrandById } from "@/content/brands";
import type { Product, Category } from "@/content/products";
import { site } from "@/content/site";
import { getWhatsAppLink, telHref } from "@/lib/utils";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductBrandSelector, ProductBrandComparison } from "@/components/product/ProductBrandPicker";
import { LookingForMoreSection } from "@/components/LookingForMoreSection";
import { StencilTag, CounterStamp } from "@/components/motif/Motif";
import { buildSheet, isCutToSize, sheetKind, splitSheetRows, trimRepeatedPacking } from "@/components/product/specSheet";
import type { BrandId } from "@/content/brands";
import { trackProductView, trackCallClick, trackWhatsAppClick } from "@/lib/analytics";
import { T, useT, useLang } from "@/lib/i18n";
import { enquiryFields, enquiryText, enquiryTextHi, quoteHrefFor, type EnquiryContext } from "@/lib/enquiry";
import { setEnquiryContext } from "@/lib/enquiryStore";

type Props = {
  product: Product;
  category: Category | null;
  defaultImages: string[];
  /** { english: hindi } for the strings of this product, category and brands. Empty in English. */
  tx?: Record<string, string>;
  /** Server-rendered pointer to the local-supply page that owns "<product> Indore", shown under the summary. */
  localNote?: ReactNode;
  /** Server-rendered trade reference, shown straight after the spec sheet. */
  afterSpecs?: ReactNode;
};

const btn =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-sm px-5 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

type SheetRowLike = { key: string };

/** A definition list of spec rows. Label and value come from the caller so translation stays in one place. */
function SheetRows<R extends SheetRowLike>({ rows, label, value }: { rows: R[]; label: (r: R) => string; value: (r: R) => ReactNode }) {
  return (
    <dl className="mt-3 border-t border-border">
      {rows.map((r) => (
        <div key={r.key} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-3 border-b border-border py-2 text-[0.95rem] sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-x-4 sm:py-2.5 sm:text-base">
          <dt className="font-mono-brand text-xs uppercase tracking-[0.1em] text-muted-foreground">{label(r)}</dt>
          <dd className="text-foreground">{value(r)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProductDetailClient({ product, category, tx = {}, localNote, afterSpecs }: Props) {
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
  // No brand is chosen for the visitor: the page shows the product family until one is picked.
  const [selectedBrandId, setSelectedBrandId] = useState<BrandId | null>(null);

  const media = useMemo(
    () => getProductMedia(product, category, selectedBrandId ?? undefined),
    [product, category, selectedBrandId]
  );

  const variant = selectedBrandId ? getBrandVariant(product, selectedBrandId) : null;
  const displayUseCases = variant?.useCases ?? product.useCases;
  const displayNotes = variant?.notes ?? product.notes;

  // A Tata Wiron variant is already offered by the brand picker; other Tata lines are obtained on request.
  const hasTataVariant = !!product.brandVariants?.some((v) => v.brandId === "tata");
  const tataLine =
    (product.tataOfficial || product.tataAvailable) && !hasTataVariant
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
    [variant, product, displayUseCases, displayNotes, tataLine]
  );

  const { known: knownRows, unknown: unknownRows } = splitSheetRows(sheet.rows);
  const nothingOnFile = knownRows.length === 0 && sheet.extras.length === 0;
  const packShown = sheet.rows.some((r) => r.key === "pack" && r.value);
  // Built from translated parts: the joined English sentence is not a dictionary key.
  const baseAlt = product.imageAlt ? L(product.imageAlt) : `${L(product.name)} – ${L(product.shortDesc)}`;
  const brandName = selectedBrandId ? L(getBrandById(selectedBrandId)?.name ?? "") : "";
  // One context for the page buttons and the mobile bar. Only the brand is a choice the visitor made here:
  // sizes are never filled in on their behalf.
  const enquiry = useMemo<EnquiryContext>(
    () => ({
      productSlug: product.slug,
      productName: L(product.name),
      categorySlug: product.categorySlug,
      brandId: selectedBrandId,
      brandName: brandName || null,
      fields: enquiryFields(sheetKind(product)),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [product.slug, product.categorySlug, selectedBrandId, brandName, hi]
  );
  useEffect(() => {
    setEnquiryContext(enquiry);
    return () => setEnquiryContext(null);
  }, [enquiry]);
  const whatsAppMessage = hi
    ? `नमस्ते, ${enquiryTextHi(enquiry)}। कृपया भाव और उपलब्धता बताइए।`
    : `Hi, ${enquiryText(enquiry)}. Please share the price and availability.`;
  const quoteHref = quoteHrefFor(enquiry);
  const cutToSize = isCutToSize(product);
  const code = product.slug.toUpperCase();

  // Key rows go above the enquiry buttons; the rest of the sheet follows them. Nothing is listed twice.
  const KEY_ROWS = 4;
  // With no brand chosen, a make whose shelf configuration is on file is named first, so the stocked pack is not
  // buried under the maker's wider catalogue range.
  const stockedRows = variant
    ? []
    : (product.brandVariants ?? []).flatMap((v) => {
        const spec = v.specs?.find((sp) => sp.label === "Stocked configuration");
        const b = getBrandById(v.brandId);
        if (!spec || !b) return [];
        return [
          {
            key: `stocked-${v.brandId}`,
            label: `${b.name} stocked`,
            hi: `${L(b.name)} स्टॉक में`,
            value: spec.value,
          },
        ];
      });
  const allRows = [...stockedRows, ...knownRows, ...sheet.extras];
  const keyRows = allRows.slice(0, KEY_ROWS);
  const moreRows = allRows.slice(KEY_ROWS);
  const rowLabel = (r: (typeof allRows)[number]) => (hi ? (r.hi !== r.label ? r.hi : L(r.label)) : r.label);
  const rowValue = (r: (typeof allRows)[number]) =>
    r.key === "availability"
      ? t("Depends on stock. Confirm at the counter.", "स्टॉक पर निर्भर। काउंटर पर पुष्टि कर लीजिए।")
      : r.value
        ? Lj(r.value)
        : null;
  return (
    <>
      <header data-speakable className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <StencilTag className="hidden !text-base sm:inline-block">{code}</StencilTag>
          {category && (
            <Link
              href={`/categories/${category.slug}`}
              className="inline-flex min-h-[40px] items-center font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {L(category.name)}
            </Link>
          )}
        </div>
        <h1 className="text-[2.1rem] leading-[0.98] text-foreground sm:text-5xl lg:text-6xl">{L(product.name)}</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">{L(product.shortDesc)}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          <T
            en={`Siyaganj, Indore · shop rating ${site.googleReview.rating} on Google (${site.googleReview.reviewCount} reviews of the shop)`}
            hi={`सियागंज, इंदौर · गूगल पर दुकान की रेटिंग ${site.googleReview.rating} (दुकान के ${site.googleReview.reviewCount} रिव्यू)`}
          />
        </p>
      </header>

      <div className="mt-4 grid min-w-0 gap-5 sm:mt-8 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <ProductImageGallery
          key={`${product.slug}-${selectedBrandId ?? "default"}`}
          media={media}
          alt={baseAlt}
          productName={L(product.name)}
          productSlug={product.slug}
        />

        <div className="min-w-0">
          {hasBrandVariants && (
            <ProductBrandSelector
              variants={product.brandVariants!}
              selectedBrandId={selectedBrandId}
              onSelect={setSelectedBrandId}
              L={L}
              Lj={Lj}
            />
          )}

          <h2 className="mt-5 font-display text-2xl font-extrabold uppercase leading-none text-foreground">
            <T en="Key specifications" hi="मुख्य स्पेसिफ़िकेशन" />
            {brandName && <span className="ml-2 text-primary">{brandName}</span>}
          </h2>
          {keyRows.length > 0 && <SheetRows rows={keyRows} label={rowLabel} value={rowValue} />}
          {(unknownRows.length > 0 || nothingOnFile) && (
            <p className="mt-3 border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground" data-spec-gap>
              {nothingOnFile && unknownRows.length === 0 ? (
                <T
                  en="Size and pack details for this item are confirmed when you ask for the rate. Tell us the size and quantity you need."
                  hi="इस आइटम का साइज़ और पैक रेट पूछते समय पक्का किया जाता है। अपनी ज़रूरत का साइज़ और मात्रा बताइए।"
                />
              ) : (
                <>
                  <T en="Confirmed when you ask for the rate: " hi="रेट पूछते समय पक्का किया जाता है: " />
                  {unknownRows.map((r) => (hi ? (r.hi !== r.label ? r.hi : L(r.label)) : r.label)).join(", ")}.
                </>
              )}
            </p>
          )}

          <div className="mt-5" data-product-enquiry>
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-foreground/85">
                <T
                  en="Tell us the size and quantity. We check stock and call back with the rate."
                  hi="साइज़ और मात्रा बताइए। हम स्टॉक देखकर रेट बताते हैं।"
                />
              </p>
              {cutToSize && (
                <CounterStamp sub={t("Siyaganj counter", "सियागंज काउंटर")} className="shrink-0">
                  {t("Cut to size", "नाप से कटाई")}
                </CounterStamp>
              )}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1.4fr_1fr_1fr]">
              <Link href={quoteHref} className={`${btn} bg-primary font-bold text-primary-foreground hover:brightness-110`}>
                <T en="Ask for rate" hi="रेट पूछें" />
              </Link>
              <a
                href={telHref(site.phone)}
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
          </div>

          {localNote && <div className="mt-4">{localNote}</div>}

          {moreRows.length > 0 && (
            <>
              <h2 className="mt-8 font-display text-2xl font-extrabold uppercase leading-none text-foreground">
                <T en="Full specifications" hi="पूरे स्पेसिफ़िकेशन" />
              </h2>
              <SheetRows rows={moreRows} label={rowLabel} value={rowValue} />
            </>
          )}

          {hasBrandVariants && (
            <ProductBrandComparison
              variants={product.brandVariants!}
              selectedBrandId={selectedBrandId}
              L={L}
              Lj={Lj}
              className="mt-8"
            />
          )}

          {afterSpecs}

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
