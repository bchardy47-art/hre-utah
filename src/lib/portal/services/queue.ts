/**
 * The administrator action queue.
 *
 * Turns compliance state across every company into a flat, ranked list of things
 * a person can actually do, each linking straight to the screen where it gets
 * done. This is the difference between a dashboard that reports numbers and one
 * that runs an operation.
 */

import 'server-only'
import { and, eq, inArray, isNull, lt } from 'drizzle-orm'
import { db } from '../db'
import { applications, companies, documents, invitations, licenses } from '../db/schema'
import type { Company, CompanyStatusValue } from '../db/schema'
import { getComplianceForCompanies } from './compliance-service'
import type { ComplianceResult } from '../compliance'

export type QueueItem = {
  id: string
  companyId: string
  companyName: string
  kind:
    | 'application_review'
    | 'document_review'
    | 'resubmitted_document'
    | 'license_verification'
    | 'insurance_expiring'
    | 'license_expired'
    | 'document_expired'
    | 'missing_required'
    | 'awaiting_acknowledgment'
    | 'invitation_expired'
    | 'eligible_for_approval'
  label: string
  detail: string
  href: string
  /** 1 is most urgent. Drives the queue ordering. */
  priority: number
}

export type AdminOverview = {
  companies: Company[]
  compliance: Map<string, ComplianceResult>
  counts: {
    total: number
    invited: number
    applicationsPending: number
    underReview: number
    approvedToBid: number
    approvedToWork: number
    expiringWithin30: number
    expiredItems: number
    suspended: number
    doNotUse: number
  }
  queue: QueueItem[]
}

