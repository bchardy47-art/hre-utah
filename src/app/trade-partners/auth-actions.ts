'use server'

import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { db } from '@/lib/portal/db'
import { users } from '@/lib/portal/db/schema'
import { verifyPassword } from '@/lib/portal/auth/password'
import { createSession, destroySession, getSession, requestContext } from '@/lib/portal/auth/session'
import { AUDIT, recordAudit } from '@/lib/portal/audit'
import { clearRateLimit, LIMITS, peekRateLimit, rateLimit, recordFailure } from '@/lib/portal/rate-limit'
import { acceptInvitationSchema, formText, formValue, loginSchema, toFieldErrors, type ActionState } from '@/lib/portal/validation'
import { acceptInvitation } from '@/lib/portal/services/invitations'

/**
 * Account lockout policy.
 *
 * The per-IP limiter in rate-limit.ts is best-effort across serverless
 * instances, so the durable protection lives here in the database: five failed
 * attempts locks the account for fifteen minutes, and the counter resets on a
 * successful sign-in.
 */
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

/** Deliberately identical for "no such user" and "wrong password". */
const GENERIC_LOGIN_ERROR = 'That email address and password combination was not recognised.'

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formValue(formData, 'email'),
    password: formValue(formData, 'password'),
    next: formValue(formData, 'next'),
  })
  if (!parsed.success) {
    return { ok: false, errors: toFieldErrors(parsed.error) }
  }

  const { ipAddress } = requestContext()
  const limitKey = `login:${ipAddress ?? 'unknown'}`

  // Checked without consuming. Only FAILED attempts spend the budget (see
  // recordFailure below) — otherwise several people signing in legitimately from
  // one office IP or behind CGNAT would lock each other out.
  const limit = peekRateLimit(limitKey, LIMITS.login.limit)
  if (!limit.allowed) {
    return {
      ok: false,
      message: `Too many failed sign-in attempts from this network. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
    }
  }

  const { email, password } = parsed.data
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (!user || !user.isActive) {
    // Spend comparable time even when the account does not exist, so response
    // timing does not reveal which addresses are registered.
    await verifyPassword(password, '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin')
    recordFailure(limitKey, LIMITS.login.windowSeconds)
    await recordAudit({
      action: AUDIT.LOGIN_FAILED,
      summary: `Failed sign-in for ${email}`,
      metadata: { reason: user ? 'inactive' : 'unknown_account' },
    })
    return { ok: false, message: GENERIC_LOGIN_ERROR }
  }

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000)
    return {
      ok: false,
      message: `This account is temporarily locked after several failed attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
    }
  }

  const valid = await verifyPassword(password, user.passwordHash)

  if (!valid) {
    recordFailure(limitKey, LIMITS.login.windowSeconds)
    const failed = user.failedLoginCount + 1
    const lock = failed >= MAX_FAILED_ATTEMPTS
    await db
      .update(users)
      .set({
        failedLoginCount: failed,
        lockedUntil: lock ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000) : null,
      })
      .where(eq(users.id, user.id))

    await recordAudit({
      action: lock ? AUDIT.ACCOUNT_LOCKED : AUDIT.LOGIN_FAILED,
      summary: lock
        ? `Account locked after ${failed} failed attempts: ${email}`
        : `Failed sign-in for ${email} (attempt ${failed})`,
      companyId: user.companyId,
    })

    return { ok: false, message: GENERIC_LOGIN_ERROR }
  }

  // A successful sign-in clears the network's failure budget, so one person
  // fumbling their password cannot degrade sign-in for everyone else sharing
  // the address.
  clearRateLimit(limitKey)

  await db
    .update(users)
    .set({ failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() })
    .where(eq(users.id, user.id))

  await createSession(user.id)

  await recordAudit({
    action: AUDIT.LOGIN_SUCCEEDED,
    summary: `${user.name} signed in`,
    companyId: user.companyId,
    actor: {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })

  // Only same-origin relative paths are honoured, so `next` cannot be used as an
  // open redirect.
  const next = parsed.data.next
  const safeNext = next && /^\/(admin|trade-partners)\//.test(next) ? next : null
  redirect(safeNext ?? (user.role === 'ADMIN' ? '/admin/trade-partners' : '/trade-partners/dashboard'))
}

export async function signOutAction(): Promise<void> {
  const session = await getSession()
  if (session) {
    await recordAudit({
      action: AUDIT.LOGOUT,
      summary: `${session.name} signed out`,
      companyId: session.companyId,
      actor: session,
    })
  }
  await destroySession()
  redirect('/trade-partners/signed-out')
}

export async function acceptInvitationAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = acceptInvitationSchema.safeParse({
    token: formValue(formData, 'token'),
    name: formValue(formData, 'name'),
    phone: formValue(formData, 'phone'),
    password: formValue(formData, 'password'),
    confirmPassword: formValue(formData, 'confirmPassword'),
  })
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) }

  const { ipAddress } = requestContext()
  const limit = rateLimit(
    `activate:${ipAddress ?? 'unknown'}`,
    LIMITS.activation.limit,
    LIMITS.activation.windowSeconds,
  )
  if (!limit.allowed) {
    return { ok: false, message: 'Too many attempts. Please try again later.' }
  }

  const result = await acceptInvitation({
    rawToken: parsed.data.token,
    name: parsed.data.name,
    password: parsed.data.password,
    phone: parsed.data.phone,
  })

  if (!result.ok) return { ok: false, message: result.error }

  await createSession(result.userId)
  redirect('/trade-partners/dashboard')
}

/** Used by the layout sign-out form. Kept separate so it takes no arguments. */
export async function signOut(): Promise<void> {
  await signOutAction()
}

export async function assertActiveCompanyUser(companyId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.companyId, companyId), eq(users.isActive, true)))
    .limit(1)
  return Boolean(row)
}
