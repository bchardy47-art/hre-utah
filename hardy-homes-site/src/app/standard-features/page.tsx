import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Hardy Standard | Standard Features",
  description:
    "See what's included in a Hardy Home, including 2×6 exterior walls, tankless water heating, and the baseline construction and finish standards that come before upgrades.",
  alternates: {
    canonical: "/standard-features",
  },
  openGraph: {
    title: "The Hardy Standard | Standard Features | Hardy Homes",
    description:
      "See what's included in a Hardy Home, including 2×6 exterior walls, tankless water heating, and the baseline construction and finish standards that come before upgrades.",
    url: "/standard-features",
    siteName: "Hardy Homes",
    type: "website",
  },
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const standardCategories = [
  {
    title: "Structure & Foundation",
    features: [
      { key: "2x6-exterior-walls", title: "2×6 Exterior Wall Construction" },
      { key: "9-foot-main-living-ceilings", title: "9' Ceilings on the Main Living Level" },
    ],
  },
  {
    title: "Exterior",
    features: [
      { key: "fiber-cement-cladding", title: "Fiber-Cement or Equivalent Quality Exterior Cladding" },
      { key: "architectural-shingles", title: "Architectural Shingles" },
    ],
  },
  {
    title: "Windows & Doors",
    features: [
      { key: "low-e-windows", title: "Low-E Energy-Efficient Windows" },
      { key: "insulated-exterior-doors", title: "Insulated Exterior Doors" },
    ],
  },
  {
    title: "Heating & Cooling",
    features: [
      { key: "high-efficiency-hvac", title: "High-Efficiency HVAC" },
      { key: "smart-thermostat", title: "Smart Thermostat" },
    ],
  },
  {
    title: "Plumbing & Hot Water",
    features: [
      { key: "tankless-water-heater", title: "High-Efficiency Tankless Water Heater" },
      { key: "pex-plumbing", title: "PEX Plumbing" },
    ],
  },
  {
    title: "Electrical",
    features: [
      { key: "led-lighting", title: "LED Lighting Throughout" },
    ],
  },
  {
    title: "Kitchen",
    features: [
      { key: "quartz-countertops", title: "Quartz Countertops" },
      { key: "soft-close-cabinetry", title: "Soft-Close Cabinetry" },
    ],
  },
  {
    title: "Interior Finishes",
    features: [
      { key: "modern-interior-trim", title: "Modern Interior Trim and Lever Hardware" },
    ],
  },
  {
    title: "Flooring",
    features: [
      { key: "lvp-main-living", title: "LVP in Primary Living Areas" },
    ],
  },
];

export default function StandardFeaturesPage() {
  return (
    <>
      <section className="section hh-standard-page-hero" data-screen-label="Standard Features">
        <div className="hh-standard-page-hero-scene" aria-hidden="true">
          <img className="slot" src="/images/hardy-homes/single-family/rock/RockExt.jpg" alt="" />
        </div>
        <div className="container hh-standard-page-hero-grid">
          <div className="hh-standard-page-hero-copy">
            <span className="eyebrow">The Hardy Standard</span>
            <h1 className="h-xl">What comes standard in a Hardy Home.</h1>
            <p className="lead hh-standard-page-hero-lead">
              A straightforward look at the features and construction standards included in a Hardy Home.
            </p>
          </div>
          <div className="card hh-standard-page-hero-mark plan-accent">
            <Image
              src="/brand/hardy-homes-logo-header.png"
              alt="Hardy Homes logo"
              width={1153}
              height={738}
              priority
              sizes="(max-width: 980px) 80vw, 34vw"
              className="hh-standard-logo"
            />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="standard-features-list">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Standard Features</span>
            <h2 id="standard-features-list">Included in the Hardy Standard</h2>
          </div>
          <div className="hh-standard-sheet-grid">
            {standardCategories.map((category) => (
              <article key={category.title} className="card hh-standard-sheet-card plan-accent">
                <h3>{category.title}</h3>
                <ul className="hh-standard-sheet-list">
                  {category.features.map((feature) => (
                    <li key={feature.key}>
                      <Check />
                      <span>{feature.title}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="final-specifications">
        <div className="container">
          <div className="card hh-standard-disclaimer plan-accent">
            <span className="eyebrow">Final Specifications</span>
            <h2 id="final-specifications">Final specifications</h2>
            <p className="hardy-standard-inline">
              Final specifications may vary by home plan, site conditions, jurisdictional requirements, and selected options. Your final construction specifications will be provided before contract.
            </p>
          </div>
        </div>
      </section>

      <section className="section tight alt" aria-labelledby="standard-final-cta">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent hh-final-cta">
            <div>
              <span className="eyebrow">Ready to Build?</span>
              <h2 id="standard-final-cta">Find your home.</h2>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/floor-plans">View Floor Plans <Arrow /></Link>
              <Link className="btn btn-ghost btn-lg" href="/contact">Start Your Build <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
