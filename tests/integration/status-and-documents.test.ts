import { beforeEach, describe, expect, it } from 'vitest'
import { and, eq } from 'drizzle-orm'
import * as schema from '@/lib/portal/db/schema'
import {
  applySystemStatusChange,
  changeCompanyStatus,
} from '@/lib/portal/services/status'
import {
  addInternalNote,
  getInternalNotes,
  recordAcknowledgment,
  reviewDocument,
} from '@/lib/portal/services/documents'
import { getCompanyCompliance } from '@/lib/portal/services/compliance-service'
import { sendPortalEmail } from '@/lib/portal/email/mailer'
import { NOTIFICATION_TYPES } from '@/lib/portal/email/templates'
import {
  daysFromNow,
  hasDatabase,
  resetDatabase,
  seedCompany,
  seedRequirement,
  seedUser,
  sessionFor,
  testDb,
} from './setup'

const describeDb = hasDatabase ? describe : describe.skip

describeDb('status transitions', () => {
  let adminSession: ReturnType<typeof sessionFor>
  let partnerSession: ReturnType<typeof sessionFor>
  let company: schema.Company

  beforeEach(async () => {
    await resetDatabase()
    const admin = await seedUser({ email: 'admin@hre-utah.com', role: 'ADMIN', name: 'Brian Hardy' })
    adminSession = sessionFor(admin)
    company = await seedCompany()
    const partner = await seedUser({
      email: 'partner@example.com',
      role: 'TRADE_PARTNER',
      companyId: company.id,
    })
    partnerSession = sessionFor(partner)
  })

  /** Brings a company all the way to work-eligible so approval can be tested. */
  async function makeWorkEligible() {
    const w9 = await seedRequirement({ code: 'W9', name: 'W-9', category: 'TAX_AND_CORPORATE' })
    const gl = await seedRequirement({ code: 'GL', name: 'General Liability', hasExpiration: true })

    await testDb.insert(schema.documents).values([
      { companyId: company.id, requirementId: w9.id, state: 'APPROVED' },
      {
        companyId: company.id,
        requirementId: gl.id,
        state: 'APPROVED',
        expirationDate: daysFromNow(180),
      },
    ])
    await testDb.insert(schema.contacts).values({
      companyId: company.id,
      role: 'PRIMARY',
      name: 'Dana Field',
      email: 'dana@example.com',
    })
    await testDb.insert(schema.licenses).values({
      companyId: company.id,
      licenseNumber: 'UT-123456',
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
    })
    await testDb
      .update(schema.applications)
      .set({ status: 'APPROVED', submittedAt: new Date() })
      .where(eq(schema.applications.companyId, company.id))

    return { w9, gl }
  }

  it('refuses a status change from a non-administrator', async () => {
    const result = await changeCompanyStatus({
      companyId: company.id,
      to: 'APPROVED_TO_WORK',
      actor: partnerSession,
    })
    expect(result.ok).toBe(false)

    const [after] = await testDb
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.id, company.id))
    expect(after.status).toBe('INVITED')
  })

  it('records an audit event when a trade partner attempts a status change', async () => {
    await changeCompanyStatus({
      companyId: company.id,
      to: 'APPROVED_TO_WORK',
      actor: partnerSession,
    })
    const events = await testDb.select().from(schema.auditEvents)
    expect(events.some((e) => e.action === 'status.change_blocked')).toBe(true)
  })

  it('refuses approval to work while mandatory items are outstanding', async () => {
    await seedRequirement({ code: 'W9', name: 'W-9', category: 'TAX_AND_CORPORATE' })

    const result = await changeCompanyStatus({
      companyId: company.id,
      to: 'APPROVED_TO_WORK',
      actor: adminSession,
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatch(/not work-eligible/i)
  })

  it('allows approval to work once everything is approved and current', async () => {
    await makeWorkEligible()

    const result = await changeCompanyStatus({
      companyId: company.id,
      to: 'APPROVED_TO_WORK',
      actor: adminSession,
    })
    expect(result.ok).toBe(true)

    const [after] = await testDb
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.id, company.id))
    expect(after.status).toBe('APPROVED_TO_WORK')
  })

  it('writes status history and an audit event for every change', async () => {
    await makeWorkEligible()
    await changeCompanyStatus({ companyId: company.id, to: 'APPROVED_TO_WORK', actor: adminSession })

    const history = await testDb
      .select()
      .from(schema.statusHistory)
      .where(eq(schema.statusHistory.companyId, company.id))
    expect(history.some((h) => h.toStatus === 'APPROVED_TO_WORK' && h.changedById === adminSession.userId)).toBe(true)

    const events = await testDb.select().from(schema.auditEvents)
    expect(events.some((e) => e.action === 'status.changed')).toBe(true)
  })

  it('requires a written reason to suspend', async () => {
    const noReason = await changeCompanyStatus({
      companyId: company.id,
      to: 'SUSPENDED',
      actor: adminSession,
    })
    expect(noReason.ok).toBe(false)

    const withReason = await changeCompanyStatus({
      companyId: company.id,
      to: 'SUSPENDED',
      reason: 'Unresolved warranty claim on the Alpine project.',
      actor: adminSession,
    })
    expect(withReason.ok).toBe(true)
  })

  it('revokes active sessions when a company is suspended', async () => {
    await testDb.insert(schema.sessions).values({
      tokenHash: 'a'.repeat(64),
      userId: partnerSession.userId,
      expiresAt: daysFromNow(1),
    })

    await changeCompanyStatus({
      companyId: company.id,
      to: 'SUSPENDED',
      reason: 'Insurance lapsed without notice.',
      actor: adminSession,
    })

    const sessions = await testDb
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, partnerSession.userId))
    expect(sessions.every((s) => s.revokedAt !== null)).toBe(true)
  })

  it('never lets automation reactivate a suspended company', async () => {
    await changeCompanyStatus({
      companyId: company.id,
      to: 'SUSPENDED',
      reason: 'Pending investigation.',
      actor: adminSession,
    })

    const attempted = await applySystemStatusChange({
      companyId: company.id,
      to: 'APPROVED_TO_BID',
      reason: 'Automatic reinstatement',
    })
    expect(attempted.ok).toBe(false)

    const [after] = await testDb
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.id, company.id))
    expect(after.status).toBe('SUSPENDED')
  })

  it('never lets automation set an administrator-only status', async () => {
    const result = await applySystemStatusChange({
      companyId: company.id,
      to: 'APPROVED_TO_WORK',
      reason: 'Automatic approval',
    })
    expect(result.ok).toBe(false)
  })

  it('removes work eligibility when a mandatory document expires', async () => {
    const { gl } = await makeWorkEligible()
    await changeCompanyStatus({ companyId: company.id, to: 'APPROVED_TO_WORK', actor: adminSession })

    await testDb
      .update(schema.documents)
      .set({ expirationDate: daysFromNow(-1) })
      .where(and(eq(schema.documents.companyId, company.id), eq(schema.documents.requirementId, gl.id)))

    const compliance = await getCompanyCompliance(company.id)
    expect(compliance?.result.workEligible).toBe(false)
    expect(compliance?.result.recommendedStatus).toBe('INACTIVE_EXPIRED_DOCUMENTS')
    expect(compliance?.result.canSystemApply).toBe(true)

    const demoted = await applySystemStatusChange({
      companyId: company.id,
      to: 'INACTIVE_EXPIRED_DOCUMENTS',
      reason: 'Automatic: expired general liability certificate.',
    })
    expect(demoted.ok).toBe(true)

    const [after] = await testDb
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.id, company.id))
    expect(after.status).toBe('INACTIVE_EXPIRED_DOCUMENTS')

    // History is preserved through the demotion.
    const history = await testDb
      .select()
      .from(schema.statusHistory)
      .where(eq(schema.statusHistory.companyId, company.id))
    expect(history.length).toBeGreaterThanOrEqual(2)
    expect(history.some((h) => h.isSystemGenerated)).toBe(true)
  })
})

