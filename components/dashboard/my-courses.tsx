'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Clock3, ListVideo } from 'lucide-react'
import type { DashboardCourse } from '@/lib/data/dashboard'

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
] as const

type TabId = (typeof tabs)[number]['id']

export default function MyCourses({ courses, title = 'My Courses' }: { courses: DashboardCourse[]; title?: string }) {
  const [tab, setTab] = useState<TabId>('all')
  const counts: Record<TabId, number> = {
    all: courses.length,
    progress: courses.filter((course) => course.progress < 100).length,
    completed: courses.filter((course) => course.progress >= 100).length,
  }
  const visible = courses.filter((course) => (tab === 'all' ? true : tab === 'completed' ? course.progress >= 100 : course.progress < 100))

  return (
    <section className="sd-section" id="my-courses" aria-labelledby="my-courses-title">
      <div className="sd-section-head">
        <div>
          <p className="sd-eyebrow">Library</p>
          <h2 id="my-courses-title">{title}</h2>
        </div>
        <div className="sd-tabs" role="tablist" aria-label="Filter courses">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              aria-controls="my-courses-panel"
              className={tab === item.id ? 'is-active' : ''}
              onClick={() => setTab(item.id)}
            >
              {item.label}
              <span>{counts[item.id]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sd-course-grid" id="my-courses-panel" role="tabpanel">
        {visible.map((course) => {
          const done = course.progress >= 100
          return (
            <article key={course.id} className="sd-course">
              <a href={done ? course.href : course.learnHref} className="sd-course-media" tabIndex={-1} aria-hidden="true">
                <img src={course.image || '/placeholder.svg'} alt="" crossOrigin="anonymous" />
                <span className="sd-course-chip">{course.category}</span>
                {done && <span className="sd-course-done"><CheckCircle2 size={13} aria-hidden="true" /> Completed</span>}
              </a>
              <div className="sd-course-body">
                <h3><a href={done ? course.href : course.learnHref}>{course.title}</a></h3>
                <p className="sd-course-instructor">{course.instructor}</p>
                <div className="sd-progress-meta is-sm">
                  <strong>{course.progress}% complete</strong>
                  <span>{done ? 'Completed' : `${course.completedLessons} / ${course.totalLessons} lessons`}</span>
                </div>
                <div className={`sd-progress ${done ? 'is-done' : ''}`} role="progressbar" aria-valuenow={course.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${course.title} progress`}>
                  <span style={{ width: `${course.progress}%` }} />
                </div>
                <div className="sd-course-foot">
                  <span><ListVideo size={13} aria-hidden="true" /> {course.totalLessons} lessons</span>
                  <span><Clock3 size={13} aria-hidden="true" /> {course.lastAccessed}</span>
                </div>
                <a href={done ? course.href : course.learnHref} className={done ? 'sd-secondary-btn is-block' : 'sd-primary-btn is-block'}>
                  {done ? 'View Course' : 'Continue'} <ArrowRight size={15} aria-hidden="true" />
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
