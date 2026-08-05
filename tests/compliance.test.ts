import { describe, expect, it } from 'vitest'
import {
  daysBetween,
  evaluateCompliance,
  isExpiredOn,
  isRequirementApplicable,
} from '@/lib/portal/compliance'
import {
  NOW,
  daysFromNow,
  makeAcknowledgment,
  makeCompany,
  makeCompliantInput,
  makeDocument,
  makeRequirement,
} from './factories'

describe('requirement applicability', () => {
  it('applies to every trade when the trade list is empty', () => {
    const requirement = makeRequirement({ code: 'W9' })
    expect(
      isRequirementApplicable(requirement, {
        entityType: 'LLC',
        primaryTrade: 'Framing',
        additionalTrades: [],
      }),
    ).toBe(true)
  })

  it('matches on an additional trade, not only the primary one', () => {
    const requirement = makeRequirement({ code: 'ELEC', applicableTrades: ['Electrical'] })
    expect(
      isRequirementApplicable(requirement, {
        entityType: 'LLC',
        primaryTrade: 'Framing',
        additionalTrades: ['Electrical'],
      }),
    ).toBe(true)
  })

  it('does not apply when neither the primary nor an additional trade matches', () => {
    const requirement = makeRequirement({ code: 'ELEC', applicableTrades: ['Electrical'] })
    expect(
      isRequirementApplicable(requirement, {
        entityType: 'LLC',
        primaryTrade: 'Framing',
        additionalTrades: ['Roofing'],
      }),
    ).toBe(false)
  })

  it('scopes by entity type — a sole proprietor needs no entity registration', () => {
    const requirement = makeRequirement({
      code: 'BUSINESS_REGISTRATION',
      applicableEntityTypes: ['LLC', 'S_CORP', 'C_CORP'],
    })
    expect(
      isRequirementApplicable(requirement, {
        entityType: 'SOLE_PROPRIETOR',
        primaryTrade: 'Framing',
        additionalTrades: [],
      }),
    ).toBe(false)
  })

  it('ignores inactive requirements entirely', () => {
    const requirement = makeRequirement({ code: 'OLD', isActive: false })
    expect(
      isRequirementApplicable(requirement, {
        entityType: 'LLC',
        primaryTrade: 'Framing',
        additionalTrades: [],
      }),
    ).toBe(false)
  })
})

describe('expiration boundaries', () => {
  it('treats a document expiring today as still current', () => {
    // A certificate valid "through" today must not block work this morning.
    expect(isExpiredOn(NOW, NOW)).toBe(false)
  })

  it('treats yesterday as expired', () => {
    expect(isExpiredOn(daysFromNow(-1), NOW)).toBe(true)
  })

  it('counts whole days regardless of time of day', () => {
    expect(daysBetween(new Date('2026-06-01T23:00:00Z'), new Date('2026-06-02T01:00:00Z'))).toBe(1)
  })

  it('never treats a document without an expiration date as expired', () => {
    expect(isExpiredOn(null, NOW)).toBe(false)
  })
})

