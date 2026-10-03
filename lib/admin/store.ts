import { categories as seedCategories } from '@/lib/data/categories'
import { courses as seedCourses } from '@/lib/data/courses'

import type { VideoAsset } from '@/lib/admin/resources'

type Timestamps = { createdAt: Date; updatedAt: Date }
type Media = { image: string; videos: VideoAsset[] }

export type CategoryRecord = Timestamps & Media & { id: string; name: string; description: string; sortOrder: number }
export type CourseRecord = Timestamps & Media & {
  id: string
  title: string
  categoryId: string
  author: string
  price: number
  oldPrice: number
  rating: number
  students: number
  tone: string
  status: string
}
export type BundleRecord = Timestamps & Media & { id: number; name: string; description: string; price: number; oldPrice: number; courseIds: string[]; status: string; sortOrder: number }
export type PlanRecord = Timestamps & Media & { id: number; name: string; price: number; suffix: string; description: string; note: string; featured: boolean; active: boolean; sortOrder: number }
export type OrderRecord = Timestamps & { id: number; customerName: string; customerEmail: string; itemType: string; itemName: string; amount: number; status: string }
export type ReviewRecord = Timestamps & { id: number; courseId: string; reviewerName: string; avatar: string; rating: number; comment: string; status: string }
export type TestimonialRecord = Timestamps & { id: number; name: string; role: string; avatar: string; quote: string; rating: number; featured: boolean; sortOrder: number }
export type CertificateRecord = Timestamps & {
  id: number
  code: string
  studentName: string
  studentEmail: string
  courseTitle: string
  instructor: string
  issuedOn: string
  image: string
  status: string
}

export type Store = {
  categories: CategoryRecord[]
  courses: CourseRecord[]
  bundles: BundleRecord[]
  premiumPlans: PlanRecord[]
  orders: OrderRecord[]
  reviews: ReviewRecord[]
  testimonials: TestimonialRecord[]
  certificates: CertificateRecord[]
}

export const toSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
const money = (value: string) => Number(value.replace(/[^0-9.]/g, '')) || 0
const DAY = 24 * 60 * 60 * 1000

function stamp(daysAgo: number): Timestamps {
  const date = new Date(Date.now() - daysAgo * DAY)
  return { createdAt: date, updatedAt: date }
}

function createSeed(): Store {
  const categories: CategoryRecord[] = seedCategories.map((category, index) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    image: category.image,
    videos: [],
    sortOrder: index,
    ...stamp(60 - index),
  }))

  for (const course of seedCourses) {
    const id = toSlug(course.category)
    if (!categories.some((category) => category.id === id)) {
      categories.push({ id, name: course.category, description: '', image: '/images/hero-learner.png', videos: [], sortOrder: categories.length, ...stamp(40) })
    }
  }

  const courses: CourseRecord[] = seedCourses.map((course, index) => ({
    id: course.id,
    title: course.title,
    categoryId: toSlug(course.category),
    author: course.author,
    price: money(course.price),
    oldPrice: money(course.oldPrice),
    rating: Number(course.rating),
    students: Number(course.students),
    image: course.image,
    videos: [],
    tone: course.tone,
    status: 'published',
    ...stamp(seedCourses.length - index),
  }))

  const bundleSeeds = [
    ['Digital Career Starter', 'Everything you need to move from curious beginner to confident digital professional.', 39, 108, courses.slice(0, 4)],
    ['Build & Ship Online', 'A practical path through design, development, and the tools that bring ideas to life.', 49, 174, courses.slice(4, 8)],
    ['AI-Powered Creator', 'Create faster, market smarter, and turn your creative skills into momentum.', 42, 191, courses.slice(8, 12)],
  ] as const
  const bundles: BundleRecord[] = bundleSeeds.map(([name, description, price, oldPrice, list], index) => ({
    id: index + 1,
    name,
    description,
    price,
    oldPrice,
    courseIds: list.map((course) => course.id),
    image: list[0]?.image ?? '',
    videos: [],
    status: 'published',
    sortOrder: index,
    ...stamp(20 - index),
  }))

  const premiumPlans: PlanRecord[] = [
    { id: 1, name: 'Monthly', price: 12, suffix: '/month', description: 'Flexible access while you find your rhythm.', note: '', featured: false, active: true, image: '', videos: [], sortOrder: 0, ...stamp(30) },
    { id: 2, name: 'Annual', price: 89, suffix: '/year', description: 'The best value for consistent learners.', note: 'Save 38%', featured: true, active: true, image: '', videos: [], sortOrder: 1, ...stamp(30) },
  ]

  const testimonials: TestimonialRecord[] = [
    ['Adaeze Okonkwo', 'Virtual Assistant', 'The virtual assistance course gave me a clear system for finding clients. I landed my first retainer within six weeks.'],
    ['Tunde Bakare', 'Frontend Developer', 'The full-stack track was practical from day one. I shipped three portfolio projects and finally felt ready for interviews.'],
    ['Fatima Bello', 'Content Creator', 'I went from posting randomly to having a real content plan. My audience tripled in three months.'],
  ].map(([name, role, quote], index) => ({ id: index + 1, name, role, avatar: '', quote, rating: 5, featured: true, sortOrder: index, ...stamp(15 - index) }))

  const reviews: ReviewRecord[] = (
    [
      ['virtual-assistance', 'Kemi A.', 5, 'Clear, practical lessons. The client outreach module alone was worth it.', 'approved'],
      ['full-stack-web', 'Samuel O.', 5, 'Best explanation of the Next.js App Router I have found anywhere.', 'approved'],
      ['cybersecurity', 'Blessing E.', 4, 'Great lab setup walkthrough. Would love more advanced exercises.', 'approved'],
      ['content-creation', 'Musa I.', 3, 'Good content but some videos felt rushed.', 'pending'],
    ] as const
  ).map(([courseId, reviewerName, rating, comment, status], index) => ({ id: index + 1, courseId, reviewerName, avatar: '', rating, comment, status, ...stamp(10 - index) }))

  const orders: OrderRecord[] = (
    [
      ['Chioma Eze', 'chioma@example.com', 'course', 'Professional Virtual Assistance Course', 11, 'paid'],
      ['David Mensah', 'david@example.com', 'bundle', 'Build & Ship Online', 49, 'paid'],
      ['Aisha Yusuf', 'aisha@example.com', 'premium', 'Annual Premium', 89, 'pending'],
      ['Peter Obi', 'peter@example.com', 'course', 'SOC Analyst Bootcamp: Threat Detection & Incident Response', 20, 'refunded'],
      ['Ngozi Adebayo', 'ngozi@example.com', 'course', 'Full-Stack Web Development with Next.js, React & Node', 22, 'paid'],
      ['Ibrahim Sani', 'ibrahim@example.com', 'premium', 'Monthly Premium', 12, 'cancelled'],
    ] as const
  ).map(([customerName, customerEmail, itemType, itemName, amount, status], index) => ({ id: index + 1, customerName, customerEmail, itemType, itemName, amount, status, ...stamp(index) }))

  return { categories, courses, bundles, premiumPlans, orders, reviews, testimonials, certificates: seedCertificates() }
}

function seedCertificates(): CertificateRecord[] {
  return []
}

// Kept on globalThis so admin edits survive hot reloads and are shared across requests in the same server process.
const globalForStore = globalThis as unknown as { adminStore?: Store }
export const store: Store = globalForStore.adminStore ?? (globalForStore.adminStore = createSeed())
// Stores created before certificates existed (kept alive on globalThis) need the collection backfilled.
store.certificates ??= seedCertificates()

export function nextId(rows: { id: number }[]) {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1
}
