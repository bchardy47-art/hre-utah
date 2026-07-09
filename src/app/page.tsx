import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Hardy Real Estate — Don't Just Tour the House. Understand It.",
  description:
    "Utah realtor Brian Hardy brings real-world construction judgment to buying, selling, and handyman work — honest guidance for confident moves.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero" data-screen-label="Home">
        <div className="scene scene--dusk">
          <img className="slot" src="/images/hero-home.jpg" alt="Utah home at dusk" />
        </div>
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <h1 className="h-xl">
            Don't Just<br />Tour the House.<br />
            <span className="accent">Understand It.</span>
          </h1>
          <p className="lead">
            Brian is a Utah realtor with real-world construction judgment — helping buyers and
            sellers make confident moves.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 30 }}>
            <Link className="btn btn-primary btn-lg" href="/real-estate">
              Work With Brian <Arrow />
            </Link>
            <Link className="btn btn-ghost btn-lg" href="/real-estate#look">
              What I Look For <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* FOUR CARDS */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="feat-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <div className="card card-link feat">
              <div className="feat-ico">
                <svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="m9 15 2 2 4-4" /></svg>
              </div>
              <h3>Buy With Confidence</h3>
              <p>See issues others might miss.</p>
              <Link className="learn" href="/real-estate">Learn More <Arrow /></Link>
            </div>
            <div className="card card-link feat">
              <div className="feat-ico">
                <svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1" /><path d="m9 13 2.5 2.5L16 10" /></svg>
              </div>
              <h3>Sell With Strategy</h3>
              <p>Prioritize repairs that pay off.</p>
              <Link className="learn" href="/real-estate#sellers">Learn More <Arrow /></Link>
            </div>
            <div className="card card-link feat">
              <div className="feat-ico">
                <svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.3L3 18l3 3 6.4-6.3a4 4 0 0 0 5.3-5.4l-2.5 2.5-2.1-.5-.5-2.1Z" /></svg>
              </div>
              <h3>Handyman Services</h3>
              <p>Quality work. Clear scope. Fair price.</p>
              <Link className="learn" href="/handyman">Learn More <Arrow /></Link>
            </div>
            <div className="card card-link feat">
              <div className="feat-ico">
                <svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" /><path d="M12 15.5h.01M9.4 9.2a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 2.2" /></svg>
              </div>
              <h3>Honest Answers</h3>
              <p>Straight talk. Fast communication.</p>
              <Link className="learn" href="/about">Learn More <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* DUO SPLIT */}
      <section className="section tight">
        <div className="container">
          <div className="duo">
            <div className="card duo-card">
              <div className="duo-body">
                <h3>Real Estate</h3>
                <div className="duo-tag">Smart moves. Strong results.</div>
                <p>Guidance built on market knowledge and construction experience. From first showing to final signature.</p>
                <div className="duo-actions">
                  <Link className="btn btn-primary" href="/real-estate">Buyers <Arrow /></Link>
                  <Link className="btn btn-ghost" href="/real-estate#sellers">Sellers <Arrow /></Link>
                </div>
              </div>
              <div className="shot scene scene--dusk2">
                <img className="slot" src="/images/hero-re.jpg" alt="Home exterior" />
              </div>
            </div>
            <div className="card duo-card">
              <div className="duo-body">
                <h3>Handyman</h3>
                <div className="duo-tag">Done right. Done on time.</div>
                <p>Small jobs done right. Repairs, updates, and improvements that protect and add value to your home.</p>
                <div className="duo-actions">
                  <Link className="btn btn-primary" href="/handyman#request">Request Service <Arrow /></Link>
                  <Link className="btn btn-ghost" href="/handyman">Learn More <Arrow /></Link>
                </div>
              </div>
              <div className="shot scene scene--shop">
                <img className="slot" src="/images/tools.jpg" alt="Tool belt" />
              </div>
            </div>
            <div className="duo-or">OR</div>
          </div>
        </div>
      </section>

      {/* ADVANTAGE */}
      <section className="section alt" id="advantage">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">The Hardy Advantage</span>
            <h2>More Than a Realtor.<br />A Builder's Perspective.</h2>
          </div>
          <div className="colrow" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <div className="col">
              <div className="col-ico circ"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg></span></div>
              <h3>See What Others Miss</h3>
              <p>Construction background means I spot issues, red flags, and hidden costs before you commit.</p>
            </div>
            <div className="col">
              <div className="col-ico circ"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg></span></div>
              <h3>Smarter Decisions</h3>
              <p>Better information leads to better negotiations and stronger long-term outcomes.</p>
            </div>
            <div className="col">
              <div className="col-ico circ"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="12" cy="12" r="9" /><path d="M12 7v10M14.5 9.3c-.5-1-1.5-1.3-2.5-1.3-1.3 0-2.3.7-2.3 1.9 0 2.6 5 1.4 5 4.1 0 1.2-1 2-2.5 2-1 0-2-.4-2.5-1.3" /></svg></span></div>
              <h3>Protect Your Investment</h3>
              <p>Strategic repairs and maintenance that improve value and prevent future problems.</p>
            </div>
            <div className="col">
              <div className="col-ico circ"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="m21 3 1 11h-2" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /><path d="M3 4h8" /></svg></span></div>
              <h3>One Trusted Resource</h3>
              <p>Real estate and handyman services under one roof. Communication is clear. Results are consistent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section" id="reviews">
        <div className="container">
          <div className="sec-head"><span className="eyebrow">What Clients Say</span></div>
          <div className="review-grid">
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"Brian caught structural issues we never would have noticed. His advice saved us thousands and gave us total peace of mind."</p>
              <cite>— J. Thompson, South Jordan</cite>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"Our home sold fast and for more than we expected. Brian's strategy and recommendations made all the difference."</p>
              <cite>— M. Reynolds, West Jordan</cite>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"He fixed what needed fixing, showed up when he said he would, and the work is top quality. Hard to find that these days."</p>
              <cite>— D. Martinez, Herriman</cite>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="section alt">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">Proudly Serving Utah</span>
            <h2>Local Expertise. Real Results.</h2>
          </div>
          <div className="pill-row">
            <span className="pill">Salt Lake County</span>
            <span className="pill">Utah County</span>
            <span className="pill">Davis County</span>
            <span className="pill">Weber County</span>
            <span className="pill">Summit County</span>
            <span className="pill">Wasatch County</span>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section tight">
        <div className="container">
          <CtaBand />
        </div>
      </section>
    </>
  );
}
