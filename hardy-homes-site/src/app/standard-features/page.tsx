import type { Metadata } from "next";
import Link from "next/link";
import { hardyStandardCopy, hardyStandardHighlights } from "@hardy-homes/shared/hardyHomes";

export const metadata: Metadata = {
  title: "Standard Features",
  description:
    "Review the Hardy Homes standard-feature direction, including current baseline construction priorities and project-specific specification framing.",
  alternates: {
    canonical: "/standard-features",
  },
  openGraph: {
    title: "Standard Features | Hardy Homes",
    description:
      "Review the Hardy Homes standard-feature direction, including current baseline construction priorities and project-specific specification framing.",
    url: "/standard-features",
    siteName: "Hardy Homes",
    type: "website",
  },
};

const categories = [
  {
    title: "Structure & foundation",
    copy: "Base construction decisions are coordinated with the home plan, engineering, site conditions, and jurisdictional requirements.",
  },
  {
    title: "Exterior wall assemblies",
    copy: "The current Hardy Homes direction includes 2x6 exterior wall construction as part of a stronger baseline package.",
  },
  {
    title: "Heating, cooling, and hot water",
    copy: "Mechanical decisions are finalized by project, including the current direction toward a tankless water heater standard.",
  },
  {
    title: "Windows, doors, and insulation",
    copy: "Final assemblies vary by home, site, code, and selected options, and are documented before contract.",
  },
  {
    title: "Kitchen, bath, and interior finishes",
    copy: "Finish selections remain project-specific so the baseline and upgrades can be understood clearly.",
  },
  {
    title: "Site conditions and final construction specifications",
    copy: "Lot conditions, utilities, access, and jurisdiction all affect the final specification package.",
  },
];

export default function StandardFeaturesPage() {
  return (
    <>
      <section className="hero hero--page hh-hero" data-screen-label="Standard Features">
        <div className="scene">
          <img className="slot" src="/images/hardy-homes/single-family/rock/RockExt.jpg" alt="Hardy Homes exterior" />
        </div>
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <span className="eyebrow">Standard Features</span>
          <h1 className="h-xl">The Hardy Standard</h1>
          <p className="lead hh-hero-lead">{hardyStandardCopy.body}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="hh-band card plan-accent hh-band-slim">
            <div>
              <span className="eyebrow">Current Direction</span>
              <h2>Building a clear baseline before options are selected.</h2>
              <p>{hardyStandardCopy.note}</p>
            </div>
            <div>
              <ul>
                {hardyStandardHighlights.map((item) => (
                  <li key={item}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m5 13 4 4L19 7" /></svg>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <div className="sec-head hh-head-left">
            <span className="eyebrow">What This Covers</span>
            <h2>Organized around the parts of the home buyers actually need to understand.</h2>
          </div>
          <div className="feat-grid hh-standard-grid" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
            {categories.map((item) => (
              <article key={item.title} className="card feat hh-standard-card">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section tight">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent hh-final-cta">
            <div>
              <span className="eyebrow">Next Step</span>
              <h2>See the homes this standard is built around.</h2>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/floor-plans">View Floor Plans</Link>
              <Link className="btn btn-ghost btn-lg" href="/contact">Contact Hardy Homes</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
