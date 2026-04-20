import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Phone,
  MessageSquare,
  Home,
  Wrench,
  CheckCircle,
  Shield,
  MapPin,
  ArrowRight,
  Star,
} from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import TestimonialCard from '@/components/TestimonialCard'

export const metadata: Metadata = {
  title: "Hardy Real Estate — Utah's Realtor + Handyman | Brian Hardy",
  description:
    'Brian Hardy is a licensed Utah realtor and skilled handyman serving Utah County and Salt Lake County. One person who truly understands your home — from the foundation up.',
  alternates: { canonical: 'https://hre-utah.com' },
}

const advantages = [
  {
    icon: <Wrench size={22} className="text-amber-500" />,
    title: 'A Realtor Who Reads Houses',
    body: 'Years of hands-on construction and repair work means Brian spots deferred maintenance, hidden costs, and renovation potential that most agents walk right past.',
  },
  {
    icon: <Phone size={22} className="text-amber-500" />,
    title: 'Direct. No Gatekeepers.',
    body: "You deal with Brian directly — not an assistant, not a call center. He picks up, he responds, and he shows up when he says he will.",
  },
  {
    icon: <MapPin size={22} className="text-amber-500" />,
    title: 'Local to Utah County and Salt Lake County',
    body: "Based in Saratoga Springs, Brian knows the builders, the neighborhoods, and the quirks of the local market — because he lives and works here.",
  },
  {
    icon: <Shield size={22} className="text-amber-500" />,
    title: 'Two Services, One Trusted Name',
    body: "Whether you need a realtor, a handyman, or both, you're getting the same honest professional every time.",
  },
]

const serviceAreas = [
  'Saratoga Springs',
  'Eagle Mountain',
  'Lehi',
  'American Fork',
  'Pleasant Grove',
  'Provo',
  'Orem',
  'Springville',
  'Spanish Fork',
  'Sandy',
  'Draper',
  'South Jordan',
  'Riverton',
  'Herriman',
  'West Jordan',
  'Salt Lake City',
]

