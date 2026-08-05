'use client'

/**
 * Interactive portal pieces.
 *
 * Deliberately small: the portal is server-rendered and form-driven, so the only
 * client JavaScript is what genuinely improves a form on a phone — a disabled
 * submit button during a save, a visible save state, a file picker that shows
 * the chosen file, and yes/no toggles that reveal their explanation box.
 */

import { useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { ALLOWED_UPLOAD_LABEL } from '@/lib/portal/constants'

export function SubmitButton({
  children,
  variant = 'primary',
  size,
  block,
  pendingLabel = 'Saving…',
  confirm,
  name,
  value,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm'
  block?: boolean
  pendingLabel?: string
  /** When set, the browser asks for confirmation before the action runs. */
  confirm?: string
  name?: string
  value?: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      name={name}
      value={value}
      className={[
        'pt-btn',
        `pt-btn-${variant}`,
        size === 'sm' ? 'pt-btn-sm' : '',
        block ? 'pt-btn-block' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={pending}
      onClick={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault()
      }}
    >
      {pending ? pendingLabel : children}
    </button>
  )
}

/** Sticky save bar showing whether the current section has unsaved edits. */
export function SaveBar({
  savedAt,
  children,
}: {
  savedAt?: string | null
  children?: React.ReactNode
}) {
  const { pending } = useFormStatus()
  const [dirty, setDirty] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const form = barRef.current?.closest('form')
    if (!form) return
    const onInput = () => setDirty(true)
    form.addEventListener('input', onInput)
    form.addEventListener('change', onInput)
    return () => {
      form.removeEventListener('input', onInput)
      form.removeEventListener('change', onInput)
    }
  }, [])

  let status: string
  let saved = false
  if (pending) status = 'Saving…'
  else if (dirty) status = 'Unsaved changes'
  else if (savedAt) {
    status = `Saved ${savedAt}`
    saved = true
  } else status = 'Nothing saved yet'

  return (
    <div className="pt-savebar" ref={barRef}>
      <span className={`pt-savebar-status${saved ? ' is-saved' : ''}`} aria-live="polite">
        {status}
      </span>
      {children}
    </div>
  )
}

/** File input that reports the chosen filename and rejects oversized files early. */
export function FileField({
  name,
  maxBytes,
  required,
  id,
}: {
  name: string
  maxBytes: number
  required?: boolean
  id?: string
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const maxMb = Math.round(maxBytes / (1024 * 1024))

  return (
    <div>
      <input
        id={id ?? name}
        className="pt-input"
        type="file"
        name={name}
        required={required}
        accept=".pdf,.jpg,.jpeg,.png,.heic,.webp,application/pdf,image/*"
        aria-describedby={`${id ?? name}-help`}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) {
            setSelected(null)
            setError(null)
            return
          }
          if (file.size > maxBytes) {
            setError(`That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${maxMb} MB.`)
            setSelected(null)
            event.target.value = ''
            return
          }
          setError(null)
          setSelected(`${file.name} (${(file.size / 1024).toFixed(0)} KB)`)
        }}
      />
      <p className="pt-hint" id={`${id ?? name}-help`}>
        {ALLOWED_UPLOAD_LABEL}, up to {maxMb} MB. A photo of the document is fine as long as every
        line is readable.
      </p>
      {selected ? <p className="pt-hint" style={{ color: '#7fd0a5' }}>Selected: {selected}</p> : null}
      {error ? (
        <p className="pt-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/**
 * Yes/no disclosure that reveals its explanation box only when the answer is
 * yes — so Section F is a short list of questions rather than a wall of empty
 * textareas.
 */
export function DisclosureQuestion({
  name,
  question,
  defaultAnswer,
  defaultExplanation,
  explanationLabel = 'Please explain',
}: {
  name: string
  question: string
  defaultAnswer?: boolean | null
  defaultExplanation?: string | null
  explanationLabel?: string
}) {
  const [answer, setAnswer] = useState<'yes' | 'no' | ''>(
    defaultAnswer === true ? 'yes' : defaultAnswer === false ? 'no' : '',
  )

  return (
    <fieldset className="pt-fieldset" style={{ marginBottom: 18 }}>
      <legend className="pt-sr-only">{question}</legend>
      <p style={{ margin: '0 0 8px', fontSize: 15 }}>{question}</p>
      <div className="pt-radio-row">
        <label>
          <input
            type="radio"
            name={`${name}.answer`}
            value="yes"
            checked={answer === 'yes'}
            onChange={() => setAnswer('yes')}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name={`${name}.answer`}
            value="no"
            checked={answer === 'no'}
            onChange={() => setAnswer('no')}
          />
          No
        </label>
      </div>
      {answer === 'yes' ? (
        <div className="pt-field" style={{ marginTop: 10, marginBottom: 0 }}>
          <label className="pt-label" htmlFor={`${name}.explanation`}>
            {explanationLabel}
          </label>
          <textarea
            className="pt-textarea"
            id={`${name}.explanation`}
            name={`${name}.explanation`}
            defaultValue={defaultExplanation ?? ''}
            rows={3}
            required
          />
        </div>
      ) : (
        <input type="hidden" name={`${name}.explanation`} value="" />
      )}
    </fieldset>
  )
}

/** Reveals the mailing address block only when it differs from the business address. */
export function MailingAddressToggle({
  defaultSame,
  children,
}: {
  defaultSame: boolean
  children: React.ReactNode
}) {
  const [same, setSame] = useState(defaultSame)
  return (
    <>
      <label className="pt-check">
        <input
          type="checkbox"
          name="mailingSameAsBusiness"
          checked={same}
          onChange={(e) => setSame(e.target.checked)}
        />
        <span>The mailing address is the same as the business address.</span>
      </label>
      {!same ? children : null}
    </>
  )
}

/** Copy-to-clipboard for the invitation link. */
export function CopyButton({ value, label = 'Copy link' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="pt-btn pt-btn-ghost pt-btn-sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 2200)
        } catch {
          setCopied(false)
        }
      }}
    >
      {copied ? 'Copied' : label}
    </button>
  )
}

/** Reveals a reason box for the review decisions that require one. */
export function ReviewDecisionFields({ requireReasonFor }: { requireReasonFor: string[] }) {
  const [decision, setDecision] = useState('APPROVED')
  const needsReason = requireReasonFor.includes(decision)

  return (
    <>
      <div className="pt-field">
        <label className="pt-label" htmlFor="decision">
          Decision
        </label>
        <select
          className="pt-select"
          id="decision"
          name="decision"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
        >
          <option value="APPROVED">Approve</option>
          <option value="REJECTED">Reject — needs correction</option>
          <option value="UNDER_REVIEW">Mark under review</option>
          <option value="NOT_APPLICABLE">Not applicable for this company</option>
        </select>
      </div>
      <div className="pt-field">
        <label className="pt-label" htmlFor="reason">
          Reason {needsReason ? <span className="pt-req">*</span> : <span className="pt-muted">(optional)</span>}
        </label>
        <textarea
          className="pt-textarea"
          id="reason"
          name="reason"
          rows={2}
          required={needsReason}
          placeholder={
            decision === 'REJECTED'
              ? 'What needs to change? This is sent to the trade partner.'
              : decision === 'NOT_APPLICABLE'
                ? 'Why does this not apply to this company?'
                : 'Optional note sent to the trade partner.'
          }
        />
      </div>
    </>
  )
}
