import Link from 'next/link'
import { Archive, BookOpen, Check, Clock, FolderTree, MessageSquareQuote, ShoppingBag, Star, Users } from 'lucide-react'
import { getOverview } from '@/lib/admin/data'
import { formatMoney } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function AdminOverviewPage() {
  const stats = await getOverview()
  const shortcuts = [
    { label: 'Courses', href: '/admin/courses', icon: BookOpen, detail: `${stats.publishedCourses} published` },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree, detail: `${stats.categories} categories` },
    { label: 'Bundles', href: '/admin/bundles', icon: Archive, detail: `${stats.bundles} bundles` },
    { label: 'Reviews', href: '/admin/reviews', icon: Star, detail: `${stats.pendingReviews} awaiting moderation` },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote, detail: `${stats.testimonials} stories` },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, detail: `${stats.pendingOrders} pending` },
  ]

  return (
    <>
      <div className="admin-page-title">
        <div><p className="admin-overline">Workspace / Overview</p><h2>Overview</h2><p>A snapshot of your catalog, sales, and community.</p></div>
        <Link className="admin-primary" href="/admin/courses">Manage courses</Link>
      </div>

      <div className="admin-stat-grid">
        <div><span className="admin-stat-icon red"><BookOpen size={16} /></span><span><b>{stats.totalCourses}</b><small>Total courses</small></span></div>
        <div><span className="admin-stat-icon green"><Check size={16} /></span><span><b>{stats.publishedCourses}</b><small>Published</small></span></div>
        <div><span className="admin-stat-icon blue"><Users size={16} /></span><span><b>{stats.students.toLocaleString()}</b><small>Enrolled students</small></span></div>
        <div><span className="admin-stat-icon gold"><ShoppingBag size={16} /></span><span><b>{formatMoney(stats.revenue)}</b><small>Paid revenue</small></span></div>
      </div>

      <div className="admin-shortcuts">
        {shortcuts.map(({ label, href, icon: Icon, detail }) => (
          <Link href={href} key={href} className="admin-shortcut"><span className="admin-stat-icon blue"><Icon size={16} /></span><span><b>{label}</b><small>{detail}</small></span></Link>
        ))}
      </div>

      <div className="admin-table-card">
        <div className="admin-table-heading"><div><h3>Recent orders</h3><span>Latest 5 purchases</span></div><Link className="admin-filter" href="/admin/orders">View all</Link></div>
        <div className="admin-table-wrap">
          <table>
            <thead><tr><th>Order</th><th>Customer</th><th>Item</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td><b>#{String(order.id).padStart(4, '0')}</b></td>
                  <td>{order.customerName}</td>
                  <td><span className="admin-clamp">{order.itemName}</span></td>
                  <td><b>{formatMoney(order.amount)}</b></td>
                  <td><span className={`admin-status ${order.status}`}><i />{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                  <td><span className="admin-updated"><Clock size={11} aria-hidden="true" /> {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && <tr><td className="admin-empty" colSpan={6}>No orders yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
