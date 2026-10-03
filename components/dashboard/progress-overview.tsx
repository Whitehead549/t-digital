import { BookOpen, CheckCircle2, Clock3, ListChecks } from 'lucide-react'

type Props = { overall: number; inProgress: number; completed: number; lessonsCompleted: number; hours: number }

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ProgressOverview({ overall, inProgress, completed, lessonsCompleted, hours }: Props) {
  const offset = CIRCUMFERENCE * (1 - overall / 100)
  const rows = [
    { label: 'Courses in progress', value: inProgress, icon: BookOpen },
    { label: 'Courses completed', value: completed, icon: CheckCircle2 },
    { label: 'Lessons completed', value: lessonsCompleted, icon: ListChecks },
    { label: 'Total learning time', value: `${hours}h`, icon: Clock3 },
  ]

  return (
    <section className="sd-card sd-progress-card" id="progress" aria-labelledby="progress-title">
      <div className="sd-card-head">
        <div>
          <p className="sd-eyebrow">Your progress</p>
          <h2 id="progress-title">Overall Learning Progress</h2>
        </div>
      </div>

      <div className="sd-ring-wrap">
        <svg viewBox="0 0 128 128" className="sd-ring" role="img" aria-label={`Overall progress ${overall} percent`}>
          <defs>
            <linearGradient id="sd-ring-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff3346" />
              <stop offset="100%" stopColor="#9e0016" />
            </linearGradient>
          </defs>
          <circle cx="64" cy="64" r={RADIUS} className="sd-ring-track" />
          <circle cx="64" cy="64" r={RADIUS} className="sd-ring-value" stroke="url(#sd-ring-gradient)" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset} />
        </svg>
        <div className="sd-ring-label" aria-hidden="true">
          <strong>{overall}%</strong>
          <span>complete</span>
        </div>
      </div>
      <p className="sd-ring-note">{overall >= 70 ? 'Fantastic pace — the finish line is in sight.' : 'Great momentum — keep your streak going this week.'}</p>

      <ul className="sd-progress-rows">
        {rows.map(({ label, value, icon: Icon }) => (
          <li key={label}>
            <span className="sd-row-icon"><Icon size={15} aria-hidden="true" /></span>
            <span>{label}</span>
            <strong>{value}</strong>
          </li>
        ))}
      </ul>
    </section>
  )
}
