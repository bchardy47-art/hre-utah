import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hardy Real Estate — Don't Just Tour the House. Understand It.",
  description:
    "Utah realtor Brian Hardy brings real-world construction judgment to buying, selling, and handyman work — honest guidance for confident moves.",
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
      </body>
    </html>
  );
}
