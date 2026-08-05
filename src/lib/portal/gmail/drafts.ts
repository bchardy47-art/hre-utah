/**
 * Gmail draft generation.
 *
 * The portal does not send email. It builds a prefilled Gmail compose URL that
 * an administrator opens, reads, and sends themselves. That is a deliberate
 * trade: it removes a paid provider and, more importantly, it means the system
 * can never claim a message was delivered when it was not.
 *
 * Two rules follow from that and are enforced throughout:
 *   1. No wording anywhere may say "sent". The action is "draft opened".
 *   2. What we record is a human action (DRAFT_OPENED), not a delivery event.
 *
 * This module is pure — no I/O, no secrets — so every URL and body is directly
 * unit-testable.
 */

import type { CompanyStatusValue } from '../firebase/types'

export const GMAIL_COMPOSE_BASE = 'https://mail.google.com/mail/?view=cm&fs=1'

export const DRAFT_TYPES = {
  INVITATION: 'invitation',
  INVITATION_RESEND: 'invitation_resend',
  APPLICATION_RETURNED: 'application_returned',
  DOCUMENT_APPROVED: 'document_approved',
  DOCUMENT_REJECTED: 'document_rejected',
  APPROVED_TO_BID: 'approved_to_bid',
  APPROVED_TO_WORK: 'approved_to_work',
  EXPIRATION_REMINDER: 'expiration_reminder',
  SUSPENDED: 'suspended',
  REACTIVATED: 'reactivated',
  MISSING_DOCUMENTS: 'missing_documents',
} as const

export type DraftType = (typeof DRAFT_TYPES)[keyof typeof DRAFT_TYPES]

export type DraftInput = {
  type: DraftType
  to: string
  companyName: string
  contactName?: string
  portalUrl: string
  /** One-time invitation link. Only present for invitation drafts. */
  inviteUrl?: string
  expiresOn?: string
  documentName?: string
  reason?: string
  daysUntil?: number
  items?: string[]
  adminMessage?: string
  statusLabel?: string
  signerName?: string
}

export type RenderedDraft = {
  to: string
  subject: string
  body: string
  /** Ready to open in a new tab. */
  url: string
}

const SIGN_OFF = (signer?: string) =>
  ['', 'Thank you,', signer || 'Brian Hardy', 'Hardy Homes', '(801) 380-0445'].join('\n')

/**
 * Builds the compose URL.
 *
 * `encodeURIComponent` rather than URLSearchParams because Gmail is particular
 * about how newlines in `body` survive; percent-encoding them explicitly is what
 * makes the line breaks appear in the draft rather than collapsing.
 */
export function buildGmailComposeUrl(to: string, subject: string, body: string): string {
  const params = [
    `to=${encodeURIComponent(to)}`,
    `su=${encodeURIComponent(subject)}`,
    `body=${encodeURIComponent(body)}`,
  ]
  return `${GMAIL_COMPOSE_BASE}&${params.join('&')}`
}

export function renderDraft(input: DraftInput): RenderedDraft {
  const { subject, body } = renderContent(input)
  return {
    to: input.to,
    subject,
    body,
    url: buildGmailComposeUrl(input.to, subject, body),
  }
}

function greeting(name?: string): string {
  return name ? `Hi ${name.split(' ')[0]},` : 'Hello,'
}

