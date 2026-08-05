/**
 * Input validation for every Server Action and Route Handler in the portal.
 *
 * Everything that crosses the network boundary is parsed here before it reaches
 * a service. Client-side `required` attributes are a convenience for the person
 * filling the form; these schemas are the actual rule.
 */

import { z } from 'zod'
import { CONTACT_ROLE_ORDER, TRADES, UTAH_COUNTIES } from './constants'

const trimmed = (max: number) => z.string().trim().max(max)
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === '' ? undefined : v))

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, 'Enter an email address.')
  .max(200)
  .email('Enter a valid email address.')

export const phoneSchema = z
  .string()
  .trim()
  .max(30)
  .regex(/^[\d\s()+\-.x]*$/i, 'Enter a valid phone number.')

/** Accepts an empty string (meaning "not provided") or a valid ISO date. */
export const dateStringSchema = z
  .string()
  .trim()
  .refine((v) => v === '' || !Number.isNaN(Date.parse(v)), 'Enter a valid date.')
  .transform((v) => (v === '' ? null : new Date(`${v}T12:00:00Z`)))

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password.').max(200),
  next: z.string().max(300).optional(),
})

export const acceptInvitationSchema = z
  .object({
    token: z.string().min(20).max(200),
    name: trimmed(120).min(2, 'Enter your full name.'),
    phone: phoneSchema.optional(),
    password: z.string().min(12, 'Use at least 12 characters.').max(200),
    confirmPassword: z.string().max(200),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'The two passwords do not match.',
    path: ['confirmPassword'],
  })

// ---------------------------------------------------------------------------
// Invitations
// ---------------------------------------------------------------------------

export const createInvitationSchema = z.object({
  companyName: trimmed(200).min(2, 'Enter the company name.'),
  contactName: trimmed(120).min(2, 'Enter a contact name.'),
  contactEmail: emailSchema,
  contactPhone: phoneSchema.optional(),
  primaryTrade: z.enum(TRADES as unknown as [string, ...string[]]),
  message: optionalText(1000),
})

// ---------------------------------------------------------------------------
// Application sections
// ---------------------------------------------------------------------------

export const companySectionSchema = z.object({
  legalName: trimmed(200).min(2, 'Enter the legal business name.'),
  dba: optionalText(200),
  entityType: z.enum([
    'SOLE_PROPRIETOR',
    'PARTNERSHIP',
    'LLC',
    'S_CORP',
    'C_CORP',
    'NONPROFIT',
    'OTHER',
  ]),
  /**
   * Only the last four digits are accepted. The portal deliberately does not
   * collect or store a full EIN — the uploaded W-9 is the system of record.
   */
  einLast4: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'Enter the last four digits of your EIN.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  businessAddress1: trimmed(200).min(3, 'Enter a street address.'),
  businessAddress2: optionalText(200),
  businessCity: trimmed(100).min(2, 'Enter a city.'),
  businessState: trimmed(2).min(2, 'Enter a state.'),
  businessZip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, 'Enter a valid ZIP code.'),
  mailingSameAsBusiness: z.coerce.boolean().default(true),
  mailingAddress1: optionalText(200),
  mailingAddress2: optionalText(200),
  mailingCity: optionalText(100),
  mailingState: optionalText(2),
  mailingZip: optionalText(10),
  mainPhone: phoneSchema.min(7, 'Enter a main phone number.'),
  generalEmail: emailSchema,
  website: optionalText(200),
  yearEstablished: z.coerce.number().int().min(1850).max(2100).optional(),
  yearsInBusiness: z.coerce.number().int().min(0).max(200).optional(),
  primaryTrade: z.enum(TRADES as unknown as [string, ...string[]]),
  additionalTrades: z.array(z.string().max(80)).max(30).default([]),
  serviceAreas: z.array(z.enum(UTAH_COUNTIES as unknown as [string, ...string[]])).max(29).default([]),
  typicalProjectSize: optionalText(80),
  largestProject: optionalText(500),
  crewSize: z.coerce.number().int().min(0).max(10000).optional(),
  annualCapacity: optionalText(120),
  currentBacklog: optionalText(120),
  usesLowerTierSubs: z.coerce.boolean().optional(),
  description: optionalText(2000),
})

