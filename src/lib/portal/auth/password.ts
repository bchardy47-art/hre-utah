/**
 * Password hashing and policy.
 *
 * bcryptjs is used rather than a native binding so the portal builds and runs
 * identically on Vercel, locally, and in CI with no compilation step.
 */

import 'server-only'
import bcrypt from 'bcryptjs'

const COST = 12

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash)
  } catch {
    return false
  }
}

export type PasswordProblem = string

/**
 * Deliberately simple and explainable — field contractors set these on a phone.
 * Length does the heavy lifting; character-class rules mostly produce
 * predictable substitutions.
 */
export function validatePassword(plain: string): PasswordProblem[] {
  const problems: PasswordProblem[] = []
  if (plain.length < 12) problems.push('Use at least 12 characters.')
  if (plain.length > 200) problems.push('Use fewer than 200 characters.')
  if (!/[a-zA-Z]/.test(plain)) problems.push('Include at least one letter.')
  if (!/[0-9]/.test(plain)) problems.push('Include at least one number.')
  if (/^\s|\s$/.test(plain)) problems.push('Remove leading or trailing spaces.')

  const lowered = plain.toLowerCase()
  const banned = ['password', 'hardyhomes', 'hardy homes', 'tradepartner', '123456', 'qwerty']
  if (banned.some((b) => lowered.includes(b))) {
    problems.push('Avoid common or easily guessed words.')
  }
  return problems
}
