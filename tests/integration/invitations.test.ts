import { beforeEach, describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'
import {
  acceptInvitation,
  createInvitation,
  expireStaleInvitations,
  lookupInvitation,
  resendInvitation,
  revokeInvitation,
} from '@/lib/portal/services/invitations'
import { hashToken } from '@/lib/portal/auth/tokens'
import * as schema from '@/lib/portal/db/schema'
import {
  hasDatabase,
  resetDatabase,
  seedUser,
  sessionFor,
  testDb,
} from './setup'

const describeDb = hasDatabase ? describe : describe.skip

describeDb('invitation lifecycle', () => {
  let adminSession: ReturnType<typeof sessionFor>

  beforeEach(async () => {
    await resetDatabase()
    const admin = await seedUser({ email: 'admin@hre-utah.com', role: 'ADMIN', name: 'Brian Hardy' })
    adminSession = sessionFor(admin)
  })

  /** Pulls the raw token back out of the invite URL the service returns. */
  const tokenFromUrl = (url: string) => url.split('/').pop()!

  it('creates a company, application, contact and invitation together', async () => {
    const result = await createInvitation({
      companyName: 'Wasatch Framing',
      contactName: 'Dan Reyes',
      contactEmail: 'Dan@WasatchFraming.com',
      primaryTrade: 'Framing',
      actor: adminSession,
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return

    const [company] = await testDb
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.id, result.companyId))
    expect(company.status).toBe('INVITED')
    expect(company.legalName).toBe('Wasatch Framing')

    const contacts = await testDb
      .select()
      .from(schema.contacts)
      .where(eq(schema.contacts.companyId, result.companyId))
    expect(contacts).toHaveLength(1)
    // The address is normalised to lowercase so sign-in cannot depend on casing.
    expect(contacts[0].email).toBe('dan@wasatchframing.com')

    const applications = await testDb
      .select()
      .from(schema.applications)
      .where(eq(schema.applications.companyId, result.companyId))
    expect(applications).toHaveLength(1)
  })

  it('stores only the hash of the token, never the token itself', async () => {
    const result = await createInvitation({
      companyName: 'Summit Electric',
      contactName: 'Ana Ruiz',
      contactEmail: 'ana@summit.test',
      primaryTrade: 'Electrical',
      actor: adminSession,
    })
    if (!result.ok) throw new Error('setup failed')

    const token = tokenFromUrl(result.inviteUrl)
    const [invitation] = await testDb.select().from(schema.invitations)

    expect(invitation.tokenHash).not.toBe(token)
    expect(invitation.tokenHash).toBe(hashToken(token))
  })

  it('records an audit event for the invitation', async () => {
    await createInvitation({
      companyName: 'Valley Plumbing',
      contactName: 'Jo Kim',
      contactEmail: 'jo@valley.test',
      primaryTrade: 'Plumbing',
      actor: adminSession,
    })

    const events = await testDb.select().from(schema.auditEvents)
    expect(events.some((e) => e.action === 'invitation.created')).toBe(true)
  })

  it('refuses a second invitation to an address that already has an account', async () => {
    await seedUser({ email: 'taken@example.com', role: 'TRADE_PARTNER' })
    const result = await createInvitation({
      companyName: 'Duplicate Co',
      contactName: 'Sam',
      contactEmail: 'taken@example.com',
      primaryTrade: 'Roofing',
      actor: adminSession,
    })
    expect(result.ok).toBe(false)
  })

  it('accepts a valid invitation and creates the account', async () => {
    const created = await createInvitation({
      companyName: 'Rocky Mountain Concrete',
      contactName: 'Pat Lee',
      contactEmail: 'pat@rmc.test',
      primaryTrade: 'Concrete / Flatwork',
      actor: adminSession,
    })
    if (!created.ok) throw new Error('setup failed')

    const accepted = await acceptInvitation({
      rawToken: tokenFromUrl(created.inviteUrl),
      name: 'Pat Lee',
      password: 'concrete crew 2026',
    })

    expect(accepted.ok).toBe(true)
    if (!accepted.ok) return

    const [user] = await testDb
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, accepted.userId))
    expect(user.role).toBe('TRADE_PARTNER')
    expect(user.companyId).toBe(created.companyId)
    // The password must never be recoverable from the row.
    expect(user.passwordHash).not.toContain('concrete crew 2026')

    const [company] = await testDb
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.id, created.companyId))
    expect(company.status).toBe('APPLICATION_STARTED')
  })

  it('cannot be used twice — the single-use guarantee', async () => {
    const created = await createInvitation({
      companyName: 'Single Use Co',
      contactName: 'Alex',
      contactEmail: 'alex@single.test',
      primaryTrade: 'Drywall',
      actor: adminSession,
    })
    if (!created.ok) throw new Error('setup failed')
    const token = tokenFromUrl(created.inviteUrl)

    const first = await acceptInvitation({ rawToken: token, name: 'Alex', password: 'drywall crew 2026' })
    expect(first.ok).toBe(true)

    const second = await acceptInvitation({ rawToken: token, name: 'Impostor', password: 'another password 12' })
    expect(second.ok).toBe(false)

    const users = await testDb.select().from(schema.users).where(eq(schema.users.role, 'TRADE_PARTNER'))
    expect(users).toHaveLength(1)
  })

  it('rejects an expired invitation', async () => {
    const created = await createInvitation({
      companyName: 'Expired Co',
      contactName: 'Kim',
      contactEmail: 'kim@expired.test',
      primaryTrade: 'Paint',
      actor: adminSession,
    })
    if (!created.ok) throw new Error('setup failed')
    const token = tokenFromUrl(created.inviteUrl)

    await testDb
      .update(schema.invitations)
      .set({ expiresAt: new Date(Date.now() - 86_400_000) })
      .where(eq(schema.invitations.id, created.invitationId))

    const lookup = await lookupInvitation(token)
    expect(lookup.ok).toBe(false)
    if (!lookup.ok) expect(lookup.reason).toBe('expired')

    const accepted = await acceptInvitation({ rawToken: token, name: 'Kim', password: 'paint crew 2026' })
    expect(accepted.ok).toBe(false)
  })

  it('rejects a revoked invitation, and its old link stops resolving', async () => {
    const created = await createInvitation({
      companyName: 'Revoked Co',
      contactName: 'Riley',
      contactEmail: 'riley@revoked.test',
      primaryTrade: 'Tile',
      actor: adminSession,
    })
    if (!created.ok) throw new Error('setup failed')
    const token = tokenFromUrl(created.inviteUrl)

    const revoked = await revokeInvitation(created.invitationId, adminSession)
    expect(revoked.ok).toBe(true)

    // Revocation replaces the stored hash, so the emailed link resolves to
    // nothing at all rather than to a revoked record.
    const lookup = await lookupInvitation(token)
    expect(lookup.ok).toBe(false)

    const accepted = await acceptInvitation({ rawToken: token, name: 'Riley', password: 'tile crew 2026' })
    expect(accepted.ok).toBe(false)
  })

  it('will not revoke an invitation that has already been accepted', async () => {
    const created = await createInvitation({
      companyName: 'Accepted Co',
      contactName: 'Morgan',
      contactEmail: 'morgan@accepted.test',
      primaryTrade: 'HVAC',
      actor: adminSession,
    })
    if (!created.ok) throw new Error('setup failed')

    await acceptInvitation({
      rawToken: tokenFromUrl(created.inviteUrl),
      name: 'Morgan',
      password: 'hvac crew 2026',
    })

    const revoked = await revokeInvitation(created.invitationId, adminSession)
    expect(revoked.ok).toBe(false)
  })

  it('invalidates the previous link when an invitation is resent', async () => {
    const created = await createInvitation({
      companyName: 'Resend Co',
      contactName: 'Casey',
      contactEmail: 'casey@resend.test',
      primaryTrade: 'Roofing',
      actor: adminSession,
    })
    if (!created.ok) throw new Error('setup failed')
    const oldToken = tokenFromUrl(created.inviteUrl)

    const resent = await resendInvitation(created.invitationId, adminSession)
    expect(resent.ok).toBe(true)
    if (!resent.ok) return

    expect((await lookupInvitation(oldToken)).ok).toBe(false)
    expect((await lookupInvitation(tokenFromUrl(resent.inviteUrl))).ok).toBe(true)
  })

  it('rejects a token that never existed', async () => {
    const lookup = await lookupInvitation('a'.repeat(43))
    expect(lookup.ok).toBe(false)
    if (!lookup.ok) expect(lookup.reason).toBe('not_found')
  })

  it('rejects an obviously too-short token without touching the database', async () => {
    const lookup = await lookupInvitation('abc')
    expect(lookup.ok).toBe(false)
  })

  it('marks only genuinely past-due invitations as expired', async () => {
    const stale = await createInvitation({
      companyName: 'Stale Co',
      contactName: 'Dana',
      contactEmail: 'dana@stale.test',
      primaryTrade: 'Framing',
      actor: adminSession,
    })
    const fresh = await createInvitation({
      companyName: 'Fresh Co',
      contactName: 'Eli',
      contactEmail: 'eli@fresh.test',
      primaryTrade: 'Framing',
      actor: adminSession,
    })
    if (!stale.ok || !fresh.ok) throw new Error('setup failed')

    await testDb
      .update(schema.invitations)
      .set({ expiresAt: new Date(Date.now() - 86_400_000) })
      .where(eq(schema.invitations.id, stale.invitationId))

    const count = await expireStaleInvitations()
    expect(count).toBe(1)

    const rows = await testDb.select().from(schema.invitations)
    expect(rows.find((r) => r.id === stale.invitationId)?.status).toBe('EXPIRED')
    expect(rows.find((r) => r.id === fresh.invitationId)?.status).toBe('PENDING')
  })

  it('refuses a password that does not meet the policy', async () => {
    const created = await createInvitation({
      companyName: 'Weak Password Co',
      contactName: 'Jamie',
      contactEmail: 'jamie@weak.test',
      primaryTrade: 'Framing',
      actor: adminSession,
    })
    if (!created.ok) throw new Error('setup failed')

    const accepted = await acceptInvitation({
      rawToken: tokenFromUrl(created.inviteUrl),
      name: 'Jamie',
      password: 'short',
    })
    expect(accepted.ok).toBe(false)

    // The invitation must remain usable after a rejected attempt.
    expect((await lookupInvitation(tokenFromUrl(created.inviteUrl))).ok).toBe(true)
  })
})
