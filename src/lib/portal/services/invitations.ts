/**
 * Invitation lifecycle.
 *
 * There is no public registration anywhere in the portal — an account can only
 * come into existence by consuming a valid invitation created by an
 * administrator.
 *
 * Token handling:
 *   - 256 bits of CSPRNG entropy, emailed once.
 *   - Only the SHA-256 hash is stored, so the database cannot mint a working link.
 *   - Single use: accepting sets status ACCEPTED, and every lookup requires
 *     status PENDING, so a used link is dead even before it expires.
 *   - Revocation and expiry are both checked server-side on every lookup.
 */

import 'server-only'
import { and, eq, lt } from 'drizzle-orm'
import { db } from '../db'
import {
  applications,
  companies,
  contacts,
  invitations,
  statusHistory,
  users,
  type Invitation,
} from '../db/schema'
import { INVITATION_TTL_DAYS, serverEnv } from '../env'
import { generateInvitationToken, hashToken } from '../auth/tokens'
import { hashPassword, validatePassword } from '../auth/password'
import { AUDIT, recordAudit } from '../audit'
import type { PortalSession } from '../auth/session'
import { sendPortalEmail } from '../email/mailer'
import { NOTIFICATION_TYPES } from '../email/templates'

export type CreateInvitationInput = {
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  primaryTrade: string
  message?: string
  actor: PortalSession
}

export type CreateInvitationResult =
  | { ok: true; companyId: string; invitationId: string; inviteUrl: string }
  | { ok: false; error: string }

export function invitationUrl(token: string): string {
  return `${serverEnv.appUrl}/trade-partners/apply/${token}`
}

function expiryDate(): Date {
  return new Date(Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000)
}

export async function createInvitation(
  input: CreateInvitationInput,
): Promise<CreateInvitationResult> {
  const email = input.contactEmail.trim().toLowerCase()

  const [existingUser] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
  if (existingUser) {
    return { ok: false, error: 'An account already exists for that email address.' }
  }

  const token = generateInvitationToken()

  const created = await db.transaction(async (tx) => {
    const [company] = await tx
      .insert(companies)
      .values({
        legalName: input.companyName.trim(),
        primaryTrade: input.primaryTrade,
        generalEmail: email,
        mainPhone: input.contactPhone?.trim() || null,
        status: 'INVITED',
      })
      .returning({ id: companies.id })

    await tx.insert(applications).values({ companyId: company.id, status: 'NOT_STARTED' })

    await tx.insert(contacts).values({
      companyId: company.id,
      role: 'PRIMARY',
      name: input.contactName.trim(),
      email,
      phone: input.contactPhone?.trim() || null,
    })

    await tx.insert(statusHistory).values({
      companyId: company.id,
      toStatus: 'INVITED',
      reason: 'Invitation created.',
      changedById: input.actor.userId,
    })

    const [invitation] = await tx
      .insert(invitations)
      .values({
        companyId: company.id,
        email,
        contactName: input.contactName.trim(),
        contactPhone: input.contactPhone?.trim() || null,
        tokenHash: hashToken(token),
        message: input.message?.trim() || null,
        expiresAt: expiryDate(),
        createdById: input.actor.userId,
      })
      .returning({ id: invitations.id })

    return { companyId: company.id, invitationId: invitation.id }
  })

  await recordAudit({
    action: AUDIT.INVITATION_CREATED,
    summary: `Invited ${input.companyName} (${input.contactName})`,
    companyId: created.companyId,
    actor: input.actor,
    targetType: 'invitation',
    targetId: created.invitationId,
    metadata: { trade: input.primaryTrade },
  })

  const url = invitationUrl(token)
  await sendPortalEmail({
    type: NOTIFICATION_TYPES.INVITATION_SENT,
    to: email,
    companyId: created.companyId,
    dedupeKey: `invite:${created.invitationId}:1`,
    data: {
      companyName: input.companyName,
      contactName: input.contactName,
      portalUrl: `${serverEnv.appUrl}/trade-partners/login`,
      inviteUrl: url,
      expiresOn: expiryDate().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      adminMessage: input.message?.trim() || undefined,
    },
  })

  return { ok: true, ...created, inviteUrl: url }
}

