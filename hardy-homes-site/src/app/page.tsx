import type { Metadata } from "next";
import Link from "next/link";

import HardyHomeCard from "@/components/HardyHomeCard";
import HardyHeroVideo from "@/components/HardyHeroVideo";
import { getPublicHardyHomes } from "@hardy-homes/shared/hardyHomes";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hardy Homes | Utah Home Builder | Build On Your Land",
  description:
    "Choose a Hardy Home and build it on your land in Utah. Explore current Hardy Homes floor plans.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hardy Homes | Utah Home Builder | Build On Your Land",
    description: "Choose a Hardy Home and build it on your land in Utah.",
    url: "/",
    siteName: "Hardy Homes",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

const Arrow = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function HardyHomesHomePage() {
  return (
    <>
      <section className="hero hero--page hh-hero">
        <HardyHeroVideo />
        <div className="hero-overlay" />

        <div className="container hero-inner">
          <h1 className="h-xl">
            PLAN IT. BUILD IT. LIVE{"\u00a0"}IT.
          </h1>

          <p className="lead hh-hero-lead">
            Choose a home. Build it on your land.
          </p>

          <div className="hardy-cta-actions hh-hero-actions">
            <Link className="btn btn-primary btn-lg" href="/floor-plans">
              View Homes <Arrow />
            </Link>

            <Link className="btn btn-ghost btn-lg" href="/contact">
              Start Your Build <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="choose-home">
        <div className="container">
          <div className="sec-head hardy-catalog-head hh-head-left">
            <h2 id="choose-home">Choose your home.</h2>
          </div>

          <div className="hardy-plan-card-grid hh-featured-grid">
            {getPublicHardyHomes().map((home) => (
              <HardyHomeCard key={home.slug} home={home} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
