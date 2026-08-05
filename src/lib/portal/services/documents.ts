/**
 * Document submission, review, and versioning.
 *
 * Version rule: uploading a replacement never destroys the previous record. The
 * old row is marked SUPERSEDED and pointed at its replacement, and its R2 object
 * is retained. The compliance engine only ever considers the newest
 * non-superseded row, so history is free.
 */

import 'server-only'
import { and, desc, eq, inArray, ne } from 'drizzle-orm'
import { db } from '../db'
import {
  acknowledgments,
  companies,
  documentRequirements,
  documentReviews,
  documents,
  internalNotes,
  users,
  type DocumentRequirement,
  type PortalDocument,
} from '../db/schema'
import { AUDIT, recordAudit } from '../audit'
import type { PortalSession } from '../auth/session'
import { requestContext } from '../auth/session'
import {
  buildStorageKey,
  deleteObject,
  sanitiseFilename,
  signedUploadUrl,
  verifyUploadedObject,
} from '../storage'
import { ALLOWED_UPLOAD_LABEL, ALLOWED_UPLOAD_TYPES } from '../constants'
import { MAX_UPLOAD_BYTES } from '../env'
import { sendPortalEmail } from '../email/mailer'
import { NOTIFICATION_TYPES } from '../email/templates'
import { serverEnv } from '../env'

/**
 * Upload is two-phase, because the bytes go straight from the browser to R2
 * rather than through the serverless function (see storage.ts for why).
 *
 *   1. `prepareDocumentUpload` authorizes the request and hands back a
 *      server-chosen object key plus a five-minute signed PUT URL. Nothing is
 *      written to the database yet.
 *   2. The browser PUTs the file to R2.
 *   3. `finalizeDocumentUpload` re-reads the object from R2, validates its real
 *      size and magic bytes, and only then records the document row.
 *
 * An object that fails step 3 is deleted, so a caller cannot register a file the
 * server never approved, and a half-finished upload leaves no row behind.
 */

export type PrepareResult =
  | { ok: true; storageKey: string; uploadUrl: string; contentType: string }
  | { ok: false; error: string }

export async function prepareDocumentUpload(input: {
  companyId: string
  requirementId: string
  filename: string
  declaredType: string
  declaredSize: number
  actor: PortalSession
}): Promise<PrepareResult> {
  const [requirement] = await db
    .select()
    .from(documentRequirements)
    .where(eq(documentRequirements.id, input.requirementId))
    .limit(1)
  if (!requirement || !requirement.isActive) {
    return { ok: false, error: 'That document requirement is not available.' }
  }
  if (requirement.isAcknowledgment) {
    return { ok: false, error: 'That item is acknowledged in the portal rather than uploaded.' }
  }

  // A cheap early rejection on the client's own numbers. The authoritative
  // check happens in finalize, against what R2 actually stored.
  if (input.declaredSize > MAX_UPLOAD_BYTES) {
    const mb = Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))
    return { ok: false, error: `Files must be ${mb} MB or smaller.` }
  }
  const allowed = ALLOWED_UPLOAD_TYPES[input.declaredType]
  if (!allowed) {
    return { ok: false, error: `That file type is not accepted. Please upload a ${ALLOWED_UPLOAD_LABEL}.` }
  }

  const declaredExt = sanitiseFilename(input.filename).split('.').pop()?.toLowerCase() ?? ''
  const extension = allowed.ext.includes(declaredExt) ? declaredExt : allowed.ext[0]
  const storageKey = buildStorageKey(input.companyId, requirement.code, extension)

  try {
    const uploadUrl = await signedUploadUrl(storageKey, input.declaredType)
    return { ok: true, storageKey, uploadUrl, contentType: input.declaredType }
  } catch (error) {
    console.error('[portal:documents] could not sign upload URL', error)
    return { ok: false, error: 'Uploads are not available right now. Please try again shortly.' }
  }
}

export type UploadResult =
  | { ok: true; documentId: string; supersededId: string | null }
  | { ok: false; error: string }

export type FinalizeInput = {
  companyId: string
  requirementId: string
  storageKey: string
  filename: string
  effectiveDate?: Date | null
  expirationDate?: Date | null
  actor: PortalSession
}

