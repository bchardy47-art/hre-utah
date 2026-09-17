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
  /**
   * Plan exists only on the standalone Hardy Homes site. The HRE gateway has
   * no legacy route or image copies for it, so gateway listings skip it.
   */
  standaloneOnly?: boolean;
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

export type HardyCollectionStandardConfig = {
  eyebrow: string;
  heading: string;
  copy: string;
  ctaLabel: string;
  features: HardyStandardFeature[];
  planHighlights: HardyStandardFeature[];
  collectionCalloutHighlights: HardyStandardFeature[];
};

const CORE_STANDARD_FEATURES: HardyStandardFeature[] = [
  {
    key: "2x6-exterior-walls",
    title: "2×6 Exterior Wall Construction",
    description: "A stronger wall assembly that supports durability, insulation, and long-term comfort.",
    icon: "structure",
  },
  {
    key: "tankless-water-heater",
    title: "High-Efficiency Tankless Water Heater",
    description: "Efficient hot water performance without a bulky storage tank footprint.",
    icon: "efficiency",
  },
  {
    key: "low-e-windows",
    title: "Low-E Energy-Efficient Windows",
    description: "Windows selected to support comfort, efficiency, and everyday livability.",
    icon: "efficiency",
  },
  {
    key: "high-efficiency-hvac",
    title: "High-Efficiency HVAC",
    description: "Heating and cooling systems chosen to support comfort and energy-conscious performance.",
    icon: "efficiency",
  },
  {
    key: "smart-thermostat",
    title: "Smart Thermostat",
    description: "Simple day-to-day control over comfort and energy use.",
    icon: "technology",
  },
  {
    key: "quartz-countertops",
    title: "Quartz Countertops",
    description: "Durable, low-maintenance surfaces in the spaces that work hardest.",
    icon: "finish",
  },
  {
    key: "soft-close-cabinetry",
    title: "Soft-Close Cabinetry",
    description: "A finished, everyday detail that improves how kitchens and baths feel to use.",
    icon: "finish",
  },
  {
    key: "led-lighting",
    title: "LED Lighting Throughout",
    description: "Efficient, long-lasting lighting carried throughout the home.",
    icon: "efficiency",
  },
  {
    key: "lvp-main-living",
    title: "LVP in Primary Living Areas",
    description: "Durable flooring selected for the spaces where life actually happens.",
    icon: "finish",
  },
  {
    key: "fiber-cement-cladding",
    title: "Fiber-Cement or Equivalent Quality Exterior Cladding",
    description: "Exterior materials selected for durability, appearance, and long-term performance.",
    icon: "exterior",
  },
  {
    key: "architectural-shingles",
    title: "Architectural Shingles",
    description: "Roofing selected to support both curb appeal and weather performance.",
    icon: "exterior",
  },
  {
    key: "pex-plumbing",
    title: "PEX Plumbing",
    description: "A practical plumbing system chosen for reliability and serviceability.",
    icon: "structure",
  },
  {
    key: "insulated-exterior-doors",
    title: "Insulated Exterior Doors",
    description: "Exterior doors selected to support comfort, efficiency, and durability.",
    icon: "exterior",
  },
  {
    key: "modern-interior-trim",
    title: "Modern Interior Trim and Lever Hardware",
    description: "Clean, cohesive finish details carried throughout the home.",
    icon: "finish",
  },
  {
    key: "exterior-lighting-outlets-hose-bibs",
    title: "Exterior Lighting, Outlets, and Hose Bibs",
    description: "The practical exterior details that make the home more usable from day one.",
    icon: "exterior",
  },
];