function renderContent(d: DraftInput): { subject: string; body: string } {
  const lines: string[] = []

  switch (d.type) {
    case DRAFT_TYPES.INVITATION:
    case DRAFT_TYPES.INVITATION_RESEND: {
      const resend = d.type === DRAFT_TYPES.INVITATION_RESEND
      lines.push(
        greeting(d.contactName),
        '',
        resend
          ? `Here is a fresh link to finish setting up ${d.companyName} as a Hardy Homes trade partner. Any earlier link has stopped working.`
          : `Hardy Homes would like to invite ${d.companyName} to apply as an approved trade partner.`,
        '',
        'Use this secure link to create your account and complete the onboarding application:',
        d.inviteUrl ?? d.portalUrl,
        '',
      )
      if (d.expiresOn) lines.push(`The link expires on ${d.expiresOn}.`, '')
      if (d.adminMessage) lines.push(d.adminMessage, '')
      lines.push(
        'You will be asked for company information, contacts, licensing, insurance, and a few recent references. You can save your progress and come back to it.',
        '',
        'Submitting an application does not guarantee that work will be awarded.',
        SIGN_OFF(d.signerName),
      )
      return {
        subject: 'Hardy Homes Trade Partner Invitation',
        body: lines.join('\n'),
      }
    }

    case DRAFT_TYPES.APPLICATION_RETURNED:
      lines.push(
        greeting(d.contactName),
        '',
        `We have looked at the trade partner application for ${d.companyName} and need a couple of corrections before we can continue.`,
        '',
        d.reason ? `What needs attention:\n${d.reason}` : '',
        '',
        `You can make the changes and resubmit here:\n${d.portalUrl}`,
        '',
        'Nothing you entered has been lost.',
        SIGN_OFF(d.signerName),
      )
      return { subject: `Action needed — application for ${d.companyName}`, body: lines.join('\n') }

    case DRAFT_TYPES.DOCUMENT_APPROVED:
      lines.push(
        greeting(d.contactName),
        '',
        `${d.documentName} has been approved for ${d.companyName}. Thank you.`,
        '',
        `Your remaining items, if any, are shown here:\n${d.portalUrl}`,
        SIGN_OFF(d.signerName),
      )
      return { subject: `Approved: ${d.documentName}`, body: lines.join('\n') }

    case DRAFT_TYPES.DOCUMENT_REJECTED:
      lines.push(
        greeting(d.contactName),
        '',
        `We were not able to accept the ${d.documentName} for ${d.companyName}.`,
        '',
        d.reason ? `Reason:\n${d.reason}` : '',
        '',
        `You can upload a corrected copy here:\n${d.portalUrl}`,
        '',
        'Your previous upload has been kept on file.',
        SIGN_OFF(d.signerName),
      )
      return { subject: `Action needed: ${d.documentName}`, body: lines.join('\n') }

    case DRAFT_TYPES.APPROVED_TO_BID:
      lines.push(
        greeting(d.contactName),
        '',
        `${d.companyName} is now approved to submit bids to Hardy Homes.`,
        '',
        'To be clear about what that means: you are cleared to give us pricing, but not yet cleared to mobilize or start work. The remaining compliance items on your dashboard need to be approved and current first.',
        '',
        `Your dashboard:\n${d.portalUrl}`,
        '',
        'Approval to bid does not guarantee that work will be awarded.',
        SIGN_OFF(d.signerName),
      )
      return { subject: `Approved to bid — ${d.companyName}`, body: lines.join('\n') }

    case DRAFT_TYPES.APPROVED_TO_WORK:
      lines.push(
        greeting(d.contactName),
        '',
        `${d.companyName} is now approved to work with Hardy Homes.`,
        '',
        'All of your mandatory compliance items are approved and current.',
        d.expiresOn ? `Your approval runs through ${d.expiresOn}, the earliest expiration on file.` : '',
        '',
        'Two things worth keeping in mind: please keep your licence and insurance current, because if a mandatory document expires the portal removes work eligibility until a current copy is approved. And no work should begin without written authorization from us for that specific project.',
        '',
        `Your dashboard:\n${d.portalUrl}`,
        '',
        'Approval to work does not guarantee that work will be awarded.',
        SIGN_OFF(d.signerName),
      )
      return { subject: `Approved to work — ${d.companyName}`, body: lines.join('\n') }

    case DRAFT_TYPES.EXPIRATION_REMINDER: {
      const days = d.daysUntil ?? 0
      const when = days <= 0 ? 'has expired' : `expires in ${days} day${days === 1 ? '' : 's'}`
      lines.push(
        greeting(d.contactName),
        '',
        `A quick heads-up: the ${d.documentName} we have on file for ${d.companyName} ${when}${d.expiresOn ? ` (${d.expiresOn})` : ''}.`,
        '',
        days <= 0
          ? 'Work clearance is paused until we have a current copy approved.'
          : 'Sending a current copy before then keeps your work clearance active.',
        '',
        `You can upload it here:\n${d.portalUrl}`,
        SIGN_OFF(d.signerName),
      )
      return {
        subject:
          days <= 0
            ? `Expired: ${d.documentName} — ${d.companyName}`
            : `${d.documentName} expires in ${days} day${days === 1 ? '' : 's'} — ${d.companyName}`,
        body: lines.join('\n'),
      }
    }

    case DRAFT_TYPES.MISSING_DOCUMENTS:
      lines.push(
        greeting(d.contactName),
        '',
        `We are still missing a few required items for ${d.companyName}:`,
        '',
        ...(d.items ?? []).map((i) => `  - ${i}`),
        '',
        `You can upload them here:\n${d.portalUrl}`,
        SIGN_OFF(d.signerName),
      )
      return { subject: `Outstanding documents — ${d.companyName}`, body: lines.join('\n') }

    case DRAFT_TYPES.SUSPENDED:
      lines.push(
        greeting(d.contactName),
        '',
        `I am writing to let you know that the trade partner account for ${d.companyName} has been suspended.`,
        '',
        d.reason ? `Reason:\n${d.reason}` : '',
        '',
        'Please give me a call so we can talk it through.',
        SIGN_OFF(d.signerName),
      )
      return { subject: `Account status — ${d.companyName}`, body: lines.join('\n') }

    case DRAFT_TYPES.REACTIVATED:
      lines.push(
        greeting(d.contactName),
        '',
        `Good news — the trade partner account for ${d.companyName} is active again.`,
        d.statusLabel ? `Your current status is: ${d.statusLabel}.` : '',
        '',
        `Your dashboard:\n${d.portalUrl}`,
        SIGN_OFF(d.signerName),
      )
      return { subject: `Account reactivated — ${d.companyName}`, body: lines.join('\n') }
  }
}

/** Maps a status change to the draft an administrator would want to send, if any. */
export function draftTypeForStatusChange(
  from: CompanyStatusValue,
  to: CompanyStatusValue,
): DraftType | null {
  const blocked = (s: CompanyStatusValue) => s === 'SUSPENDED' || s === 'DO_NOT_USE'

  if (blocked(to)) return DRAFT_TYPES.SUSPENDED
  if (blocked(from)) return DRAFT_TYPES.REACTIVATED
  if (to === 'APPROVED_TO_BID') return DRAFT_TYPES.APPROVED_TO_BID
  if (to === 'APPROVED_TO_WORK') return DRAFT_TYPES.APPROVED_TO_WORK
  return null
}

/**
 * Stable idempotency key for a reminder. Used as the Firestore document ID for
 * the reminder action, so the same reminder cannot be recorded twice and the
 * action queue does not repeat itself.
 */
export function reminderDedupeKey(args: {
  messageType: string
  documentId?: string | null
  companyId: string
  threshold: string
}): string {
  const target = args.documentId ?? args.companyId
  return `${args.messageType}__${target}__${args.threshold}`
}
