/**
 * The nightly compliance sweep.
 *
 * What it does, in order:
 *   1. Marks approved documents whose expiration date has passed as EXPIRED.
 *   2. Sends reminders at 30, 14, 7 and 0 days before expiry.
 *   3. Demotes any company holding work clearance that now has an expired
 *      mandatory document to INACTIVE_EXPIRED_DOCUMENTS.
 *   4. Expires stale invitations and purges dead sessions.
 *
 * Duplicate suppression is structural, not incidental: every message carries a
 * dedupe key of `type:documentId:threshold`, and `tp_notification.dedupe_key`
 * has a unique index. Re-running the sweep — by accident, by retry, or by a
 * manual trigger — sends nothing twice.
 *
 * Idempotent by design, so it is safe to run more often than once a day.
 */

import 'server-only'
import { and, eq, inArray, isNotNull, isNull, lte, ne } from 'drizzle-orm'
import { db } from '../db'
import { companies, documentRequirements, documents, users } from '../db/schema'
import { EXPIRATION_REMINDER_DAYS } from '../constants'
import { daysBetween } from '../compliance'
import { AUDIT, recordAudit } from '../audit'
import { sendPortalEmail } from '../email/mailer'
import { NOTIFICATION_TYPES } from '../email/templates'
import { serverEnv } from '../env'
import { applySystemStatusChange } from './status'
import { getComplianceForCompanies } from './compliance-service'
import { expireStaleInvitations } from './invitations'
import { purgeDeadSessions } from '../auth/session'

export type SweepResult = {
  ranAt: string
  documentsExpired: number
  remindersSent: number
  remindersSkipped: number
  companiesDemoted: number
  invitationsExpired: number
  sessionsPurged: number
  errors: string[]
}

export async function runComplianceSweep(now = new Date()): Promise<SweepResult> {
  const result: SweepResult = {
    ranAt: now.toISOString(),
    documentsExpired: 0,
    remindersSent: 0,
    remindersSkipped: 0,
    companiesDemoted: 0,
    invitationsExpired: 0,
    sessionsPurged: 0,
    errors: [],
  }

  // --- 1. Flip past-due approved documents to EXPIRED ----------------------
  try {
    const nowMidnight = new Date(now)
    nowMidnight.setHours(0, 0, 0, 0)

    const pastDue = await db
      .select({ document: documents, requirement: documentRequirements, company: companies })
      .from(documents)
      .innerJoin(documentRequirements, eq(documentRequirements.id, documents.requirementId))
      .innerJoin(companies, eq(companies.id, documents.companyId))
      .where(
        and(
          eq(documents.state, 'APPROVED'),
          isNotNull(documents.expirationDate),
          lte(documents.expirationDate, nowMidnight),
          eq(documentRequirements.hasExpiration, true),
        ),
      )

    for (const row of pastDue) {
      // A document expires at the end of its date, so only act once the date is
      // genuinely in the past.
      if (daysBetween(now, row.document.expirationDate!) >= 0) continue

      await db.update(documents).set({ state: 'EXPIRED' }).where(eq(documents.id, row.document.id))
      result.documentsExpired += 1

      await recordAudit({
        action: AUDIT.DOCUMENT_EXPIRED,
        summary: `${row.requirement.name} expired on ${row.document.expirationDate!.toDateString()}`,
        companyId: row.document.companyId,
        targetType: 'document',
        targetId: row.document.id,
        actorLabel: 'System — expiration sweep',
      })

      const sent = await notifyDocument({
        companyId: row.document.companyId,
        companyName: row.company.legalName,
        documentId: row.document.id,
        documentName: row.requirement.name,
        type: NOTIFICATION_TYPES.DOCUMENT_EXPIRED,
        threshold: 'expired',
        expiresOn: row.document.expirationDate!,
        daysUntil: 0,
      })
      result.remindersSent += sent.sent
      result.remindersSkipped += sent.skipped
    }
  } catch (error) {
    result.errors.push(`expire-documents: ${error instanceof Error ? error.message : 'unknown'}`)
  }

  // --- 2. Advance-warning reminders ----------------------------------------
  try {
    const upcoming = await db
      .select({ document: documents, requirement: documentRequirements, company: companies })
      .from(documents)
      .innerJoin(documentRequirements, eq(documentRequirements.id, documents.requirementId))
      .innerJoin(companies, eq(companies.id, documents.companyId))
      .where(
        and(
          eq(documents.state, 'APPROVED'),
          isNotNull(documents.expirationDate),
          isNull(companies.archivedAt),
          ne(companies.status, 'DO_NOT_USE'),
        ),
      )

    for (const row of upcoming) {
      const days = daysBetween(now, row.document.expirationDate!)
      // Fire on the exact threshold day. The dedupe key covers a missed day —
      // but a missed day is not silently swallowed, because the next lower
      // threshold still fires.
      const threshold = EXPIRATION_REMINDER_DAYS.find((d) => d === days)
      if (threshold === undefined) continue

      const sent = await notifyDocument({
        companyId: row.document.companyId,
        companyName: row.company.legalName,
        documentId: row.document.id,
        documentName: row.requirement.name,
        type: NOTIFICATION_TYPES.EXPIRATION_WARNING,
        threshold: String(threshold),
        expiresOn: row.document.expirationDate!,
        daysUntil: days,
      })
      result.remindersSent += sent.sent
      result.remindersSkipped += sent.skipped
    }
  } catch (error) {
    result.errors.push(`expiry-reminders: ${error instanceof Error ? error.message : 'unknown'}`)
  }

  // --- 3. Demote companies that lost work clearance -------------------------
  try {
    const clearanceStatuses = ['APPROVED_TO_WORK', 'PREFERRED', 'PROBATIONARY'] as const
    const candidates = await db
      .select()
      .from(companies)
      .where(and(inArray(companies.status, [...clearanceStatuses]), isNull(companies.archivedAt)))

    if (candidates.length > 0) {
      const compliance = await getComplianceForCompanies(candidates, now)
      for (const company of candidates) {
        const evaluation = compliance.get(company.id)
        if (!evaluation?.canSystemApply || evaluation.recommendedStatus !== 'INACTIVE_EXPIRED_DOCUMENTS') {
          continue
        }

        const expiredNames = evaluation.items
          .filter((i) => i.state === 'EXPIRED')
          .map((i) => i.name)

        const changed = await applySystemStatusChange({
          companyId: company.id,
          to: 'INACTIVE_EXPIRED_DOCUMENTS',
          reason: `Automatic: expired mandatory ${expiredNames.length === 1 ? 'document' : 'documents'} (${expiredNames.join(', ')}).`,
        })
        if (!changed.ok) continue
        result.companiesDemoted += 1

        await sendPortalEmail({
          type: NOTIFICATION_TYPES.ADMIN_ACTION_REQUIRED,
          to: serverEnv.adminNotifyEmail,
          companyId: company.id,
          dedupeKey: `admin-demoted:${company.id}:${now.toISOString().slice(0, 10)}`,
          data: {
            companyName: company.legalName,
            portalUrl: `${serverEnv.appUrl}/admin/trade-partners/${company.id}`,
            items: [
              'Work clearance was removed automatically because a mandatory document expired.',
              ...expiredNames.map((n) => `Expired: ${n}`),
            ],
          },
        })
      }
    }
  } catch (error) {
    result.errors.push(`demote-companies: ${error instanceof Error ? error.message : 'unknown'}`)
  }

  // --- 4. Housekeeping ------------------------------------------------------
  try {
    result.invitationsExpired = await expireStaleInvitations(now)
  } catch (error) {
    result.errors.push(`expire-invitations: ${error instanceof Error ? error.message : 'unknown'}`)
  }
  try {
    result.sessionsPurged = await purgeDeadSessions()
  } catch (error) {
    result.errors.push(`purge-sessions: ${error instanceof Error ? error.message : 'unknown'}`)
  }

  return result
}

