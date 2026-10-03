'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

type Mode = 'login' | 'register'

const inputClass =
  'h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] px-4 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:bg-white focus:ring-2 focus:ring-[var(--brand)]/15'

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-[var(--ink)]">
        {label}
      </label>
      {children}
    </div>
  )
}

function PasswordInput({ id, placeholder, autoComplete }: { id: string; placeholder: string; autoComplete: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        name="password"
        type={visible ? 'text' : 'password'}
        required
        minLength={8}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={cn(inputClass, 'pr-11')}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--muted)] transition hover:text-[var(--ink)]"
      >
        {visible ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
      </button>
    </div>
  )
}

export default function AuthCard() {
  const [mode, setMode] = useState<Mode>('login')
  const isLogin = mode === 'login'

  return (
    <section className="flex w-full flex-col rounded-2xl border border-[var(--line)] bg-white p-6 shadow-[0_20px_50px_-24px_rgba(74,0,9,.25)] md:p-8 lg:max-w-md">
      <div role="tablist" aria-label="Authentication" className="grid grid-cols-2 border-b border-[var(--line)]">
        {(['login', 'register'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            type="button"
            id={`tab-${tab}`}
            aria-selected={mode === tab}
            aria-controls="auth-panel"
            onClick={() => setMode(tab)}
            className={cn(
              '-mb-px border-b-2 pb-3 text-sm font-semibold capitalize transition',
              mode === tab
                ? 'border-[var(--brand)] text-[var(--brand)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div id="auth-panel" role="tabpanel" aria-labelledby={`tab-${mode}`} className="flex flex-1 flex-col gap-6 pt-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-[var(--ink)]">
            {isLogin ? 'Welcome Back!' : 'Create your account'}
          </h1>
          <p className="text-sm text-[var(--muted)]">
            {isLogin ? 'Sign in to continue to Torvan Digital' : 'Join Torvan Digital and start learning today'}
          </p>
        </header>

        <form key={mode} className="flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
          {!isLogin && (
            <Field id="name" label="Full Name">
              <input id="name" name="name" required autoComplete="name" placeholder="Enter your full name" className={inputClass} />
            </Field>
          )}

          <Field id="email" label={isLogin ? 'Email or Username' : 'Email'}>
            <input
              id="email"
              name="email"
              type={isLogin ? 'text' : 'email'}
              required
              autoComplete={isLogin ? 'username' : 'email'}
              placeholder={isLogin ? 'Enter your email or username' : 'Enter your email'}
              className={inputClass}
            />
          </Field>

          <Field id="password" label="Password">
            <PasswordInput
              id="password"
              placeholder={isLogin ? 'Enter your password' : 'Create a password'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </Field>

          {isLogin && (
            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--ink)]">
                <input type="checkbox" name="remember" defaultChecked className="size-4 accent-[var(--brand)]" />
                Remember me
              </label>
              <a href="#" className="text-sm font-semibold text-[var(--brand)] hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="h-11 rounded-lg bg-[var(--brand)] text-sm font-bold text-white transition hover:bg-[var(--brand-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--muted)]">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setMode(isLogin ? 'register' : 'login')}
            className="font-semibold text-[var(--brand)] hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </section>
  )
}
