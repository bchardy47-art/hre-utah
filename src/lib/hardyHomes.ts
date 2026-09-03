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
  shortTitle: string;
  path: string;
  description: string;
  image: HardyHomeImage;
};

export type HardyHomeConcept = {
  name: string;
  slug: string;
  collectionSlug: string;
  collection: string;
  collectionPath: string;
  detailPath: string;
  squareFeet: number;
  bedrooms: string;
  bathrooms: string;
  garage?: string;
  shortDescription: string;
  ctaLabel: string;
  ctaCopy: string;
  highlights: string[];
  images: HardyHomeImage[];
};

export const hardyStandardCopy = {
  heading: "The Hardy Standard",
  body:
    "A Hardy Home starts with a defined standard of quality, function, and finish — so buyers understand what's included before they start choosing upgrades.",
  action: "Learn More",
  note:
    "Final specifications vary by home, site, jurisdiction, and selected options. A complete construction specification is provided before contract.",
};

export const hardyCollections: HardyCollection[] = [
  {
    slug: "cottages",
    title: "Cottage Floor Plans",
    shortTitle: "Cottage Homes",
    path: "/hardy-homes/cottages",
    description: "Smaller homes designed around efficient use of space.",
    image: {
      key: "brindle-collection",
      title: "The Brindle exterior",
      alt: "Exterior rendering of The Brindle Hardy Homes cottage plan",
      src: "/images/hardy-homes/brindle/BrindleExterior.jpg",
      priority: true,
      sizes: "(max-width: 980px) 100vw, 44vw",
      fit: "contain",
      position: "center bottom",
    },
  },
  {
    slug: "single-family",
    title: "Single Family Floor Plans",
    shortTitle: "Single Family Homes",
    path: "/hardy-homes/single-family",
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
    collectionSlug: "cottages",
    collection: "Cottage Collection",
    collectionPath: "/hardy-homes/cottages",
    detailPath: "/hardy-homes/cottages/brindle",
    squareFeet: 965,
    bedrooms: "2 Bedrooms",
    bathrooms: "2.5 Bathrooms",
    shortDescription: "Compact single-level living with the spaces that matter.",
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
    images: [
      {
        key: "exterior",
        title: "Exterior",
        alt: "Exterior rendering of The Brindle, a 965 square foot Hardy Homes concept",
        src: "/images/hardy-homes/brindle/BrindleExterior.jpg",
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
    collectionSlug: "cottages",
    collection: "Cottage Collection",
    collectionPath: "/hardy-homes/cottages",
    detailPath: "/hardy-homes/cottages/flint",
    squareFeet: 983,
    bedrooms: "1 Bedroom",
    bathrooms: "1.5 Bathrooms",
    shortDescription: "Compact single-level living with the spaces that matter.",
    ctaLabel: "Ask About The Flint",
    ctaCopy: "Tell us about your property and what you want to build.",
    highlights: [
      "Single-level living",
      "1 bedroom",
      "1.5 bathrooms",
      "Efficient use of space",
      "Practical cottage layout",
    ],
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
    collectionSlug: "single-family",
    collection: "Single Family Collection",
    collectionPath: "/hardy-homes/single-family",
    detailPath: "/hardy-homes/single-family/rock",
    squareFeet: 3209,
    bedrooms: "4 Bedrooms",
    bathrooms: "3.5 Bathrooms",
    garage: "3-Car Garage",
    shortDescription: "A spacious family home with open gathering areas and private retreats.",
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

export function getHardyCollection(slug: string) {
  return hardyCollections.find((collection) => collection.slug === slug);
}

export function getHardyHome(slug: string) {
  return hardyHomes.find((home) => home.slug === slug);
}
