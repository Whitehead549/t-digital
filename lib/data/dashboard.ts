const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`

export const student = { firstName: 'Alex', fullName: 'Alex Morgan', initials: 'AM', email: 'alex.morgan@torvan.com', plan: 'Student plan' }

export type DashboardCourse = {
  id: string
  title: string
  instructor: string
  category: string
  image: string
  totalLessons: number
  completedLessons: number
  progress: number
  lastAccessed: string
  href: string
  learnHref: string
}

export const currentCourse = {
  id: 'advanced-web',
  title: 'Advanced Web Development',
  instructor: 'Qamardeen Abdul',
  category: 'Web Development',
  image: unsplash('photo-1498050108023-c5249f4df085'),
  lessonNumber: 8,
  lessonTitle: 'Authentication & Security',
  lessonDuration: '24 min',
  nextLessonTitle: 'Role-based Access Control',
  totalLessons: 12,
  completedLessons: 8,
  progress: 64,
  lastWatched: 'Yesterday at 9:42 PM · stopped at 14:08',
  learnHref: '/categories/web-development/full-stack-web/learn',
}

export const myCourses: DashboardCourse[] = [
  { id: 'advanced-web', title: 'Advanced Web Development', instructor: 'Qamardeen Abdul', category: 'Web Development', image: unsplash('photo-1498050108023-c5249f4df085'), totalLessons: 12, completedLessons: 8, progress: 64, lastAccessed: 'Yesterday', href: '/categories/web-development/full-stack-web', learnHref: '/categories/web-development/full-stack-web/learn' },
  { id: 'ui-ux-fundamentals', title: 'UI/UX Design Fundamentals', instructor: 'Amaka Nwosu', category: 'UI/UX Design', image: unsplash('photo-1561070791-2526d30994b5'), totalLessons: 12, completedLessons: 4, progress: 32, lastAccessed: '3 days ago', href: '/categories/ui-ux-design/ui-ux-figma', learnHref: '/categories/ui-ux-design/ui-ux-figma/learn' },
  { id: 'data-analysis', title: 'Data Analysis with Python & Power BI', instructor: 'Ibrahim Musa', category: 'Data Science', image: unsplash('photo-1551288049-bebda4e38f71'), totalLessons: 11, completedLessons: 2, progress: 18, lastAccessed: '1 week ago', href: '/categories/data-science/data-analysis-python', learnHref: '/categories/data-science/data-analysis-python/learn' },
  { id: 'react-modern-js', title: 'React & Modern JavaScript', instructor: 'Qamardeen Abdul', category: 'Web Development', image: unsplash('photo-1461749280684-dccba630e2f6'), totalLessons: 10, completedLessons: 10, progress: 100, lastAccessed: 'Jun 12, 2026', href: '/categories/web-development/full-stack-web', learnHref: '/categories/web-development/full-stack-web/learn' },
  { id: 'prompt-engineering', title: 'Prompt Engineering Masterclass', instructor: 'Rifdhat Tolani', category: 'Artificial Intelligence', image: unsplash('photo-1677442136019-21780ecad995'), totalLessons: 9, completedLessons: 9, progress: 100, lastAccessed: 'May 28, 2026', href: '/categories/artificial-intelligence/prompt-engineering', learnHref: '/categories/artificial-intelligence/prompt-engineering/learn' },
  { id: 'freelancing', title: 'Start a Profitable Freelancing Business', instructor: 'Hammed Oladipo', category: 'Business', image: unsplash('photo-1507679799987-c73779587ccf'), totalLessons: 8, completedLessons: 8, progress: 100, lastAccessed: 'Apr 19, 2026', href: '/categories/business/freelancing-business', learnHref: '/categories/business/freelancing-business/learn' },
]

export const learningStats = {
  inProgress: 3,
  completed: 7,
  certificates: 4,
  lessonsCompleted: 86,
  learningHours: 42,
  streakDays: 6,
}

export type ActivityType = 'completed' | 'certificate' | 'continued' | 'started'

export const recentActivity: { id: string; type: ActivityType; action: string; subject: string; course: string; time: string }[] = [
  { id: 'a1', type: 'completed', action: 'Completed', subject: 'Authentication & Security', course: 'Advanced Web Development · Lesson 8', time: '2 hours ago' },
  { id: 'a2', type: 'continued', action: 'Continued', subject: 'Advanced Web Development', course: 'Watched 14 min of Lesson 8', time: 'Yesterday, 9:42 PM' },
  { id: 'a3', type: 'completed', action: 'Completed', subject: 'JavaScript Fundamentals', course: 'React & Modern JavaScript · Lesson 3', time: 'Mon, 4:15 PM' },
  { id: 'a4', type: 'certificate', action: 'Earned certificate for', subject: 'Frontend Development', course: 'Certificate ID TRV-FD-20481', time: 'Jun 14, 2026' },
  { id: 'a5', type: 'started', action: 'Started', subject: 'UI/UX Design Fundamentals', course: 'Lesson 1 · Design thinking', time: 'Jun 10, 2026' },
]

export type Certificate = { id: string; course: string; instructor: string; completedOn: string; verified: boolean; image?: string }

export const certificates: Certificate[] = [
  { id: 'TRV-FD-20481', course: 'Frontend Development', instructor: 'Qamardeen Abdul', completedOn: 'Jun 14, 2026', verified: true },
  { id: 'TRV-RJ-19302', course: 'React & Modern JavaScript', instructor: 'Qamardeen Abdul', completedOn: 'Jun 12, 2026', verified: true },
  { id: 'TRV-PE-17755', course: 'Prompt Engineering Masterclass', instructor: 'Rifdhat Tolani', completedOn: 'May 28, 2026', verified: true },
  { id: 'TRV-FB-15020', course: 'Start a Profitable Freelancing Business', instructor: 'Hammed Oladipo', completedOn: 'Apr 19, 2026', verified: true },
]

export type NotificationType = 'completed' | 'certificate' | 'reminder' | 'course'

export const initialNotifications: { id: string; type: NotificationType; title: string; time: string; read: boolean }[] = [
  { id: 'n1', type: 'completed', title: 'You completed "Authentication & Security"', time: '2h ago', read: false },
  { id: 'n2', type: 'certificate', title: 'Your certificate for "Frontend Development" is ready', time: '1d ago', read: false },
  { id: 'n3', type: 'reminder', title: 'Continue where you left off in "Advanced Web Development"', time: '1d ago', read: false },
  { id: 'n4', type: 'course', title: 'New lesson added to "UI/UX Design Fundamentals"', time: '3d ago', read: true },
]
