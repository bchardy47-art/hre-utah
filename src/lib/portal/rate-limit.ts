/**
 * Small in-process rate limiter.
 *
 * Scope and honesty about it: this is a per-instance fixed window. On Vercel,
 * concurrent lambdas each hold their own counter, so the effective limit is
 * (limit x warm instances). That is sufficient to blunt credential stuffing and
 * accidental upload storms at this scale, and it costs nothing.
 *
 * If the portal ever needs a hard guarantee — say, a strict lockout policy — the
 * replacement is a shared store (Upstash Redis or a Postgres table). The
 * interface below is deliberately narrow so that swap is a single file change.
 * The per-account lockout in the login flow is stored in the database and IS
 * durable across instances; this limiter is the additional per-IP layer.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()
const MAX_TRACKED_KEYS = 10_000

function sweep(now: number) {
  if (buckets.size < MAX_TRACKED_KEYS) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
  // Still oversized: drop the oldest entries rather than grow without bound.
  if (buckets.size >= MAX_TRACKED_KEYS) {
    const excess = buckets.size - Math.floor(MAX_TRACKED_KEYS * 0.8)
    let removed = 0
    for (const key of buckets.keys()) {
      buckets.delete(key)
      if (++removed >= excess) break
    }
  }
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

export function rateLimit(key: string, limit: number, windowSeconds: number): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 }
  }

  existing.count += 1
  const allowed = existing.count <= limit
  return {
    allowed,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSeconds: allowed ? 0 : Math.ceil((existing.resetAt - now) / 1000),
  }
}

export const LIMITS = {
  /** Login attempts per IP. The per-account lockout is separate and durable. */
  login: { limit: 10, windowSeconds: 15 * 60 },
  /** Invitation token lookups per IP — stops token enumeration. */
  inviteLookup: { limit: 20, windowSeconds: 15 * 60 },
  /** Account activations per IP. */
  activation: { limit: 5, windowSeconds: 60 * 60 },
  /** File uploads per user. */
  upload: { limit: 40, windowSeconds: 60 * 60 },
  /** Signed download links per user. */
  download: { limit: 120, windowSeconds: 60 * 60 },
  /** Invitations created per admin. */
  invite: { limit: 50, windowSeconds: 60 * 60 },
} as const

export function resetRateLimits(): void {
  buckets.clear()
}
