'use client'

import { useFormState } from 'react-dom'
import { SubmitButton } from '@/components/portal/client'
import { Field } from '@/components/portal/ui'
import type { ActionState } from '@/lib/portal/validation'
import { loginAction } from '../auth-actions'

export default function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useFormState<ActionState, FormData>(loginAction, {})

  return (
    <form action={formAction} noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {state.message ? (
        <div className="pt-notice pt-notice-bad" role="alert">
          <p>{state.message}</p>
        </div>
      ) : null}

      <Field label="Email address" name="email" error={state.errors?.email} required>
        <input
          className="pt-input"
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          aria-invalid={state.errors?.email ? true : undefined}
        />
      </Field>

      <Field label="Password" name="password" error={state.errors?.password} required>
        <input
          className="pt-input"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state.errors?.password ? true : undefined}
        />
      </Field>

      <SubmitButton block pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  )
}
