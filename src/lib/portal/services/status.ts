/**
 * Company status transitions.
 *
 * This is the only place `tp_company.status` is written. Every path through it
 * records history and an audit event, and the privileged transitions are gated
 * so a trade partner can never reach them:
 *
 *   - APPROVED_TO_WORK, PREFERRED, SUSPENDED, DO_NOT_USE require an
 *     administrator actor. `applySystemStatusChange` cannot set them.
 *   - SUSPENDED and DO_NOT_USE are terminal for automation: nothing but an
 *     explicit administrator action moves a company out of them.
 *   - APPROVED_TO_WORK is refused outright when the compliance engine says the
 *     company is not work-eligible, so an administrator cannot approve a company
 *     with expired insurance even by accident.
 */

import 'server-only'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { companies, statusHistory, users, type CompanyStatusValue } from '../db/schema'
import { ADMIN_ONLY_STATUSES, COMPANY_STATUS_META, LOCKED_STATUSES, STATUSES_REQUIRING_REASON } from '../constants'
import { AUDIT, recordAudit } from '../audit'
import type { PortalSession } from '../auth/session'
import { revokeAllSessionsForUser } from '../auth/session'
import { getCompanyCompliance } from './compliance-service'
import { sendPortalEmail } from '../email/mailer'
import { NOTIFICATION_TYPES } from '../email/templates'
import { serverEnv } from '../env'

export type StatusChangeResult =
  | { ok: true; from: CompanyStatusValue; to: CompanyStatusValue }
  | { ok: false; error: string }

export type StatusChangeInput = {
  companyId: string
  to: CompanyStatusValue
  reason?: string
  actor: PortalSession
  /** Set when the caller has already verified compliance, to avoid a re-query. */
  skipComplianceCheck?: boolean
}

/**
 * Administrator-initiated status change. Returns a friendly error rather than
 * throwing, so the calling Server Action can re-render the form with it.
 */
export async function changeCompanyStatus(input: StatusChangeInput): Promise<StatusChangeResult> {
  const { companyId, to, actor } = input

  if (actor.role !== 'ADMIN') {
    await recordAudit({
      action: AUDIT.STATUS_CHANGE_BLOCKED,
      summary: `Non-administrator attempted to set status to ${to}`,
      companyId,
      actor,
    })
    return { ok: false, error: 'Only an administrator can change a company status.' }
  }

  const [company] = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1)
  if (!company) return { ok: false, error: 'Company not found.' }

  const from = company.status
  if (from === to) return { ok: false, error: 'The company already has that status.' }

  if (STATUSES_REQUIRING_REASON.includes(to) && !input.reason?.trim()) {
    return { ok: false, error: `A written reason is required to set status to ${COMPANY_STATUS_META[to].label}.` }
  }

  // Guard the one transition that must never be possible by accident.
  if ((to === 'APPROVED_TO_WORK' || to === 'PREFERRED') && !input.skipComplianceCheck) {
    const compliance = await getCompanyCompliance(companyId)
    if (!compliance?.result.workEligible) {
      const blockers = compliance?.result.workBlockers.map((b) => b.label).join('; ') ?? 'unknown'
      await recordAudit({
        action: AUDIT.STATUS_CHANGE_BLOCKED,
        summary: `Blocked ${COMPANY_STATUS_META[to].label}: outstanding compliance items`,
        companyId,
        actor,
        metadata: { blockers },
      })
      return {
        ok: false,
        error: `This company is not work-eligible yet. Outstanding: ${blockers}.`,
      }
    }
  }

  await writeStatus({ companyId, from, to, reason: input.reason, actor, system: false })

  // Suspension and Do Not Use immediately terminate active sessions.
  if (LOCKED_STATUSES.includes(to)) {
    const companyUsers = await db.select({ id: users.id }).from(users).where(eq(users.companyId, companyId))
    await Promise.all(companyUsers.map((u) => revokeAllSessionsForUser(u.id)))
  }

  await notifyStatusChange(companyId, company.legalName, from, to, input.reason)

  return { ok: true, from, to }
}

/**
 * The one status change automation may perform: demoting a company whose
 * mandatory documents have expired. It refuses anything else by construction.
 */
