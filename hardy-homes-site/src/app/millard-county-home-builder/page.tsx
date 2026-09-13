import type { Metadata } from "next";
import Link from "next/link";

import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { getPublicHardyHomes } from "@hardy-homes/shared/hardyHomes";
import { getPlanPath } from "@hardy-homes/shared/hardyHomesRoutes";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Millard County Home Builder",
  description:
    "Build a Hardy Home on your land in Millard County, Utah. Explore Hardy Homes floor plans and talk with us about your property.",
  alternates: {
    canonical: "/millard-county-home-builder",
  },
  openGraph: {
    title: "Millard County Home Builder | Hardy Homes",
    description:
      "Choose a Hardy Homes plan, personalize it, and build it on your property in Millard County.",
    url: "/millard-county-home-builder",
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

export default function MillardCountyHomeBuilderPage() {
  const plans = getPublicHardyHomes();

  return (
    <>
      <BreadcrumbStructuredData
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Millard County", path: "/millard-county-home-builder" },
        ]}
      />

      <section className="section hardy-collection-page">
        <div className="container">
          <nav className="hardy-back-links" aria-label="Breadcrumb">
            <ol className="hardy-crumbs">
              <li><Link href="/">Home</Link></li>
              <li><span aria-current="page">Millard County</span></li>
            </ol>
          </nav>

          <div className="sec-head hardy-collection-page-head hh-head-left">
            <span className="eyebrow">Millard County, Utah</span>
            <h1 className="h-lg">Build a Hardy Home on your land.</h1>
            <p className="lead">
              Choose a Hardy Homes plan, personalize it, and build it on property you own in Millard County.
            </p>
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

      <section className="section alt" aria-labelledby="millard-homes">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Hardy Homes</span>
            <h2 id="millard-homes">Choose your home.</h2>
            <p>
              Start with a professionally designed Hardy Homes plan instead of starting from a blank page.
            </p>
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
                      <img
                        src={exterior.src}
                        alt={exterior.alt}
                        loading="lazy"
                      />
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

      <section className="section" aria-labelledby="millard-land">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Your Property</span>
            <h2 id="millard-land">Already have land?</h2>
            <p>
              Send us the property. We&apos;ll look at the site and the major items that may affect the build before finalizing the project scope.
            </p>
          </div>

          <div className="hh-band card plan-accent hh-band-slim">
            <div>
              <ul>
                <li><Check />Access and home placement</li>
                <li><Check />Water and utilities</li>
                <li><Check />Septic or sewer</li>
                <li><Check />Grading and property-specific site work</li>
              </ul>
            </div>

            <div className="hh-band-actions">
              <Link className="btn btn-primary" href="/contact">
                Tell Us About Your Property
              </Link>
              <Link className="btn btn-ghost" href="/build-on-your-land">
                Build On Your Land
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="millard-fit">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Built For Your Land</span>
            <h2 id="millard-fit">A home that works with the property.</h2>
            <p>
              Building in Millard County often means having more room to think about how the home sits on the land.
              Driveway approach, outdoor space, a future shop, RV parking, equipment, animals, or simply more distance
              from the neighbors may matter just as much as the house itself.
            </p>
            <p>
              Hardy Homes starts with the home you want and the property you have, then brings the two together.
            </p>
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="millard-final-cta">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent hh-final-cta">
            <div>
              <span className="eyebrow">Millard County</span>
              <h2 id="millard-final-cta">Have land? Let&apos;s talk about what you want to build.</h2>
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
