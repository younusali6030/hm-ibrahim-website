import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/LocaleLink";
import Image from "next/image";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { getPostBySlug, getAllPostSlugs, getAllPosts } from "@/content/blog/posts";
import { extractToc, extractProductSlugs } from "@/content/blog/toc";
import { getProductBySlug, getRelatedProducts } from "@/content/products";
import { baseUrl, site as siteLib } from "@/lib/site";
import { site } from "@/content/site";
import { getWhatsAppLink } from "@/lib/utils";
import { buildPageMeta, pageUrl } from "@/lib/seo";
import { tt, type Lang } from "@/lib/locale";
import { localize } from "@/lib/localize";
import { siteHi } from "@/content/hi/site";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { MarkdownContent } from "@/components/MarkdownContent";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { PageHero, btnMain, btnGhostDark } from "@/components/site/PageHero";
import { ContactStrip } from "@/components/story/ContactStrip";
import { GaugeRule } from "@/components/motif/Motif";
import "@/components/story/story.css";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { PostCard, formatDate } from "@/components/blog/PostCard";

type Props = { params: { lang: string; slug: string } };

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const lang = params.lang as Lang;
  const post = await getPostBySlug(slug, lang);
  if (!post) return { title: "Blog" };
  const hi = post.lang === "hi";

  const base = buildPageMeta({
    lang,
    title: post.title,
    description:
      post.description ||
      (hi ? `${post.title}। सियागंज, इंदौर के हमारे काउंटर से खरीदारी गाइड।` : `${post.title}. A buying guide from our Siyaganj, Indore counter.`),
    path: `blog/${slug}`,
    keywords: hi
      ? [post.category ? `${post.category} इंदौर` : "", "सियागंज", "इंदौर हार्डवेयर", post.title].filter(Boolean)
      : [post.category ? `${post.category} Indore` : "", "Siyaganj", "Indore hardware", post.title].filter(Boolean),
    image: post.image ? { url: post.image, alt: post.imageAlt } : undefined,
    // A Hindi URL whose body is still English must not compete with the English page.
    noIndex: lang === "hi" && post.lang !== "hi",
    ...(hi ? { hi: { title: post.title, description: post.description || post.title } } : {}),
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      section: post.category,
    } as Metadata["openGraph"],
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = params;
  const lang = params.lang as Lang;
  const t = tt(lang);
  const hi = lang === "hi";
  const post = await getPostBySlug(slug, lang);
  if (!post) notFound();
  const bodyLang: Lang = post.lang;

  const breadcrumbItems = [
    { name: t("Home", "होम"), url: "/" },
    { name: t("Blog", "ब्लॉग"), url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ];

  const toc = extractToc(post.content).filter((t) => !/^(faqs?|frequently asked)/i.test(t.text) || true);
  // Products the guide links to, in order; topped up from the catalog's related mapping when the guide names fewer than three.
  const linked = extractProductSlugs(post.content, 6)
    .map((s) => getProductBySlug(s))
    .filter((p): p is NonNullable<typeof p> => !!p);
  void localize;
  const productCardsEn = [...linked];
  if (linked[0] && productCardsEn.length < 3) {
    for (const r of getRelatedProducts(linked[0].slug, 4)) {
      if (productCardsEn.length >= 4) break;
      if (!productCardsEn.some((p) => p.slug === r.slug)) productCardsEn.push(r);
    }
  }
  const productCards = localize(productCardsEn, lang);

  const articleImages = [post.image, post.image2, post.image3].filter(Boolean) as string[];
  const abs = (src: string) => (src.startsWith("http") ? src : `${baseUrl}${src}`);
  const url = pageUrl(`blog/${slug}`, lang);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.date,
    dateModified: post.updated || post.date,
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingMinutes}M`,
    inLanguage: bodyLang === "hi" ? "hi-IN" : "en-IN",
    ...(post.category && { articleSection: post.category }),
    ...(articleImages.length > 0 && { image: articleImages.map(abs) }),
    author: { "@type": "Organization", name: hi ? siteHi.name : siteLib.name, url: baseUrl },
    publisher: {
      "@type": "Organization",
      name: hi ? siteHi.name : siteLib.name,
      url: baseUrl,
      logo: { "@type": "ImageObject", url: `${baseUrl}/logo-dark.png` },
    },
  };
  const faqSchema =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;
  const videoSchema = post.video
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: post.videoCaption || post.title,
        description: post.videoCaption || post.description,
        thumbnailUrl: abs(post.video.replace(/\.mp4$/, ".jpg")),
        contentUrl: abs(post.video),
        uploadDate: post.date,
      }
    : null;

  const related = (await getAllPosts(lang))
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);

  const waShare = `https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`;
  const waAsk = getWhatsAppLink(site.whatsapp, hi ? `नमस्ते, मैंने आपके ब्लॉग पर "${post.title}" पढ़ा। कृपया भाव और उपलब्धता बताइए।` : `Hi, I read "${post.title}" on your blog. Please share the price and availability.`);

  return (
    <article className="blog-article">
      <JsonLdBreadcrumb items={breadcrumbItems} lang={lang} />
      <SeoJsonLd data={articleSchema} lang={lang} />
      {faqSchema && <SeoJsonLd data={faqSchema} lang={lang} />}
      {videoSchema && <SeoJsonLd data={videoSchema} lang={lang} />}
      <ReadingProgress targetId="post-body" />

      <PageHero
        compact
        eyebrow={
          <>
            <Link href="/blog" className="hover:text-white">{t("Buyer's guide", "खरीदार की गाइड")}</Link>
            {post.category ? <> / {post.category}</> : null}
          </>
        }
        title={post.title}
        lede={post.description || undefined}
        image={post.image ? { src: post.image, alt: post.imageAlt || post.title } : undefined}
      />

      <div className="page-container st-sec !pt-8 md:!pt-12">
        <p className="font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {post.date && (
            <>
              <time dateTime={post.updated || post.date}>{formatDate(post.updated || post.date, lang)}</time>
              <span aria-hidden="true"> · </span>
            </>
          )}
          {hi ? `${post.readingMinutes} मिनट में पढ़ें` : `${post.readingMinutes} min read`}
          <span aria-hidden="true"> · </span>
          {hi ? `${siteHi.name}, सियागंज, इंदौर, 1939 से` : `${siteLib.name}, Siyaganj, Indore, since 1939`}
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[13rem_minmax(0,42rem)] lg:justify-center lg:gap-16">
          <aside className="min-w-0 lg:order-first lg:sticky lg:top-28 lg:self-start" aria-label={t("Guide tools", "गाइड के औज़ार")}>
            {toc.length > 1 && (
              <>
                <details className="rounded-[10px] border border-border bg-card px-4 py-3 lg:hidden">
                  <summary className="flex min-h-[44px] cursor-pointer items-center text-sm font-bold uppercase tracking-[0.12em]">{t("In this guide", "इस गाइड में")}</summary>
                  <ol className="mt-2 space-y-1">
                    {toc.map((t) => (
                      <li key={t.id}>
                        <a href={`#${t.id}`} className="flex min-h-[44px] items-center text-[0.95rem] text-foreground/85 hover:text-primary">
                          {t.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </details>
                <nav className="hidden lg:block" aria-label={t("Table of contents", "विषय-सूची")}>
                  <p className="st-eyebrow">{t("In this guide", "इस गाइड में")}</p>
                  <ol className="mt-3 border-t border-foreground/40">
                    {toc.map((t) => (
                      <li key={t.id} className="border-b border-border">
                        <a href={`#${t.id}`} className="block py-2 text-sm leading-snug text-foreground/80 hover:text-primary">
                          {t.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </>
            )}
            <div className="mt-6 hidden gap-2 lg:flex lg:flex-col">
              <a href={waShare} target="_blank" rel="noopener noreferrer" className="st-link text-sm">
                {t("Share on WhatsApp", "व्हाट्सएप पर शेयर करें")}<span className="sr-only"> {t("(opens in a new tab)", "(नए टैब में खुलेगा)")}</span>
              </a>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="st-link text-sm">
                <Phone className="h-4 w-4" aria-hidden /> {t("Call the counter", "काउंटर पर कॉल करें")}
              </a>
            </div>
          </aside>

          <div id="post-body" className="min-w-0">
            {post.video && (
              <figure className="mx-auto mb-10 max-w-sm">
                <video
                  className="aspect-[9/16] w-full rounded-[14px] bg-black object-cover"
                  poster={post.video.replace(/\.mp4$/, ".jpg")}
                  controls
                  muted
                  playsInline
                  preload="none"
                >
                  <source src={post.video} type="video/mp4" />
                </video>
                {post.videoCaption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{post.videoCaption}</figcaption>}
              </figure>
            )}

            <div lang={bodyLang === "hi" ? "hi" : "en"}>
              <MarkdownContent content={post.content} className="blog-prose" lang={bodyLang} />
            </div>

            {(post.image2 || post.image3) && (
              <div className="mt-12 grid gap-3 sm:grid-cols-2">
                {[
                  { src: post.image2, alt: post.image2Alt },
                  { src: post.image3, alt: post.image3Alt },
                ]
                  .filter((i) => i.src)
                  .map((i) => (
                    <figure key={i.src} className="m-0">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-secondary">
                        <Image src={i.src as string} alt={i.alt || post.title} fill sizes="(max-width:640px) 100vw, 400px" className="object-cover" />
                      </div>
                      {i.alt && <figcaption className="mt-2 text-sm text-muted-foreground">{i.alt}</figcaption>}
                    </figure>
                  ))}
              </div>
            )}

            {productCards.length > 0 && (
              <section className="mt-14" aria-labelledby="related-products-heading">
                <GaugeRule label={t("Related products", "संबंधित उत्पाद")} />
                <h2 id="related-products-heading" className="mt-6 text-foreground">{t("From the shelf", "शेल्फ से")}</h2>
                <ul className="st-ledger mt-5">
                  {productCards.map((p) => {
                    const img = p.images?.[0] ?? p.image;
                    return (
                      <li key={p.slug} className="border-b border-border">
                        <Link href={`/products/${p.slug}`} className="group flex min-h-[64px] items-center gap-4 py-3">
                          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[10px] bg-secondary">
                            {img && <Image src={img} alt="" fill sizes="56px" className="object-cover" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold text-foreground group-hover:text-primary">{p.name}</span>
                            <span className="block truncate text-sm text-muted-foreground">{p.shortDesc}</span>
                          </span>
                          <span className="shrink-0 text-sm font-semibold text-foreground">
                            {t("Ask for rate", "रेट पूछें")} <ArrowRight className="inline h-4 w-4" aria-hidden />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <div className="mt-12 flex flex-col gap-4 border-y border-foreground/30 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-2xl font-extrabold uppercase leading-none">{t("Buying this in Indore?", "इंदौर में यह खरीद रहे हैं?")}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t("Send your list. We check stock and call back with rates.", "अपनी सूची भेजिए। हम स्टॉक देखकर रेट के साथ वापस कॉल करते हैं।")}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href={`/contact${productCards[0] ? `?product=${productCards[0].slug}` : ""}`} className={btnMain}>
                  {t("Get a quote", "कोटेशन पाएँ")}
                </Link>
                <a href={waAsk} target="_blank" rel="noopener noreferrer" className={btnGhostDark}>
                  <MessageCircle className="mr-2 h-5 w-5" aria-hidden /> {t("WhatsApp", "व्हाट्सएप")}
                  <span className="sr-only"> {t("(opens in a new tab)", "(नए टैब में खुलेगा)")}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="st-sec st-sec-tint" aria-labelledby="related-heading">
          <div className="page-container">
            <h2 id="related-heading" className="text-foreground">{t("Keep reading", "और पढ़िए")}</h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} lang={lang} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ContactStrip heading={t("Ask the counter", "काउंटर से पूछिए")} headingId="post-visit-heading" quoteHref={`/contact${productCards[0] ? `?product=${productCards[0].slug}` : ""}`} waMessage={hi ? `नमस्ते, मैंने "${post.title}" पढ़ा। मुझे जो उत्पाद, साइज़ और मात्रा चाहिए: ` : `Hi, I read "${post.title}". Product, size and quantity I need: `} />
    </article>
  );
}
