import type { Metadata } from "next";
import Link from "next/link";
import { hardyStandardCopy } from "@/lib/hardyHomes";

export const metadata: Metadata = {
  title: "The Hardy Standard | Hardy Homes",
  description:
    "Review the Hardy Homes framework for quality, function, and finish. Final specifications vary by home, site, jurisdiction, and selected options.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const categories = [
  {
    title: "Structure & Foundation",
    copy:
      "Structural design, foundation requirements, and framing details are determined by the home plan, engineering, soils information, site conditions, and jurisdictional requirements.",
  },
  {
    title: "Exterior",
    copy:
      "Exterior materials, elevations, and finish details are selected according to the approved plan, community requirements, and the written construction agreement.",
  },
  {
    title: "Windows & Doors",
    copy:
      "Window and door packages are chosen for the home design, code requirements, energy goals, and selected options.",
  },
  {
    title: "Insulation & Energy",
    copy:
      "Energy-related details are finalized to meet applicable code, plan requirements, climate conditions, and project-specific selections.",
  },
  {
    title: "Heating & Cooling",
    copy:
      "Mechanical systems are specified according to the home design, load requirements, local code, and selected equipment package.",
  },
  {
    title: "Kitchen",
    copy:
      "Cabinetry, countertops, fixtures, appliance allowances, and finish selections vary by home, budget, and chosen options.",
  },
  {
    title: "Bathrooms",
    copy:
      "Bathroom layouts, fixtures, surrounds, vanities, and finish materials are determined by the plan and the final selections for the project.",
  },
  {
    title: "Flooring",
    copy:
      "Flooring types and installation scopes are established in the written construction specification and may vary by room, plan, and option level.",
  },
  {
    title: "Interior Finishes",
    copy:
      "Trim, paint, doors, hardware, storage features, and other interior finish details are coordinated during selections and contract documentation.",
  },
  {
    title: "Lighting & Electrical",
    copy:
      "Electrical layout, fixture allowances, device locations, and specialty upgrades depend on the approved plan, code, and selected scope.",
  },
  {
    title: "Plumbing",
    copy:
      "Plumbing fixtures, water-heating approach, and related system details are based on the plan, jurisdiction, utility conditions, and selected options.",
  },
  {
    title: "Garage",
    copy:
      "Garage configuration, doors, storage potential, and finish level vary by model and project scope.",
  },
  {
    title: "Site & Utilities",
    copy:
      "Grading, utility connections, drainage, access, and site-specific work depend on the lot, municipality, engineering, and field conditions.",
  },
  {
    title: "Warranty / Completion",
    copy:
      "Final punch, closeout, and any applicable warranty information are provided in the contract documentation for the accepted project.",
  },
];

export default function HardyStandardPage() {
  return (
    <>
      <section className="hero hero--page hardy-hero" data-screen-label="The Hardy Standard">
        <div className="scene hardy-hero-scene" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <span className="eyebrow">Hardy Homes</span>
          <h1 className="h-xl">The Hardy Standard</h1>
          <p className="lead hardy-hero-copy">{hardyStandardCopy.body}</p>
        </div>
      </section>

      <section className="section" aria-labelledby="hardy-standard-overview">
        <div className="container" style={{ maxWidth: 1080 }}>
          <div className="card hardy-standard-overview plan-accent">
            <span className="eyebrow">What This Means</span>
            <h2 id="hardy-standard-overview">A framework buyers can understand before the details are finalized.</h2>
            <p>
              Hardy Homes is being built around a clear standard of quality, function, and finish.
              That does not mean every home uses an identical specification package regardless of
              lot, jurisdiction, or budget. It means the process starts with a defined baseline and
              a clear written scope before construction begins.
            </p>
            <div className="hardy-standard-note">{hardyStandardCopy.note}</div>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="hardy-standard-categories">
        <div className="container">
          <div className="sec-head hardy-section-head-compact">
            <span className="eyebrow">Included Categories</span>
            <h2 id="hardy-standard-categories">What the Hardy Standard is organized around.</h2>
            <p>
              These categories define the conversation and documentation structure for a Hardy
              Home. Final material choices, brands, assemblies, and allowances are provided in the
              project-specific construction specification.
            </p>
          </div>
          <div className="std-grid hardy-standard-grid">
            {categories.map((item) => (
              <article key={item.title} className="std hardy-standard-item">
                <div className="std-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M4 20h16" />
                    <path d="M6 20V8l6-4 6 4v12" />
                    <path d="M9 11h6M9 14h4" />
                  </svg>
                </div>
                <h4>{item.title}</h4>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="hardy-standard-process">
        <div className="container" style={{ maxWidth: 1080 }}>
          <div className="card hardy-standard-process plan-accent">
            <div className="sec-head" style={{ marginBottom: 28 }}>
              <span className="eyebrow">How It Gets Finalized</span>
              <h2 id="hardy-standard-process">The full specification is project-specific.</h2>
            </div>
            <div className="proc hardy-standard-proc" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              <div className="proc-step"><div className="proc-num">1</div><h4>Plan</h4><p>Choose the Hardy Home model and confirm the intended scope for the project.</p></div>
              <div className="proc-step"><div className="proc-num">2</div><h4>Site Review</h4><p>Account for the lot, jurisdiction, engineering requirements, and utility conditions.</p></div>
              <div className="proc-step"><div className="proc-num">3</div><h4>Selections</h4><p>Finalize finish level, upgrades, and project-specific decisions in writing.</p></div>
              <div className="proc-step"><div className="proc-num">4</div><h4>Contract</h4><p>Issue the complete construction specification before contract execution.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="hardy-standard-cta">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent">
            <div>
              <span className="eyebrow">Next Step</span>
              <h2 id="hardy-standard-cta">Talk with us about a Hardy Home.</h2>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/contact">
                Talk With Us About a Hardy Home <Arrow />
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/hardy-homes">
                Browse Hardy Homes <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
