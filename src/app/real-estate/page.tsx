import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Phone,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Eye,
  TrendingUp,
  Users,
  Home,
} from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import FAQAccordion from '@/components/FAQAccordion'
import ProcessStep from '@/components/ProcessStep'

export const metadata: Metadata = {
  title: 'Utah Real Estate — Buy or Sell with Brian Hardy',
  description:
    'Work with a Utah realtor who has real construction experience. Brian Hardy serves buyers, sellers, and first-time homebuyers across Utah County and Salt Lake County.',
  alternates: { canonical: 'https://hre-utah.com/real-estate' },
}

const buyerBenefits = [
  'Spots deferred maintenance and hidden repair costs before you\'re emotionally invested',
  'Gives you an honest read on what a house will need — not just what\'s disclosed',
  'First-time buyer friendly — patient, educational, zero pressure',
  'Strong negotiator, especially when inspection findings create leverage',
  'Knows what problems are serious and which ones are easy fixes',
]

const sellerBenefits = [
  'Pre-listing walkthrough with practical, prioritized repair recommendations',
  'Knows what buyers actually notice and what they don\'t',
  'Can handle minor repairs himself before listing — saves you time and coordination',
  'Honest pricing strategy based on real market data, not flattery',
  'Explains the process clearly so you know what to expect at every step',
]

const differentiators = [
  {
    icon: <Eye size={24} className="text-amber-500" />,
    title: 'He Sees What Others Miss',
    body: 'A typical agent sees a house as a transaction. Brian sees it as a structure — because he\'s worked on them. On every showing, he\'s watching for water staining, foundation movement, aging systems, and code issues. You get that insight before you make an offer.',
  },
  {
    icon: <Users size={24} className="text-amber-500" />,
    title: 'Direct Access, Always',
    body: 'Brian doesn\'t hand you off to a team member after you sign a contract. He\'s your agent start to finish. His cell number doesn\'t change, and he answers it.',
  },
  {
    icon: <TrendingUp size={24} className="text-amber-500" />,
    title: 'Honest Over Optimistic',
    body: 'Brian will tell you when a house is overpriced. He\'ll tell you when a repair estimate sounds too high. He\'ll tell you when you should walk away. That\'s the kind of advisor you want for a six-figure decision.',
  },
]

const buyerFAQ = [
  {
    question: 'Does it cost me anything to use a buyer\'s agent?',
    answer:
      'In most transactions, the buyer\'s agent is paid from the seller\'s proceeds — so it typically costs you nothing out of pocket. Brian will explain exactly how compensation works for your specific situation before you commit to anything.',
  },
  {
    question: 'How long does it take to buy a home in Utah?',
    answer:
      'Once you\'re pre-approved and actively searching, most buyers find a home within 30–90 days depending on the market and how specific your criteria are. Closing typically takes 30–45 days after an offer is accepted. Brian will give you a realistic timeline based on current conditions.',
  },
  {
    question: 'I\'m a first-time buyer. Is that okay?',
    answer:
      'Absolutely. Brian works with a lot of first-time buyers and genuinely enjoys the process. He\'ll walk you through everything — getting pre-approved, writing an offer, what inspection findings mean, what happens at closing — in plain language, at your pace.',
  },
  {
    question: 'Can Brian help me buy a fixer-upper?',
    answer:
      'Yes — and his construction background makes him especially useful here. He can help you assess what work is actually needed, estimate rough costs before you make an offer, and think through whether the numbers make sense. He\'s not a licensed contractor, but he knows houses.',
  },
  {
    question: 'What areas does Brian serve for real estate?',
    answer:
      'Brian works throughout Utah County and Salt Lake County, including Saratoga Springs, Eagle Mountain, Lehi, American Fork, Provo, Orem, Sandy, Draper, South Jordan, Riverton, and surrounding areas. If you\'re not sure, just ask.',
  },
]

const sellerFAQ = [
  {
    question: 'What repairs should I make before listing?',
    answer:
      'That depends on the house and the market. Brian will walk through your home before you list and tell you what\'s worth fixing and what buyers won\'t care about. Not every repair has a positive ROI — spending money in the wrong places is common and avoidable.',
  },
  {
    question: 'How do you determine listing price?',
    answer:
      'Brian uses a comparative market analysis (CMA) based on recent sales of similar homes nearby. He\'ll give you a realistic price range — not an inflated number to win your listing. Overpriced homes sit, and sitting homes sell for less.',
  },
  {
    question: 'Can Brian do some of the repairs himself before listing?',
    answer:
      'For handyman-level work — patching drywall, fixing doors, touch-up painting, fixture swaps — yes. This can save you the cost and hassle of coordinating multiple contractors. Major licensed trade work (electrical, plumbing, HVAC) goes to licensed contractors.',
  },
]

