export type HardyCollectionSlug = "cottages" | "single-family";
export type HardyStandaloneCollectionSlug = "cottage" | "single-family";
export type HardyHomeStatus = "active" | "inventory";

export type HardyHomeImage = {
  key: string;
  title: string;
  alt: string;
  src: string;
  priority?: boolean;
  sizes?: string;
  fit?: "cover" | "contain";
  position?: string;
};

export type HardyCollection = {
  slug: HardyCollectionSlug;
  standaloneSlug: HardyStandaloneCollectionSlug;
  title: string;
  shortTitle: string;
  description: string;
  image: HardyHomeImage;
};

export type HardyHomeConcept = {
  name: string;
  slug: string;
  standaloneSlug: string;
  collectionSlug: HardyCollectionSlug;
  collection: string;
  squareFeet: number;
  bedrooms: string;
  bathrooms: string;
  garage?: string;
  stories?: string;
  shortDescription: string;
  heroCopy: string;
  ctaLabel: string;
  ctaCopy: string;
  highlights: string[];
  images: HardyHomeImage[];
  publicStatus: HardyHomeStatus;
  featuredOnGateway?: boolean;
  featuredOnStandaloneHome?: boolean;
};

export type HardyStandardIconKey =
  | "structure"
  | "efficiency"
  | "finish"
  | "technology"
  | "storage"
  | "exterior";

export type HardyStandardFeature = {
  key: string;
  title: string;
  description?: string;
  icon?: HardyStandardIconKey;
};

export const hardyStandardCopy = {
  heading: "The Hardy Standard",
  body:
    "A Hardy Home starts with a defined standard of quality, function, and finish — so buyers understand what's included before they start choosing upgrades.",
  action: "Learn More",
  note:
    "Final specifications vary by home, site, jurisdiction, and selected options. A complete construction specification is provided before contract.",
};

export const hardyStandardHighlights = [
  "2x6 exterior wall construction",
  "Tankless water heater",
  "A competitive builder-grade standard package designed to compare well with strong Utah production builders",
] as const;

export const hardyCollections: HardyCollection[] = [
  {
    slug: "cottages",
    standaloneSlug: "cottage",
    title: "Cottage Collection",
    shortTitle: "Cottage Homes",
    description: "Smaller homes designed around efficient use of space.",
    image: {
      key: "flint-collection",
      title: "The Flint exterior",
      alt: "Exterior rendering of The Flint Hardy Homes cottage plan",
      src: "/images/hardy-homes/flint/FlintExterior.jpg",
      priority: true,
      sizes: "(max-width: 980px) 100vw, 44vw",
      fit: "contain",
      position: "center bottom",
    },
  },
  {
    slug: "single-family",
    standaloneSlug: "single-family",
    title: "Single Family Collection",
    shortTitle: "Single Family Homes",
    description: "Full-size homes designed for everyday family living.",
    image: {
      key: "rock-collection",
      title: "The Rock exterior",
      alt: "Front exterior rendering of The Rock Hardy Homes single family plan",
      src: "/images/hardy-homes/single-family/rock/RockExt.jpg",
      priority: true,
      sizes: "(max-width: 980px) 100vw, 44vw",
      fit: "contain",
      position: "center bottom",
    },
  },
];

