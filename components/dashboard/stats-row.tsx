import { Award, BookOpen, GraduationCap, TrendingUp } from 'lucide-react'

type Props = { inProgress: number; completed: number; overall: number; certificates: number }

export default function StatsRow({ inProgress, completed, overall, certificates }: Props) {
  const stats = [
    { label: 'Courses in Progress', value: inProgress, note: '1 lesson due this week', icon: BookOpen },
    { label: 'Completed Courses', value: completed, note: '+2 this month', icon: GraduationCap },
    { label: 'Overall Progress', value: `${overall}%`, note: '+8% since last week', icon: TrendingUp },
    { label: 'Certificates Earned', value: certificates, note: 'All verified', icon: Award },
  ]

  return (
    <section className="sd-stats" id="progress" aria-label="Learning statistics">
      {stats.map(({ label, value, note, icon: Icon }) => (
        <article key={label} className="sd-card sd-stat">
          <span className="sd-stat-icon"><Icon size={18} aria-hidden="true" /></span>
          <div>
            <strong>{value}</strong>
            <span>{label}</span>
            <small>{note}</small>
          </div>
        </article>
      ))}
    </section>
  )
}
