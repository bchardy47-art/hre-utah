import type { Metadata } from "next";
import Link from "next/link";
import HardyHomeCard from "@/components/HardyHomeCard";
import {
  getHardyCollectionByStandaloneSlug,
  getPublicHardyHomes,
} from "@hardy-homes/shared/hardyHomes";
import { DEFAULT_HARDY_HOMES_URL } from "@hardy-homes/shared/hardyHomesSite";
import { getCollectionPath, getFloorPlansPath } from "@hardy-homes/shared/hardyHomesRoutes";

export function generateStaticParams() {
  return [
    { slug: "cottage" },
    { slug: "single-family" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = getHardyCollectionByStandaloneSlug(slug);
  const siteUrl = process.env.NEXT_PUBLIC_HARDY_HOMES_URL || DEFAULT_HARDY_HOMES_URL;
  if (!collection) return { title: "Collections" };
  const path = getCollectionPath(collection, "standalone");
  return {
    title: collection.title,
    description: collection.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${collection.title} | Hardy Homes`,
      description: collection.description,
      url: `${siteUrl}${path}`,
      siteName: "Hardy Homes",
      type: "website",
    },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getHardyCollectionByStandaloneSlug(slug);
  if (!collection) {
    return <section className="section"><div className="container"><h1 className="h-lg">Collection not found.</h1></div></section>;
  }

  const homes = getPublicHardyHomes().filter((home) => home.collectionSlug === collection.slug);

  return (
    <section className="section hardy-collection-page">
      <div className="container">
        <div className="hardy-back-links">
          <Link href={getFloorPlansPath("standalone")}>Floor Plans</Link>
        </div>
        <div className="sec-head hardy-collection-page-head hh-head-left">
          <span className="eyebrow">Collection</span>
          <h1 className="h-lg">{collection.title}</h1>
          <p>{collection.description}</p>
        </div>
        <div className={`hardy-plan-card-grid hh-plan-index-grid${homes.length === 1 ? " hardy-plan-card-grid--single" : ""}`}>
          {homes.map((home) => (
            <HardyHomeCard key={home.slug} home={home} />
          ))}
        </div>
      </div>
    </section>
  );
}
