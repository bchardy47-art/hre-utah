import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Phone,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  MapPin,
  Clock,
  DollarSign,
  ThumbsUp,
  Wrench,
  Home,
  Paintbrush,
  Zap,
  Box,
  LayoutGrid,
  Droplets,
  Wind,
  Tv,
  ListChecks,
} from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import FAQAccordion from '@/components/FAQAccordion'
import ProcessStep from '@/components/ProcessStep'

export const metadata: Metadata = {
  title: 'Handyman Services — Utah County & Salt Lake County | Brian Hardy',
  description:
    'Reliable handyman services in Utah County and Salt Lake County. Brian Hardy shows up on time, quotes fair, and does quality work. Call (801) 380-0445.',
  alternates: { canonical: 'https://hre-utah.com/handyman' },
}

const services = [
  { icon: <Wrench size={18} />, label: 'General Repairs & Maintenance' },
  { icon: <Home size={18} />, label: 'Door & Window Repairs' },
  { icon: <Paintbrush size={18} />, label: 'Drywall Patching & Paint Touch-Ups' },
  { icon: <Zap size={18} />, label: 'Light Fixture & Ceiling Fan Install' },
  { icon: <Droplets size={18} />, label: 'Faucet & Fixture Replacement' },
  { icon: <LayoutGrid size={18} />, label: 'Trim & Finish Carpentry' },
  { icon: <Box size={18} />, label: 'Cabinet & Shelf Installation' },
  { icon: <Home size={18} />, label: 'Deck & Fence Repairs' },
  { icon: <Wind size={18} />, label: 'Pressure Washing' },
  { icon: <Droplets size={18} />, label: 'Gutter Cleaning & Minor Repairs' },
  { icon: <Tv size={18} />, label: 'TV Mounting & Shelf Install' },
  { icon: <Home size={18} />, label: 'Caulking & Weatherproofing' },
  { icon: <ListChecks size={18} />, label: 'Honey-Do Lists' },
  { icon: <Home size={18} />, label: 'Pre-Sale Repairs & Touch-Ups' },
]

