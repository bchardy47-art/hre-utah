import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/portal/db'
import {
  applications,
  companies,
  contacts,
  insurancePolicies,
  licenses,
  projectReferences,
} from '@/lib/portal/db/schema'
import { requireTradePartner } from '@/lib/portal/auth/guards'
import { APPLICATION_SECTIONS, type ApplicationSectionKey } from '@/lib/portal/constants'
import { Card, Notice, PageHead, Progress, formatDateTime } from '@/components/portal/ui'
import {
  CertificationForm,
  CompanyForm,
  ContactsForm,
  DisclosuresForm,
  ExperienceForm,
  InsuranceForm,
  LicensingForm,
} from './forms'

export const dynamic = 'force-dynamic'

const SECTION_KEYS = APPLICATION_SECTIONS.map((s) => s.key)

export default async function CompanyApplicationPage({
  searchParams,
}: {
  searchParams: { section?: string }
}) {
  const session = await requireTradePartner()

  const requested = searchParams.section as ApplicationSectionKey | undefined
  const section: ApplicationSectionKey =
    requested && SECTION_KEYS.includes(requested) ? requested : 'company'

  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, session.companyId))
    .limit(1)
  if (!company) notFound()

  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.companyId, session.companyId))
    .limit(1)

  const progress = (application?.sectionProgress ?? {}) as Record<string, boolean>
  const doneCount = APPLICATION_SECTIONS.filter((s) => progress[s.key]).length
  const percent = Math.round((doneCount / APPLICATION_SECTIONS.length) * 100)
  const savedAt = application?.updatedAt ? formatDateTime(application.updatedAt) : null

  const incompleteSections = APPLICATION_SECTIONS.filter(
    (s) => s.key !== 'certification' && !progress[s.key],
  ).map((s) => s.label)

  // Each section loads only what it needs.
  const contactRows =
    section === 'contacts'
      ? await db.select().from(contacts).where(eq(contacts.companyId, session.companyId))
      : []
  const licenseRows =
    section === 'licensing'
      ? await db.select().from(licenses).where(eq(licenses.companyId, session.companyId)).limit(1)
      : []
  const policyRows =
    section === 'insurance'
      ? await db
          .select()
          .from(insurancePolicies)
          .where(eq(insurancePolicies.companyId, session.companyId))
      : []
  const projectRows =
    section === 'experience'
      ? await db
          .select()
          .from(projectReferences)
          .where(eq(projectReferences.companyId, session.companyId))
          .orderBy(projectReferences.createdAt)
      : []

  const current = APPLICATION_SECTIONS.find((s) => s.key === section)!

  return (
    <>
      <PageHead
        eyebrow="Onboarding application"
        title={company.legalName}
        subtitle="Work through each section. Everything saves as you go — you can leave and come back."
      />

      {application?.status === 'RETURNED_FOR_CORRECTION' && application.returnReason ? (
        <Notice tone="warn" title="Returned for correction">
          {application.returnReason}
        </Notice>
      ) : null}

      <div className="pt-grid pt-grid-side">
        <div>
          <Card title={`${current.letter}. ${current.label}`}>
            {section === 'company' ? <CompanyForm company={company} savedAt={savedAt} /> : null}
            {section === 'contacts' ? (
              <ContactsForm contacts={contactRows} savedAt={savedAt} />
            ) : null}
            {section === 'licensing' ? (
              <LicensingForm license={licenseRows[0] ?? null} savedAt={savedAt} />
            ) : null}
            {section === 'insurance' ? (
              <InsuranceForm policies={policyRows} savedAt={savedAt} />
            ) : null}
            {section === 'experience' ? (
              <ExperienceForm projects={projectRows} savedAt={savedAt} />
            ) : null}
            {section === 'disclosures' ? (
              <DisclosuresForm application={application ?? null} savedAt={savedAt} />
            ) : null}
            {section === 'certification' ? (
              <CertificationForm
                application={application ?? null}
                incompleteSections={incompleteSections}
                defaultSignerName={session.name}
              />
            ) : null}
          </Card>
        </div>

        <div>
          <Card title="Sections">
            <Progress percent={percent} label="Application completion" />
            <div className="pt-steps pt-mt">
              {APPLICATION_SECTIONS.map((s) => {
                const done = Boolean(progress[s.key])
                const isCurrent = s.key === section
                return (
                  <Link
                    key={s.key}
                    href={`/trade-partners/company?section=${s.key}`}
                    className={`pt-step${done ? ' is-done' : ''}${isCurrent ? ' is-current' : ''}`}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    <span className="pt-step-mark">{done ? '✓' : s.letter}</span>
                    <span className="pt-step-label">{s.label}</span>
                  </Link>
                )
              })}
            </div>
          </Card>

          <Card title="A note on privacy">
            <p className="pt-sub pt-small">
              Your application is visible only to Hardy Homes administrators. This portal stores only
              the last four digits of your EIN and never asks for bank account or routing numbers.
              Uploaded documents are kept in private storage and are not accessible by a public link.
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}
