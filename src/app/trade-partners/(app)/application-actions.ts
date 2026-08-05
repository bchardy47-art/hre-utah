'use server'

import { revalidatePath } from 'next/cache'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/portal/db'
import {
  applications,
  companies,
  contacts,
  insurancePolicies,
  licenses,
  projectReferences,
} from '@/lib/portal/db/schema'
import type { ContactRoleValue, InsuranceKindValue, ProjectKindValue } from '@/lib/portal/db/schema'
import { requireTradePartner } from '@/lib/portal/auth/guards'
import { requestContext } from '@/lib/portal/auth/session'
import { AUDIT, recordAudit } from '@/lib/portal/audit'
import { advanceLifecycleStatus } from '@/lib/portal/services/status'
import { sendPortalEmail } from '@/lib/portal/email/mailer'
import { NOTIFICATION_TYPES } from '@/lib/portal/email/templates'
import { serverEnv } from '@/lib/portal/env'
import { APPLICATION_SECTIONS, CERTIFICATION_VERSION } from '@/lib/portal/constants'
import { certificationSchema, collectIndexed, companySectionSchema, disclosuresSectionSchema, experienceSectionSchema, formText, formValue, insuranceSectionSchema, licensingSectionSchema, toFieldErrors, type ActionState } from '@/lib/portal/validation'

/**
 * Application section saves.
 *
 * All of these follow the same shape: authenticate, validate, write inside a
 * transaction, mark the section complete, audit. A trade partner can only ever
 * write to their own company because `requireTradePartner` returns the companyId
 * from the session — it is never read from the form.
 */

async function markSectionComplete(companyId: string, sectionKey: string, complete = true) {
  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.companyId, companyId))
    .limit(1)

  const progress = { ...((application?.sectionProgress ?? {}) as Record<string, boolean>) }
  progress[sectionKey] = complete

  const nextStatus =
    application?.status === 'NOT_STARTED' || !application?.status
      ? 'IN_PROGRESS'
      : application.status === 'RETURNED_FOR_CORRECTION'
        ? 'RETURNED_FOR_CORRECTION'
        : application.status

  if (application) {
    await db
      .update(applications)
      .set({ sectionProgress: progress, lastSection: sectionKey, status: nextStatus })
      .where(eq(applications.companyId, companyId))
  } else {
    await db.insert(applications).values({
      companyId,
      sectionProgress: progress,
      lastSection: sectionKey,
      status: 'IN_PROGRESS',
    })
  }

  await advanceLifecycleStatus(companyId, 'APPLICATION_STARTED')
}

function revalidatePortal() {
  revalidatePath('/trade-partners/company')
  revalidatePath('/trade-partners/dashboard')
  revalidatePath('/trade-partners/documents')
}

// ---------------------------------------------------------------------------
// Section A — company information
// ---------------------------------------------------------------------------

