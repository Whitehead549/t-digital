import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/lib/data/categories'

type CategoryCardProps = {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="category-card">
      <Link className={`category-card-visual category-visual-${category.id}`} href={`/categories/${category.id}`} aria-label={`Explore ${category.name}`}>
        <Image className="category-card-image" src={category.image} alt="" fill sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 25vw" />
        <span className="category-card-pattern" aria-hidden="true" />
      </Link>
      <div className="category-card-body">
        <h2><Link href={`/categories/${category.id}`}>{category.name}</Link></h2>
        <p className="category-card-description">{category.description}</p>
        <div className="category-card-footer">
          <span>{category.courseCount} courses</span>
          <Link className="category-card-button" href={`/categories/${category.id}`}>View Courses</Link>
        </div>
      </div>
    </article>
  )
}
