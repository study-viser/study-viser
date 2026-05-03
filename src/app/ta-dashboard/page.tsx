import './dashboard.css';
import {
  ClipboardList, CheckCircle2, Bell,
  BookOpen, ChevronRight, Award, Clock,
} from 'lucide-react';
import { auth } from '@/lib/auth';
import Link from 'next/link';

// ============================================================================
// MOCK DATA — replace with real DB queries when backend is wired up.
// The shape below doubles as the spec for the eventual queries:
//   getCoursesByTA(userId)        → assistedCourses
//   getTAStats(userId)            → stats
//   getPendingQueueByTA(userId)   → pendingQueue
//                                   (grouped by course; courses sorted by
//                                    oldestPendingDays desc; cap ~5 subs/course)
//   getRecentTAActivity(userId)   → recentActivity
//   getApprovalStatsByTA(userId)  → approvalStats
// ============================================================================
const MOCK_TA_DATA = {
  user: { name: 'Pat Jones', email: 'pat@hawaii.edu' },

  assistedCourses: [
    { crn: 78901, code: 'ICS 311', title: 'Algorithms' },
    { crn: 78902, code: 'ICS 314', title: 'Software Engineering' },
  ],

  stats: {
    pendingReview: 12,
    newSubmissionsToday: 4,
    approvedByYou: 23,
  },

  pendingQueue: [
    {
      crn: 78901,
      courseCode: 'ICS 311',
      courseTitle: 'Algorithms',
      pendingCount: 8,
      oldestPendingDays: 5,
      submissions: [
        { submissionId: 's1', termId: 't1', termWord: 'Asymptotic Notation', submittedAt: '5 days ago', creatorName: 'Student A' },
        { submissionId: 's2', termId: 't2', termWord: 'Big O Notation',     submittedAt: '3 days ago', creatorName: 'Student B' },
        { submissionId: 's3', termId: 't3', termWord: 'Divide and Conquer', submittedAt: '2 days ago', creatorName: 'Student C' },
      ],
    },
    {
      crn: 78902,
      courseCode: 'ICS 314',
      courseTitle: 'Software Engineering',
      pendingCount: 4,
      oldestPendingDays: 1,
      submissions: [
        { submissionId: 's4', termId: 't4', termWord: 'Refactoring', submittedAt: '1 day ago',   creatorName: 'Student D' },
        { submissionId: 's5', termId: 't5', termWord: 'Code Smell',  submittedAt: '6 hours ago', creatorName: 'Student E' },
      ],
    },
  ],

  recentActivity: [
    { type: 'approved',   text: 'You approved "Big O Notation" for ICS 311', timestamp: '2 hours ago' },
    { type: 'submission', text: 'New submission for "Recursion" in ICS 311', timestamp: '4 hours ago' },
    { type: 'reviewed',   text: 'You marked "Quick Sort" as reviewed',       timestamp: 'yesterday'   },
  ],

  approvalStats: [
    { courseCode: 'ICS 311', approved: 15, pending: 8 },
    { courseCode: 'ICS 314', approved: 8,  pending: 4 },
  ],
};

