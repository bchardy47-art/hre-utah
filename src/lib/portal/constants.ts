/**
 * Shared, display-safe constants for the Trade Partner Portal.
 *
 * Importable from both server and client components — it contains no secrets
 * and no database access.
 */

import type {
  ApplicationStatusValue,
  CompanyStatusValue,
  ContactRoleValue,
  DocumentCategoryValue,
  DocumentStateValue,
  EntityTypeValue,
  InsuranceKindValue,
  InvitationStatusValue,
  ProjectKindValue,
} from './db/schema'

export const PORTAL_NAME = 'Hardy Homes Trade Partner Portal'
export const PORTAL_SHORT_NAME = 'Trade Partner Portal'
export const SUPPORT_EMAIL = 'Hardyhomesutah@gmail.com'
export const SUPPORT_PHONE_DISPLAY = '(801) 380-0445'
export const SUPPORT_PHONE_TEL = '8013800445'

// ---------------------------------------------------------------------------
// Company status
// ---------------------------------------------------------------------------

type StatusMeta = {
  label: string
  /** Short plain-English explanation shown in tooltips and the partner view. */
  description: string
  /** Drives the badge colour class in the portal stylesheet. */
  tone: 'neutral' | 'info' | 'progress' | 'good' | 'best' | 'warn' | 'bad'
}

export const COMPANY_STATUS_META: Record<CompanyStatusValue, StatusMeta> = {
  INVITED: {
    label: 'Invited',
    description: 'An invitation has been sent but the account has not been created yet.',
    tone: 'neutral',
  },
  APPLICATION_STARTED: {
    label: 'Application Started',
    description: 'The account exists and the application is partially complete.',
    tone: 'progress',
  },
  APPLICATION_SUBMITTED: {
    label: 'Application Submitted',
    description: 'The application has been submitted and is waiting on Hardy Homes.',
    tone: 'info',
  },
  DOCUMENTATION_PENDING: {
    label: 'Documentation Pending',
    description: 'Required documents are still missing or need to be corrected.',
    tone: 'warn',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    description: 'Hardy Homes is reviewing the application and submitted documents.',
    tone: 'info',
  },
  APPROVED_TO_BID: {
    label: 'Approved to Bid',
    description:
      'Cleared to provide pricing. Not cleared to mobilize or perform work until every mandatory compliance item is approved and current.',
    tone: 'good',
  },
  APPROVED_TO_WORK: {
    label: 'Approved to Work',
    description:
      'All mandatory compliance items are approved and current. Work still requires written authorization for each project.',
    tone: 'best',
  },
  PROBATIONARY: {
    label: 'Probationary',
    description: 'Approved with additional oversight from Hardy Homes.',
    tone: 'warn',
  },
  PREFERRED: {
    label: 'Preferred',
    description: 'A trusted trade partner in good standing.',
    tone: 'best',
  },
  SUSPENDED: {
    label: 'Suspended',
    description: 'Temporarily not eligible for bidding or work.',
    tone: 'bad',
  },
  DO_NOT_USE: {
    label: 'Do Not Use',
    description: 'Permanently ineligible. Requires an administrator to change.',
    tone: 'bad',
  },
  INACTIVE_EXPIRED_DOCUMENTS: {
    label: 'Inactive — Expired Documents',
    description:
      'A mandatory license or insurance document has expired. Work eligibility is removed until current documents are approved.',
    tone: 'bad',
  },
}

/**
 * Statuses that only an administrator may set. The compliance engine can
 * recommend them but never applies them on its own.
 */
export const ADMIN_ONLY_STATUSES: CompanyStatusValue[] = [
  'APPROVED_TO_WORK',
  'PREFERRED',
  'SUSPENDED',
  'DO_NOT_USE',
]

/** Statuses that require a written reason before they can be applied. */
export const STATUSES_REQUIRING_REASON: CompanyStatusValue[] = [
  'SUSPENDED',
  'DO_NOT_USE',
  'PROBATIONARY',
]

/**
 * Terminal statuses. Neither the expiration sweep nor the compliance engine may
 * move a company out of these — only an explicit administrator action can.
 */
export const LOCKED_STATUSES: CompanyStatusValue[] = ['SUSPENDED', 'DO_NOT_USE']

// ---------------------------------------------------------------------------
// Document state
// ---------------------------------------------------------------------------

export const DOCUMENT_STATE_META: Record<DocumentStateValue, StatusMeta> = {
  MISSING: { label: 'Missing', description: 'Not yet provided.', tone: 'warn' },
  SUBMITTED: { label: 'Submitted', description: 'Received, awaiting review.', tone: 'info' },
  UNDER_REVIEW: { label: 'Under Review', description: 'Being reviewed now.', tone: 'info' },
  APPROVED: { label: 'Approved', description: 'Accepted and current.', tone: 'best' },
  REJECTED: {
    label: 'Needs Correction',
    description: 'Not accepted. See the reason and resubmit.',
    tone: 'bad',
  },
  EXPIRED: { label: 'Expired', description: 'Past its expiration date.', tone: 'bad' },
  NOT_APPLICABLE: {
    label: 'Not Applicable',
    description: 'Waived by Hardy Homes for this company.',
    tone: 'neutral',
  },
  SUPERSEDED: {
    label: 'Superseded',
    description: 'Replaced by a newer version. Kept for history.',
    tone: 'neutral',
  },
}

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatusValue, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  SUBMITTED: 'Submitted',
  RETURNED_FOR_CORRECTION: 'Returned for Correction',
  APPROVED: 'Approved',
}

export const INVITATION_STATUS_LABEL: Record<InvitationStatusValue, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REVOKED: 'Revoked',
  EXPIRED: 'Expired',
}

