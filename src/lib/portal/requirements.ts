/**
 * Initial document requirement catalogue.
 *
 * These are *seed values*, not hardcoded rules. Once seeded they are ordinary
 * rows in `tp_document_requirement` — an administrator can add, retire, or
 * re-scope a requirement without a deploy, and the compliance engine reads
 * whatever is in the table.
 *
 * LEGAL BOUNDARY: every entry in the "Agreements and Policies" category ships
 * with `templateIsDraft: true` and no template file. The final wording of these
 * agreements has not been reviewed by a Utah construction attorney. Nothing in
 * this codebase should be described as attorney approved. See
 * docs/TRADE_PARTNER_PORTAL.md § Legal template replacement.
 */

import type { DocumentCategoryValue, EntityTypeValue } from './db/schema'

export type RequirementSeed = {
  code: string
  name: string
  category: DocumentCategoryValue
  description: string
  isRequired: boolean
  applicableTrades: string[]
  applicableEntityTypes: EntityTypeValue[]
  hasExpiration: boolean
  allowNotApplicable: boolean
  blocksBid: boolean
  blocksWork: boolean
  requiresReview: boolean
  isAcknowledgment: boolean
  templateIsDraft: boolean
  sortOrder: number
}

/** Requirement codes referenced by name elsewhere in the application. */
export const REQUIREMENT_CODES = {
  W9: 'W9',
  BUSINESS_REGISTRATION: 'BUSINESS_REGISTRATION',
  ACH_SETUP: 'ACH_SETUP',
  CONTRACTOR_LICENSE: 'CONTRACTOR_LICENSE',
  PROFESSIONAL_LICENSE: 'PROFESSIONAL_LICENSE',
  GL_CERTIFICATE: 'GL_CERTIFICATE',
  ADDITIONAL_INSURED: 'ADDITIONAL_INSURED',
  PRIMARY_NONCONTRIBUTORY: 'PRIMARY_NONCONTRIBUTORY',
  WAIVER_OF_SUBROGATION: 'WAIVER_OF_SUBROGATION',
  WC_CERTIFICATE: 'WC_CERTIFICATE',
  UT_WC_WAIVER: 'UT_WC_WAIVER',
  COMMERCIAL_AUTO: 'COMMERCIAL_AUTO',
  UMBRELLA: 'UMBRELLA',
  MASTER_SUBCONTRACT: 'MASTER_SUBCONTRACT',
  CODE_OF_CONDUCT: 'CODE_OF_CONDUCT',
  SAFETY_ACKNOWLEDGMENT: 'SAFETY_ACKNOWLEDGMENT',
  WARRANTY_STANDARDS: 'WARRANTY_STANDARDS',
  SCR_LIEN_COMPLIANCE: 'SCR_LIEN_COMPLIANCE',
  COMMUNICATION_POLICY: 'COMMUNICATION_POLICY',
  CONFIDENTIALITY_POLICY: 'CONFIDENTIALITY_POLICY',
} as const

export type RequirementCode = (typeof REQUIREMENT_CODES)[keyof typeof REQUIREMENT_CODES]

const base = {
  applicableTrades: [] as string[],
  applicableEntityTypes: [] as EntityTypeValue[],
  allowNotApplicable: false,
  requiresReview: true,
  isAcknowledgment: false,
  templateIsDraft: false,
}

