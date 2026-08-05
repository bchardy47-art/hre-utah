/**
 * Firestore repository layer.
 *
 * This is the ONLY place Firestore document shapes are converted to and from the
 * domain types in ./types.ts. Two consequences that matter:
 *
 *   1. Timestamps become `Date` here, so the compliance engine and every UI
 *      component stay database-agnostic — which is why the existing compliance
 *      tests survived the migration from Postgres untouched.
 *
 *   2. Every read that a trade partner can reach is a *scoped* query (always
 *      filtered by companyId). Authorization still happens in the guards, but
 *      there is no repository function that returns "all documents" to a
 *      partner-facing caller.
 */

import 'server-only'
import { FieldValue, Timestamp, type Query } from 'firebase-admin/firestore'
import { adminDb } from './admin'
import {
  COLLECTIONS,
  type Acknowledgment,
  type Application,
  type AuditEvent,
  type Company,
  type Contact,
  type DocumentRequirement,
  type InsurancePolicy,
  type InternalNote,
  type Invitation,
  type License,
  type PortalDocument,
  type ProjectReference,
  type ReminderAction,
  type StatusHistoryEntry,
} from './types'

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

export function toDate(value: unknown): Date | null {
  if (value == null) return null
  if (value instanceof Date) return value
  if (value instanceof Timestamp) return value.toDate()
  if (typeof value === 'object' && 'toDate' in (value as object)) {
    try {
      return (value as { toDate: () => Date }).toDate()
    } catch {
      return null
    }
  }
  if (typeof value === 'string') {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
  }
  return null
}

const str = (v: unknown): string | null => (typeof v === 'string' && v !== '' ? v : null)
const num = (v: unknown): number | null => (typeof v === 'number' ? v : null)
const bool = (v: unknown): boolean | null => (typeof v === 'boolean' ? v : null)
const arr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [])

type Data = Record<string, unknown>

