import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getHardyCollection, hardyHomes } from "@/lib/hardyHomes";

export const metadata: Metadata = {
  title: "Cottage Floor Plans | Hardy Homes",
  description:
    "Explore Cottage Floor Plans from Hardy Homes, including The Brindle — a compact detached home concept designed to make every square foot count.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const collection = getHardyCollection("cottages")!;
const homes = hardyHomes.filter((home) => home.collectionSlug === "cottages");

export default function CottageCollectionPage() {
  return (
    <section className="section hardy-collection-page">
      <div className="container">
        <div className="hardy-back-links">
          <Link href="/hardy-homes">Hardy Homes</Link>
        </div>
        <div className="sec-head hardy-collection-page-head">
          <span className="eyebrow">{collection.title}</span>
          <h1 className="h-lg">Cottage Floor Plans</h1>
          <p>{collection.description}</p>
        </div>
        <div className="hardy-plan-card-grid">
          {homes.map((home) => {
            const exterior = home.images.find((image) => image.key === "exterior")!;
            return (
              <article key={home.slug} className="card hardy-plan-card plan-accent">
                <div className="hardy-plan-card-media">
                  <Image
                    src={exterior.src}
                    alt={exterior.alt}
                    fill
                    priority={exterior.priority}
                    sizes="(max-width: 980px) 100vw, 42vw"
                    className="hardy-gallery-image"
                    style={{ objectFit: exterior.fit, objectPosition: exterior.position }}
                  />
                </div>
                <div className="hardy-plan-card-body">
                  <span className="label">{home.collection}</span>
                  <h2>{home.name}</h2>
                  <div className="hardy-inline-specs">
                    <span>{home.squareFeet} SQ FT</span>
                    <span>{home.bedrooms.replace(" Bedrooms", " BED")}</span>
                    <span>{home.bathrooms.replace(" Bathrooms", " BATH")}</span>
                  </div>
                  <p>{home.shortDescription}</p>
                  <Link className="btn btn-primary" href={home.detailPath}>
                    View {home.name} <Arrow />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
