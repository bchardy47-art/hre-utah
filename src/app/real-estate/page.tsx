import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Real Estate — Smart Real Estate. Real-World Judgment. | Hardy Real Estate",
  description:
    "Buy or sell in Utah with a realtor who evaluates homes like a builder — spotting hidden issues and shaping smart strategy. Work with Brian Hardy.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function RealEstate() {
  return (
    <>
      {/* HERO */}
      <section className="hero hero--page" data-screen-label="Real Estate">
        <div className="scene scene--dusk">
          <img className="slot" src="/images/hero-re.jpg" alt="Utah home" />
        </div>
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <h1 className="h-xl">
            Smart Real Estate.<br />Real-World Judgment.<br />
            <span className="accent">Buy or Sell With Confidence.</span>
          </h1>
          <p className="lead">
            Expert guidance grounded in construction knowledge. Whether you're buying your next
            home or selling your current one, I'll help you make the right move.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 30 }}>
            <a className="btn btn-primary btn-lg" href="https://hardyhomes-utah.com" target="_blank" rel="noopener">
              Search Homes <Arrow />
            </a>
            <Link className="btn btn-ghost btn-lg" href="/contact">Work With Brian <Arrow /></Link>
            <Link className="btn btn-ghost btn-lg" href="#look">What I Look For <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* BUYER / SELLER */}
      <section className="section" style={{ paddingTop: 56 }} id="sellers">
        <div className="container">
          <div className="big2">
            <div className="card bigcard">
              <div className="big-ico"><svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="m9 15 2 2 4-4" /></svg></div>
              <div>
                <h3>Buyer Guidance</h3>
                <div className="big-tag">Smart moves. Strong results.</div>
                <p>I help buyers evaluate homes like a builder. From structure to systems, I'll help uncover what matters most — so you can buy with clarity and confidence.</p>
                <Link className="learn" href="/contact">Learn More <Arrow /></Link>
              </div>
            </div>
            <div className="card bigcard">
              <div className="big-ico"><svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1" /><path d="M9 10h1M9 14h1" /><path d="m13 9 2.5 2.5M15.5 9 13 11.5" /></svg></div>
              <div>
                <h3>Seller Strategy</h3>
                <div className="big-tag">Prepare smart. Sell strong.</div>
                <p>I help sellers position their home for success with strategic improvements and honest insight that attract serious buyers.</p>
                <Link className="learn" href="/contact">Learn More <Arrow /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT BRIAN LOOKS FOR */}
      <section className="section alt" id="look">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}><h2>What Brian Looks For in Homes</h2></div>
          <div className="colrow" style={{ gridTemplateColumns: "repeat(7,1fr)" }}>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="M10 12h4M12 10v4" strokeWidth={1.8} /></svg></div>
              <h3>Structural Integrity</h3>
              <p>Solid bones. Built to last.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M3 13 12 5l9 8" /><path d="M6 12h12" /><path d="M9 11h6" strokeWidth={1.2} /></svg></div>
              <h3>Roofing &amp; Exterior</h3>
              <p>Protection from the elements.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2" /><path d="M12 3v2.5M12 18.5V21M4.2 7l2.2 1.3M17.6 15.7l2.2 1.3M4.2 17l2.2-1.3M17.6 8.3l2.2-1.3" /></svg></div>
              <h3>Systems</h3>
              <p>Electrical, plumbing, HVAC — safe and up to par.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" /></svg></div>
              <h3>Water Management</h3>
              <p>Drainage, grading, and moisture control.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.3L3 18l3 3 6.4-6.3a4 4 0 0 0 5.3-5.4l-2.5 2.5-2.1-.5-.5-2.1Z" /></svg></div>
              <h3>Materials &amp; Craftsmanship</h3>
              <p>Quality materials. Work done right.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M4 11h16M11 4v16" strokeWidth={1.4} /></svg></div>
              <h3>Layout &amp; Function</h3>
              <p>Spaces that work for real life.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M4 18 10 11l4 4 6-8" /><path d="M17 7h3v3" strokeWidth={1.8} /></svg></div>
              <h3>Future Potential</h3>
              <p>Room to grow. Value to gain.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RED / GREEN FLAGS */}
      <section className="section">
        <div className="container">
          <div className="card flags">
            <div className="red">
              <h4>Red Flags</h4>
              <ul>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="M6 6 18 18M18 6 6 18" /></svg>Foundation cracks or movement</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="M6 6 18 18M18 6 6 18" /></svg>Roof nearing the end of its life</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="M6 6 18 18M18 6 6 18" /></svg>Outdated or unsafe electrical</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="M6 6 18 18M18 6 6 18" /></svg>Plumbing leaks or corrosion</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="M6 6 18 18M18 6 6 18" /></svg>Poor drainage or water intrusion</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="M6 6 18 18M18 6 6 18" /></svg>DIY repairs or unpermitted work</li>
              </ul>
            </div>
            <div className="flag-vs">VS</div>
            <div className="green">
              <h4>Green Flags</h4>
              <ul>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Well-maintained structure</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Newer roof with quality materials</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Updated systems and efficiency</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Good drainage and dry basements</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Quality finishes and craftsmanship</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Permits, warranties, and documentation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section alt">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 44 }}><h2>Buying &amp; Selling Process</h2></div>
          <div className="proc" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
            <div className="proc-step"><div className="proc-num">1</div><h4>Discover &amp; Align</h4><p>We talk goals, timeline, and priorities to build the right plan.</p></div>
            <div className="proc-step"><div className="proc-num">2</div><h4>Evaluate &amp; Strategize</h4><p>I assess homes or your property with a builder's eye and market insight.</p></div>
            <div className="proc-step"><div className="proc-num">3</div><h4>Plan &amp; Prep</h4><p>Strategic repairs, staging, and positioning for maximum impact.</p></div>
            <div className="proc-step"><div className="proc-num">4</div><h4>Market &amp; Negotiate</h4><p>Smart pricing, strong marketing, and skilled negotiation.</p></div>
            <div className="proc-step"><div className="proc-num">5</div><h4>Close &amp; Move Forward</h4><p>Smooth closing with clear communication every step of the way.</p></div>
          </div>
        </div>
      </section>

      {/* WHY CONSTRUCTION KNOWLEDGE */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 0, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h2 className="h-lg" style={{ fontSize: "clamp(26px,3vw,38px)", marginBottom: 16 }}>Why Construction Knowledge Matters</h2>
              <p className="lead" style={{ fontSize: 15, marginBottom: 24 }}>Most agents don't see what's behind the walls. I do. My construction background helps me spot issues early, plan smarter improvements, and protect your investment — whether you're buying or selling.</p>
              <Link className="btn btn-ghost" href="/contact" style={{ alignSelf: "flex-start" }}>Learn More <Arrow /></Link>
            </div>
            <div className="shot scene scene--shop" style={{ minHeight: 360 }}>
              <img className="slot" src="/images/tools.jpg" alt="Tools on a workbench" />
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section alt">
        <div className="container">
          <div className="sec-head"><span className="eyebrow">What Clients Say</span></div>
          <div className="review-grid">
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"Brian's construction knowledge gave us total confidence. He found issues others missed and helped us buy the right home."</p>
              <cite>— J. Thompson, South Jordan</cite>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"We sold fast and for more than we expected. Brian's strategy and recommendations made all the difference."</p>
              <cite>— M. Reynolds, West Jordan</cite>
            </div>
            <div className="review-card">
              <div className="stars">★★★★★</div>
              <p>"Honest, responsive, and incredibly thorough. He treats your home like it's his own."</p>
              <cite>— D. Martinez, Herriman</cite>
            </div>
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
