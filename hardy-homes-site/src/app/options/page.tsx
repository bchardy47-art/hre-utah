import type { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Options and Upgrades",
  description:
    "Where a Hardy Home can be personalized: exterior elevations, kitchen and bath finishes, flooring, fixtures, and site-driven adjustments to the plan.",
  alternates: {
    canonical: "/options",
  },
  openGraph: {
    title: "Options & Upgrades | Hardy Homes",
    description:
      "Where a Hardy Home can be personalized: exterior elevations, kitchen and bath finishes, flooring, fixtures, and site-driven adjustments to the plan.",
    url: "/options",
    siteName: "Hardy Homes",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

const categories = [
  "Exterior materials and elevation direction",
  "Kitchen and bathroom finish selections",
  "Flooring and interior finish upgrades",
  "Appliance, fixture, and lighting allowances",
  "Site-driven scope adjustments",
  "Plan-specific layout modifications when approved",
];

export default function OptionsPage() {
  return (
    <section className="section hardy-collection-page">
      <div className="container">
        <div className="sec-head hardy-collection-page-head hh-head-left">
          <span className="eyebrow">Options &amp; Upgrades</span>
          <h1 className="h-lg">Personalize the build without losing clarity.</h1>
          <p>Hardy Homes is structuring options so the baseline, the upgrades, and the site-driven scope can stay easy to understand.</p>
        </div>
        <div className="feat-grid hh-standard-grid" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
          {categories.map((item) => (
            <article key={item} className="card feat hh-standard-card">
              <h3>{item}</h3>
            </article>
          ))}
        </div>
        <div className="card hardy-standard-card plan-accent hh-page-note" style={{ marginTop: 28 }}>
          <span className="eyebrow">Important</span>
          <p className="hardy-standard-inline">
            Final options, finish packages, and upgrade pricing are still being formalized. Project-specific selections are documented before contract.
          </p>
          <div className="hardy-cta-actions">
            <Link className="btn btn-primary" href="/contact">Ask About Options</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
