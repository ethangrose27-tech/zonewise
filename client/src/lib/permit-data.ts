// SW Florida Permit Data — Brooksville to Naples corridor
// Sources: County fee schedules, PermitFlow, Permit Place, PermitFlow, county ordinances

export interface County {
  id: string;
  name: string;
  region: string;
  center: [number, number];
  phone: string;
  portalUrl: string;
  feeScheduleUrl?: string;
  notes: string;
}

export const counties: County[] = [
  {
    id: "hernando",
    name: "Hernando County",
    region: "Brooksville / Spring Hill",
    center: [28.5364, -82.5307],
    phone: "(352) 754-4050",
    portalUrl: "https://www.hernandocounty.us/building-development/building",
    feeScheduleUrl: "https://www.hernandocounty.us/building-development/building/building-fees",
    notes: "Fee schedule effective Jan 1, 2025. Technology fee on all permits.",
  },
  {
    id: "pasco",
    name: "Pasco County",
    region: "New Port Richey / Wesley Chapel",
    center: [28.3075, -82.4558],
    phone: "(727) 847-8946",
    portalUrl: "https://www.pascocountyfl.net/286/Building-Construction-Services",
    notes: "Residential permits at $0.40/sq ft. Private provider fee reductions available.",
  },
  {
    id: "pinellas",
    name: "Pinellas County",
    region: "St. Petersburg / Clearwater",
    center: [27.8764, -82.7779],
    phone: "(727) 464-3888",
    portalUrl: "https://www.pinellascounty.org/build/default.htm",
    notes: "Construction Licensing Board governs county-certified contractors.",
  },
  {
    id: "hillsborough",
    name: "Hillsborough County",
    region: "Tampa / Brandon / Plant City",
    center: [27.9506, -82.4572],
    phone: "(813) 274-3100",
    portalUrl: "https://www.tampa.gov/development-coordination",
    feeScheduleUrl: "https://apps.tampagov.net/csd_fee_estimator_webapp/",
    notes: "City of Tampa and unincorporated areas have separate processes. FL surcharge 2.5%.",
  },
  {
    id: "manatee",
    name: "Manatee County",
    region: "Bradenton / Palmetto",
    center: [27.4799, -82.5748],
    phone: "(941) 749-3060",
    portalUrl: "https://www.mymanatee.org/departments/building_and_development_services",
    notes: "Online portal via EnerGov. Impact fees vary by district.",
  },
  {
    id: "sarasota",
    name: "Sarasota County",
    region: "Sarasota / Venice / North Port",
    center: [27.3364, -82.5306],
    phone: "(941) 861-6678",
    portalUrl: "https://www.scgov.net/government/building-and-development-services",
    notes: "Base permit $100+ with per-sqft or % of cost additions. 2-3% electronic payment surcharge post-Nov 2025.",
  },
  {
    id: "charlotte",
    name: "Charlotte County",
    region: "Port Charlotte / Punta Gorda",
    center: [26.9612, -82.0934],
    phone: "(941) 743-1201",
    portalUrl: "https://www.charlottecountyfl.gov/departments/community-development/building-construction",
    notes: "Building flat fee $90 + surcharge $4 for misc. Valuation-based for new construction.",
  },
  {
    id: "lee",
    name: "Lee County",
    region: "Fort Myers / Cape Coral / Bonita Springs",
    center: [26.6406, -81.8723],
    phone: "(239) 533-8585",
    portalUrl: "https://www.leegov.com/dcd/bldpermit",
    feeScheduleUrl: "https://www.leegov.com/dcd/bldpermit/fees",
    notes: "Per-sqft fee model. Mandatory FL surcharges: 1.5% admin + 1% radon (min $2 each).",
  },
  {
    id: "collier",
    name: "Collier County",
    region: "Naples / Marco Island / Immokalee",
    center: [26.1420, -81.7948],
    phone: "(239) 252-2400",
    portalUrl: "https://www.colliercountyfl.gov/your-government/divisions-f-r/growth-management/building-review-and-permitting",
    notes: "City of Naples uses $0.50/sqft + 50% plan review. Significant impact fees ($50k+) for new construction.",
  },
];

