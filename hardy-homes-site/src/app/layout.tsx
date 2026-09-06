import type { Metadata } from "next";
import "./globals.css";
import HardyHomesNav from "@/components/HardyHomesNav";
import HardyHomesFooter from "@/components/HardyHomesFooter";
import { DEFAULT_HARDY_HOMES_URL } from "@hardy-homes/shared/hardyHomesSite";

const siteUrl = process.env.NEXT_PUBLIC_HARDY_HOMES_URL || DEFAULT_HARDY_HOMES_URL;

export const metadata: Metadata = {
  title: {
    default: "Hardy Homes | Thoughtfully Designed Homes Built on Your Land",
    template: "%s | Hardy Homes",
  },
  description:
    "Hardy Homes by BCHardy, LLC offers build-on-your-land homes, pre-designed floor plans, standard features, and a straightforward building process.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hardy Homes | Thoughtfully Designed Homes Built on Your Land",
    description:
      "Hardy Homes by BCHardy, LLC offers build-on-your-land homes, pre-designed floor plans, standard features, and a straightforward building process.",
    url: siteUrl,
    siteName: "Hardy Homes",
    type: "website",
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
        <HardyHomesNav />
        {children}
        <HardyHomesFooter />
      </body>
    </html>
  );
}
