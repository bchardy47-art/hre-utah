import Link from 'next/link'
import { notFound } from 'next/navigation'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/portal/db'
import {
  applications,
  auditEvents,
  contacts,
  insurancePolicies,
  invitations,
  licenses,
  projectReferences,
  statusHistory,
  users,
} from '@/lib/portal/db/schema'
import { requireAdmin } from '@/lib/portal/auth/guards'
import { getCompanyCompliance } from '@/lib/portal/services/compliance-service'
import {
  getActiveRequirements,
  getCompanyDocuments,
  getInternalNotes,
} from '@/lib/portal/services/documents'
import { invitationUrl } from '@/lib/portal/services/invitations'
import {
  APPLICATION_SECTIONS,
  APPLICATION_STATUS_LABEL,
  CONTACT_ROLE_LABEL,
  DOCUMENT_CATEGORY_LABEL,
  ENTITY_TYPE_LABEL,
  INSURANCE_KIND_LABEL,
  INVITATION_STATUS_LABEL,
  PROJECT_KIND_LABEL,
} from '@/lib/portal/constants'
import { resendInvitationAction, revokeInvitationAction } from '../../actions'
import {
  Card,
  DocumentStateBadge,
  EmptyState,
  Notice,
  PageHead,
  Progress,
  StatusBadge,
  expiryPhrase,
  formatBytes,
  formatDate,
  formatDateTime,
} from '@/components/portal/ui'
import {
  ApplicationReviewForm,
  DocumentReviewForm,
  InternalNoteForm,
  LicenseVerificationForm,
  ReferenceContactForm,
  StatusForm,
} from './forms'

export const dynamic = 'force-dynamic'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'application', label: 'Application' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'documents', label: 'Documents' },
  { key: 'references', label: 'References' },
  { key: 'status', label: 'Status & Approvals' },
  { key: 'audit', label: 'Audit Log' },
] as const

type TabKey = (typeof TABS)[number]['key']

