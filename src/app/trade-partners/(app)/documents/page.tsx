import { notFound } from 'next/navigation'
import { requireTradePartner } from '@/lib/portal/auth/guards'
import { getCompanyCompliance } from '@/lib/portal/services/compliance-service'
import { getActiveRequirements, getCompanyDocuments } from '@/lib/portal/services/documents'
import { ACKNOWLEDGMENT_SUMMARIES, type RequirementCode } from '@/lib/portal/requirements'
import { DOCUMENT_CATEGORY_LABEL } from '@/lib/portal/constants'
import { MAX_UPLOAD_BYTES } from '@/lib/portal/env'
import type { DocumentCategoryValue } from '@/lib/portal/db/schema'
import {
  Card,
  DocumentStateBadge,
  DraftTemplateNotice,
  EmptyState,
  HelpFooter,
  Notice,
  PageHead,
  Progress,
  expiryPhrase,
  formatBytes,
  formatDate,
} from '@/components/portal/ui'
import { UploadPanel } from './UploadPanel'
import { AcknowledgeForm } from './AcknowledgeForm'

export const dynamic = 'force-dynamic'

const CATEGORY_ORDER: DocumentCategoryValue[] = [
  'TAX_AND_CORPORATE',
  'LICENSING',
  'INSURANCE',
  'AGREEMENTS_AND_POLICIES',
  'OTHER',
]

