'use client'

import { useState } from 'react'
import { Flame } from 'lucide-react'
import ContinueLearning from '@/components/dashboard/continue-learning'
import StatsRow from '@/components/dashboard/stats-row'
import ActivityFeed from '@/components/dashboard/activity-feed'
import { currentCourse, learningStats, student } from '@/lib/data/dashboard'

const BASE_OVERALL = 64

export default function DashboardView({ certificateCount }: { certificateCount: number }) {
  const [completedLessons, setCompletedLessons] = useState(currentCourse.completedLessons)
  const extraLessons = completedLessons - currentCourse.completedLessons
  const courseProgress = extraLessons === 0 ? currentCourse.progress : Math.round((completedLessons / currentCourse.totalLessons) * 100)
  const overall = Math.min(100, BASE_OVERALL + extraLessons * 2)

  const markComplete = () => setCompletedLessons((value) => Math.min(currentCourse.totalLessons, value + 1))

  return (
    <>
      <section className="sd-welcome" aria-labelledby="welcome-title">
        <div>
          <h1 id="welcome-title">Welcome back, {student.firstName} <span aria-hidden="true">👋</span></h1>
          <p>Continue learning and keep making progress.</p>
        </div>
        <span className="sd-streak"><Flame size={15} aria-hidden="true" /> {learningStats.streakDays}-day learning streak</span>
      </section>

      <ContinueLearning completedLessons={completedLessons} progress={courseProgress} onMarkComplete={markComplete} />

      <StatsRow inProgress={learningStats.inProgress} completed={learningStats.completed} overall={overall} certificates={certificateCount} />

      <ActivityFeed />
    </>
  )
}
