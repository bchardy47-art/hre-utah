import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getHardyHome } from "@/lib/hardyHomes";

export const metadata: Metadata = {
  title: "The Flint | 983 Sq Ft Cottage Home Plan | Hardy Homes",
  description:
    "Explore The Flint, a 983 sq ft cottage home concept from Hardy Homes, featuring an efficient compact floor plan designed for practical single-level living.",
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

const home = getHardyHome("flint")!;
const exterior = home.images.find((image) => image.key === "exterior")!;
const kitchen = home.images.find((image) => image.key === "kitchen")!;
const floorPlan = home.images.find((image) => image.key === "layout")!;
const rear = home.images.find((image) => image.key === "rear")!;

export default function FlintPage() {
  return (
    <>
      <section className="section hardy-detail-page">
        <div className="container">
          <div className="hardy-back-links">
            <Link href="/hardy-homes">Hardy Homes</Link>
            <span>/</span>
            <Link href={home.collectionPath}>Cottage Floor Plans</Link>
          </div>
          <div className="hardy-detail-hero">
            <div>
              <span className="eyebrow">{home.collection}</span>
              <h1 className="h-lg">{home.name}</h1>
              <p className="hardy-detail-copy">Small footprint. Smart layout.</p>
            </div>
            <div className="hardy-compact-spec-grid hardy-compact-spec-grid--three" aria-label="The Flint specifications">
              <div className="card hardy-mini-spec-card"><span className="label">SQ FT</span><strong>{home.squareFeet}</strong></div>
              <div className="card hardy-mini-spec-card"><span className="label">BED</span><strong>1</strong></div>
              <div className="card hardy-mini-spec-card"><span className="label">BATH</span><strong>1.5</strong></div>
            </div>
          </div>
          <div className="hardy-flint-intro">
            <p>
              The Flint is a compact 983 square foot cottage designed around efficient single-level
              living, with one bedroom, one-and-a-half bathrooms, and a practical layout that makes
              the most of every square foot.
            </p>
          </div>
          <div className="card hardy-detail-hero-image">
            <div className="hardy-gallery-media hardy-gallery-media-floorplan hardy-gallery-media-floorplan-tall">
              <Image
                src={floorPlan.src}
                alt={floorPlan.alt}
                fill
                priority
                sizes="(max-width: 980px) 100vw, 72vw"
                className="hardy-gallery-image"
                style={{ objectFit: floorPlan.fit, objectPosition: floorPlan.position }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="flint-gallery">
        <div className="container">
          <div className="sec-head hardy-section-head-compact">
            <span className="eyebrow">Gallery</span>
            <h2 id="flint-gallery">See The Flint at a glance.</h2>
          </div>
          <div className="hardy-detail-gallery hardy-detail-gallery--flint">
            {[exterior, kitchen, rear].map((image) => (
              <article key={image.key} className="card hardy-detail-media-card">
                <div className={`hardy-gallery-media ${image.key === "exterior" ? "hardy-gallery-media-exterior" : "hardy-gallery-media-tall"}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={image.priority}
                    sizes={image.sizes}
                    className="hardy-gallery-image"
                    style={{ objectFit: image.fit, objectPosition: image.position }}
                  />
                </div>
                <div className="hardy-detail-caption">{image.title}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="flint-highlights">
        <div className="container">
          <div className="hardy-detail-grid hardy-detail-grid--compact">
            <article className="card hardy-highlights-card">
              <span className="eyebrow">Plan Highlights</span>
              <h2 id="flint-highlights">What matters most in The Flint</h2>
              <ul className="list-check yes hardy-feature-list hardy-feature-list--single">
                {home.highlights.map((feature) => (
                  <li key={feature}>
                    <Check />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="card hardy-layout-card">
              <span className="eyebrow">Layout</span>
              <h2>See the full floor plan.</h2>
              <div className="hardy-gallery-media hardy-gallery-media-floorplan hardy-gallery-media-floorplan-tall">
                <Image
                  src={floorPlan.src}
                  alt={floorPlan.alt}
                  fill
                  sizes="(max-width: 980px) 100vw, 50vw"
                  className="hardy-gallery-image"
                  style={{ objectFit: floorPlan.fit, objectPosition: floorPlan.position }}
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="flint-cta">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent">
            <div>
              <span className="eyebrow">Interested in The Flint?</span>
              <h2 id="flint-cta">Tell us about your property and what you want to build.</h2>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/contact#message">
                Ask About The Flint <Arrow />
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/drafting" data-hre-event="Drafting_Inquiry_Click" data-hre-location="flint-detail-cta">
                Customize This Plan <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