/**
 * Issues a new token for an existing invitation. The previous token stops
 * working immediately because only one hash is stored per invitation.
 */
export async function resendInvitation(
  invitationId: string,
  actor: PortalSession,
): Promise<{ ok: true; inviteUrl: string } | { ok: false; error: string }> {
  const [invitation] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.id, invitationId))
    .limit(1)
  if (!invitation) return { ok: false, error: 'Invitation not found.' }
  if (invitation.status === 'ACCEPTED') {
    return { ok: false, error: 'That invitation has already been accepted.' }
  }
  if (invitation.status === 'REVOKED') {
    return { ok: false, error: 'That invitation was revoked. Create a new one instead.' }
  }

  const token = generateInvitationToken()
  const expiresAt = expiryDate()

  await db
    .update(invitations)
    .set({
      tokenHash: hashToken(token),
      expiresAt,
      lastSentAt: new Date(),
      resendCount: invitation.resendCount + 1,
      status: 'PENDING',
      openedAt: null,
    })
    .where(eq(invitations.id, invitationId))

  const [company] = await db
    .select({ legalName: companies.legalName })
    .from(companies)
    .where(eq(companies.id, invitation.companyId))
    .limit(1)

  await recordAudit({
    action: AUDIT.INVITATION_RESENT,
    summary: `Resent invitation to ${invitation.email}`,
    companyId: invitation.companyId,
    actor,
    targetType: 'invitation',
    targetId: invitationId,
  })

  const url = invitationUrl(token)
  await sendPortalEmail({
    type: NOTIFICATION_TYPES.INVITATION_RESENT,
    to: invitation.email,
    companyId: invitation.companyId,
    dedupeKey: `invite:${invitationId}:${invitation.resendCount + 2}`,
    data: {
      companyName: company?.legalName ?? 'your company',
      contactName: invitation.contactName,
      portalUrl: `${serverEnv.appUrl}/trade-partners/login`,
      inviteUrl: url,
      expiresOn: expiresAt.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    },
  })

  return { ok: true, inviteUrl: url }
}

export async function revokeInvitation(
  invitationId: string,
  actor: PortalSession,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const [invitation] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.id, invitationId))
    .limit(1)
  if (!invitation) return { ok: false, error: 'Invitation not found.' }
  if (invitation.status === 'ACCEPTED') {
    return { ok: false, error: 'That invitation has already been accepted and cannot be revoked.' }
  }

  await db
    .update(invitations)
    .set({
      status: 'REVOKED',
      revokedAt: new Date(),
      revokedById: actor.userId,
      // Replacing the hash makes the emailed link unusable even if the status
      // check were somehow bypassed.
      tokenHash: hashToken(generateInvitationToken()),
    })
    .where(eq(invitations.id, invitationId))

  await recordAudit({
    action: AUDIT.INVITATION_REVOKED,
    summary: `Revoked invitation for ${invitation.email}`,
    companyId: invitation.companyId,
    actor,
    targetType: 'invitation',
    targetId: invitationId,
  })

  return { ok: true }
}

export type InvitationLookup =
  | { ok: true; invitation: Invitation; companyName: string }
  | { ok: false; reason: 'not_found' | 'expired' | 'revoked' | 'accepted' }

/**
 * Resolves a raw token. Every failure mode returns a distinct reason for the UI,
 * but the messages shown to the visitor are deliberately non-specific about
 * whether a token ever existed.
 */
export async function lookupInvitation(rawToken: string): Promise<InvitationLookup> {
  if (!rawToken || rawToken.length < 20) return { ok: false, reason: 'not_found' }

  const [row] = await db
    .select({ invitation: invitations, companyName: companies.legalName })
    .from(invitations)
    .innerJoin(companies, eq(companies.id, invitations.companyId))
    .where(eq(invitations.tokenHash, hashToken(rawToken)))
    .limit(1)

  if (!row) return { ok: false, reason: 'not_found' }
  const { invitation } = row

  if (invitation.status === 'REVOKED') return { ok: false, reason: 'revoked' }
  if (invitation.status === 'ACCEPTED') return { ok: false, reason: 'accepted' }
  if (invitation.expiresAt.getTime() < Date.now()) {
    if (invitation.status !== 'EXPIRED') {
      await db.update(invitations).set({ status: 'EXPIRED' }).where(eq(invitations.id, invitation.id))
    }
    return { ok: false, reason: 'expired' }
  }

  return { ok: true, invitation, companyName: row.companyName }
}

