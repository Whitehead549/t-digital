'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import CourseCard from '@/Card/CourseCard'
import { courses } from '@/lib/data/courses'

export default function CoursesPage() {
  const [query, setQuery] = useState('')
  const visibleCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return courses
    return courses.filter((course) =>
      `${course.title} ${course.category}`.toLowerCase().includes(normalizedQuery),
    )
  }, [query])

  return (
    <main className="categories-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span><span>Courses</span>
      </nav>
      <header className="categories-header">
        <h1>Explore All Our <em>Courses</em></h1>
        <p>Learn in-demand skills from expert instructors and grow your career at your own pace.</p>
      </header>
      <form className="category-search" role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="course-search-input">Search courses</label>
        <Search aria-hidden="true" className="category-search-icon" size={14} />
        <input id="course-search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Enter keyword to search" />
        <button type="submit">Search</button>
      </form>
      <section className="course-grid categories-course-grid" aria-label="All courses">
        {visibleCourses.map((course) => <CourseCard key={course.id} course={course} onAddToCart={() => undefined} />)}
      </section>
    </main>
  )
}
