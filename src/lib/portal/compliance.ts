/**
 * The compliance engine.
 *
 * This is the single place approval logic lives. UI components render what this
 * returns; they never decide eligibility themselves. Everything here is a pure
 * function of data passed in — no database, no `server-only` — which is what
 * makes the rules directly unit-testable and keeps them honest.
 *
 * Derived compliance state is deliberately NOT persisted. It is recomputed on
 * every read from the documents, acknowledgments, and requirements as they exist
 * at that moment, so it can never go stale. The one thing that *is* stored is
 * `company.status`, because it is an administrative decision rather than a
 * derivation — and the engine only ever *recommends* changes to it.
 */

import type {
  CompanyStatusValue,
  DocumentCategoryValue,
  DocumentStateValue,
  EntityTypeValue,
} from './firebase/types'
import { LOCKED_STATUSES } from './constants'

/**
 * The engine describes the shape it needs rather than importing a database's
 * row type. That is what let this file survive the move from Postgres/Drizzle to
 * Firestore without a single rule changing — and it means the rules can be
 * exercised by tests that construct plain objects, with no database at all.
 */
export type DocumentRequirement = {
  id: string
  code: string
  name: string
  category: DocumentCategoryValue
  isRequired: boolean
  applicableTrades: readonly string[]
  /** Widened to plain strings so either database's row shape satisfies it. */
  applicableEntityTypes: readonly string[]
  hasExpiration: boolean
  blocksBid: boolean
  blocksWork: boolean
  isAcknowledgment: boolean
  sortOrder: number
  isActive: boolean
}

export type PortalDocument = {
  id: string
  companyId: string
  requirementId: string
  state: DocumentStateValue
  version: number
  submittedAt: Date | string
  expirationDate: Date | string | null
  rejectionReason: string | null
  notApplicableReason: string | null
}

export type Company = {
  id: string
  status: CompanyStatusValue
  legalName: string
  entityType: EntityTypeValue | null
  primaryTrade: string
  additionalTrades: readonly string[]
}

export type Acknowledgment = {
  requirementId: string
  templateVersion: string
  acknowledgedAt: Date | string
}

export const EXPIRING_SOON_DAYS = 30

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ComplianceCompany = Pick<
  Company,
  'id' | 'status' | 'entityType' | 'primaryTrade' | 'additionalTrades' | 'legalName'
>

export type ComplianceApplication = {
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'RETURNED_FOR_CORRECTION' | 'APPROVED'
} | null

export type ComplianceInput = {
  company: ComplianceCompany
  application: ComplianceApplication
  requirements: DocumentRequirement[]
  /** Every non-superseded document for the company. */
  documents: PortalDocument[]
  acknowledgments: Pick<Acknowledgment, 'requirementId' | 'templateVersion' | 'acknowledgedAt'>[]
  /** Whether the company has at least one PRIMARY contact on file. */
  hasPrimaryContact: boolean
  /** Whether a contractor licence record with a number exists. */
  hasLicenseRecord: boolean
  /** Whether an administrator has verified the licence. */
  licenseVerified: boolean
  now?: Date
}

export type RequirementResult = {
  requirementId: string
  code: string
  name: string
  category: DocumentRequirement['category']
  isAcknowledgment: boolean
  /** False when the requirement does not apply to this trade or entity type. */
  applicable: boolean
  state: DocumentStateValue
  documentId: string | null
  expirationDate: Date | null
  daysUntilExpiration: number | null
  isExpired: boolean
  isExpiringSoon: boolean
  /** True when this requirement, in its current state, blocks bid approval. */
  blocksBidNow: boolean
  /** True when this requirement, in its current state, blocks work approval. */
  blocksWorkNow: boolean
  reason: string | null
}

export type Blocker = {
  code: string
  label: string
  detail: string
  /** `hard` blockers cannot be waived without fixing the underlying item. */
  severity: 'hard' | 'soft'
  requirementId?: string
}

