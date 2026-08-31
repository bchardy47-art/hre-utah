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

export type HardyHomeConcept = {
  name: string;
  slug: string;
  number: string;
  collection: string;
  collectionDescription?: string;
  squareFeet: number;
  bedrooms: string;
  bathrooms: string;
  garage?: string;
  tagline: string;
  description: string;
  philosophy: Array<{
    title: string;
    copy: string;
  }>;
  features: string[];
  dollhouseHeading?: string;
  dollhouseCopy?: string;
  designOptionsHeading: string;
  designOptionsCopy: string;
  interestHeading: string;
  interestCopy: string;
  futureCopy?: string;
  images: HardyHomeImage[];
};

export const hardyHomes: HardyHomeConcept[] = [
  {
    name: "The Brindle",
    slug: "brindle",
    number: "01",
    collection: "Cottage Collection",
    collectionDescription:
      "Smaller-footprint homes designed to make every square foot count.",
    squareFeet: 965,
    bedrooms: "2 Bedrooms",
    bathrooms: "2.5 Bathrooms",
    tagline: "Small footprint. Real home.",
    description:
      "The Brindle is designed for buyers who want the benefits of a new detached home without paying for square footage they do not need. Its efficient single-level layout combines a full-size kitchen, comfortable living spaces, two bedrooms, and dedicated bathrooms in just 965 square feet.",
    philosophy: [
      {
        title: "Smarter Footprints",
        copy: "Less wasted square footage without making the home feel cramped.",
      },
      {
        title: "Designed to Build",
        copy: "Plans are developed with construction, materials, layout efficiency, and real-world cost in mind.",
      },
      {
        title: "Make It Yours",
        copy: "Start with a Hardy Homes concept or work directly with Brian to create something for your property.",
      },
    ],
    features: [
      "Open kitchen + dining",
      "Separate living area",
      "2 bedrooms",
      "2 full bathrooms",
      "1 powder bathroom",
      "Full-size kitchen appliances",
      "Covered front porch",
      "Single-level living",
      "Efficient use of every square foot",
    ],
    dollhouseHeading: "See how 965 square feet can live.",
    dollhouseCopy:
      "The Brindle is built around usable space instead of wasted space. The open kitchen and dining area connect naturally to the living room while the bedrooms and bathrooms maintain separation and privacy.",
    designOptionsHeading: "Start with The Brindle. Make it yours.",
    designOptionsCopy:
      "Use The Brindle as the starting point or work with Brian to adjust the design for your property, priorities, and budget. Final plans, engineering, site requirements, and available modifications depend on the individual project.",
    interestHeading: "Interested in The Brindle?",
    interestCopy:
      "Tell me about your property and what you are looking for. I can help with design and preconstruction now, with construction services available through BCHardy, LLC when all applicable licensing, financing, permitting, site, and project requirements are satisfied.",
    futureCopy:
      "The Brindle is the first in a growing collection of efficient Hardy Homes concepts designed around real-life budgets, usable space, and practical construction.",
    images: [
      {
        key: "exterior",
        title: "Exterior rendering",
        alt: "Exterior rendering of The Brindle, a 965 square foot Hardy Homes concept",
        src: "/images/hardy-homes/lynx/LynxExt.jpg",
        priority: true,
        sizes: "(max-width: 980px) 100vw, 62vw",
        fit: "contain",
        position: "center bottom",
      },
      {
        key: "dollhouse",
        title: "Dollhouse layout view",
        alt: "Dollhouse view of The Brindle 2 bedroom 2.5 bathroom floor plan",
        src: "/images/hardy-homes/lynx/LynxDollhouse.jpg",
        sizes: "(max-width: 980px) 100vw, 38vw",
        fit: "contain",
        position: "center center",
      },
      {
        key: "kitchen",
        title: "Kitchen rendering",
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
    collection: "Single Family Collection",
    collectionDescription:
      "Thoughtfully designed homes with more room for everyday living.",
    squareFeet: 3209,
    bedrooms: "4 Bedrooms",
    bathrooms: "3.5 Bathrooms",
    garage: "3-Car Garage",
    tagline: "More room. Smarter flow.",
    description:
      "The Rock is a larger Hardy Homes concept designed for households that want generous living space, a practical layout, and the flexibility of a full single-family home. It brings together open gathering areas, private bedroom space, and a three-car garage in a plan shaped for everyday use.",
    philosophy: [],
    features: [],
    designOptionsHeading: "Start with The Rock. Make it yours.",
    designOptionsCopy:
      "Use The Rock as the starting point or work with Brian to adjust the design for your property, priorities, and budget. Final plans, engineering, site requirements, and available modifications depend on the individual project.",
    interestHeading: "Interested in The Rock?",
    interestCopy:
      "Tell me about your property and what you are looking for. I can help with design and preconstruction now, with construction services available through BCHardy, LLC when all applicable licensing, financing, permitting, site, and project requirements are satisfied.",
    images: [
      {
        key: "exterior-front",
        title: "Front exterior rendering",
        alt: "Front exterior rendering of The Rock Hardy Homes single family concept",
        src: "/images/hardy-homes/single-family/rock/RockExt.jpg",
        priority: true,
        sizes: "(max-width: 980px) 100vw, 62vw",
        fit: "contain",
        position: "center bottom",
      },
      {
        key: "kitchen-dining",
        title: "Kitchen and dining rendering",
        alt: "Kitchen and dining rendering inside The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockKitchenDining.jpg",
        sizes: "(max-width: 980px) 100vw, 38vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "living",
        title: "Living room rendering",
        alt: "Living room rendering inside The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockLiving.jpg",
        sizes: "(max-width: 980px) 100vw, 38vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "primary-bath",
        title: "Primary bathroom rendering",
        alt: "Primary bathroom rendering inside The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockPrimaryBath.jpg",
        sizes: "(max-width: 980px) 100vw, 38vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "primary-bedroom",
        title: "Primary bedroom rendering",
        alt: "Primary bedroom rendering inside The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockPrimaryBedroom.jpg",
        sizes: "(max-width: 980px) 100vw, 38vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "exterior-rear",
        title: "Rear exterior rendering",
        alt: "Rear exterior rendering of The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockExtRear.jpg",
        sizes: "(max-width: 980px) 100vw, 38vw",
        fit: "contain",
        position: "center bottom",
      },
      {
        key: "floor-plan-main",
        title: "Main floor plan",
        alt: "Main floor plan for The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockFloorPlanMain.png",
        sizes: "(max-width: 980px) 100vw, 31vw",
        fit: "contain",
        position: "center center",
      },
      {
        key: "floor-plan-upper",
        title: "Upper floor plan",
        alt: "Upper floor plan for The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockFloorPlanUpper.png",
        sizes: "(max-width: 980px) 100vw, 31vw",
        fit: "contain",
        position: "center center",
      },
      {
        key: "floor-plan-basement",
        title: "Basement floor plan",
        alt: "Basement floor plan for The Rock Hardy Homes concept",
        src: "/images/hardy-homes/single-family/rock/RockFloorPlanBasement.png",
        sizes: "(max-width: 980px) 100vw, 31vw",
        fit: "contain",
        position: "center center",
      },
    ],
  },
];

export const hardyHomeBySlug = Object.fromEntries(hardyHomes.map((home) => [home.slug, home]));
