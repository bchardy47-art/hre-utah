'use client'

import { usePathname } from 'next/navigation'
import Nav from './Nav'
import Footer from './Footer'

const STANDALONE_ROUTES = ['/links']

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const standalone = STANDALONE_ROUTES.includes(pathname)

  return (
    <>
      {!standalone && <Nav />}
      <main className="flex-1">{children}</main>
      {!standalone && <Footer />}
    </>
  )
}
