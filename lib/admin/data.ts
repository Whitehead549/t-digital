import { asc, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import * as t from '@/lib/db/schema'
import type { AdminRow, ResourceKey, ResourceOptions } from '@/lib/admin/resources'

const iso = (date: Date) => date.toISOString()

export async function getAdminRows(resource: ResourceKey): Promise<AdminRow[]> {
  switch (resource) {
    case 'courses': {
      const rows = await db.select().from(t.courses).orderBy(desc(t.courses.updatedAt))
      return rows.map((row) => ({ ...row, price: Number(row.price), oldPrice: Number(row.oldPrice), rating: Number(row.rating), createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) }))
    }
    case 'categories': {
      const [rows, courses] = await Promise.all([db.select().from(t.categories).orderBy(asc(t.categories.sortOrder), asc(t.categories.name)), db.select({ categoryId: t.courses.categoryId }).from(t.courses)])
      return rows.map((row) => ({ ...row, courseCount: courses.filter((course) => course.categoryId === row.id).length, createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) }))
    }
    case 'bundles': {
      const rows = await db.select().from(t.bundles).orderBy(asc(t.bundles.sortOrder), asc(t.bundles.id))
      return rows.map((row) => ({ ...row, price: Number(row.price), oldPrice: Number(row.oldPrice), createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) }))
    }
    case 'premium': {
      const rows = await db.select().from(t.premiumPlans).orderBy(asc(t.premiumPlans.sortOrder), asc(t.premiumPlans.id))
      return rows.map((row) => ({ ...row, price: Number(row.price), createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) }))
    }
    case 'orders': {
      const rows = await db.select().from(t.orders).orderBy(desc(t.orders.createdAt))
      return rows.map((row) => ({ ...row, amount: Number(row.amount), createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) }))
    }
    case 'reviews': {
      const rows = await db.select().from(t.reviews).orderBy(desc(t.reviews.createdAt))
      return rows.map((row) => ({ ...row, createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) }))
    }
    case 'testimonials': {
      const rows = await db.select().from(t.testimonials).orderBy(asc(t.testimonials.sortOrder), desc(t.testimonials.createdAt))
      return rows.map((row) => ({ ...row, createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) }))
    }
  }
}

export async function getResourceOptions(): Promise<ResourceOptions> {
  const [categories, courses] = await Promise.all([
    db.select({ value: t.categories.id, label: t.categories.name }).from(t.categories).orderBy(asc(t.categories.sortOrder), asc(t.categories.name)),
    db.select({ value: t.courses.id, label: t.courses.title }).from(t.courses).orderBy(asc(t.courses.title)),
  ])
  return { categories, courses }
}

export async function getOverview() {
  const [courses, orders, reviews, bundles, categories, testimonials] = await Promise.all([
    db.select({ status: t.courses.status, students: t.courses.students }).from(t.courses),
    db.select().from(t.orders).orderBy(desc(t.orders.createdAt)),
    db.select({ status: t.reviews.status }).from(t.reviews),
    db.select({ id: t.bundles.id }).from(t.bundles),
    db.select({ id: t.categories.id }).from(t.categories),
    db.select({ id: t.testimonials.id }).from(t.testimonials),
  ])
  return {
    totalCourses: courses.length,
    publishedCourses: courses.filter((course) => course.status === 'published').length,
    students: courses.reduce((sum, course) => sum + course.students, 0),
    revenue: orders.filter((order) => order.status === 'paid').reduce((sum, order) => sum + Number(order.amount), 0),
    pendingOrders: orders.filter((order) => order.status === 'pending').length,
    pendingReviews: reviews.filter((review) => review.status === 'pending').length,
    bundles: bundles.length,
    categories: categories.length,
    testimonials: testimonials.length,
    recentOrders: orders.slice(0, 5).map((order) => ({ id: order.id, customerName: order.customerName, itemName: order.itemName, amount: Number(order.amount), status: order.status, createdAt: iso(order.createdAt) })),
  }
}
