interface SectionHeaderProps {
  eyebrow?: string
  headline: string
  sub?: string
  centered?: boolean
  light?: boolean
}

export default function SectionHeader({
  eyebrow,
  headline,
  sub,
  centered = false,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={`mb-10 md:mb-14 ${centered ? 'text-center' : ''}`}>
      {eyebrow && (
        <span className="inline-block text-amber-600 font-semibold text-sm tracking-widest uppercase mb-3">
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl md:text-4xl font-bold leading-tight mb-4 ${
          light ? 'text-white' : 'text-navy-800'
        }`}
      >
        {headline}
      </h2>
      {sub && (
        <p
          className={`text-lg leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''} ${
            light ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  )
}
