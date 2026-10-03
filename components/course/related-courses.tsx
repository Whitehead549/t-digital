'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play, Star, Users, Layers } from 'lucide-react'
import type { Course } from '@/lib/data/courses'

export default function RelatedCourses({ courses, categoryId }: { courses: Course[]; categoryId: string }) {
  const track = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })

  return (
    <section aria-labelledby="related-heading" className="mx-auto max-w-[1200px] px-6 py-14">
      <div className="rounded-xl bg-[var(--bg-soft)] px-4 py-8 md:px-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="related-heading" className="text-2xl font-medium tracking-tight text-[var(--ink)] md:text-[28px]">You may also like</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">Choose from variety of courses and learning path</p>
          </div>
          <Link href="/categories" className="text-xs font-semibold text-[var(--ink)] underline">SEE ALL</Link>
        </div>

        <div className="relative">
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous courses" className="absolute -left-3 top-1/2 z-10 hidden size-7 -translate-y-1/2 place-items-center rounded-full border border-[var(--line)] bg-white shadow-sm md:grid">
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <div ref={track} className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
            {courses.map((course) => (
              <article key={course.id} className="flex w-[260px] shrink-0 snap-start flex-col rounded-lg bg-white p-3 shadow-[0_4px_18px_rgba(23,20,26,.06)]">
                <Link href={`/categories/${categoryId}/${course.id}`} className="relative block aspect-[4/3] overflow-hidden rounded-md">
                  <img src={course.image} alt="" className="size-full object-cover" />
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-[var(--brand)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    <Star className="size-2.5 fill-current" aria-hidden="true" /> {course.rating}
                  </span>
                  <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[var(--ink)]">
                    <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
                  </span>
                </Link>
                <h3 className="mt-3 line-clamp-2 min-h-10 text-sm leading-snug text-[var(--ink)]">
                  <Link href={`/categories/${categoryId}/${course.id}`} className="hover:underline">{course.title}</Link>
                </h3>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-[var(--muted)]">
                  <span className="inline-flex items-center gap-1 rounded bg-[var(--soft)] px-1.5 py-0.5 text-[var(--brand)]"><Layers className="size-3" aria-hidden="true" /> {course.category.split(' ')[0]}</span>
                  <span className="inline-flex items-center gap-1"><Users className="size-3" aria-hidden="true" /> {course.students}</span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-[11px] text-[var(--ink)] underline">{course.author}</span>
                  <span className="flex flex-col items-end">
                    <del className="text-[10px] text-[var(--muted)]">{course.oldPrice}</del>
                    <strong className="text-lg text-[var(--ink)]">{course.price}</strong>
                  </span>
                </div>
                <button type="button" className="mt-3 self-end rounded-sm border border-[var(--ink)] px-2.5 py-1 text-[11px] text-[var(--ink)] hover:bg-[var(--bg-soft)]">Add to cart</button>
              </article>
            ))}
          </div>
          <button type="button" onClick={() => scroll(1)} aria-label="Next courses" className="absolute -right-3 top-1/2 z-10 hidden size-7 -translate-y-1/2 place-items-center rounded-full border border-[var(--line)] bg-white shadow-sm md:grid">
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