const COTTAGE_STANDARD_FEATURES: HardyStandardFeature[] = [
  {
    key: "efficient-compact-floor-plans",
    title: "Efficient, Compact Floor Plans",
    description: "Smaller homes designed to use every square foot intentionally.",
    icon: "structure",
  },
  {
    key: "8-or-9-foot-ceilings",
    title: "8' or 9' Ceilings Depending on Plan",
    description: "Ceiling heights matched to the plan for comfort, openness, and efficiency.",
    icon: "structure",
  },
  {
    key: "cottage-quartz-kitchen-bath",
    title: "Quartz Kitchen and Bath Countertops",
    description: "The same durable, finished surfaces carried into compact cottage layouts.",
    icon: "finish",
  },
  {
    key: "cottage-soft-close-cabinetry",
    title: "Soft-Close Cabinetry",
    description: "A finished detail that adds everyday quality without overcomplicating the plan.",
    icon: "finish",
  },
  {
    key: "cottage-lvp-most-main-living",
    title: "LVP Throughout Most Main Living Areas",
    description: "Durable flooring suited to compact living and easy upkeep.",
    icon: "finish",
  },
  {
    key: "stainless-kitchen-sink",
    title: "Stainless Kitchen Sink",
    description: "A practical, durable kitchen staple matched to the scale of the home.",
    icon: "finish",
  },
  {
    key: "full-appliance-package",
    title: "Full Appliance Package as Specified by Plan",
    description: "Appliances coordinated to the selected cottage plan and layout.",
    icon: "finish",
  },
  {
    key: "pantry-or-built-in-storage",
    title: "Pantry or Built-In Storage Where Shown",
    description: "Storage built into the plan wherever the layout allows it to work best.",
    icon: "storage",
  },
  {
    key: "primary-suite-sized-to-plan",
    title: "Primary Suite Features Sized Appropriately to the Plan",
    description: "Primary spaces scaled to feel efficient, finished, and comfortable.",
    icon: "finish",
  },
  {
    key: "covered-porch-or-architectural-detail",
    title: "Covered Porch or Architectural Exterior Detail Where Shown",
    description: "Exterior details that help small homes feel complete and intentional.",
    icon: "exterior",
  },
  {
    key: "garage-only-where-included",
    title: "Garage Included Only on Plans Designed With One",
    description: "Garage availability follows the selected cottage plan rather than being assumed.",
    icon: "structure",
  },
  {
    key: "durable-streamlined-finish-package",
    title: "Simplified, Durable Finish Package Focused on Value and Efficiency",
    description: "Streamlined selections chosen to keep cottages efficient without feeling stripped down.",
    icon: "finish",
  },
];

const SINGLE_FAMILY_STANDARD_FEATURES: HardyStandardFeature[] = [
  {
    key: "9-foot-main-floor-ceilings",
    title: "9' Main-Floor Ceilings",
    description: "A more open feel carried through the primary living level.",
    icon: "structure",
  },
  {
    key: "larger-kitchen-layouts",
    title: "Larger Kitchen Layouts and Islands Where Shown",
    description: "Kitchen footprints designed to support gathering, prep space, and day-to-day family life.",
    icon: "finish",
  },
  {
    key: "expanded-cabinetry-storage",
    title: "Expanded Cabinetry and Storage",
    description: "More built-in storage and cabinetry scaled to larger homes.",
    icon: "storage",
  },
  {
    key: "single-family-quartz-throughout",
    title: "Quartz Countertops Throughout Kitchen and Bathrooms",
    description: "Quartz surfaces carried through the major kitchen and bath spaces.",
    icon: "finish",
  },
  {
    key: "single-family-soft-close-cabinetry",
    title: "Soft-Close Cabinetry",
    description: "A finished detail carried through a broader cabinetry package.",
    icon: "finish",
  },
  {
    key: "finished-garage-drywall",
    title: "Finished Garage Drywall",
    description: "A more complete garage environment from the start.",
    icon: "structure",
  },
  {
    key: "insulated-garage-doors",
    title: "Insulated Garage Doors",
    description: "Garage doors selected to support comfort and durability.",
    icon: "exterior",
  },
  {
    key: "wifi-garage-door-opener",
    title: "Wi-Fi-Enabled Garage Door Opener",
    description: "Convenience and control built into the garage from day one.",
    icon: "technology",
  },
  {
    key: "larger-primary-suite-layouts",
    title: "Larger Primary Suite Layouts",
    description: "Primary bedroom and bath layouts sized for larger single-family living.",
    icon: "finish",
  },
  {
    key: "walk-in-primary-closet",
    title: "Walk-In Primary Closet Where Shown",
    description: "Storage and suite planning tied directly to the selected plan.",
    icon: "storage",
  },
  {
    key: "dual-primary-vanities",
    title: "Dual Primary Vanities Where Plan Allows",
    description: "Bathroom layouts that expand with the size and configuration of the home.",
    icon: "finish",
  },
  {
    key: "glass-primary-shower-enclosure",
    title: "Glass Primary Shower Enclosure",
    description: "A more finished primary bath feature where the plan supports it.",
    icon: "finish",
  },
  {
    key: "more-electrical-data-locations",
    title: "More Electrical and Data Locations",
    description: "Additional utility points placed where larger homes typically benefit from them most.",
    icon: "technology",
  },
  {
    key: "cat6-key-locations",
    title: "Cat6 Wiring to Key Locations",
    description: "Wiring infrastructure included for the spaces that need dependable connectivity.",
    icon: "technology",
  },
  {
    key: "video-doorbell-prewire",
    title: "Video Doorbell Prewire",
    description: "A practical tech-ready feature included from the start.",
    icon: "technology",
  },
  {
    key: "architectural-exterior-detailing",
    title: "More Architectural Exterior Detailing",
    description: "More built-in elevation detail scaled to larger single-family homes.",
    icon: "exterior",
  },
  {
    key: "masonry-or-accent-materials",
    title: "Masonry or Accent Materials Where Shown on Elevation",
    description: "Exterior accents follow the selected elevation and plan presentation.",
    icon: "exterior",
  },
  {
    key: "larger-laundry-storage-areas",
    title: "Larger Laundry and Storage Areas Where Plan Allows",
    description: "Utility and storage spaces designed to work with larger family layouts.",
    icon: "storage",
  },
];