export async function finalizeDocumentUpload(input: FinalizeInput): Promise<UploadResult> {
  const [requirement] = await db
    .select()
    .from(documentRequirements)
    .where(eq(documentRequirements.id, input.requirementId))
    .limit(1)
  if (!requirement || !requirement.isActive) {
    return { ok: false, error: 'That document requirement is not available.' }
  }

  // The key must be one we generated for this company. Without this a caller
  // could finalize against another company's object key.
  if (!input.storageKey.startsWith(`companies/${input.companyId}/`)) {
    await recordAudit({
      action: AUDIT.DOCUMENT_UPLOAD_REJECTED,
      summary: 'Rejected an upload whose storage key did not belong to the company',
      companyId: input.companyId,
      actor: input.actor,
    })
    return { ok: false, error: 'That upload could not be verified. Please try again.' }
  }

  if (requirement.hasExpiration && !input.expirationDate) {
    return { ok: false, error: 'An expiration date is required for this document.' }
  }
  if (input.expirationDate && Number.isNaN(input.expirationDate.getTime())) {
    return { ok: false, error: 'That expiration date is not valid.' }
  }

  const verified = await verifyUploadedObject(input.storageKey)
  if (!verified.ok) {
    await deleteObject(input.storageKey).catch(() => undefined)
    await recordAudit({
      action: AUDIT.DOCUMENT_UPLOAD_REJECTED,
      summary: `Upload rejected for ${requirement.name}: ${verified.reason}`,
      companyId: input.companyId,
      actor: input.actor,
      metadata: { requirement: requirement.code, filename: sanitiseFilename(input.filename) },
    })
    return { ok: false, error: verified.reason }
  }

  const key = input.storageKey
  const validation = { mimeType: verified.mimeType, size: verified.size, checksum: null }

  try {
    const result = await db.transaction(async (tx) => {
      const [previous] = await tx
        .select()
        .from(documents)
        .where(
          and(
            eq(documents.companyId, input.companyId),
            eq(documents.requirementId, input.requirementId),
            ne(documents.state, 'SUPERSEDED'),
          ),
        )
        .orderBy(desc(documents.version))
        .limit(1)

      const [created] = await tx
        .insert(documents)
        .values({
          companyId: input.companyId,
          requirementId: input.requirementId,
          state: requirement.requiresReview ? 'SUBMITTED' : 'APPROVED',
          version: (previous?.version ?? 0) + 1,
          originalFilename: sanitiseFilename(input.filename),
          storageKey: key,
          mimeType: validation.mimeType,
          fileSize: validation.size,
          checksumSha256: validation.checksum,
          effectiveDate: input.effectiveDate ?? null,
          expirationDate: input.expirationDate ?? null,
          submittedById: input.actor.userId,
          reviewedAt: requirement.requiresReview ? null : new Date(),
        })
        .returning({ id: documents.id })

      if (previous) {
        await tx
          .update(documents)
          .set({ state: 'SUPERSEDED', supersededByDocumentId: created.id })
          .where(eq(documents.id, previous.id))
      }

      return { documentId: created.id, supersededId: previous?.id ?? null }
    })

    await recordAudit({
      action: AUDIT.DOCUMENT_UPLOADED,
      summary: `Uploaded ${requirement.name}${result.supersededId ? ' (replacing a previous version)' : ''}`,
      companyId: input.companyId,
      actor: input.actor,
      targetType: 'document',
      targetId: result.documentId,
      metadata: {
        requirement: requirement.code,
        filename: sanitiseFilename(input.filename),
        sizeBytes: validation.size,
        mimeType: validation.mimeType,
      },
    })

    if (result.supersededId) {
      await recordAudit({
        action: AUDIT.DOCUMENT_SUPERSEDED,
        summary: `Previous ${requirement.name} superseded by a new upload`,
        companyId: input.companyId,
        actor: input.actor,
        targetType: 'document',
        targetId: result.supersededId,
      })
    }

    return { ok: true, ...result }
  } catch (error) {
    console.error('[portal:documents] database write failed after upload', error)
    return { ok: false, error: 'The upload could not be recorded. Please try again.' }
  }
}

// ---------------------------------------------------------------------------
// Review
// ---------------------------------------------------------------------------

export type ReviewInput = {
  documentId: string
  decision: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW' | 'NOT_APPLICABLE'
  reason?: string
  notes?: string
  actor: PortalSession
}

