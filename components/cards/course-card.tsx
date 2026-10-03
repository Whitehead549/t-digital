'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/lib/data/courses'
import { toSlug } from '@/lib/data/categories'

type CourseCardProps = {
  course: Course
  onAddToCart: () => void
}

export default function CourseCard({ course, onAddToCart }: CourseCardProps) {
  const [expanded, setExpanded] = useState(false)
  const hasOverflow = course.title.length > 58
  const courseHref = `/categories/${toSlug(course.category)}/${course.id}`

  return (
    <article className="course-card">
      <Link href={courseHref} className={`course-image ${course.tone}`} style={{ backgroundImage: `url(${course.image})`, display: 'block' }} aria-label={`View ${course.title}`}>
        <div className="image-shade" />
        <span className="rating">✿ {course.rating}</span>
        <span className="favorite">☆</span>
        <span className="play" aria-hidden="true">▶</span>
      </Link>
      <div className="card-content">
        <h3 className={expanded ? 'expanded' : ''}><Link href={courseHref}>{course.title}</Link></h3>
        {hasOverflow && (
          <button className="read-more" type="button" onClick={() => setExpanded((value) => !value)}>
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
        <div className="meta"><span className="category">▣ &nbsp;{course.category}</span><span>♧ {course.students}</span></div>
        <div className="card-footer">
          <div className="author"><span>•</span><u>{course.author}</u></div>
          <div className="price"><del>{course.oldPrice}</del><strong>{course.price}</strong></div>
        </div>
        <button className="cart-button" type="button" onClick={onAddToCart}>Add to cart</button>
      </div>
    </article>
  )
}
