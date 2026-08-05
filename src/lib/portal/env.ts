/**
 * Server-only environment access for the Trade Partner Portal.
 *
 * Nothing in this file may be imported from a client component. Values are read
 * lazily so that `next build` can prerender the public marketing pages without
 * portal secrets being present — the portal routes themselves are dynamic and
 * will fail loudly at request time if configuration is missing.
 */

import 'server-only'

class MissingEnvError extends Error {
  constructor(name: string) {
    super(
      `Missing required environment variable: ${name}. ` +
        `See docs/TRADE_PARTNER_PORTAL.md for the full list.`,
    )
    this.name = 'MissingEnvError'
  }
}

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new MissingEnvError(name)
  return value
}

function optional(name: string, fallback = ''): string {
  return process.env[name] ?? fallback
}

export const serverEnv = {
  get databaseUrl() {
    return required('DATABASE_URL')
  },

  /** 32+ byte random string used to derive session and invitation token HMACs. */
  get portalSecret() {
    const value = required('PORTAL_SESSION_SECRET')
    if (value.length < 32) {
      throw new Error('PORTAL_SESSION_SECRET must be at least 32 characters.')
    }
    return value
  },

  get appUrl() {
    return optional('NEXT_PUBLIC_APP_URL', 'https://hre-utah.com').replace(/\/$/, '')
  },

  // --- Cloudflare R2 (private document storage) ----------------------------
  get r2() {
    return {
      accountId: required('R2_ACCOUNT_ID'),
      accessKeyId: required('R2_ACCESS_KEY_ID'),
      secretAccessKey: required('R2_SECRET_ACCESS_KEY'),
      bucket: required('R2_BUCKET'),
      endpoint:
        process.env.R2_ENDPOINT ??
        `https://${required('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
    }
  },

  // --- Email (Resend) -------------------------------------------------------
  get resendApiKey() {
    return optional('RESEND_API_KEY')
  },
  get mailFrom() {
    return optional('PORTAL_FROM_EMAIL', optional('RESEND_FROM_EMAIL', 'contact@hre-utah.com'))
  },
  /** Where administrator-facing portal notifications are delivered. */
  get adminNotifyEmail() {
    return optional('PORTAL_ADMIN_EMAIL', optional('CONTACT_TO_EMAIL', 'Hardyhomesutah@gmail.com'))
  },

  /** Shared secret required by the Vercel Cron expiration sweep. */
  get cronSecret() {
    return optional('CRON_SECRET')
  },

  get isProduction() {
    return process.env.NODE_ENV === 'production'
  },
  /** Seed/fixture routes refuse to run unless this is explicitly enabled. */
  get allowSeed() {
    return process.env.NODE_ENV !== 'production' || process.env.PORTAL_ALLOW_SEED === 'true'
  },
}

export const INVITATION_TTL_DAYS = Number(process.env.PORTAL_INVITE_TTL_DAYS ?? 14)
export const SESSION_TTL_HOURS = Number(process.env.PORTAL_SESSION_TTL_HOURS ?? 12)
export const MAX_UPLOAD_BYTES = Number(process.env.PORTAL_MAX_UPLOAD_BYTES ?? 15 * 1024 * 1024)
