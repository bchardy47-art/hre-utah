import Link from "next/link";

const PHONE = "(801) 380-0445";
const TEL = "8013800445";
const EMAIL = "HardyHomesUtah@gmail.com";

const IgIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h2.5l.5-3H13v-2c0-.6.4-1 1-1Z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="logo logo--footer" href="/" aria-label="Hardy Real Estate — HRE Handyman Services">
              <img className="logo-badge" src="/images/hre-logo.png" alt="HRE — Hardy Real Estate Handyman Services" />
            </Link>
          </div>
          <div>
            <h5>Home</h5>
            <Link href="/">Overview</Link>
            <Link href="/#advantage">Why It Matters</Link>
          </div>
          <div>
            <h5>Real Estate</h5>
            <Link href="/real-estate">Buyer Guidance</Link>
            <Link href="/real-estate#sellers">Seller Strategy</Link>
          </div>
          <div>
            <h5>Handyman</h5>
            <Link href="/handyman">Services</Link>
            <Link href="/handyman#request">Request Service</Link>
          </div>
          <div>
            <h5>About</h5>
            <Link href="/about">Our Approach</Link>
            <Link href="/about#why">Why It Matters</Link>
          </div>
          <div>
            <h5>Contact</h5>
            <a href={`tel:${TEL}`}>{PHONE}</a>
            <a href={`sms:${TEL}`}>Text Brian</a>
          </div>
        </div>
        <div className="footer-base">
          <span>© 2026 Hardy Real Estate. All rights reserved.</span>
          <span className="footer-lic">Licensed Utah REALTOR®</span>
          <div className="social">
            <a href="#" aria-label="Instagram"><IgIcon /></a>
            <a href="#" aria-label="Facebook"><FbIcon /></a>
            <a href={`mailto:${EMAIL}`} aria-label="Email"><MailIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
