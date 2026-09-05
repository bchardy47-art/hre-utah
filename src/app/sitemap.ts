import type { MetadataRoute } from "next";
import { hardyCollections, getPublicHardyHomes } from "@/lib/hardyHomes";
import { getCollectionPath, getPlanPath } from "@/lib/hardyHomesRoutes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.hre-utah.com";
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/drafting",
    "/real-estate",
    "/handyman",
    "/hardy-homes",
    "/hardy-homes/standard",
  ];

  const hardyRoutes = [
    ...hardyCollections.map((collection) => getCollectionPath(collection, "hre")),
    ...getPublicHardyHomes().map((home) => getPlanPath(home, "hre")),
  ];

  const routes = [...new Set([...staticRoutes, ...hardyRoutes])];

  return routes.map((route) => ({
    url: `${base}${route || "/"}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/hardy-homes") ? 0.9 : 0.8,
  }));
}