export async function reviewDocument(
  input: ReviewInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (input.actor.role !== 'ADMIN') {
    return { ok: false, error: 'Only an administrator can review documents.' }
  }
  if (input.decision === 'REJECTED' && !input.reason?.trim()) {
    return { ok: false, error: 'A reason is required when rejecting a document.' }
  }
  if (input.decision === 'NOT_APPLICABLE' && !input.reason?.trim()) {
    return { ok: false, error: 'A reason is required when marking an item not applicable.' }
  }

  const [row] = await db
    .select({ document: documents, requirement: documentRequirements, company: companies })
    .from(documents)
    .innerJoin(documentRequirements, eq(documentRequirements.id, documents.requirementId))
    .innerJoin(companies, eq(companies.id, documents.companyId))
    .where(eq(documents.id, input.documentId))
    .limit(1)

  if (!row) return { ok: false, error: 'Document not found.' }
  if (row.document.state === 'SUPERSEDED') {
    return { ok: false, error: 'That version has been replaced by a newer upload.' }
  }

  const now = new Date()

  await db.transaction(async (tx) => {
    await tx
      .update(documents)
      .set({
        state: input.decision,
        reviewedById: input.actor.userId,
        reviewedAt: now,
        rejectionReason: input.decision === 'REJECTED' ? (input.reason?.trim() ?? null) : null,
        notApplicableReason:
          input.decision === 'NOT_APPLICABLE' ? (input.reason?.trim() ?? null) : null,
        notApplicableById: input.decision === 'NOT_APPLICABLE' ? input.actor.userId : null,
        adminNotes: input.notes?.trim() || row.document.adminNotes,
        updatedAt: now,
      })
      .where(eq(documents.id, input.documentId))

    await tx.insert(documentReviews).values({
      documentId: input.documentId,
      reviewerId: input.actor.userId,
      decision: input.decision,
      reason: input.reason?.trim() || null,
      notes: input.notes?.trim() || null,
    })
  })

  const actionByDecision = {
    APPROVED: AUDIT.DOCUMENT_APPROVED,
    REJECTED: AUDIT.DOCUMENT_REJECTED,
    NOT_APPLICABLE: AUDIT.DOCUMENT_MARKED_NOT_APPLICABLE,
    UNDER_REVIEW: AUDIT.DOCUMENT_APPROVED,
  } as const

  await recordAudit({
    action: actionByDecision[input.decision],
    summary: `${row.requirement.name}: ${input.decision.replace(/_/g, ' ').toLowerCase()}`,
    companyId: row.document.companyId,
    actor: input.actor,
    targetType: 'document',
    targetId: input.documentId,
    metadata: { requirement: row.requirement.code, reason: input.reason ?? null },
  })

  if (input.decision === 'APPROVED' || input.decision === 'REJECTED') {
    await notifyCompanyUsers({
      companyId: row.document.companyId,
      companyName: row.company.legalName,
      documentId: input.documentId,
      documentName: row.requirement.name,
      type:
        input.decision === 'APPROVED'
          ? NOTIFICATION_TYPES.DOCUMENT_APPROVED
          : NOTIFICATION_TYPES.DOCUMENT_REJECTED,
      reason: input.reason,
      dedupeSuffix: `${input.documentId}:${input.decision}:${now.getTime()}`,
    })
  }

  return { ok: true }
}

async function notifyCompanyUsers(args: {
  companyId: string
  companyName: string
  documentId?: string
  documentName?: string
  type: (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]
  reason?: string
  dedupeSuffix: string
}): Promise<void> {
  const recipients = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(and(eq(users.companyId, args.companyId), eq(users.isActive, true)))

  for (const recipient of recipients) {
    await sendPortalEmail({
      type: args.type,
      to: recipient.email,
      userId: recipient.id,
      companyId: args.companyId,
      documentId: args.documentId ?? null,
      dedupeKey: `${args.type}:${recipient.id}:${args.dedupeSuffix}`,
      data: {
        companyName: args.companyName,
        documentName: args.documentName,
        reason: args.reason,
        portalUrl: `${serverEnv.appUrl}/trade-partners/documents`,
      },
    })
  }
}

// ---------------------------------------------------------------------------
// Acknowledgments
// ---------------------------------------------------------------------------

