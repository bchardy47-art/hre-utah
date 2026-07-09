import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Let's Talk. Real Answers. Real Fast. | Hardy Real Estate",
  description:
    "Contact Brian Hardy — text or call (801) 380-0445 for Utah real estate and handyman help. Fast, clear answers with no runaround.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function Contact() {
  return (
    <>
      {/* HERO */}
      <section className="hero hero--page" data-screen-label="Contact">
        <div className="scene scene--desk">
          <img className="slot" src="/images/hero-contact.jpg" alt="Desk / office" />
        </div>
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <h1 className="h-xl">
            Let's Talk.<br />Real Answers.<br />
            <span className="accent">Real Fast.</span>
          </h1>
          <p className="lead">
            Have a question, a project, or ready to make a move? We're here to help — with
            straight answers and no runaround.
          </p>
        </div>
      </section>

      {/* CONTACT METHODS */}
      <section className="section" style={{ paddingTop: 56 }}>
        <div className="container">
          <div className="contact3">
            <div className="cmethod">
              <div className="cm-ico"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" /></svg></div>
              <div className="cm-label">Text Brian</div>
              <div className="cm-value">(801) 380-0445</div>
              <p>Fastest way to get in touch.</p>
              <a className="learn" href="sms:8013800445">Text Now <Arrow /></a>
            </div>
            <div className="cmethod">
              <div className="cm-ico"><svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /></svg></div>
              <div className="cm-label">Call Brian</div>
              <div className="cm-value">(801) 380-0445</div>
              <p>Let's talk through your goals.</p>
              <a className="learn" href="tel:8013800445">Call Now <Arrow /></a>
            </div>
            <div className="cmethod">
              <div className="cm-ico"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></div>
              <div className="cm-label">Email Us</div>
              <div className="cm-value sm">HardyHomesUtah@gmail.com</div>
              <p>We'll respond as quickly as we can.</p>
              <a className="learn" href="mailto:HardyHomesUtah@gmail.com">Send Email <Arrow /></a>
            </div>
          </div>
        </div>
      </section>

      {/* FORM + BUSINESS DETAILS */}
      <section className="section tight" id="message">
        <div className="container">
          <div className="contact-split">
            <div className="card form-card">
              <h3>Send Us a Message</h3>
              <div className="form-sub">Tell us a little about your needs and how we can help.</div>
              <ContactForm />
            </div>

            <div className="card biz-card">
              <h3>Business Details</h3>
              <div className="biz-line"><span className="biz-ico"><svg viewBox="0 0 24 24"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg></span><span>Hardy Real Estate<small>Boardwalk Realty &amp; Property Management</small><small>Saratoga Springs, UT</small></span></div>
              <div className="biz-line"><span className="biz-ico"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></span><span>HardyHomesUtah@gmail.com</span></div>
              <div className="biz-line"><span className="biz-ico"><svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /></svg></span><span>(801) 380-0445</span></div>
              <div className="biz-line" style={{ marginBottom: 4 }}><span className="biz-ico"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="m8 12 2.5 2.5L16 9" /></svg></span><span>Licensed Utah REALTOR®</span></div>
              <div className="biz-hours">
                <h4>Office Hours</h4>
                <div className="hrow"><b>Monday – Friday</b><span>8:00 AM – 6:00 PM</span></div>
                <div className="hrow"><b>Saturday</b><span>9:00 AM – 3:00 PM</span></div>
                <div className="hrow"><b>Sunday</b><span>By Appointment</span></div>
                <div className="after">After-hours by appointment.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="section alt">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 34 }}>
            <span className="eyebrow">What to Expect</span>
            <h2>Fast, Clear Communication.</h2>
          </div>
          <div className="colrow" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" /><path d="m8.5 11 2 2 4.5-4.5" strokeWidth={1.6} /></svg></div>
              <h3>We Respond Fast</h3>
              <p>Most inquiries get a response within minutes during business hours.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg></div>
              <h3>We Listen First</h3>
              <p>We take the time to understand your goals and priorities.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="1" /><path d="M9 8h6M9 12h6M9 16h4" /></svg></div>
              <h3>Clear Next Steps</h3>
              <p>You'll always know what to expect and what happens next.</p>
            </div>
            <div className="col">
              <div className="col-ico"><svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /><path d="M3 4h8" /></svg></div>
              <h3>No Pressure</h3>
              <p>Honest guidance and smart advice — never pushy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 940 }}>
          <div className="sec-head" style={{ marginBottom: 34 }}>
            <span className="eyebrow">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <details className="faq"><summary>How quickly will I hear back?<span className="pm">+</span></summary><div className="faq-body">Most calls and texts get a response within minutes during business hours, and same-day for anything that comes in after hours. Brian answers directly — no call centers or gatekeepers.</div></details>
          <details className="faq"><summary>Do you charge for consultations?<span className="pm">+</span></summary><div className="faq-body">No. Initial conversations, walkthroughs, and buyer or seller consultations are always free. We'll talk through your goals and outline a clear plan before you commit to anything.</div></details>
          <details className="faq"><summary>What areas do you serve?<span className="pm">+</span></summary><div className="faq-body">We serve buyers, sellers, and homeowners across Northern Utah — including Salt Lake, Utah, Davis, Weber, Summit, and Wasatch counties.</div></details>
          <details className="faq"><summary>Can you help with both real estate and handyman projects?<span className="pm">+</span></summary><div className="faq-body">Yes — that's the whole idea. Brian handles real estate and handyman work under one roof, whether you're buying, selling, prepping a home for market, or just need trusted repairs and improvements.</div></details>
        </div>
      </section>

      {/* AREAS WE SERVE */}
      <section className="section alt">
        <div className="container">
          <div className="sec-head" style={{ marginBottom: 30 }}><span className="eyebrow">Areas We Serve</span></div>
          <div className="pill-row">
            <span className="pill">Salt Lake County</span>
            <span className="pill">Utah County</span>
            <span className="pill">Davis County</span>
            <span className="pill">Weber County</span>
            <span className="pill">Summit County</span>
            <span className="pill">Wasatch County</span>
          </div>
          <p className="lead" style={{ textAlign: "center", fontSize: 15, marginTop: 22 }}>From first-time buyers to seasoned investors, we help clients across Northern Utah.</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section tight">
        <div className="container">
          <CtaBand pre="Ready to take " accent="the next step" post="?" strip="Honest Guidance|Clear Communication|Quality Work|Proven Results" />
        </div>
      </section>
    </>
  );
}