export default async function TADashboardPage() {
  const session = await auth();
  if (!session?.user?.email) return <p>Not logged in.</p>;

  // TODO(db): replace MOCK_TA_DATA with real queries (see header comment).
  const data = MOCK_TA_DATA;

  return (
    <main className="dashboard-container">
      <section className="section">
        <h1 className="page-title">TA Dashboard</h1>
        <p className="page-subtitle">
          Review submissions and approve glossary entries for your courses.
        </p>
      </section>

      {/* Summary Cards */}
      <section className="stats-grid section">
        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-yellow">
            <ClipboardList size={18} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Pending Review</p>
            <p className="stat-value">{data.stats.pendingReview}</p>
            <p className="stat-hint">awaiting your review</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-blue">
            <Bell size={18} />
          </div>
          <div className="stat-body">
            <p className="stat-label">New Submissions Today</p>
            <p className="stat-value">{data.stats.newSubmissionsToday}</p>
            <p className="stat-hint">across your courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-green">
            <Award size={18} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Approved by You</p>
            <p className="stat-value">{data.stats.approvedByYou}</p>
            <p className="stat-hint">winners selected</p>
          </div>
        </div>
      </section>

      {/* Courses You're Assisting */}
      <section className="section">
        <div className="card full-width-card">
          <div className="section-header">
            <h2 className="card-title">Courses You&apos;re Assisting</h2>
          </div>

          {data.assistedCourses.length === 0 && (
            <p className="empty-text">
              You haven&apos;t been added to any courses yet. Ask your instructor for the course code.
            </p>
          )}

          {data.assistedCourses.map(course => (
            <Link
              key={course.crn}
              href={`/ta-dashboard/courses/${course.crn}`}
              className="assisting-course-row"
            >
              <div className="assisting-course-info">
                <BookOpen size={16} />
                <span className="course-code">{course.code}</span>
                <span className="course-fullname">— {course.title}</span>
              </div>
              <ChevronRight size={16} />
            </Link>
          ))}
        </div>
      </section>

      {/* Pending Review Queue (grouped by course, sorted by urgency) */}
      <section className="section">
        <div className="card full-width-card">
          <div className="section-header">
            <h2 className="card-title">Pending Review Queue</h2>
          </div>

          {data.pendingQueue.length === 0 && (
            <p className="empty-text">All caught up — no pending submissions.</p>
          )}

          {data.pendingQueue.map(group => (
            <div key={group.crn} className="course-block">
              <div className="course-label">
                <span className="course-code">{group.courseCode}</span>
                <span className="course-fullname">— {group.courseTitle}</span>
                <span className="course-fullname">
                  · {group.pendingCount} pending · oldest {group.oldestPendingDays}d ago
                </span>
              </div>

              <div className="term-table">
                {group.submissions.map(sub => (
                  <div key={sub.submissionId} className="term-row">
                    <span className="term-name">
                      <BookOpen size={14} className="term-icon" />
                      {sub.termWord}
                    </span>
                    <span className="term-week">
                      <Clock size={12} /> {sub.submittedAt}
                    </span>
                    <span className="term-week">{sub.creatorName}</span>
                    <Link
                      href={`/ta-dashboard/terms/${sub.termId}`}
                      className="view-all"
                    >
                      Review →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Row */}
      <section className="grid-2 section">
        {/* Recent Activity */}
        <div className="card">
          <h2 className="card-title">Recent Activity</h2>
          <div className="activity-list">
            {data.recentActivity.map((item, i) => (
              <div key={i} className="activity-item">
                <div
                  className={`activity-icon ${
                    item.type === 'approved'
                      ? 'activity-icon-green'
                      : item.type === 'submission'
                      ? 'activity-icon-blue'
                      : 'activity-icon-yellow'
                  }`}
                >
                  {item.type === 'approved'   && <CheckCircle2 size={14} />}
                  {item.type === 'submission' && <Bell size={14} />}
                  {item.type === 'reviewed'   && <ClipboardList size={14} />}
                </div>
                <div>
                  <p className="activity-text">{item.text}</p>
                  <p className="activity-time">{item.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Stats */}
        <div className="card">
          <h2 className="card-title">Approval Stats</h2>
          <div className="analytics-course-list">
            {data.approvalStats.map(stat => (
              <div key={stat.courseCode} className="analytics-course-block">
                <div className="analytics-course-header">
                  <span className="analytics-course-name">{stat.courseCode}</span>
                </div>
                <div className="analytics-row-item">
                  <CheckCircle2 size={14} className="analytics-row-icon" />
                  <span className="analytics-row-label">Approved</span>
                  <span className="analytics-row-value">{stat.approved}</span>
                </div>
                <div className="analytics-row-item">
                  <ClipboardList size={14} className="analytics-row-icon" />
                  <span className="analytics-row-label">Pending</span>
                  <span className="analytics-row-value">{stat.pending}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}