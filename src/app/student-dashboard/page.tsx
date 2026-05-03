import { auth } from '@/lib/auth';
import './dashboard.css';
import { Book, Award, FolderPlus } from 'lucide-react';
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
const uniqueSubmissions = Object.values(
  submissions.reduce((acc, submission) => {
    const key = `${submission.term?.course?.code}-${submission.term?.word}`;

    if (!submission.term?.word) return acc;

    if (!acc[key] || acc[key].createdAt < submission.createdAt) {
      acc[key] = submission;
    }

    return acc;
  }, {} as Record<string, typeof submissions[number]>)
);
const weeklyLimit = 2; // Weekly Limit
const startOfWeek = new Date();
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
startOfWeek.setHours(0, 0, 0, 0);

const weeklySubmissionCount = submissions.filter(
  (submission) => submission.createdAt >= startOfWeek
).length;

const hasReachedWeeklyLimit = weeklySubmissionCount >= weeklyLimit;
const weeklyCount = weeklySubmissionCount;
const remaining = Math.max(weeklyLimit - weeklyCount, 0);
const percent = Math.min((weeklyCount / weeklyLimit) * 100, 100);
const enrolledCount = user?.enrolledCourses.length ?? 0;
const totalSubmissions = submissions.length;
const approvedSubmissions = submissions.filter(
  (s) => s.term?.bestSubmissionId === s.id
);
const approvedCount = approvedSubmissions.length;

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

  return (
    <main className="dashboard-container">
      <section className="section">
        <h1 className="page-title">
          Student Dashboard
        </h1>
        <p className="page-subtitle">
          Track your submissions, earn extra credit, and study course glossary terms.
        </p>
      </section>
    
        {/* First Row - Available Terms to Submit */}
        <section className="section">
            {/* Available Terms to Submit */}
            <div className="card available-terms-card available-terms-full ">
                <div className="section-header">
                    <h2 className="card-title">Available Terms to Submit</h2>
                </div>

                <div className="submission-table">
                    <div className="submission-table-head">
                    <span>Term</span>
                    <span>Course</span>
                    <span>Difficulty</span>
                    <span>Status</span>
                    <span></span>
                    </div>

                    {availableTerms
                    .filter((term) => term.submissions.length < term.maxSubmissions)
                    .map((term) => { //  hide FULL terms
                        const submissionCount = term.submissions.length;
                        return (
                        <div className="submission-row" 
                            key={term.id}>
                            <span className="term-name">{term.word}</span>
                            <span className="course-pill">
                            {term.course.code}
                            </span>

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
                                <span className="slot-dot slot-gray"></span>
                            {submissionCount} / {term.maxSubmissions}
                            </span>
                            <div className="submit-btn-wrapper">
                            {!hasReachedWeeklyLimit ? (
                            <a href={`/add-definition?termId=${term.id}`} className="submit-button">
                                Submit Definition
                            </a>
                            ) : (
                            <span className="term-status-badge full">
                                Weekly limit reached
                            </span>
                            )}
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </section>

        {/* Second Row - */}
        <section className="dashboard-main-grid section">
            {/* Recent Submissions */}
            <div className="card recent-submissions-card">
                <div className="section-header">
                <div className="title-with-icon">
                    <div className="weekly-icon-circle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="6" x2="12" y2="12"/>
                        <line x1="12" y1="12" x2="16" y2="14"/>
                    </svg>
                    </div>
                    <h2 className="card-title">My Recent Submissions</h2>
                </div>
                </div>

                <div className="terms-table">
                    <div className="terms-table-head">
                        <span>Term</span>
                        <span>Course</span>
                        <span>Difficulty</span>
                        <span>Status</span>
                    </div>

                {uniqueSubmissions.length === 0 ? (
                <p>No submissions yet</p>
                ) : (
                    uniqueSubmissions.map((submission) => {
                    const isWinner = submission.term?.bestSubmissionId === submission.id;

                    return (
                    <div className="terms-row" key={submission.id}>
                        <span className="term-name">
                        {submission.term?.word ?? 'Unknown Term'}
                        </span>

                        <span className="course-pill">
                        {submission.term?.course?.code ?? 'No Course'}
                        </span>

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
                    {remaining > 0
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
                    {Math.min(weeklyCount, weeklyLimit)} / {weeklyLimit}
                    </span>
                </div>
                </div>
            </div>

            {/* Extra Credit Card */}  
            <div className="card extra-card">
            <div className="extra-header">
                <div className="extra-title-wrap">
                <div className="extra-icon">
                    <Award size={18} />
                </div>
                <h2 className="card-title">Extra Credit Earned</h2>
                </div>
            </div>

            <p className="extra-points">{totalPoints} point{totalPoints !== 1 ? 's' : ''}</p>

            <p className="extra-sub">
                {approvedSubmissions.length} approved submission{approvedSubmissions.length !== 1 ? 's' : ''}
            </p>
            </div>
        </section>
      
        {/* Third Row - Enrolled Courses + Notifications */}
        <section className="dashboard-secondary-grid section">
            {/* Enrolled courses */}
            <div className="card available-terms-card">
                <div className="course-card-header">
                    <div className="course-icon-circle">
                        <Book size={18} />
                    </div>
                    <h2 className="card-title">Enrolled Courses</h2>
                </div>

                <div className="course-divider"></div>

                <div className="course-content">
                {user?.enrolledCourses.length === 0 ? (
                    <p>No courses yet</p>
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
                        <Link href="/courses/join" className="course-btn course-btn-add">+ Add Course</Link>
                </div>
            </div>
            {/* Notifications */}
            <div className="card notifications-card">
                <div className="section-header">
                    <h2 className="card-title">Notifications</h2>
                </div>
                <div className="notif-list">
                {notifications.length === 0 ? (
                    <p>No notifications yet.</p>
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

        {/* Fourth Row - Quick Actions */}
        <section className="section">
            <div className="card">
                <h2 className="card-title">Quick Study Actions</h2>

                <div className="quick-actions-grid">

                
                <a href="/student-dashboard" className="quick-action-item">
                    <div className="quick-action-icon">
                    <Book size={18} />
                    </div>
                    <div>
                    <p className="quick-action-title">View Official Glossary</p>
                    <p className="quick-action-sub">
                        {enrolledCount} course{enrolledCount !== 1 ? 's' : ''} enrolled
                    </p>
                    </div>
                </a>

                
                <a href="/flashcards" className="quick-action-item">
                    <div className="quick-action-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    </div>
                    <div>
                    <p className="quick-action-title">Open Flashcards</p>
                    <p className="quick-action-sub">
                        Based on your submitted terms
                    </p>
                    </div>
                </a>

                
                <a href="/bookmarks" className="quick-action-item">
                    <div className="quick-action-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                    </div>
                    <div>
                    <p className="quick-action-title">View Bookmarks</p>
                    <p className="quick-action-sub">
                        {approvedCount} approved submission{approvedCount !== 1 ? 's' : ''}
                    </p>
                    </div>
                </a>

                
                <a href="/study-set" className="quick-action-item">
                    <div className="quick-action-icon">
                    <FolderPlus size={18} />
                    </div>
                    <div>
                    <p className="quick-action-title">Create Study Set</p>
                    <p className="quick-action-sub">
                        From {totalSubmissions} total submission{totalSubmissions !== 1 ? 's' : ''}
                    </p>
                    </div>
                </a>

                </div>
            </div>
        </section>
    </main>
  );
}