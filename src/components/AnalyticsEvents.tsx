"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";
import { HRE_EVENT, isHreEvent, pageLocation } from "@/lib/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const IDX_HOST = "hardyhomes-utah.com";

/**
 * Global, delegated conversion tracking.
 *
 * Events are derived from stable signals only — link protocol (tel:/sms:/mailto:),
 * destination hostname, and explicit data-ga-event / data-hre-event attributes we
 * control. Nothing here reads CSS classes, button text, or form field values, so it
 * will not silently break when copy or styling changes.
 *
 * Two independent destinations are fed from this one listener:
 *   - Google Analytics 4, via window.gtag (lower_snake_case names)
 *   - Vercel Web Analytics, via track() (the HRE conversion names)
 *
 * Because a single capture-phase listener owns all of it, one click produces exactly
 * one event per destination — shared components (Nav, Footer, CtaBand) cannot
 * double-count, and no button needs its own onClick handler.
 *
 * `location` defaults to the current route (homepage, real-estate-page, ...) and is
 * overridden by a data-hre-location attribute where a placement is more useful than
 * a page (header, footer, hero).
 *
 * No personally identifying information is ever sent.
 */
export default function AnalyticsEvents() {
  useEffect(() => {
    const send = (name: string, params: Record<string, unknown> = {}) => {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, params);
      }
    };

    /** Vercel Web Analytics — HRE conversion events. */
    const sendHre = (link: HTMLAnchorElement, href: string) => {
      const location =
        link.getAttribute("data-hre-location") || pageLocation(window.location.pathname);

      const explicit = link.getAttribute("data-hre-event");
      if (explicit) {
        // Only emit names from the known catalog, so a typo in markup stays inert
        // instead of quietly creating a junk series in the dashboard.
        if (isHreEvent(explicit)) track(explicit, { location });
        return;
      }

      // Fallback: contact-intent links anywhere on the site are conversions even
      // when they carry no attribute (footer, CTA bands, links page, thank-you).
      if (href.startsWith("sms:")) track(HRE_EVENT.TEXT_BRIAN_CLICK, { location });
      else if (href.startsWith("tel:")) track(HRE_EVENT.PHONE_CLICK, { location });
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute("href") || "";

      sendHre(link, href);

      const explicit = link.getAttribute("data-ga-event");
      if (explicit) {
        send(explicit);
        return;
      }

      if (href.startsWith("tel:")) return send("phone_click");
      if (href.startsWith("sms:")) return send("text_click");
      if (href.startsWith("mailto:")) return send("email_click");

      try {
        const url = new URL(href, window.location.href);
        if (url.hostname === IDX_HOST || url.hostname.endsWith("." + IDX_HOST)) {
          send("idx_search_click", { destination: url.hostname + url.pathname });
        }
      } catch {
        /* relative or malformed href — nothing to report */
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
