"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const LEGACY_HASH_ROUTES: Record<string, string> = {
  "#brindle": "/hardy-homes/cottages/brindle",
  "#lynx": "/hardy-homes/cottages/brindle",
  "#single-family-collection": "/hardy-homes/single-family",
};

export default function LegacyHardyHomesRedirect() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/hardy-homes") return;

    const redirect = () => {
      const target = LEGACY_HASH_ROUTES[window.location.hash];
      if (!target) return;
      window.location.replace(target);
    };

    redirect();
    window.addEventListener("hashchange", redirect);
    return () => window.removeEventListener("hashchange", redirect);
  }, [pathname]);

  return null;
}
