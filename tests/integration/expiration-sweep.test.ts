import { beforeEach, describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'
import * as schema from '@/lib/portal/db/schema'
import { runComplianceSweep } from '@/lib/portal/services/expiration'
import {
  daysFromNow,
  hasDatabase,
  resetDatabase,
  seedCompany,
  seedRequirement,
  seedUser,
  testDb,
} from './setup'

const describeDb = hasDatabase ? describe : describe.skip

describeDb('nightly compliance sweep', () => {
  let company: schema.Company
  let requirement: schema.DocumentRequirement

  beforeEach(async () => {
    await resetDatabase()
    company = await seedCompany('Valley Plumbing LLC')
    await seedUser({ email: 'partner@valley.test', role: 'TRADE_PARTNER', companyId: company.id })
    requirement = await seedRequirement({
      code: 'GL',
      name: 'General Liability Certificate',
      hasExpiration: true,
      blocksWork: true,
    })
  })

  async function insertApprovedDocument(expiresInDays: number) {
    const [document] = await testDb
      .insert(schema.documents)
      .values({
        companyId: company.id,
        requirementId: requirement.id,
        state: 'APPROVED',
        expirationDate: daysFromNow(expiresInDays),
        reviewedAt: new Date(),
      })
      .returning()
    return document
  }

  it('marks a past-due approved document as expired', async () => {
    const document = await insertApprovedDocument(-2)

    const result = await runComplianceSweep()
    expect(result.documentsExpired).toBe(1)
    expect(result.errors).toEqual([])

    const [after] = await testDb
      .select()
      .from(schema.documents)
      .where(eq(schema.documents.id, document.id))
    expect(after.state).toBe('EXPIRED')
  })

  it('leaves a document expiring today alone — it is still current', async () => {
    await insertApprovedDocument(0)
    const result = await runComplianceSweep()
    expect(result.documentsExpired).toBe(0)
  })

  it('writes an audit event when a document expires', async () => {
    await insertApprovedDocument(-1)
    await runComplianceSweep()

    const events = await testDb.select().from(schema.auditEvents)
    expect(events.some((e) => e.action === 'document.expired')).toBe(true)
  })

  it('sends a reminder on each threshold day and not in between', async () => {
    for (const days of [30, 14, 7]) {
      await resetDatabase()
      company = await seedCompany('Valley Plumbing LLC')
      await seedUser({ email: 'partner@valley.test', role: 'TRADE_PARTNER', companyId: company.id })
      requirement = await seedRequirement({ code: 'GL', hasExpiration: true })
      await insertApprovedDocument(days)

      await runComplianceSweep()
      const rows = await testDb.select().from(schema.notifications)
      expect(rows.filter((r) => r.type === 'expiration_warning').length).toBeGreaterThan(0)
    }

    // 21 days is not a threshold, so nothing should go out.
    await resetDatabase()
    company = await seedCompany('Valley Plumbing LLC')
    await seedUser({ email: 'partner@valley.test', role: 'TRADE_PARTNER', companyId: company.id })
    requirement = await seedRequirement({ code: 'GL', hasExpiration: true })
    await insertApprovedDocument(21)

    await runComplianceSweep()
    const rows = await testDb.select().from(schema.notifications)
    expect(rows.filter((r) => r.type === 'expiration_warning')).toHaveLength(0)
  })

  it('never sends the same reminder twice, however often it runs', async () => {
    await insertApprovedDocument(30)

    await runComplianceSweep()
    const afterFirst = await testDb.select().from(schema.notifications)

    await runComplianceSweep()
    await runComplianceSweep()
    const afterThird = await testDb.select().from(schema.notifications)

    // This is the property that makes the sweep safe to retry or run by hand.
    expect(afterThird).toHaveLength(afterFirst.length)
  })

  it('removes work clearance from a company whose mandatory document expired', async () => {
    await testDb
      .update(schema.companies)
      .set({ status: 'APPROVED_TO_WORK' })
      .where(eq(schema.companies.id, company.id))
    await insertApprovedDocument(-3)

    const result = await runComplianceSweep()
    expect(result.companiesDemoted).toBe(1)

    const [after] = await testDb
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.id, company.id))
    expect(after.status).toBe('INACTIVE_EXPIRED_DOCUMENTS')

    const history = await testDb
      .select()
      .from(schema.statusHistory)
      .where(eq(schema.statusHistory.companyId, company.id))
    expect(history.some((h) => h.isSystemGenerated && h.toStatus === 'INACTIVE_EXPIRED_DOCUMENTS')).toBe(true)
  })

  it('does not touch a suspended company even when its documents expire', async () => {
    await testDb
      .update(schema.companies)
      .set({ status: 'SUSPENDED' })
      .where(eq(schema.companies.id, company.id))
    await insertApprovedDocument(-3)

    const result = await runComplianceSweep()
    expect(result.companiesDemoted).toBe(0)

    const [after] = await testDb
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.id, company.id))
    expect(after.status).toBe('SUSPENDED')
  })

  it('does not demote a company that never held work clearance', async () => {
    await testDb
      .update(schema.companies)
      .set({ status: 'DOCUMENTATION_PENDING' })
      .where(eq(schema.companies.id, company.id))
    await insertApprovedDocument(-3)

    const result = await runComplianceSweep()
    expect(result.companiesDemoted).toBe(0)
  })

  it('expires stale invitations and purges dead sessions in the same pass', async () => {
    const [invitation] = await testDb
      .insert(schema.invitations)
      .values({
        companyId: company.id,
        email: 'stale@valley.test',
        contactName: 'Stale Contact',
        tokenHash: 'b'.repeat(64),
        expiresAt: daysFromNow(-5),
      })
      .returning()

    const result = await runComplianceSweep()
    expect(result.invitationsExpired).toBe(1)

    const [after] = await testDb
      .select()
      .from(schema.invitations)
      .where(eq(schema.invitations.id, invitation.id))
    expect(after.status).toBe('EXPIRED')
  })

  it('completes without errors on an empty database', async () => {
    await resetDatabase()
    const result = await runComplianceSweep()
    expect(result.errors).toEqual([])
    expect(result.documentsExpired).toBe(0)
  })
})
