import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import AdminSidebar from '@/components/admin/admin-sidebar'

export const metadata: Metadata = { title: 'Admin — TORVAN', robots: { index: false, follow: false } }

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="admin-shell">
      <AdminSidebar />
      <section className="admin-main">
        <header className="admin-topbar">
          <div><p className="admin-overline">Site management</p><h1>Welcome back, Admin</h1></div>
          <div className="admin-profile"><span className="admin-avatar">AD</span><span><b>Admin</b><small>Super admin</small></span></div>
        </header>
        <div className="admin-content">{children}</div>
      </section>
    </main>
  )
}
