import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, MapPin, Crosshair } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kill Lawn Weeds Fast | Brian Hardy',
  description:
    'The weed-control products Brian Hardy uses and recommends: one for killing existing broadleaf weeds, one for stopping weeds before they start.',
  alternates: { canonical: 'https://hre-utah.com/kill-lawn-weeds' },
}

type Product = {
  section: string
  name: string
  description: string
  priceText: string
  href: string
  image: string
}

const products: Product[] = [
  {
    section: 'Kill Existing Weeds',
    name: 'Select Source Triad TZ',
    description:
      '4-way combination herbicide for dependable post-emergent broadleaf weed control. Compare to T-Zone.',
    priceText: 'Amazon • $38.95',
    href: 'https://r.amzlink.to/?btn_url=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB08BJBHWSW%3Ftag%3D97265-bchardyhandyman-20%26linkCode%3Dogi%26th%3D1%26psc%3D1&btn_ref=org-433bb393e1b8b503',
    image: '/images/links/products/triad-tz.jpg',
  },
  {
    section: 'Stop Weeds Before They Start',
    name: 'Barricade 4FL Herbicide Concentrate',
    description:
      'Pre-emergent weed control for lawns, turf grass, ornamentals, and more.',
    priceText: 'Amazon • $29.89',
    href: 'https://r.amzlink.to/?btn_url=https%3A%2F%2Fwww.amazon.com%2Fdp%2FB00OXD2CKG%3Ftag%3D97265-bchardyhandyman-20%26linkCode%3Dogi%26th%3D1%26psc%3D1&btn_ref=org-433bb393e1b8b503',
    image: '/images/links/products/barricade-4fl.jpg',
  },
]

export default function KillLawnWeedsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800">
      <div className="max-w-md mx-auto px-5 pt-8 pb-16">

        {/* Back link */}
        <Link
          href="/links"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-400 text-sm transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Back to Brian&rsquo;s Links
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/15 ring-1 ring-amber-500/40 mb-4">
            <Crosshair size={26} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Kill Lawn Weeds Fast
          </h1>
          <p className="text-amber-400 font-medium text-sm tracking-wide mb-4">
            What I use for broadleaf weeds and weed prevention.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed max-w-[340px] mx-auto">
            These are the weed-control products I keep handy: one for killing
            existing broadleaf weeds and one for helping stop weeds before they
            start. Always read the product label, follow local rules, and apply
            based on your lawn type, timing, and conditions.
          </p>
        </div>

        {/* Affiliate disclosure */}
        <p className="text-[12px] leading-snug text-slate-300 bg-navy-800/60 border border-navy-700/60 rounded-md px-4 py-3 mb-6 text-center">
          As an Amazon Associate I earn from qualifying purchases.
        </p>

        {/* Product cards */}
        <ul className="space-y-5 mb-12">
          {products.map((product) => (
            <li key={product.name}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-400/80 mb-2 px-1">
                {product.section}
              </p>
              <a
                href={product.href}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="group flex flex-col gap-3 w-full p-4 rounded-2xl bg-navy-800/70 hover:bg-navy-700/70 border border-navy-600/60 hover:border-amber-500/40 transition-all duration-200 active:scale-[0.99]"
              >
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white p-2 ring-1 ring-navy-600/60">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="96px"
                      className="object-contain p-1"
                    />
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-white leading-snug">
                      {product.name}
                    </p>
                    <p className="text-[12px] text-slate-400 mt-1 leading-snug">
                      {product.description}
                    </p>
                    <p className="text-[12px] text-slate-300 mt-2">
                      {product.priceText}
                    </p>
                  </div>
                </div>
                {/* CTA */}
                <span className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-[13px] font-semibold border border-amber-500/50 text-amber-400 group-hover:bg-amber-500/10 group-hover:border-amber-400 transition-colors">
                  View on Amazon
                  <ExternalLink size={13} aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>

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
