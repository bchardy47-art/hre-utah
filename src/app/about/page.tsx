import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, MessageSquare, CheckCircle, ArrowRight, MapPin } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'

export const metadata: Metadata = {
  title: 'About Brian Hardy — Utah Realtor + Handyman',
  description:
    'Brian Hardy is a licensed Utah realtor with a construction and handyman background. Learn why his hands-on experience makes him a better agent and a better handyman.',
  alternates: { canonical: 'https://hre-utah.com/about' },
}

const values = [
  {
    word: 'Honest',
    description:
      "Brian will tell you what he actually thinks, even when it's not what you want to hear. He'd rather lose a deal than steer you wrong.",
  },
  {
    word: 'Skilled',
    description:
      "A background in construction means Brian sees homes at a different level. He knows what he's looking at, and that knowledge shows up in every job he takes.",
  },
  {
    word: 'Local',
    description:
      "Brian is based in Saratoga Springs. He knows Utah County and Salt Lake County — the neighborhoods, the builders, the quirks. This isn't a market he's learning.",
  },
  {
    word: 'Reliable',
    description:
      "When Brian says he'll be there, he means it. When he quotes a price, he sticks to it. These aren't values he talks about — they're just how he works.",
  },
]

const stats = [
  { value: 'Utah County', label: 'Primary Market' },
  { value: '+ Salt Lake', label: 'County Coverage' },
  { value: 'Saratoga Springs', label: 'Based In' },
  { value: 'Boardwalk Realty', label: 'Brokerage' },
]

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-hero-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-block text-amber-400 font-semibold text-sm tracking-widest uppercase mb-4">
              About Brian
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
              Built to Help You With Your Biggest Asset
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Brian Hardy isn&rsquo;t your typical realtor. Before earning his license, he spent
              years working with his hands — learning how homes are built, what breaks, and how to
              fix it. That background changes everything about how he does his job.
            </p>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Photo + stats */}
            <div className="lg:col-span-2 space-y-5">
              {/* Brian's photo */}
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden relative shadow-md">
                <Image
                  src="/brian-hardy.jpg"
                  alt="Brian Hardy — Utah Realtor and Handyman"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-navy-800 text-white rounded-xl p-4 text-center"
                  >
                    <div className="font-bold text-sm text-amber-400">{s.value}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <MapPin size={15} className="text-amber-500 flex-shrink-0" />
                Saratoga Springs, UT · Utah County + Salt Lake County
              </div>
            </div>

            {/* Story content */}
            <div className="lg:col-span-3 space-y-6 text-slate-700 leading-relaxed">
              <div>
                <h2 className="text-2xl font-bold text-navy-800 mb-3">
                  Where It Started
                </h2>
                <p>
                  Brian didn&rsquo;t start his career at a real estate desk. He started it on job
                  sites — learning how homes go together from the framing up. He spent years doing
                  hands-on construction and repair work, which meant he learned the hard way what
                  makes a house solid versus what&rsquo;s hiding problems underneath a fresh coat
                  of paint.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-navy-800 mb-3">
                  The Move to Real Estate
                </h2>
                <p>
                  When Brian earned his real estate license and joined Boardwalk Realty and Property
                  Management, he brought all of that hands-on experience with him. He wasn&rsquo;t
                  a sales person learning what a house was made of — he was someone who already
                  knew, stepping into the business side of it.
                </p>
                <p className="mt-4">
                  That difference shows up every single time he walks through a property. He&rsquo;s
                  not just reading the disclosure sheet — he&rsquo;s watching how the floor
                  transitions, whether the doors stick, what the HVAC looks like, how the gutters
                  drain. He sees the house as a thing that was built and will eventually need
                  maintenance, not just a commodity to be bought and sold.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-navy-800 mb-3">
                  Why He Still Does Handyman Work
                </h2>
                <p>
                  Brian still takes handyman jobs because he&rsquo;s good at it, he genuinely
                  likes the work, and he&rsquo;s seen how hard it is for homeowners to find someone
                  reliable for small jobs. Most contractors won&rsquo;t touch a job that takes less
                  than a day. That leaves homeowners with a growing list of deferred repairs and
                  nobody to call.
                </p>
                <p className="mt-4">
                  Brian fills that gap. And for clients who are getting ready to sell, having
                  the same person handle both the repairs and the listing is a real practical
                  advantage — fewer calls, less coordination, and someone who already knows the
                  house.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-navy-800 mb-3">
                  Rooted in Utah County
                </h2>
                <p>
                  Brian is based in Saratoga Springs and works throughout Utah County and Salt Lake
                  County. He&rsquo;s not a transplant running a territory from an office somewhere
                  else — he lives and works here. He knows the growth happening in Eagle Mountain
                  and Lehi, the established neighborhoods in Provo and Orem, and the communities
                  expanding along the south end of the valley.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a href="tel:+18013800445" className="btn-primary">
                  <Phone size={16} />
                  Call Brian
                </a>
                <Link href="/contact" className="btn-outline">
                  Send a Message <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section-gray">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="How Brian Works"
            headline="What You Can Expect"
            sub="These aren't mission statement words. They're the things clients actually say when they describe working with Brian."
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.word} className="card text-center">
                <div className="text-3xl font-bold text-amber-500 mb-3">{v.word}</div>
                <p className="text-slate-600 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Brian is NOT */}
      <section className="section-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="Straight Talk"
            headline="What Brian Is — and What He Isn't"
          />
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-slate-700 text-sm leading-relaxed">
                <strong>He&rsquo;s a licensed realtor</strong> with Boardwalk Realty and Property
                Management, operating under all applicable Utah real estate regulations.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-slate-700 text-sm leading-relaxed">
                <strong>He&rsquo;s a skilled handyman</strong> — not a licensed general contractor.
                He handles work that doesn&rsquo;t require trade licensing. When a job requires a
                licensed plumber, electrician, or HVAC tech, he&rsquo;ll tell you.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-slate-700 text-sm leading-relaxed">
                <strong>He works directly with clients</strong> — no team, no call center. When
                you call Brian, Brian picks up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-800 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Let&rsquo;s Talk
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            No obligation. Just a straight conversation about what you need and whether Brian
            can help.
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
          </div>
        </div>
      </section>
    </>
  )
}
