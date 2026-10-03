import { ArrowRight, Check, Clock3, History, Play, UserRound } from 'lucide-react'
import { currentCourse } from '@/lib/data/dashboard'

type Props = { completedLessons: number; progress: number; onMarkComplete: () => void }

export default function ContinueLearning({ completedLessons, progress, onMarkComplete }: Props) {
  const { totalLessons } = currentCourse
  const isFinished = completedLessons >= totalLessons
  const lessonNumber = Math.min(totalLessons, currentCourse.lessonNumber + (completedLessons - currentCourse.completedLessons))
  const lessonTitle = lessonNumber === currentCourse.lessonNumber ? currentCourse.lessonTitle : currentCourse.nextLessonTitle

  return (
    <section className="sd-card sd-continue" aria-labelledby="continue-title">
      <a href={currentCourse.learnHref} className="sd-continue-media" aria-label={`Resume ${currentCourse.title}`}>
        <img src={currentCourse.image || '/placeholder.svg'} alt="" crossOrigin="anonymous" />
        <span className="sd-continue-shade" aria-hidden="true" />
        <span className="sd-continue-play" aria-hidden="true"><Play size={22} fill="currentColor" /></span>
        <span className="sd-continue-chip">{currentCourse.category}</span>
        <span className="sd-continue-resume"><History size={13} aria-hidden="true" /> Resume at 14:08</span>
      </a>

      <div className="sd-continue-body">
        <p className="sd-eyebrow">Continue learning</p>
        <h2 id="continue-title">{currentCourse.title}</h2>
        <p className="sd-instructor"><UserRound size={14} aria-hidden="true" /> {currentCourse.instructor}</p>

        <div className="sd-current-lesson">
          <span className="sd-lesson-index">{String(lessonNumber).padStart(2, '0')}</span>
          <div>
            <small>Current lesson</small>
            <strong>Lesson {lessonNumber} — {lessonTitle}</strong>
            <span><Clock3 size={12} aria-hidden="true" /> {currentCourse.lessonDuration} · Last watched {currentCourse.lastWatched}</span>
          </div>
        </div>

        <div className="sd-continue-progress">
          <div className="sd-progress-meta">
            <strong>{progress}% Complete</strong>
            <span>{completedLessons} of {totalLessons} lessons completed</span>
          </div>
          <div className="sd-progress is-lg" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Course progress">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="sd-continue-actions">
          <a href={currentCourse.learnHref} className="sd-primary-btn">
            Continue Learning <ArrowRight size={16} aria-hidden="true" />
          </a>
          <button type="button" className="sd-secondary-btn" onClick={onMarkComplete} disabled={isFinished}>
            <Check size={15} aria-hidden="true" />
            {isFinished ? 'Course completed' : 'Mark lesson complete'}
          </button>
        </div>
      </div>
    </section>
  )
}
