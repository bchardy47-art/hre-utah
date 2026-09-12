import type { Metadata } from "next";
import HardyHomesContactForm from "@/components/HardyHomesContactForm";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { HARDY_HOMES_PHONE, HARDY_HOMES_TEL } from "@hardy-homes/shared/hardyHomesSite";

export const metadata: Metadata = {
  title: { absolute: "Contact Hardy Homes | Utah Home Builder" },
  description:
    "Talk to Hardy Homes about a floor plan, a lot you own or are considering, or what building on your land in Utah involves. Call (801) 380-0445.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Hardy Homes",
    description:
      "Talk to Hardy Homes about a floor plan, a lot you own or are considering, or what building on your land in Utah involves. Call (801) 380-0445.",
    url: "/contact",
    siteName: "Hardy Homes",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ContactPage() {
  return (
    <section className="section hardy-collection-page">
      <div className="container" style={{ maxWidth: 1100 }}>
        <div className="sec-head hardy-collection-page-head hh-head-left">
          <span className="eyebrow">Contact</span>
          <h1 className="h-lg">Start your Hardy Homes conversation.</h1>
          <p>Tell us about the property, the plan you are considering, and what stage you are in.</p>
          <p className="hh-service-area">
            Serving Millard County, Utah County, and Salt Lake County. Call or text{" "}
            <a href={`tel:${HARDY_HOMES_TEL}`}>{HARDY_HOMES_PHONE}</a>.
          </p>
        </div>
        <div className="hh-contact-split">
          <div className="card plan-accent" style={{ padding: 32 }}>
            <HardyHomesContactForm />
          </div>
          <div className="card hh-contact-side">
            <span className="eyebrow">What to share</span>
            <h2>Help us understand the project.</h2>
            <ul>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m5 13 4 4L19 7" /></svg>The plan you are considering</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m5 13 4 4L19 7" /></svg>Whether you already own the property</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m5 13 4 4L19 7" /></svg>Your general timeline</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m5 13 4 4L19 7" /></svg>Any site or layout questions you already have</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
