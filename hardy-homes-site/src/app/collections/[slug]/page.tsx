import type { Metadata } from "next";
import Link from "next/link";
import HardyHomeCard from "@/components/HardyHomeCard";
import {
  getHardyCollectionByStandaloneSlug,
  getPublicHardyHomes,
} from "@hardy-homes/shared/hardyHomes";
import { DEFAULT_HARDY_HOMES_URL } from "@hardy-homes/shared/hardyHomesSite";
import { getCollectionPath, getFloorPlansPath } from "@hardy-homes/shared/hardyHomesRoutes";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

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
  const homes = getPublicHardyHomes().filter((home) => home.collectionSlug === collection.slug);
  const planNames = homes.map((home) => home.name).join(" and ");
  const description = `${collection.description} Includes ${planNames}. Compare layouts and square footage, then build on your land in Utah.`;
  return {
    title: `${collection.title} | Utah Home Plans`,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${collection.title} | Hardy Homes`,
      description,
      url: `${siteUrl}${path}`,
      siteName: "Hardy Homes",
      type: "website",
      images: [{ url: collection.image.src, alt: collection.image.alt }],
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
    <>
      <BreadcrumbStructuredData
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Collections", path: "/collections" },
          { name: collection.title, path: getCollectionPath(collection, "standalone") },
        ]}
      />
    <section className="section hardy-collection-page">
      <div className="container">
        <nav className="hardy-back-links" aria-label="Breadcrumb">
          <ol className="hardy-crumbs">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/collections">Collections</Link></li>
            <li><Link href={getFloorPlansPath("standalone")}>Floor Plans</Link></li>
            <li><span aria-current="page">{collection.title}</span></li>
          </ol>
        </nav>
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
    </>
  );
}
