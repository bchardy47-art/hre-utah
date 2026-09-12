import {
  DEFAULT_HARDY_HOMES_URL,
  HARDY_HOMES_CONTACT_EMAIL,
  HARDY_HOMES_PHONE,
  HARDY_HOMES_SERVICE_AREAS,
} from "@hardy-homes/shared/hardyHomesSite";

const siteUrl = process.env.NEXT_PUBLIC_HARDY_HOMES_URL || DEFAULT_HARDY_HOMES_URL;

/**
 * Renders a JSON-LD block. Every value passed in must be a verified fact that
 * already exists in the repository — do not add ratings, reviews, addresses,
 * prices, service areas, licence numbers or founding dates unless Brian has
 * supplied them.
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
 * Organization + WebSite, rendered once in the root layout.
 *
 * Verified sources:
 *  - legal name "BCHardy, LLC"  -> src/app/about/page.tsx, footers in both apps
 *  - phone / email              -> shared/hardyHomesSite.ts
 *  - "Utah R100 residential and small commercial contractor" -> src/app/about/page.tsx
 *
 * Hardy Homes is modelled as a service-area business: areaServed is declared
 * and no postal address is published, because none has been approved.
 *
 * Deliberately omitted until Brian confirms: street address, licence number,
 * founding date, social profiles, opening hours, reviews, ratings, prices.
 */
export function SiteStructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteUrl}/#organization`,
    name: "Hardy Homes",
    legalName: "BCHardy, LLC",
    url: siteUrl,
    telephone: HARDY_HOMES_PHONE,
    email: HARDY_HOMES_CONTACT_EMAIL,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/brand/hardy-homes-logo-header.png`,
    },
    image: `${siteUrl}/videos/hardy-homes-hero-poster.jpg`,
    description:
      "Hardy Homes is a Utah residential home builder offering pre-designed floor plans built on your land.",
    areaServed: HARDY_HOMES_SERVICE_AREAS.map((county) => ({
      "@type": "AdministrativeArea",
      name: `${county}, Utah`,
    })),
    knowsAbout: [
      "Residential home building",
      "Build on your land construction",
      "Pre-designed floor plans",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Hardy Homes",
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  return (
    <>
      <JsonLd data={organization} />
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
