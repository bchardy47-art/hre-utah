import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HardyHomeCard from "@/components/HardyHomeCard";
import HardyHeroVideo from "@/components/HardyHeroVideo";
import { getStandaloneFeaturedHomes, hardyCollections, hardyStandardHighlights } from "@hardy-homes/shared/hardyHomes";
import { getCollectionPath, getFloorPlansPath, getStandardFeaturesPath, getBuildOnYourLandPath } from "@hardy-homes/shared/hardyHomesRoutes";

export const metadata: Metadata = {
  title: "Hardy Homes | Thoughtfully Designed Homes Built on Your Land",
  description:
    "Explore Hardy Homes floor plans, standard features, and a straightforward build-on-your-land process.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hardy Homes | Thoughtfully Designed Homes Built on Your Land",
    description:
      "Explore Hardy Homes floor plans, standard features, and a straightforward build-on-your-land process.",
    url: "/",
    siteName: "Hardy Homes",
    type: "website",
  },
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const process = [
  "Choose your plan.",
  "Confirm the site.",
  "Finalize features and options.",
  "Move toward construction.",
];

export default function HardyHomesHomePage() {
  return (
    <>
      <section className="hero hero--page hh-hero" data-screen-label="Hardy Homes Home">
        <HardyHeroVideo />
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <span className="eyebrow">Hardy Homes</span>
          <h1 className="h-xl">Thoughtfully designed homes. Straightforward building. Built on your land.</h1>
          <p className="lead hh-hero-lead">
            Browse pre-designed floor plans, understand the standard, and move through a clearer build-on-your-land process.
          </p>
          <div className="hardy-cta-actions hh-hero-actions">
            <Link className="btn btn-primary btn-lg" href={getFloorPlansPath("standalone")}>View Floor Plans <Arrow /></Link>
            <Link className="btn btn-ghost btn-lg" href={getBuildOnYourLandPath("standalone")}>Build On Your Land <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="featured-plans">
        <div className="container">
          <div className="sec-head hardy-catalog-head hh-head-left">
            <span className="eyebrow">Featured Plans</span>
            <h2 id="featured-plans">Start with the homes that are ready to explore now.</h2>
          </div>
          <div className="hardy-plan-card-grid hh-featured-grid">
            {getStandaloneFeaturedHomes().map((home) => (
              <HardyHomeCard key={home.slug} home={home} />
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="collections">
        <div className="container">
          <div className="sec-head hardy-catalog-head hh-head-left">
            <span className="eyebrow">Collections</span>
            <h2 id="collections">Choose the collection that fits how you want to live.</h2>
          </div>
          <div className="hardy-catalog-grid hh-collections-grid">
            {hardyCollections.map((collection) => (
              <article key={collection.slug} className="card hardy-catalog-card plan-accent hh-collection-card">
                <div className="hardy-catalog-media">
                  <Image
                    src={collection.image.src}
                    alt={collection.image.alt}
                    fill
                    priority={collection.image.priority}
                    sizes={collection.image.sizes}
                    className="hardy-gallery-image"
                    style={{ objectFit: collection.image.fit, objectPosition: collection.image.position }}
                  />
                </div>
                <div className="hardy-catalog-body">
                  <span className="eyebrow">{collection.title}</span>
                  <p>{collection.description}</p>
                  <Link className="btn btn-ghost" href={getCollectionPath(collection, "standalone")}>Explore Collection <Arrow /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="build-on-your-land-home">
        <div className="container">
          <div className="hh-band card plan-accent hh-band-featured">
            <div>
              <span className="eyebrow">Build On Your Land</span>
              <h2 id="build-on-your-land-home">Choose your plan. Make it yours. Build it on your land.</h2>
              <p>
                Hardy Homes is built around a straightforward process: start with the home, review the site, clarify what is included, and move toward construction with more confidence.
              </p>
            </div>
            <div className="hh-band-actions">
              <Link className="btn btn-primary btn-lg" href={getBuildOnYourLandPath("standalone")}>Build On Your Land <Arrow /></Link>
              <Link className="btn btn-ghost btn-lg" href={getFloorPlansPath("standalone")}>View Floor Plans <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="standard-features">
        <div className="container">
          <div className="hh-band card plan-accent hh-band-slim">
            <div>
              <span className="eyebrow">Standard Features</span>
              <h2 id="standard-features">A concise standard, clearly presented.</h2>
              <p>
                Hardy Homes standard features are being built out carefully so buyers understand the baseline before choosing options.
              </p>
              <ul>
                {hardyStandardHighlights.map((item) => (
                  <li key={item}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m5 13 4 4L19 7" /></svg>{item}</li>
                ))}
              </ul>
            </div>
            <div className="hh-band-actions">
              <Link className="btn btn-primary" href={getStandardFeaturesPath("standalone")}>View Standard Features <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="how-it-works-preview">
        <div className="container">
          <div className="sec-head hh-head-left"><span className="eyebrow">How It Works</span><h2 id="how-it-works-preview">A builder-first path that stays easy to follow.</h2></div>
          <div className="feat-grid hh-process-grid" style={{ gridTemplateColumns: "repeat(4,minmax(0,1fr))" }}>
            {process.map((item, index) => (
              <article key={item} className="card feat hh-process-card">
                <span className="label">Step {index + 1}</span>
                <h3>{item}</h3>
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
              <h2>Ready to look at plans or talk about your property?</h2>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href={getFloorPlansPath("standalone")}>View Floor Plans <Arrow /></Link>
              <Link className="btn btn-ghost btn-lg" href="/contact">Contact Hardy Homes <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
