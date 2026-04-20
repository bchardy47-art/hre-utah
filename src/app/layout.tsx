import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://hre-utah.com'),
  title: {
    default: 'Hardy Real Estate — Utah Realtor + Handyman | Brian Hardy',
    template: '%s | Hardy Real Estate',
  },
  description:
    'Brian Hardy is a licensed Utah realtor and skilled handyman serving Utah County and Salt Lake County. Buy, sell, or fix your home with someone who actually knows houses.',
  keywords: [
    'Utah realtor',
    'Utah County real estate',
    'Salt Lake County realtor',
    'Saratoga Springs real estate',
    'handyman Utah County',
    'handyman Saratoga Springs',
    'Brian Hardy realtor',
    'Hardy Real Estate',
    'Boardwalk Realty Utah',
  ],
  authors: [{ name: 'Brian Hardy' }],
  creator: 'Brian Hardy',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hre-utah.com',
    siteName: 'Hardy Real Estate',
    title: 'Hardy Real Estate — Utah Realtor + Handyman',
    description:
      'A licensed Utah realtor and skilled handyman serving Utah County and Salt Lake County. Brian Hardy sees homes differently — and that matters when buying, selling, or fixing yours.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hardy Real Estate — Brian Hardy, Utah Realtor and Handyman',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hardy Real Estate — Utah Realtor + Handyman',
    description:
      'Brian Hardy is a licensed Utah realtor and skilled handyman serving Utah County and Salt Lake County.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'HomeAndConstructionBusiness'],
  name: 'Hardy Real Estate',
  description:
    'Licensed Utah realtor and handyman serving Utah County and Salt Lake County. Brian Hardy brings construction experience and real estate expertise together.',
  url: 'https://hre-utah.com',
  telephone: '+18013800445',
  email: 'Hardyhomesutah@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Saratoga Springs',
    addressRegion: 'UT',
    addressCountry: 'US',
  },
  areaServed: [
    { '@type': 'City', name: 'Saratoga Springs, UT' },
    { '@type': 'City', name: 'Eagle Mountain, UT' },
    { '@type': 'City', name: 'Lehi, UT' },
    { '@type': 'City', name: 'American Fork, UT' },
    { '@type': 'City', name: 'Provo, UT' },
    { '@type': 'City', name: 'Orem, UT' },
    { '@type': 'City', name: 'Sandy, UT' },
    { '@type': 'City', name: 'Draper, UT' },
    { '@type': 'City', name: 'South Jordan, UT' },
  ],
  priceRange: '$$',
  founder: {
    '@type': 'Person',
    name: 'Brian Hardy',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
