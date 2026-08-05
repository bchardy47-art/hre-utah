import Link from 'next/link'
import { getAdminOverview } from '@/lib/portal/services/queue'
import { Card, EmptyState, PageHead, Tile } from '@/components/portal/ui'

export const dynamic = 'force-dynamic'

const KIND_LABEL: Record<string, string> = {
  document_expired: 'Expired document',
  license_expired: 'Expired licence',
  document_review: 'Awaiting review',
  resubmitted_document: 'Resubmitted',
  application_review: 'Application review',
  license_verification: 'Licence verification',
  insurance_expiring: 'Expiring soon',
  missing_required: 'Missing document',
  awaiting_acknowledgment: 'Awaiting acknowledgment',
  invitation_expired: 'Invitation expired',
  eligible_for_approval: 'Ready to approve',
}

export default async function CompliancePage({
  searchParams,
}: {
  searchParams: { kind?: string }
}) {
  const overview = await getAdminOverview()
  const queue = searchParams.kind
    ? overview.queue.filter((q) => q.kind === searchParams.kind)
    : overview.queue

  const byKind = overview.queue.reduce<Record<string, number>>((acc, item) => {
    acc[item.kind] = (acc[item.kind] ?? 0) + 1
    return acc
  }, {})

  return (
    <>
      <PageHead
        eyebrow="Administration"
        title="Compliance queue"
        subtitle="Everything waiting on Hardy Homes, ordered by urgency. Each item links straight to where it gets resolved."
      />

      {Object.keys(byKind).length > 0 ? (
        <div className="pt-tiles">
          <Tile value={overview.queue.length} label="All items" href="/admin/trade-partners/compliance" />
          {Object.entries(byKind).map(([kind, count]) => (
            <Tile
              key={kind}
              value={count}
              label={KIND_LABEL[kind] ?? kind}
              href={`/admin/trade-partners/compliance?kind=${kind}`}
              tone={
                kind === 'document_expired' || kind === 'license_expired'
                  ? 'alert'
                  : kind === 'insurance_expiring'
                    ? 'warn'
                    : kind === 'eligible_for_approval'
                      ? 'good'
                      : undefined
              }
            />
          ))}
        </div>
      ) : null}

      <Card
        title={searchParams.kind ? (KIND_LABEL[searchParams.kind] ?? 'Queue') : 'All open items'}
        actions={
          searchParams.kind ? (
            <Link className="pt-btn pt-btn-ghost pt-btn-sm" href="/admin/trade-partners/compliance">
              Show everything
            </Link>
          ) : undefined
        }
      >
        {queue.length === 0 ? (
          <EmptyState title="Nothing outstanding">
            Every trade partner is current. New submissions and upcoming expirations will appear here
            automatically.
          </EmptyState>
        ) : (
          <ul className="pt-list">
            {queue.map((item) => (
              <li className="pt-item" key={item.id}>
                <div className="pt-item-main">
                  <p className="pt-item-name">
                    <Link href={`/admin/trade-partners/${item.companyId}`}>{item.companyName}</Link>
                    {' — '}
                    {item.label}
                  </p>
                  <p className="pt-item-meta">{item.detail}</p>
                </div>
                <span className="pt-badge pt-badge-neutral">{KIND_LABEL[item.kind] ?? item.kind}</span>
                <div className="pt-item-actions">
                  <Link className="pt-btn pt-btn-primary pt-btn-sm" href={item.href}>
                    Resolve
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