export default function RealEstatePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-hero-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-block text-amber-400 font-semibold text-sm tracking-widest uppercase mb-4">
              Real Estate
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
              A Realtor Who Sees Every House Differently
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Brian Hardy doesn&rsquo;t just show you listings — he walks through every home like a
              contractor. Buyers get a sharper eye on every showing. Sellers get honest, practical
              advice before listing.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:+18013800445" className="btn-primary">
                <Phone size={16} />
                Call (801) 380-0445
              </a>
              <Link href="/contact" className="btn-secondary">
                Send a Message <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOR BUYERS */}
      <section className="section-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeader
                eyebrow="For Buyers"
                headline="Stop Overpaying for Problems You Didn't See Coming"
                sub="Most buyers rely on a single inspection after they're emotionally attached to a home. Brian catches issues on the first walkthrough — before you fall in love."
              />
              <ul className="space-y-3">
                {buyerBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a href="tel:+18013800445" className="btn-primary">
                  <Phone size={16} />
                  Talk to Brian About Buying
                </a>
              </div>
            </div>

            {/* First-Time Buyer callout */}
            <div className="bg-navy-800 rounded-2xl p-8 text-white">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center mb-4">
                <Home size={20} />
              </div>
              <h3 className="text-xl font-bold mb-3">Buying Your First Home?</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                The process feels overwhelming until someone explains it clearly. Brian works with
                a lot of first-time buyers — and he takes the time to make sure you understand
                every step, every document, and every decision before you make it.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Pre-approval walkthrough — what lenders look at',
                  'How to write a competitive offer without overpaying',
                  'What to expect from inspection and what matters',
                  'What actually happens at closing',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-amber-400 font-semibold text-sm">
                No jargon. No rush. Just clear answers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOR SELLERS */}
      <section className="section-gray">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Seller callout */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm order-2 lg:order-1">
              <span className="inline-block text-amber-600 font-semibold text-xs tracking-widest uppercase mb-4">
                Pre-Listing Advantage
              </span>
              <h3 className="text-xl font-bold text-navy-800 mb-3">
                The Walkthrough That Saves You Money
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Before you list, Brian walks your home with a contractor&rsquo;s eye. He tells you
                what to fix, what to leave alone, and what will actually move the needle on your
                sale price. No expensive staging consultants. No wasted repairs.
              </p>
              <div className="bg-navy-50 border border-navy-100 rounded-xl p-4 text-sm text-navy-800 font-medium">
                &ldquo;Brian told me to skip the kitchen renovation and fix the garage door
                instead. House sold in 4 days. Best advice I could have gotten.&rdquo;
                <div className="text-slate-500 font-normal text-xs mt-2">
                  — Seller, South Jordan, UT
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <SectionHeader
                eyebrow="For Sellers"
                headline="List Smarter. Sell Faster. Walk Away Confident."
                sub="Brian brings a contractor's perspective to every pre-listing walkthrough — and that changes how you prepare, how you price, and how your home competes."
              />
              <ul className="space-y-3">
                {sellerBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a href="tel:+18013800445" className="btn-primary">
                  <Phone size={16} />
                  Talk to Brian About Selling
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="section-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="What Makes Brian Different"
            headline="Not Your Typical Agent"
            sub="The construction + real estate combination isn't marketing language. It's a real advantage that shows up in tangible ways."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {differentiators.map((d) => (
              <div key={d.title} className="card">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                  {d.icon}
                </div>
                <h3 className="font-bold text-navy-800 text-lg mb-3">{d.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section-gray">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="How It Works"
            headline="Simple Process, Clear Communication"
            sub="No mystery, no overwhelm. Here's what working with Brian looks like from first call to closing."
          />
          <div className="space-y-6">
            <ProcessStep
              step={1}
              title="Call or Text Brian"
              description="Start with a quick conversation. Tell Brian what you're thinking — buying, selling, or just exploring. No commitment, no pitch."
            />
            <ProcessStep
              step={2}
              title="Free Consultation"
              description="Brian listens first, then gives you a straight read on your situation — what the market looks like, what your options are, what to expect."
            />
            <ProcessStep
              step={3}
              title="Make a Plan Together"
              description="Whether you're ready to move fast or just starting to think about it, Brian helps you build a realistic plan that fits your timeline."
            />
            <ProcessStep
              step={4}
              title="Buy or Sell with Confidence"
              description="Brian is with you from start to finish. You'll always know where things stand — and you'll always be able to reach him."
            />
          </div>
        </div>
      </section>

      {/* FAQ — BUYERS */}
      <section className="section-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="FAQ" headline="Buyer Questions" />
          <FAQAccordion items={buyerFAQ} />

          <div className="mt-10">
            <SectionHeader eyebrow="FAQ" headline="Seller Questions" />
            <FAQAccordion items={sellerFAQ} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-800 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Talk to Brian. No Obligation, No Pressure.
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Whether you&rsquo;re six months away from being ready or trying to move in 30 days,
            a quick call costs nothing and usually answers a lot of questions.
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
