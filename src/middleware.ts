/**
 * Edge middleware for the portal.
 *
 * SCOPE — read this before changing anything here.
 *
 * This middleware is a *convenience redirect only*. It runs on the edge runtime,
 * where the database and bcrypt are unavailable, so all it can do is look at
 * whether a session cookie is present. A forged or expired cookie sails straight
 * through.
 *
 * The actual security boundary is server-side: every protected page, Server
 * Action, and Route Handler calls a guard from
 * src/lib/portal/auth/guards.ts, which re-reads the session and the user row
 * from the database. Deleting this file would make the portal slightly less
 * pleasant to use and no less secure.
 *
 * The matcher is scoped tightly to portal paths so no public HRE page is
 * affected.
 */

import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'hh_tp_session'

const PUBLIC_PORTAL_PATHS = [
  '/trade-partners/login',
  '/trade-partners/apply',
  '/trade-partners/signed-out',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Server components cannot read the current path directly, so it is forwarded
  // as a header for the layouts to highlight the active nav item.
  const forwarded = new Headers(request.headers)
  forwarded.set('x-pathname', pathname)
  const passthrough = () => NextResponse.next({ request: { headers: forwarded } })

  if (PUBLIC_PORTAL_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return passthrough()
  }

  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value)
  if (hasCookie) {
    const response = passthrough()
    // Portal pages must never be cached by a shared cache or restored from
    // bfcache after sign-out.
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  const loginUrl = new URL('/trade-partners/login', request.url)
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/trade-partners/:path*', '/admin/:path*'],
}
