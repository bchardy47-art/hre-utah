import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="section hardy-collection-page">
      <div className="container">
        <div className="sec-head hardy-collection-page-head">
          <span className="eyebrow">Not Found</span>
          <h1 className="h-lg">That page isn&apos;t available.</h1>
          <p>Return to the Hardy Homes homepage or browse the current floor plans.</p>
          <div className="hardy-cta-actions" style={{ justifyContent: "center", marginTop: 24 }}>
            <Link className="btn btn-primary" href="/">Hardy Homes Home</Link>
            <Link className="btn btn-ghost" href="/floor-plans">Browse Floor Plans</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
