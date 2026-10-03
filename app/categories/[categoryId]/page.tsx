import Link from 'next/link'
import { getCategory, toSlug } from '@/lib/data/categories'
import { courses } from '@/lib/data/courses'

type Props = { params: Promise<{ categoryId: string }> }

export default async function CategoryCoursesPage({ params }: Props) {
  const { categoryId } = await params
  const category = getCategory(categoryId)
  const categoryCourses = courses.filter((course) => toSlug(course.category) === categoryId)
  return (
    <main className="route-page">
      <Link href="/categories">← All categories</Link>
      <p className="eyebrow">CATEGORY</p>
      <h1>{category?.name ?? categoryId.replaceAll('-', ' ')}</h1>
      <p>{category?.description ?? 'Courses in this learning path.'}</p>
      <div className="route-grid">
        {categoryCourses.length > 0 ? categoryCourses.map((course) => <Link className="route-card" href={`/categories/${categoryId}/${course.id}`} key={course.id}><h2>{course.title}</h2><span>{course.price} · View course →</span></Link>) : <p>No courses found in this category yet.</p>}
      </div>
    </main>
  )
}
