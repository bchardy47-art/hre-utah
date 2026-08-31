import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import { hardyHomes } from "@/lib/hardyHomes";

export const metadata: Metadata = {
  title: "Hardy Real Estate — Don't Just Tour the House. Understand It.",
  description:
    "Utah real estate, home design, and handyman help from Brian Hardy — honest guidance backed by real-world construction judgment.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const lynx = hardyHomes[0];

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
            Don't Just<br />Tour the House.<br />
            <span className="accent">Understand It.</span>
          </h1>
          <p className="lead">
            Brian helps Utah clients buy, plan, and improve homes with real-world construction
            judgment.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 30 }}>
            <Link
              className="btn btn-primary btn-lg"
              href="/real-estate"
              data-hre-event="Work_With_Brian_Click"
              data-hre-location="hero"
            >
              Work With Brian <Arrow />
            </Link>
            <Link className="btn btn-ghost btn-lg" href="/real-estate#look">
              What I Look For <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="feat-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            <div className="card card-link feat">
              <div className="feat-ico">
                <svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="m9 15 2 2 4-4" /></svg>
              </div>
              <h3>Real Estate</h3>
              <p>Buy and sell with construction-minded guidance.</p>
              <Link className="learn" href="/real-estate">Learn More <Arrow /></Link>
            </div>
            <div className="card card-link feat">
              <div className="feat-ico">
                <svg viewBox="0 0 24 24"><path d="M4 20h16" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h4" /></svg>
              </div>
              <h3>Home Design</h3>
              <p>From sketch to practical residential plans.</p>
              <Link className="learn" href="/drafting" data-hre-event="Drafting_Inquiry_Click" data-hre-location="homepage">Explore Home Design <Arrow /></Link>
            </div>
            <div className="card card-link feat">
              <div className="feat-ico">
                <svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.3L3 18l3 3 6.4-6.3a4 4 0 0 0 5.3-5.4l-2.5 2.5-2.1-.5-.5-2.1Z" /></svg>
              </div>
              <h3>Handyman</h3>
              <p>Repairs, upgrades, and projects done right.</p>
              <Link className="learn" href="/handyman">Learn More <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight" aria-labelledby="hardy-homes-homepage">
        <div className="container">
          <div className="card hardy-home-feature plan-accent">
            <div>
              <span className="eyebrow">Hardy Homes</span>
              <h2 id="hardy-homes-homepage">Meet Hardy Homes.</h2>
              <p>
                A growing collection of efficient home designs built around usable space,
                thoughtful layouts, and real-world construction.
              </p>
            </div>
            <div className="hardy-home-feature-card">
              <div className="hardy-home-feature-media">
                <Image
                  src={lynx.images[0].src}
                  alt={lynx.images[0].alt}
                  fill
                  sizes="(max-width: 1080px) 100vw, 24vw"
                  className="hardy-gallery-image"
                  style={{ objectFit: "contain", objectPosition: "center bottom" }}
                />
              </div>
              <span className="label">THE LYNX</span>
              <h3>{lynx.squareFeet} SQ FT</h3>
              <div className="hardy-home-feature-specs">
                <span>2 BED</span>
                <span>2.5 BATH</span>
              </div>
              <Link className="btn btn-primary" href="/hardy-homes#lynx">
                Explore The Lynx <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}>
            <span className="eyebrow">Three Ways to Work With Brian</span>
            <h2>Real Estate, Home Design, and Handyman.</h2>
          </div>
          <div className="trio">
            <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                <h3>Real Estate</h3>
                <div className="duo-tag">Smart moves. Strong results.</div>
                <p className="lead" style={{ fontSize: 15 }}>Most agents don't see what's behind the walls. I do.</p>
                <div className="duo-actions">
                  <Link className="btn btn-primary" href="/real-estate" data-hre-event="Buyer_Inquiry_Click" data-hre-location="homepage">Buying <Arrow /></Link>
                  <Link className="btn btn-ghost" href="/real-estate#sellers" data-hre-event="Seller_Inquiry_Click" data-hre-location="homepage">Selling <Arrow /></Link>
                </div>
              </div>
              <div className="shot scene scene--dusk2" style={{ minHeight: 200 }}>
                <img className="slot" src="/images/hero-re.jpg" alt="Home exterior" />
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                <h3>Home Design</h3>
                <div className="duo-tag">Practical plans. Clear next steps.</div>
                <p className="lead" style={{ fontSize: 15 }}>Bring a sketch, inspiration, or an original idea, and I’ll turn it into a buildable direction.</p>
                <div className="duo-actions">
                  <Link className="btn btn-primary" href="/drafting" data-hre-event="Drafting_Inquiry_Click" data-hre-location="homepage">Explore Home Design <Arrow /></Link>
                  <Link className="btn btn-ghost" href="/drafting#process">See Process <Arrow /></Link>
                </div>
              </div>
              <div className="shot scene scene--dusk" style={{ minHeight: 200 }}>
                <img className="slot" src="/images/hero-home.jpg" alt="Utah home at dusk" />
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                <h3>Handyman</h3>
                <div className="duo-tag">Done right. Done on time.</div>
                <p className="lead" style={{ fontSize: 15 }}>Get practical help with repairs, updates, and home projects that need careful work.</p>
                <div className="duo-actions">
                  <Link className="btn btn-primary" href="/contact#message" data-hre-event="Request_Service_Click" data-hre-location="homepage">Request Service <Arrow /></Link>
                  <Link className="btn btn-ghost" href="/handyman">Learn More <Arrow /></Link>
                </div>
              </div>
              <div className="shot scene scene--shop" style={{ minHeight: 200 }}>
                <img className="slot" src="/images/tools.jpg" alt="Tool belt" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt" id="advantage">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">The Hardy Advantage</span>
            <h2>More Than a Realtor.<br />A Builder's Perspective.</h2>
          </div>
          <div className="colrow" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <div className="col">
              <div className="col-ico circ"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" /><path d="M12 15.5h.01M9.4 9.2a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 2.2" /></svg></span></div>
              <h3>Straight Answers</h3>
              <p>I'll tell you what matters, what doesn't, and where I'd be cautious.</p>
            </div>
            <div className="col">
              <div className="col-ico circ"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg></span></div>
              <h3>Smarter Decisions</h3>
              <p>Better information leads to better negotiations and stronger long-term outcomes.</p>
            </div>
            <div className="col">
              <div className="col-ico circ"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="12" cy="12" r="9" /><path d="M12 7v10M14.5 9.3c-.5-1-1.5-1.3-2.5-1.3-1.3 0-2.3.7-2.3 1.9 0 2.6 5 1.4 5 4.1 0 1.2-1 2-2.5 2-1 0-2-.4-2.5-1.3" /></svg></span></div>
              <h3>Protect Your Investment</h3>
              <p>Strategic repairs and maintenance that improve value and help prevent future problems.</p>
            </div>
            <div className="col">
              <div className="col-ico circ"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h6" /></svg></span></div>
              <h3>One Trusted Resource</h3>
              <p>Real Estate, Home Design, and Handyman help can stay aligned from the first conversation forward.</p>
            </div>
          </div>
        </div>
      </section>

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

      <section className="section tight">
        <div className="container">
          <CtaBand />
        </div>
      </section>
    </>
  );
}
