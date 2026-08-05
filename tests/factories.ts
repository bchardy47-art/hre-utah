/**
 * Builders for compliance-engine tests.
 *
 * The engine takes plain data, so these are plain objects — no database, no
 * fixtures to reset between tests.
 */

import type { DocumentStateValue } from '@/lib/portal/firebase/types'
import type {
  Acknowledgment,
  Company,
  ComplianceInput,
  DocumentRequirement,
  PortalDocument,
} from '@/lib/portal/compliance'

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
    isRequired: overrides.isRequired ?? true,
    applicableTrades: overrides.applicableTrades ?? [],
    applicableEntityTypes: overrides.applicableEntityTypes ?? [],
    hasExpiration: overrides.hasExpiration ?? false,
    blocksBid: overrides.blocksBid ?? false,
    blocksWork: overrides.blocksWork ?? true,
    isAcknowledgment: overrides.isAcknowledgment ?? false,
    sortOrder: overrides.sortOrder ?? 100,
    isActive: overrides.isActive ?? true,
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
    expirationDate: overrides.expirationDate ?? null,
    submittedAt: overrides.submittedAt ?? NOW,
    rejectionReason: overrides.rejectionReason ?? null,
    notApplicableReason: overrides.notApplicableReason ?? null,
  } as PortalDocument
}

export function makeCompany(overrides: Partial<Company> = {}): Company {
  return {
    id: 'company-1',
    status: 'UNDER_REVIEW',
    legalName: 'Wasatch Framing LLC',
    entityType: 'LLC',
    primaryTrade: 'Framing',
    additionalTrades: [],
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
