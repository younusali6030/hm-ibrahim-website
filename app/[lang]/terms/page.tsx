import type { Metadata } from "next";
import { buildPageMeta } from "@/lib/seo";
import { site } from "@/content/site";
import { baseUrl } from "@/lib/site";
import Link from "@/components/LocaleLink";
import { PageHero } from "@/components/site/PageHero";
import { tt, type Lang } from "@/lib/locale";
import { siteHi } from "@/content/hi/site";

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  return buildPageMeta({
    lang: params.lang as Lang,
    title: "Terms of Use",
    description: `Terms of Use for the ${site.name} website: the plain terms for using this site and for quote requests sent through it.`,
    path: "terms",
  });
}

export default async function TermsPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang as Lang;
  const t = tt(lang);
  const hi = lang === "hi";
  const name = hi ? siteHi.name : site.name;
  return (
    <>
      <PageHero
        eyebrow={t("Legal", "कानूनी")}
        title={t("Terms of Use", "उपयोग की शर्तें")}
        lede={t("The plain terms for using this website and for quote requests sent through it.", "इस वेबसाइट के उपयोग और इससे भेजे गए कोटेशन अनुरोधों की सीधी-सादी शर्तें।")}
        compact
      />
      <div className="page-container pb-28 pt-12 md:pb-20 md:pt-16">
      <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-muted-foreground [&_h2]:mt-12 [&_h2]:border-t [&_h2]:border-foreground/30 [&_h2]:pt-5 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:leading-none [&_h2]:text-foreground [&_strong]:text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
        <p>
          {hi ? (
            <>
              <strong>{name}</strong> की वेबसाइट इस्तेमाल करके आप इन उपयोग की शर्तों से सहमत होते हैं।
            </>
          ) : (
            <>
              By using the website of <strong>{name}</strong>, you agree to these terms of use.
            </>
          )}
        </p>

        <h2>{t("Use of website", "वेबसाइट का उपयोग")}</h2>
        <p>
          {t(
            "This website is for informational and enquiry purposes. You may use it to learn about our products and services, request quotes, and contact us. You must not use the site for any unlawful purpose or to transmit harmful or misleading content.",
            "यह वेबसाइट जानकारी और पूछताछ के लिए है। आप इसका उपयोग हमारे उत्पादों और सेवाओं के बारे में जानने, कोटेशन माँगने और हमसे संपर्क करने के लिए कर सकते हैं। आप साइट का उपयोग किसी गैर-कानूनी उद्देश्य के लिए, या हानिकारक या भ्रामक सामग्री भेजने के लिए नहीं करेंगे।"
          )}
        </p>

        <h2>{t("Quotes and orders", "कोटेशन और ऑर्डर")}</h2>
        <p>
          {t(
            "Quote requests and communications through the website do not constitute a binding contract. All orders and transactions are subject to our confirmation, terms of sale, and prevailing prices and availability.",
            "वेबसाइट से भेजे गए कोटेशन अनुरोध और संवाद कोई बाध्यकारी अनुबंध नहीं हैं। सभी ऑर्डर और लेन-देन हमारी पुष्टि, बिक्री की शर्तों और उस समय के भाव और उपलब्धता के अधीन हैं।"
          )}
        </p>

        <h2>{t("Accuracy", "सटीकता")}</h2>
        <p>
          {t(
            "We strive to keep product and contact information accurate but do not warrant that all content is error-free or up to date. Please confirm details with us directly when placing orders.",
            "हम उत्पाद और संपर्क की जानकारी सटीक रखने की कोशिश करते हैं, पर यह गारंटी नहीं देते कि सारी सामग्री त्रुटि-रहित या ताज़ा है। ऑर्डर देते समय ब्योरा सीधे हमसे पक्का कर लीजिए।"
          )}
        </p>

        <h2>{t("Contact", "संपर्क")}</h2>
        <p>
          {t("For questions about these terms, contact us at", "इन शर्तों के बारे में सवालों के लिए हमसे यहाँ संपर्क करें:")} {site.email} {t("or", "या")} {site.phone}.
        </p>

        <p className="mt-8">
          <Link href="/" className="inline-flex min-h-[44px] items-center">
            {t("Back to home", "होम पर वापस जाएँ")}
          </Link>
        </p>
      </div>
      </div>
    </>
  );
}
