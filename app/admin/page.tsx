'use client'

import { useMemo, useState } from 'react'
import { Archive, BarChart3, BookOpen, Check, ChevronLeft, ChevronRight, CirclePlus, Edit3, LayoutDashboard, MoreHorizontal, Search, Settings, ShoppingBag, Trash2, Users, X } from 'lucide-react'
import { courses as initialCourses, type Course } from '@/lib/data/courses'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Courses', icon: BookOpen, active: true },
  { label: 'Students', icon: Users },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Bundles', icon: Archive },
]

const newCourse: Course = { id: 'new-course', title: 'New course draft', category: 'Web Development', rating: '—', students: '0', author: 'Admin', price: '$0', oldPrice: '$0', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=220&q=80', tone: 'blue' }

export default function AdminPage() {
  const [courseList, setCourseList] = useState(initialCourses)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All categories')
  const [status, setStatus] = useState('All status')
  const [editing, setEditing] = useState<Course | null>(null)
  const [notice, setNotice] = useState('')

  const categories = ['All categories', ...Array.from(new Set(courseList.map((course) => course.category)))]
  const filteredCourses = useMemo(() => courseList.filter((course) => {
    const matchesQuery = `${course.title} ${course.author} ${course.category}`.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'All categories' || course.category === category
    const matchesStatus = status === 'All status' || (status === 'Published' ? course.id !== 'new-course' : course.id === 'new-course')
    return matchesQuery && matchesCategory && matchesStatus
  }), [category, courseList, query, status])

  const removeCourse = (course: Course) => {
    if (!window.confirm(`Delete “${course.title}”? This cannot be undone.`)) return
    setCourseList((current) => current.filter((item) => item.id !== course.id))
    setNotice('Course deleted successfully')
    window.setTimeout(() => setNotice(''), 2200)
  }

  const openCourseEditor = (course: Course) => setEditing({ ...course })

  const addCourse = () => setEditing({ ...newCourse, id: `course-${Date.now()}` })

  const saveCourse = () => {
    if (!editing) return
    setCourseList((current) => current.some((course) => course.id === editing.id) ? current.map((course) => course.id === editing.id ? editing : course) : [editing, ...current])
    setEditing(null)
    setNotice('Course saved successfully')
    window.setTimeout(() => setNotice(''), 2200)
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="admin-brand"><span className="admin-brand-mark">T</span><span>TORVAN <b>ADMIN</b></span></a>
        <p className="admin-sidebar-label">Workspace</p>
        <nav aria-label="Admin navigation" className="admin-nav">{navItems.map(({ label, icon: Icon, active }) => <a className={active ? 'active' : ''} href="#" key={label}><Icon size={16} /><span>{label}</span>{active && <i />}</a>)}</nav>
        <div className="admin-sidebar-bottom"><a href="#"><Settings size={16} /> Settings</a><a href="/"><ChevronLeft size={16} /> Back to site</a></div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar"><div><p className="admin-overline">Course management</p><h1>Good morning, Admin</h1></div><div className="admin-profile"><span className="admin-notification">3</span><span className="admin-avatar">AD</span><span><b>Admin</b><small>Super admin</small></span><MoreHorizontal size={18} /></div></header>
        <div className="admin-content">
          <div className="admin-page-title"><div><p className="admin-overline">Library / Courses</p><h2>Courses</h2><p>Manage your learning catalog, pricing, and visibility.</p></div><button className="admin-primary" onClick={addCourse}><CirclePlus size={16} /> Add new course</button></div>
          <div className="admin-stat-grid"><div><span className="admin-stat-icon red"><BookOpen size={16} /></span><span><b>{courseList.length}</b><small>Total courses</small></span><em>+12% <small>this month</small></em></div><div><span className="admin-stat-icon green"><Check size={16} /></span><span><b>{courseList.length - 1}</b><small>Published</small></span><em>+8% <small>this month</small></em></div><div><span className="admin-stat-icon blue"><Users size={16} /></span><span><b>48.2k</b><small>Enrolled students</small></span><em>+18% <small>this month</small></em></div><div><span className="admin-stat-icon gold"><BarChart3 size={16} /></span><span><b>$24.8k</b><small>Revenue this month</small></span><em>+24% <small>this month</small></em></div></div>
          <div className="admin-toolbar"><label className="admin-search"><Search size={16} /><input placeholder="Search courses, instructors..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">{categories.map((item) => <option key={item}>{item}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status"><option>All status</option><option>Published</option><option>Draft</option></select><button className="admin-filter" onClick={() => { setQuery(''); setCategory('All categories'); setStatus('All status') }}>Reset</button></div>
          <div className="admin-table-card"><div className="admin-table-heading"><div><h3>All courses</h3><span>{filteredCourses.length} courses in your library</span></div><button className="admin-icon-btn" aria-label="More course actions"><MoreHorizontal size={18} /></button></div><div className="admin-table-wrap"><table><thead><tr><th>Course</th><th>Instructor</th><th>Price</th><th>Students</th><th>Status</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filteredCourses.map((course, index) => <tr key={course.id} className="admin-course-row" onClick={() => openCourseEditor(course)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCourseEditor(course) } }} tabIndex={0} aria-label={`Edit ${course.title}`}><td><div className="admin-course-cell"><img src={course.image} alt="" /><span><b>{course.title}</b><small>{course.category}</small></span></div></td><td><span className="admin-instructor"><span>{course.author.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>{course.author}</span></td><td><b>{course.price}</b><del>{course.oldPrice}</del></td><td>{course.students}</td><td><span className={`admin-status ${course.id === 'new-course' ? 'draft' : 'published'}`}><i />{course.id === 'new-course' ? 'Draft' : 'Published'}</span></td><td><span className="admin-updated">{index % 3 === 0 ? 'Today' : `${index + 1} days ago`}</span></td><td><div className="admin-actions"><button type="button" aria-label={`Edit ${course.title}`} title="Edit course" onClick={(event) => { event.stopPropagation(); openCourseEditor(course) }}><Edit3 size={15} /></button><button type="button" className="delete-action" aria-label={`Delete ${course.title}`} title="Delete course" onClick={(event) => { event.stopPropagation(); removeCourse(course) }}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div><div className="admin-table-footer"><span>Showing <b>{filteredCourses.length}</b> of {courseList.length} courses</span><div><button aria-label="Previous page"><ChevronLeft size={15} /></button><button className="selected">1</button><button>2</button><button>3</button><button aria-label="Next page"><ChevronRight size={15} /></button></div></div></div>
        </div>
      </section>
      {notice && <div className="admin-toast"><Check size={16} /> {notice}</div>}
      {editing && <div className="admin-modal-backdrop" role="presentation"><form className="admin-modal" onSubmit={(event) => { event.preventDefault(); saveCourse() }}><button className="admin-modal-close" type="button" aria-label="Close" onClick={() => setEditing(null)}><X size={18} /></button><p className="admin-overline">{courseList.some((course) => course.id === editing.id) ? 'Edit course' : 'Create course'}</p><h2>{courseList.some((course) => course.id === editing.id) ? 'Update course details' : 'Add a new course'}</h2><label>Course title<input required value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} /></label><label>Category<input required value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })} /></label><div className="admin-modal-grid"><label>Instructor<input required value={editing.author} onChange={(event) => setEditing({ ...editing, author: event.target.value })} /></label><label>Price<input required value={editing.price} onChange={(event) => setEditing({ ...editing, price: event.target.value })} /></label></div><label>Thumbnail URL<input value={editing.image} onChange={(event) => setEditing({ ...editing, image: event.target.value })} /></label><div className="admin-modal-actions"><button type="button" onClick={() => setEditing(null)}>Cancel</button><button className="admin-primary" type="submit">Save course</button></div></form></div>}
    </main>
  )
}
