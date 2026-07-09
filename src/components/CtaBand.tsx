const PHONE = "(801) 380-0445";
const TEL = "8013800445";

const SmsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" />
    <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);

const STRIP_ICON: Record<string, string> = {
  "honest guidance": "M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z|m9 12 2 2 4-4",
  "clear communication": "M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z",
  "quality work": "M14.7 6.3a4 4 0 0 0-5.4 5.3L3 18l3 3 6.4-6.3a4 4 0 0 0 5.3-5.4l-2.5 2.5-2.1-.5-.5-2.1Z",
  "local knowledge": "M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z|M12 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
  "proven results": "m5 13 4 4L19 7|M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20",
  "fast response": "M13 2 4 14h6l-1 8 9-12h-6l1-8Z",
  "respect for your home": "M3 11.5 12 4l9 7.5M5 10v10h14V10",
  "satisfaction guaranteed": "M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12|m8.5 14-1.5 7 5-3 5 3-1.5-7",
};

type Props = {
  pre?: string;
  accent?: string;
  post?: string;
  sub?: string;
  strip?: string;
  noicons?: boolean;
};

export default function CtaBand({
  pre = "Ready to make a ",
  accent = "smart",
  post = " move?",
  sub = "Let's talk about your goals and how I can help.",
  strip = "Honest Guidance|Clear Communication|Quality Work|Local Knowledge|Proven Results",
  noicons = false,
}: Props) {
  const items = strip.split("|").map((s) => s.trim()).filter(Boolean);
  return (
    <div className="ctaband">
      <div className="ctaband-main">
        <span className="cta-badge"><SmsIcon /></span>
        <div className="cta-copy">
          <h2>
            {pre}
            <span className="accent">{accent}</span>
            {post}
          </h2>
          <p>{sub}</p>
        </div>
        <div className="cta-actions">
          <a className="btn btn-primary btn-lg" href={`sms:${TEL}`}><SmsIcon /> Text Brian</a>
          <a className="btn btn-dark btn-lg" href={`tel:${TEL}`}><PhoneIcon /> {PHONE}</a>
        </div>
      </div>
      {!noicons && (
        <div className="cta-strip">
          {items.map((label) => {
            const paths = (STRIP_ICON[label.toLowerCase()] || "m5 13 4 4L19 7").split("|");
            return (
              <span key={label} className="cta-strip-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  {paths.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </svg>
                {label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
