'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, X } from 'lucide-react'
import { adminNavGroups } from '@/lib/admin/navigation'

type Props = { open: boolean; onClose: () => void }

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname()

  return (
    <aside className={`admin-sidebar${open ? ' open' : ''}`} id="admin-sidebar">
      <div className="admin-sidebar-head">
        <Link href="/admin" className="admin-brand" onClick={onClose}>
          <span className="admin-brand-mark" aria-hidden="true">T</span>
          <span className="admin-brand-text">
            TORVAN<b>Admin console</b>
          </span>
        </Link>
        <button type="button" className="admin-sidebar-close" aria-label="Close navigation" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <nav aria-label="Admin navigation" className="admin-nav-scroll">
        {adminNavGroups.map((group) => (
          <div className="admin-nav-group" key={group.label}>
            <p className="admin-sidebar-label">{group.label}</p>
            <ul className="admin-nav">
              {group.items.map(({ label, href, icon: Icon }) => {
                const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
                return (
                  <li key={href}>
                    <Link className={active ? 'active' : undefined} href={href} aria-current={active ? 'page' : undefined} onClick={onClose}>
                      <Icon size={17} aria-hidden="true" />
                      <span>{label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-bottom">
        <Link href="/" className="admin-site-link">
          <span>
            <b>Visit storefront</b>
            <small>See changes live</small>
          </span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <div className="admin-user">
          <span className="admin-avatar" aria-hidden="true">AD</span>
          <span>
            <b>Admin</b>
            <small>Super admin</small>
          </span>
        </div>
      </div>
    </aside>
  )
}