export async function saveCompanySection(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireTradePartner()

  const parsed = companySectionSchema.safeParse({
    legalName: formValue(formData, 'legalName'),
    dba: formValue(formData, 'dba'),
    entityType: formValue(formData, 'entityType'),
    einLast4: formValue(formData, 'einLast4'),
    businessAddress1: formValue(formData, 'businessAddress1'),
    businessAddress2: formValue(formData, 'businessAddress2'),
    businessCity: formValue(formData, 'businessCity'),
    businessState: formValue(formData, 'businessState'),
    businessZip: formValue(formData, 'businessZip'),
    mailingSameAsBusiness: formData.get('mailingSameAsBusiness') === 'on',
    mailingAddress1: formValue(formData, 'mailingAddress1'),
    mailingAddress2: formValue(formData, 'mailingAddress2'),
    mailingCity: formValue(formData, 'mailingCity'),
    mailingState: formValue(formData, 'mailingState'),
    mailingZip: formValue(formData, 'mailingZip'),
    mainPhone: formValue(formData, 'mainPhone'),
    generalEmail: formValue(formData, 'generalEmail'),
    website: formValue(formData, 'website'),
    yearEstablished: formValue(formData, 'yearEstablished') || undefined,
    yearsInBusiness: formValue(formData, 'yearsInBusiness') || undefined,
    primaryTrade: formValue(formData, 'primaryTrade'),
    additionalTrades: formData.getAll('additionalTrades').map(String),
    serviceAreas: formData.getAll('serviceAreas').map(String),
    typicalProjectSize: formValue(formData, 'typicalProjectSize'),
    largestProject: formValue(formData, 'largestProject'),
    crewSize: formValue(formData, 'crewSize') || undefined,
    annualCapacity: formValue(formData, 'annualCapacity'),
    currentBacklog: formValue(formData, 'currentBacklog'),
    usesLowerTierSubs: formData.get('usesLowerTierSubs') === 'yes',
    description: formValue(formData, 'description'),
  })

  if (!parsed.success) {
    return { ok: false, errors: toFieldErrors(parsed.error), message: 'Please check the highlighted fields.' }
  }

  const d = parsed.data
  await db
    .update(companies)
    .set({
      legalName: d.legalName,
      dba: d.dba ?? null,
      entityType: d.entityType,
      // Only the last four digits are ever written. See the schema comment.
      einLast4: d.einLast4 ?? null,
      einConfirmedAt: d.einLast4 ? new Date() : null,
      businessAddress1: d.businessAddress1,
      businessAddress2: d.businessAddress2 ?? null,
      businessCity: d.businessCity,
      businessState: d.businessState.toUpperCase(),
      businessZip: d.businessZip,
      mailingSameAsBusiness: d.mailingSameAsBusiness,
      mailingAddress1: d.mailingSameAsBusiness ? null : (d.mailingAddress1 ?? null),
      mailingAddress2: d.mailingSameAsBusiness ? null : (d.mailingAddress2 ?? null),
      mailingCity: d.mailingSameAsBusiness ? null : (d.mailingCity ?? null),
      mailingState: d.mailingSameAsBusiness ? null : (d.mailingState?.toUpperCase() ?? null),
      mailingZip: d.mailingSameAsBusiness ? null : (d.mailingZip ?? null),
      mainPhone: d.mainPhone,
      generalEmail: d.generalEmail,
      website: d.website ?? null,
      yearEstablished: d.yearEstablished ?? null,
      yearsInBusiness: d.yearsInBusiness ?? null,
      primaryTrade: d.primaryTrade,
      additionalTrades: d.additionalTrades,
      serviceAreas: d.serviceAreas,
      typicalProjectSize: d.typicalProjectSize ?? null,
      largestProject: d.largestProject ?? null,
      crewSize: d.crewSize ?? null,
      annualCapacity: d.annualCapacity ?? null,
      currentBacklog: d.currentBacklog ?? null,
      usesLowerTierSubs: d.usesLowerTierSubs ?? null,
      description: d.description ?? null,
      updatedAt: new Date(),
    })
    .where(eq(companies.id, session.companyId))

  await markSectionComplete(session.companyId, 'company')
  await recordAudit({
    action: AUDIT.APPLICATION_SECTION_SAVED,
    summary: 'Company information saved',
    companyId: session.companyId,
    actor: session,
    metadata: { section: 'company' },
  })

  revalidatePortal()
  return { ok: true, message: 'Company information saved.' }
}

// ---------------------------------------------------------------------------
// Section B — contacts
// ---------------------------------------------------------------------------