const whyChoose = [
  {
    icon: <Clock size={20} className="text-amber-500" />,
    title: 'Shows Up On Time',
    body: 'Brian confirms appointments and shows up when he says he will. If something changes, you hear about it — not two hours after the window closes.',
  },
  {
    icon: <DollarSign size={20} className="text-amber-500" />,
    title: 'Upfront, Fair Pricing',
    body: "You get a clear quote before work starts. No vague estimates that balloon mid-job. Brian prices work honestly, not to win the bid and recoup later.",
  },
  {
    icon: <ThumbsUp size={20} className="text-amber-500" />,
    title: 'Clean, Quality Work',
    body: "Brian treats your home like it's his own. Work areas get cleaned up. Finishes are done right. He won't call a job done until it actually looks right.",
  },
  {
    icon: <MessageSquare size={20} className="text-amber-500" />,
    title: 'Communicates Clearly',
    body: "No ghosting after the estimate. If something unexpected comes up during the job, Brian tells you right away — before doing extra work and charging for it.",
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
]

const faq = [
  {
    question: 'What kinds of jobs are the right fit?',
    answer:
      'Brian handles general handyman work — repairs, maintenance, light installations, and the kind of jobs that take anywhere from an hour to a full day. Think: fixing a sticky door, patching drywall, swapping a ceiling fan, replacing a faucet, mounting a TV, tightening up trim work, fixing a gate. If you have a list of small things that need doing, that\'s exactly what he\'s good at.',
  },
  {
    question: 'What work does Brian NOT do?',
    answer:
      'Brian focuses on handyman-level work that doesn\'t require a trade license. He doesn\'t do electrical panel work, gas line work, full HVAC systems, or major structural repairs. If a job turns out to need a licensed specialist, he\'ll tell you straight and can point you toward the right person.',
  },
  {
    question: 'How do I get a quote?',
    answer:
      'Call or text Brian at (801) 380-0445 and describe what you need. For straightforward jobs, he can often give you a ballpark over the phone. For larger or more complex work, he\'ll come take a look and give you a written quote before any work begins.',
  },
  {
    question: 'Do you charge for estimates?',
    answer:
      'For most jobs, no. Brian can usually give you a pretty clear sense of cost before committing to anything.',
  },
  {
    question: 'How far in advance do I need to book?',
    answer:
      'It varies by season. Call or text to check current availability. For urgent repairs, Brian does his best to fit you in as quickly as possible.',
  },
  {
    question: 'Do you do pre-sale repairs for sellers?',
    answer:
      'Yes — and this is actually one of Brian\'s specialties. As a realtor and handyman, he knows exactly what buyers and inspectors are looking for, and he can handle the repair work directly. It saves sellers the coordination headache of finding and vetting separate contractors.',
  },
]

export default function HandymanPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-hero-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-block text-amber-400 font-semibold text-sm tracking-widest uppercase mb-4">
              Handyman Services
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
              Reliable Handyman Service in Utah County and Salt Lake County
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Tired of no-shows and vague estimates? Brian Hardy shows up when he says he will,
              quotes fair, and treats your home with respect.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:+18013800445" className="btn-primary">
                <Phone size={16} />
                Call (801) 380-0445
              </a>
              <a
                href="sms:+18013800445"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/60 text-white font-semibold rounded-lg hover:border-white hover:bg-white/10 transition-all"
              >
                <MessageSquare size={16} />
                Text for a Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="section-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="What I Handle"
            headline="Handyman Work Done Right"
            sub="From the quick fix to the full honey-do list — here's the kind of work Brian takes on."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {services.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3"
              >
                <span className="text-amber-500 flex-shrink-0">{s.icon}</span>
                <span className="text-slate-700 text-sm font-medium">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Scope note */}
          <div className="mt-8 bg-navy-50 border border-navy-100 rounded-xl p-5 flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-navy-100 flex-shrink-0 flex items-center justify-center">
              <CheckCircle size={16} className="text-navy-700" />
            </div>
            <div>
              <h4 className="font-semibold text-navy-800 mb-1">A Note on Scope</h4>
              <p className="text-navy-700 text-sm leading-relaxed">
                Brian focuses on handyman-level work where no trade license is required. For
                electrical panels, gas lines, full HVAC systems, or major structural work, he&rsquo;ll
                tell you straight and point you to the right licensed contractor. No guessing, no
                overstepping — just honest advice about what the job actually needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE BRIAN */}
      <section className="section-gray">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="Why Homeowners Choose Brian"
            headline="The Contractor Experience Without the Contractor Runaround"
            sub="Finding someone reliable for small repairs is harder than it should be. Here's what sets Brian apart."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyChoose.map((item) => (
              <div key={item.title} className="card">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-navy-800 text-base mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="How It Works"
            headline="Simple Process, No Surprises"
            sub="Getting handyman help shouldn't be complicated."
          />
          <div className="space-y-6">
            <ProcessStep
              step={1}
              title="Call or Text"
              description="Reach out at (801) 380-0445. Describe what you need — a quick photo or two helps on larger jobs. No forms, no waiting on hold."
            />
            <ProcessStep
              step={2}
              title="Quick Assessment"
              description="Brian takes a look — sometimes in person, sometimes from your description or photos. He'll let you know if he's the right fit for the job."
            />
            <ProcessStep
              step={3}
              title="Clear Quote Upfront"
              description="You get a straightforward price before any work starts. No vague estimates. No surprises mid-job."
            />
            <ProcessStep
              step={4}
              title="Work Done Right"
              description="Brian does the work cleanly and thoroughly. When he leaves, the job is finished — not mostly finished."
            />
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="section-gray">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="Coverage"
            headline="Serving Utah County and Salt Lake County"
            sub="Based in Saratoga Springs. If you're nearby and not sure if you're in the service area, just ask."
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

      {/* FAQ */}
      <section className="section-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="FAQ" headline="Common Questions" />
          <FAQAccordion items={faq} />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500 py-14 md:py-18">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Cross Off That Honey-Do List?
          </h2>
          <p className="text-amber-100 text-lg mb-8 leading-relaxed">
            Call or text Brian for a quote. Most jobs get scheduled within a week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+18013800445"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-amber-600 font-bold rounded-lg hover:bg-amber-50 transition-colors text-base shadow-sm"
            >
              <Phone size={18} />
              Call (801) 380-0445
            </a>
            <a
              href="sms:+18013800445"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/70 text-white font-semibold rounded-lg hover:border-white hover:bg-white/10 transition-all text-base"
            >
              <MessageSquare size={18} />
              Text for a Quote
            </a>
          </div>
          <p className="text-amber-200 text-sm mt-5">
            Hardyhomesutah@gmail.com · Saratoga Springs, UT
          </p>
        </div>
      </section>
    </>
  )
}
