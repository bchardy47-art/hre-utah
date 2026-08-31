import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getHardyHome } from "@/lib/hardyHomes";

export const metadata: Metadata = {
  title: "The Rock | Single Family Floor Plans | Hardy Homes",
  description:
    "Explore The Rock, a 3,209 sq ft Hardy Homes single family plan with 4 bedrooms, 3.5 bathrooms, and a 3-car garage.",
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

const home = getHardyHome("rock")!;
const front = home.images.find((image) => image.key === "exterior-front")!;
const kitchen = home.images.find((image) => image.key === "kitchen-dining")!;
const living = home.images.find((image) => image.key === "living")!;
const bath = home.images.find((image) => image.key === "primary-bath")!;
const bedroom = home.images.find((image) => image.key === "primary-bedroom")!;
const rear = home.images.find((image) => image.key === "exterior-rear")!;
const mainPlan = home.images.find((image) => image.key === "floor-plan-main")!;
const upperPlan = home.images.find((image) => image.key === "floor-plan-upper")!;
const basementPlan = home.images.find((image) => image.key === "floor-plan-basement")!;

const galleryImages = [kitchen, living, bath, bedroom, rear];
const floorPlans = [mainPlan, upperPlan, basementPlan];

export default function RockPage() {
  return (
    <>
      <section className="section hardy-detail-page">
        <div className="container">
          <div className="hardy-back-links">
            <Link href="/hardy-homes">Hardy Homes</Link>
            <span>/</span>
            <Link href={home.collectionPath}>Single Family Floor Plans</Link>
          </div>
          <div className="hardy-detail-hero">
            <div>
              <span className="eyebrow">{home.collection}</span>
              <h1 className="h-lg">{home.name}</h1>
              <p className="hardy-detail-copy">A spacious family home with open gathering areas, private retreats, and room to grow.</p>
            </div>
            <div className="hardy-compact-spec-grid hardy-compact-spec-grid--four" aria-label="The Rock specifications">
              <div className="card hardy-mini-spec-card"><span className="label">SQ FT</span><strong>3,209</strong></div>
              <div className="card hardy-mini-spec-card"><span className="label">BEDROOMS</span><strong>4</strong></div>
              <div className="card hardy-mini-spec-card"><span className="label">BATHROOMS</span><strong>3.5</strong></div>
              <div className="card hardy-mini-spec-card"><span className="label">GARAGE</span><strong>3 CAR</strong></div>
            </div>
          </div>
          <div className="card hardy-detail-hero-image">
            <div className="hardy-gallery-media hardy-gallery-media-exterior">
              <Image
                src={front.src}
                alt={front.alt}
                fill
                priority={front.priority}
                sizes={front.sizes}
                className="hardy-gallery-image"
                style={{ objectFit: front.fit, objectPosition: front.position }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="rock-gallery">
        <div className="container">
          <div className="sec-head hardy-section-head-compact">
            <span className="eyebrow">Gallery</span>
            <h2 id="rock-gallery">See The Rock at a glance.</h2>
          </div>
          <div className="hardy-detail-gallery hardy-detail-gallery--rock">
            {galleryImages.map((image) => (
              <article key={image.key} className="card hardy-detail-media-card">
                <div className={`hardy-gallery-media ${image.key.includes("exterior") ? "hardy-gallery-media-exterior" : "hardy-gallery-media-tall"}`}>
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

      <section className="section" aria-labelledby="rock-floor-plans">
        <div className="container">
          <div className="sec-head hardy-floorplan-head hardy-section-head-compact">
            <span className="eyebrow">Floor Plans</span>
            <h2 id="rock-floor-plans">See the full layout.</h2>
          </div>
          <div className="hardy-floorplan-grid hardy-floorplan-grid--detail">
            {floorPlans.map((image) => (
              <article key={image.key} className="card hardy-floorplan-card">
                <div className={`hardy-gallery-media hardy-gallery-media-floorplan${image.key === "floor-plan-upper" ? " hardy-gallery-media-floorplan-tall" : ""}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
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

      <section className="section alt" aria-labelledby="rock-highlights">
        <div className="container">
          <div className="hardy-detail-grid hardy-detail-grid--compact">
            <article className="card hardy-highlights-card">
              <span className="eyebrow">Plan Highlights</span>
              <h2 id="rock-highlights">What matters most in The Rock</h2>
              <ul className="list-check yes hardy-feature-list hardy-feature-list--single">
                {home.highlights.map((feature) => (
                  <li key={feature}>
                    <Check />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="card hardy-catalog-cta plan-accent">
              <div>
                <span className="eyebrow">Interested in The Rock?</span>
                <h2>Tell us about your property and what you want to build.</h2>
              </div>
              <div className="hardy-cta-actions">
                <Link className="btn btn-primary btn-lg" href="/contact#message">
                  Ask About The Rock <Arrow />
                </Link>
                <Link className="btn btn-ghost btn-lg" href="/drafting" data-hre-event="Drafting_Inquiry_Click" data-hre-location="rock-detail-cta">
                  Customize This Plan <Arrow />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
