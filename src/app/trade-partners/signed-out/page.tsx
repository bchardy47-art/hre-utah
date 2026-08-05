import type { Metadata } from 'next'
import Link from 'next/link'
import { PORTAL_NAME } from '@/lib/portal/constants'

export const metadata: Metadata = {
  title: `Signed out — ${PORTAL_NAME}`,
  robots: { index: false, follow: false },
}

export default function SignedOutPage() {
  return (
    <div className="pt">
      <div className="pt-auth">
        <div className="pt-auth-card">
          <div className="pt-auth-mark">
            <div className="pt-brand-name">Hardy Homes</div>
            <div className="pt-brand-sub">Trade Partner Portal</div>
          </div>
          <h1 className="pt-h2">You are signed out</h1>
          <p className="pt-sub pt-small" style={{ margin: '8px 0 22px' }}>
            Your session has ended. Sign in again to return to the portal.
          </p>
          <Link className="pt-btn pt-btn-primary pt-btn-block" href="/trade-partners/login">
            Sign in again
          </Link>
          <p className="pt-hint" style={{ marginTop: 16, textAlign: 'center' }}>
            <Link href="/" style={{ color: 'var(--muted)' }}>
              Back to hre-utah.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
