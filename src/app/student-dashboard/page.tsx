import { auth } from '@/lib/auth';
import './dashboard.css';
import { Book, Award } from 'lucide-react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Difficulty } from '@/generated/prisma/enums';
import ExitCourseButton from '@/components/ExitCourseButton';

export default async function StudentDashboardPage() {
  const session = await auth();

    if (!session?.user?.email) {
    redirect('/auth/signin');
    }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
        enrolledCourses: {
        include: {
            instructor: true,
        },
        },
    },
  });

if (!user?.id) {
  return <p>User not found</p>;
}
const submissions = await prisma.submission.findMany({
  where: {
    creatorId: user.id,
  },
  include: {
    term: {
      include: {
        course: true,
      },
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
});

const availableTerms = await prisma.term.findMany({
  where: {
    course: {
      students: {
        some: {
          id: user?.id,
        },
      },
    },
  },
  include: {
    course: true,
    submissions: true,
  },
  orderBy: {
    coveredOn: 'desc',
  },
});

const recentSubmissions = submissions;

const weeklyLimit = 2;

const startOfWeek = new Date();
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
startOfWeek.setHours(0, 0, 0, 0);

const weeklyCountsByCourse = submissions.reduce((acc, submission) => {
  const courseCRN = submission.term?.course?.crn;

  if (!courseCRN) return acc;
  if (submission.createdAt < startOfWeek) return acc;

  acc[courseCRN] = (acc[courseCRN] ?? 0) + 1;

  return acc;
}, {} as Record<number, number>);

const totalWeeklySubmissionCount = Object.values(weeklyCountsByCourse).reduce(
  (sum, count) => sum + Math.min(count, weeklyLimit),
  0
);

const maxWeeklySubmissions = user.enrolledCourses.length * weeklyLimit;

const hasReachedWeeklyLimit =
  maxWeeklySubmissions > 0 &&
  totalWeeklySubmissionCount >= maxWeeklySubmissions;

const weeklyCount = totalWeeklySubmissionCount;
const remaining = Math.max(maxWeeklySubmissions - weeklyCount, 0);

const percent =
  maxWeeklySubmissions > 0
    ? Math.min((totalWeeklySubmissionCount / maxWeeklySubmissions) * 100, 100)
    : 0;
    
const approvedSubmissions = submissions.filter(
  (s) => s.wasReviewed && s.points > 0
);

const notifications = [
  ...approvedSubmissions.map((submission) => ({
    type: 'success',
    message: `Your definition for '${submission.term?.word ?? 'a term'}' was approved.`,
    time: 'Approved',
  })),

  ...(hasReachedWeeklyLimit
    ? [
        {
          type: 'warning',
          message: 'You have reached your weekly submission limit.',
          time: 'This week',
        },
      ]
    : []),

  ...availableTerms
    .filter((term) => term.submissions.length >= term.maxSubmissions)
    .map((term) => ({
      type: 'warning',
      message: `The term '${term.word}' has reached its submission cap.`,
      time: 'Full',
    })),
].slice(0, 5);

const totalPoints = approvedSubmissions.reduce(
  (sum, s) => sum + s.points,
  0
);

// Per-course extra credit breakdown
const pointsByCourse = approvedSubmissions.reduce((acc, s) => {
  const course = s.term?.course;
  if (!course) return acc;
  const key = course.crn;
  if (!acc[key]) acc[key] = { code: course.code, name: course.name, points: 0 };
  acc[key].points += s.points;
  return acc;
}, {} as Record<number, { code: string; name: string; points: number }>);

const coursePointsList = Object.values(pointsByCourse);

  return (
    <main className="dashboard-container">
      <section className="dashboard-section">
        <h1 className="page-title">
          Student Dashboard
        </h1>
        <p className="page-subtitle">
          Track your submissions, earn extra credit, and study course glossary terms.
        </p>
      </section>
    
        {/* First Row - Available Terms to Submit */}
        <section className="dashboard-section">
            {/* Available Terms to Submit */}
            <div className="dashboard-card available-terms-card available-terms-full ">
                <div className="dashboard-section-header">
                    <h2 className="dashboard-card-title">Available Terms to Submit</h2>
                </div>

                <div className="submission-table">
                    <div className="submission-table-head">
                    <span>Term</span>
                    <span>Course</span>
                    <span>Difficulty</span>
                    <span>Status</span>
                    <span></span>
                    </div>
                
                <div className="submission-table-body">
                    {availableTerms
                    .filter((term) => term.submissions.length < term.maxSubmissions)
                        .map((term) => { //  hide FULL terms
                            const submissionCount = term.submissions.length;
                             const courseWeeklyCount = weeklyCountsByCourse[term.course.crn] ?? 0;
                            const hasReachedCourseWeeklyLimit = courseWeeklyCount >= weeklyLimit;

                            return (
                            <div className="submission-row" 
                                key={term.id}>
                                <span className="dashboard-term-name">{term.word}</span>
                                <Link
                                href={`/student-course/${term.course.crn}`}
                                className="course-pill"
                                >
                                {term.course.code}
                                </Link>

                                <span
                                className={`difficulty-badge ${
                                    term.difficulty === Difficulty.Basic
                                    ? 'difficulty-basic'
                                    : term.difficulty === Difficulty.Moderate
                                        ? 'difficulty-moderate'
                                        : term.difficulty === Difficulty.Advanced
                                        ? 'difficulty-advanced'
                                        : ''
                                }`}
                                >
                                    
                                {term.difficulty
                                    ? term.difficulty.charAt(0) +
                                    term.difficulty.slice(1).toLowerCase()
                                    : '—'}
                                </span>
                                <span className="slot-status">
                                <span className="slot-bar">
                                    <span
                                    className="slot-fill"
                                    style={{
                                        width: `${Math.min((submissionCount / term.maxSubmissions) * 100, 100)}%`,
                                    }}
                                    />
                                </span>

                                <span>
                                    {submissionCount} / {term.maxSubmissions}
                                </span>
                                </span>
                                <div className="submit-btn-wrapper">
                                {!hasReachedCourseWeeklyLimit ? (
                                <a href={`/add-definition?termId=${term.id}`} className="submit-button">
                                    Submit Definition
                                </a>
                                ) : (
                                <span className="term-status-badge full">
                                    Course weekly limit reached
                                </span>
                                )}
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>

        {/* Second Row - */}
        <section className="dashboard-main-grid dashboard-section">
            {/* Recent Submissions */}
            <div className="dashboard-card recent-submissions-card">
                <div className="dashboard-section-header">
                <div className="title-with-icon">
                    <div className="weekly-icon-circle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="6" x2="12" y2="12"/>
                        <line x1="12" y1="12" x2="16" y2="14"/>
                    </svg>
                    </div>
                    <h2 className="dashboard-card-title">My Recent Submissions</h2>
                </div>
                </div>

                <div className="terms-table">
                    <div className="terms-table-head">
                        <span>Term</span>
                        <span>Course</span>
                        <span>Difficulty</span>
                        <span>Status</span>
                    </div>

                {recentSubmissions.length === 0 ? (
                <p className="text-muted px-3 pt-3">No submissions yet.</p>
                ) : (
                    recentSubmissions.map((submission) => {
                    const isWinner = submission.term?.bestSubmissionId === submission.id;

                    return (
                    <div className="terms-row" key={submission.id}>
                        <span className="dashboard-term-name">
                        {submission.term?.word ?? 'Unknown Term'}
                        </span>

                        {submission.term?.course ? (
                        <Link
                            href={`/student-course/${submission.term.course.crn}`}
                            className="course-pill"
                        >
                            {submission.term.course.code}
                        </Link>
                        ) : (
                        <span className="course-pill">No Course</span>
                        )}

                        <span
                        className={`difficulty-badge ${
                            submission.term?.difficulty === Difficulty.Basic
                            ? 'difficulty-basic'
                            : submission.term?.difficulty === Difficulty.Moderate
                                ? 'difficulty-moderate'
                                : submission.term?.difficulty === Difficulty.Advanced
                                ? 'difficulty-advanced'
                                : ''
                        }`}
                        >
                        {submission.term?.difficulty
                            ? submission.term.difficulty.charAt(0) +
                            submission.term.difficulty.slice(1).toLowerCase()
                            : '—'}
                        </span>

                        <span
                        className={`status-pill ${
                            isWinner
                            ? 'status-approved'
                            : submission.wasReviewed
                            ? 'status-reviewed'
                            : 'status-pending'
                        }`}
                        >
                        {isWinner
                            ? 'Winner'
                            : submission.wasReviewed
                            ? 'Reviewed'
                            : 'Pending'}
                        </span>
                    </div>
                    );
                    })
                )}
                </div>

                <div className="terms-footer">
                  <span>
                    {recentSubmissions.length === 0
                      ? ''
                      : remaining > 0
                      ? `You can submit ${remaining} more definition${remaining > 1 ? 's' : ''} this week.`
                      : `You’ve reached your weekly limit.`}
                  </span>

                <div className="progress-wrap">
                    <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${percent}%` }}
                    />
                    </div>

                    <span className="progress-text">
                    {weeklyCount} / {maxWeeklySubmissions}
                    </span>
                </div>
                </div>
            </div>

            {/* Extra Credit Card */}
            <div className="dashboard-card extra-card">
              <div className="extra-header">
                <div className="extra-title-wrap">
                  <div className="extra-icon">
                    <Award size={18} />
                  </div>
                  <h2 className="dashboard-card-title">Extra Credit Earned</h2>
                </div>
              </div>

              <p className="extra-points">
                {totalPoints} point{totalPoints !== 1 ? 's' : ''}
              </p>

              <p className="extra-sub">
                {approvedSubmissions.length} approved submission
                {approvedSubmissions.length !== 1 ? 's' : ''}
              </p>

              {coursePointsList.length > 0 && (
                <div className="extra-course-breakdown">
                  {coursePointsList.map((c) => (
                    <div key={c.code} className="extra-course-row">
                      <span className="extra-course-code">{c.code}</span>
                      <span className="extra-course-pts">
                        {c.points} pt{c.points !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </section>
      
        {/* Third Row - Enrolled Courses + Notifications */}
        <section className="dashboard-secondary-grid dashboard-section">
            {/* Enrolled courses */}
            <div className="dashboard-card available-terms-card">
                <div className="course-card-header">
                    <div className="course-icon-circle">
                        <Book size={18} />
                    </div>
                    <h2 className="dashboard-card-title">Enrolled Courses</h2>
                </div>

                <div className="course-divider"></div>

                <div className="course-content">
                {user?.enrolledCourses.length === 0 ? (
                    <p className="text-muted">No courses yet.</p>
                ) : (
                    user?.enrolledCourses.map((course) => (
                    <div className="course-item-wrapper" key={course.crn}>
                    <Link
                        href={`/student-course/${course.crn}`}
                        className="course-item course-link"
                    >
                        <span className="course-bullet">•</span>
                        <span>
                        <strong>{course.code}: {course.title}</strong>
                        </span>
                    </Link>

                    <ExitCourseButton crn={course.crn} userId={user.id} />
                    </div>
                    ))
                )}
                </div>

                <div className="course-actions">
                        <Link href="/courses/join" className="course-btn course-btn-add">Join Course</Link>
                </div>
            </div>
            {/* Notifications */}
            <div className="dashboard-card notifications-card">
                <div className="dashboard-section-header">
                    <h2 className="dashboard-card-title">Notifications</h2>
                </div>

                <div className="course-divider"></div>

                <div className="notif-list">
                {notifications.length === 0 ? (
                    <p className="text-muted">No notifications yet.</p>
                ) : (
                    notifications.map((notification, index) => (
                    <div className="notif-item" key={index}>
                        <div
                        className={`notif-icon ${
                            notification.type === 'success'
                            ? 'notif-success'
                            : 'notif-warning'
                        }`}
                        >
                        {notification.type === 'success' ? '✓' : '!'}
                        </div>

                        <p className="notif-text">{notification.message}</p>

                        <span className="notif-time">{notification.time}</span>
                    </div>
                    ))
                )}
                </div>
            </div>
        </section>

    </main>
  );
}