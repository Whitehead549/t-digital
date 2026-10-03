import { store } from '@/lib/admin/store'
import type { AdminRow, ResourceKey, ResourceOptions } from '@/lib/admin/resources'

const iso = (date: Date) => date.toISOString()
const byNewest = (a: { createdAt: Date }, b: { createdAt: Date }) => b.createdAt.getTime() - a.createdAt.getTime()
const bySortOrder = (a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder
const withDates = <T extends { createdAt: Date; updatedAt: Date }>(row: T) => ({ ...row, createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt) })

export async function getAdminRows(resource: ResourceKey): Promise<AdminRow[]> {
  switch (resource) {
    case 'courses':
      return [...store.courses].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).map(withDates)
    case 'categories':
      return [...store.categories]
        .sort((a, b) => bySortOrder(a, b) || a.name.localeCompare(b.name))
        .map((row) => ({ ...withDates(row), courseCount: store.courses.filter((course) => course.categoryId === row.id).length }))
    case 'bundles':
      return [...store.bundles].sort((a, b) => bySortOrder(a, b) || a.id - b.id).map((row) => ({ ...withDates(row), courseIds: [...row.courseIds] }))
    case 'premium':
      return [...store.premiumPlans].sort((a, b) => bySortOrder(a, b) || a.id - b.id).map(withDates)
    case 'orders':
      return [...store.orders].sort(byNewest).map(withDates)
    case 'reviews':
      return [...store.reviews].sort(byNewest).map(withDates)
    case 'testimonials':
      return [...store.testimonials].sort((a, b) => bySortOrder(a, b) || byNewest(a, b)).map(withDates)
  }
}

export async function getResourceOptions(): Promise<ResourceOptions> {
  return {
    categories: [...store.categories].sort((a, b) => bySortOrder(a, b) || a.name.localeCompare(b.name)).map((row) => ({ value: row.id, label: row.name })),
    courses: [...store.courses].sort((a, b) => a.title.localeCompare(b.title)).map((row) => ({ value: row.id, label: row.title })),
  }
}

export async function getOverview() {
  const { courses, reviews, bundles, categories, testimonials } = store
  const orders = [...store.orders].sort(byNewest)
  return {
    totalCourses: courses.length,
    publishedCourses: courses.filter((course) => course.status === 'published').length,
    students: courses.reduce((sum, course) => sum + course.students, 0),
    revenue: orders.filter((order) => order.status === 'paid').reduce((sum, order) => sum + order.amount, 0),
    pendingOrders: orders.filter((order) => order.status === 'pending').length,
    pendingReviews: reviews.filter((review) => review.status === 'pending').length,
    bundles: bundles.length,
    categories: categories.length,
    testimonials: testimonials.length,
    recentOrders: orders.slice(0, 5).map((order) => ({ id: order.id, customerName: order.customerName, itemName: order.itemName, amount: order.amount, status: order.status, createdAt: iso(order.createdAt) })),
  }
}
