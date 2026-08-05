/**
 * The scheduled compliance sweep endpoint.
 *
 * Scheduling: Vercel Cron (see vercel.json) calls this once a day. Vercel signs
 * cron requests with the `CRON_SECRET` environment variable as a bearer token,
 * so this route authenticates the caller before doing anything — otherwise it
 * would be a public URL that anyone could use to blast reminder emails.
 *
 * An authenticated administrator may also trigger it by hand, which is useful
 * for verifying the sweep after a deploy without waiting a day.
 *
 * The sweep is idempotent, so running it twice is harmless.
 */

import { NextResponse } from 'next/server'
import { runComplianceSweep } from '@/lib/portal/services/expiration'
import { getSession } from '@/lib/portal/auth/session'
import { serverEnv } from '@/lib/portal/env'
import { recordAudit, AUDIT } from '@/lib/portal/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// The sweep touches every company; give it more than the default 10s.
export const maxDuration = 60

async function authorize(request: Request): Promise<{ ok: boolean; actor: string }> {
  const secret = serverEnv.cronSecret
  if (secret) {
    const header = request.headers.get('authorization')
    if (header === `Bearer ${secret}`) return { ok: true, actor: 'Vercel Cron' }
  }

  // Fall back to an authenticated administrator triggering it manually.
  const session = await getSession()
  if (session?.role === 'ADMIN') return { ok: true, actor: `${session.name} (manual)` }

  return { ok: false, actor: 'unknown' }
}

async function handle(request: Request) {
  const auth = await authorize(request)
  if (!auth.ok) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
  }

  if (!process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    console.warn(
      '[portal:cron] CRON_SECRET is not set. The scheduled sweep will be rejected until it is.',
    )
  }

  const started = Date.now()
  const result = await runComplianceSweep()

  await recordAudit({
    action: AUDIT.NOTIFICATION_SENT,
    summary: `Compliance sweep completed in ${Date.now() - started}ms — ${result.documentsExpired} expired, ${result.remindersSent} reminders sent, ${result.companiesDemoted} companies demoted`,
    actorLabel: `System — ${auth.actor}`,
    metadata: { ...result },
  })

  return NextResponse.json(result, { status: result.errors.length > 0 ? 207 : 200 })
}

export async function GET(request: Request) {
  return handle(request)
}

export async function POST(request: Request) {
  return handle(request)
}
