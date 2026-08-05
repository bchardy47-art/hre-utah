import Link from 'next/link'
import { getAdminOverview } from '@/lib/portal/services/queue'
import {
  COMPANY_STATUS_META,
  TRADES,
  UTAH_COUNTIES,
} from '@/lib/portal/constants'
import type { CompanyStatusValue } from '@/lib/portal/db/schema'
import {
  Card,
  EmptyState,
  PageHead,
  StatusBadge,
  Tile,
  expiryPhrase,
  formatDate,
} from '@/components/portal/ui'

export const dynamic = 'force-dynamic'

type Filters = {
  status?: string
  trade?: string
  county?: string
  eligibility?: string
  issue?: string
  q?: string
}

export default async function AdminTradePartnersPage({
  searchParams,
}: {
  searchParams: Filters
}) {
  const overview = await getAdminOverview()
  const { counts, queue } = overview

  const search = (searchParams.q ?? '').trim().toLowerCase()

  const rows = overview.companies
    .map((company) => ({ company, result: overview.compliance.get(company.id)! }))
    .filter(({ company, result }) => {
      if (searchParams.status && company.status !== searchParams.status) return false
      if (searchParams.trade) {
        const trades = [company.primaryTrade, ...(company.additionalTrades ?? [])]
        if (!trades.includes(searchParams.trade)) return false
      }
      if (searchParams.county && !company.serviceAreas?.includes(searchParams.county)) return false

      if (searchParams.eligibility === 'work' && !result?.workEligible) return false
      if (searchParams.eligibility === 'bid' && !result?.bidEligible) return false
      if (searchParams.eligibility === 'neither' && (result?.bidEligible || result?.workEligible)) {
        return false
      }

      if (searchParams.issue === 'missing' && (result?.counts.missing ?? 0) === 0) return false
      if (searchParams.issue === 'expiring' && (result?.counts.expiringSoon ?? 0) === 0) return false
      if (searchParams.issue === 'expired' && (result?.counts.expired ?? 0) === 0) return false
      if (searchParams.issue === 'rejected' && (result?.counts.rejected ?? 0) === 0) return false

      if (search) {
        const haystack = [
          company.legalName,
          company.dba ?? '',
          company.generalEmail ?? '',
          company.primaryTrade,
          company.mainPhone ?? '',
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })

  const activeFilters = Object.entries(searchParams).filter(([, v]) => v).length

  return (
    <>
      <PageHead
        eyebrow="Administration"
        title="Trade Partners"
        subtitle="Every company, its compliance state, and what needs your attention."
        actions={
          <Link className="pt-btn pt-btn-primary" href="/admin/trade-partners/new">
            Add trade partner
          </Link>
        }
      />

      <div className="pt-tiles">
        <Tile value={counts.total} label="Total partners" href="/admin/trade-partners" />
        <Tile value={counts.invited} label="Invited" href="/admin/trade-partners?status=INVITED" />
        <Tile
          value={counts.applicationsPending}
          label="Applications pending"
          href="/admin/trade-partners/compliance"
        />
        <Tile
          value={counts.underReview}
          label="Under review"
          href="/admin/trade-partners?status=UNDER_REVIEW"
        />
        <Tile
          value={counts.approvedToBid}
          label="Approved to bid"
          href="/admin/trade-partners?status=APPROVED_TO_BID"
          tone="good"
        />
        <Tile
          value={counts.approvedToWork}
          label="Approved to work"
          href="/admin/trade-partners?eligibility=work"
          tone="good"
        />
        <Tile
          value={counts.expiringWithin30}
          label="Expiring in 30 days"
          href="/admin/trade-partners?issue=expiring"
          tone={counts.expiringWithin30 > 0 ? 'warn' : undefined}
        />
        <Tile
          value={counts.expiredItems}
          label="Expired items"
          href="/admin/trade-partners?issue=expired"
          tone={counts.expiredItems > 0 ? 'alert' : undefined}
        />
        <Tile
          value={counts.suspended}
          label="Suspended"
          href="/admin/trade-partners?status=SUSPENDED"
          tone={counts.suspended > 0 ? 'alert' : undefined}
        />
        <Tile
          value={counts.doNotUse}
          label="Do Not Use"
          href="/admin/trade-partners?status=DO_NOT_USE"
          tone={counts.doNotUse > 0 ? 'alert' : undefined}
        />
      </div>

      {queue.length > 0 ? (
        <Card
          title="Action queue"
          subtitle={`${queue.length} item${queue.length === 1 ? '' : 's'} need attention, most urgent first.`}
          actions={
            <Link className="pt-btn pt-btn-ghost pt-btn-sm" href="/admin/trade-partners/compliance">
              Open full queue
            </Link>
          }
        >
          <ul className="pt-list">
            {queue.slice(0, 8).map((item) => (
              <li className="pt-item" key={item.id}>
                <div className="pt-item-main">
                  <p className="pt-item-name">
                    {item.companyName} — {item.label}
                  </p>
                  <p className="pt-item-meta">{item.detail}</p>
                </div>
                <div className="pt-item-actions">
                  <Link className="pt-btn pt-btn-ghost pt-btn-sm" href={item.href}>
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card title="All trade partners">
        <form className="pt-filters" method="get">
          <div className="pt-field">
            <label className="pt-label" htmlFor="q">
              Search
            </label>
            <input
              className="pt-input"
              id="q"
              name="q"
              defaultValue={searchParams.q ?? ''}
              placeholder="Company, contact, phone…"
            />
          </div>
          <div className="pt-field">
            <label className="pt-label" htmlFor="status">
              Status
            </label>
            <select className="pt-select" id="status" name="status" defaultValue={searchParams.status ?? ''}>
              <option value="">Any</option>
              {(Object.keys(COMPANY_STATUS_META) as CompanyStatusValue[]).map((status) => (
                <option key={status} value={status}>
                  {COMPANY_STATUS_META[status].label}
                </option>
              ))}
            </select>
          </div>
          <div className="pt-field">
            <label className="pt-label" htmlFor="trade">
              Trade
            </label>
            <select className="pt-select" id="trade" name="trade" defaultValue={searchParams.trade ?? ''}>
              <option value="">Any</option>
              {TRADES.map((trade) => (
                <option key={trade} value={trade}>
                  {trade}
                </option>
              ))}
            </select>
          </div>
          <div className="pt-field">
            <label className="pt-label" htmlFor="county">
              County
            </label>
            <select className="pt-select" id="county" name="county" defaultValue={searchParams.county ?? ''}>
              <option value="">Any</option>
              {UTAH_COUNTIES.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>
          <div className="pt-field">
            <label className="pt-label" htmlFor="eligibility">
              Eligibility
            </label>
            <select
              className="pt-select"
              id="eligibility"
              name="eligibility"
              defaultValue={searchParams.eligibility ?? ''}
            >
              <option value="">Any</option>
              <option value="work">Work eligible</option>
              <option value="bid">Bid eligible</option>
              <option value="neither">Not yet eligible</option>
            </select>
          </div>
          <div className="pt-field">
            <label className="pt-label" htmlFor="issue">
              Issue
            </label>
            <select className="pt-select" id="issue" name="issue" defaultValue={searchParams.issue ?? ''}>
              <option value="">Any</option>
              <option value="missing">Missing documents</option>
              <option value="rejected">Rejected documents</option>
              <option value="expiring">Expiring soon</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="pt-field">
            <button type="submit" className="pt-btn pt-btn-ghost pt-btn-block">
              Apply
            </button>
          </div>
        </form>

        {activeFilters > 0 ? (
          <p className="pt-hint">
            Showing {rows.length} of {overview.companies.length}.{' '}
            <Link href="/admin/trade-partners" style={{ color: 'var(--orange)' }}>
              Clear filters
            </Link>
          </p>
        ) : null}

        {rows.length === 0 ? (
          <EmptyState
            title={overview.companies.length === 0 ? 'No trade partners yet' : 'Nothing matches those filters'}
            action={
              overview.companies.length === 0 ? (
                <Link className="pt-btn pt-btn-primary" href="/admin/trade-partners/new">
                  Invite your first trade partner
                </Link>
              ) : (
                <Link className="pt-btn pt-btn-ghost" href="/admin/trade-partners">
                  Clear filters
                </Link>
              )
            }
          >
            {overview.companies.length === 0
              ? 'Invite a subcontractor and they will appear here as soon as the invitation is sent.'
              : 'Try widening the search or clearing a filter.'}
          </EmptyState>
        ) : (
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th scope="col">Company</th>
                  <th scope="col">Trade</th>
                  <th scope="col">Status</th>
                  <th scope="col">Compliance</th>
                  <th scope="col">Eligibility</th>
                  <th scope="col">Next expiration</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ company, result }) => {
                  const nextExpiry = result?.items
                    .filter((i) => i.applicable && i.expirationDate && i.state === 'APPROVED')
                    .sort(
                      (a, b) =>
                        (a.expirationDate?.getTime() ?? 0) - (b.expirationDate?.getTime() ?? 0),
                    )[0]

                  return (
                    <tr key={company.id}>
                      <td>
                        <Link href={`/admin/trade-partners/${company.id}`}>{company.legalName}</Link>
                        {company.dba ? <div className="pt-small pt-muted">dba {company.dba}</div> : null}
                      </td>
                      <td>{company.primaryTrade}</td>
                      <td>
                        <StatusBadge status={company.status} />
                      </td>
                      <td className="pt-mono pt-nowrap">
                        {result ? `${result.counts.approved}/${result.counts.applicable}` : '—'}
                        {result && result.counts.rejected > 0 ? (
                          <div className="pt-small" style={{ color: '#f0908c' }}>
                            {result.counts.rejected} rejected
                          </div>
                        ) : null}
                        {result && result.counts.expired > 0 ? (
                          <div className="pt-small" style={{ color: '#f0908c' }}>
                            {result.counts.expired} expired
                          </div>
                        ) : null}
                      </td>
                      <td className="pt-nowrap pt-small">
                        {result?.workEligible ? (
                          <span style={{ color: '#7fd0a5' }}>Work</span>
                        ) : result?.bidEligible ? (
                          <span style={{ color: '#8fc0e8' }}>Bid only</span>
                        ) : (
                          <span className="pt-muted">Not eligible</span>
                        )}
                      </td>
                      <td className="pt-nowrap pt-small">
                        {nextExpiry?.expirationDate ? (
                          <>
                            {formatDate(nextExpiry.expirationDate)}
                            <div
                              className="pt-small"
                              style={{
                                color:
                                  (nextExpiry.daysUntilExpiration ?? 99) <= 30 ? '#e8c274' : undefined,
                              }}
                            >
                              {expiryPhrase(nextExpiry.daysUntilExpiration)}
                            </div>
                          </>
                        ) : (
                          <span className="pt-muted">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}
