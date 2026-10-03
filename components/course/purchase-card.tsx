'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Award, BarChart3, BookOpen, Clock, Play, ShoppingCart, Star, Users } from 'lucide-react'
import type { Course } from '@/lib/data/courses'
import type { CourseDetails } from '@/lib/data/course-details'

type PurchaseCardProps = { course: Course; details: CourseDetails; learnHref: string }

function discount(price: string, oldPrice: string) {
  const now = Number(price.replace(/[^\d.]/g, ''))
  const before = Number(oldPrice.replace(/[^\d.]/g, ''))
  return before > 0 ? Math.round((1 - now / before) * 100) : 0
}

export default function PurchaseCard({ course, details, learnHref }: PurchaseCardProps) {
  const [inCart, setInCart] = useState(false)

  const features = [
    { icon: BookOpen, label: `${details.lessons} Lessons (${details.hours} Hours)` },
    { icon: Clock, label: details.access },
    { icon: Users, label: `${Number(course.students).toLocaleString()} Students` },
    { icon: BarChart3, label: `Skill level : ${details.level}` },
    { icon: Award, label: `Certificate : ${details.certificate}` },
    { icon: Star, label: `${course.rating} rating` },
  ]

  return (
    <aside className="rounded-lg border border-[var(--line)] bg-white p-5 shadow-[0_6px_24px_rgba(23,20,26,.05)] lg:sticky lg:top-24">
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-[var(--ink)]">
          {course.price}
          <span className="ml-0.5 text-xs font-normal text-[var(--muted)]">USD</span>
        </p>
        <p className="pb-1 text-sm text-[var(--muted)]">
          {discount(course.price, course.oldPrice)}% Disc. <del className="font-medium text-[var(--ink)]">{course.oldPrice}</del>
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <Link
          href={learnHref}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--brand)] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--brand-dark)]"
        >
          Buy Now <Play className="size-3 fill-current" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => setInCart((v) => !v)}
          aria-pressed={inCart}
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-[var(--ink)] py-2.5 text-xs font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--bg-soft)]"
        >
          {inCart ? 'Added to cart' : 'Add to cart'} <ShoppingCart className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <h3 className="mt-6 text-base font-medium text-[var(--ink)]">Course features</h3>
      <ul className="mt-3 flex flex-col gap-3.5">
        {features.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2.5 text-xs text-[var(--ink)]/85">
            <Icon className="size-4 text-[var(--ink)]" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-[var(--line)] pt-5">
        <div className="grid size-11 place-items-center rounded-full bg-[var(--soft)] text-sm font-bold text-[var(--brand)]">
          {course.author
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <p className="mt-3 text-sm font-semibold text-[var(--ink)]">{course.author}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--muted)]">
          {details.instructorRole} | Rating
          <span className="flex text-[var(--brand)]" aria-label={`${course.rating} out of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3 fill-current" aria-hidden="true" />
            ))}
          </span>
        </p>
        <p className="mt-1 text-[11px] text-[var(--muted)]">
          <Link href="/categories" className="font-semibold text-[var(--ink)] underline">
            See Other
          </Link>{' '}
          courses from the instructor
        </p>
      </div>
    </aside>
  )
}
