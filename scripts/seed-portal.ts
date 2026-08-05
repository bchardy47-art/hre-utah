/**
 * Seeds the portal.
 *
 * Two things happen here, and they are deliberately separated:
 *
 *   1. REQUIREMENTS + ADMIN — safe and necessary in every environment,
 *      including production. Requirements are upserted by `code`, so re-running
 *      is idempotent and never clobbers an administrator's later edits to
 *      applicability or template fields.
 *
 *   2. DEMO COMPANIES — development fixtures only. These refuse to run when
 *      NODE_ENV=production unless PORTAL_ALLOW_SEED=true is explicitly set, so
 *      fake trade partners cannot appear in the live portal by accident.
 *
 * Usage:
 *   npm run portal:seed                 # requirements + admin
 *   npm run portal:seed -- --demo       # also creates the four demo companies
 */

import { config } from 'dotenv'
import { eq, sql as raw } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import bcrypt from 'bcryptjs'
import * as schema from '../src/lib/portal/db/schema'
import { REQUIREMENT_SEEDS, REQUIREMENT_CODES } from '../src/lib/portal/requirements'

config({ path: '.env.local' })
config()

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

const client = postgres(url, { max: 1 })
const db = drizzle(client, { schema })

const wantsDemo = process.argv.includes('--demo')

async function seedRequirements() {
  console.log('Seeding document requirements…')
  for (const seed of REQUIREMENT_SEEDS) {
    await db
      .insert(schema.documentRequirements)
      .values({
        code: seed.code,
        name: seed.name,
        category: seed.category,
        description: seed.description,
        isRequired: seed.isRequired,
        applicableTrades: seed.applicableTrades,
        applicableEntityTypes: seed.applicableEntityTypes,
        hasExpiration: seed.hasExpiration,
        allowNotApplicable: seed.allowNotApplicable,
        blocksBid: seed.blocksBid,
        blocksWork: seed.blocksWork,
        requiresReview: seed.requiresReview,
        isAcknowledgment: seed.isAcknowledgment,
        templateIsDraft: seed.templateIsDraft,
        sortOrder: seed.sortOrder,
      })
      .onConflictDoUpdate({
        target: schema.documentRequirements.code,
        // Only descriptive fields are refreshed. Applicability, template keys,
        // and active state are left alone because an administrator may have
        // tuned them for this business.
        set: {
          name: raw`excluded.name`,
          description: raw`excluded.description`,
          category: raw`excluded.category`,
          sortOrder: raw`excluded.sort_order`,
          updatedAt: new Date(),
        },
      })
  }
  console.log(`  ${REQUIREMENT_SEEDS.length} requirements upserted.`)
}

async function seedAdmin() {
  const email = (process.env.PORTAL_SEED_ADMIN_EMAIL ?? '').trim().toLowerCase()
  const password = process.env.PORTAL_SEED_ADMIN_PASSWORD ?? ''
  const name = process.env.PORTAL_SEED_ADMIN_NAME ?? 'Hardy Homes Administrator'

  if (!email || !password) {
    console.log(
      'Skipping administrator: set PORTAL_SEED_ADMIN_EMAIL and PORTAL_SEED_ADMIN_PASSWORD to create one.',
    )
    return
  }
  if (password.length < 12) {
    console.error('PORTAL_SEED_ADMIN_PASSWORD must be at least 12 characters.')
    process.exit(1)
  }

  const existing = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1)
  if (existing.length > 0) {
    console.log(`Administrator ${email} already exists — leaving it untouched.`)
    return
  }

  await db.insert(schema.users).values({
    email,
    passwordHash: await bcrypt.hash(password, 12),
    role: 'ADMIN',
    name,
  })
  console.log(`Administrator created: ${email}`)
}

