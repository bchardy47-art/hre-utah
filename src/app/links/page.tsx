import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Phone,
  MessageSquare,
  Home,
  Wrench,
  ClipboardList,
  Globe,
  MapPin,
  CheckCircle,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Brian Hardy Links | Hardy Real Estate',
  description:
    'Quick links for Brian Hardy, Utah REALTOR® and handyman serving Utah County and Salt Lake County. Call, text, request handyman help, or get real estate guidance.',
  alternates: { canonical: 'https://hre-utah.com/links' },
}

type LinkItem = {
  label: string
  href: string
  icon: LucideIcon
  style: string
}

const topLinks: LinkItem[] = [
  {
    label: 'Call Brian',
    href: 'tel:8013800445',
    icon: Phone,
    style:
      'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-900/30',
  },
  {
    label: 'Text Brian',
    href: 'sms:8013800445',
    icon: MessageSquare,
    style:
      'bg-white/10 hover:bg-white/15 border border-white/25 text-white',
  },
  {
    label: 'Buying or Selling a Home?',
    href: '/real-estate',
    icon: Home,
    style: 'bg-navy-800 hover:bg-navy-700 border border-navy-600/80 text-white',
  },
  {
    label: 'Need Handyman Help?',
    href: '/handyman',
    icon: Wrench,
    style: 'bg-navy-800 hover:bg-navy-700 border border-navy-600/80 text-white',
  },
]

const bottomLinks: LinkItem[] = [
  {
    label: 'Request a Quote',
    href: '/contact',
    icon: ClipboardList,
    style:
      'border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400',
  },
  {
    label: 'Visit Full Website',
    href: '/',
    icon: Globe,
    style:
      'border border-white/20 text-white/60 hover:text-white hover:border-white/40',
  },
]

type Product = {
  label: string
  href: string
  image: string
}

const products: Product[] = [
  {
    label: '21-0-0 Ammonium Sulfate',
    href: 'https://amzn.to/46Aiosp',
    image: '/images/links/products/ammonium-sulfate.jpg',
  },
  {
    label: '0-0-50 Potash',
    href: 'https://amzn.to/4kWiGNK',
    image: '/images/links/products/potash.jpg',
  },
  {
    label: 'Feature Iron',
    href: 'https://amzn.to/44KPg07',
    image: '/images/links/products/feature-iron.jpg',
  },
  {
    label: 'Sea Kelp',
    href: 'https://amzn.to/4mfzu3o',
    image: '/images/links/products/sea-kelp.jpg',
  },
  {
    label: 'Green Envy',
    href: 'https://amzn.to/4o4Wx2r',
    image: '/images/links/products/green-envy.jpg',
  },
  {
    label: 'PH Meter',
    href: 'https://amzn.to/452sTSz',
    image: '/images/links/products/ph-meter.jpg',
  },
  {
    label: 'PH Up & Down',
    href: 'https://amzn.to/413S8TJ',
    image: '/images/links/products/ph-up-down.jpg',
  },
]

const serviceCards = [
  'Buying a home',
  'Selling a home',
  'Home repairs',
  'Pre-listing fixes',
  'First-time buyer help',
  'Utah County / Salt Lake County',
]

function renderLink(link: LinkItem) {
  const Icon = link.icon
  const cls = `flex items-center justify-center gap-3 w-full py-4 px-5 rounded-xl font-semibold text-[15px] transition-all duration-200 active:scale-[0.97] ${link.style}`
  const content = (
    <>
      <Icon size={18} />
      {link.label}
    </>
  )
  return link.href.startsWith('/') ? (
    <Link key={link.label} href={link.href} className={cls}>
      {content}
    </Link>
  ) : (
    <a key={link.label} href={link.href} className={cls}>
      {content}
    </a>
  )
}

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800">
      <div className="max-w-sm mx-auto px-5 pt-12 pb-16">

        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-amber-400/60 ring-offset-2 ring-offset-navy-900 shadow-xl mb-5">
            <Image
              src="/brian-hardy.jpg"
              alt="Brian Hardy — Utah REALTOR® and Handyman"
              width={96}
              height={96}
              className="object-cover object-top w-full h-full"
              priority
            />
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Brian Hardy</h1>
          <p className="text-amber-400 font-medium text-sm tracking-wide mb-4">
            Utah REALTOR® + Handyman
          </p>
          <p className="text-slate-400 text-sm leading-relaxed max-w-[260px]">
            Real estate help, home repairs, and honest advice from someone who actually knows houses.
          </p>
        </div>

        {/* Top primary buttons (Call, Text, Real Estate, Handyman) */}
        <div className="space-y-3 mb-8">
          {topLinks.map(renderLink)}
        </div>

        {/* Greener Grass Summer Mix — promoted products */}
        <section aria-labelledby="greener-grass-heading" className="mb-8">
          <div className="text-center mb-4">
            <h2
              id="greener-grass-heading"
              className="text-base font-bold text-white"
            >
              Greener Grass Summer Mix
            </h2>
            <p className="text-slate-400 text-xs mt-1 leading-snug">
              Products I use/recommend for a greener lawn setup.
            </p>
          </div>

          <p className="text-[11px] leading-snug text-slate-400 bg-navy-800/50 border border-navy-700/50 rounded-md px-3 py-2 mb-3 text-center">
            As an Amazon Associate I earn from qualifying purchases.
          </p>

          <ul className="space-y-2.5">
            {products.map((product) => (
              <li key={product.label}>
                <a
                  href={product.href}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="group flex items-center gap-3 w-full p-2.5 rounded-xl bg-navy-800/70 hover:bg-navy-700/70 border border-navy-600/60 hover:border-amber-500/40 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-navy-600/60">
                    <Image
                      src={product.image}
                      alt={product.label}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-white leading-tight truncate">
                      {product.label}
                    </p>
                    <p className="text-[11px] text-amber-400/90 mt-0.5">
                      Amazon
                    </p>
                  </div>
                  <ExternalLink
                    size={15}
                    className="text-slate-400 group-hover:text-amber-400 flex-shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Bottom buttons (Request a Quote, Visit Full Website) */}
        <div className="space-y-3 mb-12">
          {bottomLinks.map(renderLink)}
        </div>

        {/* What do you need? */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 text-center mb-4">
            What do you need help with?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {serviceCards.map((card) => (
              <div
                key={card}
                className="flex items-start gap-2 bg-navy-800/60 border border-navy-700/50 rounded-lg px-3 py-2.5 text-sm text-slate-300 leading-snug"
              >
                <CheckCircle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{card}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-navy-700/50 pt-8">
          <p className="text-white font-semibold text-sm">Hardy Real Estate</p>
          <p className="text-slate-400 text-xs mt-1">Brian Hardy, REALTOR®</p>
          <p className="text-slate-500 text-xs mt-0.5">
            Boardwalk Realty and Property Management
          </p>
          <div className="flex items-center justify-center gap-1 text-slate-600 text-xs mt-2.5">
            <MapPin size={10} />
            <span>Saratoga Springs, UT · Utah County + Salt Lake County</span>
          </div>
        </div>

      </div>
    </div>
  )
}
