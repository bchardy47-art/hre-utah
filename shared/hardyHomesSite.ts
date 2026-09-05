import type { HardyCollection, HardyHomeConcept } from "./hardyHomes";
import {
  getCollectionPath,
  getFloorPlansPath,
  getPlanPath,
  getStandardFeaturesPath,
} from "./hardyHomesRoutes";

export const DEFAULT_HARDY_HOMES_URL = "https://buildwithhardy.com";
export const HARDY_HOMES_CONTACT_EMAIL = "brian@hre-utah.com";
export const HARDY_HOMES_PHONE = "(801) 380-0445";
export const HARDY_HOMES_TEL = "8013800445";

function cleanUrl(value?: string | null) {
  const url = String(value || "").trim();
  return url ? url.replace(/\/+$/, "") : "";
}

export function getConfiguredHardyHomesUrl() {
  return cleanUrl(process.env.NEXT_PUBLIC_HARDY_HOMES_URL);
}

export function getHardyHomesProductionUrl() {
  return getConfiguredHardyHomesUrl() || DEFAULT_HARDY_HOMES_URL;
}

export function buildConfiguredHardyHomesUrl(path = "/") {
  const root = getConfiguredHardyHomesUrl();
  if (!root) return null;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${root}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function buildHardyHomesProductionUrl(path = "/") {
  const root = getHardyHomesProductionUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${root}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function getHardyHomesRootHref(fallback = "/hardy-homes") {
  return buildConfiguredHardyHomesUrl("/") ?? fallback;
}

export function getHardyHomesFloorPlansHref(fallback = "/hardy-homes/cottages") {
  return buildConfiguredHardyHomesUrl(getFloorPlansPath("standalone")) ?? fallback;
}

export function getHardyHomesStandardFeaturesHref(fallback = "/hardy-homes/standard") {
  return buildConfiguredHardyHomesUrl(getStandardFeaturesPath("standalone")) ?? fallback;
}

export function getHardyHomesPlanHref(home: HardyHomeConcept) {
  return buildConfiguredHardyHomesUrl(getPlanPath(home, "standalone")) ?? getPlanPath(home, "hre");
}

export function getHardyHomesCollectionHref(collection: HardyCollection) {
  return buildConfiguredHardyHomesUrl(getCollectionPath(collection, "standalone")) ?? getCollectionPath(collection, "hre");
}
