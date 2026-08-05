/**
 * Outbound mail for the Trade Partner Portal.
 *
 * Uses the Resend account already described in the repository's .env.example —
 * no second email provider is introduced.
 *
 * Duplicate suppression is done in the database, not in memory: every send
 * claims a row in `tp_notification` keyed by `dedupeKey` first. Because that
 * column has a unique index, two concurrent lambdas racing on the same reminder
 * cannot both win the insert, so the expiration sweep is safe to re-run.
 *
 * When RESEND_API_KEY is absent the mailer degrades to a console transport and
 * still records the notification row, so the whole portal works end-to-end in
 * development without an account.
 */

import 'server-only'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'
import { db } from '../db'
import { notifications } from '../db/schema'
import { serverEnv } from '../env'
import { AUDIT, recordAudit } from '../audit'
import { renderEmail, type NotificationType, type TemplateData } from './templates'

let resend: Resend | null = null

function client(): Resend | null {
  if (!serverEnv.resendApiKey) return null
  if (!resend) resend = new Resend(serverEnv.resendApiKey)
  return resend
}

export type SendResult = { status: 'SENT' | 'SKIPPED' | 'FAILED'; reason?: string }

export type SendPortalEmailInput = {
  type: NotificationType
  to: string
  data: TemplateData
  /**
   * Idempotency key. Include everything that makes this message distinct —
   * typically `${type}:${documentId}:${daysBefore}`. Omit only for messages that
   * are genuinely allowed to repeat.
   */
  dedupeKey: string
  companyId?: string | null
  userId?: string | null
  documentId?: string | null
}

export async function sendPortalEmail(input: SendPortalEmailInput): Promise<SendResult> {
  const { subject, html, text } = renderEmail(input.type, input.data)

  // Step 1 — claim the dedupe key. A conflict means someone already sent this.
  const claimed = await db
    .insert(notifications)
    .values({
      companyId: input.companyId ?? null,
      userId: input.userId ?? null,
      documentId: input.documentId ?? null,
      type: input.type,
      toEmail: input.to,
      subject,
      dedupeKey: input.dedupeKey,
      status: 'SENT',
    })
    .onConflictDoNothing({ target: notifications.dedupeKey })
    .returning({ id: notifications.id })

  if (claimed.length === 0) {
    return { status: 'SKIPPED', reason: 'Already sent (duplicate suppressed).' }
  }
  const notificationId = claimed[0].id

  // Step 2 — actually send.
  const mailer = client()
  if (!mailer) {
    console.info('[portal:email] RESEND_API_KEY not set — logging instead of sending.', {
      to: input.to,
      subject,
      type: input.type,
    })
    await db
      .update(notifications)
      .set({ status: 'SKIPPED', error: 'No email provider configured.' })
      .where(eqId(notificationId))
    return { status: 'SKIPPED', reason: 'No email provider configured.' }
  }

  try {
    const result = await mailer.emails.send({
      from: serverEnv.mailFrom,
      to: input.to,
      subject,
      html,
      text,
    })

    if (result.error) throw new Error(result.error.message)

    await db
      .update(notifications)
      .set({ status: 'SENT', providerId: result.data?.id ?? null })
      .where(eqId(notificationId))

    await recordAudit({
      action: AUDIT.NOTIFICATION_SENT,
      summary: `Sent "${subject}" to ${maskEmail(input.to)}`,
      companyId: input.companyId ?? null,
      targetType: 'notification',
      targetId: notificationId,
      metadata: { type: input.type },
    })

    return { status: 'SENT' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown email error'
    await db
      .update(notifications)
      .set({ status: 'FAILED', error: message.slice(0, 500) })
      .where(eqId(notificationId))

    await recordAudit({
      action: AUDIT.NOTIFICATION_FAILED,
      summary: `Failed to send "${subject}" to ${maskEmail(input.to)}`,
      companyId: input.companyId ?? null,
      targetType: 'notification',
      targetId: notificationId,
      metadata: { type: input.type, error: message },
    })

    console.error('[portal:email] send failed', { type: input.type, error: message })
    return { status: 'FAILED', reason: message }
  }
}

/** Masks an address for log and audit output: b***n@example.com */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return '[invalid]'
  if (local.length <= 2) return `${local[0]}***@${domain}`
  return `${local[0]}***${local[local.length - 1]}@${domain}`
}

function eqId(id: string) {
  return eq(notifications.id, id)
}

export function isEmailConfigured(): boolean {
  return Boolean(serverEnv.resendApiKey)
}
