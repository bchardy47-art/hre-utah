/**
 * Private document storage on Cloudflare R2.
 *
 * Security properties this module is responsible for:
 *   - The bucket is private. No object is ever served from a public URL.
 *   - Object keys are opaque and randomised, so a key cannot be guessed from a
 *     company name or filename, and a leaked key is useless without a signature.
 *   - Downloads are served through an authorized route handler that checks the
 *     caller's access to the owning company *before* minting a signed URL, and
 *     the signature is valid for 60 seconds.
 *   - Uploaded content is validated by magic bytes, not by file extension.
 *   - Filenames are sanitised before they are echoed back in any header.
 *
 * R2 is S3-compatible, so the standard AWS SDK is used with a custom endpoint;
 * there is no Cloudflare-specific dependency.
 */

import 'server-only'
import { createHash, randomBytes } from 'node:crypto'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { serverEnv, MAX_UPLOAD_BYTES } from './env'
import { ALLOWED_UPLOAD_TYPES } from './constants'

let client: S3Client | null = null

function s3(): S3Client {
  if (client) return client
  const { accountId, accessKeyId, secretAccessKey, endpoint } = serverEnv.r2
  void accountId
  client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  })
  return client
}

// ---------------------------------------------------------------------------
// Object keys
// ---------------------------------------------------------------------------

/**
 * Builds an opaque object key. The company id is included as a prefix purely for
 * operational tidiness (lifecycle rules, bulk export); it is never used for
 * authorization — that decision always comes from the database row.
 */
export function buildStorageKey(companyId: string, requirementCode: string, ext: string): string {
  const safeExt = ext.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 8) || 'bin'
  const safeCode = requirementCode.replace(/[^A-Z0-9_]/gi, '').slice(0, 40)
  const nonce = randomBytes(16).toString('hex')
  const year = new Date().getUTCFullYear()
  return `companies/${companyId}/${year}/${safeCode}/${nonce}.${safeExt}`
}

export function buildTemplateKey(requirementCode: string, ext: string): string {
  const safeExt = ext.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 8) || 'bin'
  const safeCode = requirementCode.replace(/[^A-Z0-9_]/gi, '').slice(0, 40)
  return `templates/${safeCode}/${randomBytes(8).toString('hex')}.${safeExt}`
}

// ---------------------------------------------------------------------------
// Content validation
// ---------------------------------------------------------------------------

export type ValidationFailure = { ok: false; reason: string }
export type ValidationSuccess = {
  ok: true
  mimeType: string
  extension: string
  size: number
  checksum: string
}
export type ValidationResult = ValidationFailure | ValidationSuccess

/**
 * Sniffs the leading bytes of a buffer. Extensions and the browser-supplied
 * Content-Type are advisory only — a `.pdf` that is really an HTML file with a
 * script payload must not be accepted just because it is named convincingly.
 */
export function sniffMimeType(buffer: Buffer): string | null {
  if (buffer.length < 12) return null
  const hex = buffer.subarray(0, 12).toString('hex').toLowerCase()
  const ascii = buffer.subarray(0, 12).toString('latin1')

  if (ascii.startsWith('%PDF-')) return 'application/pdf'
  if (hex.startsWith('ffd8ff')) return 'image/jpeg'
  if (hex.startsWith('89504e470d0a1a0a')) return 'image/png'
  if (ascii.startsWith('RIFF') && buffer.subarray(8, 12).toString('latin1') === 'WEBP') {
    return 'image/webp'
  }
  // ISO-BMFF container: HEIC/HEIF brands live at bytes 8..12.
  if (buffer.subarray(4, 8).toString('latin1') === 'ftyp') {
    const brand = buffer.subarray(8, 12).toString('latin1')
    if (['heic', 'heix', 'hevc', 'heim', 'heis', 'mif1', 'msf1'].includes(brand)) {
      return 'image/heic'
    }
  }
  return null
}

export function sanitiseFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? 'document'
  return (
    base
      // Strip anything that could break a header or escape a path.
      .replace(/[\x00-\x1f\x7f"'`\\/:*?<>|]/g, '')
      .replace(/\.{2,}/g, '.')
      .trim()
      .slice(0, 120) || 'document'
  )
}

export function validateUpload(buffer: Buffer, declaredName: string): ValidationResult {
  if (buffer.length === 0) return { ok: false, reason: 'The file is empty.' }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    const mb = Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))
    return { ok: false, reason: `Files must be ${mb} MB or smaller.` }
  }

  const sniffed = sniffMimeType(buffer)
  if (!sniffed || !ALLOWED_UPLOAD_TYPES[sniffed]) {
    return {
      ok: false,
      reason:
        'That file type is not accepted. Please upload a PDF, JPG, PNG, HEIC or WebP. ' +
        'If you renamed a file, upload the original instead.',
    }
  }

  const allowed = ALLOWED_UPLOAD_TYPES[sniffed]
  const declaredExt = sanitiseFilename(declaredName).split('.').pop()?.toLowerCase() ?? ''
  // The extension does not have to match, but if it does we keep it so the
  // downloaded file opens in the right application.
  const extension = allowed.ext.includes(declaredExt) ? declaredExt : allowed.ext[0]

  return {
    ok: true,
    mimeType: sniffed,
    extension,
    size: buffer.length,
    checksum: createHash('sha256').update(buffer).digest('hex'),
  }
}

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

