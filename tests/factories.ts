/**
 * Builders for compliance-engine tests.
 *
 * The engine takes plain data, so these are plain objects — no database, no
 * fixtures to reset between tests.
 */

import type {
  Acknowledgment,
  Company,
  DocumentRequirement,
  DocumentStateValue,
  PortalDocument,
} from '@/lib/portal/db/schema'
import type { ComplianceInput } from '@/lib/portal/compliance'

export const NOW = new Date('2026-06-01T12:00:00Z')

export function daysFromNow(days: number, from: Date = NOW): Date {
  const date = new Date(from)
  date.setDate(date.getDate() + days)
  return date
}

let counter = 0
const nextId = (prefix: string) => `${prefix}-${++counter}`

export function makeRequirement(
  overrides: Partial<DocumentRequirement> & { code: string },
): DocumentRequirement {
  return {
    id: overrides.id ?? nextId('req'),
    code: overrides.code,
    name: overrides.name ?? overrides.code,
    category: overrides.category ?? 'INSURANCE',
    description: overrides.description ?? null,
    isRequired: overrides.isRequired ?? true,
    applicableTrades: overrides.applicableTrades ?? [],
    applicableEntityTypes: overrides.applicableEntityTypes ?? [],
    hasExpiration: overrides.hasExpiration ?? false,
    allowNotApplicable: overrides.allowNotApplicable ?? false,
    blocksBid: overrides.blocksBid ?? false,
    blocksWork: overrides.blocksWork ?? true,
    requiresReview: overrides.requiresReview ?? true,
    isAcknowledgment: overrides.isAcknowledgment ?? false,
    templateStorageKey: null,
    templateFilename: null,
    templateVersion: null,
    templateIsDraft: false,
    sortOrder: overrides.sortOrder ?? 100,
    isActive: overrides.isActive ?? true,
    createdAt: NOW,
    updatedAt: NOW,
  } as DocumentRequirement
}

export function makeDocument(
  requirement: DocumentRequirement,
  state: DocumentStateValue,
  overrides: Partial<PortalDocument> = {},
): PortalDocument {
  return {
    id: overrides.id ?? nextId('doc'),
    companyId: overrides.companyId ?? 'company-1',
    requirementId: requirement.id,
    state,
    version: overrides.version ?? 1,
    originalFilename: 'certificate.pdf',
    storageKey: `companies/company-1/2026/${requirement.code}/abc.pdf`,
    mimeType: 'application/pdf',
    fileSize: 1024,
    checksumSha256: null,
    effectiveDate: null,
    expirationDate: overrides.expirationDate ?? null,
    submittedById: null,
    submittedAt: overrides.submittedAt ?? NOW,
    reviewedById: null,
    reviewedAt: null,
    rejectionReason: overrides.rejectionReason ?? null,
    adminNotes: null,
    notApplicableReason: overrides.notApplicableReason ?? null,
    notApplicableById: null,
    supersededByDocumentId: overrides.supersededByDocumentId ?? null,
    createdAt: NOW,
    updatedAt: NOW,
  } as PortalDocument
}

export function makeCompany(overrides: Partial<Company> = {}): Company {
  return {
    id: 'company-1',
    status: 'UNDER_REVIEW',
    legalName: 'Wasatch Framing LLC',
    dba: null,
    entityType: 'LLC',
    einLast4: '1234',
    primaryTrade: 'Framing',
    additionalTrades: [],
    serviceAreas: ['Utah'],
    archivedAt: null,
    ...overrides,
  } as Company
}

export function makeAcknowledgment(
  requirement: DocumentRequirement,
): Pick<Acknowledgment, 'requirementId' | 'templateVersion' | 'acknowledgedAt'> {
  return {
    requirementId: requirement.id,
    templateVersion: 'draft',
    acknowledgedAt: NOW,
  }
}

/** A company that satisfies every gate except the ones a test deliberately breaks. */
export function makeCompliantInput(
  overrides: Partial<ComplianceInput> = {},
): ComplianceInput {
  const w9 = makeRequirement({ code: 'W9', name: 'W-9', category: 'TAX_AND_CORPORATE' })
  const gl = makeRequirement({
    code: 'GL_CERTIFICATE',
    name: 'General Liability Certificate',
    hasExpiration: true,
  })

  return {
    company: makeCompany({ status: 'APPROVED_TO_BID' }),
    application: { status: 'APPROVED' },
    requirements: [w9, gl],
    documents: [
      makeDocument(w9, 'APPROVED'),
      makeDocument(gl, 'APPROVED', { expirationDate: daysFromNow(200) }),
    ],
    acknowledgments: [],
    hasPrimaryContact: true,
    hasLicenseRecord: true,
    licenseVerified: true,
    now: NOW,
    ...overrides,
  }
}
