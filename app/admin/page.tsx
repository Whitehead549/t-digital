import Link from 'next/link'
import { Archive, ArrowRight, BookOpen, CircleCheck, Clock, FileClock, FolderTree, MessageSquareQuote, Plus, ShoppingBag, Star, Users, Wallet } from 'lucide-react'
import { getOverview } from '@/lib/admin/data'
import { formatMoney } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function AdminOverviewPage() {
  const stats = await getOverview()
  const draftCourses = stats.totalCourses - stats.publishedCourses
  const publishRate = stats.totalCourses ? Math.round((stats.publishedCourses / stats.totalCourses) * 100) : 0

  const kpis = [
    { label: 'Total courses', value: stats.totalCourses.toLocaleString(), note: `${draftCourses} in draft`, icon: BookOpen, tone: 'red' },
    { label: 'Published', value: stats.publishedCourses.toLocaleString(), note: `${publishRate}% of catalog live`, icon: CircleCheck, tone: 'green' },
    { label: 'Enrolled students', value: stats.students.toLocaleString(), note: 'Across all courses', icon: Users, tone: 'blue' },
    { label: 'Paid revenue', value: formatMoney(stats.revenue), note: `${stats.paidOrders} paid orders`, icon: Wallet, tone: 'amber' },
  ]

  const attention = [
    { label: 'Reviews awaiting moderation', count: stats.pendingReviews, href: '/admin/reviews', icon: Star },
    { label: 'Orders pending payment', count: stats.pendingOrders, href: '/admin/orders', icon: ShoppingBag },
    { label: 'Courses still in draft', count: draftCourses, href: '/admin/courses', icon: FileClock },
  ]

  const shortcuts = [
    { label: 'Courses', href: '/admin/courses', icon: BookOpen, detail: `${stats.publishedCourses} published` },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree, detail: `${stats.categories} categories` },
    { label: 'Bundles', href: '/admin/bundles', icon: Archive, detail: `${stats.bundles} bundles` },
    { label: 'Reviews', href: '/admin/reviews', icon: Star, detail: `${stats.pendingReviews} awaiting moderation` },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote, detail: `${stats.testimonials} stories` },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, detail: `${stats.pendingOrders} pending` },
  ]

  return (
    <div className="admin-stack">
      <section className="admin-hero" aria-labelledby="overview-title">
        <div>
          <p className="admin-overline light">Dashboard</p>
          <h1 id="overview-title">Welcome back, Admin</h1>
          <p>
            You have <b>{stats.pendingOrders}</b> pending {stats.pendingOrders === 1 ? 'order' : 'orders'} and <b>{stats.pendingReviews}</b>{' '}
            {stats.pendingReviews === 1 ? 'review' : 'reviews'} waiting for you today.
          </p>
        </div>
        <div className="admin-hero-actions">
          <Link className="admin-primary inverse" href="/admin/courses"><Plus size={16} aria-hidden="true" /> Manage courses</Link>
          <Link className="admin-hero-link" href="/admin/reviews">Open review queue <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="admin-stat-grid" aria-label="Key metrics">
        {kpis.map(({ label, value, note, icon: Icon, tone }) => (
          <article className="admin-stat" key={label}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">{label}</span>
              <span className={`admin-stat-icon ${tone}`}><Icon size={17} aria-hidden="true" /></span>
            </div>
            <b className="admin-stat-value">{value}</b>
            <small className="admin-stat-note">{note}</small>
          </article>
        ))}
      </section>

      <div className="admin-overview-grid">
        <section className="admin-table-card" aria-labelledby="recent-orders">
          <div className="admin-table-heading">
            <div>
              <h2 id="recent-orders">Recent orders</h2>
              <span>Latest 5 purchases</span>
            </div>
            <Link className="admin-ghost" href="/admin/orders">View all <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
          <div className="admin-table-wrap">
            <table>
              <thead><tr><th>Order</th><th>Customer</th><th>Item</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td><span className="admin-mono">#{String(order.id).padStart(4, '0')}</span></td>
                    <td><b>{order.customerName}</b></td>
                    <td><span className="admin-clamp">{order.itemName}</span></td>
                    <td><b>{formatMoney(order.amount)}</b></td>
                    <td><span className={`admin-status ${order.status}`}><i />{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                    <td><span className="admin-updated"><Clock size={12} aria-hidden="true" /> {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && <tr><td className="admin-empty" colSpan={6}>No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <div className="admin-side-stack">
          <section className="admin-panel" aria-labelledby="attention-title">
            <h2 id="attention-title">Needs attention</h2>
            <ul className="admin-attention">
              {attention.map(({ label, count, href, icon: Icon }) => (
                <li key={label}>
                  <Link href={href}>
                    <span className="admin-attention-icon"><Icon size={16} aria-hidden="true" /></span>
                    <span className="admin-attention-label">{label}</span>
                    <span className={`admin-count${count > 0 ? ' hot' : ''}`}>{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="admin-panel" aria-labelledby="breakdown-title">
            <div className="admin-panel-head">
              <h2 id="breakdown-title">Orders by status</h2>
              <span>{stats.totalOrders} total</span>
            </div>
            <ul className="admin-breakdown">
              {stats.orderBreakdown.map(({ status, count }) => {
                const pct = stats.totalOrders ? Math.round((count / stats.totalOrders) * 100) : 0
                return (
                  <li key={status}>
                    <div><span className="admin-breakdown-label">{status.charAt(0).toUpperCase() + status.slice(1)}</span><span>{count} · {pct}%</span></div>
                    <span className="admin-bar" role="presentation"><i className={status} style={{ width: `${pct}%` }} /></span>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
      </div>

      <section aria-labelledby="shortcuts-title">
        <div className="admin-section-head">
          <h2 id="shortcuts-title">Manage content</h2>
          <span>Jump straight into any area of your site</span>
        </div>
        <div className="admin-shortcuts">
          {shortcuts.map(({ label, href, icon: Icon, detail }) => (
            <Link href={href} key={href} className="admin-shortcut">
              <span className="admin-shortcut-icon"><Icon size={18} aria-hidden="true" /></span>
              <span className="admin-shortcut-text"><b>{label}</b><small>{detail}</small></span>
              <ArrowRight className="admin-shortcut-arrow" size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
