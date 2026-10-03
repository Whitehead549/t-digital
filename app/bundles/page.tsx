'use client'

import Link from 'next/link'
import CourseCard from '@/Card/CourseCard'
import { courses } from '@/lib/data/courses'

const bundles = [
  { name: 'Digital Career Starter', description: 'Everything you need to move from curious beginner to confident digital professional.', courses: courses.slice(0, 4), price: '$39', oldPrice: '$108', savings: 'Save 64%' },
  { name: 'Build & Ship Online', description: 'A practical path through design, development, and the tools that bring ideas to life.', courses: courses.slice(4, 8), price: '$49', oldPrice: '$174', savings: 'Save 72%' },
  { name: 'AI-Powered Creator', description: 'Create faster, market smarter, and turn your creative skills into momentum.', courses: courses.slice(8, 12), price: '$42', oldPrice: '$191', savings: 'Save 78%' },
]

export default function BundlesPage() {
  return (
    <main className="bundles-page">
      <section className="bundles-hero">
        <div>
          <p className="eyebrow">CURATED LEARNING PATHS</p>
          <h1>More skills. <em>One smart bundle.</em></h1>
          <p>Build momentum with expert-led courses grouped around the outcomes you care about. Pay once and keep learning.</p>
        </div>
        <div className="bundle-hero-stamp"><strong>3–5</strong><span>courses per path</span></div>
      </section>
      <section className="bundle-list" aria-labelledby="bundle-list-title">
        <div className="section-head"><div><p className="eyebrow">CHOOSE YOUR PATH</p><h2 id="bundle-list-title">Bundled courses for real progress</h2></div><span className="bundle-count">{bundles.length} learning paths</span></div>
        {bundles.map((bundle) => (
          <article className="bundle-card" key={bundle.name}>
            <div className="bundle-card-top"><div><span className="bundle-label">BUNDLE</span><h3>{bundle.name}</h3><p>{bundle.description}</p></div><div className="bundle-price"><del>{bundle.oldPrice}</del><strong>{bundle.price}</strong><span>{bundle.savings}</span><button type="button">Get this bundle</button></div></div>
            <div className="bundle-courses">{bundle.courses.map((course) => <CourseCard key={course.id} course={course} onAddToCart={() => undefined} />)}</div>
          </article>
        ))}
      </section>
      <section className="bundle-callout"><p className="eyebrow">NOT SURE WHERE TO START?</p><h2>Explore every course and make your own path.</h2><Link href="/courses">Browse all courses <span aria-hidden="true">→</span></Link></section>
    </main>
  )
}


