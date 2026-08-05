'use client'

import { useFormState } from 'react-dom'
import { SubmitButton } from '@/components/portal/client'
import { Field } from '@/components/portal/ui'
import type { ActionState } from '@/lib/portal/validation'
import { acceptInvitationAction } from '../../auth-actions'

export default function AcceptForm({
  token,
  email,
  contactName,
}: {
  token: string
  email: string
  contactName: string
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(acceptInvitationAction, {})

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="token" value={token} />

      {state.message ? (
        <div className="pt-notice pt-notice-bad" role="alert">
          <p>{state.message}</p>
        </div>
      ) : null}

      <Field
        label="Email address"
        name="emailDisplay"
        hint="This is the address Hardy Homes invited and cannot be changed here."
      >
        <input className="pt-input" id="emailDisplay" type="email" value={email} readOnly disabled />
      </Field>

      <Field label="Your full name" name="name" error={state.errors?.name} required>
        <input
          className="pt-input"
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={contactName}
          required
          aria-invalid={state.errors?.name ? true : undefined}
        />
      </Field>

      <Field label="Mobile phone" name="phone" error={state.errors?.phone} hint="Optional.">
        <input
          className="pt-input"
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
        />
      </Field>

      <Field
        label="Create a password"
        name="password"
        error={state.errors?.password}
        hint="At least 12 characters, including a number. A short phrase you will remember works well."
        required
      >
        <input
          className="pt-input"
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          aria-invalid={state.errors?.password ? true : undefined}
        />
      </Field>

      <Field
        label="Confirm password"
        name="confirmPassword"
        error={state.errors?.confirmPassword}
        required
      >
        <input
          className="pt-input"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          aria-invalid={state.errors?.confirmPassword ? true : undefined}
        />
      </Field>

      <SubmitButton block pendingLabel="Creating your account…">
        Create account and continue
      </SubmitButton>
    </form>
  )
}
