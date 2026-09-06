import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { HardyStandardFeature } from "@hardy-homes/shared/hardyHomes";
import HardyStandardFeatureGrid from "@/components/HardyStandardFeatureGrid";
import { getOptionsPath } from "@hardy-homes/shared/hardyHomesRoutes";

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

const signatureStandards: HardyStandardFeature[] = [
  {
    key: "2x6-exterior-walls",
    title: "2×6 Exterior Wall Construction",
    description: "A stronger wall assembly that supports durability, insulation capacity, and long-term comfort.",
    icon: "structure",
  },
  {
    key: "tankless-water-heater",
    title: "Tankless Water Heater",
    description: "Efficient on-demand hot water without a traditional storage tank footprint.",
    icon: "efficiency",
  },
  {
    key: "plan-specific-construction-specifications",
    title: "Plan-Specific Construction Specifications",
    description: "Each Hardy Home is documented around the selected floor plan and the way that home is meant to be built.",
    icon: "structure",
  },
  {
    key: "standard-vs-upgrades-separated",
    title: "Standard Features Separated from Upgrades",
    description: "Buyers can clearly understand what is included before choosing the options they want to add.",
    icon: "finish",
  },
];

const standardCategories = [
  {
    title: "Structure & Foundation",
    copy:
      "Hardy Homes begins with the structural baseline for the selected plan, engineering requirements, site conditions, and code requirements. 2×6 exterior wall construction is part of that standard baseline.",
  },
  {
    title: "Exterior Wall Assemblies",
    copy:
      "Exterior assemblies are coordinated to the selected elevation, project requirements, and site conditions so the home is built around the way it will actually live on the lot.",
  },
  {
    title: "Windows, Doors & Insulation",
    copy:
      "Window, door, and insulation specifications are finalized for the selected home and project conditions before contract so buyers understand the baseline being built.",
  },
  {
    title: "Heating, Cooling & Hot Water",
    copy:
      "The Hardy Standard includes a tankless water heater. Heating, cooling, controls, and related mechanical specifications are finalized around the selected plan and project requirements.",
  },
  {
    title: "Kitchen, Bath & Interior Finishes",
    copy:
      "Interior baseline selections are defined clearly so buyers can understand standard finishes separately from optional upgrades and personalized selections.",
  },
  {
    title: "Site Conditions & Final Construction Specifications",
    copy:
      "Utilities, access, jurisdictional requirements, engineering, and other site realities are incorporated into the final construction specification package prepared for the home.",
  },
] as const;

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
            <h1 className="h-xl">A better baseline. Before you add a single upgrade.</h1>
            <p className="lead hh-standard-page-hero-lead">
              Every Hardy Home starts with a thoughtfully selected construction standard focused on durability, efficiency, comfort, and long-term value.
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

      <section className="section" aria-labelledby="signature-standard">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Included in the Hardy Standard</span>
            <h2 id="signature-standard">A clear baseline before selections begin.</h2>
            <p>
              Hardy Homes starts with meaningful standards buyers can understand before upgrades are selected.
            </p>
          </div>
          <HardyStandardFeatureGrid features={signatureStandards} featured />
        </div>
      </section>

      <section className="section alt" aria-labelledby="standard-categories">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">The Hardy Standard</span>
            <h2 id="standard-categories">Built around the parts of the home that matter most.</h2>
          </div>
          <div className="hh-standard-category-grid">
            {standardCategories.map((category) => (
              <article key={category.title} className="card hh-standard-category-card plan-accent">
                <div className="hh-standard-category-head">
                  <div className="feat-ico hh-standard-feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path d="M3 20h18" />
                      <path d="M6 20V8l6-4 6 4v12" />
                    </svg>
                  </div>
                  <h3>{category.title}</h3>
                </div>
                <p>{category.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="standard-vs-options">
        <div className="container">
          <div className="card hh-standard-compare-band plan-accent">
            <div>
              <span className="eyebrow">Standard vs Options</span>
              <h2 id="standard-vs-options">Know what is included. Then choose what to add.</h2>
              <p>
                Hardy Homes begins with a defined baseline. Optional upgrades are selected separately so buyers can clearly understand what is included and what they are choosing to add.
              </p>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href={getOptionsPath("standalone")}>
                Explore Options &amp; Upgrades <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="final-specifications">
        <div className="container">
          <div className="card hh-standard-disclaimer plan-accent">
            <span className="eyebrow">Final Specifications</span>
            <h2 id="final-specifications">Your home. Your site. Your final spec.</h2>
            <p className="hardy-standard-inline">
              Final construction specifications are prepared for the selected home plan and building site before contract. Site conditions, jurisdictional requirements, and selected options may affect individual specifications.
            </p>
          </div>
        </div>
      </section>

      <section className="section tight alt" aria-labelledby="standard-final-cta">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent hh-final-cta">
            <div>
              <span className="eyebrow">Ready to Build?</span>
              <h2 id="standard-final-cta">Start with the home. Then make it yours.</h2>
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
