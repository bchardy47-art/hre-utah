import type { Metadata } from "next";
import Link from "next/link";

import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { HARDY_HOMES_SERVICE_AREA_LINE } from "@hardy-homes/shared/hardyHomesSite";
import { getPublicHardyHomes } from "@hardy-homes/shared/hardyHomes";
import { getPlanPath } from "@hardy-homes/shared/hardyHomesRoutes";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Build On Your Land in Utah",
  description:
    "Choose a Hardy Homes plan, personalize it, and build it on land you own in Utah. See how Hardy Homes works with your home and property.",
  alternates: {
    canonical: "/build-on-your-land",
  },
  openGraph: {
    title: "Build On Your Land in Utah | Hardy Homes",
    description:
      "Choose a Hardy Homes plan, personalize it, and build it on property you own.",
    url: "/build-on-your-land",
    siteName: "Hardy Homes",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="m5 13 4 4L19 7" />
  </svg>
);


function ProcessMark({ step }: { step: string }) {
  const common = {
    "aria-hidden": true,
    viewBox: "0 0 64 42",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (step === "1") {
    return (
      <svg {...common}>
        <path d="M5 6 56 3l3 32-50 4z" />
        <path d="M19 13h24v17H19z" strokeDasharray="3 3" />
        <path d="M5 31h14" />
        <path d="m9 28-4 3 4 3" />
      </svg>
    );
  }

  if (step === "2") {
    return (
      <svg {...common}>
        <path d="M6 34h52" />
        <path d="M13 34V20l19-13 19 13v14" />
        <path d="M22 34V23h20v11" />
        <path d="M28 34V26h8v8" />
        <path d="M10 21 32 5l22 16" />
      </svg>
    );
  }

  if (step === "3") {
    return (
      <svg {...common}>
        <rect x="6" y="8" width="15" height="26" rx="1" />
        <rect x="25" y="8" width="15" height="26" rx="1" />
        <rect x="44" y="8" width="14" height="26" rx="1" />
        <path d="m7 29 13-13M7 21l12-12M26 30l13-9M26 22l13-9M46 13h10M46 19h10M46 25h10M46 31h10" />
      </svg>
    );
  }

  if (step === "4") {
    return (
      <svg {...common}>
        <path d="M11 5h37l6 6v26H11z" />
        <path d="M48 5v7h6" />
        <path d="M18 14h20M18 20h28M18 26h17" />
        <path d="M17 33h30" />
        <path d="M17 30v6M47 30v6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M5 35h54" />
      <path d="M11 35V18M21 35V12M32 35V8M43 35V12M53 35V18" />
      <path d="m11 18 21-12 21 12" />
      <path d="M11 18h42" />
      <path d="M21 12 32 18l11-6" />
    </svg>
  );
}


export default function BuildOnYourLandPage() {
  const plans = getPublicHardyHomes();

  return (
    <>
      <BreadcrumbStructuredData
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Build On Your Land", path: "/build-on-your-land" },
        ]}
      />

      <section className="section hardy-collection-page">
        <div className="container">
          <nav className="hardy-back-links" aria-label="Breadcrumb">
            <ol className="hardy-crumbs">
              <li><Link href="/">Home</Link></li>
              <li><span aria-current="page">Build On Your Land</span></li>
            </ol>
          </nav>

          <div className="sec-head hardy-collection-page-head hh-head-left">
            <span className="eyebrow">Build On Your Land</span>
            <h1 className="h-lg">You bring the land. We bring the home.</h1>
            <p className="lead">
              Choose a Hardy Homes plan, personalize it, and build it on property you own.
            </p>
            <p className="hh-service-area">{HARDY_HOMES_SERVICE_AREA_LINE}</p>

            <div className="hardy-cta-actions" style={{ marginTop: 24 }}>
              <Link className="btn btn-primary btn-lg" href="/floor-plans">
                Explore Floor Plans <Arrow />
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/contact">
                Tell Us About Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="land-status">
        <div className="container">
          <div className="hardy-detail-grid">
            <div className="card hardy-standard-card plan-accent" style={{ padding: 30 }}>
              <span className="eyebrow">Already Own Land</span>
              <h2 className="h-md">Start with the property.</h2>
              <p className="hardy-standard-inline">
                Send us the location or parcel information. We&apos;ll start by looking at the site and the major items
                that may affect the project.
              </p>
            </div>

            <div className="card hardy-standard-card plan-accent" style={{ padding: 30 }}>
              <span className="eyebrow">Still Looking</span>
              <h2 className="h-md">Talk to us before you buy.</h2>
              <p className="hardy-standard-inline">
                If you&apos;re considering a property, we can talk through obvious building considerations before you
                commit to the land.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="home-and-property">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Home + Property</span>
            <h2 id="home-and-property">One project. Two parts.</h2>
            <p>We look at the home you choose and what your property requires.</p>
          </div>

          <div className="hardy-detail-grid">
            <div className="card hardy-standard-card plan-accent" style={{ padding: 30 }}>
              <span className="eyebrow">Your Hardy Home</span>
              <h3 className="h-md">The home.</h3>
              <ul className="hardy-feature-list hardy-feature-list--single">
                <li><Check />Floor plan</li>
                <li><Check />Hardy Standard features</li>
                <li><Check />Selections and finishes</li>
                <li><Check />Options and approved modifications</li>
              </ul>
            </div>

            <div className="card hardy-standard-card plan-accent" style={{ padding: 30 }}>
              <span className="eyebrow">Your Property</span>
              <h3 className="h-md">The site.</h3>
              <ul className="hardy-feature-list hardy-feature-list--single">
                <li><Check />Access and excavation</li>
                <li><Check />Utilities and power</li>
                <li><Check />Water and septic or sewer</li>
                <li><Check />Property-specific site work</li>
              </ul>
            </div>
          </div>

          <p className="hardy-standard-note" style={{ maxWidth: 820 }}>
            We evaluate both before finalizing the project.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="land-plans">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Choose Your Home</span>
            <h2 id="land-plans">Start with a Hardy Homes plan.</h2>
          </div>

          <div className="hardy-plan-card-grid">
            {plans.map((plan) => {
              const exterior =
                plan.images.find((image) => image.key === "exterior") ??
                plan.images.find((image) => image.key === "exterior-front") ??
                plan.images[0];

              return (
                <article key={plan.standaloneSlug} className="card hardy-plan-card">
                  {exterior ? (
                    <div className="hardy-gallery-media hardy-gallery-media-exterior">
                      <img src={exterior.src} alt={exterior.alt} loading="lazy" />
                    </div>
                  ) : null}

                  <div className="hardy-plan-card-body">
                    <h3 className="h-md">{plan.name}</h3>
                    <p>
                      {plan.squareFeet.toLocaleString()} sq ft · {plan.bedrooms} · {plan.bathrooms}
                      {plan.garage ? ` · ${plan.garage}` : ""}
                    </p>
                    <Link className="btn btn-primary" href={getPlanPath(plan, "standalone")}>
                      View Home <Arrow />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="land-process">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">How It Works</span>
            <h2 id="land-process">A straightforward path to building.</h2>
          </div>

          <div className="hh-process-grid">
            <div className="hh-process-rail" aria-hidden="true" />

            {[
              ["1", "Property", "Start with the land."],
              ["2", "Choose Your Home", "Pick the Hardy Homes plan that fits."],
              ["3", "Personalize", "Choose finishes, options, and approved changes."],
              ["4", "Final Scope", "Bring the home and site requirements together."],
              ["5", "Build", "Move into construction."],
            ].map(([number, title, copy]) => (
              <article
                key={number}
                className={`hh-process-card${number === "5" ? " hh-process-card--final" : ""}`}
                data-step={number.padStart(2, "0")}
              >
                <span className="hh-process-node" aria-hidden="true">
                  {number}
                </span>

                <span className="hh-process-mark">
                  <ProcessMark step={number} />
                </span>

                <span className="label">Step {number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="land-final-cta">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent hh-final-cta">
            <div>
              <span className="eyebrow">Your Property</span>
              <h2 id="land-final-cta">Tell us what you want to build.</h2>
            </div>

            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/contact">
                Tell Us About Your Property <Arrow />
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/floor-plans">
                Explore Floor Plans <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
