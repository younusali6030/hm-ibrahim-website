import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { site } from "@/content/site";
import { JsonLd } from "@/components/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hmibrahimco.com";

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "wire mesh Indore",
    "iron and hardware Siyaganj Indore",
    "TMT bars Indore",
    "barbed wire Indore",
    "chain link fencing Indore",
    "GI wire Indore",
    "HM Ibrahim",
  ],
  metadataBase: new URL(baseUrl),
  alternates: { canonical: baseUrl },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: `${baseUrl}/logo.svg`,
        width: 1200,
        height: 630,
        alt: `${site.name} - Iron & Hardware Trading in Indore`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    images: [`${baseUrl}/logo.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans min-h-screen flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 w-full min-w-0 pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileStickyCTA />
        <JsonLd />
      </body>
    </html>
  );
}
