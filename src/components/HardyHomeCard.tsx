import Image from "next/image";
import Link from "next/link";
import type { HardyHomeConcept } from "@/lib/hardyHomes";

type Props = {
  home: HardyHomeConcept;
  ctaLabel?: string;
  sizes?: string;
  showCollection?: boolean;
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function getCardImage(home: HardyHomeConcept) {
  return (
    home.images.find((image) => image.key === "exterior") ??
    home.images.find((image) => image.key === "exterior-front") ??
    home.images[0]
  );
}

export default function HardyHomeCard({
  home,
  ctaLabel = "View Home",
  sizes = "(max-width: 980px) 100vw, 31vw",
  showCollection = true,
}: Props) {
  const exterior = getCardImage(home);
  const bedLabel = home.bedrooms.replace(" Bedrooms", " BED").replace(" Bedroom", " BED");
  const bathLabel = home.bathrooms.replace(" Bathrooms", " BATH").replace(" Bathroom", " BATH");

  return (
    <article className="card hardy-plan-card plan-accent hardy-home-card">
      <div className="hardy-plan-card-media">
        <Image
          src={exterior.src}
          alt={exterior.alt}
          fill
          priority={exterior.priority}
          sizes={sizes}
          className="hardy-gallery-image"
          style={{ objectFit: exterior.fit, objectPosition: exterior.position }}
        />
      </div>
      <div className="hardy-plan-card-body">
        {showCollection ? <span className="eyebrow">{home.collection}</span> : null}
        <h2>{home.name}</h2>
        <div className="hardy-inline-specs hardy-inline-specs--wide">
          <span>{home.squareFeet.toLocaleString()} SQ FT</span>
          <span>{bedLabel}</span>
          <span>{bathLabel}</span>
          {home.garage ? <span>{home.garage.toUpperCase()}</span> : null}
        </div>
        <p>{home.shortDescription}</p>
        <Link className="btn btn-primary" href={home.detailPath}>
          {ctaLabel} <Arrow />
        </Link>
      </div>
    </article>
  );
}
