import type { ReactNode } from 'react'
import {
  courseTones,
  orderItemTypes,
  orderStatuses,
  planSuffixes,
  publishStatuses,
  reviewStatuses,
  type AdminRow,
  type ResourceKey,
  type ResourceOptions,
  type SelectOption,
} from '@/lib/admin/resources'

export type FieldConfig = {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'multiselect' | 'email' | 'url'
  options?: readonly string[]
  optionsKey?: keyof ResourceOptions
  required?: boolean
  step?: string
  min?: number
  max?: number
  half?: boolean
  hint?: string
}

export type ColumnConfig = { label: string; render: (row: AdminRow, ctx: RenderContext) => ReactNode }
export type RenderContext = { options: ResourceOptions }

export type ResourceConfig = {
  title: string
  singular: string
  description: string
  searchFields: string[]
  statusField?: string
  statusOptions?: readonly string[]
  fields: FieldConfig[]
  defaults: Record<string, unknown>
  columns: ColumnConfig[]
  readOnlyId?: boolean
}

const money = (value: unknown) => {
  const amount = Number(value) || 0
  return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`
}
const label = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
const findLabel = (options: SelectOption[], value: unknown) => options.find((option) => option.value === value)?.label ?? String(value ?? '—')
const initials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

export const formatDate = (value: unknown) => {
  if (typeof value !== 'string') return '—'
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function StatusBadge({ value }: { value: unknown }) {
  const status = String(value ?? '')
  return <span className={`admin-status ${status}`}><i />{label(status)}</span>
}

const Stars = ({ value }: { value: unknown }) => <span className="admin-stars" aria-label={`${value} out of 5 stars`}>{'★'.repeat(Number(value) || 0)}<span>{'★'.repeat(5 - (Number(value) || 0))}</span></span>

export const resourceConfigs: Record<ResourceKey, ResourceConfig> = {
  courses: {
    title: 'Courses',
    singular: 'course',
    description: 'Manage your learning catalog, pricing, and visibility.',
    searchFields: ['title', 'author', 'categoryId'],
    statusField: 'status',
    statusOptions: publishStatuses,
    defaults: { title: '', categoryId: '', author: '', price: 0, oldPrice: 0, rating: 0, students: 0, image: '', tone: 'blue', status: 'draft' },
    fields: [
      { name: 'title', label: 'Course title', type: 'text', required: true },
      { name: 'categoryId', label: 'Category', type: 'select', optionsKey: 'categories', required: true, half: true },
      { name: 'author', label: 'Instructor', type: 'text', required: true, half: true },
      { name: 'price', label: 'Price ($)', type: 'number', step: '0.01', min: 0, required: true, half: true },
      { name: 'oldPrice', label: 'Original price ($)', type: 'number', step: '0.01', min: 0, required: true, half: true },
      { name: 'rating', label: 'Rating (0–5)', type: 'number', step: '0.1', min: 0, max: 5, required: true, half: true },
      { name: 'students', label: 'Students', type: 'number', step: '1', min: 0, required: true, half: true },
      { name: 'image', label: 'Thumbnail URL', type: 'url' },
      { name: 'tone', label: 'Card tone', type: 'select', options: courseTones, half: true },
      { name: 'status', label: 'Status', type: 'select', options: publishStatuses, half: true },
    ],
    columns: [
      { label: 'Course', render: (row, { options }) => <div className="admin-course-cell">{row.image ? <img src={String(row.image)} alt="" /> : <span className="admin-thumb-empty" />}<span><b>{row.title}</b><small>{findLabel(options.categories, row.categoryId)}</small></span></div> },
      { label: 'Instructor', render: (row) => <span className="admin-instructor"><span>{initials(String(row.author))}</span>{row.author}</span> },
      { label: 'Price', render: (row) => <><b>{money(row.price)}</b><del>{money(row.oldPrice)}</del></> },
      { label: 'Students', render: (row) => Number(row.students).toLocaleString() },
      { label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
      { label: 'Updated', render: (row) => <span className="admin-updated">{formatDate(row.updatedAt)}</span> },
    ],
  },
  categories: {
    title: 'Categories',
    singular: 'category',
    description: 'Organize courses into the category buttons and pages learners browse.',
    searchFields: ['name', 'description'],
    defaults: { name: '', description: '', image: '', sortOrder: 0 },
    fields: [
      { name: 'name', label: 'Category name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'image', label: 'Image URL', type: 'url', hint: 'Leave blank to use the default image.' },
      { name: 'sortOrder', label: 'Display order', type: 'number', step: '1', min: 0, required: true, half: true, hint: 'Lower numbers appear first.' },
    ],
    columns: [
      { label: 'Category', render: (row) => <div className="admin-course-cell"><span className="admin-letter">{String(row.name).charAt(0)}</span><span><b>{row.name}</b><small>/categories/{row.id}</small></span></div> },
      { label: 'Description', render: (row) => <span className="admin-clamp">{row.description || '—'}</span> },
      { label: 'Courses', render: (row) => <b>{row.courseCount}</b> },
      { label: 'Order', render: (row) => row.sortOrder },
      { label: 'Updated', render: (row) => <span className="admin-updated">{formatDate(row.updatedAt)}</span> },
    ],
  },
  bundles: {
    title: 'Bundles',
    singular: 'bundle',
    description: 'Group courses into discounted learning paths.',
    searchFields: ['name', 'description'],
    statusField: 'status',
    statusOptions: publishStatuses,
    defaults: { name: '', description: '', price: 0, oldPrice: 0, courseIds: [], status: 'draft', sortOrder: 0 },
    fields: [
      { name: 'name', label: 'Bundle name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'price', label: 'Bundle price ($)', type: 'number', step: '0.01', min: 0, required: true, half: true },
      { name: 'oldPrice', label: 'Original price ($)', type: 'number', step: '0.01', min: 0, required: true, half: true },
      { name: 'courseIds', label: 'Included courses', type: 'multiselect', optionsKey: 'courses' },
      { name: 'status', label: 'Status', type: 'select', options: publishStatuses, half: true },
      { name: 'sortOrder', label: 'Display order', type: 'number', step: '1', min: 0, required: true, half: true },
    ],
    columns: [
      { label: 'Bundle', render: (row) => <div className="admin-course-cell"><span className="admin-letter">B</span><span><b>{row.name}</b><small className="admin-clamp">{row.description}</small></span></div> },
      { label: 'Courses', render: (row) => `${(row.courseIds as string[]).length} courses` },
      { label: 'Price', render: (row) => <><b>{money(row.price)}</b><del>{money(row.oldPrice)}</del></> },
      { label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
      { label: 'Updated', render: (row) => <span className="admin-updated">{formatDate(row.updatedAt)}</span> },
    ],
  },
  premium: {
    title: 'Premium',
    singular: 'plan',
    description: 'Configure the membership plans shown on the Premium page.',
    searchFields: ['name', 'description'],
    defaults: { name: '', price: 0, suffix: '/month', description: '', note: '', featured: false, active: true, sortOrder: 0 },
    fields: [
      { name: 'name', label: 'Plan name', type: 'text', required: true, half: true },
      { name: 'suffix', label: 'Billing period', type: 'select', options: planSuffixes, half: true },
      { name: 'price', label: 'Price ($)', type: 'number', step: '0.01', min: 0, required: true, half: true },
      { name: 'note', label: 'Badge note', type: 'text', half: true, hint: 'e.g. “Save 38%”' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'sortOrder', label: 'Display order', type: 'number', step: '1', min: 0, required: true, half: true },
      { name: 'featured', label: 'Selected by default', type: 'checkbox' },
      { name: 'active', label: 'Visible on Premium page', type: 'checkbox' },
    ],
    columns: [
      { label: 'Plan', render: (row) => <div className="admin-course-cell"><span className="admin-letter">{String(row.name).charAt(0)}</span><span><b>{row.name}</b><small className="admin-clamp">{row.description}</small></span></div> },
      { label: 'Price', render: (row) => <b>{money(row.price)} <small className="admin-muted">{row.suffix}</small></b> },
      { label: 'Badge', render: (row) => row.note || '—' },
      { label: 'Default', render: (row) => (row.featured ? 'Yes' : 'No') },
      { label: 'Status', render: (row) => <StatusBadge value={row.active ? 'published' : 'draft'} /> },
    ],
  },
  orders: {
    title: 'Orders',
    singular: 'order',
    description: 'Track purchases and update payment status.',
    searchFields: ['customerName', 'customerEmail', 'itemName'],
    statusField: 'status',
    statusOptions: orderStatuses,
    defaults: { customerName: '', customerEmail: '', itemType: 'course', itemName: '', amount: 0, status: 'pending' },
    fields: [
      { name: 'customerName', label: 'Customer name', type: 'text', required: true, half: true },
      { name: 'customerEmail', label: 'Customer email', type: 'email', required: true, half: true },
      { name: 'itemType', label: 'Item type', type: 'select', options: orderItemTypes, half: true },
      { name: 'amount', label: 'Amount ($)', type: 'number', step: '0.01', min: 0, required: true, half: true },
      { name: 'itemName', label: 'Item purchased', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'select', options: orderStatuses },
    ],
    columns: [
      { label: 'Order', render: (row) => <b>#{String(row.id).padStart(4, '0')}</b> },
      { label: 'Customer', render: (row) => <span className="admin-course-cell"><span><b>{row.customerName}</b><small>{row.customerEmail}</small></span></span> },
      { label: 'Item', render: (row) => <span className="admin-course-cell"><span><b className="admin-clamp">{row.itemName}</b><small>{label(String(row.itemType))}</small></span></span> },
      { label: 'Amount', render: (row) => <b>{money(row.amount)}</b> },
      { label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
      { label: 'Date', render: (row) => <span className="admin-updated">{formatDate(row.createdAt)}</span> },
    ],
  },
  reviews: {
    title: 'Reviews',
    singular: 'review',
    description: 'Moderate learner reviews shown on course pages.',
    searchFields: ['reviewerName', 'comment', 'courseId'],
    statusField: 'status',
    statusOptions: reviewStatuses,
    defaults: { courseId: '', reviewerName: '', rating: 5, comment: '', status: 'approved' },
    fields: [
      { name: 'courseId', label: 'Course', type: 'select', optionsKey: 'courses', required: true },
      { name: 'reviewerName', label: 'Reviewer name', type: 'text', required: true, half: true },
      { name: 'rating', label: 'Rating (1–5)', type: 'number', step: '1', min: 1, max: 5, required: true, half: true },
      { name: 'comment', label: 'Comment', type: 'textarea', required: true },
      { name: 'status', label: 'Status', type: 'select', options: reviewStatuses },
    ],
    columns: [
      { label: 'Reviewer', render: (row) => <span className="admin-instructor"><span>{initials(String(row.reviewerName))}</span>{row.reviewerName}</span> },
      { label: 'Course', render: (row, { options }) => <span className="admin-clamp">{findLabel(options.courses, row.courseId)}</span> },
      { label: 'Rating', render: (row) => <Stars value={row.rating} /> },
      { label: 'Comment', render: (row) => <span className="admin-clamp">{row.comment}</span> },
      { label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    ],
  },
  testimonials: {
    title: 'Testimonials',
    singular: 'testimonial',
    description: 'Curate the success stories featured on the homepage.',
    searchFields: ['name', 'role', 'quote'],
    defaults: { name: '', role: '', quote: '', rating: 5, featured: true, sortOrder: 0 },
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, half: true },
      { name: 'role', label: 'Role / title', type: 'text', half: true },
      { name: 'quote', label: 'Quote', type: 'textarea', required: true },
      { name: 'rating', label: 'Rating (1–5)', type: 'number', step: '1', min: 1, max: 5, required: true, half: true },
      { name: 'sortOrder', label: 'Display order', type: 'number', step: '1', min: 0, required: true, half: true },
      { name: 'featured', label: 'Show on homepage', type: 'checkbox' },
    ],
    columns: [
      { label: 'Person', render: (row) => <span className="admin-instructor"><span>{initials(String(row.name))}</span><span><b>{row.name}</b><small className="admin-muted"> {row.role}</small></span></span> },
      { label: 'Quote', render: (row) => <span className="admin-clamp">“{row.quote}”</span> },
      { label: 'Rating', render: (row) => <Stars value={row.rating} /> },
      { label: 'Status', render: (row) => <StatusBadge value={row.featured ? 'published' : 'draft'} /> },
    ],
  },
}
