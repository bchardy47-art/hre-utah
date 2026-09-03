import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import HardyHomeCard from "@/components/HardyHomeCard";
import { hardyHomes } from "@/lib/hardyHomes";

export const metadata: Metadata = {
  title: "Hardy Homes | Home Builder, Design & Real Estate in Utah",
  description:
    "Hardy Homes by BCHardy, LLC combines residential homebuilding, home design, real estate, and property improvement services in Utah.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const quickLinks = [
  {
    title: "Hardy Homes",
    copy: "Browse our home plans",
    href: "/hardy-homes",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="M9 20v-5h6v5" /></svg>
    ),
  },
  {
    title: "Search Utah Homes",
    copy: "View current Utah listings",
    href: "https://hardyhomes-utah.com",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /><path d="M11 8.5v5M8.5 11H13.5" /></svg>
    ),
  },
  {
    title: "Home Design",
    copy: "Custom residential design and drafting",
    href: "/drafting",
    event: "Drafting_Inquiry_Click",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M4 20h16" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h4" /></svg>
    ),
  },
  {
    title: "Real Estate",
    copy: "Buying and selling in Utah",
    href: "/real-estate",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="m9 15 2 2 4-4" /></svg>
    ),
  },
  {
    title: "Handyman Services",
    copy: "Repairs, improvements, and projects",
    href: "/handyman",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.3L3 18l3 3 6.4-6.3a4 4 0 0 0 5.3-5.4l-2.5 2.5-2.1-.5-.5-2.1Z" /></svg>
    ),
  },
  {
    title: "Contact Brian",
    copy: "Start a conversation",
    href: "/contact",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" /></svg>
    ),
  },
];

const serviceCategories = [
  {
    title: "Build",
    copy: "Build a Hardy Home or start planning a residential project.",
    href: "/hardy-homes",
  },
  {
    title: "Design",
    copy: "Residential home design and drafting in Chief Architect.",
    href: "/drafting",
    event: "Drafting_Inquiry_Click",
  },
  {
    title: "Buy or Sell",
    copy: "Real estate representation with a construction-minded perspective.",
    href: "/real-estate",
  },
  {
    title: "Improve",
    copy: "Handyman, repair, and improvement projects.",
    href: "/handyman",
    event: "Request_Service_Click",
  },
];

