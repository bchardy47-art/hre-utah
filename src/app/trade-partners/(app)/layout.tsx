import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/portal/db'
import { companies } from '@/lib/portal/db/schema'
import { requireTradePartner } from '@/lib/portal/auth/guards'
import { PORTAL_NAME } from '@/lib/portal/constants'
import { PortalShell } from '@/components/portal/ui'
import { signOut } from '../auth-actions'

export const metadata: Metadata = {
  title: PORTAL_NAME,
  robots: { index: false, follow: false },
}

/**
 * Every page under this layout is authenticated server-side. `requireTradePartner`
 * runs on each request — an administrator who lands here is sent to the admin
 * side, and an unauthenticated visitor is redirected to sign in regardless of
 * what the edge middleware did.
 */
export const dynamic = 'force-dynamic'

const NAV = [
  { href: '/trade-partners/dashboard', label: 'Dashboard' },
  { href: '/trade-partners/company', label: 'Application' },
  { href: '/trade-partners/documents', label: 'Documents' },
]

export default async function TradePartnerLayout({ children }: { children: React.ReactNode }) {
  const session = await requireTradePartner()
  const [company] = await db
    .select({ legalName: companies.legalName })
    .from(companies)
    .where(eq(companies.id, session.companyId))
    .limit(1)

  const activePath = headers().get('x-pathname') ?? '/trade-partners/dashboard'

  return (
    <PortalShell
      nav={NAV}
      userLabel={company?.legalName ?? 'Your company'}
      userSub={session.email}
      activePath={activePath}
      signOutAction={signOut}
    >
      {children}
    </PortalShell>
  )
}