/**
 * Mints a short-lived signed PUT URL so the browser can upload straight to R2.
 *
 * Why direct-to-R2 rather than posting the file to our own server: Vercel caps a
 * serverless request body at 4.5 MB, and a phone photo of a certificate of
 * insurance is routinely larger than that. Routing the bytes around the function
 * keeps large uploads working and keeps the function fast.
 *
 * The security trade this creates is handled explicitly: the browser now writes
 * an object we have not inspected. So the key is server-generated (the client
 * cannot choose where it lands), the URL expires in five minutes, and nothing is
 * recorded in the database until `verifyUploadedObject` has re-read the object's
 * real size and leading bytes from R2. An object that fails that check is
 * deleted and never becomes a document.
 */
export async function signedUploadUrl(
  key: string,
  mimeType: string,
  expiresInSeconds = 300,
): Promise<string> {
  return getSignedUrl(
    s3(),
    new PutObjectCommand({
      Bucket: serverEnv.r2.bucket,
      Key: key,
      ContentType: mimeType,
    }),
    { expiresIn: expiresInSeconds },
  )
}

/**
 * Re-reads an object the browser uploaded and validates it server-side.
 *
 * This is the trust boundary for direct uploads: the declared type and size from
 * the client are ignored entirely in favour of what R2 actually holds.
 */
export async function verifyUploadedObject(
  key: string,
): Promise<
  | { ok: true; mimeType: string; size: number }
  | { ok: false; reason: string }
> {
  let size: number
  try {
    const head = await s3().send(
      new HeadObjectCommand({ Bucket: serverEnv.r2.bucket, Key: key }),
    )
    size = head.ContentLength ?? 0
  } catch {
    return { ok: false, reason: 'The upload did not complete. Please try again.' }
  }

  if (size === 0) return { ok: false, reason: 'The file is empty.' }
  if (size > MAX_UPLOAD_BYTES) {
    const mb = Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))
    return { ok: false, reason: `Files must be ${mb} MB or smaller.` }
  }

  // Range-read just the header so the check costs almost nothing regardless of
  // how large the file is.
  let head16: Buffer
  try {
    const result = await s3().send(
      new GetObjectCommand({ Bucket: serverEnv.r2.bucket, Key: key, Range: 'bytes=0-15' }),
    )
    const bytes = await result.Body?.transformToByteArray()
    if (!bytes) return { ok: false, reason: 'The upload could not be read.' }
    head16 = Buffer.from(bytes)
  } catch {
    return { ok: false, reason: 'The upload could not be read.' }
  }

  const sniffed = sniffMimeType(head16)
  if (!sniffed || !ALLOWED_UPLOAD_TYPES[sniffed]) {
    return {
      ok: false,
      reason:
        'That file type is not accepted. Please upload a PDF, JPG, PNG, HEIC or WebP. ' +
        'If you renamed a file, upload the original instead.',
    }
  }

  return { ok: true, mimeType: sniffed, size }
}

export async function putObject(
  key: string,
  body: Buffer,
  mimeType: string,
  metadata: Record<string, string> = {},
): Promise<void> {
  await s3().send(
    new PutObjectCommand({
      Bucket: serverEnv.r2.bucket,
      Key: key,
      Body: body,
      ContentType: mimeType,
      // Belt and braces: even if the bucket were misconfigured as public, this
      // header stops a browser from rendering the object inline.
      ContentDisposition: 'attachment',
      Metadata: metadata,
    }),
  )
}

/**
 * Mints a short-lived signed download URL.
 *
 * CALLERS MUST have already authorized the request. This function performs no
 * access control of its own — that lives in the route handler, which checks the
 * document's company against the session before calling here.
 */
export async function signedDownloadUrl(
  key: string,
  downloadFilename: string,
  expiresInSeconds = 60,
): Promise<string> {
  const safe = sanitiseFilename(downloadFilename)
  return getSignedUrl(
    s3(),
    new GetObjectCommand({
      Bucket: serverEnv.r2.bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${safe}"`,
    }),
    { expiresIn: expiresInSeconds },
  )
}

/** Streams an object back through our own server, so the R2 host is never exposed. */
export async function getObjectStream(key: string): Promise<{
  body: ReadableStream
  contentType: string
  contentLength: number
}> {
  const result = await s3().send(
    new GetObjectCommand({ Bucket: serverEnv.r2.bucket, Key: key }),
  )
  if (!result.Body) throw new Error('Object has no body.')
  return {
    body: result.Body.transformToWebStream(),
    contentType: result.ContentType ?? 'application/octet-stream',
    contentLength: result.ContentLength ?? 0,
  }
}

export async function objectExists(key: string): Promise<boolean> {
  try {
    await s3().send(new HeadObjectCommand({ Bucket: serverEnv.r2.bucket, Key: key }))
    return true
  } catch {
    return false
  }
}

/**
 * Only used for hard cleanup of an orphaned upload (a database write failed
 * after the object landed). Superseded documents are never deleted — their
 * objects are retained alongside their history.
 */
export async function deleteObject(key: string): Promise<void> {
  await s3().send(new DeleteObjectCommand({ Bucket: serverEnv.r2.bucket, Key: key }))
}

export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET,
  )
}
