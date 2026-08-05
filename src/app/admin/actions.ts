'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/portal/db'
import { applications, companies, licenses, projectReferences } from '@/lib/portal/db/schema'
import { requireAdmin } from '@/lib/portal/auth/guards'
import { AUDIT, recordAudit } from '@/lib/portal/audit'
import { LIMITS, rateLimit } from '@/lib/portal/rate-limit'
import { changeCompanyStatus } from '@/lib/portal/services/status'
import {
  createInvitation,
  resendInvitation,
  revokeInvitation,
} from '@/lib/portal/services/invitations'
import { addInternalNote, reviewDocument } from '@/lib/portal/services/documents'
import { sendPortalEmail } from '@/lib/portal/email/mailer'
import { NOTIFICATION_TYPES } from '@/lib/portal/email/templates'
import { serverEnv } from '@/lib/portal/env'
import { applicationReviewSchema, createInvitationSchema, documentReviewSchema, formText, formValue, internalNoteSchema, licenseVerificationSchema, referenceContactSchema, statusChangeSchema, toFieldErrors, type ActionState } from '@/lib/portal/validation'

/**
 * Administrator actions.
 *
 * Every one begins with `requireAdmin()`. That call is the authorization — it is
 * not inferred from the fact that the form was rendered on an admin page, since
 * a Server Action is a public HTTP endpoint that anyone can invoke directly.
 */

function revalidateCompany(companyId: string) {
  revalidatePath('/admin/trade-partners')
  revalidatePath('/admin/trade-partners/compliance')
  revalidatePath(`/admin/trade-partners/${companyId}`)
}

// ---------------------------------------------------------------------------
// Invitations
// ---------------------------------------------------------------------------

export async function createInvitationAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin()

  const limit = rateLimit(`invite:${session.userId}`, LIMITS.invite.limit, LIMITS.invite.windowSeconds)
  if (!limit.allowed) {
    return { ok: false, message: 'Too many invitations sent in a short time. Please wait a while.' }
  }

  const parsed = createInvitationSchema.safeParse({
    companyName: formValue(formData, 'companyName'),
    contactName: formValue(formData, 'contactName'),
    contactEmail: formValue(formData, 'contactEmail'),
    contactPhone: formValue(formData, 'contactPhone'),
    primaryTrade: formValue(formData, 'primaryTrade'),
    message: formValue(formData, 'message'),
  })
  if (!parsed.success) {
    return { ok: false, errors: toFieldErrors(parsed.error), message: 'Please check the highlighted fields.' }
  }

  const result = await createInvitation({ ...parsed.data, actor: session })
  if (!result.ok) return { ok: false, message: result.error }

  revalidatePath('/admin/trade-partners')
  redirect(`/admin/trade-partners/${result.companyId}?invited=1`)
}

export async function resendInvitationAction(formData: FormData): Promise<void> {
  const session = await requireAdmin()
  const invitationId = String(formText(formData, 'invitationId'))
  const companyId = String(formText(formData, 'companyId'))
  if (!invitationId) return
  await resendInvitation(invitationId, session)
  revalidateCompany(companyId)
}

export async function revokeInvitationAction(formData: FormData): Promise<void> {
  const session = await requireAdmin()
  const invitationId = String(formText(formData, 'invitationId'))
  const companyId = String(formText(formData, 'companyId'))
  if (!invitationId) return
  await revokeInvitation(invitationId, session)
  revalidateCompany(companyId)
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export async function reviewDocumentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin()

  const parsed = documentReviewSchema.safeParse({
    documentId: formValue(formData, 'documentId'),
    decision: formValue(formData, 'decision'),
    reason: formValue(formData, 'reason'),
    notes: formValue(formData, 'notes'),
  })
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) }

  const result = await reviewDocument({ ...parsed.data, actor: session })
  if (!result.ok) return { ok: false, message: result.error }

  const companyId = String(formText(formData, 'companyId'))
  revalidateCompany(companyId)
  return { ok: true, message: 'Review recorded.' }
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

export async function changeStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin()

  const parsed = statusChangeSchema.safeParse({
    companyId: formValue(formData, 'companyId'),
    status: formValue(formData, 'status'),
    reason: formValue(formData, 'reason'),
  })
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) }

  const result = await changeCompanyStatus({
    companyId: parsed.data.companyId,
    to: parsed.data.status,
    reason: parsed.data.reason,
    actor: session,
  })

  if (!result.ok) return { ok: false, message: result.error }

  revalidateCompany(parsed.data.companyId)
  return { ok: true, message: 'Status updated.' }
}

// ---------------------------------------------------------------------------
// Application review
// ---------------------------------------------------------------------------