const testimonials = [
  {
    quote:
      "Brian caught issues during the showing that our inspector almost missed. His construction background saved us from a purchase that would have cost us thousands in repairs. Couldn't recommend him more.",
    name: 'Jason & Melissa T.',
    location: 'Lehi, UT',
    service: 'Real Estate' as const,
  },
  {
    quote:
      "I had a list of small repairs that had been sitting for months because every contractor either ghosted me or quoted me way too high. Brian came out, gave me a straight price, and knocked everything out in one day.",
    name: 'Sarah W.',
    location: 'Saratoga Springs, UT',
    service: 'Handyman' as const,
  },
  {
    quote:
      "We were first-time buyers and completely overwhelmed. Brian walked us through everything without making us feel dumb. He was patient, honest, and we ended up with a house we love at a price we could afford.",
    name: 'Tyler & Amanda R.',
    location: 'Eagle Mountain, UT',
    service: 'Real Estate' as const,
  },
]

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-hero-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-navy-700/60 border border-navy-600 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <MapPin size={12} className="text-amber-400" />
                Utah County + Salt Lake County
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                Utah&rsquo;s Realtor Who{' '}
                <span className="text-amber-400">Actually Knows Houses</span>
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
                Brian Hardy is a licensed realtor <em>and</em> a skilled handyman. That combination
                means sharper eyes on every showing, smarter advice when you&rsquo;re buying or
                selling, and real help when your home needs work.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <a href="tel:+18013800445" className="btn-primary text-base px-7 py-3.5">
                  <Phone size={17} />
                  Call (801) 380-0445
                </a>
                <a
                  href="sms:+18013800445"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/60 text-white font-semibold rounded-lg hover:border-white hover:bg-white/10 transition-all text-base"
                >
                  <MessageSquare size={17} />
                  Send a Text
                </a>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-400" />
                  Licensed Utah Realtor
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-400" />
                  Boardwalk Realty
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-400" />
                  Construction Background
                </span>
              </div>
            </div>

            {/* Right: stat card */}
            <div className="hidden lg:flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 w-80">
                {/* Brian's photo */}
                <div className="w-full h-56 rounded-xl overflow-hidden mb-5 relative">
                  <Image
                    src="/brian-hardy.jpg"
                    alt="Brian Hardy — Utah Realtor and Handyman"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>

                <div className="text-center mb-5">
                  <div className="text-white font-bold text-xl">Brian Hardy</div>
                  <div className="text-amber-400 text-sm">REALTOR® + Handyman</div>
                  <div className="text-slate-400 text-xs mt-1">Boardwalk Realty and Property Mgmt</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Service Areas', value: '2 Counties' },
                    { label: 'Based In', value: 'Saratoga Springs' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-navy-800/60 rounded-lg px-3 py-2.5 text-center">
                      <div className="text-white font-bold text-sm">{stat.value}</div>
                      <div className="text-slate-500 text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1 justify-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-slate-400 text-xs ml-1">5-star reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL PATHWAY */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="How Can I Help"
            headline="What Are You Looking For?"
            sub="Brian works with home buyers, sellers, and homeowners who need reliable repair work. Pick your path."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Real Estate Card */}
            <Link
              href="/real-estate"
              className="group relative overflow-hidden rounded-2xl bg-navy-800 text-white p-8 hover:bg-navy-700 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="mb-5">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <Home size={24} className="text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Real Estate</h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Buying or selling in Utah? Work with a realtor who walks every home like a
                  contractor — catching problems, spotting potential, and giving you an honest take.
                </p>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-amber-400 flex-shrink-0" />
                  Buyers &amp; Sellers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-amber-400 flex-shrink-0" />
                  First-Time Homebuyers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-amber-400 flex-shrink-0" />
                  Utah County + Salt Lake County
                </li>
              </ul>
              <span className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm group-hover:gap-3 transition-all">
                Learn more <ArrowRight size={16} />
              </span>
            </Link>

            {/* Handyman Card */}
            <Link
              href="/handyman"
              className="group relative overflow-hidden rounded-2xl bg-amber-500 text-white p-8 hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="mb-5">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <Wrench size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Handyman Services</h3>
                <p className="text-white/90 leading-relaxed text-sm">
                  Need repairs done right without the runaround? Brian shows up on time, quotes
                  fair, and does quality work — no no-shows, no surprises on the bill.
                </p>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-white/90">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-white flex-shrink-0" />
                  General Repairs &amp; Maintenance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-white flex-shrink-0" />
                  Pre-Sale Home Touch-Ups
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-white flex-shrink-0" />
                  Honey-Do Lists Welcome
                </li>
              </ul>
              <span className="inline-flex items-center gap-2 text-white font-semibold text-sm group-hover:gap-3 transition-all">
                See what I handle <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY BRIAN HARDY */}
      <section className="section-gray">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="Why Brian Hardy"
            headline="The Realtor + Handyman Advantage"
            sub="Most agents know contracts. Brian knows contracts and construction. That's a different kind of edge — and it shows up in every transaction."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {advantages.map((item) => (
              <div key={item.title} className="card">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-navy-800 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/about" className="btn-outline">
              Read Brian&rsquo;s Story <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="Reviews"
            headline="What Clients Are Saying"
            sub="Real feedback from Utah homeowners and buyers."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="section-gray">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="Service Area"
            headline="Serving Utah County and Salt Lake County"
            sub="Based in Saratoga Springs, Brian works throughout both counties. If you're not sure if your area is covered, just call — chances are it is."
          />
          <div className="flex flex-wrap gap-2">
            {serviceAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-full"
              >
                <MapPin size={12} className="text-amber-500" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-navy-800 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Talk?
          </h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Call or text Brian directly. No hold music, no handoffs, no waiting on a callback
            from someone who doesn&rsquo;t know your file. Just an honest conversation about
            what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+18013800445" className="btn-primary text-base px-8 py-4">
              <Phone size={18} />
              Call (801) 380-0445
            </a>
            <a
              href="sms:+18013800445"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-lg hover:border-white hover:bg-white/10 transition-all text-base"
            >
              <MessageSquare size={18} />
              Text Brian
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white/80 font-semibold rounded-lg hover:border-white/60 hover:text-white transition-all text-base"
            >
              Send a Message
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-6">
            Hardyhomesutah@gmail.com · Based in Saratoga Springs, UT
          </p>
        </div>
      </section>
    </>
  )
}
