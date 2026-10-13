import type { Metadata } from "next";
import { baseUrl, site } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo";
import { categories, allProducts, getProductImages, getProductBySlug } from "@/content/products";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { btnMain, btnGhostDark } from "@/components/site/PageHero";
import Link from "@/components/LocaleLink";
import { ProductsIndex, type IndexCategory } from "./ProductsIndex";
import { CategoryFocusProvider } from "./CategoryFocus";
import { ProductsHero, type ShowcaseItem } from "./ProductsHero";
import { SHOWROOM_ITEMS } from "@/components/fx/products/showroomItems";
import { sizeTag, tataFlag } from "@/components/catalog/ledger";
import { T } from "@/lib/i18n";
import { localize, tr } from "@/lib/localize";
import { tt, type Lang } from "@/lib/locale";
import { pageUrl } from "@/lib/seo";
import { productAliases } from "@/content/productAliases";
import { buildProductEntries } from "@/lib/productSearch";

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return buildPageMeta({
    lang: params.lang as Lang,
    title: "Products: Iron, Steel, Wire and Mesh",
    description:
      "The full range at HM Ibrahim & Co, Siyaganj, Indore: TMT bars, MS angles, wire mesh, welded mesh, barbed wire, chain link, perforated sheets, wire rope and tools. Ask for the rate.",
    path: "products",
  });
}

function itemListSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: tt(lang)("Iron & hardware products", "लोहा और हार्डवेयर उत्पाद"),
    numberOfItems: allProducts.length,
    itemListElement: allProducts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: pageUrl(`products/${p.slug}`, lang),
      name: tr(p.name, lang),
    })),
  };
}

export default function ProductsPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang;
  const t = tt(lang);
  // One search entry per unique product (English and Hindi names, aliases, every category it is listed under).
  const searchById = new Map(
    buildProductEntries(categories, productAliases, (x) => tr(x, "hi")).map((e) => [e.id, { names: e.names, desc: e.desc }])
  );
  const data: IndexCategory[] = categories.map((c) => ({
    slug: c.slug,
    name: tr(c.name, lang),
    description: tr(c.description, lang),
    image: getProductImages(c.products[0] ?? ({} as never), c)[0] ?? c.image ?? "",
    // Each product is listed once, under its own category, so the rows add up to the count (cross-listings live on
    // the category pages). 53 unique products, 53 rows.
    products: c.products.filter((p) => p.categorySlug === c.slug).map((p) => ({
      slug: p.slug,
      name: tr(p.name, lang),
      shortDesc: tr(p.shortDesc, lang),
      image: getProductImages(p, c)[0] ?? "",
      image2: getProductImages(p, c)[1],
      imageAlt: p.imageAlt ? tr(p.imageAlt, lang) : p.imageAlt,
      categorySlug: c.slug,
      // The tag is picked from English spec labels, then translated.
      tag: sizeTag(p, (s) => tr(s, lang)),
      // "wiron" only where the catalog holds a Tata Wiron brand variant (GI wire, barbed wire, chain link).
      // Other Tata-flagged items (structural steel, binding wire) are only "available on request".
      tata: tataFlag(p),
      search: searchById.get(p.slug)!,
    })),
  }));

  // The 3D showroom's products, in catalogue order, with the same names and links as the ledger below.
  const showcase: ShowcaseItem[] = SHOWROOM_ITEMS.flatMap(({ slug }) => {
    const p = getProductBySlug(slug);
    const c = p ? categories.find((x) => x.slug === p.categorySlug) : undefined;
    return p && c
      ? [{ slug, name: tr(p.name, lang), shortDesc: tr(p.shortDesc, lang), categorySlug: c.slug, categoryName: tr(c.name, lang) }]
      : [];
  });

  return (
    <CategoryFocusProvider>
      <SeoJsonLd data={itemListSchema(lang)} lang={lang} />
      <ProductsHero
        eyebrow={<T en="The range" hi="पूरा माल" />}
        title={<T en="Every wire, mesh and bar. One counter." hi="हर तार, जाली और सरिया। एक काउंटर।" />}
        lede={
          <T
            en={`${categories.length} categories and ${allProducts.length} products, stocked at our Siyaganj shop. Find what you need, then ask for a rate.`}
            hi={`${categories.length} श्रेणी, ${allProducts.length} आइटम, सियागंज की दुकान पर। जो चाहिए ढूँढिए, फिर रेट पूछिए।`}
          />
        }
        actions={
          <>
            <a href="#product-search" className={btnMain}><T en="Search the range" hi="रेंज में खोजें" /></a>
            <Link href="/contact" className={btnGhostDark}><T en="Ask for a rate" hi="रेट पूछें" /></Link>
          </>
        }
        items={showcase}
      />
      <ProductsIndex categories={data} />
    </CategoryFocusProvider>
  );
}
