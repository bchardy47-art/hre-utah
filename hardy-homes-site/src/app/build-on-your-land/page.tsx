import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Build On Your Land",
  description:
    "Learn how Hardy Homes approaches build-on-your-land projects, from choosing a plan to reviewing site conditions and clarifying final scope.",
  alternates: {
    canonical: "/build-on-your-land",
  },
  openGraph: {
    title: "Build On Your Land | Hardy Homes",
    description:
      "Learn how Hardy Homes approaches build-on-your-land projects, from choosing a plan to reviewing site conditions and clarifying final scope.",
    url: "/build-on-your-land",
    siteName: "Hardy Homes",
    type: "website",
  },
};

const steps = [
  "Choose a Hardy Homes plan that fits the footprint and layout you want.",
  "Review the lot, access, utilities, and general site feasibility.",
  "Clarify standard features, options, and any site-driven scope changes.",
  "Move into final planning, pricing, and construction documentation when the project is a fit.",
];

export default function BuildOnYourLandPage() {
  return (
    <section className="section hardy-collection-page">
      <div className="container">
        <div className="sec-head hardy-collection-page-head hh-head-left">
          <span className="eyebrow">Build On Your Land</span>
          <h1 className="h-lg">Bring the lot. Start with a plan. Build with more clarity.</h1>
          <p>Hardy Homes is built around a straightforward build-on-your-land process that starts with the home and the site together.</p>
        </div>
        <div className="hh-band card plan-accent hh-band-featured">
          <div>
            <h2>What we review first</h2>
            <ul>
              {steps.map((item) => (
                <li key={item}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m5 13 4 4L19 7" /></svg>{item}</li>
              ))}
            </ul>
          </div>
          <div className="hh-band-actions">
            <Link className="btn btn-primary btn-lg" href="/floor-plans">View Floor Plans</Link>
            <Link className="btn btn-ghost btn-lg" href="/contact">Contact Hardy Homes</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
