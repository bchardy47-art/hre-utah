'use client'

import { usePathname } from 'next/navigation'
import Nav from './Nav'
import Footer from './Footer'

/**
 * Decides whether the public marketing header and footer should appear.
 *
 * The Trade Partner Portal is a private application, not a page of the HRE
 * website — it must not inherit the marketing navigation, and its links must
 * never appear in it.
 *
 * Every public page renders exactly as it did before this component existed:
 * same elements, same order, no extra wrapper. Only portal routes are listed
 * here.
 *
 * Note on /links: the unused SiteShell.tsx component suggests someone once
 * intended the branded links page to be standalone, but it was never wired into
 * the layout, so /links has always rendered with the nav and footer. It is
 * deliberately NOT listed below — changing it would be an unrelated change to a
 * public page smuggled in with the portal. If that page should lose its chrome,
 * that is its own decision and its own commit.
 */

const STANDALONE_PREFIXES = ['/trade-partners', '/admin']

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/'
  const standalone = STANDALONE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )

  if (standalone) return <>{children}</>

  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  )
}
