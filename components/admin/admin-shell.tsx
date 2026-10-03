'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, ExternalLink, Menu } from 'lucide-react'
import AdminSidebar from '@/components/admin/admin-sidebar'
import { findNavItem } from '@/components/admin/nav-items'

export default function AdminShell({ children, className }: { children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const current = findNavItem(pathname)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className={`admin-shell ${className ?? ''}`}>
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      {open && <div className="admin-scrim" aria-hidden="true" onClick={() => setOpen(false)} />}

      <div className="admin-main">
        <header className="admin-topbar">
          <button type="button" className="admin-menu-button" aria-label="Open navigation" aria-controls="admin-sidebar" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={18} />
          </button>
          <nav aria-label="Breadcrumb" className="admin-breadcrumb">
            <Link href="/admin">Admin</Link>
            {current.href !== '/admin' && (
              <>
                <ChevronRight size={14} aria-hidden="true" />
                <span aria-current="page">{current.label}</span>
              </>
            )}
          </nav>
          <div className="admin-topbar-right">
            <span className="admin-date" suppressHydrationWarning>{today}</span>
            <Link href="/" className="admin-ghost">
              <ExternalLink size={15} aria-hidden="true" />
              <span>View site</span>
            </Link>
            <span className="admin-avatar small" aria-label="Signed in as Admin">AD</span>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}
