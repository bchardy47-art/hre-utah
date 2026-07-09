"use client";

import { useRef, useState } from "react";

const EMAIL = "HardyHomesUtah@gmail.com";
const FORMSPREE_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxx"

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    setStatus("sending");
    const data = new FormData(form);
    try {
      let res: Response;
      if (FORMSPREE_ENDPOINT) {
        res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
      } else {
        const params = new URLSearchParams();
        data.forEach((v, k) => params.append(k, String(v)));
        res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
      }
      if (!res.ok) throw new Error("bad response");
      setStatus("done");
    } catch {
      // No backend reachable — hand off to the email client so nothing is lost
      const subject = encodeURIComponent("Website inquiry — " + (data.get("help-with") || "General"));
      const body = encodeURIComponent(
        "Name: " + (data.get("full-name") || "") + "\n" +
        "Email: " + (data.get("email") || "") + "\n" +
        "Phone: " + (data.get("phone") || "") + "\n" +
        "Topic: " + (data.get("help-with") || "") + "\n\n" +
        (data.get("message") || "")
      );
      setStatus("error");
      window.location.href = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + body;
    }
  };

  return (
    <form
      ref={formRef}
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="form-name" defaultValue="contact" />
      <p hidden>
        <label>Leave this field empty: <input name="bot-field" /></label>
      </p>
      <div className="form-row">
        <div className="form-field"><label>Full Name</label><input className="field" type="text" name="full-name" placeholder="Full Name" required /></div>
        <div className="form-field"><label>Email Address</label><input className="field" type="email" name="email" placeholder="Email Address" required /></div>
      </div>
      <div className="form-row">
        <div className="form-field"><label>Phone Number</label><input className="field" type="tel" name="phone" placeholder="Phone Number" /></div>
        <div className="form-field">
          <label>What can we help you with?</label>
          <select className="field" name="help-with" required defaultValue="">
            <option value="" disabled>Select an option</option>
            <option>Buying a Home</option>
            <option>Selling a Home</option>
            <option>First-Time Buyer Help</option>
            <option>Pre-Listing Walkthrough</option>
            <option>Handyman Work</option>
            <option>Something Else</option>
          </select>
        </div>
      </div>
      <div className="form-field" style={{ marginBottom: 16 }}>
        <label>Your Message</label>
        <textarea className="field" name="message" placeholder="Tell us more about your goals or project..." />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        {status !== "done" && (
          <button className="btn btn-primary btn-lg" type="submit" disabled={status === "sending"}>
            Send Message <Arrow />
          </button>
        )}
        <div className="form-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          We respect your privacy. Your information will only be used to respond to your message.
        </div>
      </div>
      {status === "done" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--orange)", fontFamily: "var(--head)", textTransform: "uppercase", letterSpacing: ".08em", marginTop: 18 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none"><path d="m5 13 4 4L19 7" /></svg> Thanks — Brian will be in touch shortly.
        </div>
      )}
      {status === "error" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontSize: 13.5, marginTop: 18 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none"><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>
          We couldn't send that automatically. Please text or call Brian at (801) 380-0445.
        </div>
      )}
    </form>
  );
}
