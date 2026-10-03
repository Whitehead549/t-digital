import { CircleCheck } from 'lucide-react'

export default function LearnList({ outcomes }: { outcomes: string[] }) {
  return (
    <section aria-labelledby="learn-heading">
      <h2 id="learn-heading" className="mb-4 text-lg font-semibold text-[var(--ink)]">What you&apos;ll learn</h2>
      <ul className="grid gap-x-8 gap-y-4 rounded-xl bg-white p-6 shadow-[0_6px_24px_rgba(23,20,26,.06)] md:grid-cols-2">
        {outcomes.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-[var(--ink)]/85">
            <CircleCheck className="mt-0.5 size-4 shrink-0 fill-[var(--ink)] text-white" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