export type ComplianceResult = {
  items: RequirementResult[]
  counts: {
    applicable: number
    approved: number
    missing: number
    submitted: number
    underReview: number
    rejected: number
    expired: number
    expiringSoon: number
    notApplicable: number
  }
  /** Everything mandatory for bidding is satisfied. */
  bidEligible: boolean
  bidBlockers: Blocker[]
  /** Everything mandatory for work is satisfied — an administrator must still approve. */
  workEligible: boolean
  workBlockers: Blocker[]
  /** Earliest expiration among approved, work-blocking items. */
  earliestExpiration: Date | null
  /** 0–100, across applicable requirements only. */
  completionPercent: number
  /**
   * What the system believes the status should be. Never applied automatically
   * for administrator-only statuses — see `canSystemApply`.
   */
  recommendedStatus: CompanyStatusValue | null
  /** True only for the automatic expiration demotion, which the sweep may apply. */
  canSystemApply: boolean
}

// ---------------------------------------------------------------------------
// Applicability
// ---------------------------------------------------------------------------

export function isRequirementApplicable(
  requirement: DocumentRequirement,
  company: Pick<ComplianceCompany, 'entityType' | 'primaryTrade' | 'additionalTrades'>,
): boolean {
  if (!requirement.isActive) return false

  if (requirement.applicableTrades.length > 0) {
    const companyTrades = [company.primaryTrade, ...(company.additionalTrades ?? [])].filter(
      Boolean,
    )
    const matches = requirement.applicableTrades.some((t) => companyTrades.includes(t))
    if (!matches) return false
  }

  if (requirement.applicableEntityTypes.length > 0) {
    if (!company.entityType) return false
    if (!requirement.applicableEntityTypes.includes(company.entityType as EntityTypeValue)) {
      return false
    }
  }

  return true
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

export function daysBetween(from: Date, to: Date): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((b - a) / MS_PER_DAY)
}

/**
 * A document expires at the *end* of its expiration date, so a certificate
 * expiring today is still current today. This matters: demoting a partner a day
 * early would block real work in the field.
 */
export function isExpiredOn(expirationDate: Date | null, now: Date): boolean {
  if (!expirationDate) return false
  return daysBetween(now, expirationDate) < 0
}

// ---------------------------------------------------------------------------
// Evaluation
// ---------------------------------------------------------------------------

/** Picks the document that represents the current state of a requirement. */
function currentDocumentFor(
  requirementId: string,
  documents: PortalDocument[],
): PortalDocument | null {
  const candidates = documents
    .filter((d) => d.requirementId === requirementId && d.state !== 'SUPERSEDED')
    .sort((a, b) => {
      if (b.version !== a.version) return b.version - a.version
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    })
  return candidates[0] ?? null
}

