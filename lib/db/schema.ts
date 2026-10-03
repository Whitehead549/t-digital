import { boolean, integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  image: text('image').notNull().default('/images/hero-learner.png'),
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps,
})

export const courses = pgTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  categoryId: text('category_id').notNull(),
  author: text('author').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),
  oldPrice: numeric('old_price', { precision: 10, scale: 2 }).notNull().default('0'),
  rating: numeric('rating', { precision: 2, scale: 1 }).notNull().default('0'),
  students: integer('students').notNull().default(0),
  image: text('image').notNull().default(''),
  tone: text('tone').notNull().default('blue'),
  status: text('status').notNull().default('published'),
  ...timestamps,
})

export const bundles = pgTable('bundles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),
  oldPrice: numeric('old_price', { precision: 10, scale: 2 }).notNull().default('0'),
  courseIds: text('course_ids').array().notNull().default([]),
  status: text('status').notNull().default('published'),
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps,
})

export const premiumPlans = pgTable('premium_plans', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),
  suffix: text('suffix').notNull().default('/month'),
  description: text('description').notNull().default(''),
  note: text('note').notNull().default(''),
  featured: boolean('featured').notNull().default(false),
  active: boolean('active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps,
})

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  itemType: text('item_type').notNull().default('course'),
  itemName: text('item_name').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull().default('0'),
  status: text('status').notNull().default('pending'),
  ...timestamps,
})

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  courseId: text('course_id').notNull(),
  reviewerName: text('reviewer_name').notNull(),
  rating: integer('rating').notNull().default(5),
  comment: text('comment').notNull().default(''),
  status: text('status').notNull().default('approved'),
  ...timestamps,
})

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull().default(''),
  quote: text('quote').notNull(),
  rating: integer('rating').notNull().default(5),
  featured: boolean('featured').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps,
})
