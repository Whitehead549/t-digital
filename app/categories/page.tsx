'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, Search } from 'lucide-react'
import CourseCard from '@/Card/CourseCard'
import { courses } from '@/lib/data/courses'

export default function CategoriesPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const categoryNames = ['All', 'Cartoon Creation & Animation', 'Data Analysis', 'Finance', 'Freelancing & Marketing', 'Graphic Design', 'Video editing & Production', 'Web development']
  const visibleCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesQuery = !normalizedQuery || `${course.title} ${course.category}`.toLowerCase().includes(normalizedQuery)
      const matchesCategory = activeCategory === 'All' || course.category.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0])
      return matchesQuery && matchesCategory
    })
  }, [activeCategory, query])

  return (
    <main className="categories-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span><span>Categories</span>
      </nav>
      <header className="categories-header">
        <h1>Browse Our Course <em>Categories</em></h1>
        <p>Explore our course categories to find the perfect course that suits your goals and career.</p>
      </header>
      <div className="category-filters" aria-label="Course categories">
        {categoryNames.map((category) => (
          <button className={activeCategory === category ? 'active' : ''} key={category} type="button" onClick={() => setActiveCategory(category)}>
            {category}<Check aria-hidden="true" size={12} strokeWidth={3} />
          </button>
        ))}
      </div>
      <form className="category-search" role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="category-search-input">Search categories</label>
        <Search aria-hidden="true" className="category-search-icon" size={14} />
        <input id="category-search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Enter keyword to search" />
        <button type="submit">Search</button>
      </form>
      <section className="course-grid categories-course-grid" aria-label="Courses in this category">
        {visibleCourses.map((course) => <CourseCard key={course.id} course={course} onAddToCart={() => undefined} />)}
      </section>
    </main>
  )
}
