import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Brian Hardy | Hardy Homes, Design, Real Estate & Handyman",
  description:
    "Contact Brian Hardy about Hardy Homes, custom home design, Utah real estate, and handyman projects. Call, text, email, or send a message.",
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function Contact() {
  return (
    <>
      <section className="hero hero--page" data-screen-label="Contact">
        <div className="scene scene--desk">
          <img className="slot" src="/images/hero-contact.jpg" alt="Desk / office" />
        </div>
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <h1 className="h-xl">
            Talk With Brian.<br />Plan the Next Step.<br />
            <span className="accent">Get Real Answers.</span>
          </h1>
          <p className="lead">
            Reach out about building a Hardy Home, residential design, buying or selling in Utah,
            or a handyman project. You&apos;ll hear back from Brian directly.
          </p>
        </div>
      </section>

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
              <p>Talk through your goals and timeline.</p>
              <a className="learn" href="tel:8013800445">Call Now <Arrow /></a>
            </div>
            <div className="cmethod">
              <div className="cm-ico"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></div>
              <div className="cm-label">Email Brian</div>
              <div className="cm-value sm">brian@hre-utah.com</div>
              <p>Use email for plans, property details, or project notes.</p>
              <a className="learn" href="mailto:brian@hre-utah.com">Send Email <Arrow /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight" id="message">
        <div className="container">
          <div className="contact-split">
            <div className="card form-card">
              <h3>Send a Message</h3>
              <div className="form-sub">Tell Brian what you need help with and the best way to reach you.</div>
              <ContactForm />
            </div>

            <div className="card biz-card">
              <h3>Business Details</h3>
              <div className="biz-line"><span className="biz-ico"><svg viewBox="0 0 24 24"><path d="M3 20h18" /><path d="M6 20V8l6-4 6 4v12" /><path d="M9 11h6M9 14h6" /></svg></span><span>BCHardy, LLC<small>Hardy Homes</small><small>Utah R100 Contractor</small></span></div>
              <div className="biz-line"><span className="biz-ico"><svg viewBox="0 0 24 24"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg></span><span>Hardy Real Estate<small>Boardwalk Realty &amp; Property Management</small><small>Saratoga Springs, UT</small></span></div>
              <div className="biz-line"><span className="biz-ico"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></span><span>brian@hre-utah.com</span></div>
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

      <section className="section">
        <div className="container" style={{ maxWidth: 940 }}>
          <div className="sec-head" style={{ marginBottom: 34 }}>
            <span className="eyebrow">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <details className="faq"><summary>How quickly will I hear back?<span className="pm">+</span></summary><div className="faq-body">Most calls and texts get a response within minutes during business hours, and same-day for anything that comes in after hours. Brian answers directly — no call centers or gatekeepers.</div></details>
          <details className="faq"><summary>What kinds of projects can I reach out about?<span className="pm">+</span></summary><div className="faq-body">You can contact Brian about Hardy Homes, custom residential design and drafting, buying or selling a home, handyman work, and broader planning questions about how a project could move forward.</div></details>
          <details className="faq"><summary>Do you charge for consultations?<span className="pm">+</span></summary><div className="faq-body">Initial conversations are free. Brian will talk through your goals, explain what kind of help makes sense, and identify a practical next step before you commit to anything.</div></details>
          <details className="faq"><summary>Can you handle design and construction together?<span className="pm">+</span></summary><div className="faq-body">In some cases, yes. BCHardy, LLC can provide residential drafting and design coordination, and accepted projects may continue into a builder conversation through Hardy Homes. Final scope always depends on the property, project requirements, licensing, and written agreement.</div></details>
        </div>
      </section>
    </>
  );
}
