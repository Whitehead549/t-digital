'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronRight, CirclePlay, Clock3, FileText, Flag, Menu, MessageSquare, Play, Search, Settings2, SkipBack, SkipForward, Star, X } from 'lucide-react'
import { courses } from '@/lib/data/courses'

const modules = [
  { title: 'Getting Started', lessons: ['Welcome to the course', 'Course overview', 'Tools and setup'] },
  { title: 'Web Development Basics', lessons: ['HTML fundamentals', 'CSS layout essentials', 'JavaScript basics'] },
  { title: 'Advanced Topics', lessons: ['Building a project', 'Deployment', 'Final assessment'] },
]

export default function DashboardPage() {
  const [activeLesson, setActiveLesson] = useState('HTML fundamentals')
  const [menuOpen, setMenuOpen] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [query, setQuery] = useState('')
  const recommended = useMemo(() => courses.filter((course) => course.title.toLowerCase().includes(query.toLowerCase())).slice(0, 3), [query])
  const lessonIndex = modules.flatMap((module) => module.lessons).indexOf(activeLesson)
  const allLessons = modules.flatMap((module) => module.lessons)

  function moveLesson(direction: number) {
    const next = Math.max(0, Math.min(allLessons.length - 1, lessonIndex + direction))
    setActiveLesson(allLessons[next])
    setCompleted(false)
  }

  return (
    <main className="lesson-dashboard">
      <header className="lesson-header">
        <a className="brand" href="/"><span className="brand-mark">T</span><span>TORVAN</span></a>
        <div className="lesson-course-title"><span>Web Development</span><strong>HTML & CSS Fundamentals</strong></div>
        <div className="lesson-header-actions"><div className="lesson-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses" aria-label="Search courses" /></div><a href="/dashboard" className="lesson-avatar">AM</a><button aria-label="Open curriculum" onClick={() => setMenuOpen(true)}><Menu size={20} /></button></div>
      </header>

      <div className="lesson-dashboard-grid">
        <aside className={`lesson-curriculum ${menuOpen ? 'is-open' : ''}`}>
          <div className="curriculum-mobile-head"><strong>Course curriculum</strong><button onClick={() => setMenuOpen(false)} aria-label="Close curriculum"><X size={18} /></button></div>
          <div className="lesson-curriculum-title"><p>COURSE CURRICULUM</p><h1>HTML & CSS Fundamentals</h1><div className="mini-progress"><span style={{ width: `${completed ? 34 : 28}%` }} /></div><small>{completed ? '3 of 9 lessons complete' : '2 of 9 lessons complete'}</small></div>
          <div className="module-list">{modules.map((module, moduleIndex) => <section key={module.title} className="module-group"><h2>{moduleIndex + 1}. {module.title}<ChevronRight size={14} /></h2>{module.lessons.map((lesson, index) => <button key={lesson} className={`curriculum-row ${activeLesson === lesson ? 'current' : ''}`} onClick={() => { setActiveLesson(lesson); setMenuOpen(false) }}><span className={`lesson-dot ${index === 0 || (moduleIndex === 1 && index === 0 && completed) ? 'done' : ''}`}>{index === 0 || (moduleIndex === 1 && index === 0 && completed) ? <Check size={11} /> : <CirclePlay size={11} />}</span><span>{lesson}</span>{activeLesson === lesson && <Play size={11} fill="currentColor" />}</button>)}</section>)}</div>
          <div className="curriculum-footer"><Settings2 size={15} /> <span>Course resources</span><Flag size={14} /></div>
        </aside>

        <section className="lesson-main-column">
          <div className="lesson-video-stage"><div className="video-code-lines"><i>01</i><span>&lt;!DOCTYPE html&gt;</span><span><b>&lt;html</b> lang=&quot;en&quot;&gt;</span><span>&nbsp;&nbsp;&lt;head&gt;</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&lt;title&gt;Build for the web&lt;/title&gt;</span><span>&nbsp;&nbsp;&lt;/head&gt;</span><span>&lt;/html&gt;</span></div><button className="lesson-video-play" aria-label="Play lesson"><CirclePlay size={58} strokeWidth={1.2} /></button><span className="protected-badge">Protected lesson</span><div className="lesson-controls"><span>0:00</span><div className="lesson-scrubber"><span /></div><span>12:45</span><button aria-label="Play"><Play size={14} fill="currentColor" /></button></div></div>
          <div className="lesson-content-heading"><div><p className="lesson-eyebrow">MODULE 2 · LESSON 1</p><h2>{activeLesson}</h2><span>Video lesson · 12:45 · {completed ? '100%' : '28%'} watched</span></div><button className={`mark-complete ${completed ? 'done' : ''}`} onClick={() => setCompleted((value) => !value)}>{completed ? <Check size={15} /> : <Check size={15} />}{completed ? 'Completed' : 'Mark as complete'}</button></div>
          <div className="lesson-tabs"><button className="active">Lesson notes</button><button>Comments <span>2</span></button><button onClick={() => alert('Thanks — the issue has been reported.')}>Report an issue</button></div>
          <div className="lesson-description"><p>In this lesson, you&apos;ll learn how HTML creates the foundation of every website. We&apos;ll cover document structure, common tags, and how to write clean, semantic markup.</p><button className="bookmark-link"><Star size={15} /> Save bookmark</button></div>
          <div className="lesson-navigation"><button disabled={lessonIndex === 0} onClick={() => moveLesson(-1)}><SkipBack size={16} /> <span>Previous lesson<small>{allLessons[Math.max(0, lessonIndex - 1)]}</small></span></button><button disabled={lessonIndex === allLessons.length - 1} onClick={() => moveLesson(1)}><span>Next lesson<small>{allLessons[Math.min(allLessons.length - 1, lessonIndex + 1)]}</small></span><SkipForward size={16} /></button></div>
          <section className="dashboard-recommendations"><div className="lesson-recommendation-head"><div><p className="lesson-eyebrow">KEEP LEARNING</p><h2>More courses for you</h2></div><a href="/courses">Browse all <ChevronRight size={14} /></a></div><div className="lesson-recommendation-grid">{recommended.map((course) => <a href={`/categories/web-development/${course.id}`} className="lesson-recommendation-card" key={course.id}><img src={course.image} alt="" /><span><Clock3 size={12} /> {course.duration}</span><strong>{course.title}</strong></a>)}</div></section>
        </section>

        <aside className="next-lesson-card"><p className="lesson-eyebrow">UP NEXT</p><div className="next-lesson-thumb"><div className="thumb-code">&lt;/&gt;</div><Play size={25} fill="currentColor" /></div><span className="next-label">Lesson {lessonIndex + 2} of {allLessons.length}</span><h2>{allLessons[Math.min(allLessons.length - 1, lessonIndex + 1)]}</h2><p>Continue building practical skills with the next lesson in this module.</p><button onClick={() => moveLesson(1)}>Next lesson <ChevronRight size={15} /></button><div className="next-divider" /><div className="course-progress-card"><span>Course progress</span><strong>{completed ? '34%' : '28%'}</strong><div className="mini-progress"><span style={{ width: `${completed ? 34 : 28}%` }} /></div></div></aside>
      </div>
    </main>
  )
}
