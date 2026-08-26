import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AnalyticsEvents from "@/components/AnalyticsEvents";

export const metadata: Metadata = {
  title: "Hardy Real Estate — Don't Just Tour the House. Understand It.",
  description:
    "Utah real estate, home design, and handyman help from Brian Hardy — honest guidance backed by real-world construction judgment.",
  icons: { icon: "/images/hre-logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
