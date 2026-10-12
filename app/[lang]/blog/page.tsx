import type { Metadata } from "next";
import Link from "@/components/LocaleLink";
import Image from "next/image";
import { getAllPosts } from "@/content/blog/posts";
import { baseUrl, site } from "@/lib/site";
import { buildPageMeta, pageUrl } from "@/lib/seo";
import { tt, type Lang } from "@/lib/locale";
import { siteHi } from "@/content/hi/site";
import { PageHero } from "@/components/site/PageHero";
import { GaugeRule } from "@/components/motif/Motif";
import { ContactStrip } from "@/components/story/ContactStrip";
import { T } from "@/lib/i18n";
import "@/components/story/story.css";
import { PostCard, formatDate } from "@/components/blog/PostCard";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { JsonLdBreadcrumb } from "@/components/JsonLdBreadcrumb";
import { slugifyHeading } from "@/content/blog/toc";

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return buildPageMeta({
    lang: params.lang as Lang,
    title: "Hardware Buying Guides, Indore",
    description:
      "Plain buying guides on wire mesh, TMT bars, fencing, perforated sheets and hardware from an Indore stockist in Siyaganj. Sizes, weights, uses and how to check quality.",
    path: "blog",
    keywords: ["wire mesh guide Indore", "TMT bars weight chart", "fencing wire Siyaganj", "hardware buying guide Indore", "Loha Mandi Indore"],
  });
}

export default async function BlogIndexPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang;
  const t = tt(lang);
  const hi = lang === "hi";
  const everyPost = await getAllPosts(lang);
  // Hindi editions first: the lead and the top of each group should read in Hindi. English-only guides follow (lang="en").
  const posts = hi ? [...everyPost.filter((p) => p.lang === "hi"), ...everyPost.filter((p) => p.lang !== "hi")] : everyPost;
  const [lead, ...rest] = posts;

  const groups = new Map<string, typeof posts>();
  for (const p of rest) {
    const c = p.category || t("Guides", "गाइड");
    groups.set(c, [...(groups.get(c) ?? []), p]);
  }
  const categories = Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: hi ? `${siteHi.name} की खरीदारी गाइड` : `${site.name} buying guides`,
    url: pageUrl("blog", lang),
    inLanguage: hi ? "hi-IN" : "en-IN",
    publisher: { "@type": "Organization", name: hi ? siteHi.name : site.name, url: baseUrl },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: pageUrl(`blog/${p.slug}`, lang),
      datePublished: p.date,
      dateModified: p.updated || p.date,
      ...(p.image && { image: `${baseUrl}${p.image}` }),
    })),
  };

  return (
    <>
      <SeoJsonLd data={schema} lang={lang} />
      <JsonLdBreadcrumb lang={lang} items={[{ name: t("Home", "होम"), url: "/" }, { name: t("Blog", "ब्लॉग"), url: "/blog" }]} />

      <PageHero
        eyebrow={<T en="The buyer's guide" hi="खरीदार की गाइड" />}
        title={<T en="Know the material before you buy it" hi="माल खरीदने से पहले उसे जान लीजिए" />}
        lede={t("Plain guides from the counter on wire mesh, TMT bars, fencing, perforated sheets and hardware. Written for people buying in Indore.", "वायर मेश, टीएमटी सरिया, फेंसिंग, परफोरेटेड शीट और हार्डवेयर पर काउंटर से सीधी-सादी गाइड। इंदौर में खरीदने वालों के लिए लिखी गई।")}
        compact
      >
        <div className="flex flex-wrap gap-2" aria-label={t("Topics", "विषय")}>
          {categories.map(([c, list]) => (
            <a key={c} href={`#${slugifyHeading(c)}`} className="inline-flex min-h-[44px] items-center rounded-full border border-white/30 px-4 text-sm font-semibold text-white hover:bg-white/10">
              {c} <span className="text-white/50">{list.length}</span>
            </a>
          ))}
        </div>
      </PageHero>

      <section className="py-8 md:py-16">
        <div className="page-container">
          {lead && (
            <Link
              href={`/blog/${lead.slug}`}
              className="group grid overflow-hidden rounded-[14px] border border-border bg-card transition-colors hover:border-foreground/40 lg:grid-cols-[1.25fr_1fr]"
            >
              <span className="relative block aspect-[16/10] bg-secondary lg:aspect-auto lg:min-h-[24rem]">
                {lead.image && (
                  <Image
                    src={lead.image}
                    alt={lead.imageAlt || lead.title}
                    fill
                    priority
                    sizes="(max-width:1024px) 100vw, 55vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    style={{ objectPosition: lead.imagePosition || "50% 50%" }}
                  />
                )}
              </span>
              <span className="flex flex-col justify-center p-7 md:p-10">
                <span className="st-eyebrow">{t("Latest", "ताज़ा")}{lead.category ? ` · ${lead.category}` : ""}</span>
                <span lang={lead.lang !== lang ? lead.lang : undefined} className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.98] text-foreground md:text-5xl">{lead.title}</span>
                {lead.description && <span className="mt-4 line-clamp-4 text-muted-foreground">{lead.description}</span>}
                <span className="mt-6 font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {formatDate(lead.date, lang)} · {hi ? `${lead.readingMinutes} मिनट में पढ़ें` : `${lead.readingMinutes} min read`}
                </span>
                <span className="mt-5 text-sm font-bold text-foreground underline decoration-primary underline-offset-4">{t("Read the guide", "गाइड पढ़ें")}</span>
              </span>
            </Link>
          )}

          {categories.map(([cat, list]) => (
            <div key={cat} id={slugifyHeading(cat)} className="mt-14 scroll-mt-28">
              <div className="flex items-end justify-between gap-4 pb-3">
                <h2 className="text-foreground">{cat}</h2>
                <span className="font-mono-brand text-xs uppercase tracking-[0.14em] text-muted-foreground">{hi ? `${list.length} गाइड` : `${list.length} guides`}</span>
              </div>
              <GaugeRule />
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={post} lang={lang} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {posts.length === 0 && <p className="text-muted-foreground">{t("No guides yet. Check back soon.", "अभी कोई गाइड नहीं है। जल्द देखिए।")}</p>}
        </div>
      </section>

      <ContactStrip heading={t("Still unsure what to buy?", "अब भी तय नहीं कि क्या खरीदें?")} headingId="ask-heading" waMessage={t("Hi, I read your buying guides. The job and material I need: ", "नमस्ते, मैंने आपकी खरीदारी गाइड पढ़ी। मेरा काम और ज़रूरत का माल: ")} />
    </>
  );
}
