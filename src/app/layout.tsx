import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AnalyticsEvents from "@/components/AnalyticsEvents";

export const metadata: Metadata = {
  title: "HRE | Hardy Homes, Home Design & Real Estate",
  description:
    "Hardy Homes by BCHardy, LLC combines residential homebuilding, home design, real estate, and property improvement services in Utah.",
  metadataBase: new URL("https://www.hre-utah.com"),
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
