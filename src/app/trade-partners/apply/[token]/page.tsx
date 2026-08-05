import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession, requestContext } from '@/lib/portal/auth/session'
import { lookupInvitation, markInvitationOpened } from '@/lib/portal/services/invitations'
import { AUDIT, recordAudit } from '@/lib/portal/audit'
import { LIMITS, rateLimit } from '@/lib/portal/rate-limit'
import { PORTAL_NAME, SUPPORT_EMAIL, SUPPORT_PHONE_DISPLAY } from '@/lib/portal/constants'
import AcceptForm from './AcceptForm'

export const metadata: Metadata = {
  title: `Create your account — ${PORTAL_NAME}`,
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt">
      <div className="pt-auth">
        <div className="pt-auth-card is-wide">
          <div className="pt-auth-mark">
            <div className="pt-brand-name">Hardy Homes</div>
            <div className="pt-brand-sub">Trade Partner Portal</div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

function Unavailable({ heading, body }: { heading: string; body: string }) {
  return (
    <Shell>
      <h1 className="pt-h2">{heading}</h1>
      <p className="pt-sub" style={{ marginTop: 8 }}>
        {body}
      </p>
      <div className="pt-btn-row" style={{ marginTop: 22 }}>
        <Link className="pt-btn pt-btn-ghost" href="/trade-partners/login">
          Go to sign in
        </Link>
        <a className="pt-btn pt-btn-ghost" href={`mailto:${SUPPORT_EMAIL}`}>
          Contact Hardy Homes
        </a>
      </div>
      <p className="pt-hint" style={{ marginTop: 18 }}>
        You can also call {SUPPORT_PHONE_DISPLAY}.
      </p>
    </Shell>
  )
}

export default async function ApplyPage({ params }: { params: { token: string } }) {
  const session = await getSession()
  if (session) {
    redirect(session.role === 'ADMIN' ? '/admin/trade-partners' : '/trade-partners/dashboard')
  }

  // Rate-limited so the token space cannot be walked.
  const { ipAddress } = requestContext()
  const limit = rateLimit(
    `invite:${ipAddress ?? 'unknown'}`,
    LIMITS.inviteLookup.limit,
    LIMITS.inviteLookup.windowSeconds,
  )
  if (!limit.allowed) {
    return (
      <Unavailable
        heading="Too many attempts"
        body="Please wait a few minutes and open your invitation link again."
      />
    )
  }

  const lookup = await lookupInvitation(params.token)

  if (!lookup.ok) {
    if (lookup.reason === 'expired') {
      return (
        <Unavailable
          heading="This invitation has expired"
          body="Invitation links are time-limited for security. Contact Hardy Homes and we will send you a new one."
        />
      )
    }
    if (lookup.reason === 'accepted') {
      return (
        <Unavailable
          heading="This invitation has already been used"
          body="An account has already been created with this link. Sign in with the email address Hardy Homes invited."
        />
      )
    }
    // Revoked and not-found deliberately look identical, so a probe cannot tell
    // whether a token ever existed.
    return (
      <Unavailable
        heading="This link is not valid"
        body="This invitation link is no longer active. Contact Hardy Homes and we will send you a new one."
      />
    )
  }

  const { invitation, companyName } = lookup

  if (!invitation.openedAt) {
    await markInvitationOpened(invitation.id)
    await recordAudit({
      action: AUDIT.INVITATION_OPENED,
      summary: `Invitation opened for ${companyName}`,
      companyId: invitation.companyId,
      targetType: 'invitation',
      targetId: invitation.id,
      actorLabel: `${invitation.contactName} <${invitation.email}>`,
    })
  }

  return (
    <Shell>
      <h1 className="pt-h2" style={{ marginBottom: 6 }}>
        Create your account
      </h1>
      <p className="pt-sub pt-small" style={{ marginBottom: 18 }}>
        Hardy Homes has invited <strong>{companyName}</strong> to apply as an approved trade
        partner. Create your sign-in below, then complete the onboarding application. You can save
        your progress and come back at any time.
      </p>

      {invitation.message ? (
        <div className="pt-notice pt-notice-info">
          <div>
            <p>
              <strong>Message from Hardy Homes</strong>
            </p>
            <p>{invitation.message}</p>
          </div>
        </div>
      ) : null}

      <AcceptForm
        token={params.token}
        email={invitation.email}
        contactName={invitation.contactName}
      />

      <p className="pt-hint" style={{ marginTop: 20 }}>
        Submitting an application does not guarantee that Hardy Homes will award any work.
      </p>
    </Shell>
  )
}
