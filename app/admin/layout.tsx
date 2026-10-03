import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import AdminShell from '@/components/admin/admin-shell'
import './admin.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = { title: 'Admin — TORVAN', robots: { index: false, follow: false } }

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell className={inter.className}>{children}</AdminShell>
}
