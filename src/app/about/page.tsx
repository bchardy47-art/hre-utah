import type { Metadata } from "next";
import Image from "next/image";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "About Brian Hardy | Home Builder, Residential Designer & REALTOR®",
  description:
    "Meet Brian Hardy — home builder, residential designer, and Utah REALTOR® bringing construction, design, and real estate together through BCHardy, LLC and Hardy Homes.",
};

export default function About() {
  return (
    <>
      <section className="hero hero--page" data-screen-label="About">
        <div className="scene scene--dusk">
          <img className="slot" src="/images/hero-about.jpg" alt="Utah home" />
        </div>
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <span className="eyebrow">Brian Hardy</span>
          <h1 className="h-xl">
            Home Builder.<br />Residential Designer.<br />
            <span className="accent">REALTOR®.</span>
          </h1>
          <p className="lead about-hero-lead">
            I&apos;ve spent much of my career around homes from different sides of the process —
            construction, real estate, residential design, and now homebuilding. Hardy Homes brings
            those pieces together.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="card story-card">
            <div className="story-text">
              <span className="eyebrow">Brian Hardy</span>
              <h3>One career built around how homes really come together.</h3>
              <p>
                My background has always pulled me toward practical work, systems, and how things
                are built. Over time that grew from hands-on construction experience into real
                estate, residential drafting and design, and ultimately homebuilding.
              </p>
              <p>
                Along the way I&apos;ve also worked in business environments where communication,
                follow-through, and problem solving mattered just as much as technical knowledge.
                That combination shapes how I work with clients today.
              </p>
              <p>
                BCHardy, LLC is a licensed Utah R100 residential and small commercial contractor.
                Through Hardy Homes by BCHardy, LLC, I&apos;m building a more connected path for people
                who need help finding property, designing a home, understanding construction, and
                moving a project forward.
              </p>
              <p style={{ marginBottom: 0 }}>
                I&apos;m not an architect or engineer, and when a project requires licensed engineering,
                stamped plans, or other regulated services, those are coordinated with the right
                professionals.
              </p>
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
          <div className="trio about-focus-grid">
            <div className="card feat">
              <div className="feat-ico"><svg viewBox="0 0 24 24"><path d="M3 20h18" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h6" /></svg></div>
              <h3>Homebuilding</h3>
              <p>Hardy Homes puts builder-first thinking at the center of planning, selections, and execution.</p>
            </div>
            <div className="card feat">
              <div className="feat-ico"><svg viewBox="0 0 24 24"><path d="M4 20h16" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h4" /></svg></div>
              <h3>Residential Design</h3>
              <p>I create practical residential plans in Chief Architect and coordinate the next steps when engineering is required.</p>
            </div>
            <div className="card feat">
              <div className="feat-ico"><svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><path d="m9 15 2 2 4-4" /></svg></div>
              <h3>Real Estate</h3>
              <p>As a Utah REALTOR®, I help clients buy and sell with a construction-minded perspective that carries into the next phase.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="card princred">
            <div>
              <h4>The Hardy Approach</h4>
              <ul className="princ-list">
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>I try to simplify the process instead of fragmenting it.</li>
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>I communicate clearly about scope, limitations, and next steps.</li>
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>I focus on practical decisions that work in real construction.</li>
                <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.3 2.3L15.5 9.5" /></svg>I respect the roles of architects, engineers, inspectors, and trade professionals when they are required.</li>
              </ul>
            </div>
            <div>
              <h4>Credentials</h4>
              <div className="cred-grid">
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7" /></svg></span><span>Utah REALTOR®</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><path d="M3 20h18" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h6" /></svg></span><span>Utah R100 Residential &amp; Small Commercial Contractor</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><path d="m14 6 4-4 2 2-4 4M6 14l-4 4 2 2 4-4M14 6l-8 8M18 18l-3-3M6 6l3 3" /></svg></span><span>Construction &amp; Remodeling Experience</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><path d="M4 20h16" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h4" /></svg></span><span>Chief Architect Residential Drafting</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="m8 12 2.5 2.5L16 9" /></svg></span><span>Property Evaluation &amp; Planning Insight</span></div>
                <div className="cred"><span className="cred-ico"><svg viewBox="0 0 24 24"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg></span><span>Local, independent, and Utah-focused</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}>
            <span className="eyebrow">What This Looks Like</span>
            <h2>From property to plan to build.</h2>
          </div>
          <div className="colrow" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg></div>
              <h3>Find It</h3>
              <p>Buy or evaluate the right property with a better understanding of opportunity and risk.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M4 20h16" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h4" /></svg></div>
              <h3>Design It</h3>
              <p>Turn ideas into practical residential plans with a defined path toward engineering and permit review.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M3 20h18" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h6" /></svg></div>
              <h3>Build It</h3>
              <p>Move into a homebuilding conversation through BCHardy, LLC and Hardy Homes when the project is the right fit.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.3L3 18l3 3 6.4-6.3a4 4 0 0 0 5.3-5.4l-2.5 2.5-2.1-.5-.5-2.1Z" /></svg></div>
              <h3>Improve It</h3>
              <p>Use the same practical mindset for repairs, upgrades, and improvement projects after move-in.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <CtaBand
            pre="Want to talk through your "
            accent="property or project"
            post="?"
            sub="Whether you're looking at land, planning a home, or evaluating the next move, Brian can help you sort through it."
            noicons
          />
        </div>
      </section>
    </>
  );
}
