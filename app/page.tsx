'use client'

import { useMemo, useState } from 'react'
import CourseCard from '@/Card/CourseCard'
import { categories, navigation, siteContent } from '@/lib/data/categories'
import { searchCourses } from '@/lib/data/courses'
import {
  footerColumns,
  footerTagline,
  heroStats,
  premium,
  promoBanner,
  whyLearnFeatures,
} from '@/lib/data/homepage'

const heroStatIcons = ['●', '◆', '▲', '★']

export default function Page() {
  const [query, setQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [showPromo, setShowPromo] = useState(true)
  const filteredCourses = useMemo(() => searchCourses(query), [query])
  const initial = siteContent.brand.charAt(0).toUpperCase()

  return (
    <main className="site-shell">

      <section className="hero" id="top">
        <div className="hero-inner">
          <span className="hero-glow" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow">{siteContent.heroEyebrow}</p>
            <h1>{siteContent.heroTitle}</h1>
            <p className="subcopy">{siteContent.heroDescription}</p>
            <form className="hero-search" role="search" onSubmit={(event) => event.preventDefault()}>
              <span className="hero-search-icon" aria-hidden="true">⌕</span>
              <input
                aria-label={navigation.searchPlaceholder}
                placeholder={navigation.searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button type="submit">Search</button>
            </form>
            <dl className="hero-stats">
              {heroStats.map((stat, index) => (
                <div className="hero-stat" key={stat.label}>
                  <span className="hero-stat-icon" aria-hidden="true">{heroStatIcons[index % heroStatIcons.length]}</span>
                  <div className="hero-stat-text">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                </div>
              ))}
            </dl>
          </div>
          <div className="hero-media">
            <span className="hero-play hero-play-a" aria-hidden="true">▷</span>
            <span className="hero-play hero-play-b" aria-hidden="true">▷</span>
            <img src="/images/hero-learner.png" alt="A learner smiling while studying on a laptop" />
            <span className="hero-script" aria-hidden="true">
              <em>Learn</em>
              <em>Grow</em>
              <em>Succeed</em>
            </span>
          </div>
        </div>
      </section>

      {showPromo && (
        <div className="promo">
          <div className="promo-inner" role="status">
            <span className="tag">{promoBanner.tag}</span>
            <span>{promoBanner.text}</span>
            <a href="/categories">{promoBanner.linkLabel} →</a>
            <button className="promo-close" type="button" aria-label="Dismiss offer" onClick={() => setShowPromo(false)}>×</button>
          </div>
        </div>
      )}

      <section className="section" id="courses">
        <div className="section-head">
          <div>
            <p className="eyebrow" style={{ color: 'var(--brand)' }}>{siteContent.featuredEyebrow}</p>
            <h2>{siteContent.featuredTitle}</h2>
          </div>
          <a href="/categories">View all →</a>
        </div>
        <div className="course-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onAddToCart={() => setCartCount((count) => count + 1)} />
            ))
          ) : (
            <p className="course-empty">No courses match “{query}”. Try another search.</p>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="categories-title">
        <div className="section-head">
          <h2 id="categories-title">Popular Categories</h2>
          <a href="/categories">Browse all →</a>
        </div>
        <div className="category-strip">
          {categories.map((category) => (
            <a className="category-tile" href={`/categories/${category.id}`} key={category.id}>
              <span className="category-icon" aria-hidden="true">{category.name.charAt(0)}</span>
              <strong>{category.name}</strong>
              <span>{category.description}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="premium" aria-labelledby="premium-title">
        <div className="premium-inner">
          <div className="premium-copy">
            <p className="eyebrow">{premium.eyebrow}</p>
            <h2 id="premium-title">{premium.title}</h2>
            <p>{premium.description}</p>
            <ul className="premium-perks">
              {premium.perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
          </div>
          <button className="premium-cta" type="button">{premium.ctaLabel}</button>
        </div>
      </section>

      <section className="why" aria-labelledby="why-title">
        <div className="why-inner">
          <h2 id="why-title">Why Learn With {siteContent.brand}?</h2>
          <div className="why-grid">
            {whyLearnFeatures.map((feature) => (
              <article className="why-card" key={feature.title}>
                <span className="why-icon" aria-hidden="true">{feature.title.charAt(0)}</span>
                <strong>{feature.title}</strong>
                <span>{feature.description}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <a className="brand" href="/" aria-label={`${siteContent.brand} home`}>
              <span className="brand-mark">{initial}</span>
              <span>{siteContent.brand}</span>
            </a>
            <p>{footerTagline}</p>
          </div>
          {footerColumns.map((column) => (
            <div className="footer-col" key={column.title}>
              <h4>{column.title}</h4>
              {column.links.map((link) => (
                <a href="/" key={link}>{link}</a>
              ))}
            </div>
          ))}
          <div className="footer-col">
            <h4>Newsletter</h4>
            <form className="newsletter" onSubmit={(event) => event.preventDefault()}>
              <input type="email" aria-label="Email address" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} {siteContent.brand}. All rights reserved.</div>
      </footer>

      {cartCount > 0 && <div className="cart-pill" aria-live="polite">Cart ({cartCount})</div>}
    </main>
  )
}