function evaluateRequirement(
  requirement: DocumentRequirement,
  input: ComplianceInput,
  now: Date,
): RequirementResult {
  const applicable = isRequirementApplicable(requirement, input.company)

  const base = {
    requirementId: requirement.id,
    code: requirement.code,
    name: requirement.name,
    category: requirement.category,
    isAcknowledgment: requirement.isAcknowledgment,
    applicable,
  }

  if (!applicable) {
    return {
      ...base,
      state: 'NOT_APPLICABLE' as DocumentStateValue,
      documentId: null,
      expirationDate: null,
      daysUntilExpiration: null,
      isExpired: false,
      isExpiringSoon: false,
      blocksBidNow: false,
      blocksWorkNow: false,
      reason: 'Does not apply to this trade or entity type.',
    }
  }

  // Acknowledgment-only requirements are satisfied by a signature, not a file.
  if (requirement.isAcknowledgment) {
    const ack = input.acknowledgments.find((a) => a.requirementId === requirement.id)
    const satisfied = Boolean(ack)
    return {
      ...base,
      state: satisfied ? 'APPROVED' : 'MISSING',
      documentId: null,
      expirationDate: null,
      daysUntilExpiration: null,
      isExpired: false,
      isExpiringSoon: false,
      blocksBidNow: !satisfied && requirement.isRequired && requirement.blocksBid,
      blocksWorkNow: !satisfied && requirement.isRequired && requirement.blocksWork,
      reason: satisfied ? null : 'Awaiting acknowledgment.',
    }
  }

  const doc = currentDocumentFor(requirement.id, input.documents)

  if (!doc) {
    return {
      ...base,
      state: 'MISSING',
      documentId: null,
      expirationDate: null,
      daysUntilExpiration: null,
      isExpired: false,
      isExpiringSoon: false,
      blocksBidNow: requirement.isRequired && requirement.blocksBid,
      blocksWorkNow: requirement.isRequired && requirement.blocksWork,
      reason: 'Not yet provided.',
    }
  }

  if (doc.state === 'NOT_APPLICABLE') {
    return {
      ...base,
      state: 'NOT_APPLICABLE',
      documentId: doc.id,
      expirationDate: null,
      daysUntilExpiration: null,
      isExpired: false,
      isExpiringSoon: false,
      blocksBidNow: false,
      blocksWorkNow: false,
      reason: doc.notApplicableReason ?? 'Marked not applicable by Hardy Homes.',
    }
  }

  const expirationDate = doc.expirationDate ? new Date(doc.expirationDate) : null
  const daysUntilExpiration = expirationDate ? daysBetween(now, expirationDate) : null
  const expired = requirement.hasExpiration && isExpiredOn(expirationDate, now)
  const expiringSoon =
    !expired &&
    daysUntilExpiration !== null &&
    daysUntilExpiration >= 0 &&
    daysUntilExpiration <= EXPIRING_SOON_DAYS

  // An approved document whose date has passed is treated as EXPIRED for
  // eligibility purposes even before the nightly sweep rewrites the row. The
  // sweep persists it; this makes sure a stale row can never grant clearance.
  const effectiveState: DocumentStateValue =
    expired && doc.state === 'APPROVED' ? 'EXPIRED' : doc.state

  const satisfied = effectiveState === 'APPROVED'
  const blocking = requirement.isRequired && !satisfied

  let reason: string | null = null
  if (effectiveState === 'REJECTED') reason = doc.rejectionReason ?? 'Rejected — resubmission required.'
  else if (effectiveState === 'EXPIRED') reason = 'Expired.'
  else if (effectiveState === 'SUBMITTED') reason = 'Awaiting review.'
  else if (effectiveState === 'UNDER_REVIEW') reason = 'Being reviewed.'

  return {
    ...base,
    state: effectiveState,
    documentId: doc.id,
    expirationDate,
    daysUntilExpiration,
    isExpired: expired,
    isExpiringSoon: expiringSoon,
    blocksBidNow: blocking && requirement.blocksBid,
    blocksWorkNow: blocking && requirement.blocksWork,
    reason,
  }
}