export const REQUIREMENT_SEEDS: RequirementSeed[] = [
  // --- Tax and corporate ---------------------------------------------------
  {
    ...base,
    code: REQUIREMENT_CODES.W9,
    name: 'IRS Form W-9',
    category: 'TAX_AND_CORPORATE',
    description:
      'Current, signed W-9 showing the legal business name and taxpayer identification number. This is the system of record for your EIN — the portal stores only the last four digits.',
    isRequired: true,
    hasExpiration: false,
    blocksBid: false,
    blocksWork: true,
    sortOrder: 10,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.BUSINESS_REGISTRATION,
    name: 'Business Registration / Entity Record',
    category: 'TAX_AND_CORPORATE',
    description:
      'Utah Division of Corporations registration or equivalent entity record showing the business is in good standing.',
    isRequired: true,
    applicableEntityTypes: ['LLC', 'S_CORP', 'C_CORP', 'PARTNERSHIP', 'NONPROFIT'],
    hasExpiration: false,
    allowNotApplicable: true,
    blocksBid: false,
    blocksWork: true,
    sortOrder: 20,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.ACH_SETUP,
    name: 'ACH / Payment Setup Acknowledgment',
    category: 'TAX_AND_CORPORATE',
    description:
      'Confirmation that payment details have been provided to Hardy Homes through a secure channel. Do not upload bank routing or account numbers here — the portal does not store them.',
    isRequired: false,
    hasExpiration: false,
    allowNotApplicable: true,
    blocksBid: false,
    blocksWork: false,
    isAcknowledgment: true,
    sortOrder: 30,
  },

  // --- Licensing -----------------------------------------------------------
  {
    ...base,
    code: REQUIREMENT_CODES.CONTRACTOR_LICENSE,
    name: 'Utah Contractor Licence',
    category: 'LICENSING',
    description:
      'Current Utah DOPL contractor licence covering the trade you perform. Verification is performed manually by Hardy Homes.',
    isRequired: true,
    hasExpiration: true,
    allowNotApplicable: true,
    blocksBid: false,
    blocksWork: true,
    sortOrder: 40,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.PROFESSIONAL_LICENSE,
    name: 'Other Required Professional Licence',
    category: 'LICENSING',
    description:
      'Any additional trade or professional licence required for your scope (for example an electrical or plumbing qualifier licence).',
    isRequired: false,
    hasExpiration: true,
    allowNotApplicable: true,
    blocksBid: false,
    blocksWork: false,
    sortOrder: 50,
  },

  // --- Insurance -----------------------------------------------------------
  {
    ...base,
    code: REQUIREMENT_CODES.GL_CERTIFICATE,
    name: 'General Liability Certificate',
    category: 'INSURANCE',
    description:
      'ACORD certificate of insurance showing current general liability coverage with Hardy Homes listed as certificate holder.',
    isRequired: true,
    hasExpiration: true,
    blocksBid: false,
    blocksWork: true,
    sortOrder: 60,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.ADDITIONAL_INSURED,
    name: 'Additional Insured Endorsement',
    category: 'INSURANCE',
    description:
      'Endorsement naming Hardy Homes as an additional insured on your general liability policy.',
    isRequired: true,
    hasExpiration: true,
    allowNotApplicable: true,
    blocksBid: false,
    blocksWork: true,
    sortOrder: 70,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.PRIMARY_NONCONTRIBUTORY,
    name: 'Primary and Noncontributory Endorsement',
    category: 'INSURANCE',
    description: 'Required when your scope or contract calls for it.',
    isRequired: false,
    hasExpiration: true,
    allowNotApplicable: true,
    blocksBid: false,
    blocksWork: false,
    sortOrder: 80,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.WAIVER_OF_SUBROGATION,
    name: 'Waiver of Subrogation',
    category: 'INSURANCE',
    description: 'Required when your scope or contract calls for it.',
    isRequired: false,
    hasExpiration: true,
    allowNotApplicable: true,
    blocksBid: false,
    blocksWork: false,
    sortOrder: 90,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.WC_CERTIFICATE,
    name: "Workers' Compensation Certificate",
    category: 'INSURANCE',
    description:
      "Current workers' compensation certificate. If your company has no employees, upload a Utah Workers' Compensation Coverage Waiver instead and Hardy Homes will mark this item not applicable.",
    isRequired: true,
    hasExpiration: true,
    allowNotApplicable: true,
    blocksBid: false,
    blocksWork: true,
    sortOrder: 100,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.UT_WC_WAIVER,
    name: "Utah Workers' Compensation Coverage Waiver",
    category: 'INSURANCE',
    description:
      "Utah Labor Commission waiver, for owner-operators with no employees. Accepted in place of a workers' compensation certificate.",
    isRequired: false,
    hasExpiration: true,
    allowNotApplicable: true,
    blocksBid: false,
    blocksWork: false,
    sortOrder: 110,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.COMMERCIAL_AUTO,
    name: 'Commercial Auto Certificate',
    category: 'INSURANCE',
    description: 'Required when vehicles are used on Hardy Homes job sites.',
    isRequired: false,
    hasExpiration: true,
    allowNotApplicable: true,
    blocksBid: false,
    blocksWork: false,
    sortOrder: 120,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.UMBRELLA,
    name: 'Umbrella / Excess Coverage',
    category: 'INSURANCE',
    description: 'Upload if your company carries umbrella or excess liability coverage.',
    isRequired: false,
    hasExpiration: true,
    allowNotApplicable: true,
    blocksBid: false,
    blocksWork: false,
    sortOrder: 130,
  },

  // --- Agreements and policies --------------------------------------------
  // Every item below is a DRAFT placeholder pending attorney review.
  {
    ...base,
    code: REQUIREMENT_CODES.MASTER_SUBCONTRACT,
    name: 'Master Subcontract Agreement',
    category: 'AGREEMENTS_AND_POLICIES',
    description:
      'Draft pending legal review. Version 1 accepts an upload of an externally signed PDF. The portal does not provide electronic signature.',
    isRequired: true,
    hasExpiration: false,
    blocksBid: false,
    blocksWork: true,
    templateIsDraft: true,
    sortOrder: 140,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.CODE_OF_CONDUCT,
    name: 'Trade Partner Code of Conduct',
    category: 'AGREEMENTS_AND_POLICIES',
    description: 'Draft pending legal review. Acknowledged electronically in the portal.',
    isRequired: true,
    hasExpiration: false,
    blocksBid: false,
    blocksWork: true,
    isAcknowledgment: true,
    requiresReview: false,
    templateIsDraft: true,
    sortOrder: 150,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.SAFETY_ACKNOWLEDGMENT,
    name: 'Safety Acknowledgment',
    category: 'AGREEMENTS_AND_POLICIES',
    description: 'Draft pending legal review. Acknowledged electronically in the portal.',
    isRequired: true,
    hasExpiration: false,
    blocksBid: false,
    blocksWork: true,
    isAcknowledgment: true,
    requiresReview: false,
    templateIsDraft: true,
    sortOrder: 160,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.WARRANTY_STANDARDS,
    name: 'Warranty Standards',
    category: 'AGREEMENTS_AND_POLICIES',
    description: 'Draft pending legal review. Acknowledged electronically in the portal.',
    isRequired: true,
    hasExpiration: false,
    blocksBid: false,
    blocksWork: true,
    isAcknowledgment: true,
    requiresReview: false,
    templateIsDraft: true,
    sortOrder: 170,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.SCR_LIEN_COMPLIANCE,
    name: 'SCR and Lien Compliance Agreement',
    category: 'AGREEMENTS_AND_POLICIES',
    description:
      'Draft pending legal review. Covers State Construction Registry participation and lien waiver expectations. Acknowledged electronically.',
    isRequired: true,
    hasExpiration: false,
    blocksBid: false,
    blocksWork: true,
    isAcknowledgment: true,
    requiresReview: false,
    templateIsDraft: true,
    sortOrder: 180,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.COMMUNICATION_POLICY,
    name: 'Communication and Homeowner Contact Policy',
    category: 'AGREEMENTS_AND_POLICIES',
    description: 'Draft pending legal review. Acknowledged electronically in the portal.',
    isRequired: true,
    hasExpiration: false,
    blocksBid: false,
    blocksWork: true,
    isAcknowledgment: true,
    requiresReview: false,
    templateIsDraft: true,
    sortOrder: 190,
  },
  {
    ...base,
    code: REQUIREMENT_CODES.CONFIDENTIALITY_POLICY,
    name: 'Confidentiality, Plans, Photography and Social Media Policy',
    category: 'AGREEMENTS_AND_POLICIES',
    description: 'Draft pending legal review. Acknowledged electronically in the portal.',
    isRequired: false,
    hasExpiration: false,
    blocksBid: false,
    blocksWork: false,
    isAcknowledgment: true,
    requiresReview: false,
    templateIsDraft: true,
    sortOrder: 200,
  },
]