export async function recordAcknowledgment(args: {
  companyId: string
  requirementId: string
  signerName: string
  signerTitle?: string
  actor: PortalSession
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const [requirement] = await db
    .select()
    .from(documentRequirements)
    .where(eq(documentRequirements.id, args.requirementId))
    .limit(1)
  if (!requirement?.isAcknowledgment) {
    return { ok: false, error: 'That item does not accept an acknowledgment.' }
  }
  if (!args.signerName.trim()) {
    return { ok: false, error: 'Please type your full name to acknowledge.' }
  }

  const { ipAddress, userAgent } = requestContext()

  await db
    .insert(acknowledgments)
    .values({
      companyId: args.companyId,
      requirementId: args.requirementId,
      templateVersion: requirement.templateVersion ?? 'draft',
      signerName: args.signerName.trim(),
      signerTitle: args.signerTitle?.trim() || null,
      acknowledgedById: args.actor.userId,
      ipAddress,
      userAgent: userAgent?.slice(0, 500) ?? null,
    })
    .onConflictDoNothing()

  await recordAudit({
    action: AUDIT.ACKNOWLEDGMENT_RECORDED,
    summary: `${requirement.name} acknowledged by ${args.signerName.trim()}`,
    companyId: args.companyId,
    actor: args.actor,
    targetType: 'requirement',
    targetId: args.requirementId,
    metadata: { version: requirement.templateVersion ?? 'draft' },
  })

  return { ok: true }
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export type DocumentWithRequirement = { document: PortalDocument; requirement: DocumentRequirement }

export async function getCompanyDocuments(companyId: string): Promise<DocumentWithRequirement[]> {
  const rows = await db
    .select({ document: documents, requirement: documentRequirements })
    .from(documents)
    .innerJoin(documentRequirements, eq(documentRequirements.id, documents.requirementId))
    .where(eq(documents.companyId, companyId))
    .orderBy(documentRequirements.sortOrder, desc(documents.version))
  return rows
}

/** Full version history for one requirement, newest first. */
export async function getDocumentHistory(
  companyId: string,
  requirementId: string,
): Promise<PortalDocument[]> {
  return db
    .select()
    .from(documents)
    .where(and(eq(documents.companyId, companyId), eq(documents.requirementId, requirementId)))
    .orderBy(desc(documents.version))
}

export async function getDocumentForAccess(documentId: string): Promise<
  { document: PortalDocument; requirement: DocumentRequirement } | null
> {
  const [row] = await db
    .select({ document: documents, requirement: documentRequirements })
    .from(documents)
    .innerJoin(documentRequirements, eq(documentRequirements.id, documents.requirementId))
    .where(eq(documents.id, documentId))
    .limit(1)
  return row ?? null
}

export async function getActiveRequirements(): Promise<DocumentRequirement[]> {
  return db
    .select()
    .from(documentRequirements)
    .where(eq(documentRequirements.isActive, true))
    .orderBy(documentRequirements.sortOrder)
}

// ---------------------------------------------------------------------------
// Internal notes (administrator only, append-only)
// ---------------------------------------------------------------------------

export async function addInternalNote(args: {
  companyId: string
  documentId?: string | null
  body: string
  actor: PortalSession
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (args.actor.role !== 'ADMIN') {
    return { ok: false, error: 'Only an administrator can add internal notes.' }
  }
  if (!args.body.trim()) return { ok: false, error: 'The note is empty.' }

  await db.insert(internalNotes).values({
    companyId: args.companyId,
    documentId: args.documentId ?? null,
    authorId: args.actor.userId,
    body: args.body.trim(),
  })

  await recordAudit({
    action: AUDIT.INTERNAL_NOTE_ADDED,
    summary: 'Internal note added',
    companyId: args.companyId,
    actor: args.actor,
    targetType: args.documentId ? 'document' : 'company',
    targetId: args.documentId ?? args.companyId,
  })

  return { ok: true }
}

/**
 * Internal notes are administrator-only. This function takes the session so the
 * check cannot be forgotten at a call site — there is no unguarded read path.
 */
export async function getInternalNotes(companyId: string, actor: PortalSession) {
  if (actor.role !== 'ADMIN') return []
  return db
    .select({
      note: internalNotes,
      authorName: users.name,
      requirementName: documentRequirements.name,
    })
    .from(internalNotes)
    .innerJoin(users, eq(users.id, internalNotes.authorId))
    .leftJoin(documents, eq(documents.id, internalNotes.documentId))
    .leftJoin(documentRequirements, eq(documentRequirements.id, documents.requirementId))
    .where(eq(internalNotes.companyId, companyId))
    .orderBy(desc(internalNotes.createdAt))
}

export async function getRequirementsByCodes(codes: string[]): Promise<DocumentRequirement[]> {
  if (codes.length === 0) return []
  return db.select().from(documentRequirements).where(inArray(documentRequirements.code, codes))
}
