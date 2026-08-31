import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { hardyCollections, hardyStandardCopy } from "@/lib/hardyHomes";
import LegacyHardyHomesRedirect from "./LegacyHardyHomesRedirect";

export const metadata: Metadata = {
  title: "Hardy Homes | Floor Plan Catalog by HRE Utah",
  description:
    "Explore Hardy Homes floor plans, including cottage and single family concepts designed around practical layouts, usable space, and real-world construction.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function HardyHomesPage() {
  return (
    <>
      <LegacyHardyHomesRedirect />
      <section className="hero hero--page hardy-hero" data-screen-label="Hardy Homes">
        <div className="scene hardy-hero-scene" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <span className="eyebrow">Hardy Homes</span>
          <h1 className="h-xl hardy-hero-title">Thoughtfully designed homes built around how people actually live.</h1>
          <p className="lead hardy-hero-copy">
            Explore Hardy Homes floor plans built with practical layouts, usable space, and real construction in mind.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="explore-floor-plans">
        <div className="container">
          <div className="sec-head hardy-catalog-head">
            <span className="eyebrow">Explore Our Floor Plans</span>
            <h2 id="explore-floor-plans">Choose the collection that fits the way you want to live.</h2>
          </div>
          <div className="hardy-catalog-grid">
            {hardyCollections.map((collection) => (
              <article key={collection.slug} className="card hardy-catalog-card plan-accent">
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
                  <span className="eyebrow">{collection.slug === "cottages" ? "Cottage Collection" : "Single Family Collection"}</span>
                  <h3>{collection.title}</h3>
                  <p>{collection.description}</p>
                  <Link className="btn btn-primary" href={collection.path}>
                    {collection.slug === "cottages" ? "Explore Cottage Floor Plans" : "Explore Single Family Floor Plans"} <Arrow />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="hardy-standard-heading">
        <div className="container">
          <div className="card hardy-standard-card plan-accent">
            <span className="eyebrow">{hardyStandardCopy.heading}</span>
            <h2 id="hardy-standard-heading">{hardyStandardCopy.title}</h2>
            <p>{hardyStandardCopy.body}</p>
            <div className="hardy-standard-note">{hardyStandardCopy.note}</div>
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="hardy-catalog-cta">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent">
            <div>
              <span className="eyebrow">Next Step</span>
              <h2 id="hardy-catalog-cta">Talk with Brian about the right Hardy Home for your property.</h2>
              <p>
                Start with an existing concept or reach out if you want to customize a plan for your site, priorities, and budget.
              </p>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/contact#message">
                Talk With Brian <Arrow />
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/drafting" data-hre-event="Drafting_Inquiry_Click" data-hre-location="hardy-catalog-cta">
                Start Your Home Design <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
