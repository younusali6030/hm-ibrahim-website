import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Sans_3, Big_Shoulders_Display, IBM_Plex_Mono, Noto_Sans_Devanagari } from "next/font/google";
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

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang: Lang = isLang(params.lang) ? params.lang : "en";
  return buildRootMeta(lang);
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const bigShoulders = Big_Shoulders_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["700", "800"],
});

// Devanagari glyphs for the Hindi site. Listed after the Latin fonts in every stack, so English pages never
// download it and Hindi pages use it only for Devanagari characters.
const notoDeva = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-deva",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono-brand",
  display: "swap",
  preload: false,
  weight: ["500"],
});

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
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
