import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { requireAdmin } from '@/lib/portal/auth/guards'
import { PORTAL_NAME } from '@/lib/portal/constants'
import { PortalShell } from '@/components/portal/ui'
import { signOut } from '../trade-partners/auth-actions'

export const metadata: Metadata = {
  title: `Administration — ${PORTAL_NAME}`,
  robots: { index: false, follow: false },
}

/**
 * `requireAdmin` runs server-side on every request under /admin. A trade partner
 * who guesses one of these URLs is redirected to their own dashboard without any
 * confirmation that the route exists.
 */
export const dynamic = 'force-dynamic'

const NAV = [
  { href: '/admin/trade-partners', label: 'Trade Partners' },
  { href: '/admin/trade-partners/compliance', label: 'Compliance Queue' },
  { href: '/admin/trade-partners/new', label: 'Invite' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin()
  const activePath = headers().get('x-pathname') ?? '/admin/trade-partners'

  return (
    <PortalShell
      nav={NAV}
      userLabel={session.name}
      userSub="Administrator"
      activePath={activePath}
      signOutAction={signOut}
    >
      {children}
    </PortalShell>
  )
}
