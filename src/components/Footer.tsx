import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

const serviceLinks = [
  { href: '/real-estate', label: 'Real Estate' },
  { href: '/handyman', label: 'Handyman Services' },
  { href: '/about', label: 'About Brian' },
  { href: '/contact', label: 'Contact' },
]

const serviceAreas = [
  'Saratoga Springs',
  'Eagle Mountain',
  'Lehi',
  'American Fork',
  'Provo / Orem',
  'Sandy / Draper',
  'South Jordan',
  'West Jordan',
]

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <div className="text-white font-bold text-lg leading-none">Hardy Real Estate</div>
              <div className="text-amber-400 text-xs font-medium tracking-widest uppercase mt-0.5">
                Realtor + Handyman
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Helping Utah homeowners and buyers with real estate and home repairs — from someone who
              actually knows houses.
            </p>
            <div className="text-xs text-slate-500">
              Boardwalk Realty and Property Management
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Pages
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Service Areas
            </h3>
            <ul className="space-y-2">
              {serviceAreas.map((area) => (
                <li key={area} className="text-sm text-slate-400">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+18013800445"
                  className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <Phone size={15} className="text-amber-400 flex-shrink-0" />
                  (801) 380-0445
                </a>
              </li>
              <li>
                <a
                  href="mailto:Hardyhomesutah@gmail.com"
                  className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <Mail size={15} className="text-amber-400 flex-shrink-0" />
                  Hardyhomesutah@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                Saratoga Springs, UT<br />
                Utah County + Salt Lake County
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Hardy Real Estate. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Brian Hardy, REALTOR® · Boardwalk Realty and Property Management
          </p>
        </div>
      </div>
    </footer>
  )
}
