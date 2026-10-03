import pg from 'pg'
import { categories } from '../lib/data/categories.ts'
import { courses } from '../lib/data/courses.ts'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const toSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const money = (value: string) => Number(value.replace(/[^0-9.]/g, '')) || 0

async function isEmpty(table: string) {
  const { rows } = await pool.query(`SELECT count(*)::int AS n FROM ${table}`)
  return rows[0].n === 0
}

async function main() {
  if (await isEmpty('categories')) {
    for (const [index, category] of categories.entries()) {
      await pool.query('INSERT INTO categories (id, name, description, image, sort_order) VALUES ($1,$2,$3,$4,$5)', [category.id, category.name, category.description, category.image, index])
    }
  }

  if (await isEmpty('courses')) {
    for (const course of courses) {
      await pool.query(
        'INSERT INTO courses (id, title, category_id, author, price, old_price, rating, students, image, tone, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
        [course.id, course.title, toSlug(course.category), course.author, money(course.price), money(course.oldPrice), Number(course.rating), Number(course.students), course.image, course.tone, 'published'],
      )
    }
  }

  if (await isEmpty('bundles')) {
    const bundles = [
      ['Digital Career Starter', 'Everything you need to move from curious beginner to confident digital professional.', 39, 108, courses.slice(0, 4)],
      ['Build & Ship Online', 'A practical path through design, development, and the tools that bring ideas to life.', 49, 174, courses.slice(4, 8)],
      ['AI-Powered Creator', 'Create faster, market smarter, and turn your creative skills into momentum.', 42, 191, courses.slice(8, 12)],
    ] as const
    for (const [index, [name, description, price, oldPrice, list]] of bundles.entries()) {
      await pool.query('INSERT INTO bundles (name, description, price, old_price, course_ids, sort_order) VALUES ($1,$2,$3,$4,$5,$6)', [name, description, price, oldPrice, list.map((course) => course.id), index])
    }
  }

  if (await isEmpty('premium_plans')) {
    await pool.query("INSERT INTO premium_plans (name, price, suffix, description, note, featured, sort_order) VALUES ('Monthly', 12, '/month', 'Flexible access while you find your rhythm.', '', false, 0)")
    await pool.query("INSERT INTO premium_plans (name, price, suffix, description, note, featured, sort_order) VALUES ('Annual', 89, '/year', 'The best value for consistent learners.', 'Save 38%', true, 1)")
  }

  if (await isEmpty('testimonials')) {
    const testimonials = [
      ['Adaeze Okonkwo', 'Virtual Assistant', 'The virtual assistance course gave me a clear system for finding clients. I landed my first retainer within six weeks.'],
      ['Tunde Bakare', 'Frontend Developer', 'The full-stack track was practical from day one. I shipped three portfolio projects and finally felt ready for interviews.'],
      ['Fatima Bello', 'Content Creator', 'I went from posting randomly to having a real content plan. My audience tripled in three months.'],
    ]
    for (const [index, [name, role, quote]] of testimonials.entries()) {
      await pool.query('INSERT INTO testimonials (name, role, quote, rating, featured, sort_order) VALUES ($1,$2,$3,5,true,$4)', [name, role, quote, index])
    }
  }

  if (await isEmpty('reviews')) {
    const reviews = [
      ['virtual-assistance', 'Kemi A.', 5, 'Clear, practical lessons. The client outreach module alone was worth it.', 'approved'],
      ['full-stack-web', 'Samuel O.', 5, 'Best explanation of the Next.js App Router I have found anywhere.', 'approved'],
      ['cybersecurity', 'Blessing E.', 4, 'Great lab setup walkthrough. Would love more advanced exercises.', 'approved'],
      ['content-creation', 'Musa I.', 3, 'Good content but some videos felt rushed.', 'pending'],
    ]
    for (const [courseId, name, rating, comment, status] of reviews) {
      await pool.query('INSERT INTO reviews (course_id, reviewer_name, rating, comment, status) VALUES ($1,$2,$3,$4,$5)', [courseId, name, rating, comment, status])
    }
  }

  if (await isEmpty('orders')) {
    const orders = [
      ['Chioma Eze', 'chioma@example.com', 'course', 'Professional Virtual Assistance Course', 11, 'paid'],
      ['David Mensah', 'david@example.com', 'bundle', 'Build & Ship Online', 49, 'paid'],
      ['Aisha Yusuf', 'aisha@example.com', 'premium', 'Annual Premium', 89, 'pending'],
      ['Peter Obi', 'peter@example.com', 'course', 'SOC Analyst Bootcamp: Threat Detection & Incident Response', 20, 'refunded'],
    ]
    for (const [name, email, type, item, amount, status] of orders) {
      await pool.query('INSERT INTO orders (customer_name, customer_email, item_type, item_name, amount, status) VALUES ($1,$2,$3,$4,$5,$6)', [name, email, type, item, amount, status])
    }
  }

  console.log('Seed complete')
}

main().finally(() => pool.end())
