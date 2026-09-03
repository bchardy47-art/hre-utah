import type { Metadata } from "next";
import Link from "next/link";
import HardyHomeCard from "@/components/HardyHomeCard";
import { getHardyCollection, hardyHomes } from "@/lib/hardyHomes";

export const metadata: Metadata = {
  title: "Cottage Floor Plans | Hardy Homes",
  description:
    "Explore Cottage Floor Plans from Hardy Homes, including The Brindle and The Flint — compact detached home concepts designed to make every square foot count.",
};

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
          <span className="eyebrow">Cottage Floor Plans</span>
          <h1 className="h-lg">Cottage Floor Plans</h1>
          <p>{collection.description}</p>
        </div>
        <div className="hardy-plan-card-grid">
          {homes.map((home) => (
            <HardyHomeCard key={home.slug} home={home} ctaLabel={`View ${home.name}`} sizes="(max-width: 980px) 100vw, 48vw" />
          ))}
        </div>
      </div>
    </section>
  );
}
