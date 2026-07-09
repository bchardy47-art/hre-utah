import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "About — Real Estate Guidance. Construction Judgment. | Hardy Real Estate",
  description:
    "Meet Hardy Real Estate — licensed Utah realtor and seasoned handyman Brian Hardy, pairing construction experience with proven real estate strategy.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function About() {
  return (
    <>
      {/* HERO */}
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
            Hardy Real Estate was built on the belief that better results come from seeing the full
            picture. We combine real-world construction experience with proven real estate strategy
            to help Utah buyers and sellers make smarter decisions — and stronger moves.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="card story-card">
            <div className="story-text">
              <span className="eyebrow">Our Story</span>
              <h3>Built Different.<br />Built to Help.</h3>
              <p>Hardy Real Estate was founded by Brian Hardy — a licensed realtor and seasoned handyman with years of hands-on construction experience.</p>
              <p>We've seen what others miss. We know what adds value, what creates problems, and how to navigate deals with confidence.</p>
              <p style={{ marginBottom: 0 }}>That perspective drives everything we do.</p>
            </div>
            <div className="story-brand">
              <img
                src="/images/hre-logo.png"
                alt="HRE — Hardy Real Estate Handyman Services"
                loading="lazy"
                decoding="async"
                style={{ height: 150, width: "auto", display: "block" }}
              />
              <div className="brand-tag">Real Experience.<br />Real Guidance.<br />Real Results.</div>
            </div>
            <div className="shot scene scene--interior">
              <img className="slot" src="/images/fireplace.jpg" alt="Warm home interior" />
            </div>
          </div>
        </div>
      </section>

      {/* THREE CARDS */}
      <section className="section tight" id="why">
        <div className="container">
          <div className="trio">
            <div className="card feat">
              <div className="feat-ico"><svg viewBox="0 0 24 24"><path d="M4 13a8 8 0 0 1 16 0" /><path d="M2 13h20" /><path d="M11 4.5 6.5 8" /><path d="M11 4.5V8" /></svg></div>
              <h3>Construction Background</h3>
              <p>Years of real-world building and remodeling experience. We know how homes are built — and where issues hide.</p>
              <Link className="learn" href="/real-estate">Learn More <Arrow /></Link>
            </div>
            <div className="card feat">
              <div className="feat-ico"><svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg></div>
              <h3>Realtor Experience</h3>
              <p>Licensed, local, and committed to your goals. We bring market knowledge, negotiation skill, and a clear strategy.</p>
              <Link className="learn" href="/real-estate">Learn More <Arrow /></Link>
            </div>
            <div className="card feat">
              <div className="feat-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg></div>
              <h3>Why This Approach Matters</h3>
              <p>We evaluate homes with a builder's eye and a realtor's mindset — helping you avoid mistakes and maximize value.</p>
              <Link className="learn" href="/handyman">Learn More <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES + CREDENTIALS */}
      <section className="section tight">
        <div className="container">
          <div className="card princred">
            <div>
              <h4>The Hardy Principles</h4>
              <ul className="princ-list">
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>We put your goals first.</li>
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>We communicate clearly and consistently.</li>
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>We evaluate honestly and thoroughly.</li>
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>We offer solutions, not sales pressure.</li>
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>We protect your investment.</li>
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>We stand behind our work and our word.</li>
              </ul>
            </div>
            <div>
              <h4>Credentials</h4>
              <div className="cred-grid">
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7" /></svg></span><span>Utah Licensed Realtor</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><path d="m14 6 4-4 2 2-4 4M6 14l-4 4 2 2 4-4M14 6l-8 8M18 18l-3-3M6 6l3 3" /></svg></span><span>Construction &amp; Remodeling Experience</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="m8 12 2.5 2.5L16 9" /></svg></span><span>Property Evaluation Expertise</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M8 7h8M8 11h8M8 15h5" /></svg></span><span>Contract &amp; Negotiation Specialist</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><path d="M4 20c0-3 2.2-5 5-5s5 2 5 5" /><circle cx="17" cy="9" r="2.3" /><path d="M15 20c0-2.5 1.5-4 3.5-4" /></svg></span><span>Trusted by Buyers &amp; Sellers</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg></span><span>Local. Independent. Results-Driven.</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCAL KNOWLEDGE */}
      <section className="section alt">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}><h2>Local Knowledge. Real Advantage.</h2></div>
          <div className="colrow" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="m2 18 5-8 3 4 4-7 3 5 3-3" /><path d="M2 18h20" /></svg></div>
              <h3>Market Insight</h3>
              <p>Deep understanding of Utah markets and neighborhoods.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg></div>
              <h3>Area Expertise</h3>
              <p>From Salt Lake to the mountain valleys — we know the local landscape.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg></div>
              <h3>Strong Network</h3>
              <p>Trusted relationships with lenders, inspectors, contractors, and service pros.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20h-2M2 20h20" strokeWidth={1.6} /></svg></div>
              <h3>Better Outcomes</h3>
              <p>Local knowledge leads to better decisions and stronger results for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section">
        <div className="container">
          <div className="sec-head"><span className="eyebrow">What Clients Say</span></div>
          <div className="review-grid">
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"Brian's construction background gave us confidence others couldn't. He caught issues we never would have, and his advice saved us thousands."</p>
              <cite>— J. Thompson, South Jordan</cite>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"We sold fast and for more than we expected. Brian's strategy and recommendations made all the difference. He's the total package."</p>
              <cite>— M. Reynolds, West Jordan</cite>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"Honest, knowledgeable, and easy to trust. He fixed what needed fixing, showed up when he said he would, and delivered exactly what he promised."</p>
              <cite>— D. Martinez, Herriman</cite>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section tight">
        <div className="container">
          <CtaBand
            pre="Let's build a "
            accent="smarter"
            post=" plan."
            sub="Whether you're buying, selling, or improving your home, we're here to guide you every step of the way."
            noicons
          />
        </div>
      </section>
    </>
  );
}