describeDb('document review', () => {
  let adminSession: ReturnType<typeof sessionFor>
  let partnerSession: ReturnType<typeof sessionFor>
  let company: schema.Company
  let requirement: schema.DocumentRequirement

  beforeEach(async () => {
    await resetDatabase()
    const admin = await seedUser({ email: 'admin@hre-utah.com', role: 'ADMIN' })
    adminSession = sessionFor(admin)
    company = await seedCompany()
    const partner = await seedUser({
      email: 'partner@example.com',
      role: 'TRADE_PARTNER',
      companyId: company.id,
    })
    partnerSession = sessionFor(partner)
    requirement = await seedRequirement({ code: 'GL', name: 'General Liability', hasExpiration: true })
  })

  async function insertDocument(state: schema.DocumentStateValue = 'SUBMITTED', version = 1) {
    const [document] = await testDb
      .insert(schema.documents)
      .values({
        companyId: company.id,
        requirementId: requirement.id,
        state,
        version,
        originalFilename: `coi-v${version}.pdf`,
        storageKey: `companies/${company.id}/2026/GL/${version}.pdf`,
        expirationDate: daysFromNow(120),
      })
      .returning()
    return document
  }

  it('refuses a review from a trade partner — nobody approves their own documents', async () => {
    const document = await insertDocument()
    const result = await reviewDocument({
      documentId: document.id,
      decision: 'APPROVED',
      actor: partnerSession,
    })
    expect(result.ok).toBe(false)

    const [after] = await testDb
      .select()
      .from(schema.documents)
      .where(eq(schema.documents.id, document.id))
    expect(after.state).toBe('SUBMITTED')
  })

  it('requires a reason to reject', async () => {
    const document = await insertDocument()
    const result = await reviewDocument({
      documentId: document.id,
      decision: 'REJECTED',
      actor: adminSession,
    })
    expect(result.ok).toBe(false)
  })

  it('requires a reason to mark not applicable', async () => {
    const document = await insertDocument()
    const result = await reviewDocument({
      documentId: document.id,
      decision: 'NOT_APPLICABLE',
      actor: adminSession,
    })
    expect(result.ok).toBe(false)
  })

  it('records an approval with a review row and an audit event', async () => {
    const document = await insertDocument()
    const result = await reviewDocument({
      documentId: document.id,
      decision: 'APPROVED',
      actor: adminSession,
    })
    expect(result.ok).toBe(true)

    const [after] = await testDb
      .select()
      .from(schema.documents)
      .where(eq(schema.documents.id, document.id))
    expect(after.state).toBe('APPROVED')
    expect(after.reviewedById).toBe(adminSession.userId)

    const reviews = await testDb
      .select()
      .from(schema.documentReviews)
      .where(eq(schema.documentReviews.documentId, document.id))
    expect(reviews).toHaveLength(1)

    const events = await testDb.select().from(schema.auditEvents)
    expect(events.some((e) => e.action === 'document.approved')).toBe(true)
  })

  it('records a rejection with its reason and an audit event', async () => {
    const document = await insertDocument()
    await reviewDocument({
      documentId: document.id,
      decision: 'REJECTED',
      reason: 'Hardy Homes is not listed as certificate holder.',
      actor: adminSession,
    })

    const [after] = await testDb
      .select()
      .from(schema.documents)
      .where(eq(schema.documents.id, document.id))
    expect(after.state).toBe('REJECTED')
    expect(after.rejectionReason).toMatch(/certificate holder/)

    const events = await testDb.select().from(schema.auditEvents)
    expect(events.some((e) => e.action === 'document.rejected')).toBe(true)
  })

  it('refuses to review a superseded version', async () => {
    const old = await insertDocument('SUPERSEDED', 1)
    const result = await reviewDocument({
      documentId: old.id,
      decision: 'APPROVED',
      actor: adminSession,
    })
    expect(result.ok).toBe(false)
  })

  it('keeps every review decision, not just the latest', async () => {
    const document = await insertDocument()
    await reviewDocument({
      documentId: document.id,
      decision: 'REJECTED',
      reason: 'Wrong policy period.',
      actor: adminSession,
    })
    await reviewDocument({ documentId: document.id, decision: 'APPROVED', actor: adminSession })

    const reviews = await testDb
      .select()
      .from(schema.documentReviews)
      .where(eq(schema.documentReviews.documentId, document.id))
    expect(reviews).toHaveLength(2)
  })

  it('records an acknowledgment once and ignores a duplicate submission', async () => {
    const policy = await seedRequirement({
      code: 'CODE_OF_CONDUCT',
      category: 'AGREEMENTS_AND_POLICIES',
      isAcknowledgment: true,
    })

    const first = await recordAcknowledgment({
      companyId: company.id,
      requirementId: policy.id,
      signerName: 'Dana Field',
      signerTitle: 'Owner',
      actor: partnerSession,
    })
    expect(first.ok).toBe(true)

    await recordAcknowledgment({
      companyId: company.id,
      requirementId: policy.id,
      signerName: 'Dana Field',
      actor: partnerSession,
    })

    const rows = await testDb
      .select()
      .from(schema.acknowledgments)
      .where(eq(schema.acknowledgments.companyId, company.id))
    expect(rows).toHaveLength(1)
  })

  it('refuses an acknowledgment on a requirement that expects a file', async () => {
    const result = await recordAcknowledgment({
      companyId: company.id,
      requirementId: requirement.id,
      signerName: 'Dana Field',
      actor: partnerSession,
    })
    expect(result.ok).toBe(false)
  })
})

