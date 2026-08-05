/**
 * Step 3 of the direct-to-R2 upload.
 *
 * Re-reads the uploaded object from R2, validates its real size and leading
 * bytes, and records the document. This is the trust boundary — the client's
 * claims about the file are ignored here.
 */

import { NextResponse } from 'next/server'
import { requireSessionApi, assertCompanyAccess, PortalAuthError } from '@/lib/portal/auth/guards'
import { finalizeDocumentUpload } from '@/lib/portal/services/documents'
import { recordAudit, AUDIT } from '@/lib/portal/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function parseDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null
  const date = new Date(`${value}T12:00:00Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

export async function POST(request: Request) {
  try {
    const session = await requireSessionApi()

    const body = (await request.json()) as {
      companyId?: string
      requirementId?: string
      storageKey?: string
      filename?: string
      effectiveDate?: string
      expirationDate?: string
    }

    if (!body.companyId || !body.requirementId || !body.storageKey || !body.filename) {
      return NextResponse.json({ error: 'Missing upload details.' }, { status: 400 })
    }

    assertCompanyAccess(session, body.companyId)

    const result = await finalizeDocumentUpload({
      companyId: body.companyId,
      requirementId: body.requirementId,
      storageKey: body.storageKey,
      filename: body.filename,
      effectiveDate: parseDate(body.effectiveDate),
      expirationDate: parseDate(body.expirationDate),
      actor: session,
    })

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ ok: true, documentId: result.documentId })
  } catch (error) {
    if (error instanceof PortalAuthError) {
      await recordAudit({
        action: AUDIT.ACCESS_DENIED,
        summary: `Denied upload finalization: ${error.message}`,
      })
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('[portal:upload:finalize]', error)
    return NextResponse.json({ error: 'The upload could not be recorded.' }, { status: 500 })
  }
}