export const contactSchema = z.object({
  role: z.enum(CONTACT_ROLE_ORDER as unknown as [string, ...string[]]),
  name: optionalText(120),
  title: optionalText(120),
  email: z.union([emailSchema, z.literal('')]).optional(),
  phone: phoneSchema.optional(),
})

export const contactsSectionSchema = z.object({
  contacts: z.array(contactSchema).max(10),
})

export const licensingSectionSchema = z.object({
  licenseNumber: optionalText(60),
  classification: optionalText(120),
  licensedEntityName: optionalText(200),
  qualifierName: optionalText(120),
  issueDate: dateStringSchema.optional(),
  expirationDate: dateStringSchema.optional(),
  otherInformation: optionalText(1000),
  everDisciplined: z.coerce.boolean().default(false),
  disciplineExplanation: optionalText(2000),
})

export const insurancePolicySchema = z.object({
  kind: z.enum(['GENERAL_LIABILITY', 'WORKERS_COMPENSATION', 'COMMERCIAL_AUTO', 'UMBRELLA_EXCESS']),
  carrier: optionalText(200),
  policyNumber: optionalText(120),
  perOccurrenceLimit: optionalText(60),
  aggregateLimit: optionalText(60),
  effectiveDate: dateStringSchema.optional(),
  expirationDate: dateStringSchema.optional(),
  notes: optionalText(500),
})

export const insuranceSectionSchema = z.object({
  policies: z.array(insurancePolicySchema).max(8),
})

export const projectReferenceSchema = z.object({
  kind: z.enum(['COMPARABLE', 'ACTIVE', 'COMPLETED_OVER_ONE_YEAR']),
  projectName: optionalText(200),
  projectType: optionalText(120),
  projectLocation: optionalText(200),
  contractAmountRange: optionalText(80),
  completionDate: dateStringSchema.optional(),
  scopePerformed: optionalText(1000),
  referenceName: trimmed(120).min(2, 'Enter a reference name.'),
  referenceCompany: optionalText(200),
  referencePhone: phoneSchema.optional(),
  referenceEmail: z.union([emailSchema, z.literal('')]).optional(),
  permissionToContact: z.coerce.boolean().default(false),
})

export const experienceSectionSchema = z.object({
  projects: z.array(projectReferenceSchema).max(12),
})

const disclosure = z.object({
  answer: z.enum(['yes', 'no', '']).transform((v) => (v === '' ? undefined : v === 'yes')),
  explanation: optionalText(2000),
})

export const disclosuresSectionSchema = z.object({
  pendingLitigation: disclosure,
  bankruptcy: disclosure,
  judgmentsOrLiens: disclosure,
  insuranceClaims: disclosure,
  oshaCitations: disclosure,
  seriousInjuries: disclosure,
  warrantyDisputes: disclosure,
  abandonedProjects: disclosure,
  supplierDisputes: disclosure,
  usesLowerTierSubs: disclosure,
  workersAuthorized: disclosure,
})

export const certificationSchema = z.object({
  signerName: trimmed(120).min(2, 'Type your full name.'),
  signerTitle: trimmed(120).min(2, 'Enter your title.'),
  acknowledged: z.literal('on', { message: 'You must check the acknowledgment box to submit.' }),
})

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export const documentUploadSchema = z.object({
  requirementId: z.string().min(1).max(80),
  effectiveDate: dateStringSchema.optional(),
  expirationDate: dateStringSchema.optional(),
})

