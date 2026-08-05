'use server'

import { revalidatePath } from 'next/cache'
import { requireTradePartner } from '@/lib/portal/auth/guards'
import { recordAcknowledgment } from '@/lib/portal/services/documents'
import { acknowledgmentSchema, formText, formValue, toFieldErrors, type ActionState } from '@/lib/portal/validation'

export async function acknowledgeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireTradePartner()

  const parsed = acknowledgmentSchema.safeParse({
    requirementId: formValue(formData, 'requirementId'),
    signerName: formValue(formData, 'signerName'),
    signerTitle: formValue(formData, 'signerTitle'),
    agreed: formValue(formData, 'agreed'),
  })
  if (!parsed.success) {
    return { ok: false, errors: toFieldErrors(parsed.error), message: 'Please complete the acknowledgment.' }
  }

  const result = await recordAcknowledgment({
    // The company comes from the session, never the form.
    companyId: session.companyId,
    requirementId: parsed.data.requirementId,
    signerName: parsed.data.signerName,
    signerTitle: parsed.data.signerTitle,
    actor: session,
  })

  if (!result.ok) return { ok: false, message: result.error }

  revalidatePath('/trade-partners/documents')
  revalidatePath('/trade-partners/dashboard')
  return { ok: true, message: 'Acknowledgment recorded.' }
}
