"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PHONE = "(801) 380-0445";
const TEL = "8013800445";

const NAV: [string, string][] = [
  ["Home", "/"],
  ["Real Estate", "/real-estate"],
  ["Handyman", "/handyman"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

const SmsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" />
    <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
  </svg>
);
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

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 980) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="container nav-inner">
        <Link className="logo" href="/" aria-label="Hardy Real Estate — HRE Handyman Services">
          <img className="logo-badge" src="/images/hre-logo.png" alt="HRE — Hardy Real Estate Handyman Services" />
        </Link>
        <nav className="nav-links">
          {NAV.map(([label, href]) => (
            <Link key={href} className={`nav-link${isActive(href) ? " active" : ""}`} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <a className="btn btn-primary nav-cta" href={`sms:${TEL}`}>
          <SmsIcon /> Text Brian
        </a>
        <button
          className="nav-burger"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="hre-mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      <nav
        className={`mobile-menu${open ? " open" : ""}`}
        id="hre-mobile-menu"
        aria-label="Mobile navigation"
      >
        {NAV.map(([label, href]) => (
          <Link
            key={href}
            className={`nav-mlink${isActive(href) ? " active" : ""}`}
            href={href}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
        <a className="btn btn-primary" href={`sms:${TEL}`} onClick={() => setOpen(false)}>
          <SmsIcon /> Text Brian
        </a>
      </nav>
    </header>
  );
}
