import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AnalyticsEvents from "@/components/AnalyticsEvents";
import { SiteStructuredData } from "@/components/StructuredData";

const siteUrl = "https://hre-utah.com";

export const metadata: Metadata = {
  title: {
    default: "Hardy Real Estate | Utah Realtor, Home Design & Handyman Services",
    template: "%s | Hardy Real Estate",
  },
  description:
    "Hardy Real Estate is Brian Hardy's Utah real estate practice — a licensed REALTOR® offering buyer and seller representation, residential design, handyman services, and build-on-your-land homes through Hardy Homes.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hardy Real Estate | Utah Realtor, Home Design & Handyman Services",
    description:
      "Brian Hardy's Utah real estate practice — buyer and seller representation, residential design, handyman services, and build-on-your-land homes through Hardy Homes.",
    url: siteUrl,
    siteName: "Hardy Real Estate",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/hero-home.jpg",
        alt: "A Utah home represented by Hardy Real Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteStructuredData />
        <Nav />
        {children}
        <Footer />
        <Analytics />
        <GoogleAnalytics />
        <AnalyticsEvents />
      </body>
    </html>
  );
}
