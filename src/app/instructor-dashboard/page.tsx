import './dashboard.css';
import {
  Book, Award, Users, ClipboardList, BookOpen,
  PlusCircle, FileOutput, Bell, CheckCircle2,
  AlertCircle, Lock, Clock
} from 'lucide-react'

const courses = [
  {
    id: 'ics314',
    name: 'ICS 314',
    fullName: 'Software Engineering',
    terms: [
      { name: 'Encapsulation', submitted: 3, cap: 3, approved: false, week: 'Week 10' },
      { name: 'Inheritance', submitted: 2, cap: 3, approved: true, week: 'Week 10' },
      { name: 'Design Patterns', submitted: 3, cap: 3, approved: false, week: 'Week 10' },
      { name: 'Polymorphism', submitted: 1, cap: 3, approved: false, week: 'Week 9' },
    ]
  },
  {
    id: 'ics211',
    name: 'ICS 211',
    fullName: 'Introduction to CS',
    terms: [
      { name: 'Algorithm', submitted: 1, cap: 3, approved: false, week: 'Week 10' },
      { name: 'Recursion', submitted: 3, cap: 3, approved: true, week: 'Week 9' },
    ]
  }
]

const totalUnapproved = courses.flatMap(c => c.terms).filter(t => !t.approved).length
const totalApproved = courses.flatMap(c => c.terms).filter(t => t.approved).length
const newSubmissionsToday = 3
const termsThisWeek = courses.flatMap(c => c.terms).filter(t => t.week === 'Week 10').length

function getTermStatus(term: { submitted: number; cap: number; approved: boolean }) {
  if (term.approved) return 'approved'
  if (term.submitted >= term.cap) return 'cap-reached'
  return 'pending'
}

export default function InstructorDashboardPage() {
  return (
    <main className="dashboard-container">
      <section className="section">
        <h1 className="page-title">Instructor Dashboard</h1>
        <p className="page-subtitle">
          Manage your courses, track submissions, and review glossaries.
        </p>
      </section>

      {/* Summary Cards */}
      <section className="stats-grid section">
        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-yellow">
            <AlertCircle size={18} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Unapproved Terms</p>
            <p className="stat-value">{totalUnapproved}</p>
            <p className="stat-hint">need approval</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-blue">
            <ClipboardList size={18} />
          </div>
          <div className="stat-body">
            <p className="stat-label">New Submissions Today</p>
            <p className="stat-value">{newSubmissionsToday}</p>
            <p className="stat-hint">across all courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-green">
            <CheckCircle2 size={18} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Approved Entries</p>
            <p className="stat-value">{totalApproved}</p>
            <p className="stat-hint">total approved</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-purple">
            <Book size={18} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Terms This Week</p>
            <p className="stat-value">{termsThisWeek}</p>
            <p className="stat-hint">added this week</p>
          </div>
        </div>
      </section>

      {/* Term Status — Full Width */}
      <section className="section">
        <div className="card full-width-card">
          <div className="section-header">
            <h2 className="card-title">Term Submission Status</h2>
            <button className="add-course-btn">+ add courses</button>
          </div>

          {courses.map(course => (
            <div key={course.id} className="course-block">
              <div className="course-label">
                <span className="course-code">{course.name}</span>
                <span className="course-fullname">— {course.fullName}</span>
              </div>

              <div className="term-table">
                <div className="term-table-header">
                  <span>Term</span>
                  <span>Week</span>
                  <span>Submissions</span>
                  <span>Status</span>
                </div>

                {course.terms.map(term => {
                  const status = getTermStatus(term)
                  return (
                    <div key={term.name} className="term-row">
                      <span className="term-name">
                        <BookOpen size={13} className="term-icon" />
                        {term.name}
                      </span>
                      <span className="term-week">{term.week}</span>
                      <span className="term-submissions">
                        <div className="submission-bar-wrap">
                          <div
                            className="submission-bar-fill"
                            style={{ width: `${(term.submitted / term.cap) * 100}%` }}
                          />
                        </div>
                        <span className="submission-count">{term.submitted}/{term.cap}</span>
                      </span>
                      <span className={`term-status term-status-${status}`}>
                        {status === 'approved' && <><CheckCircle2 size={12} /> Approved</>}
                        {status === 'cap-reached' && <><Lock size={12} /> Cap Reached</>}
                        {status === 'pending' && <><Clock size={12} /> Pending</>}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Row */}
      <section className="grid-3 section">
        {/* Glossary Management */}
        <div className="card">
          <h2 className="card-title">Glossary Management</h2>
          <div className="glossary-list">
            <a href="#" className="glossary-item">
              <PlusCircle size={15} className="glossary-icon glossary-icon-green" />
              <span>Add New Term</span>
            </a>
            <a href="#" className="glossary-item">
              <BookOpen size={15} className="glossary-icon glossary-icon-green" />
              <span>Manage Glossary</span>
            </a>
            <a href="#" className="glossary-item">
              <FileOutput size={15} className="glossary-icon glossary-icon-blue" />
              <span>Export Resources</span>
            </a>
          </div>
          <button className="manage-glossary-btn">Manage Full Glossary</button>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="section-header">
            <h2 className="card-title">Recent Activity</h2>
            <a href="#" className="view-all">View All</a>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon activity-icon-blue">
                <ClipboardList size={13} />
              </div>
              <div>
                <p className="activity-text">2 new submissions for <strong>Algorithm</strong></p>
                <p className="activity-time">2 minutes ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon activity-icon-yellow">
                <Lock size={13} />
              </div>
              <div>
                <p className="activity-text"><strong>Design Patterns</strong> reached submission cap</p>
                <p className="activity-time">5 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon activity-icon-green">
                <Award size={13} />
              </div>
              <div>
                <p className="activity-text"><strong>Inheritance</strong> entry approved</p>
                <p className="activity-time">1 day ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon activity-icon-blue">
                <Bell size={13} />
              </div>
              <div>
                <p className="activity-text">1 new submission for <strong>Encapsulation</strong></p>
                <p className="activity-time">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Analytics */}
        <div className="card">
          <h2 className="card-title">Course Analytics</h2>
          <div className="analytics-course-list">
            {courses.map(course => {
              const approved = course.terms.filter(t => t.approved).length
              const total = course.terms.length
              const enrolled = course.id === 'ics314' ? 24 : 18
              return (
                <div key={course.id} className="analytics-course-block">
                  <div className="analytics-course-header">
                    <span className="analytics-course-name">{course.name}</span>
                    <span className="analytics-course-full">{course.fullName}</span>
                  </div>
                  <div className="analytics-row-item">
                    <Users size={13} className="analytics-row-icon" />
                    <span className="analytics-row-label">Students Enrolled</span>
                    <span className="analytics-row-value">{enrolled}</span>
                  </div>
                  <div className="analytics-row-item">
                    <CheckCircle2 size={13} className="analytics-row-icon" />
                    <span className="analytics-row-label">Approved / Total Terms</span>
                    <span className="analytics-row-value">{approved}/{total}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}