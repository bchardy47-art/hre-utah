import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { hardyHomes, hardyHomeBySlug } from "@/lib/hardyHomes";

export const metadata: Metadata = {
  title: "Hardy Homes | Efficient Home Designs by HRE Utah",
  description:
    "Explore Hardy Homes, a growing collection of thoughtfully designed, efficient Utah home concepts. Meet The Brindle — a 965 sq ft, 2 bedroom, 2.5 bathroom small-footprint home.",
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

const brindle = hardyHomeBySlug.brindle;
const rock = hardyHomeBySlug.rock;

const brindleExterior = brindle.images.find((image) => image.key === "exterior")!;
const brindleDollhouse = brindle.images.find((image) => image.key === "dollhouse")!;
const brindleKitchen = brindle.images.find((image) => image.key === "kitchen")!;

const rockFront = rock.images.find((image) => image.key === "exterior-front")!;
const rockKitchen = rock.images.find((image) => image.key === "kitchen-dining")!;
const rockLiving = rock.images.find((image) => image.key === "living")!;
const rockPrimaryBath = rock.images.find((image) => image.key === "primary-bath")!;
const rockPrimaryBedroom = rock.images.find((image) => image.key === "primary-bedroom")!;
const rockRear = rock.images.find((image) => image.key === "exterior-rear")!;
const rockMainPlan = rock.images.find((image) => image.key === "floor-plan-main")!;
const rockUpperPlan = rock.images.find((image) => image.key === "floor-plan-upper")!;
const rockBasementPlan = rock.images.find((image) => image.key === "floor-plan-basement")!;

export default function HardyHomesPage() {
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
            <Link className="btn btn-primary btn-lg" href="#brindle">
              Explore The Brindle <Arrow />
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
            {brindle.philosophy.map((item) => (
              <article key={item.title} className="card hardy-philosophy-card">
                <span className="eyebrow">{item.title}</span>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="explore-our-homes">
        <div className="container">
          <div className="sec-head hardy-collections-head">
            <span className="eyebrow">Explore Our Homes</span>
            <h2 id="explore-our-homes">Cottage Collection and Single Family Collection</h2>
          </div>
          <div className="hardy-collections-nav">
            <Link className="chip" href="#cottage-collection">Cottage Collection</Link>
            <Link className="chip" href="#single-family-collection">Single Family Collection</Link>
          </div>
        </div>
      </section>

      <section className="section" id="cottage-collection" aria-labelledby="cottage-collection-heading">
        <div className="container">
          <div className="hardy-collection-intro">
            <span className="eyebrow">Cottage Collection</span>
            <h2 id="cottage-collection-heading">Smaller-footprint homes designed to make every square foot count.</h2>
          </div>
        </div>
      </section>

      <section className="section alt hardy-plan-section" id="brindle" aria-labelledby="brindle-heading">
        <div className="container">
          <span id="lynx" className="hardy-anchor-compat" aria-hidden="true" />
          <div className="hardy-plan-head">
            <div>
              <span className="eyebrow">Hardy Homes {brindle.number}</span>
              <h2 id="brindle-heading">{brindle.name}</h2>
              <div className="hardy-plan-tagline">{brindle.tagline}</div>
              <p className="hardy-plan-copy">{brindle.description}</p>
            </div>
            <div className="hardy-spec-grid" aria-label="The Brindle specifications">
              <div className="card hardy-spec-card">
                <span className="label">Size</span>
                <strong>{brindle.squareFeet} SQ FT</strong>
              </div>
              <div className="card hardy-spec-card">
                <span className="label">Bedrooms</span>
                <strong>{brindle.bedrooms.toUpperCase()}</strong>
              </div>
              <div className="card hardy-spec-card">
                <span className="label">Bathrooms</span>
                <strong>{brindle.bathrooms.toUpperCase()}</strong>
              </div>
            </div>
          </div>

          <div className="hardy-gallery-grid" aria-label="The Brindle gallery">
            <article className="card hardy-gallery hardy-gallery-main">
              <div className="hardy-gallery-media hardy-gallery-media-exterior">
                <Image
                  src={brindleExterior.src}
                  alt={brindleExterior.alt}
                  fill
                  priority={brindleExterior.priority}
                  sizes={brindleExterior.sizes}
                  className="hardy-gallery-image"
                  style={{ objectFit: brindleExterior.fit, objectPosition: brindleExterior.position }}
                />
              </div>
              <div className="hardy-gallery-body">
                <span className="eyebrow">Exterior Rendering</span>
                <h3>The first Hardy Homes cottage concept</h3>
                <p>
                  A compact home concept designed to deliver a full detached-home feel without
                  carrying unnecessary square footage.
                </p>
              </div>
            </article>

            <article className="card hardy-gallery hardy-gallery-side">
              <div className="hardy-gallery-media hardy-gallery-media-tall hardy-gallery-media-dollhouse">
                <Image
                  src={brindleDollhouse.src}
                  alt={brindleDollhouse.alt}
                  fill
                  sizes={brindleDollhouse.sizes}
                  className="hardy-gallery-image"
                  style={{ objectFit: brindleDollhouse.fit, objectPosition: brindleDollhouse.position }}
                />
              </div>
              <div className="hardy-gallery-body">
                <span className="eyebrow">Dollhouse View</span>
                <h3>See the layout at a glance</h3>
                <p>
                  The overall plan is set up to make the most of a small-footprint home without
                  forcing everything into one room.
                </p>
              </div>
            </article>

            <article className="card hardy-gallery hardy-gallery-side">
              <div className="hardy-gallery-media hardy-gallery-media-tall">
                <Image
                  src={brindleKitchen.src}
                  alt={brindleKitchen.alt}
                  fill
                  sizes={brindleKitchen.sizes}
                  className="hardy-gallery-image"
                  style={{ objectFit: brindleKitchen.fit, objectPosition: brindleKitchen.position }}
                />
              </div>
              <div className="hardy-gallery-body">
                <span className="eyebrow">Kitchen Rendering</span>
                <h3>Everyday spaces still matter</h3>
                <p>
                  The Brindle is meant to feel practical and livable, with room for a full-size
                  kitchen and comfortable daily routines.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="brindle-features">
        <div className="container">
          <div className="hardy-detail-grid">
            <div>
              <div className="sec-head drafting-head-left hardy-head-left">
                <span className="eyebrow">Inside The Brindle</span>
                <h2 id="brindle-features">Everything you need. Nothing you don&apos;t.</h2>
              </div>
              <ul className="list-check yes hardy-feature-list">
                {brindle.features.map((feature) => (
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

      <section className="section alt" aria-labelledby="brindle-dollhouse-heading">
        <div className="container">
          <div className="hardy-dollhouse-grid">
            <article className="card hardy-dollhouse-card">
              <span className="eyebrow">Layout Visualization</span>
              <h2 id="brindle-dollhouse-heading">{brindle.dollhouseHeading}</h2>
              <p>{brindle.dollhouseCopy}</p>
            </article>
            <article className="card hardy-dollhouse-media">
              <div className="hardy-gallery-media hardy-gallery-media-wide hardy-gallery-media-dollhouse-wide">
                <Image
                  src={brindleDollhouse.src}
                  alt={brindleDollhouse.alt}
                  fill
                  sizes="(max-width: 980px) 100vw, 60vw"
                  className="hardy-gallery-image"
                  style={{ objectFit: brindleDollhouse.fit, objectPosition: brindleDollhouse.position }}
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="brindle-options-heading">
        <div className="container">
          <div className="hardy-cta-grid">
            <article className="card hardy-cta-card plan-accent">
              <span className="eyebrow">Design Options</span>
              <h2 id="brindle-options-heading">{brindle.designOptionsHeading}</h2>
              <p>{brindle.designOptionsCopy}</p>
              <div className="hardy-cta-actions">
                <Link className="btn btn-primary" href="/contact#message">
                  Customize The Brindle <Arrow />
                </Link>
                <Link className="btn btn-ghost" href="/drafting" data-hre-event="Drafting_Inquiry_Click" data-hre-location="hardy-options">
                  Residential Drafting &amp; Home Design <Arrow />
                </Link>
              </div>
            </article>
            <article className="card hardy-cta-card hardy-cta-card-accent plan-accent">
              <span className="eyebrow">Current Availability</span>
              <h2>{brindle.interestHeading}</h2>
              <p>{brindle.interestCopy}</p>
              <div className="hardy-cta-actions">
                <Link className="btn btn-primary" href="/contact#message">
                  Ask About The Brindle <Arrow />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt" id="single-family-collection" aria-labelledby="single-family-collection-heading">
        <div className="container">
          <div className="hardy-collection-intro">
            <span className="eyebrow">Single Family Collection</span>
            <h2 id="single-family-collection-heading">Thoughtfully designed homes with more room for everyday living.</h2>
          </div>
          <div className="hardy-plan-head hardy-plan-head--single-family">
            <div>
              <span className="eyebrow">Hardy Homes {rock.number}</span>
              <h2>{rock.name}</h2>
              <div className="hardy-plan-tagline">{rock.tagline}</div>
              <p className="hardy-plan-copy">{rock.description}</p>
            </div>
            <div className="hardy-spec-grid hardy-spec-grid--four" aria-label="The Rock specifications">
              <div className="card hardy-spec-card">
                <span className="label">Size</span>
                <strong>{rock.squareFeet} SQ FT</strong>
              </div>
              <div className="card hardy-spec-card">
                <span className="label">Bedrooms</span>
                <strong>{rock.bedrooms.toUpperCase()}</strong>
              </div>
              <div className="card hardy-spec-card">
                <span className="label">Bathrooms</span>
                <strong>{rock.bathrooms.toUpperCase()}</strong>
              </div>
              <div className="card hardy-spec-card">
                <span className="label">Garage</span>
                <strong>{rock.garage?.toUpperCase()}</strong>
              </div>
            </div>
          </div>

          <div className="hardy-rock-feature-grid" aria-label="The Rock featured imagery">
            <article className="card hardy-gallery hardy-gallery-main">
              <div className="hardy-gallery-media hardy-gallery-media-exterior hardy-gallery-media-rock-exterior">
                <Image
                  src={rockFront.src}
                  alt={rockFront.alt}
                  fill
                  priority={rockFront.priority}
                  sizes={rockFront.sizes}
                  className="hardy-gallery-image"
                  style={{ objectFit: rockFront.fit, objectPosition: rockFront.position }}
                />
              </div>
              <div className="hardy-gallery-body">
                <span className="eyebrow">Front Exterior</span>
                <h3>A larger Hardy Homes concept for full single-family living</h3>
                <p>
                  The Rock brings together more gathering space, a practical bedroom layout, and a
                  builder-minded floor plan that still feels efficient in the right places.
                </p>
              </div>
            </article>

            <article className="card hardy-gallery hardy-gallery-side">
              <div className="hardy-gallery-media hardy-gallery-media-tall">
                <Image
                  src={rockKitchen.src}
                  alt={rockKitchen.alt}
                  fill
                  sizes={rockKitchen.sizes}
                  className="hardy-gallery-image"
                  style={{ objectFit: rockKitchen.fit, objectPosition: rockKitchen.position }}
                />
              </div>
              <div className="hardy-gallery-body">
                <span className="eyebrow">Kitchen + Dining</span>
                <h3>Designed for real daily use</h3>
                <p>
                  Open shared spaces are balanced with practical circulation and room to live in the
                  house every day.
                </p>
              </div>
            </article>

            <article className="card hardy-gallery hardy-gallery-side">
              <div className="hardy-gallery-media hardy-gallery-media-tall">
                <Image
                  src={rockLiving.src}
                  alt={rockLiving.alt}
                  fill
                  sizes={rockLiving.sizes}
                  className="hardy-gallery-image"
                  style={{ objectFit: rockLiving.fit, objectPosition: rockLiving.position }}
                />
              </div>
              <div className="hardy-gallery-body">
                <span className="eyebrow">Living Room</span>
                <h3>Gathering space that still feels intentional</h3>
                <p>
                  The Rock is designed for households that want more room without losing the sense
                  of structure and flow that makes a plan work well.
                </p>
              </div>
            </article>
          </div>

          <div className="hardy-rock-secondary-grid">
            <article className="card hardy-gallery hardy-gallery-side">
              <div className="hardy-gallery-media hardy-gallery-media-tall">
                <Image
                  src={rockPrimaryBath.src}
                  alt={rockPrimaryBath.alt}
                  fill
                  sizes={rockPrimaryBath.sizes}
                  className="hardy-gallery-image"
                  style={{ objectFit: rockPrimaryBath.fit, objectPosition: rockPrimaryBath.position }}
                />
              </div>
              <div className="hardy-gallery-body">
                <span className="eyebrow">Primary Bath</span>
                <h3>A private space that supports the home&apos;s larger footprint</h3>
              </div>
            </article>
            <article className="card hardy-gallery hardy-gallery-side">
              <div className="hardy-gallery-media hardy-gallery-media-tall">
                <Image
                  src={rockPrimaryBedroom.src}
                  alt={rockPrimaryBedroom.alt}
                  fill
                  sizes={rockPrimaryBedroom.sizes}
                  className="hardy-gallery-image"
                  style={{ objectFit: rockPrimaryBedroom.fit, objectPosition: rockPrimaryBedroom.position }}
                />
              </div>
              <div className="hardy-gallery-body">
                <span className="eyebrow">Primary Bedroom</span>
                <h3>Comfort where it matters most</h3>
              </div>
            </article>
            <article className="card hardy-gallery hardy-gallery-side">
              <div className="hardy-gallery-media hardy-gallery-media-tall hardy-gallery-media-rear">
                <Image
                  src={rockRear.src}
                  alt={rockRear.alt}
                  fill
                  sizes={rockRear.sizes}
                  className="hardy-gallery-image"
                  style={{ objectFit: rockRear.fit, objectPosition: rockRear.position }}
                />
              </div>
              <div className="hardy-gallery-body">
                <span className="eyebrow">Rear Exterior</span>
                <h3>A full single-family concept from every angle</h3>
              </div>
            </article>
          </div>

          <section className="hardy-floorplan-section" aria-labelledby="rock-floorplans-heading">
            <div className="sec-head hardy-floorplan-head">
              <span className="eyebrow">Floor Plans</span>
              <h3 id="rock-floorplans-heading">See how The Rock is organized across the home.</h3>
            </div>
            <div className="hardy-floorplan-grid">
              <article className="card hardy-floorplan-card">
                <div className="hardy-gallery-media hardy-gallery-media-floorplan">
                  <Image
                    src={rockMainPlan.src}
                    alt={rockMainPlan.alt}
                    fill
                    sizes={rockMainPlan.sizes}
                    className="hardy-gallery-image"
                    style={{ objectFit: rockMainPlan.fit, objectPosition: rockMainPlan.position }}
                  />
                </div>
                <div className="hardy-gallery-body">
                  <span className="eyebrow">Main Floor Plan</span>
                </div>
              </article>
              <article className="card hardy-floorplan-card">
                <div className="hardy-gallery-media hardy-gallery-media-floorplan hardy-gallery-media-floorplan-tall">
                  <Image
                    src={rockUpperPlan.src}
                    alt={rockUpperPlan.alt}
                    fill
                    sizes={rockUpperPlan.sizes}
                    className="hardy-gallery-image"
                    style={{ objectFit: rockUpperPlan.fit, objectPosition: rockUpperPlan.position }}
                  />
                </div>
                <div className="hardy-gallery-body">
                  <span className="eyebrow">Upper Floor Plan</span>
                </div>
              </article>
              <article className="card hardy-floorplan-card">
                <div className="hardy-gallery-media hardy-gallery-media-floorplan">
                  <Image
                    src={rockBasementPlan.src}
                    alt={rockBasementPlan.alt}
                    fill
                    sizes={rockBasementPlan.sizes}
                    className="hardy-gallery-image"
                    style={{ objectFit: rockBasementPlan.fit, objectPosition: rockBasementPlan.position }}
                  />
                </div>
                <div className="hardy-gallery-body">
                  <span className="eyebrow">Basement Floor Plan</span>
                </div>
              </article>
            </div>
          </section>

          <div className="hardy-cta-grid hardy-cta-grid-single-family">
            <article className="card hardy-cta-card plan-accent">
              <span className="eyebrow">Design Options</span>
              <h2>{rock.designOptionsHeading}</h2>
              <p>{rock.designOptionsCopy}</p>
              <div className="hardy-cta-actions">
                <Link className="btn btn-primary" href="/contact#message">
                  Customize The Rock <Arrow />
                </Link>
                <Link className="btn btn-ghost" href="/drafting" data-hre-event="Drafting_Inquiry_Click" data-hre-location="hardy-rock-options">
                  Residential Drafting &amp; Home Design <Arrow />
                </Link>
              </div>
            </article>
            <article className="card hardy-cta-card hardy-cta-card-accent plan-accent">
              <span className="eyebrow">Current Availability</span>
              <h2>{rock.interestHeading}</h2>
              <p>{rock.interestCopy}</p>
              <div className="hardy-cta-actions">
                <Link className="btn btn-primary" href="/contact#message">
                  Ask About The Rock <Arrow />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="hardy-standard-heading">
        <div className="container">
          <div className="card hardy-standard-card plan-accent">
            <span className="eyebrow">The Hardy Standard</span>
            <h2 id="hardy-standard-heading">A defined starting point for quality, function, and finish.</h2>
            <p>
              A Hardy Home starts with a thoughtful standard of quality, functionality, and
              finishes. We&apos;re building our homes around features we believe should come standard
              — with curated options available for buyers who want to personalize further.
            </p>
            <div className="hardy-standard-note">Full Hardy Standard specifications coming soon.</div>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="hardy-future">
        <div className="container">
          <div className="sec-head hardy-future-head">
            <h2 id="hardy-future">More Hardy Homes are coming.</h2>
            <p>{brindle.futureCopy}</p>
          </div>
        </div>
      </section>
    </>
  );
}
