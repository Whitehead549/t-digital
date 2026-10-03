import type { Course } from '@/lib/data/courses'

export type CourseModule = { title: string; lectures: string[] }
export type CourseFaq = { question: string; answer: string }

export type CourseDetails = {
  subtitle: string
  description: string
  language: string
  lessons: number
  hours: number
  access: string
  level: string
  certificate: string
  instructorRole: string
  outcomes: string[]
  modules: CourseModule[]
  faqs: CourseFaq[]
  longDescription: string[]
}

const lectures = (...titles: string[]) => titles

export function getCourseDetails(course: Course): CourseDetails {
  return {
    subtitle: `A course by ${course.author}`,
    description: `Master ${course.category.toLowerCase()} with practical, hands-on lessons, real-world projects, and step-by-step guidance from an industry practitioner.`,
    language: 'English',
    lessons: 93,
    hours: 17,
    access: '3 years access to course',
    level: 'All Levels',
    certificate: 'Yes',
    instructorRole: course.category,
    outcomes: [
      `Understand the core foundations of ${course.category.toLowerCase()} and how professionals apply them.`,
      'Set up a professional workflow with the right tools, templates, and systems.',
      'Complete guided projects that you can add to your portfolio immediately.',
      'Communicate clearly with clients and teams to deliver high-quality work.',
      'Price your services and find your first paying clients with confidence.',
      'Use AI tools to speed up research, planning, and day-to-day execution.',
      'Avoid the most common beginner mistakes and learn how to fix them fast.',
      'Build repeatable processes that save time and scale with your growth.',
      'Measure your results and continuously improve the quality of your output.',
      'Stay secure and professional with best practices for privacy and data.',
      'Create a personal brand that attracts opportunities online.',
      'Launch a complete capstone project from idea to finished deliverable.',
    ],
    modules: [
      { title: 'Module 1: Getting Started & Mindset', lectures: lectures('Welcome to the course', 'How to get the most out of it', 'Setting your goals', 'Tools you will need') },
      { title: 'Module 2: Core Foundations', lectures: lectures('Key concepts explained', 'Industry overview', 'Terminology', 'Common workflows', 'Quiz & recap') },
      { title: 'Module 3: Tools & Workflow Setup', lectures: lectures('Installing your toolkit', 'Organising your workspace', 'Templates & checklists', 'Automation basics') },
      { title: 'Module 4: Hands-on Projects', lectures: lectures('Project brief', 'Planning the work', 'Execution walkthrough', 'Review & feedback') },
      { title: 'Module 5: Working With Clients', lectures: lectures('Finding clients', 'Proposals that win', 'Pricing your work', 'Delivering & follow-up') },
      { title: 'Module 6: Using AI Productively', lectures: lectures('AI tools overview', 'Prompting for results', 'Quality control') },
      { title: 'Module 7: Growth & Personal Brand', lectures: lectures('Building your profile', 'Content that attracts clients', 'Networking online') },
      { title: 'Module 8: Capstone Project', lectures: lectures('Capstone brief', 'Build session', 'Submission & certificate') },
    ],
    faqs: [
      { question: 'Are the videos downloadable?', answer: 'Videos are streamed securely on the platform. You can watch them as many times as you like for the full duration of your access period.' },
      { question: 'How do I access the course videos and materials?', answer: 'After purchase, sign in to your account and open the course from your dashboard. All videos, resources, and downloads are available there.' },
      { question: 'How can I obtain my certificate after completing the course?', answer: 'Once you finish every lesson and the capstone project, your certificate is generated automatically and can be downloaded from your dashboard.' },
    ],
    longDescription: [
      `This course takes you from complete beginner to confident practitioner in ${course.category.toLowerCase()}. Every lesson is practical and focused on skills you can apply immediately.`,
      'You will follow along with real projects, learn the exact tools professionals use, and finish with a portfolio-ready capstone and a certificate of completion.',
    ],
  }
}
