import type { Metadata } from 'next'
import DashboardShell from '@/components/dashboard/dashboard-shell'
import MyCourses from '@/components/dashboard/my-courses'
import { myCourses } from '@/lib/data/dashboard'

export const metadata: Metadata = {
  title: 'My Courses — TORVAN',
  description: 'All the courses you are enrolled in on TORVAN.',
  robots: { index: false, follow: false },
}

export default function MyCoursesPage() {
  return (
    <DashboardShell>
      <section className="sd-welcome" aria-labelledby="courses-page-title">
        <div>
          <h1 id="courses-page-title">My Courses</h1>
          <p>Pick up where you left off or revisit a course you have completed.</p>
        </div>
      </section>

      <MyCourses courses={myCourses} title="Enrolled courses" />
    </DashboardShell>
  )
}
