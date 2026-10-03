import { MessageCircleQuestion, Triangle } from 'lucide-react'
import type { CourseFaq as Faq } from '@/lib/data/course-details'

export default function CourseFaq({ faqs }: { faqs: Faq[] }) {
  return (
    <section aria-labelledby="faq-heading" className="pt-6">
      <h2 id="faq-heading" className="mb-7 text-center text-2xl font-medium tracking-tight text-[var(--ink)] md:text-[28px]">
        Frequently Asked Questions (FAQ)
      </h2>
      <div className="flex flex-col gap-4">
        {faqs.map((faq) => (
          <details key={faq.question} className="group rounded-lg border border-[var(--line)] bg-white">
            <summary className="flex cursor-pointer list-none items-center gap-4 px-6 py-4 text-[15px] text-[var(--ink)] [&::-webkit-details-marker]:hidden">
              <MessageCircleQuestion className="size-4 shrink-0 text-[var(--muted)]" aria-hidden="true" />
              <span className="flex-1">{faq.question}</span>
              <Triangle className="size-2.5 rotate-180 fill-[var(--ink)] transition-transform group-open:rotate-0" aria-hidden="true" />
            </summary>
            <p className="px-6 pb-5 pl-14 text-sm leading-relaxed text-[var(--muted)]">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
