import type { MetadataRoute } from "next";
import {
  getPublicHardyHomes,
  hardyCollections,
} from "@hardy-homes/shared/hardyHomes";
import { DEFAULT_HARDY_HOMES_URL } from "@hardy-homes/shared/hardyHomesSite";
import {
  getCollectionPath,
  getFloorPlansPath,
  getPlanPath,
  getStandardFeaturesPath,
  getOptionsPath,
  getBuildOnYourLandPath,
  getHowItWorksPath,
  getFinancingPath,
  getAboutPath,
  getContactPath,
} from "@hardy-homes/shared/hardyHomesRoutes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_HARDY_HOMES_URL || DEFAULT_HARDY_HOMES_URL;
  const staticRoutes = [
    "/",
    getFloorPlansPath("standalone"),
    "/collections",
    getStandardFeaturesPath("standalone"),
    getOptionsPath("standalone"),
    getBuildOnYourLandPath("standalone"),
    getHowItWorksPath("standalone"),
    getFinancingPath("standalone"),
    getAboutPath("standalone"),
    getContactPath("standalone"),
  ];
  const collectionRoutes = hardyCollections.map((collection) => getCollectionPath(collection, "standalone"));
  const planRoutes = getPublicHardyHomes().map((home) => getPlanPath(home, "standalone"));
  const routes = [...new Set([...staticRoutes, ...collectionRoutes, ...planRoutes])];

  return routes.map((route) => ({
    url: `${base.replace(/\/+$/, "")}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/floor-plans") ? 0.9 : 0.8,
  }));
}
