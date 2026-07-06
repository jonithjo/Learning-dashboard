import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Mock data ─────────────────────────────────────────────────────────────── */
const INITIAL_COURSES = [
  {
    id: 1,
    title: 'Full-Stack Web Development Bootcamp',
    platform: 'Udemy',
    instructor: 'Dr. Angela Yu',
    emoji: '💻',
    status: 'in-progress',
    progress: 68,
    totalLessons: 54,
    completedLessons: 37,
    category: 'Web Dev',
    deadline: '2026-05-10',
    color: 'linear-gradient(135deg,#1a1a4e,#0f2027)',
  },
  {
    id: 2,
    title: 'Machine Learning A–Z: AI & Python',
    platform: 'Coursera',
    instructor: 'Andrew Ng',
    emoji: '🤖',
    status: 'in-progress',
    progress: 42,
    totalLessons: 80,
    completedLessons: 34,
    category: 'AI / ML',
    deadline: '2026-06-01',
    color: 'linear-gradient(135deg,#1a2e1a,#0f2027)',
  },
  {
    id: 3,
    title: 'AWS Solutions Architect Certification',
    platform: 'A Cloud Guru',
    instructor: 'Ryan Kroonenburg',
    emoji: '☁️',
    status: 'completed',
    progress: 100,
    totalLessons: 62,
    completedLessons: 62,
    category: 'Cloud',
    deadline: '2026-03-15',
    color: 'linear-gradient(135deg,#1a1428,#0f0a20)',
  },
  {
    id: 4,
    title: 'React – The Complete Guide (incl. Hooks)',
    platform: 'Udemy',
    instructor: 'Maximilian Schwarzmüller',
    emoji: '⚛️',
    status: 'in-progress',
    progress: 55,
    totalLessons: 45,
    completedLessons: 25,
    category: 'Web Dev',
    deadline: '2026-04-20',
    color: 'linear-gradient(135deg,#001838,#0f131e)',
  },
  {
    id: 5,
    title: 'System Design Interview Master Class',
    platform: 'Educative',
    instructor: 'Arslan Ahmad',
    emoji: '🏗️',
    status: 'not-started',
    progress: 0,
    totalLessons: 30,
    completedLessons: 0,
    category: 'Engineering',
    deadline: '2026-07-01',
    color: 'linear-gradient(135deg,#1e1a10,#0f130a)',
  },
  {
    id: 6,
    title: 'Kubernetes for Developers',
    platform: 'Linux Foundation',
    instructor: 'Priyanka Sharma',
    emoji: '🐳',
    status: 'completed',
    progress: 100,
    totalLessons: 28,
    completedLessons: 28,
    category: 'DevOps',
    deadline: '2026-02-28',
    color: 'linear-gradient(135deg,#001832,#070e1a)',
  },
];

const INITIAL_CERTS = [
  { id: 1, name: 'AWS Solutions Architect Associate', course: 'AWS Solutions Architect', size: '1.2 MB', date: '2026-03-15', type: 'PDF' },
  { id: 2, name: 'Kubernetes Developer (CKAD)', course: 'Kubernetes for Developers', size: '980 KB', date: '2026-02-28', type: 'PDF' },
];

/* ─── Utilities ─────────────────────────────────────────────────────────────── */
const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const daysLeft   = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);

const statusLabel = { 'in-progress': 'In Progress', completed: 'Completed', 'not-started': 'Not Started' };
const statusClass = { 'in-progress': 'badge-in-progress', completed: 'badge-completed', 'not-started': 'badge-not-started' };

const barColor   = (pct) => pct === 100 ? 'green' : pct >= 50 ? 'blue' : 'yellow';

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
function StatCard({ icon, value, label, trend, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {trend && <div className="stat-trend">{trend}</div>}
      </div>
    </div>
  );
}

