import { store, type CourseRecord } from '@/lib/admin/store'
import type { Course } from '@/lib/data/courses'
import type { Category } from '@/lib/data/categories'
import type { Certificate } from '@/lib/data/dashboard'

export function formatMoney(value: string | number) {
  const amount = Number(value) || 0
  return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`
}

function toCourse(row: CourseRecord, categoryName: string): Course {
  return {
    id: row.id,
    title: row.title,
    category: categoryName,
    rating: row.rating.toFixed(1),
    students: String(row.students),
    author: row.author,
    price: formatMoney(row.price),
    oldPrice: formatMoney(row.oldPrice),
    image: row.image,
    tone: row.tone,
  }
}

const categoryName = (id: string) => store.categories.find((category) => category.id === id)?.name ?? 'Uncategorized'
const bySortOrder = (a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder

export async function getPublishedCourses() {
  return store.courses
    .filter((row) => row.status === 'published')
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((row) => toCourse(row, categoryName(row.categoryId)))
}

export async function getCourseById(courseId: string) {
  const row = store.courses.find((course) => course.id === courseId && course.status === 'published')
  return row ? toCourse(row, categoryName(row.categoryId)) : undefined
}

export async function getStudentCertificates(email: string): Promise<Certificate[]> {
  const owner = email.trim().toLowerCase()
  return store.certificates
    .filter((row) => row.status === 'issued' && Boolean(row.image) && row.studentEmail.toLowerCase() === owner)
    .sort((a, b) => b.issuedOn.localeCompare(a.issuedOn))
    .map((row) => ({
      id: row.code,
      course: row.courseTitle,
      instructor: row.instructor || 'TORVAN Academy',
      completedOn: new Date(`${row.issuedOn}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      verified: true,
      image: row.image,
    }))
}

export async function getCategoriesWithCounts(): Promise<Category[]> {
  const counts = new Map<string, number>()
  for (const course of store.courses) {
    if (course.status === 'published') counts.set(course.categoryId, (counts.get(course.categoryId) ?? 0) + 1)
  }
  return [...store.categories]
    .sort((a, b) => bySortOrder(a, b) || a.name.localeCompare(b.name))
    .map((row) => ({ id: row.id, name: row.name, description: row.description, image: row.image, courseCount: counts.get(row.id) ?? 0 }))
}

export async function getCategoryById(categoryId: string) {
  return store.categories.find((category) => category.id === categoryId)
}

export async function getPublishedBundles() {
  const courses = await getPublishedCourses()
  const byId = new Map(courses.map((course) => [course.id, course]))
  return store.bundles
    .filter((row) => row.status === 'published')
    .sort((a, b) => bySortOrder(a, b) || a.id - b.id)
    .map((row) => {
      const savings = row.oldPrice > row.price && row.oldPrice > 0 ? `Save ${Math.round((1 - row.price / row.oldPrice) * 100)}%` : ''
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        price: formatMoney(row.price),
        oldPrice: row.oldPrice > 0 ? formatMoney(row.oldPrice) : '',
        savings,
        courses: row.courseIds.map((id) => byId.get(id)).filter((course): course is Course => Boolean(course)),
      }
    })
}

export type PublicPlan = { id: number; name: string; price: string; suffix: string; description: string; note: string; featured: boolean }

export async function getActivePlans(): Promise<PublicPlan[]> {
  return store.premiumPlans
    .filter((row) => row.active)
    .sort((a, b) => bySortOrder(a, b) || a.id - b.id)
    .map((row) => ({ id: row.id, name: row.name, price: formatMoney(row.price), suffix: row.suffix, description: row.description, note: row.note, featured: row.featured }))
}

export type PublicTestimonial = { id: number; name: string; role: string; quote: string; rating: number }

export async function getFeaturedTestimonials(): Promise<PublicTestimonial[]> {
  return store.testimonials
    .filter((row) => row.featured)
    .sort((a, b) => bySortOrder(a, b) || b.createdAt.getTime() - a.createdAt.getTime())
    .map(({ id, name, role, quote, rating }) => ({ id, name, role, quote, rating }))
}

export type PublicReview = { id: number; reviewerName: string; rating: number; comment: string; createdAt: string }

export async function getApprovedReviews(courseIds: string[]): Promise<PublicReview[]> {
  if (courseIds.length === 0) return []
  return store.reviews
    .filter((row) => courseIds.includes(row.courseId) && row.status === 'approved')
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((row) => ({ id: row.id, reviewerName: row.reviewerName, rating: row.rating, comment: row.comment, createdAt: row.createdAt.toISOString() }))
}
