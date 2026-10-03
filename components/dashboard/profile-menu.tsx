'use client'

import { useCallback, useRef, useState } from 'react'
import { ChevronDown, Compass, House, LogOut, Settings, UserRound } from 'lucide-react'
import { student } from '@/lib/data/dashboard'
import { useDismissable } from '@/hooks/use-dismissable'

const links = [
  { label: 'My profile', href: '#overview', icon: UserRound },
  { label: 'Account settings', href: '#overview', icon: Settings },
  { label: 'Browse courses', href: '/courses', icon: Compass },
  { label: 'Back to website', href: '/', icon: House },
]

export default function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useDismissable(wrapperRef, open, close)

  return (
    <div className="sd-popover-wrap" ref={wrapperRef}>
      <button
        type="button"
        className="sd-profile-btn"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sd-avatar" aria-hidden="true">{student.initials}</span>
        <span className="sd-profile-name">
          <strong>{student.fullName}</strong>
          <small>{student.plan}</small>
        </span>
        <ChevronDown size={15} aria-hidden="true" className="sd-profile-caret" />
      </button>

      {open && (
        <div className="sd-popover sd-profile-menu" role="menu">
          <div className="sd-profile-summary">
            <span className="sd-avatar is-lg" aria-hidden="true">{student.initials}</span>
            <div>
              <strong>{student.fullName}</strong>
              <span>{student.email}</span>
            </div>
          </div>
          <div className="sd-menu-links">
            {links.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} role="menuitem" onClick={close}>
                <Icon size={16} aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>
          <a href="/login" role="menuitem" className="sd-menu-signout">
            <LogOut size={16} aria-hidden="true" />
            Sign out
          </a>
        </div>
      )}
    </div>
  )
}
