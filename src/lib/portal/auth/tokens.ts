/**
 * Token generation and hashing for sessions and invitations.
 *
 * Rules enforced here:
 *   - Tokens are 32 bytes of CSPRNG output (256 bits), base64url-encoded.
 *   - Only the SHA-256 hash of a token is ever written to the database, so a
 *     database leak cannot be replayed as a login or a valid invitation.
 *   - Hash comparison is constant-time.
 */

import 'server-only'
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

/** 256 bits of entropy, URL-safe. */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url')
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}

/** Constant-time comparison of two hex digests. */
export function tokensMatch(rawToken: string, storedHash: string): boolean {
  const candidate = Buffer.from(hashToken(rawToken), 'hex')
  let stored: Buffer
  try {
    stored = Buffer.from(storedHash, 'hex')
  } catch {
    return false
  }
  if (candidate.length !== stored.length) return false
  return timingSafeEqual(candidate, stored)
}

/**
 * Invitation tokens are handed out in URLs, so they are kept a little shorter
 * for usability while staying well above any brute-forceable threshold.
 */
export function generateInvitationToken(): string {
  return generateToken(32)
}

export function generateSessionToken(): string {
  return generateToken(32)
}
