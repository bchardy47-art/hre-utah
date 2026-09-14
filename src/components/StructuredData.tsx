import { DEFAULT_HARDY_HOMES_URL } from "@/lib/hardyHomesSite";

const siteUrl = "https://hre-utah.com";

/**
 * Renders a JSON-LD block. Every value here must already be a verified fact
 * that exists elsewhere in the repo (Contact page, Footer, About page) — do
 * not add ratings, reviews, a street address, a licence number, or a founding
 * date unless Brian has explicitly supplied and approved it.
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * One entity graph for hre-utah.com: the Hardy Real Estate business, the
 * WebSite, and Brian Hardy as a Person, linked with stable @id values.
 *
 * Verified sources:
 *  - legal name "BCHardy, LLC"                 -> src/app/about/page.tsx
 *  - phone / email                              -> src/components/Footer.tsx, src/app/contact/page.tsx
 *  - "Utah REALTOR®"                            -> src/app/about/page.tsx, src/app/contact/page.tsx
 *  - "Utah R100 residential & small commercial
 *     contractor" (held by BCHardy, LLC)        -> src/app/about/page.tsx
 *  - brokerage "Boardwalk Realty & Property
 *     Management"                               -> src/components/Footer.tsx, src/app/contact/page.tsx
 *  - services: real estate, residential design/
 *     drafting, handyman, homebuilding referral
 *     to Hardy Homes                            -> src/app/page.tsx, src/components/Nav.tsx
 *
 * Deliberately omitted until Brian confirms: a street address (the Contact
 * page names "Saratoga Springs, UT" but that has not been confirmed as a
 * publishable business address), licence number, founding date, reviews,
 * ratings, prices, and social profiles (the footer's Instagram/Facebook
 * links are still placeholders).
 *
 * No postal address is published, so this is modeled as a service-area
 * business: areaServed is declared, address is not.
 */
export function SiteStructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "HomeAndConstructionBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: "Hardy Real Estate",
    legalName: "BCHardy, LLC",
    url: siteUrl,
    telephone: "+18013800445",
    email: "brian@hre-utah.com",
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/images/hre-logo.png`,
    },
    image: `${siteUrl}/images/hre-logo.png`,
    description:
      "Hardy Real Estate is Brian Hardy's Utah real estate, home design, and handyman practice, and the home of the Hardy Homes build-on-your-land brand.",
    areaServed: {
      "@type": "State",
      name: "Utah",
    },
    employee: { "@id": `${siteUrl}/#brian-hardy` },
    founder: { "@id": `${siteUrl}/#brian-hardy` },
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Real Estate Buyer & Seller Representation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Residential Design & Drafting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Handyman & Home Improvement Services" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Build-On-Your-Land Homebuilding", url: DEFAULT_HARDY_HOMES_URL } },
    ],
  };

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#brian-hardy`,
    name: "Brian Hardy",
    url: `${siteUrl}/about`,
    jobTitle: "Utah REALTOR®",
    telephone: "+18013800445",
    email: "brian@hre-utah.com",
    image: `${siteUrl}/brian-hardy.jpg`,
    worksFor: { "@id": `${siteUrl}/#organization` },
    affiliation: {
      "@type": "Organization",
      name: "Boardwalk Realty & Property Management",
    },
    knowsAbout: [
      "Utah residential real estate",
      "Residential design and drafting",
      "Home construction and remodeling",
      "Handyman and home improvement services",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Hardy Real Estate",
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={person} />
      <JsonLd data={website} />
    </>
  );
}

export type Crumb = { name: string; path: string };

/** BreadcrumbList for nested pages. `path` values are site-relative. */
export function BreadcrumbStructuredData({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${siteUrl}${crumb.path === "/" ? "" : crumb.path}`,
        })),
      }}
    />
  );
}
