import type { Metadata } from "next";
import Link from "next/link";
import HardyHomeCard from "@/components/HardyHomeCard";
import {
  getGatewayFeaturedHomes,
  hardyStandardCopy,
  hardyStandardHighlights,
} from "@/lib/hardyHomes";
import {
  getHardyHomesFloorPlansHref,
  getHardyHomesRootHref,
  getHardyHomesStandardFeaturesHref,
  getHardyHomesPlanHref,
} from "@/lib/hardyHomesSite";
import LegacyHardyHomesRedirect from "./LegacyHardyHomesRedirect";

export const metadata: Metadata = {
  title: "Hardy Homes | Build-On-Your-Land Homebuilder Gateway | HRE Utah",
  description:
    "Explore Hardy Homes through HRE Utah — thoughtfully designed homes, straightforward building, and guidance from land search through construction.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const featuredHomes = getGatewayFeaturedHomes();
const offers = [
  "Pre-designed floor plans",
  "Hardy Homes standard features",
  "Options and upgrades",
  "Build on your land",
  "Guidance from planning through completion",
];

export default function HardyHomesPage() {
  const exploreHref = getHardyHomesRootHref();
  const floorPlansHref = getHardyHomesFloorPlansHref();
  const standardHref = getHardyHomesStandardFeaturesHref();

  return (
    <>
      <LegacyHardyHomesRedirect />
      <section className="hero hero--page hardy-hero" data-screen-label="Hardy Homes">
        <div className="scene hardy-hero-scene" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <span className="eyebrow">Hardy Homes</span>
          <h1 className="h-xl hardy-hero-title">Thoughtfully designed homes. Straightforward building. Built on your land.</h1>
          <p className="lead hardy-hero-copy">
            Hardy Homes is the homebuilding side of Brian Hardy&apos;s work — a focused path for
            build-on-your-land homes, pre-designed floor plans, standard features, and a clearer
            building process.
          </p>
          <div className="homepage-hero-actions hardy-gateway-actions">
            <Link className="btn btn-primary btn-lg" href={exploreHref} target={exploreHref.startsWith("http") ? "_blank" : undefined} rel={exploreHref.startsWith("http") ? "noopener" : undefined}>
              Explore Hardy Homes <Arrow />
            </Link>
            <Link className="btn btn-ghost btn-lg" href={floorPlansHref} target={floorPlansHref.startsWith("http") ? "_blank" : undefined} rel={floorPlansHref.startsWith("http") ? "noopener" : undefined}>
              View Floor Plans <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="hardy-featured-plans">
        <div className="container">
          <div className="sec-head hardy-catalog-head">
            <span className="eyebrow">Featured Plans</span>
            <h2 id="hardy-featured-plans">Start with a plan that already makes sense.</h2>
            <p>Explore a curated look at the Hardy Homes collection while the standalone site is being finalized.</p>
          </div>
          <div className="hardy-plan-card-grid">
            {featuredHomes.map((home) => (
              <HardyHomeCard
                key={home.slug}
                home={home}
                href={getHardyHomesPlanHref(home)}
                ctaLabel="View Home"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="hardy-offers">
        <div className="container">
          <div className="sec-head hardy-section-head-compact">
            <span className="eyebrow">What Hardy Homes Offers</span>
            <h2 id="hardy-offers">A more structured path into homebuilding.</h2>
          </div>
          <div className="feat-grid hardy-offer-grid" style={{ gridTemplateColumns: "repeat(5,minmax(0,1fr))" }}>
            {offers.map((item) => (
              <article key={item} className="card feat hardy-offer-card">
                <div className="feat-ico">
                  <svg viewBox="0 0 24 24"><path d="M3 20h18" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h4" /></svg>
                </div>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="hardy-standard-preview">
        <div className="container">
          <div className="card hardy-standard-card plan-accent">
            <span className="eyebrow" id="hardy-standard-preview">Hardy Standard</span>
            <p className="hardy-standard-inline">{hardyStandardCopy.body}</p>
            <div className="chips hardy-standard-chip-row">
              {hardyStandardHighlights.map((item) => (
                <span key={item} className="chip">{item}</span>
              ))}
            </div>
            <p className="hardy-standard-note">{hardyStandardCopy.note}</p>
            <div className="hardy-cta-actions">
              <Link className="btn btn-ghost" href={standardHref} target={standardHref.startsWith("http") ? "_blank" : undefined} rel={standardHref.startsWith("http") ? "noopener" : undefined}>
                {hardyStandardCopy.action} <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="hardy-hre-connection">
        <div className="container">
          <div className="card hardy-gateway-connection plan-accent">
            <div>
              <span className="eyebrow">HRE + Hardy Homes</span>
              <h2 id="hardy-hre-connection">Need land, a sale, or both?</h2>
              <p>
                Hardy Real Estate can help Hardy Homes clients find land, sell an existing home,
                and navigate the real-estate side of the transition into a new build.
              </p>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/real-estate">
                Talk About Land &amp; Real Estate <Arrow />
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/contact">
                Start the Conversation <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="hardy-gateway-cta">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent">
            <div>
              <span className="eyebrow">Next Step</span>
              <h2 id="hardy-gateway-cta">Ready to explore Hardy Homes in full?</h2>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href={exploreHref} target={exploreHref.startsWith("http") ? "_blank" : undefined} rel={exploreHref.startsWith("http") ? "noopener" : undefined}>
                Explore Hardy Homes <Arrow />
              </Link>
              <Link className="btn btn-ghost btn-lg" href={floorPlansHref} target={floorPlansHref.startsWith("http") ? "_blank" : undefined} rel={floorPlansHref.startsWith("http") ? "noopener" : undefined}>
                View Floor Plans <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
