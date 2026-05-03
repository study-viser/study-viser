import './dashboard.css';
import {
  Book, Award, Users, ClipboardList, BookOpen,
  FileOutput, CheckCircle2,
  AlertCircle, ChevronRight, BookMarked,
} from 'lucide-react';
import { auth } from '@/lib/auth';
import { getUserByEmail } from '@/lib/dbActions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

/** Simple relative-time helper — avoids a date-fns dependency */
function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

export default async function InstructorDashboardPage() {
  const session = await auth();
  if (!session?.user?.email) return <p>Not logged in.</p>;

  const sessionUser = await getUserByEmail(session.user.email);
  if (!sessionUser) return <p>User not found.</p>;

  // Deep fetch: instructor → courses → students + terms → submissions + creator
  const instructor = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      taughtCourses: {
        include: {
          students: true,
          terms: {
            include: {
              submissions: {
                include: { creator: true },
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
      },
    },
  });

  if (!instructor) return <p>User not found.</p>;

  const courses = instructor.taughtCourses;

  // Flatten all terms and submissions with their parent course context
  const allTermsWithCourse = courses.flatMap(c =>
    c.terms.map(t => ({ ...t, courseCode: c.code, courseCrn: c.crn }))
  );
  const allSubmissionsWithContext = allTermsWithCourse.flatMap(t =>
    t.submissions.map(s => ({
      ...s,
      termWord: t.word,
      termId: t.id,
      courseCode: t.courseCode,
      courseCrn: t.courseCrn,
    }))
  );

  // ── Stat card values ─────────────────────────────────────────────────────
  const totalApproved = allTermsWithCourse.filter(t => t.bestSubmissionId !== null).length;
  const totalUnapproved = allTermsWithCourse.filter(
    t => t.bestSubmissionId === null && t.submissions.length > 0
  ).length;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const newSubmissionsToday = allSubmissionsWithContext.filter(
    s => s.createdAt >= startOfToday
  ).length;

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const termsThisWeek = allTermsWithCourse.filter(
    t => t.coveredOn != null && t.coveredOn >= startOfWeek
  ).length;

  // ── Recent Activity ──────────────────────────────────────────────────────
  const recentSubmissions = [...allSubmissionsWithContext]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4);

  return (
    <main className="dashboard-container">
      <section className="section">
        <h1 className="page-title">Instructor Dashboard</h1>
        <p className="page-subtitle">
          Manage your courses, track submissions, and review glossaries.
        </p>
      </section>

      {/* ── Summary Stat Cards ─────────────────────────────────────────── */}
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
            <p className="stat-hint">covered this week</p>
          </div>
        </div>
      </section>

      {/* ── My Courses ─────────────────────────────────────────────────── */}
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
              <div
                className="course-block"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  color: '#1F2937',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookOpen size={16} style={{ color: '#6DB089' }} />
                  <span style={{ fontWeight: 700 }}>{course.code}</span>
                  <span style={{ color: '#9CA3AF', fontSize: '14px' }}>— {course.title}</span>
                </div>
                <ChevronRight size={16} style={{ color: '#9CA3AF' }} />
              </div>
            </Link>
          ))}
          <Link href="/courses/claim">
            <button className="add-course-btn">Claim a Course</button>
          </Link>
        </div>
      </section>

      {/* ── Bottom Row ─────────────────────────────────────────────────── */}
      <section className="grid-3 section">

        {/* Browse Glossaries */}
        <div className="card">
          <h2 className="card-title">Browse Glossaries</h2>
          <div className="glossary-list">
            <Link href="/glossary-approved" className="glossary-item">
              <BookOpen size={15} className="glossary-icon glossary-icon-green" />
              <span>Official Glossary</span>
            </Link>
            <Link href="/glossary" className="glossary-item">
              <FileOutput size={15} className="glossary-icon glossary-icon-blue" />
              <span>All Glossary Terms</span>
            </Link>
          </div>
          <Link href="/glossary-approved">
            <button className="manage-glossary-btn">View Full Glossary</button>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="section-header">
            <h2 className="card-title">Recent Activity</h2>
          </div>
          <div className="activity-list">
            {recentSubmissions.length === 0 ? (
              <p style={{ color: '#9CA3AF', fontSize: '14px' }}>No submissions yet.</p>
            ) : (
              recentSubmissions.map(sub => {
                const isApproved = allTermsWithCourse.find(t => t.id === sub.termId)?.bestSubmissionId === sub.id;
                return (
                  <div key={sub.id} className="activity-item">
                    <div
                      className={`activity-icon ${isApproved ? 'activity-icon-green' : 'activity-icon-blue'}`}
                    >
                      {isApproved ? <Award size={13} /> : <ClipboardList size={13} />}
                    </div>
                    <div>
                      <p className="activity-text">
                        {isApproved ? (
                          <>
                            <strong>{sub.creator.name}</strong>&apos;s entry for{' '}
                            <strong>{sub.termWord}</strong> was approved
                          </>
                        ) : (
                          <>
                            <strong>{sub.creator.name}</strong> submitted a definition for{' '}
                            <strong>{sub.termWord}</strong>{' '}
                            <span style={{ color: '#9CA3AF', fontSize: '12px' }}>({sub.courseCode})</span>
                          </>
                        )}
                      </p>
                      <p className="activity-time">{timeAgo(sub.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Course Analytics */}
        <div className="card">
          <h2 className="card-title">Course Analytics</h2>
          <div className="analytics-course-list">
            {courses.length === 0 && (
              <p style={{ color: '#9CA3AF', fontSize: '14px' }}>No courses yet.</p>
            )}
            {courses.map(course => {
              const courseTerms = course.terms;
              const courseSubmissions = courseTerms.flatMap(t => t.submissions);
              const courseApproved = courseTerms.filter(t => t.bestSubmissionId !== null).length;

              return (
                <div key={course.crn} className="analytics-course-block">
                  <div className="analytics-course-header">
                    <span className="analytics-course-name">{course.code}</span>
                    <span className="analytics-course-full">{course.title}</span>
                  </div>

                  <div className="analytics-row-item">
                    <Users size={13} className="analytics-row-icon" />
                    <span className="analytics-row-label">Students Enrolled</span>
                    <span className="analytics-row-value">{course.students.length}</span>
                  </div>

                  <div className="analytics-row-item">
                    <BookMarked size={13} className="analytics-row-icon" />
                    <span className="analytics-row-label">Glossary Terms</span>
                    <span className="analytics-row-value">{courseTerms.length}</span>
                  </div>

                  <div className="analytics-row-item">
                    <ClipboardList size={13} className="analytics-row-icon" />
                    <span className="analytics-row-label">Total Submissions</span>
                    <span className="analytics-row-value">{courseSubmissions.length}</span>
                  </div>

                  <div className="analytics-row-item">
                    <CheckCircle2 size={13} className="analytics-row-icon" />
                    <span className="analytics-row-label">Approved Terms</span>
                    <span className="analytics-row-value">{courseApproved}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>
    </main>
  );
}