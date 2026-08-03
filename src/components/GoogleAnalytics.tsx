import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Loads the GA4 Google tag once, globally, from the root layout.
 * Renders nothing when the measurement ID is absent (e.g. local dev),
 * so no partial/duplicate tag is ever emitted.
 *
 * Cross-domain measurement between hre-utah.com and hardyhomes-utah.com is
 * configured in the GA4 data stream settings, so gtag.js handles link
 * decoration automatically — no linker config is needed here.
 */
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
