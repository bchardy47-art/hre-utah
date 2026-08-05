import { describe, expect, it, beforeEach } from 'vitest'
import { assertCompanyAccess, canAccessCompany, PortalAuthError } from '@/lib/portal/auth/firebase-guards'
import { generateToken, hashToken, tokensMatch } from '@/lib/portal/auth/tokens'
import { validatePassword } from '@/lib/portal/auth/password'
import { redact } from '@/lib/portal/firebase/audit'
import { clearRateLimit, LIMITS, peekRateLimit, rateLimit, recordFailure, resetRateLimits } from '@/lib/portal/rate-limit'
import {
  buildStoragePath,
  pathBelongsToCompany,
  sanitiseFilename,
  sniffMimeType,
} from '@/lib/portal/firebase/storage'
import { maskEmail } from '@/lib/portal/firebase/audit'
import type { PortalSession } from '@/lib/portal/auth/firebase-session'

const admin: PortalSession = {
  userId: 'u-admin',
  uid: 'u-admin',
  email: 'brian@hre-utah.com',
  name: 'Brian Hardy',
  role: 'ADMIN',
  companyId: null,
  emailVerified: true,
  expiresAt: new Date(Date.now() + 3_600_000),
}

const partnerA: PortalSession = {
  userId: 'u-a',
  uid: 'u-a',
  email: 'a@example.com',
  name: 'Partner A',
  role: 'TRADE_PARTNER',
  companyId: 'company-a',
  emailVerified: true,
  expiresAt: new Date(Date.now() + 3_600_000),
}

describe('record-level authorization', () => {
  it('lets an administrator reach any company', () => {
    expect(() => assertCompanyAccess(admin, 'company-a')).not.toThrow()
    expect(() => assertCompanyAccess(admin, 'company-b')).not.toThrow()
  })

  it('lets a trade partner reach only its own company', () => {
    expect(() => assertCompanyAccess(partnerA, 'company-a')).not.toThrow()
  })

  it('refuses a trade partner reaching another company — the IDOR case', () => {
    expect(() => assertCompanyAccess(partnerA, 'company-b')).toThrow(PortalAuthError)
    try {
      assertCompanyAccess(partnerA, 'company-b')
    } catch (error) {
      expect((error as PortalAuthError).statusCode).toBe(403)
    }
  })

  it('refuses a trade partner user with no company attached', () => {
    const orphan = { ...partnerA, companyId: null }
    expect(() => assertCompanyAccess(orphan, 'company-a')).toThrow(PortalAuthError)
  })

  it('refuses an unauthenticated caller', () => {
    expect(canAccessCompany(null, 'company-a')).toBe(false)
  })

  it('does not treat an empty company id as a wildcard', () => {
    expect(() => assertCompanyAccess({ ...partnerA, companyId: '' }, '')).toThrow(PortalAuthError)
  })
})

describe('tokens', () => {
  it('generates 256 bits of entropy, URL-safe', () => {
    const token = generateToken()
    expect(token.length).toBeGreaterThanOrEqual(43)
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('does not repeat', () => {
    const tokens = new Set(Array.from({ length: 500 }, () => generateToken()))
    expect(tokens.size).toBe(500)
  })

  it('matches a token against its stored hash', () => {
    const token = generateToken()
    expect(tokensMatch(token, hashToken(token))).toBe(true)
  })

  it('rejects a different token', () => {
    expect(tokensMatch(generateToken(), hashToken(generateToken()))).toBe(false)
  })

  it('rejects a malformed stored hash without throwing', () => {
    expect(tokensMatch(generateToken(), 'not-hex')).toBe(false)
    expect(tokensMatch(generateToken(), '')).toBe(false)
  })

  it('produces a hash that does not contain the token', () => {
    const token = generateToken()
    expect(hashToken(token)).not.toContain(token)
  })
})

describe('password policy', () => {
  it('accepts a reasonable passphrase', () => {
    expect(validatePassword('framing crew 2026')).toEqual([])
  })

  it('rejects short passwords', () => {
    expect(validatePassword('short1')).toContain('Use at least 12 characters.')
  })

  it('requires a number', () => {
    expect(validatePassword('allletterspassword')).toContain('Include at least one number.')
  })

  it('rejects predictable words tied to this business', () => {
    expect(validatePassword('hardyhomes2026!!')).toContain('Avoid common or easily guessed words.')
  })
})

describe('upload content sniffing', () => {
  const pdf = Buffer.concat([Buffer.from('%PDF-1.7\n'), Buffer.alloc(64, 1)])
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    Buffer.alloc(64, 1),
  ])
  const jpeg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(64, 1)])
  const html = Buffer.from('<!doctype html><script>alert(1)</script>                    ')

  it('identifies allowed types by their magic bytes', () => {
    expect(sniffMimeType(pdf)).toBe('application/pdf')
    expect(sniffMimeType(png)).toBe('image/png')
    expect(sniffMimeType(jpeg)).toBe('image/jpeg')
  })

  /**
   * Storage Rules cannot read file bytes — they only see the declared
   * contentType. This server-side sniff is the compensating control, so it is
   * the thing that actually stops an HTML payload named .pdf.
   */
  it('does not recognise HTML, however it is named', () => {
    expect(sniffMimeType(html)).toBeNull()
  })

  it('rejects a truncated header rather than guessing', () => {
    expect(sniffMimeType(Buffer.from('%PD'))).toBeNull()
  })

  it('no longer accepts formats the Storage Rules disallow', () => {
    // HEIC/WebP were dropped so the allow-list and storage.rules agree.
    const webp = Buffer.concat([
      Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP'), Buffer.alloc(32),
    ])
    expect(sniffMimeType(webp)).toBeNull()
  })
})

