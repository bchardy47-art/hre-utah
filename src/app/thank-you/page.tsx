import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Phone, MessageSquare, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Message Received',
  description:
    'Thanks for reaching out. Brian typically responds within a few hours.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://hre-utah.com/thank-you' },
}

export default function ThankYouPage() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-xl mx-auto px-5 py-16 sm:py-24">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 ring-1 ring-green-200 mb-5">
            <CheckCircle className="text-green-500" size={36} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-3">
            Message received
          </h1>
          <p className="text-slate-600 text-[15px] leading-relaxed mb-8">
            Thanks for reaching out. Brian typically responds within a few
            hours. If your question is time-sensitive, calling or texting is
            the fastest way to reach him.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <a
              href="tel:+18013800445"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-5 rounded-lg transition-colors"
            >
              <Phone size={16} />
              Call Brian
            </a>
            <a
              href="sms:+18013800445"
              className="inline-flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold py-3 px-5 rounded-lg transition-colors"
            >
              <MessageSquare size={16} />
              Text Brian
            </a>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-700 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
