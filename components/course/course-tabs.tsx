'use client'

import { useState } from 'react'
import { ChevronDown, PlayCircle, Star, Video } from 'lucide-react'
import type { CourseModule } from '@/lib/data/course-details'
import { cn } from '@/lib/utils'

const tabs = ['Description', 'Course Content', 'Reviews'] as const
type Tab = (typeof tabs)[number]
const INITIAL_MODULES = 5

type CourseTabsProps = { modules: CourseModule[]; description: string[] }

export default function CourseTabs({ modules, description }: CourseTabsProps) {
  const [active, setActive] = useState<Tab>('Course Content')
  const [open, setOpen] = useState<Set<number>>(new Set())
  const [showAll, setShowAll] = useState(false)

  const visible = showAll ? modules : modules.slice(0, INITIAL_MODULES)
  const remaining = modules.length - INITIAL_MODULES
  const allOpen = open.size === visible.length

  const toggle = (index: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })

  return (
    <section>
      <div role="tablist" aria-label="Course information" className="grid grid-cols-3 gap-2 rounded-lg bg-[var(--bg-soft)] p-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            type="button"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={cn(
              'rounded-md px-3 py-2.5 text-xs transition-colors md:text-sm',
              active === tab ? 'border border-[var(--ink)] bg-white text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--ink)]',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-4">
        {active === 'Description' && (
          <div className="flex flex-col gap-3 rounded-lg bg-[var(--bg-soft)] p-6 text-sm leading-relaxed text-[var(--ink)]/85">
            {description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        )}

        {active === 'Reviews' && (
          <div className="flex flex-col items-center gap-2 rounded-lg bg-[var(--bg-soft)] p-10 text-center">
            <Star className="size-6 text-[var(--brand)]" aria-hidden="true" />
            <p className="text-sm font-medium text-[var(--ink)]">No reviews yet</p>
            <p className="text-xs text-[var(--muted)]">Be the first to review this course after enrolling.</p>
          </div>
        )}

        {active === 'Course Content' && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setOpen(allOpen ? new Set() : new Set(visible.map((_, i) => i)))}
              className="self-end px-4 py-1 text-xs font-medium text-[var(--brand)] hover:underline"
            >
              {allOpen ? 'Collapse all' : 'Expand all'}
            </button>

            {visible.map((mod, index) => {
              const isOpen = open.has(index)
              return (
                <div key={mod.title} className="rounded-md bg-[var(--bg-soft)]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggle(index)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm text-[var(--ink)]"
                  >
                    <Video className="size-4 shrink-0 fill-[var(--ink)]" aria-hidden="true" />
                    <span className="flex-1">{mod.title}</span>
                    <span className="text-xs text-[var(--muted)]">{mod.lectures.length} lectures</span>
                    <ChevronDown className={cn('size-4 text-[var(--muted)] transition-transform', isOpen && 'rotate-180')} aria-hidden="true" />
                  </button>
                  {isOpen && (
                    <ul className="flex flex-col border-t border-[var(--line)] px-5 py-2">
                      {mod.lectures.map((lecture) => (
                        <li key={lecture} className="flex items-center gap-3 py-2 pl-7 text-sm text-[var(--muted)]">
                          <PlayCircle className="size-4 text-[var(--brand)]" aria-hidden="true" />
                          {lecture}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}

            {remaining > 0 && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="mt-1 rounded-md bg-[var(--ink)] py-3 text-xs font-semibold text-[#ff8a98] transition-colors hover:bg-black"
              >
                {showAll ? 'Show less' : `${remaining} More Section${remaining > 1 ? 's' : ''}`}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
