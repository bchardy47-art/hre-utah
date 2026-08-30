export type HardyHomeImage = {
  key: string;
  title: string;
  alt: string;
  src?: string;
  note?: string;
  priority?: boolean;
  sizes?: string;
};

export type HardyHomeConcept = {
  name: string;
  slug: string;
  number: string;
  squareFeet: number;
  bedrooms: string;
  bathrooms: string;
  tagline: string;
  description: string;
  philosophy: Array<{
    title: string;
    copy: string;
  }>;
  features: string[];
  dollhouseHeading: string;
  dollhouseCopy: string;
  designOptionsHeading: string;
  designOptionsCopy: string;
  interestHeading: string;
  interestCopy: string;
  futureCopy: string;
  images: HardyHomeImage[];
};

export const hardyHomes: HardyHomeConcept[] = [
  {
    name: "The Lynx",
    slug: "lynx",
    number: "01",
    squareFeet: 965,
    bedrooms: "2 Bedrooms",
    bathrooms: "2.5 Bathrooms",
    tagline: "Small footprint. Real home.",
    description:
      "The Lynx is designed for buyers who want the benefits of a new detached home without paying for square footage they do not need. Its efficient single-level layout combines a full-size kitchen, comfortable living spaces, two bedrooms, and dedicated bathrooms in just 965 square feet.",
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
      "The Lynx is built around usable space instead of wasted space. The open kitchen and dining area connect naturally to the living room while the bedrooms and bathrooms maintain separation and privacy.",
    designOptionsHeading: "Start with The Lynx. Make it yours.",
    designOptionsCopy:
      "Use The Lynx as the starting point or work with Brian to adjust the design for your property, priorities, and budget. Final plans, engineering, site requirements, and available modifications depend on the individual project.",
    interestHeading: "Interested in The Lynx?",
    interestCopy:
      "Tell me about your property and what you are looking for. I can help with design and preconstruction now, with construction services available through BCHardy, LLC when all applicable licensing, financing, permitting, site, and project requirements are satisfied.",
    futureCopy:
      "The Lynx is the first in a growing collection of efficient Hardy Homes concepts designed around real-life budgets, usable space, and practical construction.",
    images: [
      {
        key: "exterior",
        title: "Exterior rendering",
        alt: "Exterior rendering of The Lynx Hardy Homes concept",
        note: "Production-ready exterior rendering will be added when a clean export is available.",
        priority: true,
        sizes: "(max-width: 980px) 100vw, 62vw",
      },
      {
        key: "dollhouse",
        title: "Dollhouse layout view",
        alt: "Dollhouse layout rendering of The Lynx Hardy Homes concept",
        note: "Production-ready dollhouse rendering will be added when a clean export is available.",
        sizes: "(max-width: 980px) 100vw, 38vw",
      },
      {
        key: "kitchen",
        title: "Kitchen rendering",
        alt: "Kitchen rendering of The Lynx Hardy Homes concept",
        note: "Production-ready kitchen rendering will be added when a clean export is available.",
        sizes: "(max-width: 980px) 100vw, 38vw",
      },
    ],
  },
];

export const hardyHomeBySlug = Object.fromEntries(hardyHomes.map((home) => [home.slug, home]));
