"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PRIMARY_NAV = [
  { label: "Floor Plans", href: "/floor-plans" },
  { label: "Collections", href: "/collections" },
  { label: "Standard Features", href: "/standard-features" },
  { label: "Build On Your Land", href: "/build-on-your-land" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
];

const MOBILE_NAV = [
  { label: "Home", href: "/" },
  ...PRIMARY_NAV,
  { label: "Options & Upgrades", href: "/options" },
  { label: "Financing", href: "/financing" },
  { label: "Contact", href: "/contact" },
];

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export default function HardyHomesNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 980) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="hh-nav">
      <div className="container hh-nav-inner">
        <Link href="/" className="hh-brand" aria-label="Hardy Homes home">
          <Image
            src="/brand/hardy-homes-logo-header.png"
            alt="Hardy Homes"
            width={1153}
            height={738}
            priority
            sizes="(max-width: 980px) 160px, 210px"
            className="hh-brand-logo"
          />
        </Link>
        <nav className="hh-nav-links" aria-label="Primary navigation">
          {PRIMARY_NAV.map((item) => (
            <Link key={item.href} href={item.href} className={`hh-nav-link${isActive(item.href) ? " active" : ""}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hh-nav-actions">
          <Link className="btn btn-ghost" href="/contact">Contact</Link>
          <Link className="btn btn-primary" href="/contact">Start Your Build</Link>
        </div>
        <button
          className="hh-nav-burger"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="hh-mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      <nav className={`hh-mobile-menu${open ? " open" : ""}`} id="hh-mobile-menu" aria-label="Mobile navigation">
        {MOBILE_NAV.map((item) => (
          <Link key={item.href} href={item.href} className={`hh-nav-link${isActive(item.href) ? " active" : ""}`} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <div className="hh-mobile-actions">
          <Link className="btn btn-ghost" href="/contact" onClick={() => setOpen(false)}>Contact Hardy Homes</Link>
          <Link className="btn btn-primary" href="/contact" onClick={() => setOpen(false)}>Start Your Build</Link>
        </div>
      </nav>
    </header>
  );
}