export const hardyHomes: HardyHomeConcept[] = [
  {
    name: "The Brindle",
    slug: "brindle",
    standaloneSlug: "the-brindle",
    collectionSlug: "cottages",
    collection: "Cottage Collection",
    squareFeet: 965,
    bedrooms: "2 Bedrooms",
    bathrooms: "2.5 Bathrooms",
    stories: "Single Level",
    shortDescription: "Compact single-level living with the spaces that matter.",
    heroCopy: "Everything you need. Nothing you don't.",
    ctaLabel: "Ask About The Brindle",
    ctaCopy: "Tell us about your property and what you want to build.",
    highlights: [
      "Single-level living",
      "2 bedrooms",
      "2.5 bathrooms",
      "Open kitchen + dining",
      "Separate living area",
      "Covered front porch",
    ],
    publicStatus: "active",
    featuredOnGateway: true,
    featuredOnStandaloneHome: true,
    images: [
      {
        key: "exterior",
        title: "Exterior",
        alt: "Exterior rendering of The Brindle, a 965 square foot Hardy Homes concept",
        src: "/images/hardy-homes/brindle/BrindleExterior3.jpeg",
        priority: true,
        sizes: "(max-width: 980px) 100vw, 72vw",
        fit: "contain",
        position: "center bottom",
      },
      {
        key: "kitchen",
        title: "Kitchen",
        alt: "Kitchen rendering inside The Brindle Hardy Homes concept",
        src: "/images/hardy-homes/brindle/BrindleKitchen.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "layout",
        title: "Layout",
        alt: "Dollhouse view of The Brindle 2 bedroom 2.5 bathroom floor plan",
        src: "/images/hardy-homes/brindle/BrindleDollhouse.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "contain",
        position: "center center",
      },
    ],
  },
  {
    name: "The Flint",
    slug: "flint",
    standaloneSlug: "the-flint",
    collectionSlug: "cottages",
    collection: "Cottage Collection",
    squareFeet: 983,
    bedrooms: "1 Bedroom",
    bathrooms: "1.5 Bathrooms",
    stories: "Single Level",
    shortDescription: "Compact single-level living with the spaces that matter.",
    heroCopy: "Small footprint. Smart layout.",
    ctaLabel: "Ask About The Flint",
    ctaCopy: "Tell us about your property and what you want to build.",
    highlights: [
      "Single-level living",
      "1 bedroom",
      "1.5 bathrooms",
      "Efficient use of space",
      "Practical cottage layout",
    ],
    publicStatus: "active",
    featuredOnStandaloneHome: false,
    images: [
      {
        key: "exterior",
        title: "Exterior",
        alt: "Exterior rendering of The Flint Hardy Homes cottage",
        src: "/images/hardy-homes/flint/FlintExterior.jpg",
        priority: true,
        sizes: "(max-width: 980px) 100vw, 72vw",
        fit: "contain",
        position: "center bottom",
      },
      {
        key: "kitchen",
        title: "Kitchen",
        alt: "Kitchen rendering inside The Flint Hardy Homes cottage",
        src: "/images/hardy-homes/flint/FlintKitchen.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "layout",
        title: "Floor Plan",
        alt: "Top-down floor plan rendering of The Flint Hardy Homes cottage",
        src: "/images/hardy-homes/flint/FlintFloorPlan.png",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "contain",
        position: "center center",
      },
      {
        key: "rear",
        title: "Rear Exterior",
        alt: "Rear exterior rendering of The Flint Hardy Homes cottage",
        src: "/images/hardy-homes/flint/FlintRear.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "contain",
        position: "center bottom",
      },
    ],
  },
  {
    name: "The Rock",
    slug: "rock",
    standaloneSlug: "the-rock",
    collectionSlug: "single-family",
    collection: "Single Family Collection",
    squareFeet: 3209,
    bedrooms: "4 Bedrooms",
    bathrooms: "3.5 Bathrooms",
    garage: "3-Car Garage",
    stories: "Two Story",
    shortDescription: "A spacious family home with open gathering areas and private retreats.",
    heroCopy: "A spacious family home with open gathering areas, private retreats, and room to grow.",
    ctaLabel: "Ask About The Rock",
    ctaCopy: "Tell us about your property and what you want to build.",
    highlights: [
      "4 bedrooms",
      "3.5 bathrooms",
      "3-car garage",
      "Open gathering spaces",
      "Private retreats",
      "Main, upper, and basement floor plans",
    ],
    publicStatus: "active",
    featuredOnGateway: true,
    featuredOnStandaloneHome: true,
    images: [
      {
        key: "exterior-front",
        title: "Front Exterior",
        alt: "Front exterior rendering of The Rock Hardy Homes single family concept",
        src: "/images/hardy-homes/single-family/rock/RockExt.jpg",
        priority: true,
        sizes: "(max-width: 980px) 100vw, 72vw",
        fit: "contain",
        position: "center bottom",
      },
      {
        key: "kitchen-dining",
        title: "Kitchen + Dining",
        alt: "Kitchen and dining rendering inside The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockKitchenDining.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "living",
        title: "Living",
        alt: "Living room rendering inside The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockLiving.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "primary-bath",
        title: "Primary Bath",
        alt: "Primary bathroom rendering inside The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockPrimaryBath.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "primary-bedroom",
        title: "Primary Bedroom",
        alt: "Primary bedroom rendering inside The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockPrimaryBedroom.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "exterior-rear",
        title: "Rear Exterior",
        alt: "Rear exterior rendering of The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockExtRear.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "contain",
        position: "center bottom",
      },
      {
        key: "floor-plan-main",
        title: "Main Floor",
        alt: "Main floor plan for The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockFloorPlanMain.png",
        sizes: "(max-width: 980px) 100vw, 31vw",
        fit: "contain",
        position: "center center",
      },
      {
        key: "floor-plan-upper",
        title: "Upper Floor",
        alt: "Upper floor plan for The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockFloorPlanUpper.png",
        sizes: "(max-width: 980px) 100vw, 31vw",
        fit: "contain",
        position: "center center",
      },
      {
        key: "floor-plan-basement",
        title: "Basement",
        alt: "Basement floor plan for The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockFloorPlanBasement.png",
        sizes: "(max-width: 980px) 100vw, 31vw",
        fit: "contain",
        position: "center center",
      },
    ],
  },
];

export const hardyHomeBySlug = Object.fromEntries(
  hardyHomes.map((home) => [home.slug, home])
) as Record<string, HardyHomeConcept>;

export function getHardyCollection(slug: HardyCollectionSlug) {
  return hardyCollections.find((collection) => collection.slug === slug);
}

export function getHardyCollectionByStandaloneSlug(slug: HardyStandaloneCollectionSlug | string) {
  return hardyCollections.find((collection) => collection.standaloneSlug === slug);
}

export function getHardyHome(slug: string) {
  return hardyHomes.find((home) => home.slug === slug);
}

export function getHardyHomeByStandaloneSlug(slug: string) {
  return hardyHomes.find((home) => home.standaloneSlug === slug);
}

export function getPublicHardyHomes() {
  return hardyHomes.filter((home) => home.publicStatus === "active");
}

export function getGatewayFeaturedHomes() {
  return hardyHomes.filter((home) => home.featuredOnGateway);
}

export function getStandaloneFeaturedHomes() {
  return hardyHomes.filter((home) => home.featuredOnStandaloneHome);
}

export function getHardyPrimaryImage(home: HardyHomeConcept) {
  return (
    home.images.find((image) => image.key === "exterior") ??
    home.images.find((image) => image.key === "exterior-front") ??
    home.images[0]
  );
}

export function getHardyCollectionForHome(home: HardyHomeConcept) {
  return getHardyCollection(home.collectionSlug)!;
}

export function getHardyPlanFloorImages(home: HardyHomeConcept) {
  return home.images.filter((image) => image.key.includes("floor-plan") || image.key === "layout");
}