export async function markInvitationOpened(invitationId: string): Promise<void> {
  await db
    .update(invitations)
    .set({ openedAt: new Date() })
    .where(and(eq(invitations.id, invitationId), eq(invitations.status, 'PENDING')))
}

export type AcceptInvitationResult =
  | { ok: true; userId: string; companyId: string }
  | { ok: false; error: string }

/**
 * Consumes an invitation and creates the trade partner account.
 *
 * The status check and the update happen in one transaction with a
 * `status = 'PENDING'` predicate on the write, so two simultaneous submissions
 * of the same link cannot both create an account.
 */
export async function acceptInvitation(args: {
  rawToken: string
  name: string
  password: string
  phone?: string
}): Promise<AcceptInvitationResult> {
  const problems = validatePassword(args.password)
  if (problems.length > 0) return { ok: false, error: problems.join(' ') }

  const lookup = await lookupInvitation(args.rawToken)
  if (!lookup.ok) {
    return {
      ok: false,
      error:
        lookup.reason === 'expired'
          ? 'That invitation link has expired. Ask Hardy Homes to send a new one.'
          : lookup.reason === 'accepted'
            ? 'That invitation has already been used. Sign in instead.'
            : 'That invitation link is not valid.',
    }
  }

  const { invitation } = lookup
  const passwordHash = await hashPassword(args.password)

  try {
    const result = await db.transaction(async (tx) => {
      const claimed = await tx
        .update(invitations)
        .set({ status: 'ACCEPTED', acceptedAt: new Date() })
        .where(and(eq(invitations.id, invitation.id), eq(invitations.status, 'PENDING')))
        .returning({ id: invitations.id })

      if (claimed.length === 0) throw new Error('ALREADY_ACCEPTED')

      const [user] = await tx
        .insert(users)
        .values({
          email: invitation.email,
          passwordHash,
          role: 'TRADE_PARTNER',
          name: args.name.trim(),
          phone: args.phone?.trim() || null,
          companyId: invitation.companyId,
        })
        .returning({ id: users.id })

      await tx
        .update(companies)
        .set({ status: 'APPLICATION_STARTED', updatedAt: new Date() })
        .where(eq(companies.id, invitation.companyId))

      await tx.insert(statusHistory).values({
        companyId: invitation.companyId,
        fromStatus: 'INVITED',
        toStatus: 'APPLICATION_STARTED',
        reason: 'Trade partner accepted the invitation and created an account.',
        isSystemGenerated: true,
      })

      return { userId: user.id, companyId: invitation.companyId }
    })

    await recordAudit({
      action: AUDIT.INVITATION_ACCEPTED,
      summary: `${args.name} created a trade partner account`,
      companyId: invitation.companyId,
      targetType: 'invitation',
      targetId: invitation.id,
      actorLabel: `${args.name} <${invitation.email}>`,
    })

    return { ok: true, ...result }
  } catch (error) {
    if (error instanceof Error && error.message === 'ALREADY_ACCEPTED') {
      return { ok: false, error: 'That invitation has already been used. Sign in instead.' }
    }
    console.error('[portal:invitations] accept failed', error)
    return { ok: false, error: 'Something went wrong creating the account. Please try again.' }
  }
}

/** Flags every past-due PENDING invitation. Called by the nightly sweep. */
export async function expireStaleInvitations(now = new Date()): Promise<number> {
  const rows = await db
    .update(invitations)
    .set({ status: 'EXPIRED' })
    .where(and(eq(invitations.status, 'PENDING'), lt(invitations.expiresAt, now)))
    .returning({ id: invitations.id })
  return rows.length
}
