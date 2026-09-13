import type { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { getPublicHardyHomes } from "@hardy-homes/shared/hardyHomes";
import { getPlanPath } from "@hardy-homes/shared/hardyHomesRoutes";
import { BreadcrumbStructuredData, FaqStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Millard County Home Builder",
  description:
    "Building on your land in Millard County, Utah — water rights, septic, power extensions and which office issues your permit in Delta, Fillmore or the county.",
  alternates: {
    canonical: "/millard-county-home-builder",
  },
  openGraph: {
    title: "Millard County Home Builder | Hardy Homes",
    description:
      "Building on your land in Millard County, Utah — water rights, septic, power extensions and which office issues your permit in Delta, Fillmore or the county.",
    url: "/millard-county-home-builder",
    siteName: "Hardy Homes",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="m5 13 4 4L19 7" />
  </svg>
);

const beforePricing = [
  "Whether a transferable water right exists, and what it allows",
  "Culinary water: a city connection, a shared system, or a drilled well",
  "Septic feasibility, including the soil evaluation the health department requires",
  "Distance from the nearest electric service, and who extends it",
  "Legal and physical access, and whether it crosses a county road",
  "Which jurisdiction issues the permit — the county, Delta, or Fillmore",
  "Zoning district and whether a conditional use permit is required",
  "Grading, drainage, and how much material moves",
  "Whether the parcel is in a mapped floodplain",
  "Whether the plan needs a structural stamp under county policy",
];

const faqs = [
  {
    q: "Does Hardy Homes build in Millard County?",
    a: "Yes. Millard County is one of three counties Hardy Homes serves, alongside Utah County and Salt Lake County. Serving the county does not mean every parcel in it works — access, utilities, and distance still decide whether a specific property is a fit.",
  },
  {
    q: "What is the hardest part of building on rural land in Millard County?",
    a: "Often water. The Utah Division of Water Rights places significant restrictions on new appropriations in the administrative areas covering the populated parts of the county — Sevier Desert, Pahvant Valley, and Lower Sevier River. The exact rules and limited exceptions vary by area. New development commonly depends on an existing valid water right and an approved change rather than a new appropriation. Confirm the specific parcel and intended use with the Division of Water Rights before relying on a well or other water source.",
  },
  {
    q: "Who issues the building permit for my property?",
    a: "It depends where the parcel sits. Unincorporated Millard County permits go through the Millard County Building Inspection Department in Delta. Delta City and Fillmore City each run their own permit process for property inside their city limits. For the county's smaller towns, confirm directly with that town before assuming.",
  },
  {
    q: "Can I build with a septic system?",
    a: "In much of the county, that is the normal approach. Millard County's own building permit requirements state that where a public sewer system is not available, a wastewater permit must be obtained from the Central Utah Public Health Department, which has offices in Delta and Fillmore. Expect a soil evaluation of the site as part of that process.",
  },
  {
    q: "What if power does not reach the property yet?",
    a: "Then the extension is part of the project budget. Rocky Mountain Power serves the Delta area, and Fillmore City operates its own municipal electric utility. Line extension policies generally provide a limited allowance, with costs beyond it advanced by the property owner. Fillmore City states plainly that extending utility lines to unserved property is at the owner's expense.",
  },
  {
    q: "Do Hardy Homes plans work on large rural parcels?",
    a: "They can. On a larger rural parcel, lot width may be less restrictive than it is in a subdivision, but setbacks, easements, access, utilities, septic layout, drainage, and other site conditions still control where a home can be placed.",
  },
];

export default function MillardCountyHomeBuilderPage() {
  const plans = getPublicHardyHomes();

  return (
    <>
      <BreadcrumbStructuredData
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Build On Your Land", path: "/build-on-your-land" },
          { name: "Millard County", path: "/millard-county-home-builder" },
        ]}
      />
      <FaqStructuredData faqs={faqs} />

      <section className="section hardy-collection-page">
        <div className="container">
          <nav className="hardy-back-links" aria-label="Breadcrumb">
            <ol className="hardy-crumbs">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/build-on-your-land">Build On Your Land</Link></li>
              <li><span aria-current="page">Millard County</span></li>
            </ol>
          </nav>

          <div className="sec-head hardy-collection-page-head hh-head-left">
            <span className="eyebrow">Millard County, Utah</span>
            <h1 className="h-lg">Building a home on your land in Millard County.</h1>
            <p className="lead">
              Millard County is not the Wasatch Front, and building here does not work like building there. Parcels are
              larger, services are further apart, and the questions that decide a project are usually about water,
              power, and access rather than about lot premiums and HOA design review.
            </p>
            <p className="hh-service-area">
              Hardy Homes serves Millard County alongside Utah County and Salt Lake County. Not every parcel in the
              county is serviceable — that depends on the property.
            </p>
          </div>

          <div className="hh-band card plan-accent hh-band-featured">
            <div>
              <h2>Why work with a builder who plans for rural sites</h2>
              <p>
                A production builder set up for serviced subdivision lots is solving a different problem. On a rural
                parcel the house is often the straightforward part.
              </p>
              <ul>
                <li><Check />Pre-designed plans with a defined standard features package, so the house scope is settled early</li>
                <li><Check />Site scope priced separately from the house, so you can see which costs come from the land</li>
                <li><Check />Comfortable with wells, septic systems, power extensions, and unincorporated permitting</li>
                <li><Check />Built by a licensed Utah residential contractor</li>
              </ul>
            </div>
            <div className="hh-band-actions">
              <Link className="btn btn-primary btn-lg" href="/contact">Ask About Your Parcel</Link>
              <Link className="btn btn-ghost btn-lg" href="/floor-plans">View Floor Plans</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="what-is-different">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Rural Building</span>
            <h2 id="what-is-different">What is actually different about building here</h2>
          </div>

          <div className="hardy-detail-grid">
            <div className="card hardy-standard-card plan-accent" style={{ padding: 30 }}>
              <span className="eyebrow">Water</span>
              <h3 className="h-md">Water can be the binding constraint</h3>
              <p className="hardy-standard-inline">
                The Utah Division of Water Rights publishes policy for each administrative area. The three areas
                covering the populated parts of Millard County — <strong>Sevier Desert (Area 68)</strong> around Delta,{" "}
                <strong>Pahvant Valley (Area 67)</strong> around Fillmore, and{" "}
                <strong>Lower Sevier River (Area 66)</strong> — all have significant restrictions on new water
                appropriations. The exact groundwater rules and exceptions vary by administrative area.
              </p>
              <p className="hardy-standard-inline">
                Practically, new development commonly depends on acquiring and changing an existing valid water right
                rather than simply filing a new appropriation. Area-specific exceptions and management rules can apply,
                so the parcel, proposed use, and water source should be verified directly with the Utah Division of
                Water Rights before a well or other supply is relied upon.
              </p>
              <p className="hardy-standard-inline">
                If you are shopping for land here, verify water before you close. It is the item most likely to change
                whether a parcel is worth buying.
              </p>
            </div>

            <div className="card hardy-standard-card plan-accent" style={{ padding: 30 }}>
              <span className="eyebrow">Wastewater</span>
              <h3 className="h-md">Septic, where sewer does not reach</h3>
              <p className="hardy-standard-inline">
                Millard County&apos;s published building permit requirements state that where a public sewer system is not
                available to the site, a wastewater permit must be obtained from the{" "}
                <strong>Central Utah Public Health Department</strong>, which serves Millard County and keeps offices
                in Delta and Fillmore.
              </p>
              <p className="hardy-standard-inline">
                Utah&apos;s onsite wastewater rule requires soil exploration and a site evaluation before a system is
                permitted, with a percolation test at the regulatory authority&apos;s option. The health department&apos;s own
                application asks for a soil log and percolation record, so on most Millard County projects you should
                plan for both — and plan for them early, because the result affects where the house can sit.
              </p>
            </div>

            <div className="card hardy-standard-card plan-accent" style={{ padding: 30 }}>
              <span className="eyebrow">Power</span>
              <h3 className="h-md">Who serves the parcel, and how far away</h3>
              <p className="hardy-standard-inline">
                There is no single answer across the county. <strong>Rocky Mountain Power</strong> is the electricity
                provider listed by Delta City, which does not operate its own electric utility.{" "}
                <strong>Fillmore City</strong> does — it has run a municipal electric system since 1918.
              </p>
              <p className="hardy-standard-inline">
                Either way, distance costs money. Rocky Mountain Power&apos;s Utah line extension tariff provides a limited
                residential extension allowance and requires the applicant to advance costs above it before
                construction, and to provide trenching and conduit for underground service. Fillmore City states
                directly that extending utility lines to property not currently served is at the property owner&apos;s
                expense. Millard County also requires habitable structures to have electrical service capable of
                delivering at least 100 amps continuously.
              </p>
            </div>

            <div className="card hardy-standard-card plan-accent" style={{ padding: 30 }}>
              <span className="eyebrow">Permitting</span>
              <h3 className="h-md">Three different permit desks</h3>
              <p className="hardy-standard-inline">
                For unincorporated county land, permits go through the{" "}
                <strong>Millard County Building Inspection Department</strong> in Delta, which shares an office and
                phone number with Planning and Zoning. <strong>Delta City</strong> and <strong>Fillmore City</strong>{" "}
                each issue their own building permits for property inside their limits. For the county&apos;s smaller
                towns — Hinckley, Holden, Kanosh, Leamington, Lynndyl, Meadow, Oak City, and Scipio — confirm with the
                town rather than assuming either way.
              </p>
              <p className="hardy-standard-inline">
                One item catches people out: Millard County&apos;s published Building Permit Requirements state that residential
                dwellings in the unincorporated parts of the county require a <strong>Conditional Use Permit</strong>{" "}
                to be recorded with the deed. If site access encroaches on a county road, an encroachment permit from the County Road Department
                is also required.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="before-pricing">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Diligence</span>
            <h2 id="before-pricing">What has to be investigated before a home can be priced</h2>
            <p>
              None of this is unusual for rural Utah. It just has to happen before a number means anything.
            </p>
          </div>
          <div className="hh-spec-sheet">
            <ul className="hh-spec-list">
              {beforePricing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="hardy-standard-note" style={{ maxWidth: 820 }}>
            Hardy Homes does not make zoning, water rights, floodplain, or permitting determinations, and nothing on
            this page is a determination about a specific parcel. Those answers come from Millard County, the relevant
            city, the Central Utah Public Health Department, the Utah Division of Water Rights, the serving utility,
            and the licensed professionals who evaluate the property.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="plans-here">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Floor Plans</span>
            <h2 id="plans-here">How Hardy Homes plans fit this market</h2>
            <p>
              Many rural Millard County parcels are larger than typical subdivision lots, which can change what matters in
              plan selection. On a larger parcel, lot width may be less restrictive, while orientation, access,
              setbacks, utilities, and the septic layout can have more influence on placement. A single-level plan can
              be a straightforward fit on a suitable site, while larger plans depend on the specific parcel and site conditions.
            </p>
          </div>
          <div className="hh-spec-sheet">
            <ul className="hh-spec-list">
              {plans.map((plan) => (
                <li key={plan.standaloneSlug}>
                  <Link href={getPlanPath(plan, "standalone")}>{plan.name}</Link>
                  {" — "}
                  {plan.squareFeet.toLocaleString()} sq ft, {plan.bedrooms.toLowerCase()}, {plan.bathrooms.toLowerCase()}
                  {plan.stories ? `, ${plan.stories.toLowerCase()}` : ""}
                </li>
              ))}
            </ul>
          </div>
          <p className="hardy-standard-note" style={{ maxWidth: 820 }}>
            Millard County&apos;s published Residential Plan and Permit Acceptance Policy requires construction documents to
            be stamped by a licensed structural engineer or architect for dwellings with 2,500 square feet or more on
            the main floor and more than one story. The county also publishes residential design criteria, but
            project-specific requirements should be confirmed with the Building Department before design or engineering.
          </p>
          <div className="hardy-cta-actions" style={{ marginTop: 24 }}>
            <Link className="btn btn-primary" href="/floor-plans">Compare Floor Plans <Arrow /></Link>
            <Link className="btn btn-ghost" href="/standard-features">What Comes Standard <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="process-here">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Process</span>
            <h2 id="process-here">How the process works on a Millard County parcel</h2>
          </div>
          <div className="hh-band card plan-accent hh-band-slim">
            <div>
              <p>
                The Hardy Homes build-on-your-land process is the same everywhere. What shifts in Millard County is how
                much of the early work is about the ground.
              </p>
              <ul>
                <li><Check />Start with the parcel — location, access, and what you already know about water and power</li>
                <li><Check />Preliminary site review, weighted toward water rights, septic feasibility, and utility distance</li>
                <li><Check />Choose and configure a plan that suits the site and its orientation</li>
                <li><Check />Price the house scope and the site scope separately</li>
                <li><Check />Preconstruction: engineering if required, then permitting through the correct jurisdiction</li>
                <li><Check />Construction to the specifications agreed before contract</li>
              </ul>
            </div>
            <div className="hh-band-actions">
              <Link className="btn btn-primary" href="/build-on-your-land">Build On Your Land</Link>
              <Link className="btn btn-ghost" href="/contact">Start The Conversation</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="official-sources">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">Official Sources</span>
            <h2 id="official-sources">Where to verify all of this</h2>
            <p>
              These are the offices that actually decide. Nothing on this page replaces them, and they are worth calling
              early.
            </p>
          </div>
          <div className="hh-spec-sheet">
            <ul className="hh-spec-list">
              <li>
                <a href="https://millardcounty.gov/your-government/county-departments/building-inspection/" rel="nofollow noopener" target="_blank">
                  Millard County Building Inspection
                </a>{" "}
                — permits for unincorporated county land
              </li>
              <li>
                <a href="https://millardcounty.gov/your-government/county-departments/planning-and-zoning/" rel="nofollow noopener" target="_blank">
                  Millard County Planning &amp; Zoning
                </a>{" "}
                — zoning districts and conditional use
              </li>
              <li>
                <a href="https://www.delta.utah.gov/publicworks/page/building" rel="nofollow noopener" target="_blank">
                  Delta City Building
                </a>{" "}
                — permits inside Delta city limits
              </li>
              <li>
                <a href="https://fillmoreutah.gov/pages/new-residents" rel="nofollow noopener" target="_blank">
                  Fillmore City
                </a>{" "}
                — permits and municipal utilities in Fillmore
              </li>
              <li>
                <a href="https://centralutahhealth.gov/" rel="nofollow noopener" target="_blank">
                  Central Utah Public Health Department
                </a>{" "}
                — onsite wastewater and septic permits
              </li>
              <li>
                <a href="https://waterrights.utah.gov/wrinfo/policy/wrareas/area68.asp" rel="nofollow noopener" target="_blank">
                  Utah Division of Water Rights — Area 68
                </a>{" "}
                — Sevier Desert policy, the Delta area
              </li>
              <li>
                <a href="https://waterrights.utah.gov/wrinfo/policy/wrareas/area67.asp" rel="nofollow noopener" target="_blank">
                  Utah Division of Water Rights — Area 67
                </a>{" "}
                — Pahvant Valley policy, the Fillmore area
              </li>
              <li>
                <a href="https://www.rockymountainpower.net/" rel="nofollow noopener" target="_blank">
                  Rocky Mountain Power
                </a>{" "}
                — new service and line extensions
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="millard-faq">
        <div className="container">
          <div className="sec-head hh-head-left hardy-section-head-compact">
            <span className="eyebrow">FAQ</span>
            <h2 id="millard-faq">Building in Millard County — common questions</h2>
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

      <section className="section tight" aria-labelledby="millard-final-cta">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent hh-final-cta">
            <div>
              <span className="eyebrow">Millard County</span>
              <h2 id="millard-final-cta">Have a parcel out here? Let&apos;s look at it.</h2>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/contact">Start Your Build <Arrow /></Link>
              <Link className="btn btn-ghost btn-lg" href="/build-on-your-land">Build On Your Land <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