describeDb('internal notes', () => {
  let adminSession: ReturnType<typeof sessionFor>
  let partnerSession: ReturnType<typeof sessionFor>
  let company: schema.Company

  beforeEach(async () => {
    await resetDatabase()
    const admin = await seedUser({ email: 'admin@hre-utah.com', role: 'ADMIN' })
    adminSession = sessionFor(admin)
    company = await seedCompany()
    const partner = await seedUser({
      email: 'partner@example.com',
      role: 'TRADE_PARTNER',
      companyId: company.id,
    })
    partnerSession = sessionFor(partner)
  })

  it('refuses a note from a trade partner', async () => {
    const result = await addInternalNote({
      companyId: company.id,
      body: 'Trying to write an internal note.',
      actor: partnerSession,
    })
    expect(result.ok).toBe(false)

    const notes = await testDb.select().from(schema.internalNotes)
    expect(notes).toHaveLength(0)
  })

  it('never returns internal notes to a trade partner', async () => {
    await addInternalNote({
      companyId: company.id,
      body: 'Do not award work until the current claim is resolved.',
      actor: adminSession,
    })

    expect(await getInternalNotes(company.id, partnerSession)).toEqual([])
    expect((await getInternalNotes(company.id, adminSession)).length).toBe(1)
  })
})

