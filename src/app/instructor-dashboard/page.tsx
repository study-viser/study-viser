import './dashboard.css';
import {
  Book, Award, Users, ClipboardList, BookOpen,
  PlusCircle, FileOutput, Bell, CheckCircle2,
  AlertCircle, Lock, Clock, ChevronRight
} from 'lucide-react';
import { auth } from '@/lib/auth';
import { getUserByEmail, getUserById, getExtraCreditByCourse } from '@/lib/dbActions';
import Link from 'next/link';

export default async function InstructorDashboardPage() {
  const session = await auth();
  if (!session?.user?.email) return <p>Not logged in.</p>;

  const sessionUser = await getUserByEmail(session.user.email);
  if (!sessionUser) return <p>User not found.</p>;
  const instructor = await getUserById(sessionUser.id);
  if (!instructor) return <p>User not found.</p>;

  const courses = instructor.taughtCourses;

  // Derive stat card values — these will be properly wired in a future issue
  const totalApproved = 0;
  const totalUnapproved = 0;
  const newSubmissionsToday = 0;
  const termsThisWeek = 0;

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

      {/* Courses */}
      <section className="section">
        <div className="card full-width-card">
          <div className="section-header">
            <h2 className="card-title">My Courses</h2>
          </div>

          {courses.length === 0 && (
            <p style={{ color: '#6B7280', fontSize: '15px' }}>No courses assigned yet.</p>
          )}

          {courses.map(course => (
            <Link
              key={course.crn}
              href={`/instructor-dashboard/courses/${course.crn}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="course-block" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                border: '1px solid #E5E7EB',
                borderRadius: '10px',
                marginBottom: '8px',
                cursor: 'pointer',
                color: '#1F2937',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookOpen size={16} style={{ color: '#6DB089' }} />
                  <span style={{ fontWeight: 700 }}>{course.code}</span>
                  <span style={{ color: '#9CA3AF', fontSize: '14px' }}>— {course.title}</span>
                </div>
                <ChevronRight size={16} style={{ color: '#9CA3AF' }} />
              </div>
            </Link>
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

        {/* Recent Activity — still hardcoded, future issue */}
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
            {await Promise.all(courses.map(async course => {
              const extraCredit = await getExtraCreditByCourse(course.crn);
              return (
                <div key={course.crn} className="analytics-course-block">
                  <div className="analytics-course-header">
                    <span className="analytics-course-name">{course.code}</span>
                    <span className="analytics-course-full">{course.title}</span>
                  </div>
                  <div className="analytics-row-item">
                    <Users size={13} className="analytics-row-icon" />
                    <span className="analytics-row-label">Students Enrolled</span>
                    <span className="analytics-row-value">{extraCredit?.length ?? 0}</span>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>
      </section>
    </main>
  );
}