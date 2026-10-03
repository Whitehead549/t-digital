'use client'

import { useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { siteContent } from '@/lib/data/categories'
import { authLinks, isNavLinkActive, primaryNavLinks } from '@/lib/data/navigation'
import MobileSidebar from '@/components/layout/mobile-sidebar'

export default function SiteHeader() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const closeMenu = () => {
    setIsMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <>
      <header className="topbar">
        <a className="brand" href="/" aria-label={`${siteContent.brand} home`}>
          <span>{siteContent.brand}</span>
          <span className="brand-dot" aria-hidden="true">.</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          {primaryNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={isNavLinkActive(link, pathname) ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="topbar-actions">
          <a className="btn-register" href={authLinks.register.href} style={{ textDecoration: 'none' }}>
            {authLinks.register.label}
          </a>
        </div>
        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-sidebar"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu aria-hidden="true" size={22} />
        </button>
      </header>
      <MobileSidebar id="mobile-sidebar" open={isMenuOpen} pathname={pathname} onClose={closeMenu} />
    </>
  )
}
