/**
 * Email templates for the Trade Partner Portal.
 *
 * Style: light background with the HRE burnt-orange accent, because dark-mode
 * email rendering is unreliable across clients and these messages are read on
 * phones in trucks. Plain, professional, one obvious action.
 *
 * Content rules enforced here:
 *   - No legal promises. Approval is clearance, never a guarantee of work.
 *   - No sensitive values (EIN, policy numbers, tokens beyond the one-time
 *     invitation link) appear in any message body.
 */

import { PORTAL_NAME, SUPPORT_EMAIL, SUPPORT_PHONE_DISPLAY } from '../constants'

export const NOTIFICATION_TYPES = {
  INVITATION_SENT: 'invitation_sent',
  INVITATION_RESENT: 'invitation_resent',
  APPLICATION_SUBMITTED: 'application_submitted',
  APPLICATION_RETURNED: 'application_returned',
  DOCUMENT_APPROVED: 'document_approved',
  DOCUMENT_REJECTED: 'document_rejected',
  MISSING_DOCUMENT_REMINDER: 'missing_document_reminder',
  EXPIRATION_WARNING: 'expiration_warning',
  DOCUMENT_EXPIRED: 'document_expired',
  APPROVED_TO_BID: 'approved_to_bid',
  APPROVED_TO_WORK: 'approved_to_work',
  SUSPENDED: 'suspended',
  REACTIVATED: 'reactivated',
  ADMIN_ACTION_REQUIRED: 'admin_action_required',
} as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]

export type RenderedEmail = { subject: string; html: string; text: string }

const ORANGE = '#e2601f'
const INK = '#101620'
const MUTED = '#5d6570'
const BORDER = '#e3e0da'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

type ShellOptions = {
  heading: string
  intro: string
  body?: string[]
  bullets?: string[]
  callout?: { label: string; value: string }
  cta?: { label: string; url: string }
  closing?: string
}

function shell(o: ShellOptions): { html: string; text: string } {
  const bulletsHtml = o.bullets?.length
    ? `<ul style="margin:0 0 20px;padding-left:20px;color:${INK};font-size:15px;line-height:1.6;">${o.bullets
        .map((b) => `<li style="margin-bottom:6px;">${escapeHtml(b)}</li>`)
        .join('')}</ul>`
    : ''

  const bodyHtml = (o.body ?? [])
    .map(
      (p) =>
        `<p style="margin:0 0 16px;color:${INK};font-size:15px;line-height:1.65;">${escapeHtml(p)}</p>`,
    )
    .join('')

  const calloutHtml = o.callout
    ? `<table role="presentation" width="100%" style="border-collapse:collapse;margin:0 0 22px;">
         <tr><td style="background:#faf8f5;border:1px solid ${BORDER};border-left:3px solid ${ORANGE};padding:14px 16px;border-radius:4px;">
           <div style="font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:${MUTED};margin-bottom:4px;">${escapeHtml(o.callout.label)}</div>
           <div style="font-size:16px;font-weight:600;color:${INK};">${escapeHtml(o.callout.value)}</div>
         </td></tr>
       </table>`
    : ''

  const ctaHtml = o.cta
    ? `<table role="presentation" style="border-collapse:collapse;margin:0 0 26px;">
         <tr><td style="background:${ORANGE};border-radius:4px;">
           <a href="${o.cta.url}" style="display:inline-block;padding:13px 26px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">${escapeHtml(o.cta.label)}</a>
         </td></tr>
       </table>
       <p style="margin:0 0 22px;color:${MUTED};font-size:12px;line-height:1.5;word-break:break-all;">If the button does not work, copy this link into your browser:<br>${escapeHtml(o.cta.url)}</p>`
    : ''

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(o.heading)}</title></head>
<body style="margin:0;padding:0;background:#f4f2ee;">
<table role="presentation" width="100%" style="border-collapse:collapse;background:#f4f2ee;padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" style="max-width:580px;border-collapse:collapse;background:#ffffff;border:1px solid ${BORDER};border-radius:6px;overflow:hidden;">
  <tr><td style="background:${INK};padding:20px 28px;">
    <div style="color:#ffffff;font-size:17px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;">Hardy Homes</div>
    <div style="color:${ORANGE};font-size:11px;letter-spacing:.14em;text-transform:uppercase;margin-top:3px;">Trade Partner Portal</div>
  </td></tr>
  <tr><td style="padding:30px 28px 8px;">
    <h1 style="margin:0 0 14px;font-size:21px;line-height:1.25;color:${INK};font-weight:700;">${escapeHtml(o.heading)}</h1>
    <p style="margin:0 0 18px;color:${INK};font-size:15px;line-height:1.65;">${escapeHtml(o.intro)}</p>
    ${calloutHtml}${bodyHtml}${bulletsHtml}${ctaHtml}
    ${o.closing ? `<p style="margin:0 0 8px;color:${MUTED};font-size:14px;line-height:1.6;">${escapeHtml(o.closing)}</p>` : ''}
  </td></tr>
  <tr><td style="padding:18px 28px 26px;border-top:1px solid ${BORDER};">
    <p style="margin:0;color:${MUTED};font-size:12px;line-height:1.6;">
      Questions? Reply to this email or call ${SUPPORT_PHONE_DISPLAY}.<br>
      Hardy Homes &middot; ${SUPPORT_EMAIL}
    </p>
  </td></tr>
