import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Financing",
  description:
    "See how financing fits into the Hardy Homes planning conversation without promising specific lender programs or loan terms.",
  alternates: {
    canonical: "/financing",
  },
  openGraph: {
    title: "Financing | Hardy Homes",
    description:
      "See how financing fits into the Hardy Homes planning conversation without promising specific lender programs or loan terms.",
    url: "/financing",
    siteName: "Hardy Homes",
    type: "website",
  },
};

export default function FinancingPage() {
  return (
    <section className="section hardy-collection-page">
      <div className="container" style={{ maxWidth: 1040 }}>
        <div className="sec-head hardy-collection-page-head hh-head-left">
          <span className="eyebrow">Financing</span>
          <h1 className="h-lg">Financing is part of the planning conversation.</h1>
          <p>
            Hardy Homes can help frame the budgeting and timing conversation so buyers know what information is needed to move a project forward.
          </p>
        </div>
        <div className="card hardy-standard-card plan-accent hh-page-note">
          <span className="eyebrow">Important</span>
          <p className="hardy-standard-inline">
            This page does not promise lender programs, rates, approvals, or qualification terms. Financing details are coordinated with the appropriate lending professionals.
          </p>
          <div className="hardy-cta-actions">
            <Link className="btn btn-primary" href="/contact">Talk About Your Project</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