function ProgressBar({ pct }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div className="progress-section">
      <div className="progress-header">
        <span>Progress</span>
        <span className="progress-pct">{pct}%</span>
      </div>
      <div className="progress-bar-track">
        <div className={`progress-bar-fill ${barColor(pct)}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function CourseCard({ course, onEdit }) {
  const dl = daysLeft(course.deadline);
  const urgent = dl < 7 && course.status !== 'completed';
  return (
    <div className="course-card" onClick={() => onEdit(course)}>
      <div className="course-banner" style={{ background: course.color }}>
        <span style={{ position:'relative', zIndex:1 }}>{course.emoji}</span>
        <div className="course-banner-overlay" />
        <span className={`course-badge ${statusClass[course.status]}`}>{statusLabel[course.status]}</span>
      </div>
      <div className="course-body">
        <div className="course-platform">{course.platform}</div>
        <div className="course-title">{course.title}</div>
        <div className="course-meta">
          <span className="meta-item">👨‍🏫 {course.instructor}</span>
          <span className="meta-item">📚 {course.completedLessons}/{course.totalLessons} lessons</span>
        </div>
        <ProgressBar pct={course.progress} />
      </div>
      <div className="course-footer">
        <span className={`deadline-text${urgent ? ' urgent' : ''}`}>
          {urgent ? '⚠️ Due soon' : '📅 Deadline'}
        </span>
        <span className="deadline-date">{formatDate(course.deadline)}</span>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="icon-btn" id="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-icon">
            {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ─── Main App ──────────────────────────────────────────────────────────────── */
export default function App() {
  const [courses, setCourses]   = useState(INITIAL_COURSES);
  const [certs, setCerts]       = useState(INITIAL_CERTS);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [toasts, setToasts]     = useState([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editCourse, setEditCourse]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(null);
  const fileInputRef  = useRef();
  const nextId        = useRef(100);

  /* Toast helper */
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  /* Derived stats */
  const total     = courses.length;
  const completed = courses.filter(c => c.status === 'completed').length;
  const inProg    = courses.filter(c => c.status === 'in-progress').length;
  const avgProg   = Math.round(courses.reduce((a, c) => a + c.progress, 0) / total);

  /* Filtered list */
  const visible = courses.filter(c =>
    (filter === 'all' || c.status === filter) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) ||
     c.platform.toLowerCase().includes(search.toLowerCase()))
  );

  /* ─── Course form ──────────────────────────── */
  const blankForm = { title:'', platform:'', instructor:'', category:'', deadline:'', totalLessons:10, completedLessons:0, status:'not-started', emoji:'📖', color:'linear-gradient(135deg,#1a1a4e,#0f2027)' };
  const [form, setForm] = useState(blankForm);

  const openAdd = () => { setForm(blankForm); setShowAddCourse(true); };
  const openEdit = (c) => { setForm({ ...c }); setEditCourse(c); };
  const closeModal = () => { setShowAddCourse(false); setEditCourse(null); };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(p => {
      const next = { ...p, [name]: value };
      if (name === 'completedLessons' || name === 'totalLessons') {
        const done = name === 'completedLessons' ? +value : +p.completedLessons;
        const tot  = name === 'totalLessons'     ? +value : +p.totalLessons;
        next.progress = tot > 0 ? Math.round((done / tot) * 100) : 0;
      }
      return next;
    });
  };

  const saveCourse = () => {
    if (!form.title || !form.platform || !form.deadline) {
      addToast('Please fill in required fields.', 'error'); return;
    }
    if (editCourse) {
      setCourses(p => p.map(c => c.id === editCourse.id ? { ...form, id: editCourse.id } : c));
      addToast('Course updated successfully!');
    } else {
      setCourses(p => [...p, { ...form, id: nextId.current++, progress: form.totalLessons > 0 ? Math.round((form.completedLessons / form.totalLessons) * 100) : 0 }]);
      addToast('Course added!');
    }
    closeModal();
  };

  const deleteCourse = (id) => {
    setCourses(p => p.filter(c => c.id !== id));
    addToast('Course deleted.', 'info');
    closeModal();
  };

  /* ─── File upload ─────────────────────────── */
  const handleFiles = (files) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    [...files].forEach(file => {
      if (!allowed.includes(file.type)) { addToast(`${file.name} – unsupported format.`, 'error'); return; }
      setUploading({ name: file.name, progress: 0 });
      let prog = 0;
      const iv = setInterval(() => {
        prog += Math.random() * 25;
        if (prog >= 100) {
          clearInterval(iv);
          setUploading(null);
          const sizeMB = (file.size / 1048576).toFixed(2);
          const cert = {
            id: Date.now(),
            name: file.name.replace(/\.[^.]+$/, ''),
            course: 'Unassigned',
            size: sizeMB > 0 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(0)} KB`,
            date: new Date().toISOString().split('T')[0],
            type: file.name.split('.').pop().toUpperCase(),
          };
          setCerts(p => [cert, ...p]);
          addToast(`"${cert.name}" uploaded!`);
        } else {
          setUploading(x => x ? { ...x, progress: Math.min(prog, 95) } : null);
        }
      }, 200);
    });
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFiles(e.dataTransfer.files);
  };
  const deleteCert = (id) => { setCerts(p => p.filter(c => c.id !== id)); addToast('Certificate removed.', 'info'); };

  /* ─── UI ──────────────────────────────────── */
  const navItems = [
    { id:'dashboard', icon:'🏠', label:'Dashboard' },
    { id:'courses',   icon:'📚', label:'My Courses' },
    { id:'certs',     icon:'🏆', label:'Certificates' },
    { id:'calendar',  icon:'📅', label:'Calendar' },
    { id:'stats',     icon:'📊', label:'Analytics' },
  ];

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🎓</div>
          <span className="logo-text">CourseTrack</span>
        </div>
        <nav className="sidebar-nav">
          <span className="nav-label">Main Menu</span>
          {navItems.map(item => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`nav-item${activeNav === item.id ? ' active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <span className="nav-label" style={{ marginTop:12 }}>Account</span>
          <button className="nav-item" id="nav-settings">
            <span className="nav-icon">⚙️</span>Settings
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">JD</div>
            <div>
              <div className="user-name">John Doe</div>
              <div className="user-role">Learner · Pro</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-title">
            <h1>
              {activeNav === 'dashboard' && 'Dashboard'}
              {activeNav === 'courses'   && 'My Courses'}
              {activeNav === 'certs'     && 'Certificates'}
              {activeNav === 'calendar'  && 'Calendar'}
              {activeNav === 'stats'     && 'Analytics'}
            </h1>
            <p>
              {new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </p>
          </div>
          <div className="topbar-actions">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                id="course-search"
                type="text"
                placeholder="Search courses…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button id="add-course-btn" className="btn btn-primary" onClick={openAdd}>+ Add Course</button>
          </div>
        </header>

        <main className="content">
          {/* Stats row */}
          <div className="stats-row">
            <StatCard icon="📚" value={total}     label="Total Courses"      color="purple" trend={`+${total} enrolled`} />
            <StatCard icon="✅" value={completed}  label="Completed"          color="green"  trend="Keep it up!" />
            <StatCard icon="⚡" value={inProg}     label="In Progress"        color="blue"   />
            <StatCard icon="📈" value={`${avgProg}%`} label="Avg. Completion" color="yellow" trend="Overall progress" />
          </div>

          {/* ── Courses Section ── */}
          <section id="courses-section">
            <div className="section-header">
              <div style={{ display:'flex', alignItems:'center' }}>
                <span className="section-title">Courses</span>
                <span className="section-count">{visible.length}</span>
              </div>
              <div className="filter-tabs">
                {[['all','All'], ['in-progress','In Progress'], ['completed','Completed'], ['not-started','Not Started']].map(([val, lbl]) => (
                  <button
                    key={val}
                    id={`filter-${val}`}
                    className={`filter-tab${filter === val ? ' active' : ''}`}
                    onClick={() => setFilter(val)}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
            {visible.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-muted)' }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
                <div style={{ fontSize:16, fontWeight:600, marginBottom:6 }}>No courses found</div>
                <div>Try adjusting your search or filter</div>
              </div>
            ) : (
              <div className="courses-grid" id="courses-grid">
                {visible.map(c => <CourseCard key={c.id} course={c} onEdit={openEdit} />)}
              </div>
            )}
          </section>

          {/* ── Certificates Section ── */}
          <section id="certificates-section" className="certificates-section">
            <div className="section-header">
              <div style={{ display:'flex', alignItems:'center' }}>
                <span className="section-title">🏆 Certificates</span>
                <span className="section-count">{certs.length}</span>
              </div>
              <button
                id="upload-cert-btn"
                className="btn btn-ghost"
                onClick={() => fileInputRef.current.click()}
              >
                ⬆️ Upload
              </button>
            </div>

            {/* Drop zone */}
            <div
              id="upload-dropzone"
              className={`upload-zone${dragging ? ' dragging' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <div className="upload-icon">📤</div>
              <div className="upload-title">Drag & drop your certificate here</div>
              <div className="upload-subtitle">or <span>browse files</span> from your computer</div>
              <div className="upload-types">
                {['PDF', 'PNG', 'JPG'].map(t => <span key={t} className="upload-type-badge">{t}</span>)}
              </div>
            </div>
            <input
              ref={fileInputRef}
              id="cert-file-input"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              multiple
              style={{ display:'none' }}
              onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
            />

            {/* Uploading indicator */}
            {uploading && (
              <div className="uploading-item">
                <div className="uploading-header">
                  <span>⏳ {uploading.name}</span>
                  <span>{Math.round(uploading.progress)}%</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width:`${uploading.progress}%` }} />
                </div>
              </div>
            )}

            {/* Certificate list */}
            {certs.length > 0 && (
              <div className="cert-list" id="cert-list">
                {certs.map(cert => (
                  <div key={cert.id} className="cert-item">
                    <div className="cert-icon">
                      {cert.type === 'PDF' ? '📄' : '🖼️'}
                    </div>
                    <div>
                      <div className="cert-name">{cert.name}</div>
                      <div className="cert-meta">
                        {cert.type} · {cert.size} · Issued {formatDate(cert.date)}
                      </div>
                    </div>
                    <span className="cert-size">{cert.course}</span>
                    <div className="cert-actions">
                      <button className="icon-btn" title="Download" id={`cert-dl-${cert.id}`}>⬇️</button>
                      <button
                        className="icon-btn danger"
                        title="Delete"
                        id={`cert-del-${cert.id}`}
                        onClick={() => deleteCert(cert.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ── Add / Edit Course Modal ── */}
      {(showAddCourse || editCourse) && (
        <Modal title={editCourse ? 'Edit Course' : 'Add New Course'} onClose={closeModal}>
          <div className="modal-form">
            <div className="form-group">
              <label className="form-label">Course Title *</label>
              <input id="form-title" name="title" className="form-input" placeholder="e.g. React – The Complete Guide" value={form.title} onChange={handleFormChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Platform *</label>
                <input id="form-platform" name="platform" className="form-input" placeholder="Udemy, Coursera…" value={form.platform} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Instructor</label>
                <input id="form-instructor" name="instructor" className="form-input" placeholder="e.g. John Smith" value={form.instructor} onChange={handleFormChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Total Lessons</label>
                <input id="form-total" name="totalLessons" type="number" min="1" className="form-input" value={form.totalLessons} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Completed Lessons</label>
                <input id="form-completed" name="completedLessons" type="number" min="0" className="form-input" value={form.completedLessons} onChange={handleFormChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select id="form-status" name="status" className="form-select" value={form.status} onChange={handleFormChange}>
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Deadline *</label>
                <input id="form-deadline" name="deadline" type="date" className="form-input" value={form.deadline} onChange={handleFormChange} />
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'var(--bg-secondary)', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)' }}>
              <span style={{ fontSize:14, color:'var(--text-secondary)' }}>Progress:</span>
              <div style={{ flex:1 }}><ProgressBar pct={form.progress || 0} /></div>
            </div>
            <div className="modal-footer">
              {editCourse && (
                <button id="delete-course-btn" className="btn btn-ghost" style={{ color:'var(--red)', borderColor:'rgba(248,113,113,0.3)', marginRight:'auto' }} onClick={() => deleteCourse(editCourse.id)}>
                  🗑 Delete
                </button>
              )}
              <button id="cancel-modal-btn" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button id="save-course-btn" className="btn btn-primary" onClick={saveCourse}>
                {editCourse ? 'Save Changes' : 'Add Course'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Toasts ── */}
      <Toast toasts={toasts} />
    </div>
  );
}
