import { Star } from 'lucide-react'

interface TestimonialCardProps {
  quote: string
  name: string
  location: string
  service: 'Real Estate' | 'Handyman'
}

export default function TestimonialCard({ quote, name, location, service }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
        ))}
      </div>
      <blockquote className="text-slate-700 leading-relaxed text-sm flex-1">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800 text-sm">{name}</p>
          <p className="text-slate-500 text-xs">{location}</p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            service === 'Real Estate'
              ? 'bg-navy-100 text-navy-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {service}
        </span>
      </div>
    </div>
  )
}
