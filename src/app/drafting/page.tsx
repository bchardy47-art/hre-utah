import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Residential Drafting & Home Design | HRE Utah",
  description:
    "Concept plans, Chief Architect drafting, engineering coordination, and a clear path from idea to construction for Utah homes, additions, and major remodels.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const capabilityItems = [
  "New Homes",
  "Additions & Major Remodels",
  "Chief Architect Drafting",
  "Engineering Coordination",
];

const startingPoints = [
  {
    title: "I have a sketch.",
    copy:
      "I’ll evaluate the layout, improve room relationships, and turn the idea into a clear residential concept.",
  },
  {
    title: "I found a plan I like.",
    copy:
      "Use it to show me what works for you. I’ll create an original design tailored to your goals, site, budget, and construction approach.",
    note: "I do not reproduce copyrighted plan sets without authorization.",
  },
  {
    title: "I want to modify an HRE concept.",
    copy:
      "Start from an original HRE concept and adjust the layout, exterior direction, garage, basement, or room configuration.",
  },
  {
    title: "I want a fully custom home.",
    copy:
      "Start from a blank page and build the layout around your family, property, priorities, and target budget.",
  },
];

const tiers = [
  {
    number: "01",
    title: "Concept Plan",
    copy:
      "Develop the core idea before committing to a full drawing package. This phase may include room relationships, preliminary layout, approximate square footage, exterior direction, and early design revisions.",
    bestFor:
      "Testing a new-home idea, planning an addition, or developing a strong starting point.",
  },
  {
    number: "02",
    title: "Residential Drafting Package",
    copy:
      "Turn the approved concept into detailed Chief Architect drawings based on the written project scope. Depending on the project, the package may include dimensioned floor plans, exterior elevations, roof information, building sections, and applicable schedules.",
    bestFor:
      "Customers ready to move from concept into detailed plan development.",
  },
  {
    number: "03",
    title: "Engineering & Permit Coordination",
    copy:
      "I organize the drawing package for review by licensed professionals, coordinate requested revisions, and help assemble the jurisdictional submittal set.",
    note:
      "Engineering, surveys, soils reports, energy documentation, permit fees, and other third-party costs are separate unless specifically included in writing.",
    bestFor:
      "Customers who want one coordinated path from drafting through engineering and permit review.",
  },
];

const processSteps = [
  {
    number: "1",
    title: "Discovery",
    copy:
      "I discuss the property, household needs, inspiration, budget direction, and project goals with you.",
  },
  {
    number: "2",
    title: "Concept",
    copy:
      "I develop the floor-plan direction and establish the major room relationships, size, and exterior character.",
  },
  {
    number: "3",
    title: "Drafting",
    copy:
      "I develop the approved concept in Chief Architect according to the written scope.",
  },
  {
    number: "4",
    title: "Engineering",
    copy:
      "Licensed professionals review and design structural or other regulated components when required.",
  },
  {
    number: "5",
    title: "Permit Review",
    copy:
      "I help prepare the project package for the applicable jurisdiction, with revisions coordinated as required.",
  },
  {
    number: "6",
    title: "Plans Only or Design + Build",
    copy:
      "Use the completed plan package under the terms of the written agreement, or continue into a coordinated construction path with BCHardy, LLC when the project is accepted.",
  },
];

const whyHre = [
  {
    title: "Practical Layouts",
    copy:
      "Room flow, stairs, garages, storage, kitchens, roofs, and mechanical space are considered as parts of one buildable home.",
  },
  {
    title: "Budget-Aware Decisions",
    copy:
      "Design choices are evaluated with real construction sequencing, material use, and cost implications in mind.",
  },
  {
    title: "Clear Coordination",
    copy:
      "I help keep drafting, engineering revisions, permitting, and construction planning aligned.",
  },
  {
    title: "Flexible Service",
    copy:
      "Choose a standalone drawing package or continue into a coordinated design-to-build process.",
  },
];

