import { Award, CheckCircle2, PlayCircle, Sparkles } from 'lucide-react'
import { recentActivity, type ActivityType } from '@/lib/data/dashboard'

const icons: Record<ActivityType, typeof Award> = {
  completed: CheckCircle2,
  certificate: Award,
  continued: PlayCircle,
  started: Sparkles,
}

export default function ActivityFeed() {
  return (
    <section className="sd-card sd-activity" id="activity" aria-labelledby="activity-title">
      <div className="sd-card-head">
        <div>
          <p className="sd-eyebrow">Timeline</p>
          <h2 id="activity-title">Recent Learning Activity</h2>
        </div>
      </div>
      <ol className="sd-timeline">
        {recentActivity.map((item) => {
          const Icon = icons[item.type]
          return (
            <li key={item.id}>
              <span className={`sd-timeline-icon is-${item.type}`}><Icon size={15} aria-hidden="true" /></span>
              <div className="sd-timeline-body">
                <p>{item.action} <strong>{`"${item.subject}"`}</strong></p>
                <span>{item.course}</span>
              </div>
              <time>{item.time}</time>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
