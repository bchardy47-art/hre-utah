import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { hardyCollections } from "@hardy-homes/shared/hardyHomes";
import { getCollectionPath } from "@hardy-homes/shared/hardyHomesRoutes";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse the Hardy Homes collections and go straight into the floor plans that fit each one.",
  alternates: {
    canonical: "/collections",
  },
  openGraph: {
    title: "Collections | Hardy Homes",
    description:
      "Browse the Hardy Homes collections and go straight into the floor plans that fit each one.",
    url: "/collections",
    siteName: "Hardy Homes",
    type: "website",
  },
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function CollectionsIndexPage() {
  return (
    <section className="section hardy-collection-page">
      <div className="container">
        <div className="sec-head hardy-collection-page-head hh-head-left">
          <span className="eyebrow">Collections</span>
          <h1 className="h-lg">Start with the right collection.</h1>
          <p>Browse the current Hardy Homes collections and go straight into the plans that fit each one.</p>
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
                <Link className="btn btn-primary" href={getCollectionPath(collection, "standalone")}>Explore Collection <Arrow /></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
