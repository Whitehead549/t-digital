import LessonPlayer from '@/components/course/lesson-player'
import { getCourse } from '@/lib/data/courses'
import { getLessons } from '@/lib/data/lessons'

type Props = { params: Promise<{ categoryId: string; courseId: string }> }

export default async function LearnPage({ params }: Props) {
  const { categoryId, courseId } = await params
  const course = getCourse(courseId)
  const lessons = getLessons(courseId)

  if (!course || lessons.length === 0) {
    return <main className="route-page"><p className="eyebrow">LEARNING</p><h1>Course not found</h1><p>This learning path is not available.</p></main>
  }

  return <LessonPlayer lessons={lessons} courseTitle={course.title} author={course.author} categoryId={categoryId} />
}

export async function generateMetadata({ params }: Props) {
  const { courseId } = await params
  const course = getCourse(courseId)
  return { title: course ? `Learning · ${course.title} — TORVAN` : 'Learning — TORVAN' }
}
