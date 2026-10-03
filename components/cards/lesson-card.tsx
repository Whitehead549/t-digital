type LessonCardProps = { number: number; title: string }

export default function LessonCard({ number, title }: LessonCardProps) {
  return <article className="route-card"><span>Lesson {number}</span><h2>{title}</h2></article>
}
