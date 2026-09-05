import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Follow the Hardy Homes customer journey from choosing a direction to reviewing the site, defining the scope, and moving toward construction.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    title: "How It Works | Hardy Homes",
    description:
      "Follow the Hardy Homes customer journey from choosing a direction to reviewing the site, defining the scope, and moving toward construction.",
    url: "/how-it-works",
    siteName: "Hardy Homes",
    type: "website",
  },
};

const steps = [
  {
    title: "Choose a direction",
    copy: "Start with a collection, a floor plan, or a conversation about the kind of home and site you have in mind.",
  },
  {
    title: "Review the property",
    copy: "Lot conditions, jurisdiction, utilities, and general site feasibility all shape what the project needs next.",
  },
  {
    title: "Define the scope",
    copy: "Standard features, options, and any site-driven adjustments are clarified before final commitments are made.",
  },
  {
    title: "Move toward construction",
    copy: "Once the project is accepted, final specifications and construction documents define the path forward.",
  },
];

export default function HowItWorksPage() {
  return (
    <section className="section hardy-collection-page">
      <div className="container">
        <div className="sec-head hardy-collection-page-head hh-head-left">
          <span className="eyebrow">How It Works</span>
          <h1 className="h-lg">A simpler homebuilding path.</h1>
          <p>Choose the home, review the property, define the scope, and move toward a clearer build process.</p>
        </div>
        <div className="feat-grid hh-process-grid" style={{ gridTemplateColumns: "repeat(4,minmax(0,1fr))" }}>
          {steps.map((step, index) => (
            <article key={step.title} className="card feat hh-process-card">
              <span className="label">Step {index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
        <div className="hardy-cta-actions" style={{ marginTop: 28 }}>
          <Link className="btn btn-primary" href="/floor-plans">View Floor Plans</Link>
          <Link className="btn btn-ghost" href="/contact">Start Your Build</Link>
        </div>
      </div>
    </section>
  );
}