export async function saveContactsSection(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireTradePartner()
  const rows = collectIndexed(formData, 'contacts')

  const primary = rows.find((r) => r.role === 'PRIMARY')
  if (!primary?.name?.trim() || !primary?.email?.trim()) {
    return {
      ok: false,
      message: 'A primary contact name and email address are required.',
      errors: { 'contacts.primary': 'Enter a name and email for the primary contact.' },
    }
  }

  await db.transaction(async (tx) => {
    for (const row of rows) {
      const role = row.role as ContactRoleValue
      const name = row.name?.trim() ?? ''

      if (!name) {
        // An emptied optional contact is removed rather than left as a blank row.
        await tx.delete(contacts).where(and(eq(contacts.companyId, session.companyId), eq(contacts.role, role)))
        continue
      }

      await tx
        .insert(contacts)
        .values({
          companyId: session.companyId,
          role,
          name,
          title: row.title?.trim() || null,
          email: row.email?.trim().toLowerCase() || null,
          phone: row.phone?.trim() || null,
        })
        .onConflictDoUpdate({
          target: [contacts.companyId, contacts.role],
          set: {
            name,
            title: row.title?.trim() || null,
            email: row.email?.trim().toLowerCase() || null,
            phone: row.phone?.trim() || null,
            updatedAt: new Date(),
          },
        })
    }
  })

  await markSectionComplete(session.companyId, 'contacts')
  await recordAudit({
    action: AUDIT.APPLICATION_SECTION_SAVED,
    summary: 'Contacts saved',
    companyId: session.companyId,
    actor: session,
    metadata: { section: 'contacts', count: rows.filter((r) => r.name?.trim()).length },
  })

  revalidatePortal()
  return { ok: true, message: 'Contacts saved.' }
}

// ---------------------------------------------------------------------------
// Section C — licensing
// ---------------------------------------------------------------------------

export async function saveLicensingSection(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireTradePartner()

  const parsed = licensingSectionSchema.safeParse({
    licenseNumber: formValue(formData, 'licenseNumber'),
    classification: formValue(formData, 'classification'),
    licensedEntityName: formValue(formData, 'licensedEntityName'),
    qualifierName: formValue(formData, 'qualifierName'),
    issueDate: formText(formData, 'issueDate'),
    expirationDate: formText(formData, 'expirationDate'),
    otherInformation: formValue(formData, 'otherInformation'),
    everDisciplined: formData.get('everDisciplined') === 'yes',
    disciplineExplanation: formValue(formData, 'disciplineExplanation'),
  })
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) }

  const d = parsed.data
  if (d.everDisciplined && !d.disciplineExplanation) {
    return {
      ok: false,
      errors: { disciplineExplanation: 'Please explain the licence action.' },
    }
  }

  const [existing] = await db
    .select()
    .from(licenses)
    .where(eq(licenses.companyId, session.companyId))
    .limit(1)

  if (d.licenseNumber) {
    const values = {
      licenseNumber: d.licenseNumber,
      classification: d.classification ?? null,
      licensedEntityName: d.licensedEntityName ?? null,
      qualifierName: d.qualifierName ?? null,
      issueDate: d.issueDate ?? null,
      expirationDate: d.expirationDate ?? null,
      otherInformation: d.otherInformation ?? null,
      everDisciplined: d.everDisciplined,
      disciplineExplanation: d.disciplineExplanation ?? null,
      updatedAt: new Date(),
    }

    if (existing) {
      // Editing the licence number invalidates any prior administrator
      // verification — it is no longer the record that was checked.
      const numberChanged = existing.licenseNumber !== d.licenseNumber
      await db
        .update(licenses)
        .set(
          numberChanged
            ? { ...values, verificationStatus: 'NOT_VERIFIED', verifiedAt: null, verifiedById: null }
            : values,
        )
        .where(eq(licenses.id, existing.id))
    } else {
      await db.insert(licenses).values({ companyId: session.companyId, ...values })
    }
  }

  await markSectionComplete(session.companyId, 'licensing')
  await recordAudit({
    action: AUDIT.APPLICATION_SECTION_SAVED,
    summary: 'Licensing information saved',
    companyId: session.companyId,
    actor: session,
    metadata: { section: 'licensing' },
  })

  revalidatePortal()
  return { ok: true, message: 'Licensing information saved.' }
}