const faqs = [
  {
    question: "Can I bring a plan I found online?",
    answer:
      "Yes—as inspiration. I use it to understand your preferences, then create an original design for your project. I do not reproduce copyrighted plan sets without authorization.",
  },
  {
    question: "Can BCHardy, LLC stamp my plans?",
    answer:
      "No. Structural engineering and professional seals are provided by separately licensed professionals when required.",
  },
  {
    question: "Are the drawings guaranteed to receive a permit?",
    answer:
      "No. Approval depends on the property, zoning, building codes, engineering, soils, utilities, HOA requirements, and the reviewing jurisdiction.",
  },
  {
    question: "Can I take the plans to another builder?",
    answer:
      "Plans-only engagements are available. Deliverables, ownership, permitted use, and transfer rights are defined in the written agreement.",
  },
  {
    question: "How much does drafting cost?",
    answer:
      "Pricing is based on project size, complexity, starting information, revision scope, and required third-party services. Each project begins with a written proposal.",
  },
  {
    question: "What types of projects do you draft?",
    answer:
      "New homes, additions, major residential remodels, basement layouts, garages, shops, and other residential projects may be considered based on scope and feasibility.",
  },
];

export default function DraftingPage() {
  return (
    <>
      <section className="hero hero--page drafting-hero" data-screen-label="Residential Drafting & Home Design">
        <div className="scene scene--dusk ridge">
          <Image
            className="slot"
            src="/images/hero-home.jpg"
            alt="Utah home exterior at dusk"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <span className="eyebrow">Residential Drafting &amp; Home Design</span>
          <h1 className="h-xl drafting-hero-title">Have a home in mind? Let’s put it on paper.</h1>
          <p className="lead">
            Bring a sketch, an inspiration plan, or start from an original HRE concept. I develop
            practical residential plans in Chief Architect and coordinate licensed engineering when
            required.
          </p>
          <div className="drafting-hero-actions">
            <Link
              className="btn btn-primary btn-lg"
              href="/contact#message"
              data-hre-event="Drafting_Inquiry_Click"
              data-hre-location="drafting-hero"
            >
              Start Your Home Design <Arrow />
            </Link>
            <Link className="btn btn-ghost btn-lg" href="#process">
              See How It Works <Arrow />
            </Link>
          </div>
          <div className="drafting-cap-row" aria-label="Residential drafting capabilities">
            {capabilityItems.map((item) => (
              <div key={item} className="drafting-cap">
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="start-where-you-are">
        <div className="container">
          <div className="sec-head drafting-head-left">
            <span className="eyebrow">Get Started</span>
            <h2 id="start-where-you-are">Start where you are.</h2>
            <p>
              You do not need a finished plan to begin. Bring what you have, and I’ll help turn it
              into a clear design direction.
            </p>
          </div>
          <div className="drafting-card-grid">
            {startingPoints.map((item) => (
              <article key={item.title} className="card drafting-card plan-accent">
                <span className="drafting-card-kicker">Starting Point</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                {item.note ? <div className="drafting-note">{item.note}</div> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="service-tiers">
        <div className="container">
          <div className="sec-head drafting-head-left" style={{ marginBottom: 34 }}>
            <span className="eyebrow">Scope Options</span>
            <h2 id="service-tiers">Choose the level of help your project needs.</h2>
            <p>The exact scope for every project is defined in the written proposal.</p>
          </div>
          <div className="drafting-tier-grid">
            {tiers.map((tier) => (
              <article key={tier.title} className="card drafting-tier plan-accent">
                <div className="drafting-tier-top">
                  <span className="drafting-tier-num">{tier.number}</span>
                  <div className="drafting-tier-rule" aria-hidden="true" />
                </div>
                <h3>{tier.title}</h3>
                <p>{tier.copy}</p>
                {tier.note ? <div className="drafting-note drafting-note-strong">{tier.note}</div> : null}
                <div className="drafting-best-for">
                  <span>Best for</span>
                  <p>{tier.bestFor}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="process" aria-labelledby="drafting-process">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">The Process</span>
            <h2 id="drafting-process">A clear path from idea to construction.</h2>
          </div>
          <div className="drafting-process-grid">
            {processSteps.map((step) => (
              <article key={step.number} className="drafting-step">
                <div className="drafting-step-num">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="plans-only-vs-design-build">
        <div className="container">
          <div className="sec-head drafting-head-left" style={{ marginBottom: 34 }}>
            <span className="eyebrow">Project Paths</span>
            <h2 id="plans-only-vs-design-build">
              Just need plans—or want one team from design through construction?
            </h2>
          </div>
          <div className="drafting-path-grid">
            <article className="card drafting-path plan-accent">
              <span className="drafting-card-kicker">Plans Only</span>
              <h3>Standalone Residential Drafting</h3>
              <p>
                Hire HRE for a defined residential drafting scope. Deliverables, revision limits,
                plan-use rights, and third-party services are established in the written agreement.
              </p>
              <div className="drafting-path-cta">
                <Link
                  className="btn btn-ghost"
                  href="/contact#message"
                  data-hre-event="Drafting_Inquiry_Click"
                  data-hre-location="plans-only-card"
                >
                  Discuss a Plans-Only Project <Arrow />
                </Link>
              </div>
            </article>
            <article className="card drafting-path drafting-path-featured plan-accent">
              <span className="drafting-card-kicker">Design + Build</span>
              <h3>Coordinated Path with BCHardy, LLC</h3>
              <p>
                Carry the same design into estimating, engineering, permitting, selections, and
                construction coordination with BCHardy, LLC.
              </p>
              <div className="drafting-note drafting-note-strong">
                Construction services are separately contracted and subject to licensing,
                financing, site feasibility, permits, insurance, and project acceptance.
              </div>
              <div className="drafting-path-cta">
                <Link
                  className="btn btn-primary"
                  href="/contact#message"
                  data-hre-event="Drafting_Inquiry_Click"
                  data-hre-location="design-build-card"
                >
                  Discuss the Full-Service Path <Arrow />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="why-hre-design">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}>
            <span className="eyebrow">Why HRE</span>
            <h2 id="why-hre-design">Designed with construction in mind.</h2>
          </div>
          <div className="colrow" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            {whyHre.map((item) => (
              <div key={item.title} className="col">
                <div className="col-ico circ">
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                      <path d="M3 20h18" />
                      <path d="M6 20V8l6-4 6 4v12" />
                      <path d="M9 11h6M9 14h6" />
                    </svg>
                  </span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="drafting-faq">
        <div className="container" style={{ maxWidth: 940 }}>
          <div className="sec-head" style={{ marginBottom: 34 }}>
            <span className="eyebrow">FAQ</span>
            <h2 id="drafting-faq">Frequently Asked Questions</h2>
          </div>
          {faqs.map((item) => (
            <details key={item.question} className="faq">
              <summary>
                {item.question}
                <span className="pm">+</span>
              </summary>
              <div className="faq-body">{item.answer}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="drafting-disclaimer">
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="card drafting-disclaimer plan-accent">
            <span className="eyebrow" style={{ marginBottom: 14 }}>Important Information</span>
            <p id="drafting-disclaimer">
              BCHardy, LLC provides residential drafting, home-design, and project-coordination
              services and is not an architectural or engineering firm. Structural calculations,
              engineering, professional seals, surveys, soils reports, energy compliance, and
              other licensed services are provided by separate professionals when required.
              Drawings and concepts remain subject to site conditions, zoning, applicable building
              codes, HOA requirements, utility requirements, and jurisdictional review. No permit,
              approval, financing, cost, schedule, or construction outcome is guaranteed.
            </p>
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="drafting-final-cta">
        <div className="container">
          <div className="card drafting-final-cta plan-accent">
            <div>
              <span className="eyebrow">Next Step</span>
              <h2 id="drafting-final-cta">Ready to turn your idea into a real plan?</h2>
              <p>
                Tell me what you want to build, what you already have, and where the project is
                located. I’ll help identify the right next step.
              </p>
            </div>
            <div className="drafting-final-actions">
              <Link
                className="btn btn-primary btn-lg"
                href="/contact#message"
                data-hre-event="Drafting_Inquiry_Click"
                data-hre-location="drafting-final-cta"
              >
                Start Your Home Design <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
