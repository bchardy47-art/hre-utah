/**
 * Server-side session handling on Firebase Authentication.
 *
 * Shape of the flow:
 *   1. The browser signs in with the Web SDK and gets a short-lived ID token.
 *   2. It POSTs that token once to /api/portal/auth/session.
 *   3. The server verifies it and exchanges it for a Firebase **session cookie**,
 *      set httpOnly. The ID token never persists in the browser.
 *   4. Every protected request verifies that cookie server-side.
 *
 * Why a session cookie rather than holding the ID token client-side: an httpOnly
 * cookie is not readable by script, it is sent automatically to Server Actions
 * and Route Handlers, and — critically — it can be revoked. `verifySessionCookie`
 * is called with `checkRevoked: true`, so revoking a user's refresh tokens kills
 * their access on the very next request. That is what makes suspension immediate.
 *
 * Company membership is NOT read from custom claims. Claims are minted into a
 * token and go stale; a company that was suspended thirty seconds ago must not
 * still be authorised because the token has not refreshed. Membership and status
 * are read from Firestore on every protected operation.
 */

import 'server-only'
import { cookies, headers } from 'next/headers'
import { FieldValue } from 'firebase-admin/firestore'
import { adminAuth, adminDb } from '../firebase/admin'
import { COLLECTIONS, type PortalUser, type UserRoleValue } from '../firebase/types'

export const SESSION_COOKIE = 'hh_tp_session'

/** Firebase caps session cookies at 14 days; the portal is deliberately shorter. */
const SESSION_TTL_MS = Number(process.env.PORTAL_SESSION_TTL_HOURS ?? 12) * 60 * 60 * 1000

export type PortalSession = {
  userId: string
  uid: string
  email: string
  name: string
  role: UserRoleValue
  companyId: string | null
  emailVerified: boolean
  expiresAt: Date
}

export function requestContext(): { ipAddress: string | null; userAgent: string | null } {
  try {
    const h = headers()
    const forwarded = h.get('x-forwarded-for')
    return {
      ipAddress: forwarded ? forwarded.split(',')[0].trim() : h.get('x-real-ip'),
      userAgent: h.get('user-agent'),
    }
  } catch {
    return { ipAddress: null, userAgent: null }
  }
}

/**
 * Exchanges a freshly minted ID token for an httpOnly session cookie.
 * Only call from a Route Handler or Server Action.
 */
export async function createSessionFromIdToken(
  idToken: string,
): Promise<{ ok: true; session: PortalSession } | { ok: false; error: string }> {
  let decoded
  try {
    decoded = await adminAuth().verifyIdToken(idToken, true)
  } catch {
    return { ok: false, error: 'That sign-in could not be verified. Please try again.' }
  }

  // Refuse to mint a session for a token that is not fresh. Limits the window in
  // which a stolen ID token is useful.
  const ageMs = Date.now() - decoded.auth_time * 1000
  if (ageMs > 5 * 60 * 1000) {
    return { ok: false, error: 'That sign-in has expired. Please sign in again.' }
  }

  const profile = await getPortalUser(decoded.uid)
  if (!profile) {
    return { ok: false, error: 'No portal account is linked to that sign-in.' }
  }
  if (!profile.isActive) {
    return { ok: false, error: 'This account is not active. Please contact Hardy Homes.' }
  }

  const cookie = await adminAuth().createSessionCookie(idToken, { expiresIn: SESSION_TTL_MS })
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  cookies().set(SESSION_COOKIE, cookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })

  await adminDb()
    .collection(COLLECTIONS.users)
    .doc(profile.id)
    .set(
      { lastLoginAt: FieldValue.serverTimestamp(), emailVerified: decoded.email_verified ?? false },
      { merge: true },
    )

  return {
    ok: true,
    session: {
      userId: profile.id,
      uid: profile.uid,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      companyId: profile.companyId,
      emailVerified: Boolean(decoded.email_verified),
      expiresAt,
    },
  }
}