// ---------------------------------------------------------------------------
// Section D — insurance
// ---------------------------------------------------------------------------

export async function saveInsuranceSection(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireTradePartner()
  const rows = collectIndexed(formData, 'policies')

  const parsed = insuranceSectionSchema.safeParse({
    policies: rows.map((r) => ({
      kind: r.kind,
      carrier: r.carrier,
      policyNumber: r.policyNumber,
      perOccurrenceLimit: r.perOccurrenceLimit,
      aggregateLimit: r.aggregateLimit,
      effectiveDate: r.effectiveDate ?? '',
      expirationDate: r.expirationDate ?? '',
      notes: r.notes,
    })),
  })
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) }

  await db.transaction(async (tx) => {
    for (const policy of parsed.data.policies) {
      const hasContent = Boolean(policy.carrier || policy.policyNumber || policy.expirationDate)
      if (!hasContent) continue

      await tx
        .insert(insurancePolicies)
        .values({
          companyId: session.companyId,
          kind: policy.kind as InsuranceKindValue,
          carrier: policy.carrier ?? null,
          policyNumber: policy.policyNumber ?? null,
          perOccurrenceLimit: policy.perOccurrenceLimit ?? null,
          aggregateLimit: policy.aggregateLimit ?? null,
          effectiveDate: policy.effectiveDate ?? null,
          expirationDate: policy.expirationDate ?? null,
          notes: policy.notes ?? null,
        })
        .onConflictDoUpdate({
          target: [insurancePolicies.companyId, insurancePolicies.kind],
          set: {
            carrier: policy.carrier ?? null,
            policyNumber: policy.policyNumber ?? null,
            perOccurrenceLimit: policy.perOccurrenceLimit ?? null,
            aggregateLimit: policy.aggregateLimit ?? null,
            effectiveDate: policy.effectiveDate ?? null,
            expirationDate: policy.expirationDate ?? null,
            notes: policy.notes ?? null,
            updatedAt: new Date(),
          },
        })
    }
  })

  await markSectionComplete(session.companyId, 'insurance')
  await recordAudit({
    action: AUDIT.APPLICATION_SECTION_SAVED,
    summary: 'Insurance information saved',
    companyId: session.companyId,
    actor: session,
    // Policy numbers are redacted by the audit layer before this is written.
    metadata: { section: 'insurance' },
  })

  revalidatePortal()
  return { ok: true, message: 'Insurance information saved. Upload the certificates on the Documents page.' }
}

// ---------------------------------------------------------------------------
// Section E — experience and references
// ---------------------------------------------------------------------------

export async function saveExperienceSection(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireTradePartner()
  const rows = collectIndexed(formData, 'projects').filter((r) => r.referenceName?.trim())

  if (rows.length < 3) {
    return {
      ok: false,
      message:
        'Please provide at least three projects with references, including one active project and one completed at least a year ago.',
    }
  }

  const parsed = experienceSectionSchema.safeParse({
    projects: rows.map((r) => ({
      kind: r.kind,
      projectName: r.projectName,
      projectType: r.projectType,
      projectLocation: r.projectLocation,
      contractAmountRange: r.contractAmountRange,
      completionDate: r.completionDate ?? '',
      scopePerformed: r.scopePerformed,
      referenceName: r.referenceName,
      referenceCompany: r.referenceCompany,
      referencePhone: r.referencePhone,
      referenceEmail: r.referenceEmail,
      permissionToContact: r.permissionToContact === 'on',
    })),
  })
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) }

  await db.transaction(async (tx) => {
    // References are replaced wholesale: the form is the complete list, and
    // partial merging would silently keep a reference the partner removed.
    await tx.delete(projectReferences).where(eq(projectReferences.companyId, session.companyId))
    for (const project of parsed.data.projects) {
      await tx.insert(projectReferences).values({
        companyId: session.companyId,
        kind: project.kind as ProjectKindValue,
        projectName: project.projectName ?? null,
        projectType: project.projectType ?? null,
        projectLocation: project.projectLocation ?? null,
        contractAmountRange: project.contractAmountRange ?? null,
        completionDate: project.completionDate ?? null,
        scopePerformed: project.scopePerformed ?? null,
        referenceName: project.referenceName,
        referenceCompany: project.referenceCompany ?? null,
        referencePhone: project.referencePhone ?? null,
        referenceEmail: project.referenceEmail || null,
        permissionToContact: project.permissionToContact,
      })
    }
  })

  await markSectionComplete(session.companyId, 'experience')
  await recordAudit({
    action: AUDIT.APPLICATION_SECTION_SAVED,
    summary: `Experience and references saved (${parsed.data.projects.length} projects)`,
    companyId: session.companyId,
    actor: session,
    metadata: { section: 'experience' },
  })

  revalidatePortal()
  return { ok: true, message: 'Experience and references saved.' }
}