function pickStandards(
  features: HardyStandardFeature[],
  keys: string[]
): HardyStandardFeature[] {
  const featureMap = new Map(features.map((feature) => [feature.key, feature]));
  return keys
    .map((key) => featureMap.get(key))
    .filter((feature): feature is HardyStandardFeature => Boolean(feature));
}

export const coreStandards = CORE_STANDARD_FEATURES;
export const cottageStandards = COTTAGE_STANDARD_FEATURES;
export const singleFamilyStandards = SINGLE_FAMILY_STANDARD_FEATURES;

export const hardyStandardCopy = {
  heading: "The Hardy Standard",
  body:
    "Every Hardy Home begins with a thoughtfully selected standard of construction, efficiency, comfort, and finish. From there, each collection adds features designed around the size and way that home is meant to live.",
  action: "Explore The Hardy Standard",
  note:
    "Hardy Homes standard features establish the baseline for how we build. Certain features depend on the selected floor plan, site conditions, utility availability, jurisdiction, engineering requirements, and chosen elevation. Final materials, brands, colors, allowances, and project-specific specifications are documented before construction contract.",
  highlight:
    "The things many builders call upgrades are simply how we build a Hardy Home.",
  disclaimerHeading: "Built around a clear standard. Finalized for your home.",
  optionsEyebrow: "Make It Yours",
  optionsHeading: "Start with a better standard. Then make it yours.",
  optionsCopy:
    "Once you've chosen your home, available options let you personalize the spaces and features that matter most to you.",
};

export const hardyStandardHighlights = pickStandards(coreStandards, [
  "2x6-exterior-walls",
  "tankless-water-heater",
  "low-e-windows",
  "quartz-countertops",
]).map((feature) => feature.title);

export const hardyHomepageStandardHighlights = pickStandards(coreStandards, [
  "2x6-exterior-walls",
  "tankless-water-heater",
  "quartz-countertops",
  "low-e-windows",
]);

export const hardyCorePriorityStandards = pickStandards(coreStandards, [
  "2x6-exterior-walls",
  "tankless-water-heater",
  "low-e-windows",
  "high-efficiency-hvac",
  "quartz-countertops",
  "soft-close-cabinetry",
  "lvp-main-living",
  "smart-thermostat",
]);

export const hardyPlanCoreStandards = pickStandards(coreStandards, [
  "2x6-exterior-walls",
  "tankless-water-heater",
  "low-e-windows",
  "high-efficiency-hvac",
  "quartz-countertops",
  "soft-close-cabinetry",
]);

