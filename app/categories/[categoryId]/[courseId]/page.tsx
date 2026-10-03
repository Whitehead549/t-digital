import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { courses, getCourse } from '@/lib/data/courses'
import { getCourseDetails } from '@/lib/data/course-details'
import CourseHero from '@/components/course/course-hero'
import CoursePreview from '@/components/course/course-preview'
import LearnList from '@/components/course/learn-list'
import CourseTabs from '@/components/course/course-tabs'
import CourseFaq from '@/components/course/course-faq'
import PurchaseCard from '@/components/course/purchase-card'
import RelatedCourses from '@/components/course/related-courses'

type Props = { params: Promise<{ categoryId: string; courseId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params
  const course = getCourse(courseId)
  return { title: course ? `${course.title} — TORVAN` : 'Course — TORVAN' }
}

export default async function CourseDetailsPage({ params }: Props) {
  const { categoryId, courseId } = await params
  const course = getCourse(courseId)
  if (!course) notFound()

  const details = getCourseDetails(course)
  const learnHref = `/categories/${categoryId}/${courseId}/learn`
  const related = courses.filter((c) => c.id !== course.id)

  return (
    <main className="bg-white">
      <CourseHero
        title={course.title}
        subtitle={details.subtitle}
        description={details.description}
        language={details.language}
        students={course.students}
      />

      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 pt-5 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <CoursePreview image={course.image} title={course.title} />
          <div className="lg:hidden">
            <PurchaseCard course={course} details={details} learnHref={learnHref} />
          </div>
          <LearnList outcomes={details.outcomes} />
          <CourseTabs modules={details.modules} description={details.longDescription} />
          <CourseFaq faqs={details.faqs} />
        </div>
        <div className="hidden w-[300px] shrink-0 lg:block">
          <PurchaseCard course={course} details={details} learnHref={learnHref} />
        </div>
      </div>

      <RelatedCourses courses={related} categoryId={categoryId} />

      <section className="bg-[var(--ink)] px-6 py-16 text-center">
        <h2 className="text-balance text-2xl font-semibold uppercase tracking-tight text-white md:text-3xl">Get our latest news &amp; updates</h2>
        <Link
          href="https://www.whatsapp.com/channel"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-sm bg-[var(--brand)] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--brand-dark)]"
        >
          Join our WhatsApp Channel
        </Link>
      </section>
    </main>
  )
}
