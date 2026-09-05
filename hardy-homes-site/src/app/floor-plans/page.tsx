import type { Metadata } from "next";
import HardyHomeCard from "@/components/HardyHomeCard";
import { getPublicHardyHomes } from "@hardy-homes/shared/hardyHomes";

export const metadata: Metadata = {
  title: "Floor Plans",
  description: "Compare Hardy Homes floor plans by collection, square footage, and overall layout direction.",
  alternates: {
    canonical: "/floor-plans",
  },
  openGraph: {
    title: "Floor Plans | Hardy Homes",
    description: "Compare Hardy Homes floor plans by collection, square footage, and overall layout direction.",
    url: "/floor-plans",
    siteName: "Hardy Homes",
    type: "website",
  },
};

export default function FloorPlansPage() {
  return (
    <section className="section hardy-collection-page">
      <div className="container">
        <div className="sec-head hardy-collection-page-head hh-head-left">
          <span className="eyebrow">Floor Plans</span>
          <h1 className="h-lg">Compare current Hardy Homes floor plans.</h1>
          <p>Review square footage, collection, and overall layout direction at a glance.</p>
        </div>
        <div className="hardy-plan-card-grid hh-plan-index-grid">
          {getPublicHardyHomes().map((home) => (
            <HardyHomeCard key={home.slug} home={home} />
          ))}
        </div>
      </div>
    </section>
  );
}
