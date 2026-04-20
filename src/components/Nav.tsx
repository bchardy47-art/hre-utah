'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/real-estate', label: 'Real Estate' },
  { href: '/handyman', label: 'Handyman' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="text-navy-800 font-bold text-lg tracking-tight group-hover:text-navy-600 transition-colors">
              Hardy Real Estate
            </span>
            <span className="text-amber-600 text-xs font-medium tracking-wide uppercase">
              Realtor + Handyman
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-navy-800 bg-navy-50'
                    : 'text-slate-600 hover:text-navy-800 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href="tel:+18013800445"
            className="hidden md:inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <Phone size={15} />
            (801) 380-0445
          </a>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-slate-600 hover:text-navy-800 hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-navy-800 bg-navy-50'
                    : 'text-slate-600 hover:text-navy-800 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+18013800445"
              className="flex items-center gap-2 mt-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-lg transition-colors"
            >
              <Phone size={15} />
              Call (801) 380-0445
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