export function evaluateCompliance(input: ComplianceInput): ComplianceResult {
  const now = input.now ?? new Date()
  const items = input.requirements
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    .map((r) => evaluateRequirement(r, input, now))

  const applicableItems = items.filter((i) => i.applicable && i.state !== 'NOT_APPLICABLE')

  const counts = {
    applicable: applicableItems.length,
    approved: applicableItems.filter((i) => i.state === 'APPROVED').length,
    missing: applicableItems.filter((i) => i.state === 'MISSING').length,
    submitted: applicableItems.filter((i) => i.state === 'SUBMITTED').length,
    underReview: applicableItems.filter((i) => i.state === 'UNDER_REVIEW').length,
    rejected: applicableItems.filter((i) => i.state === 'REJECTED').length,
    expired: applicableItems.filter((i) => i.state === 'EXPIRED').length,
    expiringSoon: applicableItems.filter((i) => i.isExpiringSoon).length,
    notApplicable: items.filter((i) => i.state === 'NOT_APPLICABLE').length,
  }

  // --- Bid eligibility ------------------------------------------------------
  const bidBlockers: Blocker[] = []
  const appStatus = input.application?.status ?? 'NOT_STARTED'

  if (appStatus !== 'SUBMITTED' && appStatus !== 'APPROVED') {
    bidBlockers.push({
      code: 'APPLICATION_NOT_SUBMITTED',
      label: 'Application not submitted',
      detail:
        appStatus === 'RETURNED_FOR_CORRECTION'
          ? 'The application was returned for correction and has not been resubmitted.'
          : 'The company application has not been submitted yet.',
      severity: 'hard',
    })
  }
  if (!input.company.legalName?.trim()) {
    bidBlockers.push({
      code: 'MISSING_LEGAL_NAME',
      label: 'Legal business name missing',
      detail: 'A legal business name is required.',
      severity: 'hard',
    })
  }
  if (!input.company.primaryTrade?.trim()) {
    bidBlockers.push({
      code: 'MISSING_PRIMARY_TRADE',
      label: 'Primary trade missing',
      detail: 'A primary trade is required.',
      severity: 'hard',
    })
  }
  if (!input.hasPrimaryContact) {
    bidBlockers.push({
      code: 'MISSING_PRIMARY_CONTACT',
      label: 'Primary contact missing',
      detail: 'A primary contact name and email are required.',
      severity: 'hard',
    })
  }
  if (!input.hasLicenseRecord) {
    bidBlockers.push({
      code: 'MISSING_LICENSE_RECORD',
      label: 'Licence information missing',
      detail: 'Utah contractor licence information has not been provided.',
      severity: 'soft',
    })
  }
  for (const item of items.filter((i) => i.blocksBidNow)) {
    bidBlockers.push({
      code: `REQUIREMENT_${item.code}`,
      label: item.name,
      detail: item.reason ?? 'Required before bidding.',
      severity: 'hard',
      requirementId: item.requirementId,
    })
  }

  // --- Work eligibility -----------------------------------------------------
  const workBlockers: Blocker[] = [...bidBlockers.filter((b) => b.severity === 'hard')]

  if (appStatus !== 'APPROVED') {
    workBlockers.push({
      code: 'APPLICATION_NOT_APPROVED',
      label: 'Application not approved',
      detail: 'An administrator must approve the submitted application.',
      severity: 'hard',
    })
  }
  if (!input.licenseVerified) {
    workBlockers.push({
      code: 'LICENSE_NOT_VERIFIED',
      label: 'Licence not verified',
      detail: 'An administrator has not yet verified the contractor licence.',
      severity: 'hard',
    })
  }
  for (const item of items.filter((i) => i.blocksWorkNow)) {
    if (workBlockers.some((b) => b.requirementId === item.requirementId)) continue
    workBlockers.push({
      code: `REQUIREMENT_${item.code}`,
      label: item.name,
      detail: item.reason ?? 'Required before work may be authorized.',
      severity: 'hard',
      requirementId: item.requirementId,
    })
  }

  const bidEligible = bidBlockers.filter((b) => b.severity === 'hard').length === 0
  const workEligible = workBlockers.length === 0

  // --- Earliest expiration among current, work-blocking items ---------------
  const expiries = items
    .filter((i) => i.applicable && i.state === 'APPROVED' && i.expirationDate && i.blocksWorkNow === false)
    .map((i) => i.expirationDate as Date)
    .filter((d) => d.getTime() >= now.getTime())
  const earliestExpiration = expiries.length
    ? new Date(Math.min(...expiries.map((d) => d.getTime())))
    : null

  const completionPercent =
    counts.applicable === 0 ? 0 : Math.round((counts.approved / counts.applicable) * 100)

  // --- Recommendation -------------------------------------------------------
  const { recommendedStatus, canSystemApply } = recommendStatus({
    current: input.company.status,
    appStatus,
    counts,
    bidEligible,
    workEligible,
  })

  return {
    items,
    counts,
    bidEligible,
    bidBlockers,
    workEligible,
    workBlockers,
    earliestExpiration,
    completionPercent,
    recommendedStatus,
    canSystemApply,
  }
}