export async function applySystemStatusChange(args: {
  companyId: string
  to: CompanyStatusValue
  reason: string
}): Promise<StatusChangeResult> {
  const { companyId, to, reason } = args

  if (ADMIN_ONLY_STATUSES.includes(to)) {
    return { ok: false, error: 'That status requires an administrator.' }
  }

  const [company] = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1)
  if (!company) return { ok: false, error: 'Company not found.' }

  if (LOCKED_STATUSES.includes(company.status)) {
    return { ok: false, error: 'Suspended and Do Not Use companies are not changed automatically.' }
  }
  if (company.status === to) return { ok: false, error: 'No change required.' }

  await writeStatus({ companyId, from: company.status, to, reason, actor: null, system: true })
  return { ok: true, from: company.status, to }
}

async function writeStatus(args: {
  companyId: string
  from: CompanyStatusValue
  to: CompanyStatusValue
  reason?: string
  actor: PortalSession | null
  system: boolean
}): Promise<void> {
  const { companyId, from, to, reason, actor, system } = args

  await db.transaction(async (tx) => {
    await tx.update(companies).set({ status: to, updatedAt: new Date() }).where(eq(companies.id, companyId))
    await tx.insert(statusHistory).values({
      companyId,
      fromStatus: from,
      toStatus: to,
      reason: reason ?? null,
      changedById: actor?.userId ?? null,
      isSystemGenerated: system,
    })
  })

  await recordAudit({
    action: AUDIT.STATUS_CHANGED,
    summary: `Status changed from ${COMPANY_STATUS_META[from].label} to ${COMPANY_STATUS_META[to].label}${system ? ' (automatic)' : ''}`,
    companyId,
    actor,
    actorLabel: system ? 'System — expiration sweep' : undefined,
    targetType: 'company',
    targetId: companyId,
    metadata: { from, to, reason: reason ?? null },
  })
}

async function notifyStatusChange(
  companyId: string,
  companyName: string,
  from: CompanyStatusValue,
  to: CompanyStatusValue,
  reason?: string,
): Promise<void> {
  const recipients = await db
    .select({ email: users.email, id: users.id })
    .from(users)
    .where(eq(users.companyId, companyId))
  if (recipients.length === 0) return

  const portalUrl = `${serverEnv.appUrl}/trade-partners/dashboard`
  const compliance = to === 'APPROVED_TO_WORK' ? await getCompanyCompliance(companyId) : null
  const expiresOn = compliance?.result.earliestExpiration?.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  let type: (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES] | null = null
  if (to === 'APPROVED_TO_BID') type = NOTIFICATION_TYPES.APPROVED_TO_BID
  else if (to === 'APPROVED_TO_WORK') type = NOTIFICATION_TYPES.APPROVED_TO_WORK
  else if (to === 'SUSPENDED' || to === 'DO_NOT_USE') type = NOTIFICATION_TYPES.SUSPENDED
  else if (LOCKED_STATUSES.includes(from) && !LOCKED_STATUSES.includes(to)) {
    type = NOTIFICATION_TYPES.REACTIVATED
  }
  if (!type) return

  for (const recipient of recipients) {
    await sendPortalEmail({
      type,
      to: recipient.email,
      userId: recipient.id,
      companyId,
      dedupeKey: `status:${companyId}:${to}:${new Date().toISOString().slice(0, 10)}`,
      data: {
        companyName,
        portalUrl,
        reason,
        expiresOn,
        statusLabel: COMPANY_STATUS_META[to].label,
      },
    })
  }
}

/** Advances lifecycle statuses that carry no approval meaning. */
export async function advanceLifecycleStatus(
  companyId: string,
  to: Extract<
    CompanyStatusValue,
    'APPLICATION_STARTED' | 'APPLICATION_SUBMITTED' | 'DOCUMENTATION_PENDING'
  >,
): Promise<void> {
  const [company] = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1)
  if (!company) return
  if (LOCKED_STATUSES.includes(company.status)) return

  // Never walk a company backwards out of an approval it has earned.
  const approved: CompanyStatusValue[] = [
    'APPROVED_TO_BID',
    'APPROVED_TO_WORK',
    'PREFERRED',
    'PROBATIONARY',
  ]
  if (approved.includes(company.status)) return
  if (company.status === to) return

  await writeStatus({ companyId, from: company.status, to, actor: null, system: true })
}