/**
 * Resolves the current session, or null. Never throws, so it is safe in layouts.
 *
 * Two independent things must hold: the cookie must verify (and not be revoked),
 * and the Firestore profile must still be active. A deactivated account is
 * rejected on the very next request even if its cookie is cryptographically fine.
 */
export async function getSession(): Promise<PortalSession | null> {
  const cookie = cookies().get(SESSION_COOKIE)?.value
  if (!cookie) return null

  try {
    const decoded = await adminAuth().verifySessionCookie(cookie, true)
    const profile = await getPortalUser(decoded.uid)
    if (!profile || !profile.isActive) return null

    return {
      userId: profile.id,
      uid: profile.uid,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      companyId: profile.companyId,
      emailVerified: Boolean(decoded.email_verified),
      expiresAt: new Date(decoded.exp * 1000),
    }
  } catch {
    // Expired, revoked, or forged — all indistinguishable to the caller.
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookie = cookies().get(SESSION_COOKIE)?.value
  if (cookie) {
    try {
      const decoded = await adminAuth().verifySessionCookie(cookie, false)
      // Revoke refresh tokens so the session cannot be resurrected anywhere.
      await adminAuth().revokeRefreshTokens(decoded.sub)
    } catch {
      // Already invalid. Clearing the cookie is still correct.
    }
  }
  cookies().delete(SESSION_COOKIE)
}

/**
 * Terminates every session for a user. Used when a company is suspended or
 * marked Do Not Use — access must stop immediately, not at cookie expiry.
 */
export async function revokeAllSessionsForUser(uid: string): Promise<void> {
  try {
    await adminAuth().revokeRefreshTokens(uid)
  } catch (error) {
    console.error('[portal:auth] could not revoke sessions', {
      error: error instanceof Error ? error.message : 'unknown',
    })
  }
}

export async function getPortalUser(uid: string): Promise<PortalUser | null> {
  const snap = await adminDb().collection(COLLECTIONS.users).doc(uid).get()
  if (!snap.exists) return null
  return toPortalUser(snap.id, snap.data() as Record<string, unknown>)
}

export async function getPortalUserByEmail(email: string): Promise<PortalUser | null> {
  const query = await adminDb()
    .collection(COLLECTIONS.users)
    .where('email', '==', email.trim().toLowerCase())
    .limit(1)
    .get()
  const doc = query.docs[0]
  if (!doc) return null
  return toPortalUser(doc.id, doc.data() as Record<string, unknown>)
}

export async function listCompanyUsers(companyId: string): Promise<PortalUser[]> {
  const query = await adminDb()
    .collection(COLLECTIONS.users)
    .where('companyId', '==', companyId)
    .get()
  return query.docs.map((d) => toPortalUser(d.id, d.data() as Record<string, unknown>))
}

/**
 * Coarse role hint only. Authorization still reads Firestore — this exists so
 * Security Rules can cheaply distinguish an administrator without a document
 * read on every rule evaluation.
 */
export async function setRoleClaim(uid: string, role: UserRoleValue): Promise<void> {
  await adminAuth().setCustomUserClaims(uid, { portalRole: role })
}

function toDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate()
  }
  return null
}

function toPortalUser(id: string, data: Record<string, unknown>): PortalUser {
  return {
    id,
    uid: (data.uid as string) ?? id,
    email: (data.email as string) ?? '',
    name: (data.name as string) ?? '',
    phone: (data.phone as string) ?? null,
    role: (data.role as UserRoleValue) ?? 'TRADE_PARTNER',
    companyId: (data.companyId as string) ?? null,
    isActive: data.isActive !== false,
    emailVerified: Boolean(data.emailVerified),
    lastLoginAt: toDate(data.lastLoginAt),
    createdAt: toDate(data.createdAt) ?? new Date(0),
    updatedAt: toDate(data.updatedAt) ?? new Date(0),
  }
}