function recommendStatus(args: {
  current: CompanyStatusValue
  appStatus: string
  counts: ComplianceResult['counts']
  bidEligible: boolean
  workEligible: boolean
}): { recommendedStatus: CompanyStatusValue | null; canSystemApply: boolean } {
  const { current, appStatus, counts, bidEligible, workEligible } = args

  // Suspended and Do Not Use are terminal. Nothing automatic reactivates them.
  if (LOCKED_STATUSES.includes(current)) {
    return { recommendedStatus: null, canSystemApply: false }
  }

  // The one automatic demotion the system is allowed to apply: a company that
  // holds work clearance but has an expired mandatory document.
  const heldWorkClearance =
    current === 'APPROVED_TO_WORK' || current === 'PREFERRED' || current === 'PROBATIONARY'
  if (heldWorkClearance && counts.expired > 0) {
    return { recommendedStatus: 'INACTIVE_EXPIRED_DOCUMENTS', canSystemApply: true }
  }

  // A company already demoted for expiry that has cleared everything is only
  // *recommended* back — a person decides.
  if (current === 'INACTIVE_EXPIRED_DOCUMENTS') {
    return workEligible
      ? { recommendedStatus: 'APPROVED_TO_WORK', canSystemApply: false }
      : { recommendedStatus: null, canSystemApply: false }
  }

  if (workEligible && current !== 'APPROVED_TO_WORK' && current !== 'PREFERRED') {
    return { recommendedStatus: 'APPROVED_TO_WORK', canSystemApply: false }
  }

  if (bidEligible && !workEligible) {
    if (current === 'APPROVED_TO_BID') return { recommendedStatus: null, canSystemApply: false }
    return { recommendedStatus: 'APPROVED_TO_BID', canSystemApply: false }
  }

  if (appStatus === 'SUBMITTED' && current === 'APPLICATION_SUBMITTED') {
    return { recommendedStatus: 'UNDER_REVIEW', canSystemApply: false }
  }

  if ((counts.missing > 0 || counts.rejected > 0) && appStatus === 'SUBMITTED') {
    if (current === 'DOCUMENTATION_PENDING') return { recommendedStatus: null, canSystemApply: false }
    return { recommendedStatus: 'DOCUMENTATION_PENDING', canSystemApply: false }
  }

  return { recommendedStatus: null, canSystemApply: false }
}

// ---------------------------------------------------------------------------
// Reminders — computed, not scheduled
// ---------------------------------------------------------------------------

/**
 * Which expiry reminders are due right now.
 *
 * This replaces the cron job. Rather than a nightly sweep pushing email, the
 * reminder set is *derived* every time an administrator loads the queue. That
 * means Version 1 needs no paid scheduler and cannot silently stop working
 * because a cron was never configured — the worst case is that nobody looks at
 * the dashboard, which is visible, rather than a job failing quietly.
 *
 * A reminder is due once the item is at or past a threshold and no action has
 * been recorded for that exact (document, threshold) pair.
 */
export const REMINDER_THRESHOLDS = [30, 14, 7, 0] as const
export type ReminderThreshold = (typeof REMINDER_THRESHOLDS)[number]

export type DueReminder = {
  requirementId: string
  documentId: string | null
  code: string
  name: string
  /** The highest threshold this item has crossed. */
  threshold: ReminderThreshold
  thresholdLabel: string
  daysUntilExpiration: number
  expirationDate: Date | null
  isExpired: boolean
  dedupeKey: string
}

/**
 * The threshold an item has crossed, or null if it is not yet within 30 days.
 *
 * Deliberately returns the *most urgent* threshold reached rather than an exact
 * match on the day. A nightly-cron design could fire on exactly day 14; a
 * derived design must still surface the reminder if nobody looked at the
 * dashboard on day 14, otherwise reminders would be silently skipped.
 */
