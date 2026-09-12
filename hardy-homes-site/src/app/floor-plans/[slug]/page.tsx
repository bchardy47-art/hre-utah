import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getHardyCollectionForHome,
  getHardyHomeByStandaloneSlug,
  getHardyPrimaryImage,
  getPublicHardyHomes,
  hardyStandardHighlights,
} from "@hardy-homes/shared/hardyHomes";
import { DEFAULT_HARDY_HOMES_URL } from "@hardy-homes/shared/hardyHomesSite";
import { getCollectionPath, getFloorPlansPath, getPlanPath, getStandardFeaturesPath } from "@hardy-homes/shared/hardyHomesRoutes";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

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

export function generateStaticParams() {
  return getPublicHardyHomes().map((home) => ({ slug: home.standaloneSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const home = getHardyHomeByStandaloneSlug(slug);
  const siteUrl = process.env.NEXT_PUBLIC_HARDY_HOMES_URL || DEFAULT_HARDY_HOMES_URL;
  if (!home) {
    return { title: "Hardy Homes" };
  }
  const path = getPlanPath(home, "standalone");
  const specs = [home.bedrooms, home.bathrooms, home.garage].filter(Boolean).join(", ");
  const title = `${home.name} | ${home.squareFeet.toLocaleString()} Sq Ft Utah Home Plan`;
  const description = `${home.name} is a ${home.squareFeet.toLocaleString()} sq ft Hardy Homes plan with ${specs.toLowerCase()}. See renderings and the layout, then build it on your land in Utah.`;
  const hero = getHardyPrimaryImage(home);
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${home.name} | Hardy Homes`,
      description,
      url: `${siteUrl}${path}`,
      siteName: "Hardy Homes",
      type: "website",
      images: hero ? [{ url: hero.src, alt: hero.alt }] : undefined,
    },
  };
}

export default async function HardyPlanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const home = getHardyHomeByStandaloneSlug(slug);
  if (!home) {
    return <section className="section"><div className="container"><h1 className="h-lg">Plan not found.</h1></div></section>;
  }
  const collection = getHardyCollectionForHome(home);
  const hero = home.images.find((image) => image.key === "exterior" || image.key === "exterior-front") ?? home.images[0];
  const galleryImages = home.slug === "rock"
    ? home.images.filter((image) => ["kitchen-dining", "living", "primary-bath", "primary-bedroom", "exterior-rear"].includes(image.key))
    : home.images.filter((image) => image.key !== "layout");
  const floorPlanImages = home.images.filter((image) => image.key.includes("floor-plan") || image.key === "layout");

  return (
    <>
      <BreadcrumbStructuredData
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Floor Plans", path: getFloorPlansPath("standalone") },
          { name: collection.title, path: getCollectionPath(collection, "standalone") },
          { name: home.name, path: getPlanPath(home, "standalone") },
        ]}
      />
      <section className="section hardy-detail-page hh-plan-hero-section">
        <div className="container">
          <nav className="hardy-back-links" aria-label="Breadcrumb">
            <ol className="hardy-crumbs">
              <li><Link href="/">Home</Link></li>
              <li><Link href={getFloorPlansPath("standalone")}>Floor Plans</Link></li>
              <li><Link href={getCollectionPath(collection, "standalone")}>{collection.title}</Link></li>
              <li><span aria-current="page">{home.name}</span></li>
            </ol>
          </nav>
          <div className="hardy-detail-hero hh-plan-hero-copy">
            <div>
              <span className="eyebrow">{home.collection}</span>
              <h1 className="h-lg">{home.name}</h1>
              <p className="hardy-detail-copy">{home.heroCopy}</p>
            </div>
            <div className={`hardy-compact-spec-grid ${home.garage ? "hardy-compact-spec-grid--four" : "hardy-compact-spec-grid--three"}`} aria-label={`${home.name} specifications`}>
              <div className="card hardy-mini-spec-card"><span className="label">SQ FT</span><strong>{home.squareFeet.toLocaleString()}</strong></div>
              <div className="card hardy-mini-spec-card"><span className="label">BEDROOMS</span><strong>{home.bedrooms.replace(" Bedrooms", "").replace(" Bedroom", "")}</strong></div>
              <div className="card hardy-mini-spec-card"><span className="label">BATHROOMS</span><strong>{home.bathrooms.replace(" Bathrooms", "").replace(" Bathroom", "")}</strong></div>
              {home.garage ? <div className="card hardy-mini-spec-card"><span className="label">GARAGE</span><strong>{home.garage.replace("-", " ").toUpperCase()}</strong></div> : null}
            </div>
          </div>
          <div className="card hardy-detail-hero-image hh-plan-hero-media">
            <div className={`hardy-gallery-media ${hero.key.includes("floor-plan") || hero.key === "layout" ? "hardy-gallery-media-floorplan" : "hardy-gallery-media-exterior"}`}>
              <Image src={hero.src} alt={hero.alt} fill priority={hero.priority} sizes={hero.sizes} className="hardy-gallery-image" style={{ objectFit: hero.fit, objectPosition: hero.position }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="plan-floor-plans">
        <div className="container">
          <div className="sec-head hardy-floorplan-head hardy-section-head-compact hh-head-left">
            <span className="eyebrow">Floor Plans</span>
            <h2 id="plan-floor-plans">See the layout clearly.</h2>
          </div>
          <div className={`hardy-floorplan-grid${floorPlanImages.length === 1 ? " hardy-plan-card-grid--single" : ""}`}>
            {floorPlanImages.map((image) => (
              <article key={image.key} className="card hardy-floorplan-card">
                <div className={`hardy-gallery-media ${image.key === "layout" ? "hardy-gallery-media-dollhouse" : `hardy-gallery-media-floorplan${image.key === "floor-plan-upper" ? " hardy-gallery-media-floorplan-tall" : ""}`}`}>
                  <Image src={image.src} alt={image.alt} fill sizes={image.sizes} className="hardy-gallery-image" style={{ objectFit: image.fit, objectPosition: image.position }} />
                </div>
                <div className="hardy-detail-caption">{image.title}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="plan-gallery">
        <div className="container">
          <div className="sec-head hardy-section-head-compact hh-head-left">
            <span className="eyebrow">Gallery</span>
            <h2 id="plan-gallery">See {home.name} at a glance.</h2>
          </div>
          <div className={`hardy-detail-gallery ${home.slug === "brindle" ? "hardy-detail-gallery--brindle-twoup" : home.slug === "rock" ? "hardy-detail-gallery--rock" : "hardy-detail-gallery--flint"}`}>
            {galleryImages.map((image) => (
              <article key={image.key} className="card hardy-detail-media-card">
                <div className={`hardy-gallery-media ${image.key.includes("exterior") || image.key === "exterior" ? "hardy-gallery-media-exterior" : image.key === "layout" ? "hardy-gallery-media-dollhouse" : "hardy-gallery-media-tall"}`}>
                  <Image src={image.src} alt={image.alt} fill priority={image.priority} sizes={image.sizes} className="hardy-gallery-image" style={{ objectFit: image.fit, objectPosition: image.position }} />
                </div>
                <div className="hardy-detail-caption">{image.title}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="plan-highlights">
        <div className="container">
          <div className="hardy-detail-grid hardy-detail-grid--compact">
            <article className="card hardy-highlights-card">
              <span className="eyebrow">Plan Highlights</span>
              <h2 id="plan-highlights">What matters most in {home.name}</h2>
              <ul className="list-check yes hardy-feature-list hardy-feature-list--single">
                {home.highlights.map((feature) => (
                  <li key={feature}><Check /><span>{feature}</span></li>
                ))}
              </ul>
            </article>
            <article className="card hardy-standard-card plan-accent hh-plan-standard-card">
              <span className="eyebrow">Hardy Standard</span>
              <p className="hardy-standard-inline">A Hardy Home starts with a defined baseline before upgrades and site-specific adjustments are finalized.</p>
              <ul className="hh-plan-standard-list">
                {hardyStandardHighlights.map((item) => (
                  <li key={item}><Check /><span>{item}</span></li>
                ))}
              </ul>
              <Link className="btn btn-ghost" href={getStandardFeaturesPath("standalone")}>View Standard Features <Arrow /></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="plan-cta">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent">
            <div>
              <span className="eyebrow">Interested in {home.name}?</span>
              <h2 id="plan-cta">Tell us about your property and what you want to build.</h2>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/contact">Start Your Build <Arrow /></Link>
              <Link className="btn btn-ghost btn-lg" href="/options">See Options &amp; Upgrades <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
