'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

function FAQItem({ question, answer }: FAQItem) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-navy-800 text-sm sm:text-base">{question}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white border-t border-slate-100">
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-3">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <FAQItem key={item.question} {...item} />
      ))}
    </div>
  )
}
