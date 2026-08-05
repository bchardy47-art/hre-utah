'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { ReviewDecisionFields, SubmitButton } from '@/components/portal/client'
import { Field } from '@/components/portal/ui'
import { COMPANY_STATUS_META, STATUSES_REQUIRING_REASON } from '@/lib/portal/constants'
import type { CompanyStatusValue } from '@/lib/portal/db/schema'
import type { ActionState } from '@/lib/portal/validation'
import {
  addNoteAction,
  changeStatusAction,
  recordReferenceContactAction,
  reviewApplicationAction,
  reviewDocumentAction,
  verifyLicenseAction,
} from '../../actions'

function Banner({ state }: { state: ActionState }) {
  if (!state.message) return null
  return (
    <div className={`pt-notice pt-notice-${state.ok ? 'good' : 'bad'}`} role={state.ok ? 'status' : 'alert'}>
      <p>{state.message}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------

export function DocumentReviewForm({
  documentId,
  companyId,
}: {
  documentId: string
  companyId: string
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(reviewDocumentAction, {})

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="documentId" value={documentId} />
      <input type="hidden" name="companyId" value={companyId} />
      <Banner state={state} />
      <ReviewDecisionFields requireReasonFor={['REJECTED', 'NOT_APPLICABLE']} />
      <Field label="Internal note (not sent to the trade partner)" name={`notes-${documentId}`}>
        <textarea className="pt-textarea" id={`notes-${documentId}`} name="notes" rows={2} />
      </Field>
      <SubmitButton size="sm" pendingLabel="Recording…">
        Record decision
      </SubmitButton>
    </form>
  )
}

// ---------------------------------------------------------------------------

export function StatusForm({
  companyId,
  currentStatus,
  workEligible,
  workBlockers,
}: {
  companyId: string
  currentStatus: CompanyStatusValue
  workEligible: boolean
  workBlockers: string[]
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(changeStatusAction, {})
  const [status, setStatus] = useState<CompanyStatusValue>(currentStatus)

  const needsReason = STATUSES_REQUIRING_REASON.includes(status)
  const blockedByCompliance = (status === 'APPROVED_TO_WORK' || status === 'PREFERRED') && !workEligible

  const OPTIONS: CompanyStatusValue[] = [
    'APPLICATION_STARTED',
    'APPLICATION_SUBMITTED',
    'DOCUMENTATION_PENDING',
    'UNDER_REVIEW',
    'APPROVED_TO_BID',
    'APPROVED_TO_WORK',
    'PROBATIONARY',
    'PREFERRED',
    'SUSPENDED',
    'DO_NOT_USE',
    'INACTIVE_EXPIRED_DOCUMENTS',
  ]

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="companyId" value={companyId} />
      <Banner state={state} />

      <Field label="Set status to" name="status" error={state.errors?.status}>
        <select
          className="pt-select"
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as CompanyStatusValue)}
        >
          {OPTIONS.map((option) => (
            <option key={option} value={option}>
              {COMPANY_STATUS_META[option].label}
            </option>
          ))}
        </select>
      </Field>

      <p className="pt-hint">{COMPANY_STATUS_META[status].description}</p>

      {blockedByCompliance ? (
        <div className="pt-notice pt-notice-bad" role="alert">
          <div>
            <p>
              <strong>This company is not work-eligible yet.</strong> The system will refuse this
              change until these are resolved:
            </p>
            <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
              {workBlockers.map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <Field
        label={`Reason${needsReason ? '' : ' (optional)'}`}
        name="reason"
        error={state.errors?.reason}
        required={needsReason}
        hint={
          needsReason
            ? 'Required for this status. Recorded in the status history and the audit trail.'
            : 'Recorded in the status history.'
        }
      >
        <textarea className="pt-textarea" id="reason" name="reason" rows={3} required={needsReason} />
      </Field>

      <SubmitButton
        variant={status === 'SUSPENDED' || status === 'DO_NOT_USE' ? 'danger' : 'primary'}
        confirm={
          status === 'DO_NOT_USE'
            ? 'Mark this company Do Not Use? Their sessions end immediately and only an administrator can reverse it.'
            : status === 'SUSPENDED'
              ? 'Suspend this company? Their sessions end immediately.'
              : undefined
        }
        pendingLabel="Updating…"
      >
        Update status
      </SubmitButton>
    </form>
  )
}

// ---------------------------------------------------------------------------

export function ApplicationReviewForm({ companyId }: { companyId: string }) {
  const [state, formAction] = useFormState<ActionState, FormData>(reviewApplicationAction, {})
  const [decision, setDecision] = useState<'APPROVE' | 'RETURN'>('APPROVE')

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="companyId" value={companyId} />
      <Banner state={state} />

      <div className="pt-field">
        <span className="pt-label">Decision</span>
        <div className="pt-radio-row">
          <label>
            <input
              type="radio"
              name="decision"
              value="APPROVE"
              checked={decision === 'APPROVE'}
              onChange={() => setDecision('APPROVE')}
            />
            Approve application
          </label>
          <label>
            <input
              type="radio"
              name="decision"
              value="RETURN"
              checked={decision === 'RETURN'}
              onChange={() => setDecision('RETURN')}
            />
            Return for correction
          </label>
        </div>
      </div>

      <Field
        label={decision === 'RETURN' ? 'What needs correcting?' : 'Note (optional)'}
        name="reason"
        error={state.errors?.reason}
        required={decision === 'RETURN'}
        hint={decision === 'RETURN' ? 'Sent to the trade partner in an email.' : undefined}
      >
        <textarea
          className="pt-textarea"
          id="reason"
          name="reason"
          rows={3}
          required={decision === 'RETURN'}
        />
      </Field>

      <SubmitButton pendingLabel="Recording…">
        {decision === 'APPROVE' ? 'Approve application' : 'Return for correction'}
      </SubmitButton>
    </form>
  )
}

// ---------------------------------------------------------------------------

export function LicenseVerificationForm({
  licenseId,
  licenseNumber,
  currentStatus,
  defaultNotes,
  defaultSource,
}: {
  licenseId: string
  licenseNumber: string
  currentStatus: string
  defaultNotes: string | null
  defaultSource: string | null
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(verifyLicenseAction, {})

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="licenseId" value={licenseId} />
      <Banner state={state} />

      <div className="pt-notice pt-notice-draft">
        <p>
          Version 1 does not perform an automatic DOPL lookup. Check licence {licenseNumber} against
          the Utah DOPL record yourself, then record what you found here.
        </p>
      </div>

      <Field label="Verification result" name="verificationStatus">
        <select
          className="pt-select"
          id="verificationStatus"
          name="verificationStatus"
          defaultValue={currentStatus}
        >
          <option value="NOT_VERIFIED">Not verified yet</option>
          <option value="VERIFIED">Verified — active and correct</option>
          <option value="REJECTED">Rejected — does not match or is not active</option>
        </select>
      </Field>

      <Field
        label="Verification source"
        name="verificationSource"
        hint="Where you checked, for example the DOPL licence lookup URL."
      >
        <input
          className="pt-input"
          id="verificationSource"
          name="verificationSource"
          defaultValue={defaultSource ?? ''}
          placeholder="https://secure.utah.gov/llv/search/"
        />
      </Field>

      <Field label="Verification notes" name="verificationNotes">
        <textarea
          className="pt-textarea"
          id="verificationNotes"
          name="verificationNotes"
          rows={3}
          defaultValue={defaultNotes ?? ''}
        />
      </Field>

      <SubmitButton size="sm" pendingLabel="Recording…">
        Record verification
      </SubmitButton>
    </form>
  )
}

// ---------------------------------------------------------------------------

export function InternalNoteForm({
  companyId,
  documentId,
}: {
  companyId: string
  documentId?: string
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(addNoteAction, {})

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="companyId" value={companyId} />
      {documentId ? <input type="hidden" name="documentId" value={documentId} /> : null}
      <Banner state={state} />

      <Field
        label="Add an internal note"
        name={`note-${documentId ?? companyId}`}
        error={state.errors?.body}
        hint="Administrator only. Trade partners never see these. Notes cannot be edited or deleted once added."
      >
        <textarea
          className="pt-textarea"
          id={`note-${documentId ?? companyId}`}
          name="body"
          rows={3}
          placeholder="Reference contacted — strong framing crew, limited Utah County capacity."
        />
      </Field>

      <SubmitButton size="sm" pendingLabel="Adding…">
        Add note
      </SubmitButton>
    </form>
  )
}

// ---------------------------------------------------------------------------

export function ReferenceContactForm({
  projectId,
  referenceName,
  defaultNotes,
}: {
  projectId: string
  referenceName: string
  defaultNotes: string | null
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(recordReferenceContactAction, {})

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="projectId" value={projectId} />
      <Banner state={state} />
      <Field
        label={`What did ${referenceName} say?`}
        name={`ref-${projectId}`}
        error={state.errors?.contactNotes}
      >
        <textarea
          className="pt-textarea"
          id={`ref-${projectId}`}
          name="contactNotes"
          rows={3}
          defaultValue={defaultNotes ?? ''}
        />
      </Field>
      <SubmitButton size="sm" pendingLabel="Saving…">
        Record reference check
      </SubmitButton>
    </form>
  )
}