export async function getAdminOverview(now = new Date()): Promise<AdminOverview> {
  const companyRows = await db
    .select()
    .from(companies)
    .where(isNull(companies.archivedAt))
    .orderBy(companies.legalName)

  const compliance = await getComplianceForCompanies(companyRows, now)
  const ids = companyRows.map((c) => c.id)

  const [applicationRows, licenseRows, expiredInvitations] = await Promise.all([
    ids.length ? db.select().from(applications).where(inArray(applications.companyId, ids)) : [],
    ids.length ? db.select().from(licenses).where(inArray(licenses.companyId, ids)) : [],
    ids.length
      ? db
          .select()
          .from(invitations)
          .where(and(inArray(invitations.companyId, ids), lt(invitations.expiresAt, now), eq(invitations.status, 'PENDING')))
      : [],
  ])

  const appByCompany = new Map(applicationRows.map((a) => [a.companyId, a]))
  const licensesByCompany = new Map<string, typeof licenseRows>()
  for (const row of licenseRows) {
    const list = licensesByCompany.get(row.companyId) ?? []
    list.push(row)
    licensesByCompany.set(row.companyId, list)
  }

  const queue: QueueItem[] = []
  const countOf = (statuses: CompanyStatusValue[]) =>
    companyRows.filter((c) => statuses.includes(c.status)).length

  let expiringWithin30 = 0
  let expiredItems = 0

  for (const company of companyRows) {
    const result = compliance.get(company.id)
    if (!result) continue

    expiringWithin30 += result.counts.expiringSoon
    expiredItems += result.counts.expired

    const base = `/admin/trade-partners/${company.id}`
    const application = appByCompany.get(company.id)

    // 1 — Expired mandatory documents. Highest priority: work clearance is at risk.
    for (const item of result.items.filter((i) => i.state === 'EXPIRED' && i.blocksWorkNow)) {
      queue.push({
        id: `expired:${company.id}:${item.requirementId}`,
        companyId: company.id,
        companyName: company.legalName,
        kind: item.code.includes('LICENSE') ? 'license_expired' : 'document_expired',
        label: `${item.name} expired`,
        detail: 'Work eligibility is blocked until a current copy is approved.',
        href: `${base}?tab=documents#req-${item.requirementId}`,
        priority: 1,
      })
    }

    // 2 — Documents waiting on a decision.
    for (const item of result.items.filter(
      (i) => i.state === 'SUBMITTED' || i.state === 'UNDER_REVIEW',
    )) {
      queue.push({
        id: `review:${company.id}:${item.requirementId}`,
        companyId: company.id,
        companyName: company.legalName,
        kind: 'document_review',
        label: `Review ${item.name}`,
        detail: 'A submitted document is waiting on your decision.',
        href: `${base}?tab=documents#req-${item.requirementId}`,
        priority: 2,
      })
    }

    // 3 — Application waiting on review.
    if (application?.status === 'SUBMITTED') {
      queue.push({
        id: `app:${company.id}`,
        companyId: company.id,
        companyName: company.legalName,
        kind: 'application_review',
        label: 'Review submitted application',
        detail: 'The company has completed and certified its application.',
        href: `${base}?tab=application`,
        priority: 3,
      })
    }

    // 4 — Licence needs manual verification.
    const companyLicenses = licensesByCompany.get(company.id) ?? []
    for (const license of companyLicenses.filter(
      (l) => l.verificationStatus === 'NOT_VERIFIED' && l.licenseNumber,
    )) {
      queue.push({
        id: `license:${license.id}`,
        companyId: company.id,
        companyName: company.legalName,
        kind: 'license_verification',
        label: `Verify licence ${license.licenseNumber}`,
        detail: 'Check the DOPL record and record your verification.',
        href: `${base}?tab=compliance`,
        priority: 4,
      })
    }

    // 5 — Insurance inside the warning window.
    for (const item of result.items.filter((i) => i.isExpiringSoon)) {
      queue.push({
        id: `expiring:${company.id}:${item.requirementId}`,
        companyId: company.id,
        companyName: company.legalName,
        kind: 'insurance_expiring',
        label: `${item.name} expires in ${item.daysUntilExpiration} day${item.daysUntilExpiration === 1 ? '' : 's'}`,
        detail: 'A reminder has been sent to the trade partner.',
        href: `${base}?tab=compliance`,
        priority: 5,
      })
    }

    // 6 — Everything is clear, but nobody has pressed the button.
    if (result.workEligible && company.status !== 'APPROVED_TO_WORK' && company.status !== 'PREFERRED') {
      queue.push({
        id: `eligible:${company.id}`,
        companyId: company.id,
        companyName: company.legalName,
        kind: 'eligible_for_approval',
        label: 'Eligible for approval to work',
        detail: 'Every mandatory item is approved and current. Final approval is yours to give.',
        href: `${base}?tab=status`,
        priority: 6,
      })
    }

    // 7 — Missing mandatory items on a submitted application.
    if (application?.status === 'SUBMITTED' || application?.status === 'APPROVED') {
      const missing = result.items.filter((i) => i.state === 'MISSING' && i.blocksWorkNow)
      if (missing.length > 0) {
        queue.push({
          id: `missing:${company.id}`,
          companyId: company.id,
          companyName: company.legalName,
          kind: missing.some((m) => m.isAcknowledgment) ? 'awaiting_acknowledgment' : 'missing_required',
          label: `${missing.length} required item${missing.length === 1 ? '' : 's'} outstanding`,
          detail: missing
            .slice(0, 3)
            .map((m) => m.name)
            .join(', ') + (missing.length > 3 ? '…' : ''),
          href: `${base}?tab=compliance`,
          priority: 7,
        })
      }
    }
  }

  for (const invitation of expiredInvitations) {
    const company = companyRows.find((c) => c.id === invitation.companyId)
    if (!company) continue
    queue.push({
      id: `invite:${invitation.id}`,
      companyId: company.id,
      companyName: company.legalName,
      kind: 'invitation_expired',
      label: 'Invitation expired',
      detail: `${invitation.email} never activated their account.`,
      href: `/admin/trade-partners/${company.id}?tab=overview`,
      priority: 8,
    })
  }

  queue.sort((a, b) => a.priority - b.priority || a.companyName.localeCompare(b.companyName))

  return {
    companies: companyRows,
    compliance,
    counts: {
      total: companyRows.length,
      invited: countOf(['INVITED']),
      applicationsPending: applicationRows.filter((a) => a.status === 'SUBMITTED').length,
      underReview: countOf(['UNDER_REVIEW', 'APPLICATION_SUBMITTED']),
      approvedToBid: countOf(['APPROVED_TO_BID']),
      approvedToWork: countOf(['APPROVED_TO_WORK', 'PREFERRED', 'PROBATIONARY']),
      expiringWithin30,
      expiredItems,
      suspended: countOf(['SUSPENDED']),
      doNotUse: countOf(['DO_NOT_USE']),
    },
    queue,
  }
}

/** Documents that were rejected and have since been replaced with a newer upload. */
export async function getResubmittedDocuments() {
  return db
    .select({ document: documents, company: companies })
    .from(documents)
    .innerJoin(companies, eq(companies.id, documents.companyId))
    .where(and(eq(documents.state, 'SUBMITTED'), isNull(companies.archivedAt)))
    .orderBy(documents.submittedAt)
}
