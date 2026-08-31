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
  slug: string;
  title: string;
  path: string;
  description: string;
  image: HardyHomeImage;
};

export type HardyHomeConcept = {
  name: string;
  slug: string;
  number: string;
  collectionSlug: string;
  collection: string;
  collectionPath: string;
  detailPath: string;
  squareFeet: number;
  bedrooms: string;
  bathrooms: string;
  garage?: string;
  tagline: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  layoutHeading?: string;
  designOptionsHeading: string;
  designOptionsCopy: string;
  interestHeading: string;
  interestCopy: string;
  futureCopy?: string;
  images: HardyHomeImage[];
};

export const hardyStandardCopy = {
  heading: "The Hardy Standard",
  title: "A defined starting point for quality, function, and finish.",
  body:
    "A Hardy Home starts with a thoughtful standard of quality, functionality, and finishes. We’re building our homes around features we believe should come standard — with curated options available for buyers who want to personalize further.",
  note: "Full Hardy Standard specifications coming soon.",
};

export const hardyCollections: HardyCollection[] = [
  {
    slug: "cottages",
    title: "Cottage Floor Plans",
    path: "/hardy-homes/cottages",
    description:
      "Smaller-footprint detached homes designed to make every square foot count.",
    image: {
      key: "brindle-collection",
      title: "The Brindle exterior",
      alt: "Exterior rendering of The Brindle Hardy Homes cottage plan",
      src: "/images/hardy-homes/lynx/LynxExt.jpg",
      priority: true,
      sizes: "(max-width: 980px) 100vw, 44vw",
      fit: "contain",
      position: "center bottom",
    },
  },
  {
    slug: "single-family",
    title: "Single Family Floor Plans",
    path: "/hardy-homes/single-family",
    description:
      "Thoughtfully designed homes with more room for everyday living.",
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
    number: "01",
    collectionSlug: "cottages",
    collection: "Cottage Collection",
    collectionPath: "/hardy-homes/cottages",
    detailPath: "/hardy-homes/cottages/brindle",
    squareFeet: 965,
    bedrooms: "2 Bedrooms",
    bathrooms: "2.5 Bathrooms",
    tagline: "Small-footprint living without giving up the spaces that matter.",
    shortDescription: "Small-footprint living without giving up the spaces that matter.",
    description:
      "The Brindle is a compact Hardy Homes plan designed to keep the footprint efficient while still delivering the everyday spaces that matter most.",
    highlights: [
      "Single-level living",
      "Open kitchen + dining",
      "Separate living area",
      "2 bedrooms",
      "2 full baths + powder bath",
      "Covered front porch",
      "Efficient use of space",
    ],
    layoutHeading: "Layout",
    designOptionsHeading: "Interested in The Brindle?",
    designOptionsCopy:
      "Use The Brindle as the starting point or work with Brian to adjust the design for your property, priorities, and budget. Final plans, engineering, site requirements, and available modifications depend on the individual project.",
    interestHeading: "Customize The Brindle",
    interestCopy:
      "I can help with design and preconstruction now, with construction services available through BCHardy, LLC when all applicable licensing, financing, permitting, site, and project requirements are satisfied.",
    futureCopy:
      "The Brindle is the first in a growing collection of efficient Hardy Homes concepts designed around real-life budgets, usable space, and practical construction.",
    images: [
      {
        key: "exterior",
        title: "Exterior",
        alt: "Exterior rendering of The Brindle, a 965 square foot Hardy Homes concept",
        src: "/images/hardy-homes/lynx/LynxExt.jpg",
        priority: true,
        sizes: "(max-width: 980px) 100vw, 62vw",
        fit: "contain",
        position: "center bottom",
      },
      {
        key: "dollhouse",
        title: "Layout",
        alt: "Dollhouse view of The Brindle 2 bedroom 2.5 bathroom floor plan",
        src: "/images/hardy-homes/lynx/LynxDollhouse.jpg",
        sizes: "(max-width: 980px) 100vw, 38vw",
        fit: "contain",
        position: "center center",
      },
      {
        key: "kitchen",
        title: "Kitchen",
        alt: "Kitchen rendering inside The Brindle Hardy Homes concept",
        src: "/images/hardy-homes/lynx/LynxKitchen.jpg",
        sizes: "(max-width: 980px) 100vw, 38vw",
        fit: "cover",
        position: "center center",
      },
    ],
  },
  {
    name: "The Rock",
    slug: "rock",
    number: "02",
    collectionSlug: "single-family",
    collection: "Single Family Collection",
    collectionPath: "/hardy-homes/single-family",
    detailPath: "/hardy-homes/single-family/rock",
    squareFeet: 3209,
    bedrooms: "4 Bedrooms",
    bathrooms: "3.5 Bathrooms",
    garage: "3-Car Garage",
    tagline: "A spacious family home with open gathering spaces and private retreats.",
    shortDescription: "A spacious family home with open gathering spaces and private retreats.",
    description:
      "The Rock is a larger Hardy Homes plan designed for families who want generous common spaces, private retreats, and room to grow.",
    highlights: [
      "Open gathering spaces",
      "4 bedrooms",
      "3.5 bathrooms",
      "3-car garage",
      "Main, upper, and basement floor plans",
    ],
    designOptionsHeading: "Interested in The Rock?",
    designOptionsCopy:
      "Use The Rock as the starting point or work with Brian to adjust the design for your property, priorities, and budget. Final plans, engineering, site requirements, and available modifications depend on the individual project.",
    interestHeading: "Customize The Rock",
    interestCopy:
      "I can help with design and preconstruction now, with construction services available through BCHardy, LLC when all applicable licensing, financing, permitting, site, and project requirements are satisfied.",
    images: [
      {
        key: "exterior-front",
        title: "Front Exterior",
        alt: "Front exterior rendering of The Rock Hardy Homes single family concept",
        src: "/images/hardy-homes/single-family/rock/RockExt.jpg",
        priority: true,
        sizes: "(max-width: 980px) 100vw, 62vw",
        fit: "contain",
        position: "center bottom",
      },
      {
        key: "kitchen-dining",
        title: "Kitchen + Dining",
        alt: "Kitchen and dining rendering inside The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockKitchenDining.jpg",
        sizes: "(max-width: 980px) 100vw, 38vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "living",
        title: "Living",
        alt: "Living room rendering inside The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockLiving.jpg",
        sizes: "(max-width: 980px) 100vw, 38vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "primary-bath",
        title: "Primary Bath",
        alt: "Primary bathroom rendering inside The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockPrimaryBath.jpg",
        sizes: "(max-width: 980px) 100vw, 38vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "primary-bedroom",
        title: "Primary Bedroom",
        alt: "Primary bedroom rendering inside The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockPrimaryBedroom.jpg",
        sizes: "(max-width: 980px) 100vw, 38vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "exterior-rear",
        title: "Rear Exterior",
        alt: "Rear exterior rendering of The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockExtRear.jpg",
        sizes: "(max-width: 980px) 100vw, 38vw",
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

export function getHardyCollection(slug: string) {
  return hardyCollections.find((collection) => collection.slug === slug);
}

export function getHardyHome(slug: string) {
  return hardyHomes.find((home) => home.slug === slug);
}
