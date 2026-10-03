import type { Metadata } from 'next'
import AuthShowcase from '@/components/auth/auth-showcase'
import AuthCard from '@/components/auth/auth-card'

export const metadata: Metadata = {
  title: 'Login — TORVAN Digital',
  description: 'Sign in or create an account to continue learning on TORVAN Digital.',
}

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-[var(--bg-soft)] px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-stretch">
        <AuthShowcase />
        <AuthCard />
      </div>
    </main>
  )
}
