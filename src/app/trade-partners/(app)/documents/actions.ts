'use server'

import { revalidatePath } from 'next/cache'
import { requireTradePartner } from '@/lib/portal/auth/guards'
import { recordAcknowledgment } from '@/lib/portal/services/documents'
import { acknowledgmentSchema, toFieldErrors, type ActionState } from '@/lib/portal/validation'

export async function acknowledgeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireTradePartner()

  const parsed = acknowledgmentSchema.safeParse({
    requirementId: formData.get('requirementId'),
    signerName: formData.get('signerName'),
    signerTitle: formData.get('signerTitle'),
    agreed: formData.get('agreed'),
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
