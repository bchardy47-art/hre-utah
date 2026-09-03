import type { Metadata } from "next";
import Link from "next/link";
import HardyHomeCard from "@/components/HardyHomeCard";
import { getHardyCollection, hardyHomes } from "@/lib/hardyHomes";

export const metadata: Metadata = {
  title: "Single Family Floor Plans | Hardy Homes",
  description:
    "Explore Single Family Floor Plans from Hardy Homes, including The Rock — a spacious 3,209 sq ft plan with 4 bedrooms, 3.5 bathrooms, and a 3-car garage.",
};

const collection = getHardyCollection("single-family")!;
const homes = hardyHomes.filter((home) => home.collectionSlug === "single-family");

export default function SingleFamilyCollectionPage() {
  return (
    <section className="section hardy-collection-page">
      <div className="container">
        <div className="hardy-back-links">
          <Link href="/hardy-homes">Hardy Homes</Link>
        </div>
        <div className="sec-head hardy-collection-page-head">
          <span className="eyebrow">Single Family Floor Plans</span>
          <h1 className="h-lg">Single Family Floor Plans</h1>
          <p>{collection.description}</p>
        </div>
        <div className="hardy-plan-card-grid hardy-plan-card-grid--single">
          {homes.map((home) => (
            <HardyHomeCard key={home.slug} home={home} ctaLabel={`View ${home.name}`} sizes="(max-width: 980px) 100vw, 48vw" />
          ))}
        </div>
      </div>
    </section>
  );
}
