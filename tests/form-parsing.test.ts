import { describe, expect, it } from 'vitest'
import {
  collectIndexed,
  companySectionSchema,
  formText,
  formValue,
} from '@/lib/portal/validation'

/**
 * Regression coverage for the conditionally-rendered-field bug.
 *
 * `FormData.get()` returns `null` for any field not present in the submission.
 * The mailing-address block is hidden whenever "same as business" is ticked —
 * the default — so those five inputs never reach the server. Passing that `null`
 * straight into an `.optional()` Zod string produced "expected string, received
 * null" and Section A could not be saved by anybody. These tests pin the fix.
 */

function fd(entries: Record<string, string | string[]>): FormData {
  const f = new FormData()
  for (const [k, v] of Object.entries(entries)) {
    if (Array.isArray(v)) v.forEach((x) => f.append(k, x))
    else f.set(k, v)
  }
  return f
}

describe('form value helpers', () => {
  it('returns undefined for a field that was never submitted', () => {
    expect(formValue(fd({}), 'missing')).toBeUndefined()
  })

  it('returns the string for a present field, including an empty one', () => {
    expect(formValue(fd({ a: 'x' }), 'a')).toBe('x')
    expect(formValue(fd({ a: '' }), 'a')).toBe('')
  })

  it('never returns null', () => {
    expect(formValue(fd({}), 'nope')).not.toBeNull()
    expect(formText(fd({}), 'nope')).toBe('')
  })
})

describe('company section — mailing address hidden (the default)', () => {
  /** Exactly what the browser submits when "same as business" is ticked. */
  const submissionWithHiddenMailingBlock = fd({
    legalName: 'Preview Framing Co LLC',
    dba: '',
    entityType: 'LLC',
    einLast4: '4321',
    businessAddress1: '100 Preview Way',
    businessAddress2: '',
    businessCity: 'Provo',
    businessState: 'UT',
    businessZip: '84604',
    mailingSameAsBusiness: 'on',
    // mailingAddress1/2, mailingCity, mailingState, mailingZip: ABSENT
    mainPhone: '8015550123',
    generalEmail: 'office@previewframing.test',
    website: '',
    primaryTrade: 'Framing',
    typicalProjectSize: '',
    largestProject: '',
    annualCapacity: '',
    currentBacklog: '',
    description: '',
  })

  function parse(f: FormData) {
    return companySectionSchema.safeParse({
      legalName: formValue(f, 'legalName'),
      dba: formValue(f, 'dba'),
      entityType: formValue(f, 'entityType'),
      einLast4: formValue(f, 'einLast4'),
      businessAddress1: formValue(f, 'businessAddress1'),
      businessAddress2: formValue(f, 'businessAddress2'),
      businessCity: formValue(f, 'businessCity'),
      businessState: formValue(f, 'businessState'),
      businessZip: formValue(f, 'businessZip'),
      mailingSameAsBusiness: f.get('mailingSameAsBusiness') === 'on',
      mailingAddress1: formValue(f, 'mailingAddress1'),
      mailingAddress2: formValue(f, 'mailingAddress2'),
      mailingCity: formValue(f, 'mailingCity'),
      mailingState: formValue(f, 'mailingState'),
      mailingZip: formValue(f, 'mailingZip'),
      mainPhone: formValue(f, 'mainPhone'),
      generalEmail: formValue(f, 'generalEmail'),
      website: formValue(f, 'website'),
      yearEstablished: formValue(f, 'yearEstablished') || undefined,
      yearsInBusiness: formValue(f, 'yearsInBusiness') || undefined,
      primaryTrade: formValue(f, 'primaryTrade'),
      additionalTrades: f.getAll('additionalTrades').map(String),
      serviceAreas: f.getAll('serviceAreas').map(String),
      typicalProjectSize: formValue(f, 'typicalProjectSize'),
      largestProject: formValue(f, 'largestProject'),
      crewSize: formValue(f, 'crewSize') || undefined,
      annualCapacity: formValue(f, 'annualCapacity'),
      currentBacklog: formValue(f, 'currentBacklog'),
      usesLowerTierSubs: f.get('usesLowerTierSubs') === 'yes',
      description: formValue(f, 'description'),
    })
  }

  it('saves when the mailing block is absent — the default path', () => {
    const result = parse(submissionWithHiddenMailingBlock)
    expect(result.success).toBe(true)
  })

  it('reading those absent fields directly would have failed', () => {
    // Demonstrates the original defect, so the helper cannot be quietly removed.
    const raw = submissionWithHiddenMailingBlock.get('mailingCity')
    expect(raw).toBeNull()
    const bad = companySectionSchema.safeParse({ mailingCity: raw })
    expect(bad.success).toBe(false)
  })

  it('still saves when a separate mailing address IS provided', () => {
    const f = fd({
      ...Object.fromEntries(
        [...submissionWithHiddenMailingBlock.entries()].map(([k, v]) => [k, String(v)]),
      ),
      mailingAddress1: 'PO Box 42',
      mailingCity: 'Orem',
      mailingState: 'UT',
      mailingZip: '84057',
    })
    f.delete('mailingSameAsBusiness')
    expect(parse(f).success).toBe(true)
  })

  it('still rejects a genuinely invalid submission', () => {
    const f = fd({
      ...Object.fromEntries(
        [...submissionWithHiddenMailingBlock.entries()].map(([k, v]) => [k, String(v)]),
      ),
      businessZip: 'not-a-zip',
    })
    const result = parse(f)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('businessZip'))).toBe(true)
    }
  })
})

describe('indexed field collection', () => {
  it('groups repeated contact rows by index', () => {
    const f = fd({
      'contacts.0.role': 'PRIMARY',
      'contacts.0.name': 'Dana Field',
      'contacts.1.role': 'ACCOUNTING',
      'contacts.1.name': 'Sam Books',
    })
    const rows = collectIndexed(f, 'contacts')
    expect(rows).toHaveLength(2)
    expect(rows[0].name).toBe('Dana Field')
    expect(rows[1].role).toBe('ACCOUNTING')
  })

  it('returns an empty array when nothing matches', () => {
    expect(collectIndexed(fd({ other: 'x' }), 'contacts')).toEqual([])
  })
})
