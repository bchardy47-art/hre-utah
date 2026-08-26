import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "About — Real Estate Guidance. Construction Judgment. | Hardy Real Estate",
  description:
    "Meet Brian Hardy of Hardy Real Estate — a licensed Utah realtor, home-design drafter, and seasoned handyman with practical construction experience.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function About() {
  return (
    <>
      <section className="hero hero--page" data-screen-label="About">
        <div className="scene scene--dusk">
          <img className="slot" src="/images/hero-about.jpg" alt="Utah home" />
        </div>
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <h1 className="h-xl">
            Real Estate<br />Guidance.<br />
            <span className="accent">Construction Judgment.</span>
          </h1>
          <p className="lead">
            I built Hardy Real Estate around one simple idea: better decisions come from seeing the
            full picture. I bring real-world construction experience, local market knowledge, and a
            practical approach to helping Utah clients buy, design, and improve homes.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="card story-card">
            <div className="story-text">
              <span className="eyebrow">Brian Hardy</span>
              <h3>Built Different.<br />Built to Help.</h3>
              <p>I'm Brian Hardy — a licensed realtor and seasoned handyman with years of hands-on construction experience.</p>
              <p>I look for what adds value, what creates problems, and what helps a home work better in real life.</p>
              <p style={{ marginBottom: 0 }}>That perspective shapes how I guide clients through real estate, home design, and hands-on home projects.</p>
            </div>
            <div className="story-brand" style={{ padding: 0 }}>
              <Image
                src="/brian-hardy.jpg"
                alt="Brian Hardy"
                width={1200}
                height={1500}
                sizes="(max-width: 980px) 100vw, 28vw"
                className="about-portrait"
                priority={false}
              />
            </div>
            <div className="shot scene scene--interior">
              <img className="slot" src="/images/fireplace.jpg" alt="Warm home interior" />
            </div>
          </div>
        </div>
      </section>

      <section className="section tight" id="why">
        <div className="container">
          <div className="trio">
            <div className="card feat">
              <div className="feat-ico"><svg viewBox="0 0 24 24"><path d="M4 13a8 8 0 0 1 16 0" /><path d="M2 13h20" /><path d="M11 4.5 6.5 8" /><path d="M11 4.5V8" /></svg></div>
              <h3>Construction Background</h3>
              <p>Years of real-world building and remodeling experience help me see how homes are put together — and where issues hide.</p>
              <Link className="learn" href="/real-estate">Learn More <Arrow /></Link>
            </div>
            <div className="card feat">
              <div className="feat-ico"><svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg></div>
              <h3>Realtor Experience</h3>
              <p>Licensed, local, and focused on your goals. I bring market knowledge, negotiation skill, and clear strategy.</p>
              <Link className="learn" href="/real-estate">Learn More <Arrow /></Link>
            </div>
            <div className="card feat">
              <div className="feat-ico"><svg viewBox="0 0 24 24"><path d="M4 20h16" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h4" /></svg></div>
              <h3>Design &amp; Drafting</h3>
              <p>I create practical residential plans in Chief Architect for homes, additions, and major remodels.</p>
              <Link className="learn" href="/drafting">Learn More <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="card princred">
            <div>
              <h4>The Hardy Principles</h4>
              <ul className="princ-list">
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>I put your goals first.</li>
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>I communicate clearly and keep the process straightforward.</li>
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>I evaluate honestly and thoroughly.</li>
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>I protect your investment with practical recommendations.</li>
              </ul>
            </div>
            <div>
              <h4>Credentials</h4>
              <div className="cred-grid">
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7" /></svg></span><span>Utah Licensed Realtor</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><path d="m14 6 4-4 2 2-4 4M6 14l-4 4 2 2 4-4M14 6l-8 8M18 18l-3-3M6 6l3 3" /></svg></span><span>Construction &amp; Remodeling Experience</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="m8 12 2.5 2.5L16 9" /></svg></span><span>Property Evaluation Expertise</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M8 7h8M8 11h8M8 15h5" /></svg></span><span>Contract &amp; Negotiation Specialist</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><path d="M4 20h16" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h4" /></svg></span><span>Chief Architect Drafting</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg></span><span>Local. Independent. Results-Driven.</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}><h2>Local Knowledge. Real Advantage.</h2></div>
          <div className="colrow" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="m2 18 5-8 3 4 4-7 3 5 3-3" /><path d="M2 18h20" /></svg></div>
              <h3>Market Insight</h3>
              <p>Deep understanding of Utah markets and neighborhoods.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg></div>
              <h3>Strong Network</h3>
              <p>Trusted relationships with lenders, inspectors, contractors, and service pros.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <CtaBand
            pre="Let's build a "
            accent="smarter"
            post=" plan."
            sub="Whether you're buying, planning, or improving a home, I can help you figure out the right next step."
            noicons
          />
        </div>
      </section>
    </>
  );
}