describe('filename sanitisation', () => {
  it('keeps only the final path segment, so traversal cannot survive', () => {
    expect(sanitiseFilename('../../etc/passwd')).toBe('passwd')
    expect(sanitiseFilename('..\\..\\windows\\system32')).toBe('system32')
    expect(sanitiseFilename('/absolute/path/coi.pdf')).toBe('coi.pdf')
  })

  it('removes characters that could break a Content-Disposition header', () => {
    const cleaned = sanitiseFilename('bad"name\r\nX-Injected: 1.pdf')
    expect(cleaned).not.toContain('"')
    expect(cleaned).not.toContain('\r')
    expect(cleaned).not.toContain('\n')
  })

  it('collapses repeated dots so a double extension cannot be smuggled', () => {
    expect(sanitiseFilename('invoice...pdf')).toBe('invoice.pdf')
  })

  it('never returns an empty name', () => {
    expect(sanitiseFilename('///')).toBe('document')
    expect(sanitiseFilename('')).toBe('document')
  })

  it('truncates absurdly long names', () => {
    expect(sanitiseFilename(`${'a'.repeat(500)}.pdf`).length).toBeLessThanOrEqual(120)
  })
})

describe('storage paths', () => {
  const base = { companyId: 'company-a', documentId: 'doc-1', filename: 'coi.pdf' }

  it('scopes the path to the company', () => {
    expect(buildStoragePath(base)).toMatch(/^trade-partners\/company-a\/documents\/doc-1\//)
  })

  it('gives every upload a fresh version segment, so nothing is overwritten', () => {
    // This is what makes replacement non-destructive and lets Storage Rules be
    // create-only: an approved file can never be written over in place.
    expect(buildStoragePath(base)).not.toBe(buildStoragePath(base))
  })

  it('cannot be steered outside the company prefix by hostile input', () => {
    const path = buildStoragePath({
      companyId: '../../other',
      documentId: '../etc',
      filename: '../../passwd',
    })
    expect(path).not.toContain('..')
    expect(path.startsWith('trade-partners/')).toBe(true)
  })

  it('recognises a path that belongs to the company', () => {
    expect(pathBelongsToCompany(buildStoragePath(base), 'company-a')).toBe(true)
  })

  it("rejects another company's path — the finalize-step IDOR guard", () => {
    const foreign = buildStoragePath({ ...base, companyId: 'company-b' })
    expect(pathBelongsToCompany(foreign, 'company-a')).toBe(false)
  })

  it('rejects traversal and empty input', () => {
    expect(pathBelongsToCompany('trade-partners/company-a/documents/../../x', 'company-a')).toBe(false)
    expect(pathBelongsToCompany('', 'company-a')).toBe(false)
    expect(pathBelongsToCompany('trade-partners/company-a/documents/x', '')).toBe(false)
  })
})

describe('audit redaction', () => {
  it('redacts anything that looks like a sensitive identifier', () => {
    const redacted = redact({
      ein: '87-1234567',
      policyNumber: 'GL-99887766',
      password: 'hunter2',
      token: 'abc',
      routingNumber: '124000054',
      companyName: 'Wasatch Framing',
    }) as Record<string, unknown>

    expect(redacted.ein).toBe('[redacted]')
    expect(redacted.policyNumber).toBe('[redacted]')
    expect(redacted.password).toBe('[redacted]')
    expect(redacted.token).toBe('[redacted]')
    expect(redacted.routingNumber).toBe('[redacted]')
    // Non-sensitive values survive, or the audit log would be useless.
    expect(redacted.companyName).toBe('Wasatch Framing')
  })

  it('redacts nested values too', () => {
    const redacted = redact({ outer: { inner: { ssn: '111-22-3333' } } }) as Record<string, any>
    expect(redacted.outer.inner.ssn).toBe('[redacted]')
  })

  it('truncates long strings rather than storing an essay', () => {
    const redacted = redact({ note: 'x'.repeat(1000) }) as Record<string, string>
    expect(redacted.note.length).toBeLessThan(320)
  })

  it('stops recursing on deeply nested input', () => {
    let deep: Record<string, unknown> = { value: 1 }
    for (let i = 0; i < 20; i++) deep = { nested: deep }
    expect(() => redact(deep)).not.toThrow()
  })
})

describe('email masking', () => {
  it('masks the local part in logs and audit summaries', () => {
    expect(maskEmail('brian@hre-utah.com')).toBe('b***n@hre-utah.com')
  })

  it('handles very short local parts', () => {
    expect(maskEmail('bh@example.com')).toBe('b***@example.com')
  })

  it('does not throw on malformed input', () => {
    expect(maskEmail('not-an-email')).toBe('[invalid]')
  })
})

describe('rate limiting', () => {
  beforeEach(() => resetRateLimits())

  it('allows requests up to the limit and blocks beyond it', () => {
    const key = 'login:203.0.113.10'
    for (let i = 0; i < LIMITS.login.limit; i++) {
      expect(rateLimit(key, LIMITS.login.limit, LIMITS.login.windowSeconds).allowed).toBe(true)
    }
    const blocked = rateLimit(key, LIMITS.login.limit, LIMITS.login.windowSeconds)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('tracks each key independently', () => {
    for (let i = 0; i < LIMITS.login.limit + 2; i++) {
      rateLimit('login:a', LIMITS.login.limit, LIMITS.login.windowSeconds)
    }
    expect(rateLimit('login:b', LIMITS.login.limit, LIMITS.login.windowSeconds).allowed).toBe(true)
  })

  it('resets once the window has passed', () => {
    const key = 'short-window'
    expect(rateLimit(key, 1, 0).allowed).toBe(true)
    expect(rateLimit(key, 1, 0).allowed).toBe(true)
  })

  // Regression: the login limiter originally consumed budget on EVERY attempt,
  // so ten successful sign-ins from one office IP locked everyone out. Only
  // failures may spend it.
  describe('peek / recordFailure split (login path)', () => {
    it('peeking never consumes budget', () => {
      const key = 'peek-only'
      for (let i = 0; i < 50; i++) {
        expect(peekRateLimit(key, 5).allowed).toBe(true)
      }
    })

    it('only recorded failures count toward the limit', () => {
      const key = 'failures-only'
      for (let i = 0; i < 5; i++) {
        expect(peekRateLimit(key, 5).allowed).toBe(true)
        recordFailure(key, 900)
      }
      expect(peekRateLimit(key, 5).allowed).toBe(false)
    })

    it('a successful sign-in clears the network budget', () => {
      const key = 'cleared-on-success'
      for (let i = 0; i < 5; i++) recordFailure(key, 900)
      expect(peekRateLimit(key, 5).allowed).toBe(false)

      clearRateLimit(key)
      expect(peekRateLimit(key, 5).allowed).toBe(true)
    })

    it('still blocks sustained guessing', () => {
      const key = 'stuffing'
      let blockedAt = -1
      for (let i = 0; i < 20; i++) {
        if (!peekRateLimit(key, LIMITS.login.limit).allowed) { blockedAt = i; break }
        recordFailure(key, LIMITS.login.windowSeconds)
      }
      expect(blockedAt).toBe(LIMITS.login.limit)
    })
  })
})
