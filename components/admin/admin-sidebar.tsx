'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Archive, BookOpen, ChevronLeft, Crown, FolderTree, LayoutDashboard, MessageSquareQuote, ShoppingBag, Star } from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Courses', href: '/admin/courses', icon: BookOpen },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Bundles', href: '/admin/bundles', icon: Archive },
  { label: 'Premium', href: '/admin/premium', icon: Crown },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand"><span className="admin-brand-mark">T</span><span>TORVAN <b>ADMIN</b></span></Link>
      <p className="admin-sidebar-label">Workspace</p>
      <nav aria-label="Admin navigation" className="admin-nav">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
          return (
            <Link className={active ? 'active' : ''} href={href} key={href} aria-current={active ? 'page' : undefined}>
              <Icon size={16} aria-hidden="true" /><span>{label}</span>{active && <i />}
            </Link>
          )
        })}
      </nav>
      <div className="admin-sidebar-bottom"><Link href="/"><ChevronLeft size={16} aria-hidden="true" /> Back to site</Link></div>
    </aside>
  )
}