export interface PermitType {
  id: string;
  name: string;
  category: "building" | "trade" | "site";
  description: string;
  requiresPermit: boolean;
  exemptionNote?: string;
  permits: PermitRequirement[];
  feesByCounty: Record<string, { min: number; max: number; note?: string }>;
  estimatedTimeline: string;
  inspectionsRequired: string[];
  tips: string[];
}

export interface PermitRequirement {
  name: string;
  required: boolean;
  notes: string;
}

export const projectTypes: PermitType[] = [
  {
    id: "fence",
    name: "Fence Installation",
    category: "building",
    description:
      "Residential fence installation or replacement. Height limits typically 4ft front yard, 6ft side/rear. Material and location restrictions vary by jurisdiction.",
    requiresPermit: true,
    permits: [
      { name: "Building Permit (Accessory Structure)", required: true, notes: "Required for fences over height limits or in front yards" },
      { name: "Zoning Review", required: true, notes: "Setback and height compliance check" },
      { name: "HOA Approval", required: false, notes: "Check deed restrictions if applicable" },
    ],
    feesByCounty: {
      hernando: { min: 105, max: 140, note: "Aluminum/non-structural category" },
      pasco: { min: 50, max: 150 },
      pinellas: { min: 75, max: 175 },
      hillsborough: { min: 50, max: 177 },
      manatee: { min: 75, max: 150 },
      sarasota: { min: 50, max: 100, note: "Under $1000 construction value minimum" },
      charlotte: { min: 90, max: 116, note: "Building flat $90 + surcharge $4 + zoning $22" },
      lee: { min: 50, max: 56, note: "Flat $50 + FL surcharges" },
      collier: { min: 70, max: 85, note: "Accessory Type II flat fee + surcharges" },
    },
    estimatedTimeline: "3–10 business days",
    inspectionsRequired: ["Post-installation inspection"],
    tips: [
      "Fences under 4ft (front) and 6ft (rear) may be exempt in some jurisdictions",
      "Check for utility easements before installing fence posts",
      "Historic or overlay districts may have additional material/design requirements",
      "Naples requires permit for fences longer than 50 feet",
    ],
  },
  {
    id: "shed",
    name: "Shed / Accessory Structure",
    category: "building",
    description:
      "Detached shed, workshop, or storage building. Most FL counties exempt one-story structures under 120 sq ft from building permits, but zoning rules still apply.",
    requiresPermit: true,
    exemptionNote: "Typically exempt if one-story and under 120 sq ft",
    permits: [
      { name: "Building Permit", required: true, notes: "Required for structures over 120 sq ft" },
      { name: "Zoning Review", required: true, notes: "Setback requirements from property lines" },
      { name: "Electrical Permit", required: false, notes: "Only if adding electrical service" },
    ],
    feesByCounty: {
      hernando: { min: 140, max: 300, note: "Storage bldg ≤200sf: $140; larger based on sqft" },
      pasco: { min: 100, max: 300 },
      pinellas: { min: 100, max: 350 },
      hillsborough: { min: 100, max: 300 },
      manatee: { min: 100, max: 300 },
      sarasota: { min: 100, max: 400 },
      charlotte: { min: 90, max: 250 },
      lee: { min: 100, max: 300, note: "$0.15/sqft, $100 min + plan review $75" },
      collier: { min: 70, max: 250, note: "$0.30/sqft for accessory Type I" },
    },
    estimatedTimeline: "5–15 business days",
    inspectionsRequired: ["Foundation/slab inspection", "Final inspection"],
    tips: [
      "Sheds ≤120 sq ft and one story are typically permit-exempt across FL",
      "Must meet setback requirements even if permit-exempt",
      "FL Building Code requires wind load compliance for all structures",
      "Hernando County charges $140 for storage buildings under 200 sq ft",
    ],
  },
  {
    id: "deck",
    name: "Deck / Patio Construction",
    category: "building",
    description:
      "Building or extending a deck, patio, or porch. Raised decks over 30 inches from grade require permits and often structural plans.",
    requiresPermit: true,
    permits: [
      { name: "Building Permit", required: true, notes: "Required for decks over 30 inches from grade" },
      { name: "Structural Plans", required: true, notes: "Engineer-sealed plans for raised decks" },
      { name: "Zoning Review", required: true, notes: "Lot coverage and setback compliance" },
    ],
    feesByCounty: {
      hernando: { min: 140, max: 300, note: "Deck permit $140 base" },
      pasco: { min: 100, max: 400 },
      pinellas: { min: 100, max: 400 },
      hillsborough: { min: 150, max: 500 },
      manatee: { min: 100, max: 400 },
      sarasota: { min: 100, max: 500 },
      charlotte: { min: 90, max: 350 },
      lee: { min: 100, max: 400, note: "$0.15/sqft + plan review" },
      collier: { min: 100, max: 400 },
    },
    estimatedTimeline: "10–20 business days",
    inspectionsRequired: ["Footing inspection", "Framing inspection", "Final inspection"],
    tips: [
      "Ground-level patios (pavers on grade) may be exempt",
      "Decks attached to the house need ledger board flashing inspections",
      "Consider impact on impervious surface calculations for stormwater",
    ],
  },
  {
    id: "roof",
    name: "Roof Replacement",
    category: "building",
    description:
      "Re-roofing, re-covering, or structural roof repair. Critical in SW Florida for hurricane compliance. Required for work over 500 sq ft or involving structural components.",
    requiresPermit: true,
    exemptionNote: "Repairs ≤500 sq ft not involving structural components may be exempt",
    permits: [
      { name: "Roofing Permit", required: true, notes: "Required for complete re-roof or repairs >500 sq ft" },
      { name: "Notice of Commencement", required: true, notes: "Must be recorded before work begins" },
    ],
    feesByCounty: {
      hernando: { min: 190, max: 364, note: "Residential $190; Commercial under 5000sf $364" },
      pasco: { min: 100, max: 400 },
      pinellas: { min: 100, max: 350 },
      hillsborough: { min: 150, max: 600 },
      manatee: { min: 100, max: 350 },
      sarasota: { min: 100, max: 400 },
      charlotte: { min: 90, max: 250 },
      lee: { min: 85, max: 106, note: "Residential $85 flat; +FL surcharges" },
      collier: { min: 100, max: 350 },
    },
    estimatedTimeline: "3–7 business days",
    inspectionsRequired: ["Dry-in inspection", "Final inspection"],
    tips: [
      "SW Florida wind zone requirements are strict — use Florida Product Approval rated materials",
      "Licensed roofing contractor must pull the permit",
      "Lee County flat fee of $85 for residential roofing is among the lowest in the region",
      "FL surcharges apply: 1.5% admin + 1% radon (min $2 each)",
    ],
  },
  {
    id: "pool",
    name: "Swimming Pool Installation",
    category: "building",
    description:
      "In-ground or above-ground swimming pool, spa, or hot tub. Requires barrier/fence compliance per FL Residential Pool Safety Act. SW FL's most common residential project.",
    requiresPermit: true,
    permits: [
      { name: "Building Permit", required: true, notes: "Pool construction permit" },
      { name: "Electrical Permit", required: true, notes: "Pool pump, lighting, and bonding" },
      { name: "Plumbing Permit", required: true, notes: "Water supply and drainage" },
      { name: "Zoning Review", required: true, notes: "Setback and lot coverage compliance" },
      { name: "Barrier/Fence Compliance", required: true, notes: "FL Residential Pool Safety Act" },
    ],
    feesByCounty: {
      hernando: { min: 361, max: 491, note: "In-ground $361; includes plumbing & electric" },
      pasco: { min: 300, max: 800 },
      pinellas: { min: 300, max: 800 },
      hillsborough: { min: 400, max: 1500 },
      manatee: { min: 300, max: 800 },
      sarasota: { min: 300, max: 900 },
      charlotte: { min: 250, max: 600 },
      lee: { min: 250, max: 600, note: "Building + electrical + plumbing permits separately" },
      collier: { min: 300, max: 700, note: "Accessory Type I $0.30/sqft + trade permits" },
    },
    estimatedTimeline: "15–30 business days",
    inspectionsRequired: [
      "Excavation inspection",
      "Steel/rebar inspection",
      "Electrical bonding inspection",
      "Barrier inspection",
      "Final inspection",
    ],
    tips: [
      "Pool barrier must be at least 48 inches high with self-closing gate",
      "Screen enclosures may serve as barrier if they meet code",
      "Hernando County includes plumbing & electric in pool permit fee",
      "Consider utility easement locations before excavation",
    ],
  },
  {
    id: "hvac",
    name: "HVAC Replacement",
    category: "trade",
    description:
      "AC system replacement or new installation. Must meet FL energy efficiency standards. Essential in SW Florida's subtropical climate.",
    requiresPermit: true,
    permits: [
      { name: "Mechanical Permit", required: true, notes: "Required for all HVAC installations" },
      { name: "Electrical Permit", required: false, notes: "If upgrading electrical panel for new unit" },
    ],
    feesByCounty: {
      hernando: { min: 140, max: 180, note: "A/C changeout only $140" },
      pasco: { min: 75, max: 200 },
      pinellas: { min: 75, max: 200 },
      hillsborough: { min: 75, max: 250 },
      manatee: { min: 75, max: 200 },
      sarasota: { min: 75, max: 200 },
      charlotte: { min: 90, max: 150 },
      lee: { min: 100, max: 150, note: "$0.03/sqft, $100 min + surcharges" },
      collier: { min: 70, max: 150, note: "$0.10/sqft mechanical, $70 min" },
    },
    estimatedTimeline: "3–5 business days",
    inspectionsRequired: ["Mechanical final inspection"],
    tips: [
      "Licensed HVAC contractor must pull the permit",
      "Florida requires SEER2 15+ for residential systems as of 2023",
      "Like-for-like replacements still require permits",
      "Hernando County charges $140 flat for A/C changeout",
    ],
  },
  {
    id: "electrical",
    name: "Electrical Panel Upgrade",
    category: "trade",
    description:
      "Panel upgrades, circuit additions, generator installations, EV charger installation, or service changes.",
    requiresPermit: true,
    permits: [
      { name: "Electrical Permit", required: true, notes: "Required for all electrical modifications" },
      { name: "Utility Coordination", required: false, notes: "Utility company notification for service upgrades" },
    ],
    feesByCounty: {
      hernando: { min: 140, max: 300, note: "Generator $140; service change $180" },
      pasco: { min: 75, max: 250 },
      pinellas: { min: 75, max: 250 },
      hillsborough: { min: 75, max: 300 },
      manatee: { min: 75, max: 250 },
      sarasota: { min: 75, max: 200, note: "$0.40/amp, $75 min for panels" },
      charlotte: { min: 90, max: 200 },
      lee: { min: 75, max: 200, note: "$0.10/amp, $75 min + surcharges" },
      collier: { min: 70, max: 200, note: "$0.10/sqft electrical, $70 min" },
    },
    estimatedTimeline: "3–7 business days",
    inspectionsRequired: ["Rough-in inspection (if applicable)", "Final electrical inspection"],
    tips: [
      "Only licensed electrical contractors can pull permits in Florida",
      "EV charger installations require a dedicated circuit and permit",
      "200A panel is standard for modern homes; 100A may need upgrade",
      "Generator permits: Hernando $140, most others $75-150",
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing Work",
    category: "trade",
    description:
      "New water/sewer line installations, fixture replacements, backflow prevention, water heater replacement.",
    requiresPermit: true,
    exemptionNote: "Minor repairs (fixing leaks, clearing stoppages) are exempt",
    permits: [
      { name: "Plumbing Permit", required: true, notes: "Required for new installations and replacements" },
    ],
    feesByCounty: {
      hernando: { min: 115, max: 180, note: "Residential plumbing other $115; commercial $180" },
      pasco: { min: 75, max: 200 },
      pinellas: { min: 75, max: 200 },
      hillsborough: { min: 75, max: 250 },
      manatee: { min: 75, max: 200 },
      sarasota: { min: 45, max: 150, note: "$45 base + $5/fixture" },
      charlotte: { min: 90, max: 150 },
      lee: { min: 100, max: 175, note: "$0.03/sqft, $100 min + surcharges" },
      collier: { min: 70, max: 150, note: "$0.10/sqft plumbing, $70 min" },
    },
    estimatedTimeline: "3–5 business days",
    inspectionsRequired: ["Rough-in inspection", "Final plumbing inspection"],
    tips: [
      "Water heater replacements require permits even for like-for-like swaps",
      "Licensed plumbers must pull all plumbing permits",
      "Backflow prevention devices require annual testing",
      "Sarasota County uses per-fixture pricing starting at $45",
    ],
  },
  {
    id: "addition",
    name: "Home Addition / Remodel",
    category: "building",
    description:
      "Room additions, structural remodels, converting garage to living space. Typically the most complex and expensive permit process.",
    requiresPermit: true,
    permits: [
      { name: "Building Permit", required: true, notes: "Full construction permit with plans" },
      { name: "Structural/Architectural Plans", required: true, notes: "Sealed by licensed architect/engineer" },
      { name: "Electrical Permit", required: true, notes: "For new circuits and fixtures" },
      { name: "Plumbing Permit", required: false, notes: "If adding bathroom or kitchen" },
      { name: "Mechanical Permit", required: false, notes: "For HVAC extensions" },
      { name: "Zoning Review", required: true, notes: "Setbacks, FAR, lot coverage" },
      { name: "Energy Calculations (ResCheck)", required: true, notes: "Florida energy code compliance" },
    ],
    feesByCounty: {
      hernando: { min: 300, max: 2000, note: "Per-sqft: $0.20 building + $0.08 trades + plan review" },
      pasco: { min: 400, max: 3000, note: "$0.40/sqft building + trade permits" },
      pinellas: { min: 400, max: 3000 },
      hillsborough: { min: 500, max: 5000 },
      manatee: { min: 400, max: 3000 },
      sarasota: { min: 500, max: 5000, note: "$100 base + 1-2% of cost + trade permits" },
      charlotte: { min: 300, max: 3000, note: "0.004 x ICC valuation + trades" },
      lee: { min: 250, max: 3000, note: "$0.15/sqft + $75 plan review + trades" },
      collier: { min: 400, max: 4000, note: "$0.50/sqft + 50% plan review + trades" },
    },
    estimatedTimeline: "20–45 business days",
    inspectionsRequired: [
      "Foundation inspection",
      "Framing inspection",
      "Electrical rough-in",
      "Plumbing rough-in",
      "Insulation inspection",
      "Final inspection",
    ],
    tips: [
      "Plan review typically takes 4+ weeks for additions",
      "Collier County (Naples) among the most expensive: $0.50/sqft + 50% plan review",
      "Impact fees can add $5,000-$60,000+ in Collier County for new construction",
      "FL Building Permit Surcharge: 2.5% of permit value (min $4)",
    ],
  },
  {
    id: "solar",
    name: "Solar Panel Installation",
    category: "building",
    description:
      "Rooftop or ground-mounted solar PV system. Florida mandates expedited permitting for residential solar ≤15kW. HOAs cannot prohibit solar panels.",
    requiresPermit: true,
    permits: [
      { name: "Building Permit (Solar)", required: true, notes: "Structural attachment review" },
      { name: "Electrical Permit", required: true, notes: "Inverter, disconnect, and interconnection" },
      { name: "Utility Interconnection Agreement", required: true, notes: "FPL/Duke/TECO approval for grid-tied" },
    ],
    feesByCounty: {
      hernando: { min: 150, max: 400 },
      pasco: { min: 150, max: 400 },
      pinellas: { min: 150, max: 450 },
      hillsborough: { min: 200, max: 500 },
      manatee: { min: 150, max: 400 },
      sarasota: { min: 150, max: 450 },
      charlotte: { min: 130, max: 350 },
      lee: { min: 150, max: 400 },
      collier: { min: 150, max: 450 },
    },
    estimatedTimeline: "5–10 business days (expedited for ≤15kW)",
    inspectionsRequired: ["Structural/mounting inspection", "Electrical inspection", "Final inspection"],
    tips: [
      "Florida law mandates expedited review for residential solar ≤15kW",
      "HOAs cannot prohibit solar panels (FL Statute 163.04)",
      "Net metering available through FPL, Duke Energy, and TECO",
      "SW Florida averages 5.5 peak sun hours — excellent for solar",
    ],
  },
];

export const zoningCategories: Record<string, { label: string; color: string; description: string }> = {
  RS: { label: "Residential Single-Family", color: "#fde68a", description: "Single-family detached homes" },
  RM: { label: "Residential Multi-Family", color: "#fdba74", description: "Apartments, condos, townhomes" },
  RO: { label: "Residential Office", color: "#d9f99d", description: "Mixed residential and office use" },
  CN: { label: "Commercial Neighborhood", color: "#f9a8d4", description: "Small-scale neighborhood commercial" },
  CG: { label: "Commercial General", color: "#f472b6", description: "General commercial and retail" },
  CI: { label: "Commercial Intensive", color: "#e879f9", description: "Intensive commercial, auto-oriented" },
  CD: { label: "Central Business District", color: "#c084fc", description: "Downtown core district" },
  IG: { label: "Industrial General", color: "#a3a3a3", description: "Light to heavy industrial" },
  IH: { label: "Industrial Heavy", color: "#737373", description: "Heavy industrial" },
  PD: { label: "Planned Development", color: "#67e8f9", description: "Planned community development" },
  OS: { label: "Open Space", color: "#86efac", description: "Parks, recreation, conservation" },
  AG: { label: "Agricultural", color: "#bef264", description: "Agricultural and rural residential" },
};

export interface DataSource {
  name: string;
  url: string;
  type: "ArcGIS REST" | "GeoJSON" | "Feature Service" | "Open Data Portal";
  description: string;
  coverage: string;
  updateFrequency: string;
}

export const dataSources: DataSource[] = [
  {
    name: "City of Tampa GeoHub — Zoning Districts",
    url: "https://city-tampa.opendata.arcgis.com/datasets/tampa::zoning-district/explore",
    type: "Feature Service",
    description: "Official zoning district boundaries within Tampa city limits",
    coverage: "City of Tampa",
    updateFrequency: "Refreshed every 24 hours",
  },
  {
    name: "Tampa ArcGIS — Tax Parcels",
    url: "https://arcgis.tampagov.net/arcgis/rest/services/Parcels/TaxParcel/FeatureServer/0",
    type: "ArcGIS REST",
    description: "Hillsborough County Property Appraiser parcel data with ownership, value, and zoning",
    coverage: "Hillsborough County",
    updateFrequency: "Updated as recorded",
  },
  {
    name: "Hillsborough County GeoHub",
    url: "https://hcfl.gov/about-hillsborough/open-data-and-gis/geohub",
    type: "Open Data Portal",
    description: "Boundary, zoning, land use, flood zones, utilities, stormwater, and CIP project data",
    coverage: "Hillsborough County",
    updateFrequency: "Varies by dataset",
  },
  {
    name: "Lee County GIS Open Data",
    url: "https://www.leegov.com/gis",
    type: "Open Data Portal",
    description: "Parcels, zoning, flood zones, and land use data for Lee County",
    coverage: "Lee County (Fort Myers / Cape Coral)",
    updateFrequency: "Updated regularly",
  },
  {
    name: "Sarasota County GIS",
    url: "https://www.scgov.net/government/information-technology/geographic-information-systems-gis",
    type: "Open Data Portal",
    description: "Zoning, parcels, environmental, and infrastructure data",
    coverage: "Sarasota County",
    updateFrequency: "Varies",
  },
  {
    name: "Collier County GIS",
    url: "https://www.colliercountyfl.gov/your-government/divisions-f-r/information-technology/gis",
    type: "Open Data Portal",
    description: "Zoning, land use, parcels, and environmental data for Collier County",
    coverage: "Collier County (Naples)",
    updateFrequency: "Updated regularly",
  },
  {
    name: "Florida Geospatial Open Data Portal",
    url: "https://geodata.floridagio.gov",
    type: "Open Data Portal",
    description: "Statewide geospatial data including boundaries, parcels, environmental layers",
    coverage: "Statewide (Florida)",
    updateFrequency: "Varies",
  },
  {
    name: "Tampa ArcGIS REST Services Directory",
    url: "https://arcgis.tampagov.net/arcgis/rest/services",
    type: "ArcGIS REST",
    description: "Full directory: Planning, Utilities, Roads, Parks, Code Enforcement, and more",
    coverage: "City of Tampa",
    updateFrequency: "Live services",
  },
];

// Referral system types
export interface TradeCategory {
  id: string;
  name: string;
  icon: string;
  dbprLicenseType: string;
  searchTerms: string;
  description: string;
}

export const tradeCategories: TradeCategory[] = [
  {
    id: "general-contractor",
    name: "General Contractors",
    icon: "Hammer",
    dbprLicenseType: "Certified General Contractor",
    searchTerms: "general contractor",
    description: "Licensed general contractors for home construction, additions, and major remodels",
  },
  {
    id: "roofing",
    name: "Roofing Contractors",
    icon: "Home",
    dbprLicenseType: "Certified Roofing Contractor",
    searchTerms: "roofing contractor",
    description: "Licensed roofers for replacement, repair, and hurricane hardening",
  },
  {
    id: "electrical",
    name: "Electrical Contractors",
    icon: "Zap",
    dbprLicenseType: "Certified Electrical Contractor",
    searchTerms: "electrical contractor",
    description: "Licensed electricians for panel upgrades, EV chargers, generators, and wiring",
  },
  {
    id: "plumbing",
    name: "Plumbing Contractors",
    icon: "Droplets",
    dbprLicenseType: "Certified Plumbing Contractor",
    searchTerms: "plumbing contractor",
    description: "Licensed plumbers for water heaters, repiping, fixture installation",
  },
  {
    id: "hvac",
    name: "HVAC / Mechanical",
    icon: "Thermometer",
    dbprLicenseType: "Certified Mechanical Contractor",
    searchTerms: "HVAC contractor air conditioning",
    description: "Licensed AC technicians for installation, replacement, and repair",
  },
  {
    id: "pool",
    name: "Pool Contractors",
    icon: "Waves",
    dbprLicenseType: "Certified Pool/Spa Contractor",
    searchTerms: "pool contractor builder",
    description: "Licensed pool builders for new installations, resurfacing, and enclosures",
  },
  {
    id: "solar",
    name: "Solar Installers",
    icon: "Sun",
    dbprLicenseType: "Certified Solar Contractor",
    searchTerms: "solar panel installer",
    description: "Certified solar contractors for rooftop and ground-mounted PV systems",
  },
  {
    id: "surveyor",
    name: "Land Surveyors",
    icon: "Compass",
    dbprLicenseType: "Professional Surveyor",
    searchTerms: "land surveyor boundary survey",
    description: "Licensed surveyors for boundary, topographic, and elevation surveys",
  },
  {
    id: "architect",
    name: "Architects & Engineers",
    icon: "PenTool",
    dbprLicenseType: "Licensed Architect",
    searchTerms: "architect structural engineer",
    description: "Licensed architects and engineers for sealed plans and structural design",
  },
  {
    id: "permit-expediter",
    name: "Permit Expediters",
    icon: "Rocket",
    dbprLicenseType: "",
    searchTerms: "permit expediter building permit service",
    description: "Professional permit runners and expediting services",
  },
];

// Generate search URLs for referrals
export function getGoogleMapsSearchUrl(trade: string, county: string): string {
  const countyData = counties.find((c) => c.id === county);
  const location = countyData ? countyData.region : "Southwest Florida";
  return `https://www.google.com/maps/search/${encodeURIComponent(trade + " near " + location + ", FL")}`;
}

export function getYelpSearchUrl(trade: string, county: string): string {
  const countyData = counties.find((c) => c.id === county);
  const location = countyData ? countyData.region.split("/")[0].trim() : "Tampa";
  return `https://www.yelp.com/search?find_desc=${encodeURIComponent(trade)}&find_loc=${encodeURIComponent(location + ", FL")}`;
}

export function getAngiSearchUrl(trade: string, county: string): string {
  const countyData = counties.find((c) => c.id === county);
  const location = countyData ? countyData.region.split("/")[0].trim().toLowerCase().replace(/\s+/g, "-") : "tampa";
  return `https://www.angi.com/companylist/${encodeURIComponent(location)}-fl/${encodeURIComponent(trade.toLowerCase().replace(/\s+/g, "-"))}.htm`;
}

export function getDBPRVerifyUrl(): string {
  return "https://www.myfloridalicense.com/wl11.asp?mode=0&SID=&bession_id=";
}
