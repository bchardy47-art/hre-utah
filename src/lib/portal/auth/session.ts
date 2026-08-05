/**
 * Server-side session management.
 *
 * Design: opaque, database-backed sessions rather than JWTs.
 *   - The cookie holds a random 256-bit token; the database holds its SHA-256.
 *   - Because state lives server-side, a session can be revoked instantly
 *     (suspension, password change, "sign out everywhere") — a signed JWT
 *     cannot be.
 *   - Every request that matters re-reads the user row, so a deactivated
 *     account or a role change takes effect on the very next request.
 *
 * The middleware in src/middleware.ts only checks for cookie *presence* to give
 * a fast redirect. It is a convenience, never the security boundary. Every
 * protected page and route handler calls a guard from ./guards.ts.
 */

import 'server-only'
import { cookies, headers } from 'next/headers'
import { and, eq, gt, isNull, lt, or } from 'drizzle-orm'
import { db } from '../db'
import { sessions, users } from '../db/schema'
import type { UserRoleValue } from '../db/schema'
import { SESSION_TTL_HOURS } from '../env'
import { generateSessionToken, hashToken } from './tokens'

export const SESSION_COOKIE = 'hh_tp_session'

export type PortalSession = {
  sessionId: string
  userId: string
  email: string
  name: string
  role: UserRoleValue
  companyId: string | null
  expiresAt: Date
}

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    expires,
  }
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

/** Issues a new session and sets the cookie. Call only from a Server Action or Route Handler. */
export async function createSession(userId: string): Promise<void> {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000)
  const { ipAddress, userAgent } = requestContext()

  await db.insert(sessions).values({
    tokenHash: hashToken(token),
    userId,
    expiresAt,
    ipAddress,
    userAgent,
  })

  cookies().set(SESSION_COOKIE, token, cookieOptions(expiresAt))
}

/**
 * Resolves the current session, or null. Returns null for expired, revoked, or
 * deactivated accounts — never throws, so it is safe in layouts.
 */
export async function getSession(): Promise<PortalSession | null> {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null

  const rows = await db
    .select({
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,
      userId: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      companyId: users.companyId,
      isActive: users.isActive,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.tokenHash, hashToken(token)),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1)

  const row = rows[0]
  if (!row || !row.isActive) return null

  return {
    sessionId: row.sessionId,
    userId: row.userId,
    email: row.email,
    name: row.name,
    role: row.role,
    companyId: row.companyId,
    expiresAt: row.expiresAt,
  }
}

/** Revokes the current session and clears the cookie. */
export async function destroySession(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (token) {
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.tokenHash, hashToken(token)))
  }
  cookies().delete(SESSION_COOKIE)
}

/** Revokes every session for a user — used on suspension and password change. */
export async function revokeAllSessionsForUser(userId: string): Promise<void> {
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)))
}

/** Housekeeping for the cron sweep: drop rows that can never authenticate again. */
export async function purgeDeadSessions(): Promise<number> {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const deleted = await db
    .delete(sessions)
    .where(or(lt(sessions.expiresAt, cutoff), lt(sessions.revokedAt, cutoff)))
    .returning({ id: sessions.id })
  return deleted.length
}

export async function touchSession(sessionId: string): Promise<void> {
  await db.update(sessions).set({ lastSeenAt: new Date() }).where(eq(sessions.id, sessionId))
}
