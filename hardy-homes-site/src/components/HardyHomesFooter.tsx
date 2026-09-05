import Link from "next/link";

export default function HardyHomesFooter() {
  return (
    <footer className="hh-footer">
      <div className="container">
        <div className="hh-footer-grid">
          <div className="hh-footer-brand-copy">
            <strong>Hardy Homes by BCHardy, LLC</strong>
            <span>Thoughtfully designed homes. Straightforward building. Built on your land.</span>
            <small>Hardy Homes is the homebuilding brand. Real estate brokerage services remain part of HRE.</small>
          </div>
          <div>
            <h5>Floor Plans</h5>
            <Link href="/floor-plans">All Floor Plans</Link>
            <Link href="/collections/cottage">Cottage Collection</Link>
            <Link href="/collections/single-family">Single Family Collection</Link>
          </div>
          <div>
            <h5>Build</h5>
            <Link href="/standard-features">Standard Features</Link>
            <Link href="/options">Options &amp; Upgrades</Link>
            <Link href="/build-on-your-land">Build On Your Land</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/financing">Financing</Link>
          </div>
          <div>
            <h5>Company</h5>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/contact">Start Your Build</Link>
          </div>
        </div>
        <div className="hh-footer-base">
          <span>© 2026 BCHardy, LLC. All rights reserved.</span>
          <span>Hardy Homes</span>
        </div>
      </div>
    </footer>
  );
}
