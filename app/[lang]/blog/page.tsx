import type { Metadata } from "next";
import Link from "@/components/LocaleLink";
import Image from "next/image";
import { getAllPosts } from "@/content/blog/posts";
import { baseUrl, site } from "@/lib/site";
import { buildPageMeta, pageUrl } from "@/lib/seo";
import { tt, type Lang } from "@/lib/locale";
import { siteHi } from "@/content/hi/site";
import { PageHero } from "@/components/site/PageHero";
import { BlogTopicProvider } from "./BlogTopics";
import { BlogHeroArt } from "./BlogHeroArt";
import { BlogLibrary } from "./BlogLibrary";
import { topicCounts } from "./topicCounts";
import { BlogTopicChips } from "./BlogTopicChips";
import { GaugeRule } from "@/components/motif/Motif";
import { ContactStrip } from "@/components/story/ContactStrip";
import { T } from "@/lib/i18n";
import "@/components/story/story.css";
import type { PostCardData } from "@/components/blog/PostCard";
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
  const lead = posts[0];
  // Counts come from the posts themselves: every guide counted once under its topic, the featured one included.
  const topics = topicCounts(posts, t("Guides", "गाइड")).map(([name, count]) => ({ name, count }));
  const cards: PostCardData[] = posts.map((p) => ({
    slug: p.slug, title: p.title, description: p.description, date: p.date, image: p.image, imageAlt: p.imageAlt,
    imagePosition: p.imagePosition, category: p.category, readingMinutes: p.readingMinutes, lang: p.lang,
  }));
  // One existing article image per topic, for the topics the desk has no sample for.
  const topicArt = topics.flatMap(({ name }) => {
    const post = posts.find((x) => (x.category || t("Guides", "गाइड")) === name && x.image);
    return post?.image ? [{ topic: name, image: post.image, alt: post.imageAlt || post.title }] : [];
  });

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

      <BlogTopicProvider>
        <PageHero
          eyebrow={<T en="The buyer's guide" hi="खरीदार की गाइड" />}
          title={<T en="Know the material before you buy it" hi="माल खरीदने से पहले उसे जान लीजिए" />}
          titleSize="clamp(2.2rem, 4.2vw, 4rem)"
          lede={t("Plain guides from the counter on wire mesh, TMT bars, fencing, perforated sheets and hardware. Written for people buying in Indore.", "वायर मेश, टीएमटी सरिया, फेंसिंग, परफोरेटेड शीट और हार्डवेयर पर काउंटर से सीधी-सादी गाइड। इंदौर में खरीदने वालों के लिए लिखी गई।")}
          art={<BlogHeroArt art={topicArt} />}
          artSize={{ aspect: "1.14", mobileAspect: "5 / 4" }}
          footer={<BlogTopicChips topics={topics} total={posts.length} />}
        />

        <section className="pb-10 pt-6 md:pb-16 md:pt-8">
          <div className="page-container">
            <BlogLibrary posts={cards} leadSlug={lead?.slug ?? ""} />
          </div>
        </section>
      </BlogTopicProvider>

      <ContactStrip heading={t("Still unsure what to buy?", "अब भी तय नहीं कि क्या खरीदें?")} headingId="ask-heading" waMessage={t("Hi, I read your buying guides. The job and material I need: ", "नमस्ते, मैंने आपकी खरीदारी गाइड पढ़ी। मेरा काम और ज़रूरत का माल: ")} />
    </>
  );
}
