import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Handyman — Reliable Handyman Service. No Runaround. | Hardy Real Estate",
  description:
    "Reliable Utah handyman services from Hardy Real Estate — repairs, improvements, painting, and installs done right the first time. No runaround.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const featStyle = { padding: "26px 18px", minHeight: 210 };

export default function Handyman() {
  return (
    <>
      {/* HERO */}
      <section className="hero hero--page" data-screen-label="Handyman">
        <div className="scene scene--shop">
          <img className="slot" src="/images/hero-handyman.jpg" alt="Workshop" />
        </div>
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <h1 className="h-xl">
            Reliable<br />Handyman Service.<br />
            <span className="accent">No Runaround.</span>
          </h1>
          <p className="lead">Quality work. Clear communication. Done right the first time.</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 30 }}>
            <Link className="btn btn-primary btn-lg" href="#request">Request Service <Arrow /></Link>
            <Link className="btn btn-ghost btn-lg" href="#handles">What I Handle <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* SERVICE CATEGORIES */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}><span className="eyebrow">Handyman Services</span></div>
          <div className="feat-grid" style={{ gridTemplateColumns: "repeat(6,1fr)", gap: 14 }}>
            <div className="card card-link feat" style={featStyle}>
              <div className="feat-ico"><svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.3L3 18l3 3 6.4-6.3a4 4 0 0 0 5.3-5.4l-2.5 2.5-2.1-.5-.5-2.1Z" /></svg></div>
              <h3>Repairs &amp; Maintenance</h3>
              <p>Fix what's broken and keep your home working right.</p>
              <Link className="learn" href="#request">Learn More <Arrow /></Link>
            </div>
            <div className="card card-link feat" style={featStyle}>
              <div className="feat-ico"><svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /></svg></div>
              <h3>Home Improvements</h3>
              <p>Upgrade your space with quality updates that add value.</p>
              <Link className="learn" href="#request">Learn More <Arrow /></Link>
            </div>
            <div className="card card-link feat" style={featStyle}>
              <div className="feat-ico"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="13" height="7" rx="1" /><path d="M17 7h3v4h-6" /><path d="M11 11v3h-1v6h3v-6h-1" /></svg></div>
              <h3>Painting</h3>
              <p>Interior and exterior painting with careful prep and clean finishes.</p>
              <Link className="learn" href="#request">Learn More <Arrow /></Link>
            </div>
            <div className="card card-link feat" style={featStyle}>
              <div className="feat-ico"><svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="12" rx="1" /><path d="M4 11h16M12 7V4" /></svg></div>
              <h3>Assembly &amp; Installation</h3>
              <p>Furniture, fixtures, TVs and more — installed securely and correctly.</p>
              <Link className="learn" href="#request">Learn More <Arrow /></Link>
            </div>
            <div className="card card-link feat" style={featStyle}>
              <div className="feat-ico"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 3v18" /><circle cx="12.5" cy="12" r=".9" fill="currentColor" stroke="none" /></svg></div>
              <h3>Doors &amp; Hardware</h3>
              <p>Install, repair, and adjust for function, fit, and security.</p>
              <Link className="learn" href="#request">Learn More <Arrow /></Link>
            </div>
            <div className="card card-link feat" style={featStyle}>
              <div className="feat-ico"><svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="1" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></svg></div>
              <h3>Odds &amp; Ends</h3>
              <p>Those small tasks that make a big difference.</p>
              <Link className="learn" href="#request">Learn More <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT BRIAN HANDLES */}
      <section className="section tight" id="handles">
        <div className="container">
          <div className="card handles">
            <h4>What Brian Handles</h4>
            <div className="handles-cols">
              <ul>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Minor plumbing repairs</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Drywall repair &amp; patching</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Caulking &amp; sealing</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Shelving &amp; storage solutions</li>
              </ul>
              <ul>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Gutter cleaning &amp; fixes</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Light fixture replacement</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Trim &amp; molding repair</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Weatherstripping</li>
              </ul>
              <ul>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Appliance installation</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Window treatments</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Garage organization</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Baby proofing</li>
              </ul>
              <ul>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Deck &amp; fence repairs</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>Door adjustments</li>
                <li><svg viewBox="0 0 24 24" stroke="currentColor"><path d="m5 13 4 4L19 7" /></svg>And much more</li>
              </ul>
            </div>
            <div className="handles-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}><circle cx="12" cy="12" r="11" /><path d="M9 8.5 7 6.5a3 3 0 0 0-.2 4.2M15 8.5l2-2a3 3 0 0 1 .2 4.2M7 17l4-6M17 17l-4-6" /></svg></div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section" id="request">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}><span className="eyebrow">The Hardy Handyman Process</span></div>
          <div className="procards">
            <div className="procard">
              <div className="procard-head"><div className="proc-num">1</div><h4>Reach Out</h4></div>
              <p>Tell me about your project. I'll listen, ask a few quick questions, and schedule a time.</p>
              <span className="proc-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m9 6 6 6-6 6" /></svg></span>
            </div>
            <div className="procard">
              <div className="procard-head"><div className="proc-num">2</div><h4>Assess &amp; Plan</h4></div>
              <p>I evaluate the job, confirm the plan, and provide clear pricing and timing.</p>
              <span className="proc-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m9 6 6 6-6 6" /></svg></span>
            </div>
            <div className="procard">
              <div className="procard-head"><div className="proc-num">3</div><h4>Get It Done</h4></div>
              <p>I show up on time, work carefully, and treat your home with respect.</p>
              <span className="proc-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m9 6 6 6-6 6" /></svg></span>
            </div>
            <div className="procard">
              <div className="procard-head"><div className="proc-num">4</div><h4>Check &amp; Follow Up</h4></div>
              <p>I make sure everything is done right and you're 100% satisfied.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CLIENTS CHOOSE BRIAN */}
      <section className="section alt">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}><span className="eyebrow">Why Clients Choose Brian</span></div>
          <div className="colrow" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" /></svg></div>
              <h3>Clear Communication</h3>
              <p>You'll always know what to expect.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg></div>
              <h3>Trusted &amp; Reliable</h3>
              <p>I show up, do the job, and stand behind my work.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="m12 3 2.5 5.3 5.5.8-4 4 1 5.6-5-2.7-5 2.7 1-5.6-4-4 5.5-.8Z" /></svg></div>
              <h3>Quality Workmanship</h3>
              <p>Attention to detail on every project.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg></div>
              <h3>Respect For Your Home</h3>
              <p>Clean, careful, and considerate always.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3" /><path d="M6 10h12l-1 5a4 4 0 0 1-4 3h-2a4 4 0 0 1-4-3l-1-5Z" /><path d="M10 21h4" /></svg></div>
              <h3>Fair &amp; Honest Pricing</h3>
              <p>Straightforward rates with no surprises.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE STANDARDS */}
      <section className="section">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}><span className="eyebrow">Service Standards</span></div>
          <div className="std-grid">
            <div className="std"><div className="std-ico"><svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg></div><h4>Safety First</h4><p>Work is performed with safety and care in mind.</p></div>
            <div className="std"><div className="std-ico"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="m8 12 2.5 2.5L16 9" /></svg></div><h4>Right The First Time</h4><p>We do it once, we do it right.</p></div>
            <div className="std"><div className="std-ico"><svg viewBox="0 0 24 24"><path d="M7 21v-6M7 15c-2 0-3-1-3-3l1-5h4l1 5c0 2-1 3-3 3Z" /><path d="m13 4 6 6M11 12l7-7 2 2-7 7Z" /></svg></div><h4>Clean &amp; Tidy</h4><p>We protect your space and clean up when we're done.</p></div>
            <div className="std"><div className="std-ico"><svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /><path d="M3 4h8" /></svg></div><h4>Respectful</h4><p>Your time, your home, and your trust matter.</p></div>
            <div className="std"><div className="std-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7" /></svg></div><h4>Satisfaction Guaranteed</h4><p>Not happy? We'll make it right.</p></div>
          </div>
        </div>
      </section>

      {/* COMMON PROJECTS */}
      <section className="section alt">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}><span className="eyebrow">Common Projects</span></div>
          <div className="proj-grid">
            <div className="proj">
              <div className="shot scene scene--interior"><img className="slot" src="/images/proj-faucet.jpg" alt="Faucet" /></div>
              <div className="proj-body">
                <div className="proj-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 21h8M12 21v-6M6 15h12l-1-3H7l-1 3ZM9 12V8h6M15 8V5a2 2 0 0 1 4 0" /></svg></div>
                <h4>Faucet Replacement</h4>
                <p>Replace worn or leaking fixtures for better function and efficiency.</p>
              </div>
            </div>
            <div className="proj">
              <div className="shot scene scene--desk"><img className="slot" src="/images/proj-trim.jpg" alt="Trim" /></div>
              <div className="proj-body">
                <div className="proj-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 17h18M5 17l3-9M9 17l3-9M13 17l3-9M17 17l2-6" /></svg></div>
                <h4>Trim Repair</h4>
                <p>Fix dents, dings, and gaps for clean, sharp finishes.</p>
              </div>
            </div>
            <div className="proj">
              <div className="shot scene scene--shop"><img className="slot" src="/images/proj-door.jpg" alt="Door hardware" /></div>
              <div className="proj-body">
                <div className="proj-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="6" y="3" width="12" height="18" rx="1" /><circle cx="10" cy="12" r="1.1" fill="currentColor" stroke="none" /></svg></div>
                <h4>Door Hardware Upgrade</h4>
                <p>Upgrade locks, handles, and hinges for style and security.</p>
              </div>
            </div>
            <div className="proj">
              <div className="shot scene scene--turf"><img className="slot" src="/images/proj-deck.jpg" alt="Deck" /></div>
              <div className="proj-body">
                <div className="proj-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 8h18M3 12h18M3 16h18M7 8v8M13 8v8M19 8v8" /></svg></div>
                <h4>Deck Repair</h4>
                <p>Repair loose boards, replace damaged wood, and restore safety.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section tight">
        <div className="container">
          <CtaBand
            pre="Ready to "
            accent="check that off"
            post=" your list?"
            sub="Let's get your project done — right, on time, and hassle-free."
            strip="Fast Response|Clear Communication|Quality Work|Respect For Your Home|Satisfaction Guaranteed"
          />
        </div>
      </section>
    </>
  );
}