export const documentReviewSchema = z
  .object({
    documentId: z.string().min(1).max(80),
    decision: z.enum(['APPROVED', 'REJECTED', 'UNDER_REVIEW', 'NOT_APPLICABLE']),
    reason: optionalText(1000),
    notes: optionalText(2000),
  })
  .refine((d) => d.decision !== 'REJECTED' || Boolean(d.reason), {
    message: 'A reason is required when rejecting a document.',
    path: ['reason'],
  })
  .refine((d) => d.decision !== 'NOT_APPLICABLE' || Boolean(d.reason), {
    message: 'A reason is required when marking an item not applicable.',
    path: ['reason'],
  })

export const acknowledgmentSchema = z.object({
  requirementId: z.string().min(1).max(80),
  signerName: trimmed(120).min(2, 'Type your full name to acknowledge.'),
  signerTitle: optionalText(120),
  agreed: z.literal('on', { message: 'Check the box to acknowledge.' }),
})

// ---------------------------------------------------------------------------
// Administration
// ---------------------------------------------------------------------------

export const statusChangeSchema = z.object({
  companyId: z.string().min(1).max(80),
  status: z.enum([
    'APPLICATION_STARTED',
    'APPLICATION_SUBMITTED',
    'DOCUMENTATION_PENDING',
    'UNDER_REVIEW',
    'APPROVED_TO_BID',
    'APPROVED_TO_WORK',
    'PROBATIONARY',
    'PREFERRED',
    'SUSPENDED',
    'DO_NOT_USE',
    'INACTIVE_EXPIRED_DOCUMENTS',
  ]),
  reason: optionalText(1000),
})

export const internalNoteSchema = z.object({
  companyId: z.string().min(1).max(80),
  documentId: optionalText(80),
  body: trimmed(4000).min(2, 'Enter a note.'),
})

export const licenseVerificationSchema = z.object({
  licenseId: z.string().min(1).max(80),
  verificationStatus: z.enum(['NOT_VERIFIED', 'VERIFIED', 'REJECTED']),
  verificationNotes: optionalText(2000),
  verificationSource: optionalText(500),
})

export const applicationReviewSchema = z.object({
  companyId: z.string().min(1).max(80),
  decision: z.enum(['APPROVE', 'RETURN']),
  reason: optionalText(2000),
})

export const referenceContactSchema = z.object({
  projectId: z.string().min(1).max(80),
  contactNotes: trimmed(2000).min(2, 'Enter what the reference said.'),
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export type FieldErrors = Record<string, string>

/** Flattens a ZodError into a `field -> first message` map for form rendering. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_form'
    if (!out[key]) out[key] = issue.message
  }
  return out
}

export type ActionState = {
  ok?: boolean
  message?: string
  errors?: FieldErrors
}

/**
 * Reads a single form field as `string | undefined`.
 *
 * `FormData.get()` returns `null` for a field that is not present in the
 * submission — which is exactly what happens to any conditionally rendered
 * input, such as the mailing address block that is hidden when "same as
 * business" is ticked. Passing that `null` into an `.optional()` Zod string
 * fails with "expected string, received null", so the whole section refuses to
 * save. Always read optional fields through this helper.
 */
export function formValue(formData: FormData, key: string): string | undefined {
  const raw = formData.get(key)
  if (raw === null || typeof raw !== 'string') return undefined
  return raw
}

/** Same as `formValue`, but returns `''` rather than `undefined` for absent fields. */
export function formText(formData: FormData, key: string): string {
  return formValue(formData, key) ?? ''
}

/** Reads repeated form fields (`contacts.0.name`) into an indexed array. */
export function collectIndexed(
  formData: FormData,
  prefix: string,
): Record<string, string>[] {
  const rows = new Map<number, Record<string, string>>()
  for (const [key, value] of formData.entries()) {
    const match = key.match(new RegExp(`^${prefix}\\.(\\d+)\\.(.+)$`))
    if (!match) continue
    const index = Number(match[1])
    const field = match[2]
    const row = rows.get(index) ?? {}
    row[field] = typeof value === 'string' ? value : ''
    rows.set(index, row)
  }
  return [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([, row]) => row)
}
