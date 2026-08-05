'use client'

import { useFormState } from 'react-dom'
import { SubmitButton } from '@/components/portal/client'
import { Field } from '@/components/portal/ui'
import type { ActionState } from '@/lib/portal/validation'
import { acknowledgeAction } from './actions'

export function AcknowledgeForm({
  requirementId,
  defaultName,
  summary,
}: {
  requirementId: string
  defaultName: string
  summary: string[]
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(acknowledgeAction, {})

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="requirementId" value={requirementId} />

      {state.message ? (
        <div
          className={`pt-notice pt-notice-${state.ok ? 'good' : 'bad'}`}
          role={state.ok ? 'status' : 'alert'}
        >
          <p>{state.message}</p>
        </div>
      ) : null}

      {summary.length > 0 ? (
        <>
          <p className="pt-sub pt-small">In summary, you agree to:</p>
          <ul style={{ paddingLeft: 20, margin: '6px 0 16px', lineHeight: 1.65, fontSize: 14.5 }}>
            {summary.map((line) => (
              <li key={line} style={{ marginBottom: 4 }}>
                {line}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <div className="pt-form-row pt-form-row-2">
        <Field label="Your full name" name={`ack-name-${requirementId}`} required>
          <input
            className="pt-input"
            id={`ack-name-${requirementId}`}
            name="signerName"
            defaultValue={defaultName}
            required
          />
        </Field>
        <Field label="Your title" name={`ack-title-${requirementId}`}>
          <input className="pt-input" id={`ack-title-${requirementId}`} name="signerTitle" />
        </Field>
      </div>

      <label className="pt-check">
        <input type="checkbox" name="agreed" required />
        <span>
          I am authorized to acknowledge this on behalf of the company. I understand the date, my
          name, and the network address used are recorded.
        </span>
      </label>

      <SubmitButton size="sm" pendingLabel="Recording…">
        Acknowledge
      </SubmitButton>
    </form>
  )
}
