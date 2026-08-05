'use client'

/**
 * Direct-to-R2 upload widget.
 *
 * Three steps, all visible to the person using it: ask the server for a signed
 * URL, PUT the file to storage, then tell the server to verify and record it.
 * Progress is shown because a certificate photo over a job-site connection is
 * not instant, and a silent spinner invites a second tap.
 */

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ALLOWED_UPLOAD_LABEL } from '@/lib/portal/constants'

type Phase = 'idle' | 'preparing' | 'uploading' | 'finalizing' | 'done' | 'error'

export function UploadPanel({
  companyId,
  requirementId,
  requiresExpiration,
  maxBytes,
  label,
}: {
  companyId: string
  requirementId: string
  requiresExpiration: boolean
  maxBytes: number
  label: string
}) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [percent, setPercent] = useState(0)
  const maxMb = Math.round(maxBytes / (1024 * 1024))

  const busy = phase === 'preparing' || phase === 'uploading' || phase === 'finalizing'

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const file = data.get('file')
    const expirationDate = String(data.get('expirationDate') ?? '')
    const effectiveDate = String(data.get('effectiveDate') ?? '')

    if (!(file instanceof File) || file.size === 0) {
      setPhase('error')
      setMessage('Choose a file first.')
      return
    }
    if (file.size > maxBytes) {
      setPhase('error')
      setMessage(`That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${maxMb} MB.`)
      return
    }
    if (requiresExpiration && !expirationDate) {
      setPhase('error')
      setMessage('Enter the expiration date shown on the document.')
      return
    }

    try {
      setPhase('preparing')
      setMessage(null)
      setPercent(0)

      const prepare = await fetch('/api/portal/uploads/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          requirementId,
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
          size: file.size,
        }),
      })
      const prepared = await prepare.json()
      if (!prepare.ok) throw new Error(prepared.error ?? 'Upload could not be prepared.')

      setPhase('uploading')
      await putWithProgress(prepared.uploadUrl, file, prepared.contentType, setPercent)

      setPhase('finalizing')
      const finalize = await fetch('/api/portal/uploads/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          requirementId,
          storageKey: prepared.storageKey,
          filename: file.name,
          effectiveDate,
          expirationDate,
        }),
      })
      const finalized = await finalize.json()
      if (!finalize.ok) throw new Error(finalized.error ?? 'The upload could not be recorded.')

      setPhase('done')
      setMessage('Uploaded. Hardy Homes will review it.')
      form.reset()
      router.refresh()
    } catch (error) {
      setPhase('error')
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="pt-field">
        <label className="pt-label" htmlFor={`file-${requirementId}`}>
          {label}
        </label>
        <input
          className="pt-input"
          id={`file-${requirementId}`}
          name="file"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.heic,.webp,application/pdf,image/*"
          required
          disabled={busy}
        />
        <p className="pt-hint">
          {ALLOWED_UPLOAD_LABEL}, up to {maxMb} MB. A clear photo is fine as long as every line is
          readable.
        </p>
      </div>

      <div className="pt-form-row pt-form-row-2">
        <div className="pt-field">
          <label className="pt-label" htmlFor={`eff-${requirementId}`}>
            Effective date
          </label>
          <input className="pt-input" id={`eff-${requirementId}`} name="effectiveDate" type="date" disabled={busy} />
        </div>
        <div className="pt-field">
          <label className="pt-label" htmlFor={`exp-${requirementId}`}>
            Expiration date
            {requiresExpiration ? <span className="pt-req">*</span> : null}
          </label>
          <input
            className="pt-input"
            id={`exp-${requirementId}`}
            name="expirationDate"
            type="date"
            required={requiresExpiration}
            disabled={busy}
          />
        </div>
      </div>

      {phase === 'uploading' ? (
        <div className="pt-mb">
          <div className="pt-progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${percent}%` }} />
          </div>
          <p className="pt-hint pt-mono">Uploading… {percent}%</p>
        </div>
      ) : null}

      {message ? (
        <p className={phase === 'done' ? 'pt-hint' : 'pt-error'} role={phase === 'error' ? 'alert' : 'status'} style={phase === 'done' ? { color: '#7fd0a5' } : undefined}>
          {message}
        </p>
      ) : null}

      <button type="submit" className="pt-btn pt-btn-primary" disabled={busy}>
        {phase === 'preparing'
          ? 'Preparing…'
          : phase === 'uploading'
            ? 'Uploading…'
            : phase === 'finalizing'
              ? 'Saving…'
              : 'Upload'}
      </button>
    </form>
  )
}

/** XHR rather than fetch, because fetch still cannot report upload progress. */
function putWithProgress(
  url: string,
  file: File,
  contentType: string,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Content-Type', contentType)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
    }
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error('The file could not be stored. Please try again.'))
    xhr.onerror = () => reject(new Error('The connection dropped during upload. Please try again.'))
    xhr.send(file)
  })
}
