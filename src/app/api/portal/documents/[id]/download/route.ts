/**
 * Authorized document download.
 *
 * The R2 bucket is private and its object keys are opaque, so this route is the
 * only way to reach a stored file. The order of operations matters:
 *
 *   1. Authenticate the session (server-side, from the database).
 *   2. Load the document row and read the company it belongs to.
 *   3. Authorize that specific company against the session — an administrator
 *      may read any, a trade partner may read only their own.
 *   4. Only then mint a 60-second signed URL and redirect to it.
 *
 * Because the authorization decision comes from the database row rather than the
 * URL, changing the id in the address bar to another company's document returns
 * 403 and writes an audit event.
 */

import { NextResponse } from 'next/server'
import {
  assertCompanyAccess,
  PortalAuthError,
  requireSessionApi,
} from '@/lib/portal/auth/guards'
import { getDocumentForAccess } from '@/lib/portal/services/documents'
import { signedDownloadUrl } from '@/lib/portal/storage'
import { AUDIT, recordAudit } from '@/lib/portal/audit'
import { LIMITS, rateLimit } from '@/lib/portal/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const NO_STORE = {
  'Cache-Control': 'no-store, private, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireSessionApi()

    const limit = rateLimit(
      `download:${session.userId}`,
      LIMITS.download.limit,
      LIMITS.download.windowSeconds,
    )
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Too many downloads. Please wait a moment.' }, { status: 429 })
    }

    const row = await getDocumentForAccess(params.id)
    if (!row) {
      // Deliberately 404 rather than confirming the id exists elsewhere.
      return NextResponse.json({ error: 'Not found.' }, { status: 404, headers: NO_STORE })
    }

    try {
      assertCompanyAccess(session, row.document.companyId)
    } catch (error) {
      await recordAudit({
        action: AUDIT.ACCESS_DENIED,
        summary: 'Attempted to download a document belonging to another company',
        companyId: row.document.companyId,
        actor: session,
        targetType: 'document',
        targetId: params.id,
      })
      throw error
    }

    if (!row.document.storageKey) {
      return NextResponse.json(
        { error: 'This record has no stored file.' },
        { status: 404, headers: NO_STORE },
      )
    }

    const filename =
      row.document.originalFilename ??
      `${row.requirement.code.toLowerCase()}-v${row.document.version}.pdf`

    const url = await signedDownloadUrl(row.document.storageKey, filename, 60)

    await recordAudit({
      action: AUDIT.DOCUMENT_DOWNLOADED,
      summary: `Downloaded ${row.requirement.name} (version ${row.document.version})`,
      companyId: row.document.companyId,
      actor: session,
      targetType: 'document',
      targetId: params.id,
    })

    return NextResponse.redirect(url, { status: 302, headers: NO_STORE })
  } catch (error) {
    if (error instanceof PortalAuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode, headers: NO_STORE },
      )
    }
    console.error('[portal:download]', error)
    return NextResponse.json(
      { error: 'The file could not be retrieved.' },
      { status: 500, headers: NO_STORE },
    )
  }
}
