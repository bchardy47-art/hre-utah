/**
 * Authorization guards.
 *
 * Every protected page, Server Action, and Route Handler in the portal starts
 * with one of these. They are the security boundary — middleware is not.
 *
 * Record-level rule: a trade partner may only ever reach rows whose
 * `companyId` equals the `companyId` on their own user row. `requireCompanyAccess`
 * is the single place that decision is made, so an IDOR would have to be an
 * omission of the guard rather than a subtle logic slip inside it.
 */

import 'server-only'
import { redirect } from 'next/navigation'
import { getSession, type PortalSession } from './session'

export class PortalAuthError extends Error {
  constructor(
    message: string,
    readonly statusCode: 401 | 403 | 404,
  ) {
    super(message)
    this.name = 'PortalAuthError'
  }
}

export const LOGIN_PATH = '/trade-partners/login'

/** For pages: redirects to login. */
export async function requireSession(returnTo?: string): Promise<PortalSession> {
  const session = await getSession()
  if (!session) {
    const target = returnTo ? `${LOGIN_PATH}?next=${encodeURIComponent(returnTo)}` : LOGIN_PATH
    redirect(target)
  }
  return session
}

export async function requireAdmin(returnTo?: string): Promise<PortalSession> {
  const session = await requireSession(returnTo)
  if (session.role !== 'ADMIN') {
    // Deliberately not a 403 page: a trade partner who guesses an admin URL is
    // sent back to their own dashboard with no confirmation the route exists.
    redirect('/trade-partners/dashboard')
  }
  return session
}

export async function requireTradePartner(returnTo?: string): Promise<
  PortalSession & { companyId: string }
> {
  const session = await requireSession(returnTo)
  if (session.role !== 'TRADE_PARTNER' || !session.companyId) {
    redirect('/admin/trade-partners')
  }
  return session as PortalSession & { companyId: string }
}

/**
 * The single record-level authorization decision in the portal.
 *
 * Administrators may reach any company. A trade partner may reach exactly one.
 * Anything else throws — callers must not "fall through" to a default.
 */
export function assertCompanyAccess(session: PortalSession, companyId: string): void {
  if (session.role === 'ADMIN') return

  // Both sides must be non-empty before they are compared. Without this, an
  // empty target id and a trade partner whose companyId is somehow blank would
  // satisfy `'' === ''` and authorize the request.
  if (
    session.role === 'TRADE_PARTNER' &&
    Boolean(session.companyId) &&
    Boolean(companyId) &&
    session.companyId === companyId
  ) {
    return
  }

  throw new PortalAuthError('Not authorized for this company record.', 403)
}

export function canAccessCompany(session: PortalSession | null, companyId: string): boolean {
  if (!session) return false
  if (session.role === 'ADMIN') return true
  return (
    session.role === 'TRADE_PARTNER' &&
    Boolean(session.companyId) &&
    Boolean(companyId) &&
    session.companyId === companyId
  )
}

// --- API variants: throw instead of redirecting -----------------------------

export async function requireSessionApi(): Promise<PortalSession> {
  const session = await getSession()
  if (!session) throw new PortalAuthError('Authentication required.', 401)
  return session
}

export async function requireAdminApi(): Promise<PortalSession> {
  const session = await requireSessionApi()
  if (session.role !== 'ADMIN') throw new PortalAuthError('Administrator access required.', 403)
  return session
}

export function isAdmin(session: PortalSession | null): boolean {
  return session?.role === 'ADMIN'
}
