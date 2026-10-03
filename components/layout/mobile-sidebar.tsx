'use client'

import { useEffect, useRef } from 'react'
import { ChevronRight, X } from 'lucide-react'
import { siteContent } from '@/lib/data/categories'
import { authLinks, isNavLinkActive, primaryNavLinks } from '@/lib/data/navigation'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'

type MobileSidebarProps = {
  id: string
  open: boolean
  pathname: string
  onClose: () => void
}

export default function MobileSidebar({ id, open, pathname, onClose }: MobileSidebarProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <div className="mobile-nav" data-state={open ? 'open' : 'closed'} inert={!open}>
      <div className="mobile-nav-overlay" aria-hidden="true" onClick={onClose} />
      <aside
        id={id}
        className="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="mobile-nav-head">
          <a className="brand" href="/" aria-label={`${siteContent.brand} home`} onClick={onClose}>
            <span>{siteContent.brand}</span>
            <span className="brand-dot" aria-hidden="true">.</span>
          </a>
          <button
            ref={closeButtonRef}
            className="mobile-nav-close"
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <nav className="mobile-nav-links" aria-label="Main navigation">
          <p className="mobile-nav-label">Menu</p>
          <ul>
            {primaryNavLinks.map((link) => {
              const isActive = isNavLinkActive(link, pathname)
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={isActive ? 'is-active' : undefined}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={onClose}
                  >
                    <span>{link.label}</span>
                    <ChevronRight aria-hidden="true" size={18} />
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="mobile-nav-actions">
          <a
            className="mobile-nav-register"
            href={authLinks.register.href}
            onClick={onClose}
            style={{ textDecoration: 'none', textAlign: 'center' }}
          >
            {authLinks.register.label}
          </a>
        </div>
      </aside>
    </div>
  )
}
