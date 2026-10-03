'use server'

import { revalidatePath } from 'next/cache'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import * as t from '@/lib/db/schema'
import {
  courseTones,
  isResourceKey,
  orderItemTypes,
  orderStatuses,
  planSuffixes,
  publishStatuses,
  reviewStatuses,
} from '@/lib/admin/resources'

type Values = Record<string, unknown>
export type ActionResult = { ok: true } | { ok: false; error: string }

class ValidationError extends Error {}

function text(values: Values, key: string, label: string, { max = 300, required = true } = {}) {
  const value = typeof values[key] === 'string' ? (values[key] as string).trim() : ''
  if (required && !value) throw new ValidationError(`${label} is required.`)
  if (value.length > max) throw new ValidationError(`${label} must be ${max} characters or fewer.`)
  return value
}

function num(values: Values, key: string, label: string, { min = 0, max = 100000, integer = false } = {}) {
  const raw = values[key]
  const value = typeof raw === 'number' ? raw : Number(raw)
  if (raw === '' || raw === undefined || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) {
    throw new ValidationError(`${label} must be ${integer ? 'a whole number' : 'a number'} between ${min} and ${max}.`)
  }
  return value
}

function choice<T extends string>(values: Values, key: string, label: string, options: readonly T[]): T {
  const value = values[key]
  if (typeof value !== 'string' || !options.includes(value as T)) throw new ValidationError(`Choose a valid ${label.toLowerCase()}.`)
  return value as T
}

const bool = (values: Values, key: string) => values[key] === true
const list = (values: Values, key: string) => (Array.isArray(values[key]) ? (values[key] as unknown[]).filter((item): item is string => typeof item === 'string').slice(0, 30) : [])
const toSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
const money = (value: number) => value.toFixed(2)

async function uniqueId(table: typeof t.courses | typeof t.categories, base: string) {
  const root = toSlug(base) || 'item'
  let candidate = root
  for (let suffix = 2; ; suffix++) {
    const [existing] = await db.select({ id: table.id }).from(table).where(eq(table.id, candidate)).limit(1)
    if (!existing) return candidate
    candidate = `${root}-${suffix}`
  }
}

async function assertCategory(categoryId: string) {
  const [category] = await db.select({ id: t.categories.id }).from(t.categories).where(eq(t.categories.id, categoryId)).limit(1)
  if (!category) throw new ValidationError('Choose a valid category.')
}

async function assertCourse(courseId: string) {
  const [course] = await db.select({ id: t.courses.id }).from(t.courses).where(eq(t.courses.id, courseId)).limit(1)
  if (!course) throw new ValidationError('Choose a valid course.')
}

function numericId(id: string | number | null) {
  const value = Number(id)
  if (!Number.isInteger(value) || value <= 0) throw new ValidationError('Invalid record id.')
  return value
}

function refresh() {
  revalidatePath('/', 'layout')
}

