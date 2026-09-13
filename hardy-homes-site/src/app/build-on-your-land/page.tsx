import type { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { HARDY_HOMES_SERVICE_AREA_LINE } from "@hardy-homes/shared/hardyHomesSite";
import { getPublicHardyHomes } from "@hardy-homes/shared/hardyHomes";
import { getPlanPath } from "@hardy-homes/shared/hardyHomesRoutes";
import { BreadcrumbStructuredData, FaqStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Build On Your Land in Utah",
  description:
    "Own a lot, or shopping for one? How Hardy Homes builds a pre-designed plan on land you own in Utah — what we review on a site, and why site costs differ from house costs.",
  alternates: {
    canonical: "/build-on-your-land",
  },
  openGraph: {
    title: "Build On Your Land in Utah | Hardy Homes",
    description:
      "Own a lot, or shopping for one? How Hardy Homes builds a pre-designed plan on land you own in Utah — what we review on a site, and why site costs differ from house costs.",
    url: "/build-on-your-land",
    siteName: "Hardy Homes",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="m5 13 4 4L19 7" />
  </svg>
);

const siteReview = [
  "Legal and physical access to the parcel",
  "Zoning district, setbacks, and how the plan sits inside them",
  "Culinary water — municipal connection, a shared system, or a well",
  "Sewer connection or an onsite septic system",
  "Power: where the nearest service is and how far it has to come",
  "Natural gas, or whether the house is designed all-electric",
  "Topography, grading, and how much dirt has to move",
  "Soils and whether a geotechnical report is warranted",
  "Drainage and how water leaves the site",
  "Usable buildable area once setbacks and easements are removed",
  "Which jurisdiction issues the permit, and what it asks for",
  "Whether the parcel sits in a mapped floodplain or hazard overlay",
];

const houseCosts = [
  "The plan itself and its finished square footage",
  "Foundation and framing",
  "The Hardy Standard features package",
  "Selected options and finish upgrades",
  "Interior trades, cabinetry, and fixtures",
];

const siteCosts = [
  "Excavation, grading, and import or export of material",
  "Driveway and approach",
  "Water — a connection, a shared system, or a drilled well",
  "Septic system, or a sewer lateral and connection",
  "Power extension from the nearest available service",
  "Engineering, surveys, and any required reports",
  "Permits, plan review, and impact or connection fees",
  "Foundation changes driven by slope, soils, or frost depth",
];

const stages = [
  {
    title: "Land conversation",
    copy: "Start with the parcel — where it is, what you know about it, and what you want to build there. If you have not bought yet, this is the cheapest time to talk.",
  },
  {
    title: "Preliminary site review",
    copy: "A first pass at access, utilities, zoning, and buildable area. The goal is an honest read on what a build here would involve, not a green light.",
  },
  {
    title: "Select and configure a plan",
    copy: "Pick a Hardy Homes plan that suits the lot and how you want to live, then work through the options and finish selections.",
  },
  {
    title: "Scope, pricing, and financing",
    copy: "House scope and site scope are priced separately so you can see what is driven by the plan and what is driven by the property. Financing runs in parallel.",
  },
  {
    title: "Preconstruction and permits",
    copy: "Construction documents, any required engineering, and the permit application through the jurisdiction that governs your parcel.",
  },
  {
    title: "Construction",
    copy: "Site work, foundation, framing, trades, and finishes, with the specifications agreed before contract.",
  },
];

const faqs = [
  {
    q: "Can Hardy Homes build on land I already own?",
    a: "Yes. That is the core of what Hardy Homes does. You bring the parcel, you choose a pre-designed plan, and the house is built on your property rather than in a subdivision we developed.",
  },
  {
    q: "Can you look at land before I buy it?",
    a: "Yes, and it is worth doing. A preliminary review of access, utilities, zoning, and buildable area is far cheaper before closing than after. Hardy Homes gives you a builder's read on the parcel — it is not a substitute for a survey, a geotechnical report, a title search, or the governing jurisdiction's own determinations.",
  },
  {
    q: "Do utilities already need to be at the property?",
    a: "No, but what is and is not already there changes the project substantially. A lot with water, sewer, and power at the street is a very different build from a parcel that needs a well, a septic system, and a power extension. Neither is disqualifying; they just need to be understood before anyone talks about a number.",
  },
  {
    q: "Can I build with a well and septic?",
    a: "In many rural settings, yes. A septic system is permitted through the local health department having jurisdiction and generally requires a soil evaluation of the site first. A private well or other water source also has to meet applicable state water-right and permitting requirements. Both should be confirmed for your specific parcel before they are assumed.",
  },
  {
    q: "Can land I already own help with a construction loan?",
    a: "It often can. Lenders commonly consider equity in land you own free and clear as part of your contribution to a construction loan. Terms, appraisals, and qualification are entirely up to the lender — Hardy Homes does not arrange financing or promise loan terms.",
  },
  {
    q: "Can I change a Hardy Homes floor plan?",
    a: "Hardy Homes is a pre-designed, semi-custom builder. You select from published plans and personalize exterior elevation direction, kitchen and bath finishes, flooring, and fixture and lighting selections, plus site-driven adjustments the property requires. Plan-specific layout modifications are considered case by case when approved, not assumed.",
  },
  {
    q: "What does it cost to get land ready to build?",
    a: "It depends almost entirely on the parcel, which is why Hardy Homes prices site development separately from the house. Two identical homes on two different lots can carry very different site costs. We do not publish a site development number, because a number that ignores your parcel would be misleading.",
  },
  {
    q: "Where does Hardy Homes build?",
    a: "Hardy Homes serves Millard County, Utah County, and Salt Lake County in Utah. Serving a county does not mean every parcel in it works — access, utilities, and jurisdiction still decide whether a specific property is a fit.",
  },
];

export default function BuildOnYourLandPage() {
  const plans = getPublicHardyHomes();

  return (
    <>
      <BreadcrumbStructuredData
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Build On Your Land", path: "/build-on-your-land" },
        ]}
      />
      <FaqStructuredData faqs={faqs} />

      <section className="section hardy-collection-page">
        <div className="container">
          <nav className="hardy-back-links" aria-label="Breadcrumb">
            <ol className="hardy-crumbs">
              <li><Link href="/">Home</Link></li>
              <li><span aria-current="page">Build On Your Land</span></li>
            </ol>
          </nav>

          <div className="sec-head hardy-collection-page-head hh-head-left">
            <span className="eyebrow">Build On Your Land</span>
            <h1 className="h-lg">Build a Hardy Home on land you own.</h1>
            <p className="lead">
              Most new homes in Utah are sold inside a subdivision the builder developed. Hardy Homes works the other
              way around: you bring the property, you choose a plan that has already been drawn and specified, and we
              build it there.
            </p>
            <p className="hh-service-area">{HARDY_HOMES_SERVICE_AREA_LINE}</p>
          </div>

          <div className="hardy-detail-grid">
            <div className="card hardy-standard-card plan-accent" style={{ padding: 30 }}>
              <span className="eyebrow">Already own land</span>
              <h2 className="h-md">You have the lot. Start with the site.</h2>
              <p className="hardy-standard-inline">
                The first conversation is about the parcel, not the paint colors. Where it is, how you get to it, what
                utilities are already there, and which jurisdiction issues the permit all shape what can be built and
                what it takes to get there. Once that picture is clear, choosing a plan is the easy part.
              </p>
              <p className="hardy-standard-inline">
                Bring whatever you already have — a parcel number, a plat, a survey, a septic permit, a well log, a
                title report. Anything that describes the property saves time.
              </p>
            </div>
            <div className="card hardy-standard-card plan-accent" style={{ padding: 30 }}>
              <span className="eyebrow">Still looking</span>
              <h2 className="h-md">Not every parcel is build-ready.</h2>
              <p className="hardy-standard-inline">
                Land is priced on what it is, not on what it costs to build on. Two parcels at the same asking price can
                be very different projects once access, water, power, and grading are accounted for. Getting a builder&apos;s
                read before you close is the least expensive due diligence in the whole process.
              </p>
              <p className="hardy-standard-inline">
                Hardy Homes can tell you what a build on a given parcel would likely involve. We cannot tell you that a
                parcel is buildable — that is settled by the governing jurisdiction, and by the surveyors, engineers,
                and utility providers who evaluate it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="site-review">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Site Review</span>
            <h2 id="site-review">What we look at on a property</h2>
            <p>
              A preliminary site review is a practical walk through the things that most often change a project&apos;s scope,
              schedule, or cost.
            </p>
          </div>
          <div className="hh-spec-sheet">
            <ul className="hh-spec-list">
              {siteReview.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="hardy-standard-note" style={{ maxWidth: 820 }}>
            This review is a builder&apos;s assessment, not a professional determination. Surveys, geotechnical reports,
            engineering, utility availability, water rights, and permit approvals come from licensed professionals,
            utility providers, and the governing jurisdiction. Hardy Homes does not replace any of them.
          </p>
        </div>
      </section>

      <section className="section alt" aria-labelledby="choose-a-plan">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Floor Plans</span>
            <h2 id="choose-a-plan">Start from a plan that is already drawn</h2>
            <p>
              A fully custom home starts with a blank page, an architect, and a long design phase. Hardy Homes starts
              with plans that already exist, already have a defined standard features package, and already have a known
              scope. You are choosing and personalizing rather than designing from scratch.
            </p>
          </div>
          <div className="hh-spec-sheet">
            <ul className="hh-spec-list">
              {plans.map((plan) => (
                <li key={plan.standaloneSlug}>
                  <Link href={getPlanPath(plan, "standalone")}>{plan.name}</Link>
                  {" — "}
                  {plan.squareFeet.toLocaleString()} sq ft, {plan.bedrooms.toLowerCase()}, {plan.bathrooms.toLowerCase()}
                  {plan.garage ? `, ${plan.garage.toLowerCase()}` : ""}
                </li>
              ))}
            </ul>
          </div>
          <div className="hardy-cta-actions" style={{ marginTop: 26 }}>
            <Link className="btn btn-primary" href="/floor-plans">Compare Floor Plans <Arrow /></Link>
            <Link className="btn btn-ghost" href="/standard-features">See What Comes Standard <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="customize">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Semi-Custom</span>
            <h2 id="customize">Personalize the plan without redesigning it</h2>
          </div>
          <div className="hh-band card plan-accent hh-band-slim">
            <div>
              <p>
                Semi-custom means you start from an established plan rather than a blank page, while still making meaningful
                choices. A Hardy Home can be personalized through:
              </p>
              <ul>
                <li><Check />Exterior materials and elevation direction</li>
                <li><Check />Kitchen and bathroom finish selections</li>
                <li><Check />Flooring and interior finish upgrades</li>
                <li><Check />Appliance, fixture, and lighting allowances</li>
                <li><Check />Site-driven scope adjustments the property requires</li>
                <li><Check />Plan-specific layout modifications when approved</li>
              </ul>
            </div>
            <div className="hh-band-actions">
              <Link className="btn btn-primary" href="/options">Options &amp; Upgrades</Link>
              <Link className="btn btn-ghost" href="/standard-features">The Hardy Standard</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="site-vs-house">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Budget</span>
            <h2 id="site-vs-house">Two budgets: the house and the site</h2>
            <p>
              This is the single most useful thing to understand before building on your own land. A home built on your
              property has two cost centers, and only one of them is the same from lot to lot.
            </p>
          </div>
          <div className="hardy-detail-grid">
            <div className="card hardy-standard-card plan-accent" style={{ padding: 30 }}>
              <span className="eyebrow">Predictable</span>
              <h3 className="h-md">House and vertical construction</h3>
              <p className="hardy-standard-inline">
                Driven primarily by the plan you choose and the selections you make. It is generally more predictable than
                site development, although jurisdiction, engineering, labor, and project conditions can still affect it.
              </p>
              <ul className="hardy-feature-list hardy-feature-list--single">
                {houseCosts.map((item) => (
                  <li key={item}><Check />{item}</li>
                ))}
              </ul>
            </div>
            <div className="card hardy-standard-card plan-accent" style={{ padding: 30 }}>
              <span className="eyebrow">Parcel-specific</span>
              <h3 className="h-md">Lot and site development</h3>
              <p className="hardy-standard-inline">
                Driven entirely by the property. This is where two otherwise identical projects diverge, sometimes by a
                great deal.
              </p>
              <ul className="hardy-feature-list hardy-feature-list--single">
                {siteCosts.map((item) => (
                  <li key={item}><Check />{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card hh-page-note hardy-standard-card plan-accent" style={{ marginTop: 22 }}>
            <span className="eyebrow">Why we do not post a price here</span>
            <p className="hardy-standard-inline">
              A flat price per square foot is easy to publish and frequently wrong, because it quietly assumes a site.
              A lot with utilities at the street and a parcel that needs a well, a septic system, and a quarter mile of
              power do not belong under the same number. Hardy Homes prices the house scope and the site scope
              separately so you can see which part of the budget is the home and which part is the ground it sits on.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="financing">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Financing</span>
            <h2 id="financing">Where financing fits</h2>
          </div>
          <div className="card hh-page-note hardy-standard-card plan-accent">
            <p className="hardy-standard-inline">
              Building on your own land usually involves construction financing rather than a conventional purchase
              mortgage, and lenders commonly consider equity in land you already own as part of your contribution.
              Whether that applies to you, and on what terms, is the lender&apos;s call.
            </p>
            <p className="hardy-standard-inline">
              Hardy Homes does not originate loans, quote rates, or promise approval. What we can do is make sure the
              project information a lender asks for is organized and consistent.
            </p>
            <div className="hardy-cta-actions" style={{ marginTop: 18 }}>
              <Link className="btn btn-ghost" href="/financing">More on financing <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="the-process">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Process</span>
            <h2 id="the-process">How a build-on-your-land project runs</h2>
            <p>
              The general Hardy Homes process is on <Link href="/how-it-works">How It Works</Link>. Building on a
              parcel you own adds a front end — the land has to be understood before the house can be priced.
            </p>
          </div>
          <div className="feat-grid hh-process-grid" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
            {stages.map((stage, index) => (
              <article key={stage.title} className="card feat hh-process-card">
                <span className="label">Stage {index + 1}</span>
                <h3>{stage.title}</h3>
                <p>{stage.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="service-area">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Service Area</span>
            <h2 id="service-area">Where Hardy Homes builds</h2>
          </div>
          <div className="hh-band card plan-accent hh-band-slim">
            <div>
              <p>
                Hardy Homes serves customers in <strong>Millard County</strong>, <strong>Utah County</strong>,
                and <strong>Salt Lake County</strong>. Those counties cover very different building conditions — a
                serviced lot on the Wasatch Front and a rural parcel in the west desert are not the same project, and
                they should not be planned as if they were.
              </p>
              <p>
                Serving a county does not mean every parcel inside it is automatically serviceable. Distance, access,
                utilities, and the governing jurisdiction all factor into whether a specific property is a fit.
              </p>
            </div>
            <div className="hh-band-actions">
              <Link className="btn btn-primary" href="/millard-county-home-builder">Building in Millard County</Link>
              <Link className="btn btn-ghost" href="/contact">Ask About Your Parcel</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="faq">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">FAQ</span>
            <h2 id="faq">Common questions about building on your own land</h2>
          </div>
          <div className="feat-grid hh-process-grid" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
            {faqs.map((item) => (
              <article key={item.q} className="card feat hh-process-card">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="boyl-final-cta">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent hh-final-cta">
            <div>
              <span className="eyebrow">Start The Conversation</span>
              <h2 id="boyl-final-cta">Tell us about your property.</h2>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/contact">Start Your Build <Arrow /></Link>
              <Link className="btn btn-ghost btn-lg" href="/floor-plans">View Floor Plans <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
