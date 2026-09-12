import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.hre-utah.com";

  // Hardy Homes plan/collection/standard pages are canonicalised to
  // buildahardyhome.com, so HRE no longer submits them for indexing.
  // The /hardy-homes gateway stays: it is unique HRE content.
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/drafting",
    "/real-estate",
    "/handyman",
    "/hardy-homes",
  ];

  return staticRoutes.map((route) => ({
    url: `${base}${route || "/"}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/hardy-homes" ? 0.9 : 0.8,
  }));
}
