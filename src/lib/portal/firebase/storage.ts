/**
 * Private document storage on Firebase Storage.
 *
 * Path convention:
 *   trade-partners/{companyId}/documents/{documentId}/{versionId}/{safeFilename}
 *
 * Security properties this module is responsible for:
 *   - No object is ever public. Downloads are served by an authorized route that
 *     mints a short-lived signed URL after checking the caller against the
 *     document's owning company.
 *   - The path is SERVER-GENERATED. A client never chooses where its bytes land,
 *     so it cannot write into another company's prefix.
 *   - Every upload is verified server-side by magic bytes before a document row
 *     is created. Storage Rules cannot read file contents (see storage.rules);
 *     this is the compensating control, and it is the reason a `.pdf` containing
 *     HTML is rejected.
 *   - Replacement is write-once: a new version lands at a new {versionId} path,
 *     so an approved file can never be overwritten in place.
 *   - Filenames are sanitised before they appear in any header.
 *
 * Uploads go straight from the browser to Storage using the Web SDK, which keeps
 * a large scan away from Vercel's 4.5 MB serverless request-body cap.
 */

import 'server-only'
import { createHash, randomUUID } from 'node:crypto'
import { storageBucket } from './admin'
import { ALLOWED_UPLOAD_TYPES } from '../constants'

/** 10 MB, matching storage.rules. Both must be changed together. */
export const MAX_UPLOAD_BYTES = Number(process.env.PORTAL_MAX_UPLOAD_BYTES ?? 10 * 1024 * 1024)

export const STORAGE_ROOT = 'trade-partners'

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

/**
 * Builds the object path. `versionId` is fresh on every upload, which is what
 * makes replacement non-destructive and gives Storage Rules a create-only path.
 */
export function buildStoragePath(args: {
  companyId: string
  documentId: string
  versionId?: string
  filename: string
}): string {
  const companyId = safeSegment(args.companyId)
  const documentId = safeSegment(args.documentId)
  const versionId = safeSegment(args.versionId ?? randomUUID())
  const filename = sanitiseFilename(args.filename)
  return `${STORAGE_ROOT}/${companyId}/documents/${documentId}/${versionId}/${filename}`
}

export function buildTemplatePath(requirementCode: string, filename: string): string {
  return `${STORAGE_ROOT}/_templates/${safeSegment(requirementCode)}/${sanitiseFilename(filename)}`
}

/** Strips anything that could break out of a path segment. */
function safeSegment(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 80) || 'unknown'
}

/**
 * True when the path belongs to this company. Used before recording an upload,
 * so a client cannot hand back a path pointing at somebody else's prefix.
 */
export function pathBelongsToCompany(path: string, companyId: string): boolean {
  if (!path || !companyId) return false
  if (path.includes('..')) return false
  return path.startsWith(`${STORAGE_ROOT}/${safeSegment(companyId)}/documents/`)
}

export function sanitiseFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? 'document'
  return (
    base
      .replace(/[\x00-\x1f\x7f"'`\\/:*?<>|]/g, '')
      .replace(/\.{2,}/g, '.')
      .trim()
      .slice(0, 120) || 'document'
  )
}

// ---------------------------------------------------------------------------
// Content validation
// ---------------------------------------------------------------------------

/**
 * Sniffs the leading bytes. The declared Content-Type and the extension are
 * advisory only — a `.pdf` that is really HTML with a script payload must not be
 * accepted just because it is named convincingly.
 */
export function sniffMimeType(buffer: Buffer): string | null {
  if (buffer.length < 12) return null
  const hex = buffer.subarray(0, 12).toString('hex').toLowerCase()
  const ascii = buffer.subarray(0, 12).toString('latin1')

  if (ascii.startsWith('%PDF-')) return 'application/pdf'
  if (hex.startsWith('ffd8ff')) return 'image/jpeg'
  if (hex.startsWith('89504e470d0a1a0a')) return 'image/png'
  return null
}

export type VerifyResult =
  | { ok: true; mimeType: string; size: number; checksum: string | null }
  | { ok: false; reason: string }

/**
 * Re-reads an object the browser uploaded and validates it server-side.
 *
 * This is the trust boundary for direct uploads: what the client declared is
 * ignored entirely in favour of what Storage actually holds. Only the first
 * bytes are downloaded, so the check costs the same regardless of file size.
 */
export async function verifyUploadedObject(path: string): Promise<VerifyResult> {
  const file = storageBucket().file(path)

  let size: number
  let crc: string | null = null
  try {
    const [metadata] = await file.getMetadata()
    size = Number(metadata.size ?? 0)
    crc = (metadata.crc32c as string) ?? null
  } catch {
    return { ok: false, reason: 'The upload did not complete. Please try again.' }
  }

  if (size === 0) return { ok: false, reason: 'The file is empty.' }
  if (size > MAX_UPLOAD_BYTES) {
    const mb = Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))
    return { ok: false, reason: `Files must be ${mb} MB or smaller.` }
  }

  let head: Buffer
  try {
    const chunks: Buffer[] = []
    await new Promise<void>((resolve, reject) => {
      const stream = file.createReadStream({ start: 0, end: 15 })
      stream.on('data', (c: Buffer) => chunks.push(c))
      stream.on('end', () => resolve())
      stream.on('error', reject)
    })
    head = Buffer.concat(chunks)
  } catch {
    return { ok: false, reason: 'The upload could not be read.' }
  }

  const sniffed = sniffMimeType(head)
  if (!sniffed || !ALLOWED_UPLOAD_TYPES[sniffed]) {
    return {
      ok: false,
      reason:
        'That file type is not accepted. Please upload a PDF, JPG or PNG. ' +
        'If you renamed a file, upload the original instead.',
    }
  }

  return { ok: true, mimeType: sniffed, size, checksum: crc }
}

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

/**
 * Mints a short-lived signed download URL.
 *
 * CALLERS MUST have already authorized the request. This performs no access
 * control of its own — that lives in the route handler, which checks the
 * document's company against the session before calling here.
 */
export async function signedDownloadUrl(
  path: string,
  downloadFilename: string,
  expiresInSeconds = 60,
): Promise<string> {
  const safe = sanitiseFilename(downloadFilename)
  const [url] = await storageBucket()
    .file(path)
    .getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresInSeconds * 1000,
      responseDisposition: `attachment; filename="${safe}"`,
    })
  return url
}

export async function objectExists(path: string): Promise<boolean> {
  try {
    const [exists] = await storageBucket().file(path).exists()
    return exists
  } catch {
    return false
  }
}

/**
 * Only used to clean up an object that failed verification. Superseded documents
 * are never deleted — their objects are retained alongside their history.
 */
export async function deleteObject(path: string): Promise<void> {
  try {
    await storageBucket().file(path).delete()
  } catch {
    // Already gone, or never landed. Either way there is nothing to clean up.
  }
}

export async function putObject(path: string, body: Buffer, contentType: string): Promise<void> {
  await storageBucket().file(path).save(body, {
    contentType,
    resumable: false,
    metadata: { cacheControl: 'private, max-age=0, no-store' },
  })
}

export function checksumOf(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex')
}

export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      process.env.FIRESTORE_EMULATOR_HOST,
  )
}
