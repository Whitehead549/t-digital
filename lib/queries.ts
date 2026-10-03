import { and, asc, desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import * as t from '@/lib/db/schema'
import type { Course } from '@/lib/data/courses'
import type { Category } from '@/lib/data/categories'

export function formatMoney(value: string | number) {
  const amount = Number(value) || 0
  return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`
}

type CourseRow = typeof t.courses.$inferSelect

function toCourse(row: CourseRow, categoryName: string): Course {
  return {
    id: row.id,
    title: row.title,
    category: categoryName,
    rating: Number(row.rating).toFixed(1),
    students: String(row.students),
    author: row.author,
    price: formatMoney(row.price),
    oldPrice: formatMoney(row.oldPrice),
    image: row.image,
    tone: row.tone,
  }
}

async function categoryNameMap() {
  const rows = await db.select({ id: t.categories.id, name: t.categories.name }).from(t.categories)
  return new Map(rows.map((row) => [row.id, row.name]))
}

export async function getPublishedCourses() {
  const [rows, names] = await Promise.all([
    db.select().from(t.courses).where(eq(t.courses.status, 'published')).orderBy(asc(t.courses.createdAt)),
    categoryNameMap(),
  ])
  return rows.map((row) => toCourse(row, names.get(row.categoryId) ?? 'Uncategorized'))
}

export async function getCourseById(courseId: string) {
  const [row] = await db.select().from(t.courses).where(and(eq(t.courses.id, courseId), eq(t.courses.status, 'published'))).limit(1)
  if (!row) return undefined
  const [category] = await db.select({ name: t.categories.name }).from(t.categories).where(eq(t.categories.id, row.categoryId)).limit(1)
  return toCourse(row, category?.name ?? 'Uncategorized')
}

export async function getCategoriesWithCounts(): Promise<Category[]> {
  const [rows, courseRows] = await Promise.all([
    db.select().from(t.categories).orderBy(asc(t.categories.sortOrder), asc(t.categories.name)),
    db.select({ categoryId: t.courses.categoryId }).from(t.courses).where(eq(t.courses.status, 'published')),
  ])
  const counts = new Map<string, number>()
  for (const course of courseRows) counts.set(course.categoryId, (counts.get(course.categoryId) ?? 0) + 1)
  return rows.map((row) => ({ id: row.id, name: row.name, description: row.description, image: row.image, courseCount: counts.get(row.id) ?? 0 }))
}

export async function getCategoryById(categoryId: string) {
  const [row] = await db.select().from(t.categories).where(eq(t.categories.id, categoryId)).limit(1)
  return row
}

export async function getPublishedBundles() {
  const [rows, courses] = await Promise.all([
    db.select().from(t.bundles).where(eq(t.bundles.status, 'published')).orderBy(asc(t.bundles.sortOrder), asc(t.bundles.id)),
    getPublishedCourses(),
  ])
  const byId = new Map(courses.map((course) => [course.id, course]))
  return rows.map((row) => {
    const price = Number(row.price)
    const oldPrice = Number(row.oldPrice)
    const savings = oldPrice > price && oldPrice > 0 ? `Save ${Math.round((1 - price / oldPrice) * 100)}%` : ''
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: formatMoney(price),
      oldPrice: oldPrice > 0 ? formatMoney(oldPrice) : '',
      savings,
      courses: row.courseIds.map((id) => byId.get(id)).filter((course): course is Course => Boolean(course)),
    }
  })
}

export type PublicPlan = { id: number; name: string; price: string; suffix: string; description: string; note: string; featured: boolean }

export async function getActivePlans(): Promise<PublicPlan[]> {
  const rows = await db.select().from(t.premiumPlans).where(eq(t.premiumPlans.active, true)).orderBy(asc(t.premiumPlans.sortOrder), asc(t.premiumPlans.id))
  return rows.map((row) => ({ id: row.id, name: row.name, price: formatMoney(row.price), suffix: row.suffix, description: row.description, note: row.note, featured: row.featured }))
}

export type PublicTestimonial = { id: number; name: string; role: string; quote: string; rating: number }

export async function getFeaturedTestimonials(): Promise<PublicTestimonial[]> {
  const rows = await db.select().from(t.testimonials).where(eq(t.testimonials.featured, true)).orderBy(asc(t.testimonials.sortOrder), desc(t.testimonials.createdAt))
  return rows.map(({ id, name, role, quote, rating }) => ({ id, name, role, quote, rating }))
}

export type PublicReview = { id: number; reviewerName: string; rating: number; comment: string; createdAt: string }

export async function getApprovedReviews(courseIds: string[]): Promise<PublicReview[]> {
  if (courseIds.length === 0) return []
  const rows = await db.select().from(t.reviews).where(and(inArray(t.reviews.courseId, courseIds), eq(t.reviews.status, 'approved'))).orderBy(desc(t.reviews.createdAt))
  return rows.map((row) => ({ id: row.id, reviewerName: row.reviewerName, rating: row.rating, comment: row.comment, createdAt: row.createdAt.toISOString() }))
}
