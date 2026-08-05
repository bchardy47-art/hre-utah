/**
 * Append-only audit trail, on Firestore.
 *
 * `AUDIT` holds stable string constants rather than an enum so new events can be
 * added without a schema change.
 *
 * Redaction: `metadata` passes through `redact()` before it is written. Anything
 * whose key looks like a secret, an EIN, a policy number, or a token is replaced
 * with a marker, so the audit log can never become the place sensitive values
 * leak.
 */

import 'server-only'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from './admin'
import { COLLECTIONS, type UserRoleValue } from './types'
import { requestContext, type PortalSession } from '../auth/firebase-session'

export const AUDIT = {
  // Authentication
  LOGIN_SUCCEEDED: 'auth.login.succeeded',
  LOGIN_FAILED: 'auth.login.failed',
  LOGOUT: 'auth.logout',
  PASSWORD_RESET_REQUESTED: 'auth.password.reset_requested',
  EMAIL_VERIFICATION_SENT: 'auth.email.verification_sent',

  // Invitations
  INVITATION_CREATED: 'invitation.created',
  INVITATION_RESENT: 'invitation.resent',
  INVITATION_REVOKED: 'invitation.revoked',
  INVITATION_OPENED: 'invitation.opened',
  INVITATION_ACCEPTED: 'invitation.accepted',
  INVITATION_EMAIL_MISMATCH: 'invitation.email_mismatch',

  // Application
  APPLICATION_SECTION_SAVED: 'application.section.saved',
  APPLICATION_SUBMITTED: 'application.submitted',
  APPLICATION_RETURNED: 'application.returned',
  APPLICATION_APPROVED: 'application.approved',
  APPLICATION_CERTIFIED: 'application.certified',

  // Documents
  DOCUMENT_UPLOADED: 'document.uploaded',
  DOCUMENT_DOWNLOADED: 'document.downloaded',
  DOCUMENT_APPROVED: 'document.approved',
  DOCUMENT_REJECTED: 'document.rejected',
  DOCUMENT_MARKED_NOT_APPLICABLE: 'document.marked_not_applicable',
  DOCUMENT_SUPERSEDED: 'document.superseded',
  DOCUMENT_EXPIRED: 'document.expired',
  DOCUMENT_UPLOAD_REJECTED: 'document.upload_rejected',

  // Acknowledgments and licensing
  ACKNOWLEDGMENT_RECORDED: 'acknowledgment.recorded',
  LICENSE_VERIFIED: 'license.verified',
  LICENSE_VERIFICATION_REJECTED: 'license.verification_rejected',

  // Status
  STATUS_CHANGED: 'status.changed',
  STATUS_CHANGE_BLOCKED: 'status.change_blocked',

  // Notes
  INTERNAL_NOTE_ADDED: 'note.added',

  /**
   * Gmail drafts. Deliberately named "draft opened" and never "sent" — the
   * portal cannot know whether the administrator actually pressed send.
   */
  GMAIL_DRAFT_OPENED: 'gmail.draft_opened',
  REMINDER_MARKED_HANDLED: 'reminder.marked_handled',
  REMINDER_DISMISSED: 'reminder.dismissed',

  // Access control
  ACCESS_DENIED: 'access.denied',
} as const

export type AuditAction = (typeof AUDIT)[keyof typeof AUDIT]

const SENSITIVE_KEY =
  /(ein|ssn|tax_?id|password|secret|token|routing|account_?number|policy_?number|authorization|cookie|private_?key)/i

/** Recursively redacts anything that looks sensitive, and truncates long strings. */
export function redact(value: unknown, depth = 0): unknown {
  if (depth > 4) return '[truncated]'
  if (value == null) return value
  if (typeof value === 'string') return value.length > 300 ? `${value.slice(0, 300)}…` : value
  if (typeof value === 'number' || typeof value === 'boolean') return value
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => redact(v, depth + 1))
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEY.test(k) ? '[redacted]' : redact(v, depth + 1)
    }
    return out
  }
  return '[unserializable]'
}

export type AuditInput = {
  action: AuditAction
  summary: string
  companyId?: string | null
  targetType?: string
  targetId?: string
  metadata?: Record<string, unknown>
  actor?: Pick<PortalSession, 'userId' | 'name' | 'email' | 'role'> | null
  actorLabel?: string
}

/**
 * Writes one audit document. Never throws — an audit failure must not roll back
 * the business action it describes, so failures are logged and swallowed.
 */
export async function recordAudit(input: AuditInput): Promise<void> {
  try {
    const { ipAddress, userAgent } = requestContext()
    await adminDb()
      .collection(COLLECTIONS.auditEvents)
      .add({
        companyId: input.companyId ?? null,
        actorUserId: input.actor?.userId ?? null,
        actorRole: (input.actor?.role ?? null) as UserRoleValue | null,
        actorLabel:
          input.actorLabel ??
          (input.actor ? `${input.actor.name} <${input.actor.email}>` : 'System'),
        action: input.action,
        targetType: input.targetType ?? null,
        targetId: input.targetId ?? null,
        summary: input.summary,
        metadata: input.metadata ? (redact(input.metadata) as Record<string, unknown>) : null,
        ipAddress,
        userAgent: userAgent?.slice(0, 500) ?? null,
        createdAt: FieldValue.serverTimestamp(),
      })
  } catch (error) {
    console.error('[portal:audit] failed to record audit event', {
      action: input.action,
      error: error instanceof Error ? error.message : 'unknown',
    })
  }
}

export async function recordAccessDenied(
  session: PortalSession | null,
  detail: string,
  companyId?: string,
): Promise<void> {
  await recordAudit({
    action: AUDIT.ACCESS_DENIED,
    summary: detail,
    companyId: companyId ?? null,
    actor: session,
  })
}

/** Masks an address for log and audit output: b***n@example.com */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return '[invalid]'
  if (local.length <= 2) return `${local[0]}***@${domain}`
  return `${local[0]}***${local[local.length - 1]}@${domain}`
}
