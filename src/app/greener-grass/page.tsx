import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, MapPin, Sprout } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Greener Grass Summer Mix | Brian Hardy',
  description:
    "The simple product mix Brian Hardy uses and recommends for homeowners who want a greener lawn — fertilizer, micronutrients, and pH tools.",
  alternates: { canonical: 'https://hre-utah.com/greener-grass' },
}

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

export default function GreenerGrassPage() {
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
            <Sprout size={26} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Greener Grass Summer Mix
          </h1>
          <p className="text-amber-400 font-medium text-sm tracking-wide mb-4">
            Products I use/recommend for a greener lawn setup.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed max-w-[340px] mx-auto">
            This is the simple product mix I recommend for homeowners wanting a
            greener lawn. Always read product labels and apply based on your
            lawn size, soil conditions, and local rules.
          </p>
        </div>

        {/* Affiliate disclosure */}
        <p className="text-[12px] leading-snug text-slate-300 bg-navy-800/60 border border-navy-700/60 rounded-md px-4 py-3 mb-6 text-center">
          As an Amazon Associate I earn from qualifying purchases.
        </p>

        {/* Product cards */}
        <ul className="space-y-3 mb-12">
          {products.map((product) => (
            <li key={product.label}>
              <a
                href={product.href}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="group flex items-center gap-4 w-full p-3 rounded-2xl bg-navy-800/70 hover:bg-navy-700/70 border border-navy-600/60 hover:border-amber-500/40 transition-all duration-200 active:scale-[0.99]"
              >
                {/* Image */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-navy-600/60">
                  <Image
                    src={product.image}
                    alt={product.label}
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-white leading-snug">
                    {product.label}
                  </p>
                  <p className="text-[12px] text-slate-400 mt-0.5">Amazon</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-[12px] font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
                    View on Amazon
                    <ExternalLink size={12} aria-hidden="true" />
                  </span>
                </div>
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
