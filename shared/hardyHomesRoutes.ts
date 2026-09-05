import type { HardyCollection, HardyCollectionSlug, HardyHomeConcept } from "./hardyHomes";

export type HardySiteTarget = "hre" | "standalone";

const HRE_HARDY_ROOT = "/hardy-homes";

export function getHreHardyRootPath() {
  return HRE_HARDY_ROOT;
}

export function getStandaloneRootPath() {
  return "/";
}

export function getHomePath(site: HardySiteTarget) {
  return site === "hre" ? "/" : "/";
}

export function getFloorPlansPath(site: HardySiteTarget) {
  return site === "hre" ? HRE_HARDY_ROOT : "/floor-plans";
}

export function getCollectionPath(collection: Pick<HardyCollection, "slug" | "standaloneSlug">, site: HardySiteTarget) {
  if (site === "hre") {
    return collection.slug === "cottages"
      ? `${HRE_HARDY_ROOT}/cottages`
      : `${HRE_HARDY_ROOT}/single-family`;
  }

  return `/collections/${collection.standaloneSlug}`;
}

export function getPlanPath(home: Pick<HardyHomeConcept, "slug" | "standaloneSlug" | "collectionSlug">, site: HardySiteTarget) {
  if (site === "hre") {
    const collectionPath = home.collectionSlug === "cottages" ? "cottages" : "single-family";
    return `${HRE_HARDY_ROOT}/${collectionPath}/${home.slug}`;
  }

  return `/floor-plans/${home.standaloneSlug}`;
}

export function getStandardFeaturesPath(site: HardySiteTarget) {
  return site === "hre" ? `${HRE_HARDY_ROOT}/standard` : "/standard-features";
}

export function getOptionsPath(site: HardySiteTarget) {
  return site === "hre" ? HRE_HARDY_ROOT : "/options";
}

export function getBuildOnYourLandPath(site: HardySiteTarget) {
  return site === "hre" ? HRE_HARDY_ROOT : "/build-on-your-land";
}

export function getHowItWorksPath(site: HardySiteTarget) {
  return site === "hre" ? HRE_HARDY_ROOT : "/how-it-works";
}

export function getFinancingPath(site: HardySiteTarget) {
  return site === "hre" ? HRE_HARDY_ROOT : "/financing";
}

export function getAboutPath(site: HardySiteTarget) {
  return site === "hre" ? "/about" : "/about";
}

export function getContactPath(site: HardySiteTarget) {
  return site === "hre" ? "/contact" : "/contact";
}

export function getLegacyHreToStandaloneRedirects(homes: HardyHomeConcept[], collections: HardyCollection[]) {
  const redirects = [
    {
      from: HRE_HARDY_ROOT,
      to: "/",
    },
    {
      from: `${HRE_HARDY_ROOT}/standard`,
      to: getStandardFeaturesPath("standalone"),
    },
  ];

  return [
    ...redirects,
    ...collections.map((collection) => ({
      from: getCollectionPath(collection, "hre"),
      to: getCollectionPath(collection, "standalone"),
    })),
    ...homes.map((home) => ({
      from: getPlanPath(home, "hre"),
      to: getPlanPath(home, "standalone"),
    })),
  ];
}

export function findCollectionBySlug<T extends HardyCollection>(collections: T[], slug: HardyCollectionSlug) {
  return collections.find((collection) => collection.slug === slug);
}

export function findCollectionByStandaloneSlug<T extends HardyCollection>(collections: T[], slug: string) {
  return collections.find((collection) => collection.standaloneSlug === slug);
}

export function findHomeByStandaloneSlug<T extends HardyHomeConcept>(homes: T[], slug: string) {
  return homes.find((home) => home.standaloneSlug === slug);
}