export function serverTimestamps(isNew: boolean) {
  return isNew
    ? { createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }
    : { updatedAt: FieldValue.serverTimestamp() }
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

export function mapCompany(id: string, d: Data): Company {
  return {
    id,
    status: (d.status as Company['status']) ?? 'INVITED',
    legalName: (d.legalName as string) ?? '',
    dba: str(d.dba),
    entityType: (d.entityType as Company['entityType']) ?? null,
    einLast4: str(d.einLast4),
    einConfirmedAt: toDate(d.einConfirmedAt),
    businessAddress1: str(d.businessAddress1),
    businessAddress2: str(d.businessAddress2),
    businessCity: str(d.businessCity),
    businessState: str(d.businessState),
    businessZip: str(d.businessZip),
    mailingSameAsBusiness: d.mailingSameAsBusiness !== false,
    mailingAddress1: str(d.mailingAddress1),
    mailingAddress2: str(d.mailingAddress2),
    mailingCity: str(d.mailingCity),
    mailingState: str(d.mailingState),
    mailingZip: str(d.mailingZip),
    mainPhone: str(d.mainPhone),
    generalEmail: str(d.generalEmail),
    website: str(d.website),
    yearEstablished: num(d.yearEstablished),
    yearsInBusiness: num(d.yearsInBusiness),
    primaryTrade: (d.primaryTrade as string) ?? '',
    additionalTrades: arr(d.additionalTrades),
    serviceAreas: arr(d.serviceAreas),
    typicalProjectSize: str(d.typicalProjectSize),
    largestProject: str(d.largestProject),
    crewSize: num(d.crewSize),
    annualCapacity: str(d.annualCapacity),
    currentBacklog: str(d.currentBacklog),
    usesLowerTierSubs: bool(d.usesLowerTierSubs),
    description: str(d.description),
    archivedAt: toDate(d.archivedAt),
    createdAt: toDate(d.createdAt) ?? new Date(0),
    updatedAt: toDate(d.updatedAt) ?? new Date(0),
  }
}

export function mapRequirement(id: string, d: Data): DocumentRequirement {
  return {
    id,
    code: (d.code as string) ?? '',
    name: (d.name as string) ?? '',
    category: (d.category as DocumentRequirement['category']) ?? 'OTHER',
    description: str(d.description),
    isRequired: d.isRequired !== false,
    applicableTrades: arr(d.applicableTrades),
    applicableEntityTypes: arr(d.applicableEntityTypes) as DocumentRequirement['applicableEntityTypes'],
    hasExpiration: Boolean(d.hasExpiration),
    allowNotApplicable: Boolean(d.allowNotApplicable),
    blocksBid: Boolean(d.blocksBid),
    blocksWork: d.blocksWork !== false,
    requiresReview: d.requiresReview !== false,
    isAcknowledgment: Boolean(d.isAcknowledgment),
    templateStoragePath: str(d.templateStoragePath),
    templateFilename: str(d.templateFilename),
    templateVersion: str(d.templateVersion),
    templateIsDraft: d.templateIsDraft !== false,
    sortOrder: num(d.sortOrder) ?? 100,
    isActive: d.isActive !== false,
    createdAt: toDate(d.createdAt) ?? new Date(0),
    updatedAt: toDate(d.updatedAt) ?? new Date(0),
  }
}

export function mapDocument(id: string, d: Data): PortalDocument {
  return {
    id,
    companyId: (d.companyId as string) ?? '',
    requirementId: (d.requirementId as string) ?? '',
    state: (d.state as PortalDocument['state']) ?? 'SUBMITTED',
    version: num(d.version) ?? 1,
    originalFilename: str(d.originalFilename),
    storagePath: str(d.storagePath),
    mimeType: str(d.mimeType),
    fileSize: num(d.fileSize),
    checksumSha256: str(d.checksumSha256),
    effectiveDate: toDate(d.effectiveDate),
    expirationDate: toDate(d.expirationDate),
    submittedById: str(d.submittedById),
    submittedAt: toDate(d.submittedAt) ?? new Date(0),
    reviewedById: str(d.reviewedById),
    reviewedAt: toDate(d.reviewedAt),
    rejectionReason: str(d.rejectionReason),
    adminNotes: str(d.adminNotes),
    notApplicableReason: str(d.notApplicableReason),
    notApplicableById: str(d.notApplicableById),
    supersededByDocumentId: str(d.supersededByDocumentId),
    createdAt: toDate(d.createdAt) ?? new Date(0),
    updatedAt: toDate(d.updatedAt) ?? new Date(0),
  }
}

export function mapApplication(id: string, d: Data): Application {
  const flag = (k: string) => bool(d[k])
  const text = (k: string) => str(d[k])
  return {
    id,
    companyId: (d.companyId as string) ?? '',
    status: (d.status as Application['status']) ?? 'NOT_STARTED',
    sectionProgress: (d.sectionProgress as Record<string, boolean>) ?? {},
    lastSection: str(d.lastSection),
    submittedAt: toDate(d.submittedAt),
    returnedAt: toDate(d.returnedAt),
    returnReason: str(d.returnReason),
    reviewedAt: toDate(d.reviewedAt),
    reviewedById: str(d.reviewedById),
    disclosurePendingLitigation: flag('disclosurePendingLitigation'),
    disclosurePendingLitigationText: text('disclosurePendingLitigationText'),
    disclosureBankruptcy: flag('disclosureBankruptcy'),
    disclosureBankruptcyText: text('disclosureBankruptcyText'),
    disclosureJudgmentsOrLiens: flag('disclosureJudgmentsOrLiens'),
    disclosureJudgmentsOrLiensText: text('disclosureJudgmentsOrLiensText'),
    disclosureInsuranceClaims: flag('disclosureInsuranceClaims'),
    disclosureInsuranceClaimsText: text('disclosureInsuranceClaimsText'),
    disclosureOshaCitations: flag('disclosureOshaCitations'),
    disclosureOshaCitationsText: text('disclosureOshaCitationsText'),
    disclosureSeriousInjuries: flag('disclosureSeriousInjuries'),
    disclosureSeriousInjuriesText: text('disclosureSeriousInjuriesText'),
    disclosureWarrantyDisputes: flag('disclosureWarrantyDisputes'),
    disclosureWarrantyDisputesText: text('disclosureWarrantyDisputesText'),
    disclosureAbandonedProjects: flag('disclosureAbandonedProjects'),
    disclosureAbandonedProjectsText: text('disclosureAbandonedProjectsText'),
    disclosureSupplierDisputes: flag('disclosureSupplierDisputes'),
    disclosureSupplierDisputesText: text('disclosureSupplierDisputesText'),
    disclosureUsesLowerTierSubs: flag('disclosureUsesLowerTierSubs'),
    disclosureUsesLowerTierSubsText: text('disclosureUsesLowerTierSubsText'),
    disclosureWorkersAuthorized: flag('disclosureWorkersAuthorized'),
    disclosureWorkersAuthorizedText: text('disclosureWorkersAuthorizedText'),
    certificationVersion: str(d.certificationVersion),
    certifiedAt: toDate(d.certifiedAt),
    signerName: str(d.signerName),
    signerTitle: str(d.signerTitle),
    signerIpAddress: str(d.signerIpAddress),
    signerUserAgent: str(d.signerUserAgent),
    createdAt: toDate(d.createdAt) ?? new Date(0),
    updatedAt: toDate(d.updatedAt) ?? new Date(0),
  }
}

export function mapContact(id: string, d: Data): Contact {
  return {
    id,
    companyId: (d.companyId as string) ?? '',
    role: (d.role as Contact['role']) ?? 'PRIMARY',
    name: (d.name as string) ?? '',
    title: str(d.title),
    email: str(d.email),
    phone: str(d.phone),
    createdAt: toDate(d.createdAt) ?? new Date(0),
    updatedAt: toDate(d.updatedAt) ?? new Date(0),
  }
}

export function mapInvitation(id: string, d: Data): Invitation {
  return {
    id,
    companyId: (d.companyId as string) ?? '',
    email: (d.email as string) ?? '',
    contactName: (d.contactName as string) ?? '',
    contactPhone: str(d.contactPhone),
    tokenHash: (d.tokenHash as string) ?? '',
    status: (d.status as Invitation['status']) ?? 'PENDING',
    message: str(d.message),
    expiresAt: toDate(d.expiresAt) ?? new Date(0),
    sentAt: toDate(d.sentAt) ?? new Date(0),
    lastSentAt: toDate(d.lastSentAt) ?? new Date(0),
    resendCount: num(d.resendCount) ?? 0,
    openedAt: toDate(d.openedAt),
    acceptedAt: toDate(d.acceptedAt),
    revokedAt: toDate(d.revokedAt),
    createdById: str(d.createdById),
    revokedById: str(d.revokedById),
    createdAt: toDate(d.createdAt) ?? new Date(0),
    updatedAt: toDate(d.updatedAt) ?? new Date(0),
  }
}

export function mapLicense(id: string, d: Data): License {
  return {
    id,
    companyId: (d.companyId as string) ?? '',
    licenseNumber: (d.licenseNumber as string) ?? '',
    classification: str(d.classification),
    licensedEntityName: str(d.licensedEntityName),
    qualifierName: str(d.qualifierName),
    issueDate: toDate(d.issueDate),
    expirationDate: toDate(d.expirationDate),
    otherInformation: str(d.otherInformation),
    everDisciplined: Boolean(d.everDisciplined),
    disciplineExplanation: str(d.disciplineExplanation),
    verificationStatus: (d.verificationStatus as License['verificationStatus']) ?? 'NOT_VERIFIED',
    verifiedById: str(d.verifiedById),
    verifiedAt: toDate(d.verifiedAt),
    verificationNotes: str(d.verificationNotes),
    verificationSource: str(d.verificationSource),
    createdAt: toDate(d.createdAt) ?? new Date(0),
    updatedAt: toDate(d.updatedAt) ?? new Date(0),
  }
}

export function mapInsurance(id: string, d: Data): InsurancePolicy {
  return {
    id,
    companyId: (d.companyId as string) ?? '',
    kind: (d.kind as InsurancePolicy['kind']) ?? 'GENERAL_LIABILITY',
    carrier: str(d.carrier),
    policyNumber: str(d.policyNumber),
    perOccurrenceLimit: str(d.perOccurrenceLimit),
    aggregateLimit: str(d.aggregateLimit),
    effectiveDate: toDate(d.effectiveDate),
    expirationDate: toDate(d.expirationDate),
    notes: str(d.notes),
    createdAt: toDate(d.createdAt) ?? new Date(0),
    updatedAt: toDate(d.updatedAt) ?? new Date(0),
  }
}

export function mapProject(id: string, d: Data): ProjectReference {
  return {
    id,
    companyId: (d.companyId as string) ?? '',
    kind: (d.kind as ProjectReference['kind']) ?? 'COMPARABLE',
    projectName: str(d.projectName),
    projectType: str(d.projectType),
    projectLocation: str(d.projectLocation),
    contractAmountRange: str(d.contractAmountRange),
    completionDate: toDate(d.completionDate),
    scopePerformed: str(d.scopePerformed),
    referenceName: (d.referenceName as string) ?? '',
    referenceCompany: str(d.referenceCompany),
    referencePhone: str(d.referencePhone),
    referenceEmail: str(d.referenceEmail),
    permissionToContact: Boolean(d.permissionToContact),
    contactedById: str(d.contactedById),
    contactedAt: toDate(d.contactedAt),
    contactNotes: str(d.contactNotes),
    createdAt: toDate(d.createdAt) ?? new Date(0),
    updatedAt: toDate(d.updatedAt) ?? new Date(0),
  }
}

export function mapAcknowledgment(id: string, d: Data): Acknowledgment {
  return {
    id,
    companyId: (d.companyId as string) ?? '',
    requirementId: (d.requirementId as string) ?? '',
    templateVersion: (d.templateVersion as string) ?? 'draft',
    signerName: (d.signerName as string) ?? '',
    signerTitle: str(d.signerTitle),
    acknowledgedAt: toDate(d.acknowledgedAt) ?? new Date(0),
    acknowledgedById: str(d.acknowledgedById),
    ipAddress: str(d.ipAddress),
    userAgent: str(d.userAgent),
  }
}

export function mapStatusHistory(id: string, d: Data): StatusHistoryEntry {
  return {
    id,
    companyId: (d.companyId as string) ?? '',
    fromStatus: (d.fromStatus as StatusHistoryEntry['fromStatus']) ?? null,
    toStatus: (d.toStatus as StatusHistoryEntry['toStatus']) ?? 'INVITED',
    reason: str(d.reason),
    changedById: str(d.changedById),
    changedByName: str(d.changedByName),
    isSystemGenerated: Boolean(d.isSystemGenerated),
    createdAt: toDate(d.createdAt) ?? new Date(0),
  }
}

export function mapInternalNote(id: string, d: Data): InternalNote {
  return {
    id,
    companyId: (d.companyId as string) ?? '',
    documentId: str(d.documentId),
    authorId: (d.authorId as string) ?? '',
    authorName: (d.authorName as string) ?? 'Unknown',
    body: (d.body as string) ?? '',
    createdAt: toDate(d.createdAt) ?? new Date(0),
  }
}

export function mapAuditEvent(id: string, d: Data): AuditEvent {
  return {
    id,
    companyId: str(d.companyId),
    actorUserId: str(d.actorUserId),
    actorRole: (d.actorRole as AuditEvent['actorRole']) ?? null,
    actorLabel: str(d.actorLabel),
    action: (d.action as string) ?? '',
    targetType: str(d.targetType),
    targetId: str(d.targetId),
    summary: (d.summary as string) ?? '',
    metadata: (d.metadata as Record<string, unknown>) ?? null,
    ipAddress: str(d.ipAddress),
    userAgent: str(d.userAgent),
    createdAt: toDate(d.createdAt) ?? new Date(0),
  }
}

export function mapReminderAction(id: string, d: Data): ReminderAction {
  return {
    id,
    companyId: (d.companyId as string) ?? '',
    documentId: str(d.documentId),
    requirementId: str(d.requirementId),
    messageType: (d.messageType as string) ?? '',
    threshold: (d.threshold as string) ?? 'n/a',
    kind: (d.kind as ReminderAction['kind']) ?? 'DRAFT_OPENED',
    dedupeKey: (d.dedupeKey as string) ?? id,
    toEmail: (d.toEmail as string) ?? '',
    subject: (d.subject as string) ?? '',
    actorUserId: str(d.actorUserId),
    actorName: str(d.actorName),
    createdAt: toDate(d.createdAt) ?? new Date(0),
  }
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

const db = () => adminDb()

async function readAll<T>(q: Query, map: (id: string, d: Data) => T): Promise<T[]> {
  const snap = await q.get()
  return snap.docs.map((doc) => map(doc.id, doc.data() as Data))
}

export async function getCompany(companyId: string): Promise<Company | null> {
  const snap = await db().collection(COLLECTIONS.companies).doc(companyId).get()
  return snap.exists ? mapCompany(snap.id, snap.data() as Data) : null
}

export async function listActiveCompanies(): Promise<Company[]> {
  // archivedAt == null keeps soft-deleted companies out of every operational view.
  const rows = await readAll(
    db().collection(COLLECTIONS.companies).where('archivedAt', '==', null),
    mapCompany,
  )
  return rows.sort((a, b) => a.legalName.localeCompare(b.legalName))
}

export async function getApplication(companyId: string): Promise<Application | null> {
  const rows = await readAll(
    db().collection(COLLECTIONS.applications).where('companyId', '==', companyId).limit(1),
    mapApplication,
  )
  return rows[0] ?? null
}

export async function listActiveRequirements(): Promise<DocumentRequirement[]> {
  const rows = await readAll(
    db().collection(COLLECTIONS.requirements).where('isActive', '==', true),
    mapRequirement,
  )
  return rows.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
}

export async function getRequirement(id: string): Promise<DocumentRequirement | null> {
  const snap = await db().collection(COLLECTIONS.requirements).doc(id).get()
  return snap.exists ? mapRequirement(snap.id, snap.data() as Data) : null
}

export async function listCompanyDocuments(companyId: string): Promise<PortalDocument[]> {
  return readAll(
    db().collection(COLLECTIONS.documents).where('companyId', '==', companyId),
    mapDocument,
  )
}

export async function getDocument(documentId: string): Promise<PortalDocument | null> {
  const snap = await db().collection(COLLECTIONS.documents).doc(documentId).get()
  return snap.exists ? mapDocument(snap.id, snap.data() as Data) : null
}

export async function listContacts(companyId: string): Promise<Contact[]> {
  return readAll(
    db().collection(COLLECTIONS.contacts).where('companyId', '==', companyId),
    mapContact,
  )
}

export async function listLicenses(companyId: string): Promise<License[]> {
  return readAll(
    db().collection(COLLECTIONS.licenses).where('companyId', '==', companyId),
    mapLicense,
  )
}

export async function listInsurance(companyId: string): Promise<InsurancePolicy[]> {
  return readAll(
    db().collection(COLLECTIONS.insurance).where('companyId', '==', companyId),
    mapInsurance,
  )
}

export async function listProjects(companyId: string): Promise<ProjectReference[]> {
  return readAll(
    db().collection(COLLECTIONS.projects).where('companyId', '==', companyId),
    mapProject,
  )
}

export async function listAcknowledgments(companyId: string): Promise<Acknowledgment[]> {
  return readAll(
    db().collection(COLLECTIONS.acknowledgments).where('companyId', '==', companyId),
    mapAcknowledgment,
  )
}

export async function listStatusHistory(companyId: string): Promise<StatusHistoryEntry[]> {
  const rows = await readAll(
    db().collection(COLLECTIONS.statusHistory).where('companyId', '==', companyId),
    mapStatusHistory,
  )
  return rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function listAuditEvents(companyId: string, limit = 250): Promise<AuditEvent[]> {
  const rows = await readAll(
    db()
      .collection(COLLECTIONS.auditEvents)
      .where('companyId', '==', companyId)
      .orderBy('createdAt', 'desc')
      .limit(limit),
    mapAuditEvent,
  )
  return rows
}

export async function listInvitations(companyId: string): Promise<Invitation[]> {
  const rows = await readAll(
    db().collection(COLLECTIONS.invitations).where('companyId', '==', companyId),
    mapInvitation,
  )
  return rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function listReminderActions(companyId: string): Promise<ReminderAction[]> {
  return readAll(
    db().collection(COLLECTIONS.reminderActions).where('companyId', '==', companyId),
    mapReminderAction,
  )
}

/**
 * Internal notes. Takes the caller's role so the check cannot be forgotten at a
 * call site — there is no unguarded read path to this collection.
 */
export async function listInternalNotes(
  companyId: string,
  role: 'ADMIN' | 'TRADE_PARTNER',
): Promise<InternalNote[]> {
  if (role !== 'ADMIN') return []
  const rows = await readAll(
    db().collection(COLLECTIONS.internalNotes).where('companyId', '==', companyId),
    mapInternalNote,
  )
  return rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

/**
 * Bulk load for the admin dashboard.
 *
 * Firestore caps an `in` filter at 30 values, so company ids are chunked. This
 * keeps the list view to a bounded number of round trips instead of N+1.
 */
export async function listDocumentsForCompanies(
  companyIds: string[],
): Promise<Map<string, PortalDocument[]>> {
  const out = new Map<string, PortalDocument[]>()
  if (companyIds.length === 0) return out

  for (let i = 0; i < companyIds.length; i += 30) {
    const chunk = companyIds.slice(i, i + 30)
    const rows = await readAll(
      db().collection(COLLECTIONS.documents).where('companyId', 'in', chunk),
      mapDocument,
    )
    for (const row of rows) {
      const list = out.get(row.companyId) ?? []
      list.push(row)
      out.set(row.companyId, list)
    }
  }
  return out
}

export async function listByCompanyIds<T extends { companyId: string }>(
  collection: string,
  companyIds: string[],
  map: (id: string, d: Data) => T,
): Promise<Map<string, T[]>> {
  const out = new Map<string, T[]>()
  if (companyIds.length === 0) return out

  for (let i = 0; i < companyIds.length; i += 30) {
    const chunk = companyIds.slice(i, i + 30)
    const rows = await readAll(db().collection(collection).where('companyId', 'in', chunk), map)
    for (const row of rows) {
      const list = out.get(row.companyId) ?? []
      list.push(row)
      out.set(row.companyId, list)
    }
  }
  return out
}