// ---------------------------------------------------------------------------
// Section F — disclosures
// ---------------------------------------------------------------------------

export async function saveDisclosuresSection(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireTradePartner()

  const read = (key: string) => ({
    answer: formText(formData, `${key}.answer`) as 'yes' | 'no' | '',
    explanation: formText(formData, `${key}.explanation`),
  })

  const parsed = disclosuresSectionSchema.safeParse({
    pendingLitigation: read('pendingLitigation'),
    bankruptcy: read('bankruptcy'),
    judgmentsOrLiens: read('judgmentsOrLiens'),
    insuranceClaims: read('insuranceClaims'),
    oshaCitations: read('oshaCitations'),
    seriousInjuries: read('seriousInjuries'),
    warrantyDisputes: read('warrantyDisputes'),
    abandonedProjects: read('abandonedProjects'),
    supplierDisputes: read('supplierDisputes'),
    usesLowerTierSubs: read('usesLowerTierSubs'),
    workersAuthorized: read('workersAuthorized'),
  })
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) }

  const d = parsed.data
  const unanswered = Object.entries(d).filter(([, v]) => v.answer === undefined)
  if (unanswered.length > 0) {
    return { ok: false, message: 'Please answer every question before saving this section.' }
  }

  await db
    .update(applications)
    .set({
      disclosurePendingLitigation: d.pendingLitigation.answer ?? null,
      disclosurePendingLitigationText: d.pendingLitigation.explanation ?? null,
      disclosureBankruptcy: d.bankruptcy.answer ?? null,
      disclosureBankruptcyText: d.bankruptcy.explanation ?? null,
      disclosureJudgmentsOrLiens: d.judgmentsOrLiens.answer ?? null,
      disclosureJudgmentsOrLiensText: d.judgmentsOrLiens.explanation ?? null,
      disclosureInsuranceClaims: d.insuranceClaims.answer ?? null,
      disclosureInsuranceClaimsText: d.insuranceClaims.explanation ?? null,
      disclosureOshaCitations: d.oshaCitations.answer ?? null,
      disclosureOshaCitationsText: d.oshaCitations.explanation ?? null,
      disclosureSeriousInjuries: d.seriousInjuries.answer ?? null,
      disclosureSeriousInjuriesText: d.seriousInjuries.explanation ?? null,
      disclosureWarrantyDisputes: d.warrantyDisputes.answer ?? null,
      disclosureWarrantyDisputesText: d.warrantyDisputes.explanation ?? null,
      disclosureAbandonedProjects: d.abandonedProjects.answer ?? null,
      disclosureAbandonedProjectsText: d.abandonedProjects.explanation ?? null,
      disclosureSupplierDisputes: d.supplierDisputes.answer ?? null,
      disclosureSupplierDisputesText: d.supplierDisputes.explanation ?? null,
      disclosureUsesLowerTierSubs: d.usesLowerTierSubs.answer ?? null,
      disclosureUsesLowerTierSubsText: d.usesLowerTierSubs.explanation ?? null,
      disclosureWorkersAuthorized: d.workersAuthorized.answer ?? null,
      disclosureWorkersAuthorizedText: d.workersAuthorized.explanation ?? null,
    })
    .where(eq(applications.companyId, session.companyId))

  await markSectionComplete(session.companyId, 'disclosures')
  await recordAudit({
    action: AUDIT.APPLICATION_SECTION_SAVED,
    summary: 'Operational disclosures saved',
    companyId: session.companyId,
    actor: session,
    metadata: { section: 'disclosures' },
  })

  revalidatePortal()
  return { ok: true, message: 'Disclosures saved.' }
}