describe('work eligibility', () => {
  it('is granted when every mandatory item is approved and current', () => {
    const result = evaluateCompliance(makeCompliantInput())
    expect(result.workEligible).toBe(true)
    expect(result.workBlockers).toEqual([])
  })

  it('is blocked by a missing required item', () => {
    const input = makeCompliantInput()
    // Drop the W-9 upload, leaving the requirement in place.
    input.documents = input.documents.filter(
      (d) => d.requirementId !== input.requirements[0].id,
    )

    const result = evaluateCompliance(input)
    expect(result.workEligible).toBe(false)
    expect(result.workBlockers.map((b) => b.label)).toContain('W-9')
  })

  it('is blocked by a rejected required item', () => {
    const input = makeCompliantInput()
    const gl = input.requirements[1]
    input.documents = [
      input.documents[0],
      makeDocument(gl, 'REJECTED', {
        expirationDate: daysFromNow(200),
        rejectionReason: 'Hardy Homes is not listed as certificate holder.',
      }),
    ]

    const result = evaluateCompliance(input)
    expect(result.workEligible).toBe(false)
    expect(result.workBlockers.some((b) => b.detail.includes('certificate holder'))).toBe(true)
  })

  it('is blocked by an expired required item', () => {
    const input = makeCompliantInput()
    const gl = input.requirements[1]
    input.documents = [input.documents[0], makeDocument(gl, 'APPROVED', { expirationDate: daysFromNow(-1) })]

    const result = evaluateCompliance(input)
    expect(result.workEligible).toBe(false)
    expect(result.counts.expired).toBe(1)
  })

  it('treats a stale APPROVED row past its date as EXPIRED before the sweep runs', () => {
    // The nightly sweep persists this, but eligibility must not depend on the
    // sweep having already run.
    const input = makeCompliantInput()
    const gl = input.requirements[1]
    input.documents = [input.documents[0], makeDocument(gl, 'APPROVED', { expirationDate: daysFromNow(-5) })]

    const result = evaluateCompliance(input)
    const item = result.items.find((i) => i.code === 'GL_CERTIFICATE')
    expect(item?.state).toBe('EXPIRED')
    expect(result.workEligible).toBe(false)
  })

  it('is not blocked by an item marked not applicable', () => {
    const input = makeCompliantInput()
    const gl = input.requirements[1]
    input.documents = [
      input.documents[0],
      makeDocument(gl, 'NOT_APPLICABLE', { notApplicableReason: 'Owner-operator, no employees.' }),
    ]

    const result = evaluateCompliance(input)
    expect(result.workEligible).toBe(true)
    expect(result.counts.notApplicable).toBe(1)
  })

  it('is not blocked by an optional item that is missing', () => {
    const input = makeCompliantInput()
    input.requirements.push(makeRequirement({ code: 'UMBRELLA', isRequired: false }))

    const result = evaluateCompliance(input)
    expect(result.workEligible).toBe(true)
  })

  it('is blocked until an administrator approves the application', () => {
    const input = makeCompliantInput({ application: { status: 'SUBMITTED' } })
    const result = evaluateCompliance(input)
    expect(result.workEligible).toBe(false)
    expect(result.workBlockers.map((b) => b.code)).toContain('APPLICATION_NOT_APPROVED')
  })

  it('is blocked until an administrator verifies the licence', () => {
    const input = makeCompliantInput({ licenseVerified: false })
    const result = evaluateCompliance(input)
    expect(result.workEligible).toBe(false)
    expect(result.workBlockers.map((b) => b.code)).toContain('LICENSE_NOT_VERIFIED')
  })

  it('requires an acknowledgment before granting work eligibility', () => {
    const policy = makeRequirement({
      code: 'CODE_OF_CONDUCT',
      category: 'AGREEMENTS_AND_POLICIES',
      isAcknowledgment: true,
    })
    const input = makeCompliantInput()
    input.requirements.push(policy)

    expect(evaluateCompliance(input).workEligible).toBe(false)

    input.acknowledgments = [makeAcknowledgment(policy)]
    expect(evaluateCompliance(input).workEligible).toBe(true)
  })
})

describe('bid eligibility', () => {
  it('is granted on a submitted application with the basics present', () => {
    const input = makeCompliantInput({ application: { status: 'SUBMITTED' } })
    const result = evaluateCompliance(input)
    expect(result.bidEligible).toBe(true)
    // Bid eligibility must not imply work eligibility.
    expect(result.workEligible).toBe(false)
  })

  it('is blocked when the application has not been submitted', () => {
    const input = makeCompliantInput({ application: { status: 'IN_PROGRESS' } })
    expect(evaluateCompliance(input).bidEligible).toBe(false)
  })

  it('is blocked without a primary contact', () => {
    const input = makeCompliantInput({ hasPrimaryContact: false })
    const result = evaluateCompliance(input)
    expect(result.bidEligible).toBe(false)
    expect(result.bidBlockers.map((b) => b.code)).toContain('MISSING_PRIMARY_CONTACT')
  })

  it('treats a missing licence record as a soft blocker only', () => {
    const input = makeCompliantInput({
      application: { status: 'SUBMITTED' },
      hasLicenseRecord: false,
    })
    const result = evaluateCompliance(input)
    expect(result.bidEligible).toBe(true)
    expect(result.bidBlockers.find((b) => b.code === 'MISSING_LICENSE_RECORD')?.severity).toBe('soft')
  })
})

