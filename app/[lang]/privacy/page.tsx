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
    title: "Privacy Policy",
    description: `Privacy Policy for the ${site.name} website: what we collect when you write to us, and how we use it.`,
    path: "privacy",
  });
}

export default async function PrivacyPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang as Lang;
  const t = tt(lang);
  const hi = lang === "hi";
  const name = hi ? siteHi.name : site.name;
  return (
    <>
      <PageHero
        eyebrow={t("Legal", "कानूनी")}
        title={t("Privacy Policy", "गोपनीयता नीति")}
        lede={t("What we collect when you write to us through this site, and what we do with it.", "इस साइट के ज़रिए आप हमें लिखते हैं तो हम क्या जानकारी लेते हैं, और उसका क्या करते हैं।")}
        compact
      />
      <div className="page-container pb-28 pt-12 md:pb-20 md:pt-16">
      <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-muted-foreground [&_h2]:mt-12 [&_h2]:border-t [&_h2]:border-foreground/30 [&_h2]:pt-5 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:leading-none [&_h2]:text-foreground [&_strong]:text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
        <p>
          {hi ? (
            <>
              यह गोपनीयता नीति <strong>{name}</strong> की वेबसाइट पर लागू होती है और बताती है कि आप हमारी साइट इस्तेमाल करते हैं या हमसे संपर्क करते हैं तो हम आपकी जानकारी कैसे लेते, इस्तेमाल करते और सुरक्षित रखते हैं।
            </>
          ) : (
            <>
              This privacy policy applies to the website of <strong>{name}</strong> and describes how we collect, use, and protect your information when you use our site or contact us.
            </>
          )}
        </p>

        <h2>{t("Information we collect", "हम कौन-सी जानकारी लेते हैं")}</h2>
        <p>
          {t(
            "When you submit a quote request or contact form, we collect the information you provide, such as name, phone number, email address, and message content. We use this only to respond to your enquiry and conduct our business.",
            "जब आप कोटेशन अनुरोध या संपर्क फ़ॉर्म भेजते हैं, तो आपकी दी हुई जानकारी, जैसे नाम, फ़ोन नंबर, ईमेल पता और संदेश, हम लेते हैं। इसका उपयोग हम सिर्फ़ आपकी पूछताछ का जवाब देने और अपना कामकाज चलाने के लिए करते हैं।"
          )}
        </p>

        <h2>{t("How we use your information", "आपकी जानकारी का हम कैसे उपयोग करते हैं")}</h2>
        <p>
          {t(
            "We use the information you provide to respond to quote requests, contact enquiries, and for internal business purposes. We do not sell your personal information to third parties.",
            "आपकी दी हुई जानकारी हम कोटेशन अनुरोध और पूछताछ का जवाब देने और अपने भीतरी कामकाज के लिए इस्तेमाल करते हैं। हम आपकी निजी जानकारी तीसरे पक्ष को नहीं बेचते।"
          )}
        </p>

        <h2>{t("Cookies and analytics", "कुकीज़ और एनालिटिक्स")}</h2>
        <p>
          {t(
            "Our website may use cookies or similar technologies for basic functionality. If we use analytics (e.g. Google Analytics), we may collect anonymised usage data to improve the site.",
            "हमारी वेबसाइट बुनियादी काम के लिए कुकीज़ या ऐसी ही तकनीकों का उपयोग कर सकती है। अगर हम एनालिटिक्स (जैसे गूगल एनालिटिक्स) इस्तेमाल करें, तो साइट सुधारने के लिए बिना पहचान वाला उपयोग-डेटा ले सकते हैं।"
          )}
        </p>

        <h2>{t("Contact", "संपर्क")}</h2>
        <p>
          {t("For any questions about this privacy policy or your data, contact us at", "इस गोपनीयता नीति या अपने डेटा के बारे में किसी भी सवाल के लिए हमसे यहाँ संपर्क करें:")} {site.email} {t("or", "या")} {site.phone}.
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
