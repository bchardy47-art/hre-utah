import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getHardyHome } from "@/lib/hardyHomes";

export const metadata: Metadata = {
  title: "The Brindle | Cottage Floor Plans | Hardy Homes",
  description:
    "Explore The Brindle, a 965 sq ft Hardy Homes cottage plan with 2 bedrooms and 2.5 bathrooms.",
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

const home = getHardyHome("brindle")!;
const exterior = home.images.find((image) => image.key === "exterior")!;
const layout = home.images.find((image) => image.key === "dollhouse")!;
const kitchen = home.images.find((image) => image.key === "kitchen")!;

export default function BrindlePage() {
  return (
    <>
      <section className="section hardy-detail-page">
        <div className="container">
          <div className="hardy-back-links">
            <Link href="/hardy-homes">Hardy Homes</Link>
            <span>/</span>
            <Link href={home.collectionPath}>Cottage Floor Plans</Link>
          </div>
          <span id="lynx" className="hardy-anchor-compat" aria-hidden="true" />
          <div id="brindle" className="hardy-detail-hero">
            <div>
              <span className="eyebrow">{home.collection}</span>
              <h1 className="h-lg">{home.name}</h1>
              <p className="hardy-detail-copy">{home.shortDescription}</p>
            </div>
            <div className="hardy-compact-spec-grid hardy-compact-spec-grid--three" aria-label="The Brindle specifications">
              <div className="card hardy-mini-spec-card"><span className="label">Size</span><strong>{home.squareFeet} SQ FT</strong></div>
              <div className="card hardy-mini-spec-card"><span className="label">Bedrooms</span><strong>{home.bedrooms.toUpperCase()}</strong></div>
              <div className="card hardy-mini-spec-card"><span className="label">Bathrooms</span><strong>{home.bathrooms.toUpperCase()}</strong></div>
            </div>
          </div>
          <div className="hardy-detail-gallery hardy-detail-gallery--brindle">
            {[exterior, layout, kitchen].map((image) => (
              <article key={image.key} className="card hardy-detail-media-card">
                <div className={`hardy-gallery-media ${image.key === "exterior" ? "hardy-gallery-media-exterior" : image.key === "dollhouse" ? "hardy-gallery-media-dollhouse" : "hardy-gallery-media-tall"}`}>
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

      <section className="section alt" aria-labelledby="brindle-highlights">
        <div className="container">
          <div className="hardy-detail-grid hardy-detail-grid--compact">
            <article className="card hardy-highlights-card">
              <span className="eyebrow">Plan Highlights</span>
              <h2 id="brindle-highlights">What stands out about The Brindle</h2>
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
              <h2>{home.layoutHeading}</h2>
              <div className="hardy-gallery-media hardy-gallery-media-wide hardy-gallery-media-dollhouse-wide">
                <Image
                  src={layout.src}
                  alt={layout.alt}
                  fill
                  sizes="(max-width: 980px) 100vw, 50vw"
                  className="hardy-gallery-image"
                  style={{ objectFit: layout.fit, objectPosition: layout.position }}
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="brindle-cta">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent">
            <div>
              <span className="eyebrow">Interested in The Brindle?</span>
              <h2 id="brindle-cta">Start with a compact plan that still feels like home.</h2>
              <p>{home.designOptionsCopy}</p>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/contact#message">
                Customize The Brindle <Arrow />
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/drafting" data-hre-event="Drafting_Inquiry_Click" data-hre-location="brindle-detail-cta">
                Residential Drafting &amp; Home Design <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
