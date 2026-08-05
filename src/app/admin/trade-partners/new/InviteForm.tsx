'use client'

import { useFormState } from 'react-dom'
import { SubmitButton } from '@/components/portal/client'
import { Field } from '@/components/portal/ui'
import { TRADES } from '@/lib/portal/constants'
import type { ActionState } from '@/lib/portal/validation'
import { createInvitationAction } from '../../actions'

export default function InviteForm() {
  const [state, formAction] = useFormState<ActionState, FormData>(createInvitationAction, {})

  return (
    <form action={formAction} noValidate>
      {state.message ? (
        <div className="pt-notice pt-notice-bad" role="alert">
          <p>{state.message}</p>
        </div>
      ) : null}

      <Field
        label="Legal or known company name"
        name="companyName"
        error={state.errors?.companyName}
        hint="The company can correct this on its application."
        required
      >
        <input className="pt-input" id="companyName" name="companyName" required />
      </Field>

      <div className="pt-form-row pt-form-row-2">
        <Field label="Contact name" name="contactName" error={state.errors?.contactName} required>
          <input className="pt-input" id="contactName" name="contactName" required />
        </Field>
        <Field label="Contact phone" name="contactPhone" error={state.errors?.contactPhone}>
          <input className="pt-input" id="contactPhone" name="contactPhone" type="tel" inputMode="tel" />
        </Field>
      </div>

      <Field
        label="Contact email"
        name="contactEmail"
        error={state.errors?.contactEmail}
        hint="The invitation goes here. This becomes their sign-in address."
        required
      >
        <input
          className="pt-input"
          id="contactEmail"
          name="contactEmail"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          required
        />
      </Field>

      <Field label="Primary trade" name="primaryTrade" error={state.errors?.primaryTrade} required>
        <select className="pt-select" id="primaryTrade" name="primaryTrade" defaultValue="" required>
          <option value="" disabled>
            Select…
          </option>
          {TRADES.map((trade) => (
            <option key={trade} value={trade}>
              {trade}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Message (optional)"
        name="message"
        error={state.errors?.message}
        hint="Included in the invitation email. Useful for naming the project or person who referred them."
      >
        <textarea className="pt-textarea" id="message" name="message" rows={3} />
      </Field>

      <SubmitButton pendingLabel="Sending invitation…">Send invitation</SubmitButton>
    </form>
  )
}
