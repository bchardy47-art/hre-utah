import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { hardyHomes } from "@/lib/hardyHomes";

export const metadata: Metadata = {
  title: "Hardy Homes | Efficient Home Designs by HRE Utah",
  description:
    "Explore Hardy Homes, a growing collection of thoughtfully designed, efficient Utah home concepts. Meet The Lynx — a 965 sq ft, 2 bedroom, 2.5 bathroom small-footprint home.",
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

const lynx = hardyHomes[0];

export default function HardyHomesPage() {
  const exteriorImage = lynx.images.find((image) => image.key === "exterior");
  const dollhouseImage = lynx.images.find((image) => image.key === "dollhouse");
  const kitchenImage = lynx.images.find((image) => image.key === "kitchen");

  return (
    <>
      <section className="hero hero--page hardy-hero" data-screen-label="Hardy Homes">
        <div className="scene hardy-hero-scene" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <span className="eyebrow">Hardy Homes</span>
          <h1 className="h-xl hardy-hero-title">Homes designed to make ownership make sense again.</h1>
          <p className="lead hardy-hero-copy">
            Efficient footprints, thoughtful layouts, and practical home designs developed with
            real construction in mind.
          </p>
          <div className="hardy-hero-actions">
            <Link className="btn btn-primary btn-lg" href="#lynx">
              Explore The Lynx <Arrow />
            </Link>
            <Link className="btn btn-ghost btn-lg" href="/drafting" data-hre-event="Drafting_Inquiry_Click" data-hre-location="hardy-hero">
              Design a Home <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="hardy-philosophy">
        <div className="container">
          <div className="sec-head">
            <h2 id="hardy-philosophy">Less wasted space. More home.</h2>
          </div>
          <div className="hardy-philosophy-grid">
            {lynx.philosophy.map((item) => (
              <article key={item.title} className="card hardy-philosophy-card">
                <span className="eyebrow">{item.title}</span>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" id="lynx" aria-labelledby="lynx-heading">
        <div className="container">
          <div className="hardy-plan-head">
            <div>
              <span className="eyebrow">Hardy Homes {lynx.number}</span>
              <h2 id="lynx-heading">{lynx.name}</h2>
              <div className="hardy-plan-tagline">{lynx.tagline}</div>
              <p className="hardy-plan-copy">{lynx.description}</p>
            </div>
            <div className="hardy-spec-grid" aria-label="The Lynx specifications">
              <div className="card hardy-spec-card">
                <span className="label">Size</span>
                <strong>{lynx.squareFeet} SQ FT</strong>
              </div>
              <div className="card hardy-spec-card">
                <span className="label">Bedrooms</span>
                <strong>{lynx.bedrooms.toUpperCase()}</strong>
              </div>
              <div className="card hardy-spec-card">
                <span className="label">Bathrooms</span>
                <strong>{lynx.bathrooms.toUpperCase()}</strong>
              </div>
            </div>
          </div>

          <div className="hardy-gallery-grid" aria-label="The Lynx gallery">
            <article className="card hardy-gallery hardy-gallery-main">
              <div className="hardy-gallery-media">
                {exteriorImage?.src ? (
                  <Image
                    src={exteriorImage.src}
                    alt={exteriorImage.alt}
                    fill
                    priority={exteriorImage.priority}
                    sizes={exteriorImage.sizes}
                  />
                ) : (
                  <div className="hardy-gallery-placeholder" aria-hidden="true">
                    <span>Exterior rendering pending clean production asset</span>
                  </div>
                )}
              </div>
              <div className="hardy-gallery-body">
                <span className="eyebrow">Exterior Rendering</span>
                <h3>The first Hardy Homes concept</h3>
                <p>
                  A compact home concept designed to deliver a full detached-home feel without
                  carrying unnecessary square footage.
                </p>
                {!exteriorImage?.src && exteriorImage?.note ? (
                  <div className="hardy-asset-note">{exteriorImage.note}</div>
                ) : null}
              </div>
            </article>

            <article className="card hardy-gallery hardy-gallery-side">
              <div className="hardy-gallery-media hardy-gallery-media-tall">
                {dollhouseImage?.src ? (
                  <Image src={dollhouseImage.src} alt={dollhouseImage.alt} fill sizes={dollhouseImage.sizes} />
                ) : (
                  <div className="hardy-gallery-placeholder" aria-hidden="true">
                    <span>Dollhouse view pending clean production asset</span>
                  </div>
                )}
              </div>
              <div className="hardy-gallery-body">
                <span className="eyebrow">Dollhouse View</span>
                <h3>See the layout at a glance</h3>
                <p>
                  The overall plan is set up to make the most of a small-footprint home without
                  forcing everything into one room.
                </p>
                {!dollhouseImage?.src && dollhouseImage?.note ? (
                  <div className="hardy-asset-note">{dollhouseImage.note}</div>
                ) : null}
              </div>
            </article>

            <article className="card hardy-gallery hardy-gallery-side">
              <div className="hardy-gallery-media hardy-gallery-media-tall">
                {kitchenImage?.src ? (
                  <Image src={kitchenImage.src} alt={kitchenImage.alt} fill sizes={kitchenImage.sizes} />
                ) : (
                  <div className="hardy-gallery-placeholder" aria-hidden="true">
                    <span>Kitchen rendering pending clean production asset</span>
                  </div>
                )}
              </div>
              <div className="hardy-gallery-body">
                <span className="eyebrow">Kitchen Rendering</span>
                <h3>Everyday spaces still matter</h3>
                <p>
                  The Lynx is meant to feel practical and livable, with room for a full-size
                  kitchen and comfortable daily routines.
                </p>
                {!kitchenImage?.src && kitchenImage?.note ? (
                  <div className="hardy-asset-note">{kitchenImage.note}</div>
                ) : null}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="lynx-features">
        <div className="container">
          <div className="hardy-detail-grid">
            <div>
              <div className="sec-head drafting-head-left hardy-head-left">
                <span className="eyebrow">Inside The Lynx</span>
                <h2 id="lynx-features">Everything you need. Nothing you don&apos;t.</h2>
              </div>
              <ul className="list-check yes hardy-feature-list">
                {lynx.features.map((feature) => (
                  <li key={feature}>
                    <Check />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <article className="card hardy-story-card">
              <span className="eyebrow">Small-Footprint Home</span>
              <h3>Built around usable rooms, not filler square footage.</h3>
              <p>
                The goal with Hardy Homes is simple: create efficient homes that still feel like
                real homes. That means practical kitchens, comfortable living areas, private
                bedrooms, and layouts that make sense for everyday life.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="lynx-dollhouse-heading">
        <div className="container">
          <div className="hardy-dollhouse-grid">
            <article className="card hardy-dollhouse-card">
              <span className="eyebrow">Layout Visualization</span>
              <h2 id="lynx-dollhouse-heading">{lynx.dollhouseHeading}</h2>
              <p>{lynx.dollhouseCopy}</p>
            </article>
            <article className="card hardy-dollhouse-media">
              <div className="hardy-gallery-media hardy-gallery-media-wide">
                {dollhouseImage?.src ? (
                  <Image src={dollhouseImage.src} alt={dollhouseImage.alt} fill sizes="(max-width: 980px) 100vw, 60vw" />
                ) : (
                  <div className="hardy-gallery-placeholder" aria-hidden="true">
                    <span>Dollhouse rendering will be published when a clean asset is supplied.</span>
                  </div>
                )}
              </div>
              {!dollhouseImage?.src && dollhouseImage?.note ? (
                <div className="hardy-asset-note hardy-asset-note-inline">{dollhouseImage.note}</div>
              ) : null}
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="lynx-options-heading">
        <div className="container">
          <div className="hardy-cta-grid">
            <article className="card hardy-cta-card plan-accent">
              <span className="eyebrow">Design Options</span>
              <h2 id="lynx-options-heading">{lynx.designOptionsHeading}</h2>
              <p>{lynx.designOptionsCopy}</p>
              <div className="hardy-cta-actions">
                <Link className="btn btn-primary" href="/contact#message">
                  Customize The Lynx <Arrow />
                </Link>
                <Link className="btn btn-ghost" href="/drafting" data-hre-event="Drafting_Inquiry_Click" data-hre-location="hardy-options">
                  Residential Drafting &amp; Home Design <Arrow />
                </Link>
              </div>
            </article>
            <article className="card hardy-cta-card hardy-cta-card-accent plan-accent">
              <span className="eyebrow">Current Availability</span>
              <h2>{lynx.interestHeading}</h2>
              <p>{lynx.interestCopy}</p>
              <div className="hardy-cta-actions">
                <Link className="btn btn-primary" href="/contact#message">
                  Ask About The Lynx <Arrow />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="hardy-future">
        <div className="container">
          <div className="sec-head hardy-future-head">
            <h2 id="hardy-future">More Hardy Homes are coming.</h2>
            <p>{lynx.futureCopy}</p>
          </div>
        </div>
      </section>
    </>
  );
}
