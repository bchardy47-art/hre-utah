/**
 * Shared presentational pieces for the Trade Partner Portal.
 *
 * Server components by default. Anything needing interactivity lives in
 * ./client.tsx so these can stay in the server bundle.
 */

import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  COMPANY_STATUS_META,
  DOCUMENT_STATE_META,
  PORTAL_SHORT_NAME,
  SUPPORT_EMAIL,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_PHONE_TEL,
} from '@/lib/portal/constants'
import type { CompanyStatusValue, DocumentStateValue } from '@/lib/portal/db/schema'

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------

export type NavItem = { href: string; label: string }

export function PortalShell({
  children,
  nav,
  userLabel,
  userSub,
  activePath,
  signOutAction,
}: {
  children: ReactNode
  nav: NavItem[]
  userLabel: string
  userSub?: string
  activePath: string
  signOutAction: () => Promise<void>
}) {
  const isActive = (href: string) =>
    activePath === href || (href !== '/' && activePath.startsWith(`${href}/`))

  return (
    <div className="pt">
      <a className="pt-skip" href="#pt-main">
        Skip to main content
      </a>

      <header className="pt-header">
        <div className="pt-header-inner">
          <Link href={nav[0]?.href ?? '/'} className="pt-brand">
            <span className="pt-brand-name">Hardy Homes</span>
            <span className="pt-brand-sub">{PORTAL_SHORT_NAME}</span>
          </Link>
          <div className="pt-header-user">
            <div>{userLabel}</div>
            {userSub ? <div className="pt-small pt-muted">{userSub}</div> : null}
          </div>
          {/*
            Sign out is deliberately understated. As a bordered button it was the
            heaviest control on every screen — on a phone it competed with the
            actual task, and it is the last thing a trade partner is trying to do.
          */}
          <form action={signOutAction}>
            <button type="submit" className="pt-signout">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <nav className="pt-nav" aria-label="Portal sections">
        <div className="pt-nav-inner">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? 'is-active' : undefined}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <main className="pt-main" id="pt-main">
        <div className="pt-wrap">{children}</div>
      </main>
    </div>
  )
}

export function PageHead({
  title,
  subtitle,
  actions,
  eyebrow,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
  eyebrow?: string
}) {
  return (
    <div className="pt-page-head">
      <div>
        {eyebrow ? <p className="pt-eyebrow">{eyebrow}</p> : null}
        <h1 className="pt-h1">{title}</h1>
        {subtitle ? <p className="pt-sub">{subtitle}</p> : null}
      </div>
      {actions ? <div className="pt-btn-row">{actions}</div> : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

export function StatusBadge({ status }: { status: CompanyStatusValue }) {
  const meta = COMPANY_STATUS_META[status]
  return (
    <span className={`pt-badge pt-badge-${meta.tone}`} title={meta.description}>
      {meta.label}
    </span>
  )
}

export function DocumentStateBadge({ state }: { state: DocumentStateValue }) {
  const meta = DOCUMENT_STATE_META[state]
  return (
    <span className={`pt-badge pt-badge-${meta.tone}`} title={meta.description}>
      {meta.label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Notices, empty states, cards
// ---------------------------------------------------------------------------

export function Notice({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'good' | 'warn' | 'bad' | 'draft'
  title?: string
  children: ReactNode
}) {
  return (
    <div className={`pt-notice pt-notice-${tone}`} role={tone === 'bad' ? 'alert' : undefined}>
      <div>
        {title ? <p><strong>{title}</strong></p> : null}
        {typeof children === 'string' ? <p>{children}</p> : children}
      </div>
    </div>
  )
}

/**
 * Used everywhere a legal template has not yet been reviewed by counsel. It is a
 * component rather than ad-hoc copy so the wording cannot drift into implying
 * approval on one screen but not another.
 */
export function DraftTemplateNotice() {
  return (
    <Notice tone="draft">
      <p>
        <strong>Draft document.</strong> The final wording of this agreement has not yet been
        reviewed by a Utah construction attorney. Hardy Homes will provide the approved version
        before it becomes binding. Your acknowledgment records the version shown here.
      </p>
    </Notice>
  )
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="pt-empty">
      <p className="pt-empty-title">{title}</p>
      {children ? <p>{children}</p> : null}
      {action}
    </div>
  )
}

export function Card({
  title,
  subtitle,
  actions,
  children,
  id,
}: {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  id?: string
}) {
  return (
    <section className="pt-card" id={id}>
      {title || actions ? (
        <div className="pt-card-head">
          <div>
            <h2 className="pt-h2">{title}</h2>
            {subtitle ? <p className="pt-sub pt-small">{subtitle}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function Tile({
  value,
  label,
  href,
  tone,
}: {
  value: number | string
  label: string
  href?: string
  tone?: 'alert' | 'warn' | 'good'
}) {
  const className = `pt-tile${tone ? ` is-${tone}` : ''}`
  const inner = (
    <>
      <div className="pt-tile-value pt-mono">{value}</div>
      <div className="pt-tile-label">{label}</div>
    </>
  )
  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  )
}

export function Progress({ percent, label }: { percent: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)))
  return (
    <div>
      <div
        className={`pt-progress${clamped >= 100 ? ' is-complete' : ''}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Completion'}
      >
        <span style={{ width: `${clamped}%` }} />
      </div>
      <p className="pt-hint pt-mono">{clamped}% complete</p>
    </div>
  )
}

export function Field({
  label,
  name,
  children,
  error,
  hint,
  required,
}: {
  label: string
  name: string
  children: ReactNode
  error?: string
  hint?: string
  required?: boolean
}) {
  return (
    <div className="pt-field">
      <label className="pt-label" htmlFor={name}>
        {label}
        {required ? <span className="pt-req" aria-hidden="true">*</span> : null}
        {required ? <span className="pt-sr-only"> (required)</span> : null}
      </label>
      {children}
      {hint ? <p className="pt-hint">{hint}</p> : null}
      {error ? (
        <p className="pt-error" id={`${name}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function HelpFooter() {
  return (
    <Card title="Need help?">
      <p className="pt-sub">
        Call or text {' '}
        <a href={`tel:${SUPPORT_PHONE_TEL}`} style={{ color: 'var(--orange)' }}>
          {SUPPORT_PHONE_DISPLAY}
        </a>
        , or email{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'var(--orange)' }}>
          {SUPPORT_EMAIL}
        </a>
        . If a document is not accepted, the reason is always shown next to it.
      </p>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function expiryPhrase(days: number | null): string {
  if (days === null) return ''
  if (days < 0) return `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`
  if (days === 0) return 'Expires today'
  return `Expires in ${days} day${days === 1 ? '' : 's'}`
}
