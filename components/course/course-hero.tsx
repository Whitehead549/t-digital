import { Bookmark, Share2, ThumbsUp, Users } from 'lucide-react'

type CourseHeroProps = {
  title: string
  subtitle: string
  description: string
  language: string
  students: string
}

export default function CourseHero({ title, subtitle, description, language, students }: CourseHeroProps) {
  return (
    <section className="bg-gradient-to-r from-[var(--soft)] via-[#fff7f8] to-[#fff1f3]">
      <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-9">
        <h1 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-[var(--ink)] md:text-[26px]">{title}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>

        <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-lg bg-white/70 p-2 text-xs text-[var(--ink)]">
          <span className="rounded-md bg-[var(--soft)] px-4 py-2 font-medium text-[var(--brand)]">Popular Course</span>
          <span className="rounded-md bg-emerald-50 px-4 py-2 font-medium text-emerald-700">{language}</span>
          <span className="inline-flex items-center gap-1.5 px-2">
            <ThumbsUp className="size-3.5" aria-hidden="true" /> New Course
          </span>
          <span className="inline-flex items-center gap-1.5 px-2">
            <Users className="size-3.5" aria-hidden="true" /> {Number(students).toLocaleString()} Students
          </span>
          <button type="button" className="rounded p-1 hover:bg-white" aria-label="Share course">
            <Share2 className="size-3.5" aria-hidden="true" />
          </button>
          <button type="button" className="rounded p-1 hover:bg-white" aria-label="Save course">
            <Bookmark className="size-3.5" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-[var(--muted)]">{description}</p>
      </div>
    </section>
  )
}
