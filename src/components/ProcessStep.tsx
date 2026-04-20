interface ProcessStepProps {
  step: number
  title: string
  description: string
}

export default function ProcessStep({ step, title, description }: ProcessStepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white font-bold text-sm flex items-center justify-center">
        {step}
      </div>
      <div>
        <h4 className="font-semibold text-navy-800 mb-1">{title}</h4>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