</table>
<p style="max-width:580px;margin:14px auto 0;color:#8a8f96;font-size:11px;line-height:1.55;text-align:left;">
  This message relates to your company&rsquo;s trade partner record with Hardy Homes.
  Approval status reflects compliance clearance only and is not a guarantee that work will be awarded.
</p>
</td></tr></table></body></html>`

  const textParts = [
    'HARDY HOMES — TRADE PARTNER PORTAL',
    '',
    o.heading.toUpperCase(),
    '',
    o.intro,
    '',
    ...(o.callout ? [`${o.callout.label}: ${o.callout.value}`, ''] : []),
    ...(o.body ?? []).flatMap((p) => [p, '']),
    ...(o.bullets ?? []).map((b) => `  - ${b}`),
    ...(o.bullets?.length ? [''] : []),
    ...(o.cta ? [`${o.cta.label}: ${o.cta.url}`, ''] : []),
    ...(o.closing ? [o.closing, ''] : []),
    '---',
    `Questions? Reply to this email or call ${SUPPORT_PHONE_DISPLAY}.`,
    'Approval status reflects compliance clearance only and is not a guarantee that work will be awarded.',
  ]

  return { html, text: textParts.join('\n') }
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export type TemplateData = {
  companyName: string
  contactName?: string
  portalUrl: string
  inviteUrl?: string
  expiresOn?: string
  documentName?: string
  reason?: string
  daysUntil?: number
  items?: string[]
  adminMessage?: string
  statusLabel?: string
}

export function renderEmail(type: NotificationType, d: TemplateData): RenderedEmail {
  switch (type) {
    case NOTIFICATION_TYPES.INVITATION_SENT:
    case NOTIFICATION_TYPES.INVITATION_RESENT: {
      const resent = type === NOTIFICATION_TYPES.INVITATION_RESENT
      const s = shell({
        heading: resent ? 'Your invitation link, resent' : 'Hardy Homes Trade Partner Invitation',
        intro: resent
          ? `Here is a fresh secure link to complete onboarding for ${d.companyName}. Any previous link is no longer valid.`
          : `Hardy Homes has invited your company to apply as an approved trade partner. Use the secure link below to create your account and complete the onboarding process.`,
        callout: d.expiresOn ? { label: 'Link expires', value: d.expiresOn } : undefined,
        body: [
          ...(d.adminMessage ? [`Message from Hardy Homes: ${d.adminMessage}`] : []),
          'You will be asked for company information, contacts, licensing, insurance, and a few recent references. You can save your progress and return at any time.',
        ],
        cta: { label: 'Create your account', url: d.inviteUrl ?? d.portalUrl },
        closing:
          'This link works once and cannot be shared. Submitting an application does not guarantee that work will be awarded.',
      })
      return { subject: 'Hardy Homes Trade Partner Invitation', ...s }
    }

    case NOTIFICATION_TYPES.APPLICATION_SUBMITTED: {
      const s = shell({
        heading: 'Application received',
        intro: `Thank you — we have received the trade partner application for ${d.companyName}.`,
        body: [
          'Hardy Homes will review your application and submitted documents. You can check your status, see what is still outstanding, and upload documents at any time from your dashboard.',
        ],
        cta: { label: 'Open your dashboard', url: d.portalUrl },
        closing: 'Submitting an application does not guarantee that work will be awarded.',
      })
      return { subject: `Application received — ${d.companyName}`, ...s }
    }

    case NOTIFICATION_TYPES.APPLICATION_RETURNED: {
      const s = shell({
        heading: 'Your application needs a correction',
        intro: `Hardy Homes has returned the application for ${d.companyName} so a few items can be corrected.`,
        callout: d.reason ? { label: 'What needs attention', value: d.reason } : undefined,
        body: ['Open your dashboard to make the corrections and resubmit. Nothing you entered has been lost.'],
        cta: { label: 'Correct and resubmit', url: d.portalUrl },
      })
      return { subject: `Action needed — application returned for ${d.companyName}`, ...s }
    }

    case NOTIFICATION_TYPES.DOCUMENT_APPROVED: {
      const s = shell({
        heading: 'Document approved',
        intro: `${d.documentName} has been approved for ${d.companyName}.`,
        body: ['Your compliance checklist has been updated. Any remaining items are shown on your dashboard.'],
        cta: { label: 'View your checklist', url: d.portalUrl },
      })
      return { subject: `Approved: ${d.documentName}`, ...s }
    }

    case NOTIFICATION_TYPES.DOCUMENT_REJECTED: {
      const s = shell({
        heading: 'A document needs to be corrected',
        intro: `${d.documentName} was not accepted for ${d.companyName}.`,
        callout: d.reason ? { label: 'Reason', value: d.reason } : undefined,
        body: ['Upload a corrected copy from your dashboard. Your previous upload has been kept on file.'],
        cta: { label: 'Upload a correction', url: d.portalUrl },
      })
      return { subject: `Action needed: ${d.documentName}`, ...s }
    }

    case NOTIFICATION_TYPES.MISSING_DOCUMENT_REMINDER: {
      const s = shell({
        heading: 'Documents still outstanding',
        intro: `A few required items are still missing for ${d.companyName}.`,
        bullets: d.items ?? [],
        body: ['Your file cannot be completed until these are provided.'],
        cta: { label: 'Upload documents', url: d.portalUrl },
      })
      return { subject: `Reminder: documents outstanding — ${d.companyName}`, ...s }
    }

    case NOTIFICATION_TYPES.EXPIRATION_WARNING: {
      const days = d.daysUntil ?? 0
      const window = days === 0 ? 'today' : `in ${days} day${days === 1 ? '' : 's'}`
      const s = shell({
        heading: `${d.documentName} expires ${window}`,
        intro: `The ${d.documentName} on file for ${d.companyName} expires ${window}.`,
        callout: d.expiresOn ? { label: 'Expiration date', value: d.expiresOn } : undefined,
        body: [
          'Upload a current copy before the expiration date to keep your work clearance active. If a mandatory document expires, work eligibility is removed until a current copy is approved.',
        ],
        cta: { label: 'Upload a current copy', url: d.portalUrl },
      })
      return { subject: `Expiring ${window}: ${d.documentName} — ${d.companyName}`, ...s }
    }

    case NOTIFICATION_TYPES.DOCUMENT_EXPIRED: {
      const s = shell({
        heading: `${d.documentName} has expired`,
        intro: `The ${d.documentName} on file for ${d.companyName} has expired.`,
        body: [
          'Work clearance is paused until a current copy is uploaded and approved. Upload a replacement from your dashboard and Hardy Homes will review it.',
        ],
        cta: { label: 'Upload a current copy', url: d.portalUrl },
      })
      return { subject: `Expired: ${d.documentName} — ${d.companyName}`, ...s }
    }

    case NOTIFICATION_TYPES.APPROVED_TO_BID: {
      const s = shell({
        heading: 'Approved to bid',
        intro: `${d.companyName} is now approved to submit bids to Hardy Homes.`,
        body: [
          'You are cleared to provide pricing. You are not yet cleared to mobilize or perform work — the remaining compliance items on your dashboard must be approved and current first.',
        ],
        cta: { label: 'See remaining items', url: d.portalUrl },
        closing: 'Approval to bid does not guarantee that work will be awarded.',
      })
      return { subject: `Approved to bid — ${d.companyName}`, ...s }
    }

    case NOTIFICATION_TYPES.APPROVED_TO_WORK: {
      const s = shell({
        heading: 'Approved to work',
        intro: `${d.companyName} is now approved to work with Hardy Homes.`,
        callout: d.expiresOn
          ? { label: 'Approval current through', value: d.expiresOn }
          : undefined,
        body: [
          'All mandatory compliance items are approved and current. Keep your licence and insurance current — if a mandatory document expires, work eligibility is removed automatically until a current copy is approved.',
          'No work may begin without written authorization from Hardy Homes for the specific project.',
        ],
        cta: { label: 'Open your dashboard', url: d.portalUrl },
        closing: 'Approval to work does not guarantee that work will be awarded.',
      })
      return { subject: `Approved to work — ${d.companyName}`, ...s }
    }

    case NOTIFICATION_TYPES.SUSPENDED: {
      const s = shell({
        heading: 'Your account status has changed',
        intro: `The trade partner account for ${d.companyName} has been suspended.`,
        callout: d.reason ? { label: 'Reason', value: d.reason } : undefined,
        body: ['Please contact Hardy Homes directly to discuss next steps.'],
      })
      return { subject: `Account status change — ${d.companyName}`, ...s }
    }

    case NOTIFICATION_TYPES.REACTIVATED: {
      const s = shell({
        heading: 'Your account has been reactivated',
        intro: `The trade partner account for ${d.companyName} is active again.`,
        callout: d.statusLabel ? { label: 'Current status', value: d.statusLabel } : undefined,
        cta: { label: 'Open your dashboard', url: d.portalUrl },
      })
      return { subject: `Account reactivated — ${d.companyName}`, ...s }
    }

    case NOTIFICATION_TYPES.ADMIN_ACTION_REQUIRED: {
      const s = shell({
        heading: 'Trade partner portal — action queue',
        intro: `${d.companyName} needs attention in the Trade Partner Portal.`,
        bullets: d.items ?? [],
        cta: { label: 'Open the admin queue', url: d.portalUrl },
      })
      return { subject: `${PORTAL_NAME}: ${d.companyName} needs attention`, ...s }
    }
  }
}