export async function saveRecord(resource: string, id: string | number | null, values: Values): Promise<ActionResult> {
  try {
    if (!isResourceKey(resource)) throw new ValidationError('Unknown resource.')
    const now = new Date()

    switch (resource) {
      case 'courses': {
        const categoryId = text(values, 'categoryId', 'Category', { max: 100 })
        await assertCategory(categoryId)
        const data = {
          title: text(values, 'title', 'Title', { max: 160 }),
          categoryId,
          author: text(values, 'author', 'Instructor', { max: 100 }),
          price: money(num(values, 'price', 'Price')),
          oldPrice: money(num(values, 'oldPrice', 'Original price')),
          rating: num(values, 'rating', 'Rating', { max: 5 }).toFixed(1),
          students: num(values, 'students', 'Students', { max: 10000000, integer: true }),
          image: text(values, 'image', 'Thumbnail URL', { max: 1000, required: false }),
          tone: choice(values, 'tone', 'Tone', courseTones),
          status: choice(values, 'status', 'Status', publishStatuses),
          updatedAt: now,
        }
        if (id) await db.update(t.courses).set(data).where(eq(t.courses.id, String(id)))
        else await db.insert(t.courses).values({ ...data, id: await uniqueId(t.courses, data.title) })
        break
      }
      case 'categories': {
        const data = {
          name: text(values, 'name', 'Name', { max: 80 }),
          description: text(values, 'description', 'Description', { max: 300, required: false }),
          image: text(values, 'image', 'Image URL', { max: 1000, required: false }) || '/images/hero-learner.png',
          sortOrder: num(values, 'sortOrder', 'Sort order', { max: 1000, integer: true }),
          updatedAt: now,
        }
        if (id) await db.update(t.categories).set(data).where(eq(t.categories.id, String(id)))
        else await db.insert(t.categories).values({ ...data, id: await uniqueId(t.categories, data.name) })
        break
      }
      case 'bundles': {
        const courseIds = list(values, 'courseIds')
        if (courseIds.length === 0) throw new ValidationError('Pick at least one course for the bundle.')
        const data = {
          name: text(values, 'name', 'Name', { max: 120 }),
          description: text(values, 'description', 'Description', { max: 400, required: false }),
          price: money(num(values, 'price', 'Price')),
          oldPrice: money(num(values, 'oldPrice', 'Original price')),
          courseIds,
          status: choice(values, 'status', 'Status', publishStatuses),
          sortOrder: num(values, 'sortOrder', 'Sort order', { max: 1000, integer: true }),
          updatedAt: now,
        }
        if (id) await db.update(t.bundles).set(data).where(eq(t.bundles.id, numericId(id)))
        else await db.insert(t.bundles).values(data)
        break
      }
      case 'premium': {
        const data = {
          name: text(values, 'name', 'Plan name', { max: 60 }),
          price: money(num(values, 'price', 'Price')),
          suffix: choice(values, 'suffix', 'Billing period', planSuffixes),
          description: text(values, 'description', 'Description', { max: 300, required: false }),
          note: text(values, 'note', 'Badge note', { max: 40, required: false }),
          featured: bool(values, 'featured'),
          active: bool(values, 'active'),
          sortOrder: num(values, 'sortOrder', 'Sort order', { max: 1000, integer: true }),
          updatedAt: now,
        }
        if (id) await db.update(t.premiumPlans).set(data).where(eq(t.premiumPlans.id, numericId(id)))
        else await db.insert(t.premiumPlans).values(data)
        break
      }
      case 'orders': {
        const email = text(values, 'customerEmail', 'Customer email', { max: 200 })
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ValidationError('Enter a valid customer email.')
        const data = {
          customerName: text(values, 'customerName', 'Customer name', { max: 120 }),
          customerEmail: email,
          itemType: choice(values, 'itemType', 'Item type', orderItemTypes),
          itemName: text(values, 'itemName', 'Item', { max: 200 }),
          amount: money(num(values, 'amount', 'Amount')),
          status: choice(values, 'status', 'Status', orderStatuses),
          updatedAt: now,
        }
        if (id) await db.update(t.orders).set(data).where(eq(t.orders.id, numericId(id)))
        else await db.insert(t.orders).values(data)
        break
      }
      case 'reviews': {
        const courseId = text(values, 'courseId', 'Course', { max: 100 })
        await assertCourse(courseId)
        const data = {
          courseId,
          reviewerName: text(values, 'reviewerName', 'Reviewer name', { max: 100 }),
          rating: num(values, 'rating', 'Rating', { min: 1, max: 5, integer: true }),
          comment: text(values, 'comment', 'Comment', { max: 1000 }),
          status: choice(values, 'status', 'Status', reviewStatuses),
          updatedAt: now,
        }
        if (id) await db.update(t.reviews).set(data).where(eq(t.reviews.id, numericId(id)))
        else await db.insert(t.reviews).values(data)
        break
      }
      case 'testimonials': {
        const data = {
          name: text(values, 'name', 'Name', { max: 100 }),
          role: text(values, 'role', 'Role', { max: 100, required: false }),
          quote: text(values, 'quote', 'Quote', { max: 600 }),
          rating: num(values, 'rating', 'Rating', { min: 1, max: 5, integer: true }),
          featured: bool(values, 'featured'),
          sortOrder: num(values, 'sortOrder', 'Sort order', { max: 1000, integer: true }),
          updatedAt: now,
        }
        if (id) await db.update(t.testimonials).set(data).where(eq(t.testimonials.id, numericId(id)))
        else await db.insert(t.testimonials).values(data)
        break
      }
    }

    refresh()
    return { ok: true }
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, error: error.message }
    console.error('[admin] save failed', error)
    return { ok: false, error: 'Something went wrong while saving. Please try again.' }
  }
}

export async function deleteRecord(resource: string, id: string | number): Promise<ActionResult> {
  try {
    if (!isResourceKey(resource)) throw new ValidationError('Unknown resource.')

    switch (resource) {
      case 'courses': {
        const courseId = String(id)
        await db.delete(t.courses).where(eq(t.courses.id, courseId))
        await db.delete(t.reviews).where(eq(t.reviews.courseId, courseId))
        await db.update(t.bundles).set({ courseIds: sql`array_remove(${t.bundles.courseIds}, ${courseId})` })
        break
      }
      case 'categories': {
        const [usage] = await db.select({ n: sql<number>`count(*)::int` }).from(t.courses).where(eq(t.courses.categoryId, String(id)))
        if (usage.n > 0) throw new ValidationError(`This category still has ${usage.n} course${usage.n === 1 ? '' : 's'}. Move or delete them first.`)
        await db.delete(t.categories).where(eq(t.categories.id, String(id)))
        break
      }
      case 'bundles':
        await db.delete(t.bundles).where(eq(t.bundles.id, numericId(id)))
        break
      case 'premium':
        await db.delete(t.premiumPlans).where(eq(t.premiumPlans.id, numericId(id)))
        break
      case 'orders':
        await db.delete(t.orders).where(eq(t.orders.id, numericId(id)))
        break
      case 'reviews':
        await db.delete(t.reviews).where(eq(t.reviews.id, numericId(id)))
        break
      case 'testimonials':
        await db.delete(t.testimonials).where(eq(t.testimonials.id, numericId(id)))
        break
    }

    refresh()
    return { ok: true }
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, error: error.message }
    console.error('[admin] delete failed', error)
    return { ok: false, error: 'Something went wrong while deleting. Please try again.' }
  }
}
