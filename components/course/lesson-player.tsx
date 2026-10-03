'use client'

import { useMemo, useState } from 'react'
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Clock3,
  Download,
  FileText,
  Flag,
  Lock,
  MessageSquareText,
  MoreHorizontal,
  Play,
  QrCode,
  ShieldCheck,
  StickyNote,
  X,
} from 'lucide-react'
import type { Lesson } from '@/lib/data/lessons'

type LessonPlayerProps = { lessons: Lesson[]; courseTitle: string; author: string; categoryId: string }

export default function LessonPlayer({ lessons, courseTitle, author, categoryId }: LessonPlayerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [completed, setCompleted] = useState<string[]>(lessons.slice(0, 2).map((lesson) => lesson.id))
  const [bookmarked, setBookmarked] = useState(false)
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [reportSent, setReportSent] = useState(false)

  const activeLesson = lessons[activeIndex]
  const completionPercent = Math.round((completed.length / lessons.length) * 100)
  const isComplete = completed.includes(activeLesson.id)
  const progressLabel = useMemo(() => `${completed.length} of ${lessons.length} lessons complete`, [completed.length, lessons.length])

  function toggleComplete() {
    setCompleted((current) => current.includes(activeLesson.id) ? current.filter((id) => id !== activeLesson.id) : [...current, activeLesson.id])
  }

  function move(direction: number) {
    setActiveIndex((index) => Math.min(Math.max(index + direction, 0), lessons.length - 1))
  }

  return (
    <main className="learn-shell">
      <div className="learn-topbar">
        <div>
          <a className="learn-back" href={`/categories/${categoryId}/${activeLesson.courseId}`}>← Back to course</a>
          <p className="learn-kicker">NOW LEARNING</p>
          <h1>{courseTitle}</h1>
        </div>
        <div className="learn-course-progress" aria-label={`Course progress: ${completionPercent}%`}>
          <div className="progress-copy"><span>Course progress</span><strong>{completionPercent}%</strong></div>
          <div className="progress-track"><span style={{ width: `${completionPercent}%` }} /></div>
          <small>{progressLabel}</small>
        </div>
      </div>

      <div className="learn-layout">
        <section className="learn-main" aria-label="Lesson player">
          <div className="video-player">
            <div className="video-grid" />
            <div className="video-protected"><Lock size={13} /> Protected streaming</div>
            <div className="video-center"><button className="video-play" aria-label="Play lesson"><Play size={24} fill="currentColor" /></button><span>Resume lesson</span></div>
            <div className="video-bottom"><span>00:00</span><div className="video-scrubber"><span /></div><span>{activeLesson.duration}</span><MoreHorizontal size={18} /></div>
          </div>

          <div className="lesson-heading"><div><p className="learn-kicker">LESSON {activeLesson.id}</p><h2>{activeLesson.title}</h2><p className="lesson-byline"><Clock3 size={14} /> {activeLesson.duration} · By {author}</p></div><button className={`bookmark-btn ${bookmarked ? 'selected' : ''}`} onClick={() => setBookmarked(!bookmarked)} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}><Bookmark size={17} fill={bookmarked ? 'currentColor' : 'none'} /> {bookmarked ? 'Bookmarked' : 'Bookmark'}</button></div>

          <div className="lesson-actions"><button className={`complete-btn ${isComplete ? 'done' : ''}`} onClick={toggleComplete}>{isComplete ? <Check size={17} /> : <CirclePlay size={17} />} {isComplete ? 'Lesson completed' : 'Mark as complete'}</button><button className="text-action" onClick={() => setShowNotes(!showNotes)}><StickyNote size={16} /> {showNotes ? 'Hide notes' : 'Add a note'}</button><button className="text-action" onClick={() => setShowReport(true)}><Flag size={16} /> Report an issue</button></div>

          {showNotes && <div className="notes-panel"><div className="panel-title"><div><strong>My notes</strong><span>Private to you</span></div><FileText size={18} /></div><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Write a note about this lesson..." aria-label="Lesson notes" /><button className="save-note" onClick={() => setShowNotes(false)}>Save note</button></div>}
          <div className="lesson-nav"><button onClick={() => move(-1)} disabled={activeIndex === 0}><ChevronLeft size={18} /><span><small>Previous</small>{lessons[activeIndex - 1]?.title ?? 'First lesson'}</span></button><button onClick={() => move(1)} disabled={activeIndex === lessons.length - 1}><span><small>Next lesson</small>{lessons[activeIndex + 1]?.title ?? 'Course complete'}</span><ChevronRight size={18} /></button></div>

          {completionPercent === 100 && <section className="certificate-card"><div className="certificate-icon"><ShieldCheck size={24} /></div><div><p className="learn-kicker">COURSE COMPLETE</p><h3>Your certificate is ready</h3><p>Congratulations. Your completion was recorded today and certificate ID <strong>TVN-{activeLesson.courseId.slice(0, 4).toUpperCase()}-2026</strong> is ready to verify.</p></div><button className="certificate-download"><Download size={16} /> Download PDF</button></section>}
        </section>

        <aside className="curriculum" aria-label="Course curriculum"><div className="curriculum-head"><div><p className="learn-kicker">CURRICULUM</p><h2>Course content</h2></div><span>{lessons.length} lessons</span></div><div className="curriculum-progress"><div><span>Progress</span><strong>{completionPercent}%</strong></div><div className="progress-track"><span style={{ width: `${completionPercent}%` }} /></div></div><div className="lesson-list">{lessons.map((lesson, index) => { const done = completed.includes(lesson.id); return <button key={lesson.id} className={`curriculum-lesson ${index === activeIndex ? 'active' : ''}`} onClick={() => setActiveIndex(index)}><span className={`lesson-status ${done ? 'complete' : ''}`}>{done ? <Check size={12} /> : <span>{index + 1}</span>}</span><span className="lesson-list-copy"><strong>{lesson.title}</strong><small>{lesson.duration} {index === activeIndex && '· In progress'}</small></span>{index === activeIndex && <CirclePlay size={16} className="current-play" />}</button> })}</div><div className="curriculum-footer"><QrCode size={18} /><span>Certificate unlocks after all lessons are completed.</span></div></aside>
      </div>
      {showReport && <div className="report-overlay" role="dialog" aria-modal="true" aria-labelledby="report-title"><div className="report-modal"><button className="close-modal" onClick={() => setShowReport(false)} aria-label="Close"><X size={18} /></button>{reportSent ? <div className="report-success"><Check size={28} /><h2>Thanks for letting us know</h2><p>Our team will review this report and follow up if needed.</p><button className="save-note" onClick={() => setShowReport(false)}>Close</button></div> : <><p className="learn-kicker">HELP US IMPROVE</p><h2 id="report-title">Report an issue</h2><p className="modal-copy">What went wrong with “{activeLesson.title}”?</p><div className="report-options"><button>Video won&apos;t play</button><button>Audio or captions issue</button><button>Something else</button></div><textarea placeholder="Add more details (optional)" aria-label="Issue details" /><button className="save-note" onClick={() => setReportSent(true)}>Send report</button></>}</div></div>}
    </main>
  )
}
