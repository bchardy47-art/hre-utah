import type { Metadata } from 'next'
import { Phone, Mail, MapPin, MessageSquare, Clock, CheckCircle } from 'lucide-react'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Brian Hardy — Utah Realtor + Handyman',
  description:
    'Call, text, or message Brian Hardy. Utah County and Salt Lake County real estate and handyman services. (801) 380-0445.',
  alternates: { canonical: 'https://hre-utah.com/contact' },
}

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

export default function ContactPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-hero-gradient text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="max-w-xl">
            <span className="inline-block text-amber-400 font-semibold text-sm tracking-widest uppercase mb-4">
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Let&rsquo;s Talk
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Call or text Brian directly — no gatekeepers, no call centers, no waiting on a
              callback from someone who doesn&rsquo;t know your situation.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTACT SECTION */}
      <section className="section-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left: contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-5">Contact Brian</h2>
                <div className="space-y-4">
                  {/* Phone */}
                  <a
                    href="tel:+18013800445"
                    className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                      <Phone size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-navy-800 text-sm">Call or Text</div>
                      <div className="text-amber-600 font-bold text-lg">(801) 380-0445</div>
                      <div className="text-slate-500 text-xs">Best way to reach Brian</div>
                    </div>
                  </a>

                  {/* SMS */}
                  <a
                    href="sms:+18013800445"
                    className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-navy-300 hover:bg-navy-50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center flex-shrink-0 group-hover:bg-navy-200 transition-colors">
                      <MessageSquare size={18} className="text-navy-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-navy-800 text-sm">Text Message</div>
                      <div className="text-navy-700 font-semibold">(801) 380-0445</div>
                      <div className="text-slate-500 text-xs">Tap to open your message app</div>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:Hardyhomesutah@gmail.com"
                    className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200 transition-colors">
                      <Mail size={18} className="text-slate-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-navy-800 text-sm">Email</div>
                      <div className="text-slate-700 font-medium text-sm break-all">
                        Hardyhomesutah@gmail.com
                      </div>
                      <div className="text-slate-500 text-xs">Usually responds within a few hours</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Response time */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
                <Clock size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800 text-sm">Fast Response</p>
                  <p className="text-green-700 text-xs mt-0.5">
                    Brian typically responds to calls, texts, and emails within a few hours.
                    For urgent repairs, call directly.
                  </p>
                </div>
              </div>

              {/* Business info */}
              <div className="bg-navy-50 border border-navy-100 rounded-xl p-4 space-y-2">
                <div className="font-semibold text-navy-800 text-sm mb-3">Business Details</div>
                <div className="flex items-start gap-2 text-sm text-navy-700">
                  <CheckCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  Hardy Real Estate
                </div>
                <div className="flex items-start gap-2 text-sm text-navy-700">
                  <CheckCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  Boardwalk Realty and Property Management
                </div>
                <div className="flex items-start gap-2 text-sm text-navy-700">
                  <CheckCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  Licensed Utah Realtor
                </div>
                <div className="flex items-start gap-2 text-sm text-navy-700">
                  <MapPin size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  Based in Saratoga Springs, UT
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3">
              <h2 className="text-xl font-bold text-navy-800 mb-5">Send a Message</h2>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="section-gray">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <span className="inline-block text-amber-600 font-semibold text-sm tracking-widest uppercase mb-2">
              Coverage
            </span>
            <h2 className="text-2xl font-bold text-navy-800 mb-2">Service Areas</h2>
            <p className="text-slate-600 text-sm">
              Brian serves Utah County and Salt Lake County. Not sure if you&rsquo;re in range?
              Just call or text — chances are you are.
            </p>
          </div>
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
    </>
  )
}