export const hardyCollectionStandards: Record<HardyCollectionSlug, HardyCollectionStandardConfig> = {
  cottages: {
    eyebrow: "Cottage Collection",
    heading: "Smart use of space. Hardy quality.",
    copy:
      "Hardy Cottages are designed around efficiency, durability, and thoughtful use of every square foot — without stripping away the features that make the home feel finished.",
    ctaLabel: "Explore Cottage Floor Plans",
    features: cottageStandards,
    planHighlights: pickStandards(cottageStandards, [
      "efficient-compact-floor-plans",
      "cottage-quartz-kitchen-bath",
      "cottage-lvp-most-main-living",
      "durable-streamlined-finish-package",
    ]),
    collectionCalloutHighlights: pickStandards(cottageStandards, [
      "efficient-compact-floor-plans",
      "8-or-9-foot-ceilings",
      "cottage-quartz-kitchen-bath",
      "durable-streamlined-finish-package",
    ]),
  },
  "single-family": {
    eyebrow: "Single Family Collection",
    heading: "More space. More built in.",
    copy:
      "Hardy Single Family homes build on the same core Hardy Standard with expanded kitchens, garages, storage, technology, and primary-suite features designed for larger homes.",
    ctaLabel: "Explore Single Family Floor Plans",
    features: singleFamilyStandards,
    planHighlights: pickStandards(singleFamilyStandards, [
      "9-foot-main-floor-ceilings",
      "finished-garage-drywall",
      "larger-kitchen-layouts",
      "more-electrical-data-locations",
    ]),
    collectionCalloutHighlights: pickStandards(singleFamilyStandards, [
      "9-foot-main-floor-ceilings",
      "finished-garage-drywall",
      "expanded-cabinetry-storage",
      "video-doorbell-prewire",
    ]),
  },
};

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
    name: "The Onyx",
    slug: "onyx",
    standaloneSlug: "the-onyx",
    collectionSlug: "single-family",
    collection: "Single Family Collection",
    squareFeet: 2679,
    bedrooms: "3 Bedrooms + Optional 4th",
    bathrooms: "2.5 Bathrooms",
    garage: "3-Car Garage",
    stories: "Two Story",
    shortDescription: "A two-story home with an open-to-below great room, main-floor office, and room to grow.",
    heroCopy:
      "The Onyx pairs an open, spacious main level with a dramatic two-story interior and flexible upstairs living. A large kitchen and great room anchor the main floor, while the upstairs primary suite, additional bedrooms, laundry, and optional fourth bedroom provide room to grow. An unfinished basement adds even more future flexibility.",
    ctaLabel: "Ask About The Onyx",
    ctaCopy: "Tell us about your property and what you want to build.",
    highlights: [
      "3 bedrooms + optional 4th (upstairs nook)",
      "2.5 bathrooms",
      "3-car garage",
      "Great room open to below",
      "Large kitchen with pantry",
      "Main-floor office and mudroom",
      "Upstairs primary suite and laundry",
      "Covered front and rear porches",
      "Unfinished basement for future flexibility",
    ],
    publicStatus: "active",
    featuredOnStandaloneHome: true,
    standaloneOnly: true,
    images: [
      {
        key: "exterior-front",
        title: "Front Exterior",
        alt: "Front exterior rendering of The Onyx, a two-story Hardy Homes plan with a 3-car garage",
        src: "/images/hardy-homes/single-family/onyx/the-onyx-front-exterior.jpeg",
        priority: true,
        sizes: "(max-width: 980px) 100vw, 72vw",
        fit: "contain",
        position: "center bottom",
      },
      {
        key: "rear",
        title: "Rear Exterior",
        alt: "Rear exterior rendering of The Onyx Hardy Homes plan with covered rear porch",
        src: "/images/hardy-homes/single-family/onyx/the-onyx-rear-exterior-web.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "kitchen",
        title: "Kitchen",
        alt: "Kitchen rendering inside The Onyx Hardy Homes plan",
        src: "/images/hardy-homes/single-family/onyx/the-onyx-kitchen-web.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "great-room",
        title: "Great Room + Stairs",
        alt: "Great room and staircase rendering inside The Onyx Hardy Homes plan",
        src: "/images/hardy-homes/single-family/onyx/the-onyx-great-room-web.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "open-to-below",
        title: "Open to Below",
        alt: "View from the upper floor of The Onyx looking down into the open-to-below great room",
        src: "/images/hardy-homes/single-family/onyx/the-onyx-open-to-below-web.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "primary-bath",
        title: "Primary Bath",
        alt: "Primary bathroom rendering inside The Onyx Hardy Homes plan",
        src: "/images/hardy-homes/single-family/onyx/the-onyx-primary-bath-web.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "kitchen-dining",
        title: "Kitchen + Dining",
        alt: "Kitchen and dining rendering inside The Onyx Hardy Homes plan",
        src: "/images/hardy-homes/single-family/onyx/the-onyx-kitchen-dining-web.jpg",
        sizes: "(max-width: 980px) 100vw, 48vw",
        fit: "cover",
        position: "center center",
      },
      {
        key: "floor-plan-main",
        title: "Main Floor — 1,320 Sq Ft",
        alt: "Main floor plan for The Onyx Hardy Homes plan, 1,320 square feet",
        src: "/images/hardy-homes/single-family/onyx/the-onyx-floor-plan-main-web.png",
        sizes: "(max-width: 980px) 100vw, 31vw",
        fit: "contain",
        position: "center center",
      },
      {
        key: "floor-plan-upper",
        title: "Upper Floor — 1,359 Sq Ft",
        alt: "Upper floor plan for The Onyx Hardy Homes plan, 1,359 square feet",
        src: "/images/hardy-homes/single-family/onyx/the-onyx-floor-plan-upper-web.png",
        sizes: "(max-width: 980px) 100vw, 31vw",
        fit: "contain",
        position: "center center",
      },
      {
        key: "floor-plan-basement",
        title: "Basement — 1,284 Sq Ft Unfinished",
        alt: "Unfinished basement plan for The Onyx Hardy Homes plan, 1,284 square feet",
        src: "/images/hardy-homes/single-family/onyx/the-onyx-floor-plan-basement-web.png",
        sizes: "(max-width: 980px) 100vw, 31vw",
        fit: "contain",
        position: "center center",
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

export function getGatewayPublicHomes() {
  return getPublicHardyHomes().filter((home) => !home.standaloneOnly);
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

export function getHardyCollectionStandards(
  slug: HardyCollectionSlug
): HardyCollectionStandardConfig {
  return hardyCollectionStandards[slug];
}
