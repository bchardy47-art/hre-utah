import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/portal/auth/session'
import { PORTAL_NAME, SUPPORT_EMAIL, SUPPORT_PHONE_DISPLAY } from '@/lib/portal/constants'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: `Sign in — ${PORTAL_NAME}`,
  // The portal must never appear in search results or the public sitemap.
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string }
}) {
  const session = await getSession()
  if (session) {
    redirect(session.role === 'ADMIN' ? '/admin/trade-partners' : '/trade-partners/dashboard')
  }

  return (
    <div className="pt">
      <div className="pt-auth">
        <div className="pt-auth-card">
          <div className="pt-auth-mark">
            <div className="pt-brand-name">Hardy Homes</div>
            <div className="pt-brand-sub">Trade Partner Portal</div>
          </div>

          <h1 className="pt-h2" style={{ marginBottom: 6 }}>
            Sign in
          </h1>
          <p className="pt-sub pt-small" style={{ marginBottom: 20 }}>
            Use the email address Hardy Homes invited.
          </p>

          <LoginForm next={searchParams.next} />

          <p className="pt-hint" style={{ marginTop: 22 }}>
            Accounts are created by invitation only. If you have not received an invitation and
            believe you should have, contact Hardy Homes at{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'var(--orange)' }}>
              {SUPPORT_EMAIL}
            </a>{' '}
            or {SUPPORT_PHONE_DISPLAY}.
          </p>

          <p className="pt-hint" style={{ marginTop: 14 }}>
            <Link href="/" style={{ color: 'var(--muted)' }}>
              Back to hre-utah.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
