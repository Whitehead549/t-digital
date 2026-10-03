'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Award, BookOpen, ChartPie, Compass, Crown, House, LayoutDashboard, Menu, X } from 'lucide-react'
import NotificationsMenu from '@/components/dashboard/notifications-menu'
import ProfileMenu from '@/components/dashboard/profile-menu'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
  { label: 'Progress', href: '/dashboard#progress', icon: ChartPie },
  { label: 'Certificates', href: '/dashboard/certificates', icon: Award },
]

const siteLinks = [
  { label: 'Browse courses', href: '/courses', icon: Compass },
  { label: 'Back to website', href: '/', icon: House },
]

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  const [activeHash, setActiveHash] = useState('/dashboard')
  useBodyScrollLock(drawerOpen)

  const active = pathname === '/dashboard' ? activeHash : pathname

  const handleNav = (href: string) => {
    setActiveHash(href)
    setDrawerOpen(false)
  }

  return (
    <div className="sd-shell">
      <aside className={`sd-sidebar ${drawerOpen ? 'is-open' : ''}`} aria-label="Dashboard navigation">
        <div className="sd-sidebar-head">
          <a className="sd-brand" href="/" aria-label="TORVAN home">
            <span>TORVAN</span>
            <span className="sd-brand-dot" aria-hidden="true">.</span>
          </a>
          <button type="button" className="sd-drawer-close" aria-label="Close navigation" onClick={() => setDrawerOpen(false)}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="sd-nav-label">Learning</p>
        <nav className="sd-nav">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} aria-current={active === href ? 'page' : undefined} onClick={() => handleNav(href)}>
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        <p className="sd-nav-label">Explore</p>
        <nav className="sd-nav" aria-label="Site">
          {siteLinks.map(({ label, href, icon: Icon }) => (
            <a key={href} href={href}>
              <Icon size={17} aria-hidden="true" />
              {label}
            </a>
          ))}
        </nav>

        <div className="sd-upgrade">
          <span className="sd-upgrade-icon"><Crown size={16} aria-hidden="true" /></span>
          <strong>Go Premium</strong>
          <p>Unlock every course, offline lessons and priority support.</p>
          <a href="/premium">Upgrade plan</a>
        </div>
      </aside>

      {drawerOpen && <button type="button" className="sd-scrim" aria-label="Close navigation" onClick={() => setDrawerOpen(false)} />}

      <div className="sd-main">
        <header className="sd-topbar">
          <button type="button" className="sd-icon-btn sd-menu-btn" aria-label="Open navigation" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}>
            <Menu size={19} aria-hidden="true" />
          </button>
          <a className="sd-brand sd-topbar-brand" href="/" aria-label="TORVAN home">
            <span>TORVAN</span>
            <span className="sd-brand-dot" aria-hidden="true">.</span>
          </a>
          <div className="sd-topbar-title">
            <span>Student</span>
            <strong>Dashboard</strong>
          </div>
          <div className="sd-topbar-actions">
            <a href="/courses" className="sd-ghost-btn">
              <Compass size={16} aria-hidden="true" />
              <span>Browse courses</span>
            </a>
            <NotificationsMenu />
            <ProfileMenu />
          </div>
        </header>
        <main className="sd-content" id="overview">{children}</main>
      </div>
    </div>
  )
}
