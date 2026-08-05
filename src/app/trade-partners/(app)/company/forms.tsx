'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import {
  DisclosureQuestion,
  MailingAddressToggle,
  SaveBar,
  SubmitButton,
} from '@/components/portal/client'
import { Field } from '@/components/portal/ui'
import {
  CONTACT_ROLE_LABEL,
  CONTACT_ROLE_ORDER,
  CONTRACT_AMOUNT_RANGES,
  ENTITY_TYPE_LABEL,
  INSURANCE_KIND_LABEL,
  PROJECT_KIND_LABEL,
  PROJECT_SIZE_RANGES,
  TRADES,
  UTAH_COUNTIES,
} from '@/lib/portal/constants'
import { CERTIFICATION_STATEMENTS } from '@/lib/portal/requirements'
import type { ActionState } from '@/lib/portal/validation'
import type {
  Application,
  Company,
  Contact,
  InsurancePolicy,
  License,
  ProjectReference,
} from '@/lib/portal/db/schema'
import {
  saveCompanySection,
  saveContactsSection,
  saveDisclosuresSection,
  saveExperienceSection,
  saveInsuranceSection,
  saveLicensingSection,
  submitApplication,
} from '../application-actions'

function Banner({ state }: { state: ActionState }) {
  if (!state.message) return null
  return (
    <div
      className={`pt-notice pt-notice-${state.ok ? 'good' : 'bad'}`}
      role={state.ok ? 'status' : 'alert'}
    >
      <p>{state.message}</p>
    </div>
  )
}

