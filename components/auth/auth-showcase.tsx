import Image from 'next/image'
import { Check } from 'lucide-react'

const highlights = ['Access thousands of courses', 'Get certified', 'Grow your career']

export default function AuthShowcase() {
  return (
    <section
      aria-label="About TORVAN Digital"
      className="relative flex min-h-[420px] flex-1 overflow-hidden rounded-2xl bg-[var(--brand-deep)] text-white lg:min-h-[560px]"
    >
      <Image
        src="/images/login-learner.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover object-right"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />

      <div className="relative flex flex-1 flex-col justify-between gap-10 p-8 md:p-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-11 items-center justify-center rounded-lg bg-[var(--brand)] text-2xl font-black"
              >
                T
              </span>
              <span className="text-2xl font-extrabold tracking-tight md:text-3xl">TORVAN DIGITAL</span>
            </div>
            <p className="text-sm text-white/75 md:text-base">Learn today, Lead tomorrow.</p>
          </div>

          <ul className="flex flex-col gap-4">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm font-medium md:text-base">
                <Check aria-hidden="true" size={18} strokeWidth={3} className="text-[var(--brand)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/60">
          {`© ${new Date().getFullYear()} TORVAN Digital. All rights reserved.`}
        </p>
      </div>
    </section>
  )
}
