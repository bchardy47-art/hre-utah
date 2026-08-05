import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/portal/db'
import { applications } from '@/lib/portal/db/schema'
import { requireTradePartner } from '@/lib/portal/auth/guards'
import { getCompanyCompliance } from '@/lib/portal/services/compliance-service'
import { eligibilitySentence } from '@/lib/portal/compliance'
import { APPLICATION_SECTIONS, DOCUMENT_CATEGORY_LABEL } from '@/lib/portal/constants'
import {
  Card,
  DocumentStateBadge,
  EmptyState,
  HelpFooter,
  Notice,
  PageHead,
  Progress,
  StatusBadge,
  expiryPhrase,
  formatDate,
} from '@/components/portal/ui'

export const dynamic = 'force-dynamic'

export default async function TradePartnerDashboard() {
  const session = await requireTradePartner()
  const compliance = await getCompanyCompliance(session.companyId)
  if (!compliance) notFound()

  const { company, result } = compliance
  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.companyId, session.companyId))
    .limit(1)

  const progress = (application?.sectionProgress ?? {}) as Record<string, boolean>
  const sectionsDone = APPLICATION_SECTIONS.filter((s) => progress[s.key]).length
  const applicationPercent = Math.round((sectionsDone / APPLICATION_SECTIONS.length) * 100)

  const needsAction = result.items.filter(
    (i) => i.applicable && (i.state === 'REJECTED' || i.state === 'EXPIRED'),
  )
  const missing = result.items.filter((i) => i.applicable && i.state === 'MISSING')
  const inReview = result.items.filter(
    (i) => i.applicable && (i.state === 'SUBMITTED' || i.state === 'UNDER_REVIEW'),
  )
  const approved = result.items.filter((i) => i.applicable && i.state === 'APPROVED')
  const expiringSoon = result.items.filter((i) => i.isExpiringSoon)

  const statusTone =
    company.status === 'SUSPENDED' ||
    company.status === 'DO_NOT_USE' ||
    company.status === 'INACTIVE_EXPIRED_DOCUMENTS'
      ? 'bad'
      : company.status === 'APPROVED_TO_WORK' || company.status === 'PREFERRED'
        ? 'good'
        : company.status === 'DOCUMENTATION_PENDING'
          ? 'warn'
          : 'info'

  return (
    <>
      <PageHead
        eyebrow="Your account"
        title={company.legalName}
        subtitle={company.primaryTrade}
        actions={<StatusBadge status={company.status} />}
      />

      <Notice tone={statusTone} title="Current status">
        <p>{eligibilitySentence(company.status, result)}</p>
      </Notice>

      {/* The single most important thing on the page: what to do next. */}
      {needsAction.length > 0 ? (
        <Card title="Needs your attention">
          <ul className="pt-list">
            {needsAction.map((item) => (
              <li className="pt-item" key={item.requirementId}>
                <div className="pt-item-main">
                  <p className="pt-item-name">{item.name}</p>
                  <p className="pt-item-meta">{item.reason}</p>
                </div>
                <DocumentStateBadge state={item.state} />
                <div className="pt-item-actions">
                  <Link
                    className="pt-btn pt-btn-primary pt-btn-sm"
                    href={`/trade-partners/documents#req-${item.requirementId}`}
                  >
                    {item.isAcknowledgment ? 'Review and acknowledge' : 'Upload a correction'}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="pt-grid pt-grid-side pt-mt">
        <div>
          <Card
            title="Your application"
            subtitle={
              application?.status === 'SUBMITTED'
                ? 'Submitted and waiting on Hardy Homes.'
                : application?.status === 'RETURNED_FOR_CORRECTION'
                  ? 'Returned for correction. See the note below.'
                  : 'Complete each section, then submit.'
            }
            actions={
              <Link className="pt-btn pt-btn-ghost pt-btn-sm" href="/trade-partners/company">
                Open application
              </Link>
            }
          >
            {application?.status === 'RETURNED_FOR_CORRECTION' && application.returnReason ? (
              <Notice tone="warn" title="Returned for correction">
                {application.returnReason}
              </Notice>
            ) : null}

            <Progress percent={applicationPercent} label="Application completion" />

            <div className="pt-steps pt-mt">
              {APPLICATION_SECTIONS.map((section) => {
                const done = Boolean(progress[section.key])
                return (
                  <Link
                    key={section.key}
                    href={`/trade-partners/company?section=${section.key}`}
                    className={`pt-step${done ? ' is-done' : ''}`}
                  >
                    <span className="pt-step-mark">{done ? '✓' : section.letter}</span>
                    <span className="pt-step-label">{section.label}</span>
                  </Link>
                )
              })}
            </div>
          </Card>

          <Card
            title="Compliance checklist"
            subtitle={`${result.counts.approved} of ${result.counts.applicable} required items approved.`}
            actions={
              <Link className="pt-btn pt-btn-ghost pt-btn-sm" href="/trade-partners/documents">
                Manage documents
              </Link>
            }
          >
            <Progress percent={result.completionPercent} label="Compliance completion" />

            {missing.length > 0 ? (
              <>
                <h3 className="pt-h3 pt-mt">Still needed ({missing.length})</h3>
                <ul className="pt-list">
                  {missing.map((item) => (
                    <li className="pt-item" key={item.requirementId}>
                      <div className="pt-item-main">
                        <p className="pt-item-name">{item.name}</p>
                        <p className="pt-item-meta">
                          {DOCUMENT_CATEGORY_LABEL[item.category]}
                          {item.isAcknowledgment ? ' · Acknowledgment' : ''}
                        </p>
                      </div>
                      <div className="pt-item-actions">
                        <Link
                          className="pt-btn pt-btn-ghost pt-btn-sm"
                          href={`/trade-partners/documents#req-${item.requirementId}`}
                        >
                          {item.isAcknowledgment ? 'Acknowledge' : 'Upload'}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {inReview.length > 0 ? (
              <>
                <h3 className="pt-h3 pt-mt">Being reviewed ({inReview.length})</h3>
                <ul className="pt-list">
                  {inReview.map((item) => (
                    <li className="pt-item" key={item.requirementId}>
                      <div className="pt-item-main">
                        <p className="pt-item-name">{item.name}</p>
                        <p className="pt-item-meta">No action needed from you right now.</p>
                      </div>
                      <DocumentStateBadge state={item.state} />
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {approved.length > 0 ? (
              <>
                <h3 className="pt-h3 pt-mt">Approved ({approved.length})</h3>
                <ul className="pt-list">
                  {approved.map((item) => (
                    <li className="pt-item" key={item.requirementId}>
                      <div className="pt-item-main">
                        <p className="pt-item-name">{item.name}</p>
                        <p className="pt-item-meta">
                          {item.expirationDate
                            ? `${expiryPhrase(item.daysUntilExpiration)} · ${formatDate(item.expirationDate)}`
                            : 'No expiration'}
                        </p>
                      </div>
                      <DocumentStateBadge state={item.state} />
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {result.counts.applicable === 0 ? (
              <EmptyState title="Nothing required yet">
                Once your application is started, the documents Hardy Homes needs will appear here.
              </EmptyState>
            ) : null}
          </Card>
        </div>

        <div>
          {expiringSoon.length > 0 ? (
            <Card title="Expiring soon">
              <ul className="pt-list">
                {expiringSoon.map((item) => (
                  <li className="pt-item" key={item.requirementId}>
                    <div className="pt-item-main">
                      <p className="pt-item-name">{item.name}</p>
                      <p className="pt-item-meta">
                        {expiryPhrase(item.daysUntilExpiration)} · {formatDate(item.expirationDate)}
                      </p>
                    </div>
                    <div className="pt-item-actions">
                      <Link
                        className="pt-btn pt-btn-ghost pt-btn-sm"
                        href={`/trade-partners/documents#req-${item.requirementId}`}
                      >
                        Replace
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          <Card title="What each status means">
            <dl className="pt-dl">
              <div>
                <dt>Approved to bid</dt>
                <dd className="pt-small">
                  You may provide pricing. You are not cleared to mobilize or perform work.
                </dd>
              </div>
              <div>
                <dt>Approved to work</dt>
                <dd className="pt-small">
                  Every mandatory compliance item is approved and current. Each project still
                  requires written authorization from Hardy Homes before work begins.
                </dd>
              </div>
            </dl>
          </Card>

          <HelpFooter />
        </div>
      </div>
    </>
  )
}