export function thresholdFor(daysUntilExpiration: number): ReminderThreshold | null {
  if (daysUntilExpiration <= 0) return 0
  if (daysUntilExpiration <= 7) return 7
  if (daysUntilExpiration <= 14) return 14
  if (daysUntilExpiration <= 30) return 30
  return null
}

export function thresholdLabel(threshold: ReminderThreshold): string {
  return threshold === 0 ? 'Expired or expiring today' : `Within ${threshold} days`
}

/**
 * Computes due reminders for one company.
 *
 * `handledKeys` is the set of dedupe keys already actioned by an administrator
 * (a Gmail draft opened, or marked handled). Anything in it is filtered out, so
 * the queue does not nag about work already done.
 */
export function dueReminders(
  result: ComplianceResult,
  companyId: string,
  handledKeys: ReadonlySet<string> = new Set(),
): DueReminder[] {
  const out: DueReminder[] = []

  for (const item of result.items) {
    if (!item.applicable) continue
    if (item.state === 'NOT_APPLICABLE') continue
    if (item.daysUntilExpiration === null) continue
    // Only items that were actually approved can expire. A missing document is
    // a different problem, surfaced separately.
    if (item.state !== 'APPROVED' && item.state !== 'EXPIRED') continue

    const threshold = thresholdFor(item.daysUntilExpiration)
    if (threshold === null) continue

    const dedupeKey = `expiration_reminder__${item.documentId ?? `${companyId}:${item.requirementId}`}__${threshold}`
    if (handledKeys.has(dedupeKey)) continue

    out.push({
      requirementId: item.requirementId,
      documentId: item.documentId,
      code: item.code,
      name: item.name,
      threshold,
      thresholdLabel: thresholdLabel(threshold),
      daysUntilExpiration: item.daysUntilExpiration,
      expirationDate: item.expirationDate,
      isExpired: item.isExpired,
      dedupeKey,
    })
  }

  // Most urgent first.
  return out.sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration)
}

// ---------------------------------------------------------------------------
// Presentation helpers
// ---------------------------------------------------------------------------

/**
 * The sentence shown to a trade partner about their own standing. Deliberately
 * avoids promising work — approval is clearance, not an award.
 */
export function eligibilitySentence(
  status: CompanyStatusValue,
  result: ComplianceResult,
): string {
  switch (status) {
    case 'APPROVED_TO_WORK':
    case 'PREFERRED':
      return result.earliestExpiration
        ? `Your company is approved to work with Hardy Homes through the earliest applicable compliance expiration date shown below (${result.earliestExpiration.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}). Individual projects still require written authorization.`
        : 'Your company is approved to work with Hardy Homes. Individual projects still require written authorization.'
    case 'APPROVED_TO_BID':
      return 'You are approved to submit bids but are not yet cleared to begin work. Complete the remaining items below to become eligible for work clearance.'
    case 'PROBATIONARY':
      return 'Your company is approved with additional oversight. Individual projects still require written authorization.'
    case 'INACTIVE_EXPIRED_DOCUMENTS':
      return 'Work clearance is paused because a required document has expired. Upload a current copy below to be considered for reinstatement.'
    case 'SUSPENDED':
      return 'Your account is suspended. Please contact Hardy Homes directly.'
    case 'DO_NOT_USE':
      return 'Your account is not active. Please contact Hardy Homes directly.'
    case 'UNDER_REVIEW':
      return 'Your application is being reviewed. We will be in touch if anything else is needed.'
    case 'APPLICATION_SUBMITTED':
      return 'Your application has been submitted and is waiting on Hardy Homes.'
    case 'DOCUMENTATION_PENDING':
      return 'Some required documents are still missing or need correction. The items below show what is outstanding.'
    default:
      return 'Complete the sections below to submit your application. Submitting an application does not guarantee an award of work.'
  }
}