async function notifyDocument(args: {
  companyId: string
  companyName: string
  documentId: string
  documentName: string
  type: (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]
  /** Part of the dedupe key: '30', '14', '7', '0' or 'expired'. */
  threshold: string
  expiresOn: Date
  daysUntil: number
}): Promise<{ sent: number; skipped: number }> {
  const recipients = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(and(eq(users.companyId, args.companyId), eq(users.isActive, true)))

  const expiresOn = args.expiresOn.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  let sent = 0
  let skipped = 0

  for (const recipient of recipients) {
    const outcome = await sendPortalEmail({
      type: args.type,
      to: recipient.email,
      userId: recipient.id,
      companyId: args.companyId,
      documentId: args.documentId,
      // The unique index on this column is what makes the sweep re-runnable.
      dedupeKey: `${args.type}:${args.documentId}:${args.threshold}:${recipient.id}`,
      data: {
        companyName: args.companyName,
        documentName: args.documentName,
        expiresOn,
        daysUntil: args.daysUntil,
        portalUrl: `${serverEnv.appUrl}/trade-partners/documents`,
      },
    })
    if (outcome.status === 'SENT') sent += 1
    else skipped += 1
  }

  // Administrators are told once per document per threshold, regardless of how
  // many contacts the company has.
  const adminOutcome = await sendPortalEmail({
    type: NOTIFICATION_TYPES.ADMIN_ACTION_REQUIRED,
    to: serverEnv.adminNotifyEmail,
    companyId: args.companyId,
    documentId: args.documentId,
    dedupeKey: `admin:${args.type}:${args.documentId}:${args.threshold}`,
    data: {
      companyName: args.companyName,
      portalUrl: `${serverEnv.appUrl}/admin/trade-partners/${args.companyId}?tab=compliance`,
      items: [
        args.type === NOTIFICATION_TYPES.DOCUMENT_EXPIRED
          ? `${args.documentName} expired on ${expiresOn}.`
          : `${args.documentName} expires in ${args.daysUntil} day${args.daysUntil === 1 ? '' : 's'} (${expiresOn}).`,
      ],
    },
  })
  if (adminOutcome.status === 'SENT') sent += 1
  else skipped += 1

  return { sent, skipped }
}