const testimonials = [
  {
    quote:
      "Brian caught structural issues we never would have noticed. His advice saved us thousands and gave us total peace of mind.",
    cite: "— J. Thompson, South Jordan",
  },
  {
    quote:
      "Our home sold fast and for more than we expected. Brian's strategy and recommendations made all the difference.",
    cite: "— M. Reynolds, West Jordan",
  },
  {
    quote:
      "He fixed what needed fixing, showed up when he said he would, and the work is top quality. Hard to find that these days.",
    cite: "— D. Martinez, Herriman",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero" data-screen-label="Home">
        <div className="scene scene--dusk">
          <img className="slot" src="/images/hero-home.jpg" alt="Utah home at dusk" />
        </div>
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <h1 className="h-xl">
            FIND IT.<br />DESIGN IT.<br />
            <span className="accent">BUILD IT.</span>
          </h1>
          <p className="lead hero-home-lead">
            From finding the right property to designing and building the home, Brian Hardy brings
            real estate, residential design, and construction together under one roof.
          </p>
          <div className="homepage-hero-actions">
            <Link className="btn btn-primary btn-lg" href="/hardy-homes">
              Explore Hardy Homes <Arrow />
            </Link>
            <Link className="btn btn-ghost btn-lg" href="/contact">
              Talk With Brian <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 56 }} aria-labelledby="homepage-quick-links">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}>
            <span className="eyebrow">Start Here</span>
            <h2 id="homepage-quick-links">What are you looking for?</h2>
          </div>
          <div className="feat-grid homepage-quick-grid" role="list">
            {quickLinks.map((item) => {
              const content = (
                <>
                  <div className="feat-ico">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <span className="learn">Explore <Arrow /></span>
                </>
              );

              if (item.external) {
                return (
                  <a
                    key={item.title}
                    className="card card-link feat homepage-quick-card"
                    href={item.href}
                    target="_blank"
                    rel="noopener"
                    role="listitem"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={item.title}
                  className="card card-link feat homepage-quick-card"
                  href={item.href}
                  role="listitem"
                  data-hre-event={item.event}
                  data-hre-location={item.event ? "homepage" : undefined}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="homepage-hardy-homes">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}>
            <span className="eyebrow">Hardy Homes</span>
            <h2 id="homepage-hardy-homes">Build a Hardy Home</h2>
            <p>Efficient plans. Thoughtful layouts. Built with real construction in mind.</p>
          </div>
          <div className="hardy-plan-card-grid homepage-hardy-grid">
            {hardyHomes.map((home) => (
              <HardyHomeCard key={home.slug} home={home} />
            ))}
          </div>
          <div className="homepage-section-cta">
            <Link className="btn btn-ghost btn-lg" href="/hardy-homes">
              View All Hardy Homes <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="section alt" aria-labelledby="homepage-services">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}>
            <span className="eyebrow">How I Can Help</span>
            <h2 id="homepage-services">Builder-first guidance across the process.</h2>
          </div>
          <div className="feat-grid homepage-services-grid">
            {serviceCategories.map((item) => (
              <div key={item.title} className="card feat homepage-service-card">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <Link
                  className="learn"
                  href={item.href}
                  data-hre-event={item.event}
                  data-hre-location={item.event ? "homepage" : undefined}
                >
                  Learn More <Arrow />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="advantage">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">Why Brian</span>
            <h2>One person. More of the process.</h2>
            <p>
              Brian combines hands-on construction experience, residential design, real estate,
              and homebuilding so clients can make better decisions from property selection through
              construction.
            </p>
          </div>
          <div className="colrow homepage-why-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <div className="col">
              <div className="col-ico circ"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M3 20h18" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h6" /></svg></span></div>
              <h3>Builder's Perspective</h3>
              <p>Construction-minded thinking from early property decisions through finished space.</p>
            </div>
            <div className="col">
              <div className="col-ico circ"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M4 20h16" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h4" /></svg></span></div>
              <h3>Residential Design</h3>
              <p>Layouts are shaped with real construction sequencing, function, and livability in mind.</p>
            </div>
            <div className="col">
              <div className="col-ico circ"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="m9 15 2 2 4-4" /></svg></span></div>
              <h3>Real Estate Insight</h3>
              <p>Buying and selling advice backed by practical evaluation instead of surface impressions.</p>
            </div>
            <div className="col">
              <div className="col-ico circ"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.3L3 18l3 3 6.4-6.3a4 4 0 0 0 5.3-5.4l-2.5 2.5-2.1-.5-.5-2.1Z" /></svg></span></div>
              <h3>Practical Improvements</h3>
              <p>Repair and upgrade recommendations that support value, function, and long-term ownership.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" id="reviews">
        <div className="container">
          <div className="sec-head"><span className="eyebrow">What Clients Say</span></div>
          <div className="review-grid">
            {testimonials.map((item) => (
              <div key={item.cite} className="review-card">
                <div className="stars">★★★★★</div>
                <p>{`"${item.quote}"`}</p>
                <cite>{item.cite}</cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="card hardy-catalog-cta plan-accent homepage-final-cta">
            <div>
              <span className="eyebrow">Next Step</span>
              <h2>Ready to build, buy, design, or improve?</h2>
            </div>
            <div className="hardy-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/contact">
                Talk With Brian <Arrow />
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/hardy-homes">
                Explore Hardy Homes <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <CtaBand
            pre="Need help figuring out the "
            accent="right next step"
            post="?"
            sub="Text or call Brian to talk through your property, plan, build, or project goals."
            strip="Builder-First Guidance|Home Design|Real Estate|Hardy Homes|Handyman"
          />
        </div>
      </section>
    </>
  );
}