export default async function DocumentsPage() {
  const session = await requireTradePartner()
  const compliance = await getCompanyCompliance(session.companyId)
  if (!compliance) notFound()

  const { company, result } = compliance
  const [allDocuments, allRequirements] = await Promise.all([
    getCompanyDocuments(session.companyId),
    getActiveRequirements(),
  ])

  // Requirement metadata must come from the catalogue, not from the document
  // rows — a requirement with nothing uploaded yet has no document to read it
  // from, and that is exactly the case where the description matters most.
  const requirementById = new Map(allRequirements.map((r) => [r.id, r]))

  const historyByRequirement = new Map<string, typeof allDocuments>()
  for (const row of allDocuments) {
    const list = historyByRequirement.get(row.document.requirementId) ?? []
    list.push(row)
    historyByRequirement.set(row.document.requirementId, list)
  }

  const applicable = result.items.filter((i) => i.applicable)
  const byCategory = new Map<DocumentCategoryValue, typeof applicable>()
  for (const item of applicable) {
    const list = byCategory.get(item.category) ?? []
    list.push(item)
    byCategory.set(item.category, list)
  }

  return (
    <>
      <PageHead
        eyebrow="Compliance documents"
        title="Documents"
        subtitle="Upload each required item. Hardy Homes reviews every submission and will tell you if something needs correcting."
      />

      <Card>
        <Progress percent={result.completionPercent} label="Documents approved" />
        <p className="pt-hint">
          {result.counts.approved} of {result.counts.applicable} required items approved
          {result.counts.rejected > 0 ? ` · ${result.counts.rejected} need correction` : ''}
          {result.counts.expired > 0 ? ` · ${result.counts.expired} expired` : ''}
        </p>
      </Card>

      {applicable.length === 0 ? (
        <Card>
          <EmptyState title="Nothing required yet">
            Once Hardy Homes configures your requirements, they will appear here.
          </EmptyState>
        </Card>
      ) : null}

      {CATEGORY_ORDER.map((category) => {
        const items = byCategory.get(category)
        if (!items?.length) return null

        return (
          <Card key={category} title={DOCUMENT_CATEGORY_LABEL[category]}>
            {items.map((item) => {
              const history = historyByRequirement.get(item.requirementId) ?? []
              const current = history.find((h) => h.document.state !== 'SUPERSEDED')
              const superseded = history.filter((h) => h.document.state === 'SUPERSEDED')
              const requirement = requirementById.get(item.requirementId)
              const summary = ACKNOWLEDGMENT_SUMMARIES[item.code as RequirementCode] ?? []

              return (
                <section
                  key={item.requirementId}
                  id={`req-${item.requirementId}`}
                  style={{
                    padding: '18px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div className="pt-item" style={{ padding: 0, borderBottom: 0 }}>
                    <div className="pt-item-main">
                      <h3 className="pt-item-name">{item.name}</h3>
                      <p className="pt-item-meta">
                        {requirement?.description ?? ''}
                      </p>
                    </div>
                    <DocumentStateBadge state={item.state} />
                  </div>

                  {item.state === 'REJECTED' && item.reason ? (
                    <Notice tone="bad" title="Needs correction">
                      {item.reason}
                    </Notice>
                  ) : null}

                  {item.state === 'EXPIRED' ? (
                    <Notice tone="bad" title="Expired">
                      This document expired on {formatDate(item.expirationDate)}. Upload a current
                      copy to restore eligibility.
                    </Notice>
                  ) : null}

                  {item.isExpiringSoon ? (
                    <Notice tone="warn" title={expiryPhrase(item.daysUntilExpiration)}>
                      Upload a current copy before {formatDate(item.expirationDate)} to keep your
                      clearance active.
                    </Notice>
                  ) : null}

                  {item.state === 'NOT_APPLICABLE' ? (
                    <Notice tone="info">
                      Hardy Homes has marked this item not applicable for your company.
                      {item.reason ? ` ${item.reason}` : ''}
                    </Notice>
                  ) : null}

                  {/* Current file */}
                  {current?.document.storageKey ? (
                    <p className="pt-hint">
                      On file: {current.document.originalFilename} ·{' '}
                      {formatBytes(current.document.fileSize)} · uploaded{' '}
                      {formatDate(current.document.submittedAt)}
                      {current.document.expirationDate
                        ? ` · expires ${formatDate(current.document.expirationDate)}`
                        : ''}{' '}
                      ·{' '}
                      <a
                        href={`/api/portal/documents/${current.document.id}/download`}
                        style={{ color: 'var(--orange)' }}
                      >
                        Download
                      </a>
                    </p>
                  ) : null}

                  {superseded.length > 0 ? (
                    <details style={{ marginTop: 8 }}>
                      <summary className="pt-small pt-muted" style={{ cursor: 'pointer' }}>
                        {superseded.length} earlier version{superseded.length === 1 ? '' : 's'} kept
                        on file
                      </summary>
                      <ul className="pt-list" style={{ marginTop: 8 }}>
                        {superseded.map((row) => (
                          <li className="pt-item" key={row.document.id}>
                            <div className="pt-item-main">
                              <p className="pt-item-meta">
                                Version {row.document.version} ·{' '}
                                {row.document.originalFilename ?? 'file'} ·{' '}
                                {formatDate(row.document.submittedAt)}
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

                  {/* Action */}
                  {item.state === 'NOT_APPLICABLE' ? null : item.isAcknowledgment ? (
                    item.state === 'APPROVED' ? (
                      <p className="pt-hint" style={{ color: '#7fd0a5' }}>
                        Acknowledged. Thank you.
                      </p>
                    ) : (
                      <div style={{ marginTop: 14 }}>
                        {requirement?.templateIsDraft ? <DraftTemplateNotice /> : null}
                        <AcknowledgeForm
                          requirementId={item.requirementId}
                          defaultName={session.name}
                          summary={summary}
                        />
                      </div>
                    )
                  ) : (
                    <details style={{ marginTop: 14 }} open={item.state === 'MISSING' || item.state === 'REJECTED' || item.state === 'EXPIRED'}>
                      <summary
                        className="pt-btn pt-btn-ghost pt-btn-sm"
                        style={{ cursor: 'pointer', display: 'inline-flex' }}
                      >
                        {current ? 'Upload a replacement' : 'Upload this document'}
                      </summary>
                      <div style={{ marginTop: 14 }}>
                        {requirement?.templateIsDraft ? <DraftTemplateNotice /> : null}
                        {current ? (
                          <p className="pt-hint">
                            Uploading a replacement keeps the previous version on file — nothing is
                            deleted.
                          </p>
                        ) : null}
                        <UploadPanel
                          companyId={company.id}
                          requirementId={item.requirementId}
                          requiresExpiration={Boolean(requirement?.hasExpiration)}
                          maxBytes={MAX_UPLOAD_BYTES}
                          label="Choose the file"
                        />
                      </div>
                    </details>
                  )}
                </section>
              )
            })}
          </Card>
        )
      })}

      <HelpFooter />
    </>
  )
}