export default async function TradePartnerProfile({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { tab?: string; invited?: string }
}) {
  const session = await requireAdmin()
  const compliance = await getCompanyCompliance(params.id)
  if (!compliance) notFound()

  const { company, result } = compliance
  const tab: TabKey = (TABS.find((t) => t.key === searchParams.tab)?.key ?? 'overview') as TabKey

  const [
    contactRows,
    applicationRows,
    licenseRows,
    policyRows,
    projectRows,
    invitationRows,
    userRows,
    documentRows,
    requirementRows,
    noteRows,
    statusRows,
    auditRows,
  ] = await Promise.all([
    db.select().from(contacts).where(eq(contacts.companyId, params.id)),
    db.select().from(applications).where(eq(applications.companyId, params.id)).limit(1),
    db.select().from(licenses).where(eq(licenses.companyId, params.id)),
    db.select().from(insurancePolicies).where(eq(insurancePolicies.companyId, params.id)),
    db.select().from(projectReferences).where(eq(projectReferences.companyId, params.id)),
    db
      .select()
      .from(invitations)
      .where(eq(invitations.companyId, params.id))
      .orderBy(desc(invitations.createdAt)),
    db.select().from(users).where(eq(users.companyId, params.id)),
    getCompanyDocuments(params.id),
    getActiveRequirements(),
    getInternalNotes(params.id, session),
    db
      .select({ row: statusHistory, byName: users.name })
      .from(statusHistory)
      .leftJoin(users, eq(users.id, statusHistory.changedById))
      .where(eq(statusHistory.companyId, params.id))
      .orderBy(desc(statusHistory.createdAt)),
    db
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.companyId, params.id))
      .orderBy(desc(auditEvents.createdAt))
      .limit(250),
  ])

  const application = applicationRows[0] ?? null
  const license = licenseRows[0] ?? null
  const requirementById = new Map(requirementRows.map((r) => [r.id, r]))
  const latestInvitation = invitationRows[0] ?? null
  const primaryContact = contactRows.find((c) => c.role === 'PRIMARY')
  const progress = (application?.sectionProgress ?? {}) as Record<string, boolean>

  const historyByRequirement = new Map<string, typeof documentRows>()
  for (const row of documentRows) {
    const list = historyByRequirement.get(row.document.requirementId) ?? []
    list.push(row)
    historyByRequirement.set(row.document.requirementId, list)
  }

  const disclosures: { label: string; answer: boolean | null; text: string | null }[] = application
    ? [
        { label: 'Pending or recent litigation', answer: application.disclosurePendingLitigation, text: application.disclosurePendingLitigationText },
        { label: 'Bankruptcy history', answer: application.disclosureBankruptcy, text: application.disclosureBankruptcyText },
        { label: 'Outstanding judgments or tax liens', answer: application.disclosureJudgmentsOrLiens, text: application.disclosureJudgmentsOrLiensText },
        { label: 'Material insurance claims', answer: application.disclosureInsuranceClaims, text: application.disclosureInsuranceClaimsText },
        { label: 'OSHA / UOSH citations', answer: application.disclosureOshaCitations, text: application.disclosureOshaCitationsText },
        { label: 'Serious workplace injuries', answer: application.disclosureSeriousInjuries, text: application.disclosureSeriousInjuriesText },
        { label: 'Unresolved warranty disputes', answer: application.disclosureWarrantyDisputes, text: application.disclosureWarrantyDisputesText },
        { label: 'Abandoned projects', answer: application.disclosureAbandonedProjects, text: application.disclosureAbandonedProjectsText },
        { label: 'Material supplier disputes', answer: application.disclosureSupplierDisputes, text: application.disclosureSupplierDisputesText },
        { label: 'Uses lower-tier subcontractors', answer: application.disclosureUsesLowerTierSubs, text: application.disclosureUsesLowerTierSubsText },
        { label: 'Workers legally authorized and properly classified', answer: application.disclosureWorkersAuthorized, text: application.disclosureWorkersAuthorizedText },
      ]
    : []

  const tabHref = (key: TabKey) => `/admin/trade-partners/${params.id}?tab=${key}`

  return (
    <>
      <PageHead
        eyebrow="Trade partner"
        title={company.legalName}
        subtitle={[company.dba ? `dba ${company.dba}` : null, company.primaryTrade]
          .filter(Boolean)
          .join(' · ')}
        actions={
          <>
            <StatusBadge status={company.status} />
            <Link className="pt-btn pt-btn-ghost pt-btn-sm" href={tabHref('status')}>
              Change status
            </Link>
          </>
        }
      />

      {searchParams.invited ? (
        <Notice tone="good" title="Invitation sent">
          The invitation email is on its way. You can resend or copy the link below.
        </Notice>
      ) : null}

      {/* Header summary — the four facts an administrator always wants first. */}
      <div className="pt-tiles">
        <div className="pt-tile">
          <div className="pt-tile-value pt-mono">
            {result.counts.approved}/{result.counts.applicable}
          </div>
          <div className="pt-tile-label">Requirements approved</div>
        </div>
        <div className={`pt-tile${result.bidEligible ? ' is-good' : ''}`}>
          <div className="pt-tile-value" style={{ fontSize: 20 }}>
            {result.bidEligible ? 'Eligible' : 'Not yet'}
          </div>
          <div className="pt-tile-label">Bid eligibility</div>
        </div>
        <div className={`pt-tile${result.workEligible ? ' is-good' : ''}`}>
          <div className="pt-tile-value" style={{ fontSize: 20 }}>
            {result.workEligible ? 'Eligible' : 'Not yet'}
          </div>
          <div className="pt-tile-label">Work eligibility</div>
        </div>
        <div className="pt-tile">
          <div className="pt-tile-value" style={{ fontSize: 20 }}>
            {primaryContact?.name ?? '—'}
          </div>
          <div className="pt-tile-label">Primary contact</div>
        </div>
      </div>

      {result.recommendedStatus && result.recommendedStatus !== company.status ? (
        <Notice tone="info" title="System recommendation">
          <p>
            Based on current compliance, this company could be moved to{' '}
            <strong>{result.recommendedStatus.replace(/_/g, ' ').toLowerCase()}</strong>. Approval is
            still yours to give.{' '}
            <Link href={tabHref('status')} style={{ color: 'var(--orange)' }}>
              Review status
            </Link>
          </p>
        </Notice>
      ) : null}

      <nav className="pt-tabs" aria-label="Company sections">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={tabHref(t.key)}
            className={t.key === tab ? 'is-active' : undefined}
            aria-current={t.key === tab ? 'page' : undefined}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {/* ---------------------------------------------------------------- */}
      {tab === 'overview' ? (
        <div className="pt-grid pt-grid-side">
          <div>
            <Card title="Company details">
              <dl className="pt-dl pt-dl-2">
                <div>
                  <dt>Legal name</dt>
                  <dd>{company.legalName}</dd>
                </div>
                <div>
                  <dt>DBA</dt>
                  <dd>{company.dba ?? '—'}</dd>
                </div>
                <div>
                  <dt>Entity type</dt>
                  <dd>{company.entityType ? ENTITY_TYPE_LABEL[company.entityType] : '—'}</dd>
                </div>
                <div>
                  <dt>EIN</dt>
                  {/* Only the last four are ever stored; the W-9 is the record. */}
                  <dd>{company.einLast4 ? `•••• ${company.einLast4}` : '—'}</dd>
                </div>
                <div>
                  <dt>Main phone</dt>
                  <dd>{company.mainPhone ?? '—'}</dd>
                </div>
                <div>
                  <dt>General email</dt>
                  <dd>{company.generalEmail ?? '—'}</dd>
                </div>
                <div>
                  <dt>Website</dt>
                  <dd>{company.website ?? '—'}</dd>
                </div>
                <div>
                  <dt>Business address</dt>
                  <dd>
                    {company.businessAddress1
                      ? `${company.businessAddress1}, ${company.businessCity ?? ''} ${company.businessState ?? ''} ${company.businessZip ?? ''}`
                      : '—'}
                  </dd>
                </div>
                <div>
                  <dt>Established</dt>
                  <dd>{company.yearEstablished ?? '—'}</dd>
                </div>
                <div>
                  <dt>Crew size</dt>
                  <dd>{company.crewSize ?? '—'}</dd>
                </div>
                <div>
                  <dt>Annual capacity</dt>
                  <dd>{company.annualCapacity ?? '—'}</dd>
                </div>
                <div>
                  <dt>Current backlog</dt>
                  <dd>{company.currentBacklog ?? '—'}</dd>
                </div>
                <div>
                  <dt>Typical project size</dt>
                  <dd>{company.typicalProjectSize ?? '—'}</dd>
                </div>
                <div>
                  <dt>Uses lower-tier subs</dt>
                  <dd>{company.usesLowerTierSubs === null ? '—' : company.usesLowerTierSubs ? 'Yes' : 'No'}</dd>
                </div>
              </dl>

              {company.additionalTrades?.length ? (
                <>
                  <h3 className="pt-h3 pt-mt">Additional trades</h3>
                  <p className="pt-sub pt-small">{company.additionalTrades.join(', ')}</p>
                </>
              ) : null}

              {company.serviceAreas?.length ? (
                <>
                  <h3 className="pt-h3 pt-mt">Service area</h3>
                  <p className="pt-sub pt-small">
                    {company.serviceAreas.map((c) => `${c} County`).join(', ')}
                  </p>
                </>
              ) : null}

              {company.description ? (
                <>
                  <h3 className="pt-h3 pt-mt">Description</h3>
                  <p className="pt-sub pt-small">{company.description}</p>
                </>
              ) : null}
            </Card>

            <Card title="Contacts">
              {contactRows.length === 0 ? (
                <EmptyState title="No contacts yet">
                  Contacts appear once the trade partner completes Section B.
                </EmptyState>
              ) : (
                <div className="pt-table-wrap">
                  <table className="pt-table">
                    <thead>
                      <tr>
                        <th scope="col">Role</th>
                        <th scope="col">Name</th>
                        <th scope="col">Title</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactRows.map((contact) => (
                        <tr key={contact.id}>
                          <td>{CONTACT_ROLE_LABEL[contact.role]}</td>
                          <td>{contact.name}</td>
                          <td>{contact.title ?? '—'}</td>
                          <td>{contact.email ?? '—'}</td>
                          <td className="pt-nowrap">{contact.phone ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          <div>
            <Card title="Account and invitation">
              <dl className="pt-dl">
                <div>
                  <dt>Portal accounts</dt>
                  <dd>
                    {userRows.length === 0
                      ? 'None yet — the invitation has not been accepted.'
                      : userRows.map((u) => `${u.name} (${u.email})`).join(', ')}
                  </dd>
                </div>
                {userRows[0]?.lastLoginAt ? (
                  <div>
                    <dt>Last sign-in</dt>
                    <dd>{formatDateTime(userRows[0].lastLoginAt)}</dd>
                  </div>
                ) : null}
              </dl>

              {latestInvitation ? (
                <>
                  <h3 className="pt-h3 pt-mt">Latest invitation</h3>
                  <dl className="pt-dl">
                    <div>
                      <dt>Status</dt>
                      <dd>{INVITATION_STATUS_LABEL[latestInvitation.status]}</dd>
                    </div>
                    <div>
                      <dt>Sent to</dt>
                      <dd>{latestInvitation.email}</dd>
                    </div>
                    <div>
                      <dt>Sent</dt>
                      <dd>{formatDateTime(latestInvitation.lastSentAt)}</dd>
                    </div>
                    <div>
                      <dt>Opened</dt>
                      <dd>{latestInvitation.openedAt ? formatDateTime(latestInvitation.openedAt) : 'Not yet'}</dd>
                    </div>
                    <div>
                      <dt>Accepted</dt>
                      <dd>{latestInvitation.acceptedAt ? formatDateTime(latestInvitation.acceptedAt) : 'Not yet'}</dd>
                    </div>
                    <div>
                      <dt>Expires</dt>
                      <dd>{formatDateTime(latestInvitation.expiresAt)}</dd>
                    </div>
                    <div>
                      <dt>Times sent</dt>
                      <dd>{latestInvitation.resendCount + 1}</dd>
                    </div>
                  </dl>

                  {latestInvitation.status === 'PENDING' || latestInvitation.status === 'EXPIRED' ? (
                    <div className="pt-btn-row pt-mt">
                      <form action={resendInvitationAction}>
                        <input type="hidden" name="invitationId" value={latestInvitation.id} />
                        <input type="hidden" name="companyId" value={company.id} />
                        <button type="submit" className="pt-btn pt-btn-ghost pt-btn-sm">
                          Resend with a new link
                        </button>
                      </form>
                      <form action={revokeInvitationAction}>
                        <input type="hidden" name="invitationId" value={latestInvitation.id} />
                        <input type="hidden" name="companyId" value={company.id} />
                        <button type="submit" className="pt-btn pt-btn-danger pt-btn-sm">
                          Revoke
                        </button>
                      </form>
                    </div>
                  ) : null}

                  <p className="pt-hint">
                    {/* The raw token is never stored, so a link cannot be re-displayed. */}
                    For security, the invitation link is shown only once, at the moment it is
                    created. Use &ldquo;Resend&rdquo; to issue a fresh link — it invalidates the
                    previous one.
                  </p>
                </>
              ) : (
                <p className="pt-hint">No invitation on record.</p>
              )}
            </Card>

            <Card title="Internal notes">
              <p className="pt-internal-flag">Administrator only</p>
              <InternalNoteForm companyId={company.id} />
              {noteRows.length === 0 ? (
                <p className="pt-hint">No notes yet.</p>
              ) : (
                <div className="pt-mt">
                  {noteRows.map(({ note, authorName, requirementName }) => (
                    <div className="pt-note" key={note.id}>
                      <div>{note.body}</div>
                      <div className="pt-note-meta">
                        {authorName} · {formatDateTime(note.createdAt)}
                        {requirementName ? ` · re: ${requirementName}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {tab === 'application' ? (
        <div className="pt-grid pt-grid-side">
          <div>
            <Card
              title="Application"
              subtitle={application ? APPLICATION_STATUS_LABEL[application.status] : 'Not started'}
            >
              {!application || application.status === 'NOT_STARTED' ? (
                <EmptyState title="Not started">
                  The trade partner has not begun the application yet.
                </EmptyState>
              ) : (
                <>
                  <div className="pt-steps pt-mb">
                    {APPLICATION_SECTIONS.map((s) => (
                      <div key={s.key} className={`pt-step${progress[s.key] ? ' is-done' : ''}`}>
                        <span className="pt-step-mark">{progress[s.key] ? '✓' : s.letter}</span>
                        <span className="pt-step-label">{s.label}</span>
                      </div>
                    ))}
                  </div>

                  <dl className="pt-dl pt-dl-2">
                    <div>
                      <dt>Submitted</dt>
                      <dd>{formatDateTime(application.submittedAt)}</dd>
                    </div>
                    <div>
                      <dt>Certified by</dt>
                      <dd>
                        {application.signerName
                          ? `${application.signerName}${application.signerTitle ? `, ${application.signerTitle}` : ''}`
                          : '—'}
                      </dd>
                    </div>
                    <div>
                      <dt>Certification version</dt>
                      <dd>{application.certificationVersion ?? '—'}</dd>
                    </div>
                    <div>
                      <dt>Signed from</dt>
                      <dd className="pt-small">{application.signerIpAddress ?? '—'}</dd>
                    </div>
                  </dl>

                  {application.returnReason ? (
                    <Notice tone="warn" title="Returned for correction">
                      {application.returnReason}
                    </Notice>
                  ) : null}
                </>
              )}
            </Card>

            <Card
              title="Operational disclosures"
              subtitle="Applicant-reported. These are disclosures, not findings by Hardy Homes."
            >
              {disclosures.length === 0 ? (
                <EmptyState title="Not yet answered" />
              ) : (
                <ul className="pt-list">
                  {disclosures.map((d) => (
                    <li className="pt-item" key={d.label}>
                      <div className="pt-item-main">
                        <p className="pt-item-name">{d.label}</p>
                        {d.text ? <p className="pt-item-meta">{d.text}</p> : null}
                      </div>
                      <span
                        className={`pt-badge pt-badge-${
                          d.answer === null ? 'neutral' : d.answer ? 'warn' : 'good'
                        }`}
                      >
                        {d.answer === null ? 'No answer' : d.answer ? 'Yes' : 'No'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div>
            {application?.status === 'SUBMITTED' ? (
              <Card title="Review this application">
                <ApplicationReviewForm companyId={company.id} />
              </Card>
            ) : (
              <Card title="Review">
                <p className="pt-sub pt-small">
                  {application?.status === 'APPROVED'
                    ? 'This application has been approved.'
                    : application?.status === 'RETURNED_FOR_CORRECTION'
                      ? 'Waiting on the trade partner to correct and resubmit.'
                      : 'The application must be submitted before it can be reviewed.'}
                </p>
                {application?.status === 'APPROVED' ? (
                  <div className="pt-mt">
                    <ApplicationReviewForm companyId={company.id} />
                  </div>
                ) : null}
              </Card>
            )}
          </div>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {tab === 'compliance' ? (
        <div className="pt-grid pt-grid-side">
          <div>
            <Card title="Requirement checklist">
              <Progress percent={result.completionPercent} label="Compliance completion" />
              <ul className="pt-list pt-mt">
                {result.items.map((item) => (
                  <li className="pt-item" key={item.requirementId}>
                    <div className="pt-item-main">
                      <p className="pt-item-name">{item.name}</p>
                      <p className="pt-item-meta">
                        {DOCUMENT_CATEGORY_LABEL[item.category]}
                        {item.reason ? ` · ${item.reason}` : ''}
                        {item.expirationDate
                          ? ` · ${expiryPhrase(item.daysUntilExpiration)} (${formatDate(item.expirationDate)})`
                          : ''}
                      </p>
                    </div>
                    {item.blocksWorkNow ? (
                      <span className="pt-badge pt-badge-bad">Blocks work</span>
                    ) : null}
                    <DocumentStateBadge state={item.state} />
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Insurance on file">
              {policyRows.length === 0 ? (
                <EmptyState title="No policy details yet" />
              ) : (
                <div className="pt-table-wrap">
                  <table className="pt-table">
                    <thead>
                      <tr>
                        <th scope="col">Coverage</th>
                        <th scope="col">Carrier</th>
                        <th scope="col">Limits</th>
                        <th scope="col">Effective</th>
                        <th scope="col">Expires</th>
                      </tr>
                    </thead>
                    <tbody>
                      {policyRows.map((policy) => (
                        <tr key={policy.id}>
                          <td>{INSURANCE_KIND_LABEL[policy.kind]}</td>
                          <td>{policy.carrier ?? '—'}</td>
                          <td className="pt-small">
                            {[policy.perOccurrenceLimit, policy.aggregateLimit]
                              .filter(Boolean)
                              .join(' / ') || '—'}
                          </td>
                          <td className="pt-nowrap">{formatDate(policy.effectiveDate)}</td>
                          <td className="pt-nowrap">{formatDate(policy.expirationDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="pt-hint">
                Policy numbers are stored but not shown here. Open the certificate on the Documents
                tab when you need to check one.
              </p>
            </Card>
          </div>

          <div>
            <Card title="Blockers">
              {result.workBlockers.length === 0 ? (
                <p className="pt-sub pt-small" style={{ color: '#7fd0a5' }}>
                  Nothing is blocking work approval.
                </p>
              ) : (
                <ul className="pt-list">
                  {result.workBlockers.map((blocker) => (
                    <li className="pt-item" key={blocker.code}>
                      <div className="pt-item-main">
                        <p className="pt-item-name">{blocker.label}</p>
                        <p className="pt-item-meta">{blocker.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Licence verification">
              {!license ? (
                <EmptyState title="No licence on file">
                  Licence details appear once the trade partner completes Section C.
                </EmptyState>
              ) : (
                <>
                  <dl className="pt-dl">
                    <div>
                      <dt>Licence number</dt>
                      <dd>{license.licenseNumber}</dd>
                    </div>
                    <div>
                      <dt>Classification</dt>
                      <dd>{license.classification ?? '—'}</dd>
                    </div>
                    <div>
                      <dt>Licensed entity</dt>
                      <dd>{license.licensedEntityName ?? '—'}</dd>
                    </div>
                    <div>
                      <dt>Qualifier</dt>
                      <dd>{license.qualifierName ?? '—'}</dd>
                    </div>
                    <div>
                      <dt>Expires</dt>
                      <dd>{formatDate(license.expirationDate)}</dd>
                    </div>
                    <div>
                      <dt>Verification</dt>
                      <dd>{license.verificationStatus.replace(/_/g, ' ').toLowerCase()}</dd>
                    </div>
                    {license.verifiedAt ? (
                      <div>
                        <dt>Verified</dt>
                        <dd>{formatDateTime(license.verifiedAt)}</dd>
                      </div>
                    ) : null}
                  </dl>

                  {license.everDisciplined ? (
                    <Notice tone="warn" title="Disclosed licence action">
                      {license.disciplineExplanation ?? 'The company disclosed a prior licence action.'}
                    </Notice>
                  ) : null}

                  <div className="pt-mt">
                    <LicenseVerificationForm
                      licenseId={license.id}
                      licenseNumber={license.licenseNumber}
                      currentStatus={license.verificationStatus}
                      defaultNotes={license.verificationNotes}
                      defaultSource={license.verificationSource}
                    />
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {tab === 'documents' ? (
        <Card title="Documents">
          {result.items.filter((i) => i.applicable && !i.isAcknowledgment).length === 0 ? (
            <EmptyState title="No document requirements apply" />
          ) : (
            result.items
              .filter((i) => i.applicable)
              .map((item) => {
                const history = historyByRequirement.get(item.requirementId) ?? []
                const current = history.find((h) => h.document.state !== 'SUPERSEDED')
                const older = history.filter((h) => h.document.state === 'SUPERSEDED')
                const requirement = requirementById.get(item.requirementId)

                return (
                  <section
                    key={item.requirementId}
                    id={`req-${item.requirementId}`}
                    style={{ padding: '18px 0', borderBottom: '1px solid var(--border)' }}
                  >
                    <div className="pt-item" style={{ padding: 0, borderBottom: 0 }}>
                      <div className="pt-item-main">
                        <h3 className="pt-item-name">{item.name}</h3>
                        <p className="pt-item-meta">
                          {DOCUMENT_CATEGORY_LABEL[item.category]}
                          {requirement?.isRequired ? ' · Required' : ' · Optional'}
                          {requirement?.blocksWork ? ' · Blocks work' : ''}
                          {item.isAcknowledgment ? ' · Acknowledgment' : ''}
                        </p>
                      </div>
                      <DocumentStateBadge state={item.state} />
                    </div>

                    {item.isAcknowledgment ? (
                      <p className="pt-hint">
                        {item.state === 'APPROVED'
                          ? 'Acknowledged electronically by the trade partner.'
                          : 'Waiting on the trade partner to acknowledge in the portal.'}
                      </p>
                    ) : (
                      <>
                        {current ? (
                          <div className="pt-mt">
                            <p className="pt-hint">
                              Version {current.document.version} ·{' '}
                              {current.document.originalFilename ?? 'file'} ·{' '}
                              {formatBytes(current.document.fileSize)} · submitted{' '}
                              {formatDateTime(current.document.submittedAt)}
                              {current.document.expirationDate
                                ? ` · expires ${formatDate(current.document.expirationDate)}`
                                : ''}
                            </p>
                            {current.document.storageKey ? (
                              <a
                                className="pt-btn pt-btn-ghost pt-btn-sm"
                                href={`/api/portal/documents/${current.document.id}/download`}
                              >
                                Download
                              </a>
                            ) : (
                              <p className="pt-hint pt-muted">No stored file for this record.</p>
                            )}

                            <details style={{ marginTop: 14 }} open={item.state === 'SUBMITTED'}>
                              <summary
                                className="pt-btn pt-btn-ghost pt-btn-sm"
                                style={{ cursor: 'pointer', display: 'inline-flex' }}
                              >
                                Review this document
                              </summary>
                              <div style={{ marginTop: 14 }}>
                                <DocumentReviewForm
                                  documentId={current.document.id}
                                  companyId={company.id}
                                />
                                <div className="pt-mt">
                                  <InternalNoteForm
                                    companyId={company.id}
                                    documentId={current.document.id}
                                  />
                                </div>
                              </div>
                            </details>
                          </div>
                        ) : (
                          <p className="pt-hint">Nothing submitted yet.</p>
                        )}

                        {older.length > 0 ? (
                          <details style={{ marginTop: 10 }}>
                            <summary className="pt-small pt-muted" style={{ cursor: 'pointer' }}>
                              {older.length} superseded version{older.length === 1 ? '' : 's'}
                            </summary>
                            <ul className="pt-list" style={{ marginTop: 8 }}>
                              {older.map((row) => (
                                <li className="pt-item" key={row.document.id}>
                                  <div className="pt-item-main">
                                    <p className="pt-item-meta">
                                      v{row.document.version} ·{' '}
                                      {row.document.originalFilename ?? 'file'} ·{' '}
                                      {formatDateTime(row.document.submittedAt)}
                                      {row.document.rejectionReason
                                        ? ` · rejected: ${row.document.rejectionReason}`
                                        : ''}
                                    </p>
                                  </div>
                                  {row.document.storageKey ? (
                                    <a
                                      className="pt-btn pt-btn-ghost pt-btn-sm"
                                      href={`/api/portal/documents/${row.document.id}/download`}
                                    >
                                      Download
                                    </a>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </details>
                        ) : null}
                      </>
                    )}
                  </section>
                )
              })
          )}
        </Card>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {tab === 'references' ? (
        <Card title="Projects and references">
          {projectRows.length === 0 ? (
            <EmptyState title="No references yet">
              References appear once the trade partner completes Section E.
            </EmptyState>
          ) : (
            projectRows.map((project) => (
              <section
                key={project.id}
                style={{ padding: '18px 0', borderBottom: '1px solid var(--border)' }}
              >
                <h3 className="pt-h3">
                  {project.projectName ?? 'Untitled project'} —{' '}
                  <span className="pt-muted">{PROJECT_KIND_LABEL[project.kind]}</span>
                </h3>
                <dl className="pt-dl pt-dl-2 pt-mt">
                  <div>
                    <dt>Reference</dt>
                    <dd>
                      {project.referenceName}
                      {project.referenceCompany ? `, ${project.referenceCompany}` : ''}
                    </dd>
                  </div>
                  <div>
                    <dt>Contact</dt>
                    <dd>
                      {project.permissionToContact ? (
                        <>
                          {project.referencePhone ?? '—'}
                          {project.referenceEmail ? ` · ${project.referenceEmail}` : ''}
                        </>
                      ) : (
                        <span className="pt-muted">Permission to contact not granted</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Type and location</dt>
                    <dd>
                      {[project.projectType, project.projectLocation].filter(Boolean).join(' · ') || '—'}
                    </dd>
                  </div>
                  <div>
                    <dt>Amount and completion</dt>
                    <dd>
                      {[project.contractAmountRange, formatDate(project.completionDate)]
                        .filter((v) => v && v !== '—')
                        .join(' · ') || '—'}
                    </dd>
                  </div>
                </dl>
                {project.scopePerformed ? (
                  <p className="pt-sub pt-small pt-mt">{project.scopePerformed}</p>
                ) : null}

                {project.contactedAt ? (
                  <div className="pt-note pt-mt">
                    <div>{project.contactNotes}</div>
                    <div className="pt-note-meta">Reference checked {formatDateTime(project.contactedAt)}</div>
                  </div>
                ) : null}

                <div className="pt-mt">
                  <ReferenceContactForm
                    projectId={project.id}
                    referenceName={project.referenceName}
                    defaultNotes={project.contactNotes}
                  />
                </div>
              </section>
            ))
          )}
        </Card>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {tab === 'status' ? (
        <div className="pt-grid pt-grid-side">
          <div>
            <Card title="Change status">
              <StatusForm
                companyId={company.id}
                currentStatus={company.status}
                workEligible={result.workEligible}
                workBlockers={result.workBlockers.map((b) => b.label)}
              />
            </Card>
          </div>
          <div>
            <Card title="Status history">
              {statusRows.length === 0 ? (
                <EmptyState title="No changes recorded yet" />
              ) : (
                <ul className="pt-timeline">
                  {statusRows.map(({ row, byName }) => (
                    <li key={row.id}>
                      <span className="pt-timeline-time">{formatDateTime(row.createdAt)}</span>
                      <div className="pt-timeline-body">
                        {row.fromStatus ? `${row.fromStatus.replace(/_/g, ' ')} → ` : ''}
                        <strong>{row.toStatus.replace(/_/g, ' ')}</strong>
                      </div>
                      {row.reason ? <div className="pt-timeline-actor">{row.reason}</div> : null}
                      <div className="pt-timeline-actor">
                        {row.isSystemGenerated ? 'System' : (byName ?? 'Unknown')}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {tab === 'audit' ? (
        <Card
          title="Audit log"
          subtitle="Append-only. The 250 most recent events for this company."
        >
          {auditRows.length === 0 ? (
            <EmptyState title="No events recorded yet" />
          ) : (
            <ul className="pt-timeline">
              {auditRows.map((event) => (
                <li key={event.id}>
                  <span className="pt-timeline-time">{formatDateTime(event.createdAt)}</span>
                  <div className="pt-timeline-body">{event.summary}</div>
                  <div className="pt-timeline-actor">
                    {event.actorLabel ?? 'System'} · {event.action}
                    {event.ipAddress ? ` · ${event.ipAddress}` : ''}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : null}
    </>
  )
}
