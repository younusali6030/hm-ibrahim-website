import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { buildRootMeta } from "@/lib/seo";
import { isLang, htmlLang, LANGS, type Lang } from "@/lib/locale";

import { JsonLd } from "@/components/JsonLd";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { LangProvider } from "@/lib/i18n";
import { PageCredits } from "@/components/indore/PageCredits";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  const lang: Lang = isLang(params.lang) ? params.lang : "en";
  return buildRootMeta(lang);
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

// Fonts are self-hosted (app/fonts, variable files from Google Fonts, OFL). next/font/google downloaded them at build
// time, and a failed download once broke a production deploy. Latin subset only; Devanagari only for the Hindi site.
const plusJakarta = localFont({
  src: "../fonts/PlusJakartaSans-latin.woff2",
  variable: "--font-heading",
  display: "swap",
  preload: false,
  weight: "400 700",
});

const sourceSans = localFont({
  src: "../fonts/SourceSans3-latin.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "400 700",
});

const bigShoulders = localFont({
  src: "../fonts/BigShouldersDisplay-latin.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "700 800",
});

// Devanagari glyphs for the Hindi site. Listed after the Latin fonts in every stack, so English pages never
// download it and Hindi pages use it only for Devanagari characters.
const notoDeva = localFont({
  src: "../fonts/NotoSansDevanagari-devanagari.woff2",
  variable: "--font-deva",
  display: "swap",
  preload: false,
  weight: "400 800",
});

const plexMono = localFont({
  src: "../fonts/IBMPlexMono-500-latin.woff2",
  variable: "--font-mono-brand",
  display: "swap",
  preload: false,
  weight: "500",
});

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
  }>
) {
  const { children } = props;
  const params = await props.params;

  if (!isLang(params.lang)) notFound();
  const lang: Lang = params.lang;
  return (
    <html
      lang={htmlLang[lang]}
      className={`dark ${sourceSans.variable} ${plusJakarta.variable} ${bigShoulders.variable} ${plexMono.variable} ${notoDeva.variable}`}
    >
      <body className={`min-h-screen flex flex-col min-w-0 antialiased`}>
        <LangProvider lang={lang}>
          <GoogleAnalytics />
          <Navbar />
          <main className="flex-1 w-full min-w-0">{children}</main>
          <Footer />
          <PageCredits />
          <MobileStickyCTA />
          <JsonLd lang={lang} />
        </LangProvider>
      </body>
    </html>
  );
}
