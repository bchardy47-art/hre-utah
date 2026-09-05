import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Hardy Homes by BCHardy, LLC approaches pre-designed floor plans, standard features, and build-on-your-land homebuilding.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | Hardy Homes",
    description:
      "Learn how Hardy Homes by BCHardy, LLC approaches pre-designed floor plans, standard features, and build-on-your-land homebuilding.",
    url: "/about",
    siteName: "Hardy Homes",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <section className="section hardy-collection-page">
      <div className="container" style={{ maxWidth: 1120 }}>
        <div className="sec-head hardy-collection-page-head hh-head-left">
          <span className="eyebrow">About Hardy Homes</span>
          <h1 className="h-lg">A homebuilding brand focused on product clarity.</h1>
          <p>
            Hardy Homes by BCHardy, LLC is being built around pre-designed home plans, defined standard features, structured options, and a more straightforward build-on-your-land process.
          </p>
        </div>
        <div className="hh-band card plan-accent hh-band-featured">
          <div>
            <h2>What Hardy Homes is built around</h2>
            <ul>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m5 13 4 4L19 7" /></svg>Pre-designed floor plans</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m5 13 4 4L19 7" /></svg>Build-on-your-land homes</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m5 13 4 4L19 7" /></svg>Defined standard features</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m5 13 4 4L19 7" /></svg>Structured options and upgrades</li>
            </ul>
          </div>
          <div>
            <p>
              Hardy Homes stays focused on the homebuilding side. HRE can support land search and real-estate-related parts of the transition, while Hardy Homes centers the home, the plan, and the build process.
            </p>
            <div className="hardy-cta-actions" style={{ marginTop: 18 }}>
              <Link className="btn btn-primary" href="/floor-plans">View Floor Plans</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
