'use server'

import { revalidatePath } from 'next/cache'
import { nextId, store, toSlug } from '@/lib/admin/store'
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
const money = (value: number) => Math.round(value * 100) / 100

function uniqueId(rows: { id: string }[], base: string) {
  const root = toSlug(base) || 'item'
  let candidate = root
  for (let suffix = 2; rows.some((row) => row.id === candidate); suffix++) candidate = `${root}-${suffix}`
  return candidate
}

function numericId(id: string | number | null) {
  const value = Number(id)
  if (!Number.isInteger(value) || value <= 0) throw new ValidationError('Invalid record id.')
  return value
}

function upsert<T extends { id: string | number; createdAt: Date; updatedAt: Date }>(rows: T[], id: T['id'] | null, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>, newId: () => T['id']) {
  const now = new Date()
  if (id !== null) {
    const index = rows.findIndex((row) => row.id === id)
    if (index === -1) throw new ValidationError('That record no longer exists.')
    rows[index] = { ...rows[index], ...data, updatedAt: now }
  } else {
    rows.push({ ...data, id: newId(), createdAt: now, updatedAt: now } as T)
  }
}

function removeById<T extends { id: string | number }>(rows: T[], id: T['id']) {
  const index = rows.findIndex((row) => row.id === id)
  if (index !== -1) rows.splice(index, 1)
}

function refresh() {
  revalidatePath('/', 'layout')
}

export async function saveRecord(resource: string, id: string | number | null, values: Values): Promise<ActionResult> {
  try {
    if (!isResourceKey(resource)) throw new ValidationError('Unknown resource.')

    switch (resource) {
      case 'courses': {
        const categoryId = text(values, 'categoryId', 'Category', { max: 100 })
        if (!store.categories.some((category) => category.id === categoryId)) throw new ValidationError('Choose a valid category.')
        const data = {
          title: text(values, 'title', 'Title', { max: 160 }),
          categoryId,
          author: text(values, 'author', 'Instructor', { max: 100 }),
          price: money(num(values, 'price', 'Price')),
          oldPrice: money(num(values, 'oldPrice', 'Original price')),
          rating: Math.round(num(values, 'rating', 'Rating', { max: 5 }) * 10) / 10,
          students: num(values, 'students', 'Students', { max: 10000000, integer: true }),
          image: text(values, 'image', 'Thumbnail URL', { max: 1000, required: false }),
          tone: choice(values, 'tone', 'Tone', courseTones),
          status: choice(values, 'status', 'Status', publishStatuses),
        }
        upsert(store.courses, id ? String(id) : null, data, () => uniqueId(store.courses, data.title))
        break
      }
      case 'categories': {
        const data = {
          name: text(values, 'name', 'Name', { max: 80 }),
          description: text(values, 'description', 'Description', { max: 300, required: false }),
          image: text(values, 'image', 'Image URL', { max: 1000, required: false }) || '/images/hero-learner.png',
          sortOrder: num(values, 'sortOrder', 'Sort order', { max: 1000, integer: true }),
        }
        upsert(store.categories, id ? String(id) : null, data, () => uniqueId(store.categories, data.name))
        break
      }
      case 'bundles': {
        const courseIds = list(values, 'courseIds').filter((courseId) => store.courses.some((course) => course.id === courseId))
        if (courseIds.length === 0) throw new ValidationError('Pick at least one course for the bundle.')
        const data = {
          name: text(values, 'name', 'Name', { max: 120 }),
          description: text(values, 'description', 'Description', { max: 400, required: false }),
          price: money(num(values, 'price', 'Price')),
          oldPrice: money(num(values, 'oldPrice', 'Original price')),
          courseIds,
          status: choice(values, 'status', 'Status', publishStatuses),
          sortOrder: num(values, 'sortOrder', 'Sort order', { max: 1000, integer: true }),
        }
        upsert(store.bundles, id ? numericId(id) : null, data, () => nextId(store.bundles))
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
        }
        upsert(store.premiumPlans, id ? numericId(id) : null, data, () => nextId(store.premiumPlans))
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
        }
        upsert(store.orders, id ? numericId(id) : null, data, () => nextId(store.orders))
        break
      }
      case 'reviews': {
        const courseId = text(values, 'courseId', 'Course', { max: 100 })
        if (!store.courses.some((course) => course.id === courseId)) throw new ValidationError('Choose a valid course.')
        const data = {
          courseId,
          reviewerName: text(values, 'reviewerName', 'Reviewer name', { max: 100 }),
          rating: num(values, 'rating', 'Rating', { min: 1, max: 5, integer: true }),
          comment: text(values, 'comment', 'Comment', { max: 1000 }),
          status: choice(values, 'status', 'Status', reviewStatuses),
        }
        upsert(store.reviews, id ? numericId(id) : null, data, () => nextId(store.reviews))
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
        }
        upsert(store.testimonials, id ? numericId(id) : null, data, () => nextId(store.testimonials))
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
        removeById(store.courses, courseId)
        store.reviews = store.reviews.filter((review) => review.courseId !== courseId)
        for (const bundle of store.bundles) bundle.courseIds = bundle.courseIds.filter((item) => item !== courseId)
        break
      }
      case 'categories': {
        const usage = store.courses.filter((course) => course.categoryId === String(id)).length
        if (usage > 0) throw new ValidationError(`This category still has ${usage} course${usage === 1 ? '' : 's'}. Move or delete them first.`)
        removeById(store.categories, String(id))
        break
      }
      case 'bundles':
        removeById(store.bundles, numericId(id))
        break
      case 'premium':
        removeById(store.premiumPlans, numericId(id))
        break
      case 'orders':
        removeById(store.orders, numericId(id))
        break
      case 'reviews':
        removeById(store.reviews, numericId(id))
        break
      case 'testimonials':
        removeById(store.testimonials, numericId(id))
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