const toDateInput = (value: Date | string | null | undefined) => {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

// ---------------------------------------------------------------------------
// Section A
// ---------------------------------------------------------------------------

export function CompanyForm({ company, savedAt }: { company: Company; savedAt: string | null }) {
  const [state, action] = useFormState<ActionState, FormData>(saveCompanySection, {})

  return (
    <form action={action} noValidate>
      <Banner state={state} />

      <fieldset className="pt-fieldset">
        <legend>Identity</legend>
        <div className="pt-form-row pt-form-row-2">
          <Field label="Legal business name" name="legalName" error={state.errors?.legalName} required>
            <input className="pt-input" id="legalName" name="legalName" defaultValue={company.legalName} required />
          </Field>
          <Field label="DBA or trade name" name="dba" error={state.errors?.dba}>
            <input className="pt-input" id="dba" name="dba" defaultValue={company.dba ?? ''} />
          </Field>
        </div>

        <div className="pt-form-row pt-form-row-2">
          <Field label="Entity type" name="entityType" error={state.errors?.entityType} required>
            <select className="pt-select" id="entityType" name="entityType" defaultValue={company.entityType ?? ''} required>
              <option value="" disabled>
                Select…
              </option>
              {Object.entries(ENTITY_TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Last four digits of EIN"
            name="einLast4"
            error={state.errors?.einLast4}
            hint="Only the last four digits. Hardy Homes uses your uploaded W-9 for the full number — this portal never stores it."
          >
            <input
              className="pt-input"
              id="einLast4"
              name="einLast4"
              inputMode="numeric"
              maxLength={4}
              pattern="\d{4}"
              defaultValue={company.einLast4 ?? ''}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="pt-fieldset">
        <legend>Business address</legend>
        <Field label="Street address" name="businessAddress1" error={state.errors?.businessAddress1} required>
          <input className="pt-input" id="businessAddress1" name="businessAddress1" autoComplete="address-line1" defaultValue={company.businessAddress1 ?? ''} required />
        </Field>
        <Field label="Suite, unit (optional)" name="businessAddress2">
          <input className="pt-input" id="businessAddress2" name="businessAddress2" autoComplete="address-line2" defaultValue={company.businessAddress2 ?? ''} />
        </Field>
        <div className="pt-form-row pt-form-row-3">
          <Field label="City" name="businessCity" error={state.errors?.businessCity} required>
            <input className="pt-input" id="businessCity" name="businessCity" autoComplete="address-level2" defaultValue={company.businessCity ?? ''} required />
          </Field>
          <Field label="State" name="businessState" error={state.errors?.businessState} required>
            <input className="pt-input" id="businessState" name="businessState" maxLength={2} autoComplete="address-level1" defaultValue={company.businessState ?? 'UT'} required />
          </Field>
          <Field label="ZIP" name="businessZip" error={state.errors?.businessZip} required>
            <input className="pt-input" id="businessZip" name="businessZip" inputMode="numeric" autoComplete="postal-code" defaultValue={company.businessZip ?? ''} required />
          </Field>
        </div>

        <MailingAddressToggle defaultSame={company.mailingSameAsBusiness}>
          <div style={{ marginTop: 12 }}>
            <Field label="Mailing street address" name="mailingAddress1">
              <input className="pt-input" id="mailingAddress1" name="mailingAddress1" defaultValue={company.mailingAddress1 ?? ''} />
            </Field>
            <Field label="Suite, unit (optional)" name="mailingAddress2">
              <input className="pt-input" id="mailingAddress2" name="mailingAddress2" defaultValue={company.mailingAddress2 ?? ''} />
            </Field>
            <div className="pt-form-row pt-form-row-3">
              <Field label="City" name="mailingCity">
                <input className="pt-input" id="mailingCity" name="mailingCity" defaultValue={company.mailingCity ?? ''} />
              </Field>
              <Field label="State" name="mailingState">
                <input className="pt-input" id="mailingState" name="mailingState" maxLength={2} defaultValue={company.mailingState ?? ''} />
              </Field>
              <Field label="ZIP" name="mailingZip">
                <input className="pt-input" id="mailingZip" name="mailingZip" inputMode="numeric" defaultValue={company.mailingZip ?? ''} />
              </Field>
            </div>
          </div>
        </MailingAddressToggle>
      </fieldset>

      <fieldset className="pt-fieldset">
        <legend>Contact and history</legend>
        <div className="pt-form-row pt-form-row-2">
          <Field label="Main phone" name="mainPhone" error={state.errors?.mainPhone} required>
            <input className="pt-input" id="mainPhone" name="mainPhone" type="tel" inputMode="tel" defaultValue={company.mainPhone ?? ''} required />
          </Field>
          <Field label="General email" name="generalEmail" error={state.errors?.generalEmail} required>
            <input className="pt-input" id="generalEmail" name="generalEmail" type="email" inputMode="email" autoCapitalize="none" defaultValue={company.generalEmail ?? ''} required />
          </Field>
        </div>
        <div className="pt-form-row pt-form-row-3">
          <Field label="Website" name="website">
            <input className="pt-input" id="website" name="website" defaultValue={company.website ?? ''} placeholder="https://" />
          </Field>
          <Field label="Year established" name="yearEstablished">
            <input className="pt-input" id="yearEstablished" name="yearEstablished" inputMode="numeric" defaultValue={company.yearEstablished ?? ''} />
          </Field>
          <Field label="Years in business" name="yearsInBusiness">
            <input className="pt-input" id="yearsInBusiness" name="yearsInBusiness" inputMode="numeric" defaultValue={company.yearsInBusiness ?? ''} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="pt-fieldset">
        <legend>Trades and service area</legend>
        <Field label="Primary trade" name="primaryTrade" error={state.errors?.primaryTrade} required>
          <select className="pt-select" id="primaryTrade" name="primaryTrade" defaultValue={company.primaryTrade} required>
            {TRADES.map((trade) => (
              <option key={trade} value={trade}>
                {trade}
              </option>
            ))}
          </select>
        </Field>

        <div className="pt-field">
          <span className="pt-label">Additional trades</span>
          <div className="pt-check-grid">
            {TRADES.filter((t) => t !== company.primaryTrade).map((trade) => (
              <label className="pt-check" key={trade}>
                <input type="checkbox" name="additionalTrades" value={trade} defaultChecked={company.additionalTrades?.includes(trade)} />
                <span>{trade}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-field">
          <span className="pt-label">Utah counties served</span>
          <div className="pt-check-grid">
            {UTAH_COUNTIES.map((county) => (
              <label className="pt-check" key={county}>
                <input type="checkbox" name="serviceAreas" value={county} defaultChecked={company.serviceAreas?.includes(county)} />
                <span>{county}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="pt-fieldset">
        <legend>Capacity</legend>
        <div className="pt-form-row pt-form-row-2">
          <Field label="Typical project size" name="typicalProjectSize">
            <select className="pt-select" id="typicalProjectSize" name="typicalProjectSize" defaultValue={company.typicalProjectSize ?? ''}>
              <option value="">Select…</option>
              {PROJECT_SIZE_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Current crew size" name="crewSize">
            <input className="pt-input" id="crewSize" name="crewSize" inputMode="numeric" defaultValue={company.crewSize ?? ''} />
          </Field>
        </div>
        <div className="pt-form-row pt-form-row-2">
          <Field label="Approximate annual capacity" name="annualCapacity" hint="For example: 30 homes per year, or $2M in contracts.">
            <input className="pt-input" id="annualCapacity" name="annualCapacity" defaultValue={company.annualCapacity ?? ''} />
          </Field>
          <Field label="Current backlog" name="currentBacklog" hint="Roughly how booked are you right now?">
            <input className="pt-input" id="currentBacklog" name="currentBacklog" defaultValue={company.currentBacklog ?? ''} />
          </Field>
        </div>
        <Field label="Largest completed project" name="largestProject">
          <textarea className="pt-textarea" id="largestProject" name="largestProject" rows={2} defaultValue={company.largestProject ?? ''} />
        </Field>
        <div className="pt-field">
          <span className="pt-label">Do you use lower-tier subcontractors?</span>
          <div className="pt-radio-row">
            <label>
              <input type="radio" name="usesLowerTierSubs" value="yes" defaultChecked={company.usesLowerTierSubs === true} /> Yes
            </label>
            <label>
              <input type="radio" name="usesLowerTierSubs" value="no" defaultChecked={company.usesLowerTierSubs === false} /> No
            </label>
          </div>
        </div>
        <Field label="Brief company description" name="description">
          <textarea className="pt-textarea" id="description" name="description" rows={4} defaultValue={company.description ?? ''} />
        </Field>
      </fieldset>

      <SaveBar savedAt={savedAt}>
        <SubmitButton>Save and continue</SubmitButton>
      </SaveBar>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Section B
// ---------------------------------------------------------------------------

export function ContactsForm({
  contacts,
  savedAt,
}: {
  contacts: Contact[]
  savedAt: string | null
}) {
  const [state, action] = useFormState<ActionState, FormData>(saveContactsSection, {})
  const byRole = new Map(contacts.map((c) => [c.role, c]))

  return (
    <form action={action} noValidate>
      <Banner state={state} />
      <p className="pt-sub pt-mb">
        One person may fill several roles — repeat the same name and details where that is the case.
        Only the primary contact is required.
      </p>

      {CONTACT_ROLE_ORDER.map((role, index) => {
        const existing = byRole.get(role)
        const required = role === 'PRIMARY'
        return (
          <fieldset className="pt-fieldset" key={role}>
            <legend>
              {CONTACT_ROLE_LABEL[role]}
              {required ? <span className="pt-req"> *</span> : null}
            </legend>
            <input type="hidden" name={`contacts.${index}.role`} value={role} />
            <div className="pt-form-row pt-form-row-2">
              <Field label="Name" name={`contacts.${index}.name`} required={required}>
                <input className="pt-input" id={`contacts.${index}.name`} name={`contacts.${index}.name`} defaultValue={existing?.name ?? ''} required={required} />
              </Field>
              <Field label="Title" name={`contacts.${index}.title`}>
                <input className="pt-input" id={`contacts.${index}.title`} name={`contacts.${index}.title`} defaultValue={existing?.title ?? ''} />
              </Field>
            </div>
            <div className="pt-form-row pt-form-row-2">
              <Field label="Email" name={`contacts.${index}.email`} required={required}>
                <input className="pt-input" id={`contacts.${index}.email`} name={`contacts.${index}.email`} type="email" inputMode="email" autoCapitalize="none" defaultValue={existing?.email ?? ''} required={required} />
              </Field>
              <Field label="Phone" name={`contacts.${index}.phone`}>
                <input className="pt-input" id={`contacts.${index}.phone`} name={`contacts.${index}.phone`} type="tel" inputMode="tel" defaultValue={existing?.phone ?? ''} />
              </Field>
            </div>
          </fieldset>
        )
      })}

      {state.errors?.['contacts.primary'] ? (
        <p className="pt-error" role="alert">
          {state.errors['contacts.primary']}
        </p>
      ) : null}

      <SaveBar savedAt={savedAt}>
        <SubmitButton>Save and continue</SubmitButton>
      </SaveBar>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Section C
// ---------------------------------------------------------------------------

export function LicensingForm({
  license,
  savedAt,
}: {
  license: License | null
  savedAt: string | null
}) {
  const [state, action] = useFormState<ActionState, FormData>(saveLicensingSection, {})
  const [disciplined, setDisciplined] = useState(license?.everDisciplined === true)

  return (
    <form action={action} noValidate>
      <Banner state={state} />

      <div className="pt-notice pt-notice-info">
        <p>
          Hardy Homes verifies licence details manually against the Utah DOPL record. Upload the
          licence itself on the Documents page.
        </p>
      </div>

      <div className="pt-form-row pt-form-row-2">
        <Field label="Utah contractor licence number" name="licenseNumber" error={state.errors?.licenseNumber}>
          <input className="pt-input" id="licenseNumber" name="licenseNumber" defaultValue={license?.licenseNumber ?? ''} />
        </Field>
        <Field label="Classification" name="classification" hint="For example: E100, S220, B100.">
          <input className="pt-input" id="classification" name="classification" defaultValue={license?.classification ?? ''} />
        </Field>
      </div>

      <div className="pt-form-row pt-form-row-2">
        <Field label="Licensed business entity name" name="licensedEntityName" hint="Exactly as it appears on the licence.">
          <input className="pt-input" id="licensedEntityName" name="licensedEntityName" defaultValue={license?.licensedEntityName ?? ''} />
        </Field>
        <Field label="Qualifier name" name="qualifierName">
          <input className="pt-input" id="qualifierName" name="qualifierName" defaultValue={license?.qualifierName ?? ''} />
        </Field>
      </div>

      <div className="pt-form-row pt-form-row-2">
        <Field label="Issue date" name="issueDate" hint="If known.">
          <input className="pt-input" id="issueDate" name="issueDate" type="date" defaultValue={toDateInput(license?.issueDate)} />
        </Field>
        <Field label="Expiration date" name="expirationDate" error={state.errors?.expirationDate}>
          <input className="pt-input" id="expirationDate" name="expirationDate" type="date" defaultValue={toDateInput(license?.expirationDate)} />
        </Field>
      </div>

      <Field label="Other relevant licence information" name="otherInformation">
        <textarea className="pt-textarea" id="otherInformation" name="otherInformation" rows={3} defaultValue={license?.otherInformation ?? ''} />
      </Field>

      <div className="pt-field">
        <span className="pt-label">
          Has the company ever had a licence suspended, revoked, limited or disciplined?
        </span>
        <div className="pt-radio-row">
          <label>
            <input type="radio" name="everDisciplined" value="yes" checked={disciplined} onChange={() => setDisciplined(true)} /> Yes
          </label>
          <label>
            <input type="radio" name="everDisciplined" value="no" checked={!disciplined} onChange={() => setDisciplined(false)} /> No
          </label>
        </div>
      </div>

      {disciplined ? (
        <Field label="Please explain" name="disciplineExplanation" error={state.errors?.disciplineExplanation} required>
          <textarea className="pt-textarea" id="disciplineExplanation" name="disciplineExplanation" rows={4} defaultValue={license?.disciplineExplanation ?? ''} required />
        </Field>
      ) : null}

      <SaveBar savedAt={savedAt}>
        <SubmitButton>Save and continue</SubmitButton>
      </SaveBar>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Section D
// ---------------------------------------------------------------------------

const INSURANCE_ORDER = [
  'GENERAL_LIABILITY',
  'WORKERS_COMPENSATION',
  'COMMERCIAL_AUTO',
  'UMBRELLA_EXCESS',
] as const

export function InsuranceForm({
  policies,
  savedAt,
}: {
  policies: InsurancePolicy[]
  savedAt: string | null
}) {
  const [state, action] = useFormState<ActionState, FormData>(saveInsuranceSection, {})
  const byKind = new Map(policies.map((p) => [p.kind, p]))

  return (
    <form action={action} noValidate>
      <Banner state={state} />
      <div className="pt-notice pt-notice-info">
        <p>
          Enter the policy details here, then upload the certificates and endorsements on the
          Documents page. Commercial auto and umbrella are only needed if they apply to you.
        </p>
      </div>

      {INSURANCE_ORDER.map((kind, index) => {
        const existing = byKind.get(kind)
        return (
          <fieldset className="pt-fieldset" key={kind}>
            <legend>{INSURANCE_KIND_LABEL[kind]}</legend>
            <input type="hidden" name={`policies.${index}.kind`} value={kind} />
            <div className="pt-form-row pt-form-row-2">
              <Field label="Carrier" name={`policies.${index}.carrier`}>
                <input className="pt-input" id={`policies.${index}.carrier`} name={`policies.${index}.carrier`} defaultValue={existing?.carrier ?? ''} />
              </Field>
              <Field label="Policy number" name={`policies.${index}.policyNumber`}>
                <input className="pt-input" id={`policies.${index}.policyNumber`} name={`policies.${index}.policyNumber`} defaultValue={existing?.policyNumber ?? ''} />
              </Field>
            </div>
            {kind === 'GENERAL_LIABILITY' || kind === 'UMBRELLA_EXCESS' ? (
              <div className="pt-form-row pt-form-row-2">
                <Field label="Per-occurrence limit" name={`policies.${index}.perOccurrenceLimit`}>
                  <input className="pt-input" id={`policies.${index}.perOccurrenceLimit`} name={`policies.${index}.perOccurrenceLimit`} defaultValue={existing?.perOccurrenceLimit ?? ''} placeholder="$1,000,000" />
                </Field>
                <Field label="Aggregate limit" name={`policies.${index}.aggregateLimit`}>
                  <input className="pt-input" id={`policies.${index}.aggregateLimit`} name={`policies.${index}.aggregateLimit`} defaultValue={existing?.aggregateLimit ?? ''} placeholder="$2,000,000" />
                </Field>
              </div>
            ) : null}
            <div className="pt-form-row pt-form-row-2">
              <Field label="Effective date" name={`policies.${index}.effectiveDate`}>
                <input className="pt-input" id={`policies.${index}.effectiveDate`} name={`policies.${index}.effectiveDate`} type="date" defaultValue={toDateInput(existing?.effectiveDate)} />
              </Field>
              <Field label="Expiration date" name={`policies.${index}.expirationDate`}>
                <input className="pt-input" id={`policies.${index}.expirationDate`} name={`policies.${index}.expirationDate`} type="date" defaultValue={toDateInput(existing?.expirationDate)} />
              </Field>
            </div>
            {kind === 'WORKERS_COMPENSATION' ? (
              <p className="pt-hint">
                If your company has no employees, leave this blank and upload a Utah Workers&rsquo;
                Compensation Coverage Waiver on the Documents page instead.
              </p>
            ) : null}
          </fieldset>
        )
      })}

      <SaveBar savedAt={savedAt}>
        <SubmitButton>Save and continue</SubmitButton>
      </SaveBar>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Section E
// ---------------------------------------------------------------------------

const PROJECT_SLOTS = [
  { kind: 'ACTIVE' as const, note: 'A project you are working on right now.' },
  {
    kind: 'COMPLETED_OVER_ONE_YEAR' as const,
    note: 'A project finished at least a year ago, so the reference can speak to how it held up.',
  },
  { kind: 'COMPARABLE' as const, note: 'Any recent project comparable to the work you would do for Hardy Homes.' },
]

export function ExperienceForm({
  projects,
  savedAt,
}: {
  projects: ProjectReference[]
  savedAt: string | null
}) {
  const [state, action] = useFormState<ActionState, FormData>(saveExperienceSection, {})
  const [extra, setExtra] = useState(Math.max(0, projects.length - PROJECT_SLOTS.length))

  const slots = [
    ...PROJECT_SLOTS,
    ...Array.from({ length: extra }, () => ({
      kind: 'COMPARABLE' as const,
      note: 'Additional project.',
    })),
  ]

  return (
    <form action={action} noValidate>
      <Banner state={state} />
      <p className="pt-sub pt-mb">
        Provide at least three projects with references — one active, one completed at least a year
        ago, and one more comparable project.
      </p>

      {slots.map((slot, index) => {
        const existing = projects[index]
        return (
          <fieldset className="pt-fieldset" key={index}>
            <legend>
              Project {index + 1} — {PROJECT_KIND_LABEL[slot.kind]}
            </legend>
            <p className="pt-hint" style={{ marginTop: 0, marginBottom: 12 }}>
              {slot.note}
            </p>
            <input type="hidden" name={`projects.${index}.kind`} value={existing?.kind ?? slot.kind} />

            <div className="pt-form-row pt-form-row-2">
              <Field label="Project name" name={`projects.${index}.projectName`}>
                <input className="pt-input" id={`projects.${index}.projectName`} name={`projects.${index}.projectName`} defaultValue={existing?.projectName ?? ''} />
              </Field>
              <Field label="Project type" name={`projects.${index}.projectType`}>
                <input className="pt-input" id={`projects.${index}.projectType`} name={`projects.${index}.projectType`} defaultValue={existing?.projectType ?? ''} placeholder="Custom home, remodel…" />
              </Field>
            </div>
            <div className="pt-form-row pt-form-row-3">
              <Field label="Location" name={`projects.${index}.projectLocation`}>
                <input className="pt-input" id={`projects.${index}.projectLocation`} name={`projects.${index}.projectLocation`} defaultValue={existing?.projectLocation ?? ''} />
              </Field>
              <Field label="Contract amount" name={`projects.${index}.contractAmountRange`}>
                <select className="pt-select" id={`projects.${index}.contractAmountRange`} name={`projects.${index}.contractAmountRange`} defaultValue={existing?.contractAmountRange ?? ''}>
                  <option value="">Select…</option>
                  {CONTRACT_AMOUNT_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Completion date" name={`projects.${index}.completionDate`}>
                <input className="pt-input" id={`projects.${index}.completionDate`} name={`projects.${index}.completionDate`} type="date" defaultValue={toDateInput(existing?.completionDate)} />
              </Field>
            </div>
            <Field label="Scope you performed" name={`projects.${index}.scopePerformed`}>
              <textarea className="pt-textarea" id={`projects.${index}.scopePerformed`} name={`projects.${index}.scopePerformed`} rows={2} defaultValue={existing?.scopePerformed ?? ''} />
            </Field>

            <div className="pt-form-row pt-form-row-2">
              <Field label="Reference name" name={`projects.${index}.referenceName`} required={index < 3}>
                <input className="pt-input" id={`projects.${index}.referenceName`} name={`projects.${index}.referenceName`} defaultValue={existing?.referenceName ?? ''} required={index < 3} />
              </Field>
              <Field label="Company or owner" name={`projects.${index}.referenceCompany`}>
                <input className="pt-input" id={`projects.${index}.referenceCompany`} name={`projects.${index}.referenceCompany`} defaultValue={existing?.referenceCompany ?? ''} />
              </Field>
            </div>
            <div className="pt-form-row pt-form-row-2">
              <Field label="Reference phone" name={`projects.${index}.referencePhone`}>
                <input className="pt-input" id={`projects.${index}.referencePhone`} name={`projects.${index}.referencePhone`} type="tel" inputMode="tel" defaultValue={existing?.referencePhone ?? ''} />
              </Field>
              <Field label="Reference email" name={`projects.${index}.referenceEmail`}>
                <input className="pt-input" id={`projects.${index}.referenceEmail`} name={`projects.${index}.referenceEmail`} type="email" inputMode="email" autoCapitalize="none" defaultValue={existing?.referenceEmail ?? ''} />
              </Field>
            </div>

            <label className="pt-check">
              <input type="checkbox" name={`projects.${index}.permissionToContact`} defaultChecked={existing?.permissionToContact ?? false} />
              <span>Hardy Homes may contact this reference.</span>
            </label>
          </fieldset>
        )
      })}

      <button type="button" className="pt-btn pt-btn-ghost pt-btn-sm" onClick={() => setExtra((n) => n + 1)}>
        Add another project
      </button>

      <SaveBar savedAt={savedAt}>
        <SubmitButton>Save and continue</SubmitButton>
      </SaveBar>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Section F
// ---------------------------------------------------------------------------

export function DisclosuresForm({
  application,
  savedAt,
}: {
  application: Application | null
  savedAt: string | null
}) {
  const [state, action] = useFormState<ActionState, FormData>(saveDisclosuresSection, {})

  return (
    <form action={action} noValidate>
      <Banner state={state} />
      <div className="pt-notice pt-notice-info">
        <p>
          These are your own disclosures, not findings by Hardy Homes. Answering yes does not
          disqualify your company — it lets us understand the context. Please answer every question.
        </p>
      </div>

      <DisclosureQuestion name="pendingLitigation" question="Does your company have any pending or recent litigation?" defaultAnswer={application?.disclosurePendingLitigation} defaultExplanation={application?.disclosurePendingLitigationText} />
      <DisclosureQuestion name="bankruptcy" question="Has your company or its principals filed for bankruptcy?" defaultAnswer={application?.disclosureBankruptcy} defaultExplanation={application?.disclosureBankruptcyText} />
      <DisclosureQuestion name="judgmentsOrLiens" question="Are there any outstanding judgments or tax liens against the company?" defaultAnswer={application?.disclosureJudgmentsOrLiens} defaultExplanation={application?.disclosureJudgmentsOrLiensText} />
      <DisclosureQuestion name="insuranceClaims" question="Have there been material insurance claims against your company?" defaultAnswer={application?.disclosureInsuranceClaims} defaultExplanation={application?.disclosureInsuranceClaimsText} />
      <DisclosureQuestion name="oshaCitations" question="Has your company received OSHA or UOSH citations?" defaultAnswer={application?.disclosureOshaCitations} defaultExplanation={application?.disclosureOshaCitationsText} />
      <DisclosureQuestion name="seriousInjuries" question="Have there been serious workplace injuries on your projects?" defaultAnswer={application?.disclosureSeriousInjuries} defaultExplanation={application?.disclosureSeriousInjuriesText} />
      <DisclosureQuestion name="warrantyDisputes" question="Are there unresolved warranty disputes involving your company?" defaultAnswer={application?.disclosureWarrantyDisputes} defaultExplanation={application?.disclosureWarrantyDisputesText} />
      <DisclosureQuestion name="abandonedProjects" question="Has your company ever left a project before completing its scope?" defaultAnswer={application?.disclosureAbandonedProjects} defaultExplanation={application?.disclosureAbandonedProjectsText} />
      <DisclosureQuestion name="supplierDisputes" question="Are there current disputes with material suppliers?" defaultAnswer={application?.disclosureSupplierDisputes} defaultExplanation={application?.disclosureSupplierDisputesText} />
      <DisclosureQuestion name="usesLowerTierSubs" question="Does your company use lower-tier subcontractors?" defaultAnswer={application?.disclosureUsesLowerTierSubs} defaultExplanation={application?.disclosureUsesLowerTierSubsText} explanationLabel="Which parts of your scope, and who?" />
      <DisclosureQuestion name="workersAuthorized" question="Are all of your workers legally authorized to work and properly classified?" defaultAnswer={application?.disclosureWorkersAuthorized} defaultExplanation={application?.disclosureWorkersAuthorizedText} explanationLabel="Please explain" />

      <SaveBar savedAt={savedAt}>
        <SubmitButton>Save and continue</SubmitButton>
      </SaveBar>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Section G
// ---------------------------------------------------------------------------

export function CertificationForm({
  application,
  incompleteSections,
  defaultSignerName,
}: {
  application: Application | null
  incompleteSections: string[]
  defaultSignerName: string
}) {
  const [state, action] = useFormState<ActionState, FormData>(submitApplication, {})
  const alreadySubmitted = application?.status === 'SUBMITTED' || application?.status === 'APPROVED'

  return (
    <form action={action} noValidate>
      <Banner state={state} />

      {alreadySubmitted ? (
        <div className="pt-notice pt-notice-good">
          <p>
            Your application was submitted{' '}
            {application?.submittedAt
              ? new Date(application.submittedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : ''}
            . You can still update any section — resubmit here if you make changes.
          </p>
        </div>
      ) : null}

      {incompleteSections.length > 0 ? (
        <div className="pt-notice pt-notice-warn">
          <p>
            <strong>Finish these sections before submitting:</strong> {incompleteSections.join(', ')}
          </p>
        </div>
      ) : null}

      <p className="pt-sub pt-mb">By submitting this application, I certify that:</p>
      <ul style={{ paddingLeft: 20, margin: '0 0 22px', lineHeight: 1.7 }}>
        {CERTIFICATION_STATEMENTS.map((statement) => (
          <li key={statement} style={{ marginBottom: 6 }}>
            {statement}
          </li>
        ))}
      </ul>

      <div className="pt-notice pt-notice-draft">
        <p>
          This acknowledgment is not a substitute for the Master Subcontract Agreement. That
          agreement is provided separately and must be signed before work is authorized.
        </p>
      </div>

      <div className="pt-form-row pt-form-row-2">
        <Field label="Your full name" name="signerName" error={state.errors?.signerName} required>
          <input className="pt-input" id="signerName" name="signerName" defaultValue={application?.signerName ?? defaultSignerName} required />
        </Field>
        <Field label="Your title" name="signerTitle" error={state.errors?.signerTitle} required>
          <input className="pt-input" id="signerTitle" name="signerTitle" defaultValue={application?.signerTitle ?? ''} required />
        </Field>
      </div>

      <label className="pt-check">
        <input type="checkbox" name="acknowledged" required />
        <span>
          I am authorized to submit this application on behalf of the company, and I agree to the
          statements above. I understand that the date, my name, and the network address used to
          submit this form are recorded.
        </span>
      </label>
      {state.errors?.acknowledged ? (
        <p className="pt-error" role="alert">
          {state.errors.acknowledged}
        </p>
      ) : null}

      <div className="pt-btn-row pt-mt">
        <SubmitButton pendingLabel="Submitting…">
          {alreadySubmitted ? 'Resubmit application' : 'Submit application'}
        </SubmitButton>
      </div>
    </form>
  )
}
