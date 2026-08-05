/**
 * Authorization guards.
 *
 * Every protected page, Server Action, and Route Handler starts with one of
 * these. They are the security boundary — middleware is not, and Firestore
 * Security Rules are defence in depth beneath them rather than a substitute.
 *
 * Record-level rule: a trade partner may only ever reach rows whose companyId
 * equals the companyId on their own portal user document. `assertCompanyAccess`
 * is the single place that decision is made, so an IDOR would have to be an
 * omitted guard rather than a subtle slip inside one.
 *
 * Company *status* is checked separately from membership: a suspended company's
 * user is still a member, but must not get normal portal access.
 */

import 'server-only'
import { redirect } from 'next/navigation'
import { adminDb } from '../firebase/admin'
import { COLLECTIONS, type CompanyStatusValue } from '../firebase/types'
import { getSession, type PortalSession } from './firebase-session'

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

/** Companies in these states cannot use the portal normally. */
export const BLOCKED_COMPANY_STATUSES: CompanyStatusValue[] = ['SUSPENDED', 'DO_NOT_USE']

export async function requireSession(returnTo?: string): Promise<PortalSession> {
  const session = await getSession()
  if (!session) {
    redirect(returnTo ? `${LOGIN_PATH}?next=${encodeURIComponent(returnTo)}` : LOGIN_PATH)
  }
  return session
}

export async function requireAdmin(returnTo?: string): Promise<PortalSession> {
  const session = await requireSession(returnTo)
  if (session.role !== 'ADMIN') {
    // Deliberately not a 403 page: a trade partner who guesses an admin URL is
    // sent to their own dashboard with no confirmation the route exists.
    redirect('/trade-partners/dashboard')
  }
  return session
}

export async function requireTradePartner(
  returnTo?: string,
): Promise<PortalSession & { companyId: string }> {
  const session = await requireSession(returnTo)
  if (session.role !== 'TRADE_PARTNER' || !session.companyId) {
    redirect('/admin/trade-partners')
  }

  const status = await getCompanyStatus(session.companyId)
  if (status && BLOCKED_COMPANY_STATUSES.includes(status)) {
    redirect('/trade-partners/account-unavailable')
  }

  return session as PortalSession & { companyId: string }
}

/**
 * The single record-level authorization decision in the portal.
 *
 * Both sides must be non-empty before they are compared, so a blank id can never
 * act as a wildcard.
 */
export function assertCompanyAccess(session: PortalSession, companyId: string): void {
  if (session.role === 'ADMIN') return

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

export async function getCompanyStatus(companyId: string): Promise<CompanyStatusValue | null> {
  const snap = await adminDb().collection(COLLECTIONS.companies).doc(companyId).get()
  if (!snap.exists) return null
  return (snap.data()?.status as CompanyStatusValue) ?? null
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

/**
 * Full check for an authenticated operation on a company: membership AND that
 * the company is not suspended. Administrators bypass the status check because
 * they must still be able to administer a suspended company.
 */
export async function requireCompanyAccessApi(companyId: string): Promise<PortalSession> {
  const session = await requireSessionApi()
  assertCompanyAccess(session, companyId)

  if (session.role !== 'ADMIN') {
    const status = await getCompanyStatus(companyId)
    if (status && BLOCKED_COMPANY_STATUSES.includes(status)) {
      throw new PortalAuthError('This account is not active.', 403)
    }
  }

  return session
}

export function isAdmin(session: PortalSession | null): boolean {
  return session?.role === 'ADMIN'
}