export async function reviewApplicationAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin()

  const parsed = applicationReviewSchema.safeParse({
    companyId: formValue(formData, 'companyId'),
    decision: formValue(formData, 'decision'),
    reason: formValue(formData, 'reason'),
  })
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) }

  const { companyId, decision, reason } = parsed.data

  if (decision === 'RETURN' && !reason) {
    return { ok: false, errors: { reason: 'Tell the trade partner what needs correcting.' } }
  }

  const [company] = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1)
  if (!company) return { ok: false, message: 'Company not found.' }

  const now = new Date()

  if (decision === 'APPROVE') {
    await db
      .update(applications)
      .set({ status: 'APPROVED', reviewedAt: now, reviewedById: session.userId, returnReason: null })
      .where(eq(applications.companyId, companyId))

    await recordAudit({
      action: AUDIT.APPLICATION_APPROVED,
      summary: 'Application approved',
      companyId,
      actor: session,
    })
  } else {
    await db
      .update(applications)
      .set({
        status: 'RETURNED_FOR_CORRECTION',
        returnedAt: now,
        returnReason: reason ?? null,
        reviewedById: session.userId,
      })
      .where(eq(applications.companyId, companyId))

    await recordAudit({
      action: AUDIT.APPLICATION_RETURNED,
      summary: 'Application returned for correction',
      companyId,
      actor: session,
      metadata: { reason },
    })

    await sendPortalEmail({
      type: NOTIFICATION_TYPES.APPLICATION_RETURNED,
      to: company.generalEmail ?? serverEnv.adminNotifyEmail,
      companyId,
      dedupeKey: `app-returned:${companyId}:${now.getTime()}`,
      data: {
        companyName: company.legalName,
        reason,
        portalUrl: `${serverEnv.appUrl}/trade-partners/company`,
      },
    })
  }

  revalidateCompany(companyId)
  return { ok: true, message: decision === 'APPROVE' ? 'Application approved.' : 'Application returned.' }
}

// ---------------------------------------------------------------------------
// Licence verification
// ---------------------------------------------------------------------------

export async function verifyLicenseAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin()

  const parsed = licenseVerificationSchema.safeParse({
    licenseId: formValue(formData, 'licenseId'),
    verificationStatus: formValue(formData, 'verificationStatus'),
    verificationNotes: formValue(formData, 'verificationNotes'),
    verificationSource: formValue(formData, 'verificationSource'),
  })
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) }

  const [license] = await db
    .select()
    .from(licenses)
    .where(eq(licenses.id, parsed.data.licenseId))
    .limit(1)
  if (!license) return { ok: false, message: 'Licence record not found.' }

  await db
    .update(licenses)
    .set({
      verificationStatus: parsed.data.verificationStatus,
      verifiedById: session.userId,
      verifiedAt: new Date(),
      verificationNotes: parsed.data.verificationNotes ?? null,
      verificationSource: parsed.data.verificationSource ?? null,
    })
    .where(eq(licenses.id, parsed.data.licenseId))

  await recordAudit({
    action:
      parsed.data.verificationStatus === 'VERIFIED'
        ? AUDIT.LICENSE_VERIFIED
        : AUDIT.LICENSE_VERIFICATION_REJECTED,
    summary: `Licence ${license.licenseNumber} marked ${parsed.data.verificationStatus.toLowerCase().replace('_', ' ')}`,
    companyId: license.companyId,
    actor: session,
    targetType: 'license',
    targetId: license.id,
    metadata: { source: parsed.data.verificationSource ?? null },
  })

  revalidateCompany(license.companyId)
  return { ok: true, message: 'Licence verification recorded.' }
}

// ---------------------------------------------------------------------------
// Internal notes and reference checks
// ---------------------------------------------------------------------------

export async function addNoteAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin()

  const parsed = internalNoteSchema.safeParse({
    companyId: formValue(formData, 'companyId'),
    documentId: formValue(formData, 'documentId'),
    body: formValue(formData, 'body'),
  })
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) }

  const result = await addInternalNote({
    companyId: parsed.data.companyId,
    documentId: parsed.data.documentId ?? null,
    body: parsed.data.body,
    actor: session,
  })
  if (!result.ok) return { ok: false, message: result.error }

  revalidateCompany(parsed.data.companyId)
  return { ok: true, message: 'Note added.' }
}

export async function recordReferenceContactAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin()

  const parsed = referenceContactSchema.safeParse({
    projectId: formValue(formData, 'projectId'),
    contactNotes: formValue(formData, 'contactNotes'),
  })
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) }

  const [project] = await db
    .select()
    .from(projectReferences)
    .where(eq(projectReferences.id, parsed.data.projectId))
    .limit(1)
  if (!project) return { ok: false, message: 'Reference not found.' }

  await db
    .update(projectReferences)
    .set({
      contactedById: session.userId,
      contactedAt: new Date(),
      contactNotes: parsed.data.contactNotes,
    })
    .where(eq(projectReferences.id, parsed.data.projectId))

  await recordAudit({
    action: AUDIT.INTERNAL_NOTE_ADDED,
    summary: `Reference check recorded for ${project.referenceName}`,
    companyId: project.companyId,
    actor: session,
    targetType: 'project_reference',
    targetId: project.id,
  })

  revalidateCompany(project.companyId)
  return { ok: true, message: 'Reference check recorded.' }
}
