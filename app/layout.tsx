import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { baseUrl, site } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: `${baseUrl}/logo-dark.png`,
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
    images: [`${baseUrl}/logo-dark.png`],
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
  icons: { icon: "/favicon.svg" },
};

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
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${sourceSans.variable} ${plusJakarta.variable} font-sans min-h-screen flex flex-col min-w-0 antialiased`}>
        <GoogleAnalytics />
        <Navbar />
        <main className="flex-1 w-full min-w-0 pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileStickyCTA />
        <JsonLd />
      </body>
    </html>
  );
}
