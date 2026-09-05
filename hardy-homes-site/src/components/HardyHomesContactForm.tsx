"use client";

import { useRef, useState } from "react";

const EMAIL = "brian@hre-utah.com";
const CONTACT_ENDPOINT = "/api/contact";

export default function HardyHomesContactForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = ref.current;
    if (!form) return;
    setStatus("sending");
    const data = new FormData(form);

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("done");
      form.reset();
    } catch {
      const subject = encodeURIComponent(`Hardy Homes inquiry — ${data.get("plan") || "General"}`);
      const body = encodeURIComponent(
        `Name: ${data.get("name") || ""}\nEmail: ${data.get("email") || ""}\nProperty: ${data.get("property") || ""}\nPlan: ${data.get("plan") || ""}\n\n${data.get("message") || ""}`
      );
      setStatus("error");
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <form ref={ref} method="POST" action={CONTACT_ENDPOINT} onSubmit={onSubmit}>
      <p hidden>
        <label>Leave this field empty: <input name="bot-field" /></label>
      </p>
      <div className="hh-form-grid hh-form-grid--two">
        <div><label htmlFor="hh-name" className="label">Full Name</label><input id="hh-name" className="hh-field" name="name" required autoComplete="name" /></div>
        <div><label htmlFor="hh-email" className="label">Email</label><input id="hh-email" className="hh-field" type="email" name="email" required autoComplete="email" /></div>
      </div>
      <div className="hh-form-grid hh-form-grid--two">
        <div><label htmlFor="hh-property" className="label">Property / Lot</label><input id="hh-property" className="hh-field" name="property" autoComplete="off" /></div>
        <div><label htmlFor="hh-plan" className="label">Plan of Interest</label><select id="hh-plan" name="plan" className="hh-field"><option>General</option><option>The Brindle</option><option>The Rock</option><option>The Flint</option></select></div>
      </div>
      <div style={{ marginBottom: 16 }}><label htmlFor="hh-message" className="label">Message</label><textarea id="hh-message" name="message" className="hh-field hh-field--textarea" /></div>
      <div className="hardy-cta-actions">
        <button className="btn btn-primary btn-lg" type="submit" disabled={status === "sending"}>Start Your Build</button>
        {status === "done" ? <span className="label">Thanks — we&apos;ll be in touch shortly.</span> : null}
        {status === "error" ? <span className="label">We couldn&apos;t send that automatically. Your email app should be opening.</span> : null}
      </div>
    </form>
  );
}