describe('status recommendations', () => {
  it('recommends work approval but refuses to apply it automatically', () => {
    const input = makeCompliantInput()
    const result = evaluateCompliance(input)
    expect(result.recommendedStatus).toBe('APPROVED_TO_WORK')
    expect(result.canSystemApply).toBe(false)
  })

  it('automatically demotes a work-approved company with an expired document', () => {
    const input = makeCompliantInput({
      company: makeCompany({ status: 'APPROVED_TO_WORK' }),
    })
    const gl = input.requirements[1]
    input.documents = [input.documents[0], makeDocument(gl, 'APPROVED', { expirationDate: daysFromNow(-1) })]

    const result = evaluateCompliance(input)
    expect(result.recommendedStatus).toBe('INACTIVE_EXPIRED_DOCUMENTS')
    expect(result.canSystemApply).toBe(true)
  })

  it('never reactivates a suspended company', () => {
    const input = makeCompliantInput({ company: makeCompany({ status: 'SUSPENDED' }) })
    const result = evaluateCompliance(input)
    expect(result.recommendedStatus).toBeNull()
    expect(result.canSystemApply).toBe(false)
  })

  it('never reactivates a Do Not Use company, even when fully compliant', () => {
    const input = makeCompliantInput({ company: makeCompany({ status: 'DO_NOT_USE' }) })
    const result = evaluateCompliance(input)
    expect(result.workEligible).toBe(true)
    expect(result.recommendedStatus).toBeNull()
    expect(result.canSystemApply).toBe(false)
  })

  it('recommends — but does not apply — reinstatement after documents are renewed', () => {
    const input = makeCompliantInput({
      company: makeCompany({ status: 'INACTIVE_EXPIRED_DOCUMENTS' }),
    })
    const result = evaluateCompliance(input)
    expect(result.recommendedStatus).toBe('APPROVED_TO_WORK')
    expect(result.canSystemApply).toBe(false)
  })
})

describe('expiring-soon window and counts', () => {
  it('flags a document inside the 30-day window', () => {
    const input = makeCompliantInput()
    const gl = input.requirements[1]
    input.documents = [input.documents[0], makeDocument(gl, 'APPROVED', { expirationDate: daysFromNow(12) })]

    const result = evaluateCompliance(input)
    expect(result.counts.expiringSoon).toBe(1)
    // Expiring is a warning, not a block — the certificate is still current.
    expect(result.workEligible).toBe(true)
  })

  it('does not flag a document outside the window', () => {
    const input = makeCompliantInput()
    const gl = input.requirements[1]
    input.documents = [input.documents[0], makeDocument(gl, 'APPROVED', { expirationDate: daysFromNow(31) })]

    expect(evaluateCompliance(input).counts.expiringSoon).toBe(0)
  })

  it('computes completion across applicable requirements only', () => {
    const input = makeCompliantInput()
    input.requirements.push(
      makeRequirement({ code: 'ELEC_LICENSE', applicableTrades: ['Electrical'] }),
    )

    const result = evaluateCompliance(input)
    // The electrical licence does not apply to a framer, so it must not drag
    // the percentage down.
    expect(result.completionPercent).toBe(100)
    expect(result.counts.applicable).toBe(2)
  })

  it('reports zero completion rather than dividing by zero', () => {
    const input = makeCompliantInput({ requirements: [], documents: [] })
    expect(evaluateCompliance(input).completionPercent).toBe(0)
  })
})

describe('document versioning', () => {
  it('evaluates the newest non-superseded version', () => {
    const input = makeCompliantInput()
    const gl = input.requirements[1]
    input.documents = [
      input.documents[0],
      makeDocument(gl, 'SUPERSEDED', { version: 1, expirationDate: daysFromNow(-30) }),
      makeDocument(gl, 'APPROVED', { version: 2, expirationDate: daysFromNow(300) }),
    ]

    const result = evaluateCompliance(input)
    const item = result.items.find((i) => i.code === 'GL_CERTIFICATE')
    expect(item?.state).toBe('APPROVED')
    expect(result.workEligible).toBe(true)
  })

  it('does not let a superseded row satisfy a requirement on its own', () => {
    const input = makeCompliantInput()
    const gl = input.requirements[1]
    input.documents = [input.documents[0], makeDocument(gl, 'SUPERSEDED', { version: 1 })]

    const result = evaluateCompliance(input)
    expect(result.items.find((i) => i.code === 'GL_CERTIFICATE')?.state).toBe('MISSING')
    expect(result.workEligible).toBe(false)
  })
})
