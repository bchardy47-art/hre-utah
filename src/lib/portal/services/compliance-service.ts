/**
 * Database-backed wrapper around the pure compliance engine.
 *
 * The engine in ../compliance.ts is deliberately free of I/O. This file is the
 * only place that loads the rows it needs, so the rules stay testable without a
 * database and there is exactly one query path feeding them.
 */

import 'server-only'
import { and, eq, inArray, isNull, ne } from 'drizzle-orm'
import { db } from '../db'
import {
  acknowledgments,
  applications,
  companies,
  contacts,
  documentRequirements,
  documents,
  licenses,
  type Company,
} from '../db/schema'
import { evaluateCompliance, type ComplianceResult } from '../compliance'

export type CompanyCompliance = {
  company: Company
  result: ComplianceResult
}

/** Loads everything the engine needs for one company and evaluates it. */
export async function getCompanyCompliance(
  companyId: string,
  now = new Date(),
): Promise<CompanyCompliance | null> {
  const [company] = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1)
  if (!company) return null

  const [requirementRows, documentRows, ackRows, appRows, contactRows, licenseRows] =
    await Promise.all([
      db.select().from(documentRequirements).where(eq(documentRequirements.isActive, true)),
      db
        .select()
        .from(documents)
        .where(and(eq(documents.companyId, companyId), ne(documents.state, 'SUPERSEDED'))),
      db.select().from(acknowledgments).where(eq(acknowledgments.companyId, companyId)),
      db.select().from(applications).where(eq(applications.companyId, companyId)).limit(1),
      db
        .select()
        .from(contacts)
        .where(and(eq(contacts.companyId, companyId), eq(contacts.role, 'PRIMARY'))),
      db.select().from(licenses).where(eq(licenses.companyId, companyId)),
    ])

  const result = evaluateCompliance({
    company,
    application: appRows[0] ? { status: appRows[0].status } : null,
    requirements: requirementRows,
    documents: documentRows,
    acknowledgments: ackRows,
    hasPrimaryContact: contactRows.some((c) => Boolean(c.name?.trim() && c.email?.trim())),
    hasLicenseRecord: licenseRows.some((l) => Boolean(l.licenseNumber?.trim())),
    licenseVerified: licenseRows.some((l) => l.verificationStatus === 'VERIFIED'),
    now,
  })

  return { company, result }
}

/**
 * Batch evaluation for the admin list and dashboard.
 *
 * Loads the shared requirement catalogue once and every company's rows in a
 * handful of `IN` queries, then evaluates in memory — so the list view is a
 * fixed number of round trips regardless of how many companies there are,
 * rather than N+1.
 */
export async function getComplianceForCompanies(
  companyRows: Company[],
  now = new Date(),
): Promise<Map<string, ComplianceResult>> {
  const out = new Map<string, ComplianceResult>()
  if (companyRows.length === 0) return out

  const ids = companyRows.map((c) => c.id)

  const [requirementRows, documentRows, ackRows, appRows, contactRows, licenseRows] =
    await Promise.all([
      db.select().from(documentRequirements).where(eq(documentRequirements.isActive, true)),
      db
        .select()
        .from(documents)
        .where(and(inArray(documents.companyId, ids), ne(documents.state, 'SUPERSEDED'))),
      db.select().from(acknowledgments).where(inArray(acknowledgments.companyId, ids)),
      db.select().from(applications).where(inArray(applications.companyId, ids)),
      db
        .select()
        .from(contacts)
        .where(and(inArray(contacts.companyId, ids), eq(contacts.role, 'PRIMARY'))),
      db.select().from(licenses).where(inArray(licenses.companyId, ids)),
    ])

  const byCompany = <T extends { companyId: string }>(rows: T[]) => {
    const map = new Map<string, T[]>()
    for (const row of rows) {
      const list = map.get(row.companyId)
      if (list) list.push(row)
      else map.set(row.companyId, [row])
    }
    return map
  }

  const docsBy = byCompany(documentRows)
  const acksBy = byCompany(ackRows)
  const appsBy = byCompany(appRows)
  const contactsBy = byCompany(contactRows)
  const licensesBy = byCompany(licenseRows)

  for (const company of companyRows) {
    const companyLicenses = licensesBy.get(company.id) ?? []
    out.set(
      company.id,
      evaluateCompliance({
        company,
        application: appsBy.get(company.id)?.[0]
          ? { status: appsBy.get(company.id)![0].status }
          : null,
        requirements: requirementRows,
        documents: docsBy.get(company.id) ?? [],
        acknowledgments: acksBy.get(company.id) ?? [],
        hasPrimaryContact: (contactsBy.get(company.id) ?? []).some(
          (c) => Boolean(c.name?.trim() && c.email?.trim()),
        ),
        hasLicenseRecord: companyLicenses.some((l) => Boolean(l.licenseNumber?.trim())),
        licenseVerified: companyLicenses.some((l) => l.verificationStatus === 'VERIFIED'),
        now,
      }),
    )
  }

  return out
}

export async function getActiveCompanies(): Promise<Company[]> {
  return db.select().from(companies).where(isNull(companies.archivedAt)).orderBy(companies.legalName)
}
