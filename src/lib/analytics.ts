/**
 * HRE conversion tracking — shared catalog.
 *
 * Event names are sent to Vercel Web Analytics via `track()` from
 * "@vercel/analytics". They are intentionally stable strings: renaming one
 * starts a brand new series in the Vercel dashboard, so treat these as an API.
 *
 * Every event carries a `location` property describing where on the site the
 * action happened, so the same conversion can be compared across placements.
 */

export const HRE_EVENT = {
  TEXT_BRIAN_CLICK: "Text_Brian_Click",
  PHONE_CLICK: "Phone_Click",
  WORK_WITH_BRIAN_CLICK: "Work_With_Brian_Click",
  REQUEST_SERVICE_CLICK: "Request_Service_Click",
  BUYER_INQUIRY_CLICK: "Buyer_Inquiry_Click",
  SELLER_INQUIRY_CLICK: "Seller_Inquiry_Click",
  DRAFTING_INQUIRY_CLICK: "Drafting_Inquiry_Click",
  CONTACT_FORM_SUCCESS: "Contact_Form_Success",
  SERVICE_FORM_SUCCESS: "Service_Form_Success",
} as const;

export type HreEventName = (typeof HRE_EVENT)[keyof typeof HRE_EVENT];

/** Every event name we are willing to emit, for validating data attributes. */
const KNOWN_EVENTS: ReadonlySet<string> = new Set(Object.values(HRE_EVENT));

export function isHreEvent(name: string | null | undefined): name is HreEventName {
  return !!name && KNOWN_EVENTS.has(name);
}

/**
 * Default `location` for an event, derived from the current route.
 * Elements can override this with a `data-hre-location` attribute
 * (for example "header", "footer" or "hero").
 */
export function pageLocation(pathname: string): string {
  const path = (pathname || "/").replace(/\/+$/, "") || "/";
  if (path === "/") return "homepage";
  const slug = path.split("/").filter(Boolean)[0] ?? "";
  return slug ? `${slug}-page` : "homepage";
}