export const DOCUMENT_CATEGORY_LABEL: Record<DocumentCategoryValue, string> = {
  TAX_AND_CORPORATE: 'Tax and Corporate',
  LICENSING: 'Licensing',
  INSURANCE: 'Insurance',
  AGREEMENTS_AND_POLICIES: 'Agreements and Policies',
  OTHER: 'Other',
}

export const ENTITY_TYPE_LABEL: Record<EntityTypeValue, string> = {
  SOLE_PROPRIETOR: 'Sole Proprietor',
  PARTNERSHIP: 'Partnership',
  LLC: 'LLC',
  S_CORP: 'S Corporation',
  C_CORP: 'C Corporation',
  NONPROFIT: 'Nonprofit',
  OTHER: 'Other',
}

export const CONTACT_ROLE_LABEL: Record<ContactRoleValue, string> = {
  OWNER_PRINCIPAL: 'Owner / Principal',
  PRIMARY: 'Primary Contact',
  ESTIMATING: 'Estimating',
  FIELD_SUPERVISOR: 'Field Supervisor',
  ACCOUNTING: 'Accounting',
  EMERGENCY: 'Emergency',
}

export const CONTACT_ROLE_ORDER: ContactRoleValue[] = [
  'OWNER_PRINCIPAL',
  'PRIMARY',
  'ESTIMATING',
  'FIELD_SUPERVISOR',
  'ACCOUNTING',
  'EMERGENCY',
]

export const INSURANCE_KIND_LABEL: Record<InsuranceKindValue, string> = {
  GENERAL_LIABILITY: 'General Liability',
  WORKERS_COMPENSATION: "Workers' Compensation",
  COMMERCIAL_AUTO: 'Commercial Auto',
  UMBRELLA_EXCESS: 'Umbrella / Excess',
}

export const PROJECT_KIND_LABEL: Record<ProjectKindValue, string> = {
  COMPARABLE: 'Recent comparable project',
  ACTIVE: 'Currently active project',
  COMPLETED_OVER_ONE_YEAR: 'Completed at least one year ago',
}

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

/** All 29 Utah counties. */
export const UTAH_COUNTIES = [
  'Beaver',
  'Box Elder',
  'Cache',
  'Carbon',
  'Daggett',
  'Davis',
  'Duchesne',
  'Emery',
  'Garfield',
  'Grand',
  'Iron',
  'Juab',
  'Kane',
  'Millard',
  'Morgan',
  'Piute',
  'Rich',
  'Salt Lake',
  'San Juan',
  'Sanpete',
  'Sevier',
  'Summit',
  'Tooele',
  'Uintah',
  'Utah',
  'Wasatch',
  'Washington',
  'Wayne',
  'Weber',
] as const

export const TRADES = [
  'Excavation / Site Work',
  'Concrete / Flatwork',
  'Foundation',
  'Framing',
  'Roofing',
  'Siding / Exterior',
  'Windows and Doors',
  'Plumbing',
  'HVAC',
  'Electrical',
  'Low Voltage',
  'Insulation',
  'Drywall',
  'Paint',
  'Finish Carpentry / Trim',
  'Cabinets and Countertops',
  'Flooring',
  'Tile',
  'Garage Doors',
  'Gutters',
  'Landscaping / Irrigation',
  'Fencing',
  'Masonry / Stone',
  'Stucco',
  'Fireplace',
  'Solar',
  'Cleaning',
  'General Labor',
  'Other',
] as const

export const PROJECT_SIZE_RANGES = [
  'Under $5,000',
  '$5,000 – $25,000',
  '$25,000 – $100,000',
  '$100,000 – $500,000',
  'Over $500,000',
] as const

export const CONTRACT_AMOUNT_RANGES = PROJECT_SIZE_RANGES

// ---------------------------------------------------------------------------
// Application sections
// ---------------------------------------------------------------------------

export const APPLICATION_SECTIONS = [
  { key: 'company', label: 'Company Information', letter: 'A' },
  { key: 'contacts', label: 'Contacts', letter: 'B' },
  { key: 'licensing', label: 'Licensing', letter: 'C' },
  { key: 'insurance', label: 'Insurance and Workers’ Comp', letter: 'D' },
  { key: 'experience', label: 'Experience and References', letter: 'E' },
  { key: 'disclosures', label: 'Operational Disclosures', letter: 'F' },
  { key: 'certification', label: 'Certification', letter: 'G' },
] as const

export type ApplicationSectionKey = (typeof APPLICATION_SECTIONS)[number]['key']

/** Bumped whenever the Section G certification wording changes. */
export const CERTIFICATION_VERSION = '2026-01-v1'

// ---------------------------------------------------------------------------
// Uploads
// ---------------------------------------------------------------------------

/**
 * Allow-list of accepted upload types. Extensions are never trusted — the
 * server sniffs magic bytes and cross-checks against this map.
 */
export const ALLOWED_UPLOAD_TYPES: Record<string, { ext: string[]; label: string }> = {
  'application/pdf': { ext: ['pdf'], label: 'PDF' },
  'image/jpeg': { ext: ['jpg', 'jpeg'], label: 'JPEG image' },
  'image/png': { ext: ['png'], label: 'PNG image' },
  'image/heic': { ext: ['heic'], label: 'HEIC image' },
  'image/webp': { ext: ['webp'], label: 'WebP image' },
}

export const ALLOWED_UPLOAD_LABEL = 'PDF, JPG, PNG, HEIC or WebP'

/** Days before expiration at which reminders fire. `0` means "on expiration". */
export const EXPIRATION_REMINDER_DAYS = [30, 14, 7, 0] as const
