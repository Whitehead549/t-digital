'use client'

import { useCallback, useRef, useState } from 'react'
import { Award, Bell, BookOpen, CheckCircle2, PlayCircle } from 'lucide-react'
import { initialNotifications, type NotificationType } from '@/lib/data/dashboard'
import { useDismissable } from '@/hooks/use-dismissable'

const icons: Record<NotificationType, typeof Bell> = {
  completed: CheckCircle2,
  certificate: Award,
  reminder: PlayCircle,
  course: BookOpen,
}

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(initialNotifications)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useDismissable(wrapperRef, open, close)

  const unread = items.filter((item) => !item.read).length

  const toggleRead = (id: string) => setItems((list) => list.map((item) => (item.id === id ? { ...item, read: !item.read } : item)))
  const markAllRead = () => setItems((list) => list.map((item) => ({ ...item, read: true })))

  return (
    <div className="sd-popover-wrap" ref={wrapperRef}>
      <button
        type="button"
        className="sd-icon-btn"
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        <Bell size={18} aria-hidden="true" />
        {unread > 0 && <span className="sd-badge">{unread}</span>}
      </button>

      {open && (
        <div className="sd-popover sd-notifications" role="dialog" aria-label="Notifications">
          <div className="sd-popover-head">
            <div>
              <strong>Notifications</strong>
              <span>{unread ? `${unread} unread` : 'You are all caught up'}</span>
            </div>
            <button type="button" className="sd-text-btn" onClick={markAllRead} disabled={unread === 0}>
              Mark all as read
            </button>
          </div>
          <ul className="sd-notification-list">
            {items.map((item) => {
              const Icon = icons[item.type]
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`sd-notification ${item.read ? '' : 'is-unread'}`}
                    onClick={() => toggleRead(item.id)}
                    aria-label={`${item.title}, ${item.time}. ${item.read ? 'Mark as unread' : 'Mark as read'}`}
                  >
                    <span className={`sd-notification-icon is-${item.type}`}>
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <span className="sd-notification-body">
                      <span>{item.title}</span>
                      <small>{item.time}</small>
                    </span>
                    {!item.read && <span className="sd-unread-dot" aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