// ---------------------------------------------------------------------------
// Section G — certification and submission
// ---------------------------------------------------------------------------

export async function submitApplication(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireTradePartner()

  const parsed = certificationSchema.safeParse({
    signerName: formValue(formData, 'signerName'),
    signerTitle: formValue(formData, 'signerTitle'),
    acknowledged: formValue(formData, 'acknowledged'),
  })
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) }

  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.companyId, session.companyId))
    .limit(1)
  if (!application) return { ok: false, message: 'No application found for your company.' }

  const progress = (application.sectionProgress ?? {}) as Record<string, boolean>
  const incomplete = APPLICATION_SECTIONS.filter(
    (s) => s.key !== 'certification' && !progress[s.key],
  )
  if (incomplete.length > 0) {
    return {
      ok: false,
      message: `Please complete these sections first: ${incomplete.map((s) => s.label).join(', ')}.`,
    }
  }

  const { ipAddress, userAgent } = requestContext()
  const now = new Date()

  await db
    .update(applications)
    .set({
      status: 'SUBMITTED',
      submittedAt: now,
      returnedAt: null,
      returnReason: null,
      sectionProgress: { ...progress, certification: true },
      certificationVersion: CERTIFICATION_VERSION,
      certifiedAt: now,
      signerName: parsed.data.signerName,
      signerTitle: parsed.data.signerTitle,
      signerIpAddress: ipAddress,
      signerUserAgent: userAgent?.slice(0, 500) ?? null,
    })
    .where(eq(applications.companyId, session.companyId))

  await advanceLifecycleStatus(session.companyId, 'APPLICATION_SUBMITTED')

  await recordAudit({
    action: AUDIT.APPLICATION_CERTIFIED,
    summary: `Application certified and submitted by ${parsed.data.signerName} (${parsed.data.signerTitle})`,
    companyId: session.companyId,
    actor: session,
    metadata: { certificationVersion: CERTIFICATION_VERSION },
  })
  await recordAudit({
    action: AUDIT.APPLICATION_SUBMITTED,
    summary: 'Application submitted for review',
    companyId: session.companyId,
    actor: session,
  })

  const [company] = await db
    .select({ legalName: companies.legalName })
    .from(companies)
    .where(eq(companies.id, session.companyId))
    .limit(1)
  const companyName = company?.legalName ?? 'Your company'

  await sendPortalEmail({
    type: NOTIFICATION_TYPES.APPLICATION_SUBMITTED,
    to: session.email,
    userId: session.userId,
    companyId: session.companyId,
    dedupeKey: `app-submitted:${session.companyId}:${now.getTime()}`,
    data: { companyName, portalUrl: `${serverEnv.appUrl}/trade-partners/dashboard` },
  })

  await sendPortalEmail({
    type: NOTIFICATION_TYPES.ADMIN_ACTION_REQUIRED,
    to: serverEnv.adminNotifyEmail,
    companyId: session.companyId,
    dedupeKey: `admin-app-submitted:${session.companyId}:${now.getTime()}`,
    data: {
      companyName,
      portalUrl: `${serverEnv.appUrl}/admin/trade-partners/${session.companyId}`,
      items: ['A trade partner application has been submitted and is awaiting review.'],
    },
  })

  revalidatePortal()
  return { ok: true, message: 'Your application has been submitted.' }
}