describeDb('notification duplicate suppression', () => {
  let company: schema.Company

  beforeEach(async () => {
    await resetDatabase()
    company = await seedCompany()
  })

  it('sends a given reminder only once, however many times the sweep runs', async () => {
    const send = () =>
      sendPortalEmail({
        type: NOTIFICATION_TYPES.EXPIRATION_WARNING,
        to: 'partner@example.com',
        companyId: company.id,
        dedupeKey: 'expiration_warning:doc-1:30:user-1',
        data: { companyName: company.legalName, portalUrl: 'https://example.test', daysUntil: 30 },
      })

    const first = await send()
    const second = await send()
    const third = await send()

    // Without a provider key the first send is SKIPPED rather than SENT, but the
    // claim on the dedupe key still happens — which is the behaviour under test.
    expect(second.reason).toMatch(/duplicate/i)
    expect(third.reason).toMatch(/duplicate/i)
    expect(first.reason).not.toMatch(/duplicate/i)

    const rows = await testDb.select().from(schema.notifications)
    expect(rows).toHaveLength(1)
  })

  it('treats a different threshold as a different message', async () => {
    for (const days of [30, 14, 7, 0]) {
      await sendPortalEmail({
        type: NOTIFICATION_TYPES.EXPIRATION_WARNING,
        to: 'partner@example.com',
        companyId: company.id,
        dedupeKey: `expiration_warning:doc-1:${days}:user-1`,
        data: { companyName: company.legalName, portalUrl: 'https://example.test', daysUntil: days },
      })
    }

    const rows = await testDb.select().from(schema.notifications)
    expect(rows).toHaveLength(4)
  })
})