async function seedDemoCompanies() {
  if (process.env.NODE_ENV === 'production' && process.env.PORTAL_ALLOW_SEED !== 'true') {
    console.error(
      'Refusing to create demo companies in production. Set PORTAL_ALLOW_SEED=true only if you really mean it.',
    )
    return
  }

  console.log('Seeding demo trade partners…')
  const requirements = await db.select().from(schema.documentRequirements)
  const byCode = new Map(requirements.map((r) => [r.code, r]))
  const days = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000)

  const fixtures = [
    {
      legalName: 'Wasatch Framing (DEMO)',
      primaryTrade: 'Framing',
      status: 'DOCUMENTATION_PENDING' as const,
      counties: ['Utah', 'Salt Lake'],
      approve: [REQUIREMENT_CODES.W9],
      expiring: [] as { code: string; days: number }[],
    },
    {
      legalName: 'Summit Electric (DEMO)',
      primaryTrade: 'Electrical',
      status: 'APPROVED_TO_WORK' as const,
      counties: ['Salt Lake', 'Davis', 'Summit'],
      approve: [
        REQUIREMENT_CODES.W9,
        REQUIREMENT_CODES.BUSINESS_REGISTRATION,
        REQUIREMENT_CODES.CONTRACTOR_LICENSE,
        REQUIREMENT_CODES.GL_CERTIFICATE,
        REQUIREMENT_CODES.ADDITIONAL_INSURED,
        REQUIREMENT_CODES.WC_CERTIFICATE,
        REQUIREMENT_CODES.MASTER_SUBCONTRACT,
      ],
      expiring: [{ code: REQUIREMENT_CODES.GL_CERTIFICATE, days: 240 }],
    },
    {
      legalName: 'Valley Plumbing (DEMO)',
      primaryTrade: 'Plumbing',
      status: 'APPROVED_TO_WORK' as const,
      counties: ['Utah', 'Wasatch'],
      approve: [
        REQUIREMENT_CODES.W9,
        REQUIREMENT_CODES.CONTRACTOR_LICENSE,
        REQUIREMENT_CODES.GL_CERTIFICATE,
        REQUIREMENT_CODES.WC_CERTIFICATE,
      ],
      // The point of this fixture: an insurance certificate inside the warning window.
      expiring: [{ code: REQUIREMENT_CODES.GL_CERTIFICATE, days: 12 }],
    },
    {
      legalName: 'Rocky Mountain Concrete (DEMO)',
      primaryTrade: 'Concrete / Flatwork',
      status: 'UNDER_REVIEW' as const,
      counties: ['Utah', 'Juab'],
      approve: [REQUIREMENT_CODES.W9, REQUIREMENT_CODES.GL_CERTIFICATE],
      expiring: [],
    },
  ]

  for (const fixture of fixtures) {
    const existing = await db
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.legalName, fixture.legalName))
      .limit(1)
    if (existing.length > 0) {
      console.log(`  ${fixture.legalName} already present — skipping.`)
      continue
    }

    const [company] = await db
      .insert(schema.companies)
      .values({
        legalName: fixture.legalName,
        primaryTrade: fixture.primaryTrade,
        status: fixture.status,
        entityType: 'LLC',
        serviceAreas: fixture.counties,
        businessCity: 'Provo',
        businessState: 'UT',
        businessZip: '84604',
        mainPhone: '(801) 555-0100',
        generalEmail: `demo+${fixture.legalName.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
        yearEstablished: 2015,
        crewSize: 8,
        description: 'Development fixture. Not a real company.',
      })
      .returning()

    await db.insert(schema.applications).values({
      companyId: company.id,
      status: fixture.status === 'DOCUMENTATION_PENDING' ? 'SUBMITTED' : 'APPROVED',
      submittedAt: new Date(),
    })

    await db.insert(schema.contacts).values({
      companyId: company.id,
      role: 'PRIMARY',
      name: 'Demo Contact',
      title: 'Owner',
      email: `demo+${company.id.slice(0, 8)}@example.com`,
      phone: '(801) 555-0100',
    })

    await db.insert(schema.licenses).values({
      companyId: company.id,
      licenseNumber: `DEMO-${company.id.slice(0, 6).toUpperCase()}`,
      classification: 'S-Series',
      expirationDate: days(400),
      verificationStatus: fixture.status === 'UNDER_REVIEW' ? 'NOT_VERIFIED' : 'VERIFIED',
      verifiedAt: fixture.status === 'UNDER_REVIEW' ? null : new Date(),
      verificationNotes:
        fixture.status === 'UNDER_REVIEW' ? null : 'Demo fixture — manually marked verified.',
    })

    for (const code of fixture.approve) {
      const requirement = byCode.get(code)
      if (!requirement) continue
      const override = fixture.expiring.find((e) => e.code === code)
      if (requirement.isAcknowledgment) {
        await db.insert(schema.acknowledgments).values({
          companyId: company.id,
          requirementId: requirement.id,
          signerName: 'Demo Contact',
          signerTitle: 'Owner',
        })
        continue
      }
      await db.insert(schema.documents).values({
        companyId: company.id,
        requirementId: requirement.id,
        state: 'APPROVED',
        originalFilename: `${code.toLowerCase()}-demo.pdf`,
        // No storage key: these fixtures have no real object behind them, so a
        // download attempt returns "file unavailable" rather than a broken link.
        storageKey: null,
        mimeType: 'application/pdf',
        fileSize: 1024,
        expirationDate: requirement.hasExpiration ? days(override?.days ?? 300) : null,
        reviewedAt: new Date(),
      })
    }

    // Acknowledgments for the approved-to-work fixtures.
    if (fixture.status === 'APPROVED_TO_WORK') {
      for (const requirement of requirements.filter((r) => r.isAcknowledgment && r.isRequired)) {
        await db
          .insert(schema.acknowledgments)
          .values({
            companyId: company.id,
            requirementId: requirement.id,
            signerName: 'Demo Contact',
            signerTitle: 'Owner',
          })
          .onConflictDoNothing()
      }
    }

    await db.insert(schema.statusHistory).values({
      companyId: company.id,
      toStatus: fixture.status,
      reason: 'Development fixture.',
      isSystemGenerated: true,
    })

    console.log(`  Created ${fixture.legalName}`)
  }
}

async function main() {
  await seedRequirements()
  await seedAdmin()
  if (wantsDemo) await seedDemoCompanies()
  console.log('Done.')
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(() => client.end())
