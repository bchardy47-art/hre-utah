import type { Metadata } from "next";
import "./globals.css";
import HardyHomesNav from "@/components/HardyHomesNav";
import HardyHomesFooter from "@/components/HardyHomesFooter";
import { DEFAULT_HARDY_HOMES_URL } from "@hardy-homes/shared/hardyHomesSite";
import { SiteStructuredData } from "@/components/StructuredData";

const siteUrl = process.env.NEXT_PUBLIC_HARDY_HOMES_URL || DEFAULT_HARDY_HOMES_URL;

export const metadata: Metadata = {
  title: {
    default: "Hardy Homes | Utah Home Builder | Build On Your Land",
    template: "%s | Hardy Homes",
  },
  description:
    "Hardy Homes by BCHardy, LLC is a Utah home builder. Choose a pre-designed floor plan, review your site, and build on your own land with clear standards.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Hardy Homes | Utah Home Builder | Build On Your Land",
    description:
      "Hardy Homes by BCHardy, LLC is a Utah home builder. Choose a pre-designed floor plan, review your site, and build on your own land with clear standards.",
    url: siteUrl,
    siteName: "Hardy Homes",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/videos/hardy-homes-hero-poster.jpg",
        width: 1280,
        height: 720,
        alt: "A Hardy Homes residence built on an owner's land in Utah",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:ital,wght@0,400;0,500;0,600;1,400&display=swap"
        />
      </head>
      <body>
        <SiteStructuredData />
        <HardyHomesNav />
        {children}
        <HardyHomesFooter />
      </body>
    </html>
  );
}
