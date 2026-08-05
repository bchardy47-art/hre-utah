/**
 * Step 1 of the direct-to-R2 upload.
 *
 * Authorizes the caller against the company, then returns a server-generated
 * object key and a short-lived signed PUT URL. Nothing is written to the
 * database here — see finalize.
 */

import { NextResponse } from 'next/server'
import { requireSessionApi, assertCompanyAccess, PortalAuthError } from '@/lib/portal/auth/guards'
import { prepareDocumentUpload } from '@/lib/portal/services/documents'
import { LIMITS, rateLimit } from '@/lib/portal/rate-limit'
import { isStorageConfigured } from '@/lib/portal/storage'
import { recordAudit, AUDIT } from '@/lib/portal/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await requireSessionApi()

    const limit = rateLimit(`upload:${session.userId}`, LIMITS.upload.limit, LIMITS.upload.windowSeconds)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many uploads in a short time. Please wait a few minutes.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
      )
    }

    const body = (await request.json()) as {
      companyId?: string
      requirementId?: string
      filename?: string
      contentType?: string
      size?: number
    }

    if (!body.companyId || !body.requirementId || !body.filename || !body.contentType) {
      return NextResponse.json({ error: 'Missing upload details.' }, { status: 400 })
    }

    // Record-level authorization: a trade partner may only ever prepare an
    // upload for their own company.
    //
    // This runs BEFORE the storage-configuration check on purpose. An
    // unauthorized caller should learn nothing about how the server is
    // configured — they get 403, not a 503 that confirms storage is missing.
    assertCompanyAccess(session, body.companyId)

    if (!isStorageConfigured()) {
      return NextResponse.json(
        { error: 'Document storage is not configured. Contact Hardy Homes.' },
        { status: 503 },
      )
    }

    const result = await prepareDocumentUpload({
      companyId: body.companyId,
      requirementId: body.requirementId,
      filename: body.filename,
      declaredType: body.contentType,
      declaredSize: Number(body.size ?? 0),
      actor: session,
    })

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

    return NextResponse.json({
      storageKey: result.storageKey,
      uploadUrl: result.uploadUrl,
      contentType: result.contentType,
    })
  } catch (error) {
    if (error instanceof PortalAuthError) {
      await recordAudit({
        action: AUDIT.ACCESS_DENIED,
        summary: `Denied upload preparation: ${error.message}`,
      })
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('[portal:upload:prepare]', error)
    return NextResponse.json({ error: 'Upload could not be prepared.' }, { status: 500 })
  }
}
