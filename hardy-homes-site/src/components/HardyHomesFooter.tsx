import Link from "next/link";

import {
  HARDY_HOMES_CONTACT_EMAIL,
  HARDY_HOMES_PHONE,
  HARDY_HOMES_SERVICE_AREA_LINE,
  HARDY_HOMES_TEL,
} from "@hardy-homes/shared/hardyHomesSite";

export default function HardyHomesFooter() {
  return (
    <footer className="hh-footer">
      <div className="container">
        <div className="hh-footer-grid">
          <div className="hh-footer-brand-copy">
            <strong>Hardy Homes by BCHardy, LLC</strong>

            <p className="hh-footer-contact">
              <a href={`tel:${HARDY_HOMES_TEL}`}>{HARDY_HOMES_PHONE}</a>
              <a href={`mailto:${HARDY_HOMES_CONTACT_EMAIL}`}>
                {HARDY_HOMES_CONTACT_EMAIL}
              </a>
            </p>

            <small>
              Real estate services through HRE · Boardwalk Realty &amp; Property Management.
            </small>
          </div>

          <div>
            <h5>Explore</h5>
            <Link href="/floor-plans">Floor Plans</Link>
            <Link href="/standard-features">Standard Features</Link>
            <Link href="/build-on-your-land">Build On Your Land</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div className="hh-footer-base">
          <span>© 2026 BCHardy, LLC.</span>
          <span>{HARDY_HOMES_SERVICE_AREA_LINE}</span>
        </div>
      </div>
    </footer>
  );
}
