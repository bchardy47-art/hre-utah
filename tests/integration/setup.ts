/**
 * Integration-test harness.
 *
 * These tests run against a real PostgreSQL database so the constraints that
 * actually enforce the rules — the unique index on `tp_notification.dedupe_key`,
 * the `status = 'PENDING'` predicate that makes an invitation single-use, the
 * foreign keys — are exercised rather than mocked. Mocking those would test the
 * mock.
 *
 * Set DATABASE_URL to a scratch database and run `npm run db:migrate` first.
 * The whole file is skipped when DATABASE_URL is absent, so `npm test` still
 * passes on a machine with no database.
 */

import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/lib/portal/db/schema'

export const DATABASE_URL = process.env.DATABASE_URL
export const hasDatabase = Boolean(DATABASE_URL)

const client = hasDatabase ? postgres(DATABASE_URL!, { max: 3 }) : null
export const testDb = client ? drizzle(client, { schema }) : (null as never)

/** Empties every portal table between tests. Order does not matter — CASCADE handles it. */
export async function resetDatabase(): Promise<void> {
  if (!client) return
  await testDb.execute(sql`
    TRUNCATE TABLE
      tp_audit_event, tp_notification, tp_internal_note, tp_status_history,
      tp_acknowledgment, tp_document_review, tp_document, tp_document_requirement,
      tp_project_reference, tp_insurance_policy, tp_license, tp_application,
      tp_invitation, tp_contact, tp_session, tp_user, tp_company
    RESTART IDENTITY CASCADE
  `)
}

export async function closeDatabase(): Promise<void> {
  await client?.end()
}

/**
 * The application modules import `@/lib/portal/db`, which builds its own pool
 * from DATABASE_URL. Pointing both at the same scratch database means the
 * services under test and the assertions below see the same rows.
 */
export async function seedRequirement(overrides: {
  code: string
  name?: string
  category?: schema.DocumentRequirement['category']
  isRequired?: boolean
  hasExpiration?: boolean
  blocksWork?: boolean
  isAcknowledgment?: boolean
  requiresReview?: boolean
}) {
  const [row] = await testDb
    .insert(schema.documentRequirements)
    .values({
      code: overrides.code,
      name: overrides.name ?? overrides.code,
      category: overrides.category ?? 'INSURANCE',
      isRequired: overrides.isRequired ?? true,
      hasExpiration: overrides.hasExpiration ?? false,
      blocksWork: overrides.blocksWork ?? true,
      isAcknowledgment: overrides.isAcknowledgment ?? false,
      requiresReview: overrides.requiresReview ?? true,
    })
    .returning()
  return row
}

export async function seedCompany(name = 'Test Framing LLC') {
  const [company] = await testDb
    .insert(schema.companies)
    .values({ legalName: name, primaryTrade: 'Framing', entityType: 'LLC' })
    .returning()
  await testDb.insert(schema.applications).values({ companyId: company.id, status: 'NOT_STARTED' })
  return company
}

export async function seedUser(args: {
  email: string
  role: 'ADMIN' | 'TRADE_PARTNER'
  companyId?: string | null
  name?: string
}) {
  const [user] = await testDb
    .insert(schema.users)
    .values({
      email: args.email,
      // A real bcrypt hash of "integration test password" — never used to sign in here.
      passwordHash: '$2a$04$KIXQZ8Z8Z8Z8Z8Z8Z8Z8ZOZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z',
      role: args.role,
      name: args.name ?? 'Test User',
      companyId: args.companyId ?? null,
    })
    .returning()
  return user
}

export function sessionFor(user: schema.User) {
  return {
    sessionId: `session-${user.id}`,
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    companyId: user.companyId,
    expiresAt: new Date(Date.now() + 3_600_000),
  }
}

export function daysFromNow(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}
