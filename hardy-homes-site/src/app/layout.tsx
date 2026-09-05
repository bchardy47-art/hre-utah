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
      <body>
        <HardyHomesNav />
        {children}
        <HardyHomesFooter />
      </body>
    </html>
  );
}