/**
 * Plain-language summary text shown next to each acknowledgment checkbox.
 *
 * These are operational summaries so a trade partner knows what they are
 * agreeing to. They are explicitly NOT the legal agreement, and the UI labels
 * them as drafts. The binding document is whatever template an administrator
 * uploads once counsel has approved it.
 */
export const ACKNOWLEDGMENT_SUMMARIES: Partial<Record<RequirementCode, string[]>> = {
  [REQUIREMENT_CODES.CODE_OF_CONDUCT]: [
    'Treat homeowners, neighbours, inspectors and other trades professionally.',
    'Keep the job site clean, secure and free of hazards at the end of each day.',
    'No alcohol, illegal drugs, firearms, or smoking inside a home under contract.',
    'Report damage, delays or scope conflicts to Hardy Homes promptly.',
  ],
  [REQUIREMENT_CODES.SAFETY_ACKNOWLEDGMENT]: [
    'Comply with all applicable UOSH and OSHA requirements for your scope.',
    'Provide your own PPE and ensure your crew is trained for the work performed.',
    'Report any injury or near-miss on a Hardy Homes site the same day.',
    'Stop work and notify Hardy Homes if a condition is unsafe.',
  ],
  [REQUIREMENT_CODES.WARRANTY_STANDARDS]: [
    'Correct defective workmanship in your scope during the warranty period.',
    'Respond to a warranty request within the timeframe Hardy Homes specifies.',
    'Coordinate homeowner access through Hardy Homes rather than directly.',
  ],
  [REQUIREMENT_CODES.SCR_LIEN_COMPLIANCE]: [
    'Provide lien waivers as a condition of payment.',
    'Ensure lower-tier subcontractors and suppliers are paid for work performed.',
    'Cooperate with State Construction Registry filing requirements.',
  ],
  [REQUIREMENT_CODES.COMMUNICATION_POLICY]: [
    'Route homeowner questions about scope, schedule or cost to Hardy Homes.',
    'Do not negotiate change orders or side work directly with a homeowner.',
    'Use the contact information Hardy Homes provides for each project.',
  ],
  [REQUIREMENT_CODES.CONFIDENTIALITY_POLICY]: [
    'Do not share plans, pricing, or homeowner information with third parties.',
    'Obtain Hardy Homes approval before photographing a project for marketing.',
    'Do not post identifiable project or homeowner content on social media.',
  ],
  [REQUIREMENT_CODES.ACH_SETUP]: [
    'Payment details have been provided to Hardy Homes through a secure channel.',
    'I understand this portal does not collect or store bank account numbers.',
  ],
}

/** Section G certification statements. */
export const CERTIFICATION_STATEMENTS = [
  'The information provided in this application is accurate and complete to the best of my knowledge.',
  'Our licences will be kept current for as long as we perform work for Hardy Homes.',
  'Our insurance coverage will be kept current for as long as we perform work for Hardy Homes.',
  'We will notify Hardy Homes of any material change to our licensing, insurance, ownership or capacity.',
  'No work may begin without written authorization from Hardy Homes.',
  'Submitting this application does not guarantee that Hardy Homes will award any work.',
  'Hardy Homes may verify any information submitted, including contacting the references provided.',
  'Hardy Homes may send notices and compliance reminders electronically to the contacts provided.',
]
