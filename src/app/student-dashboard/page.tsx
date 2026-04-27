import { auth } from '@/lib/auth';
import './dashboard.css';
import { Book, Award } from 'lucide-react' // Add FolderPlus to imports when you add the study set card back in
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

const weeklyLimit = 2; // Weekly Limit
const startOfWeek = new Date();
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
startOfWeek.setHours(0, 0, 0, 0);

const weeklySubmissionCount = submissions.filter(
  (submission) => submission.createdAt >= startOfWeek
).length;

const hasReachedWeeklyLimit = weeklySubmissionCount >= weeklyLimit;
const weeklyCount = submissions.length;
const remaining = Math.max(weeklyLimit - weeklyCount, 0);
const percent = Math.min((weeklyCount / weeklyLimit) * 100, 100);
// const enrolledCount = user?.enrolledCourses.length ?? 0;
// const totalSubmissions = submissions.length;
const approvedSubmissions = submissions.filter(
  (s) => s.term?.bestSubmissionId === s.id
);
// const approvedCount = approvedSubmissions.length;
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

        {/* Recent Submissions */}
      <section className="grid-2 section">
        <div className="card">
            <div className="section-header">
                <h2 className="card-title">My Recent Submissions</h2>
                <a href="#" className="view-all">View All</a>
            </div>

            <div className="terms-table">
                <div className="terms-table-head">
                    <span>Term</span>
                    <span>Course</span>
                    <span>Difficulty</span>
                    <span>Status</span>
                </div>

            {submissions.length === 0 ? (
            <p>No submissions yet</p>
            ) : (
            submissions.map((submission) => {
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
                {weeklyCount} / {weeklyLimit}
                </span>
            </div>
            </div>
        </div>

        {/* Available Terms to Submit */}
        <div className="card">
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

    {/* Enrolled courses */}
      <section className="grid-3 section">
        <div className="card">
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

        {/* Weekly Submission Progress */}
        <div className="card weekly-card">
            <div className="weekly-header">
                <div className="weekly-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="6" x2="12" y2="12"/>
                    <line x1="12" y1="12" x2="16" y2="14"/>
                </svg>
                </div>
                <h2 className="card-title weekly-title">Weekly Submission Progress</h2>
            </div>

             <div className="weekly-progress-bar-wrap">
            <div className="weekly-progress-bar">
            <div className="weekly-progress-fill" style={{ width: `${percent}%` }} />
            </div>
        </div>

        <p className="weekly-desc">
            <strong>{weeklyCount} of {weeklyLimit}</strong> definitions submitted this week.
        </p>

        <p className="weekly-sub">
            {remaining > 0
            ? `You can submit ${remaining} more definition${remaining > 1 ? 's' : ''} this week.`
            : 'You’ve reached your weekly limit.'}
        </p>

        <div className="weekly-footer">
            <a href="/student-dashboard" className="weekly-submit-btn">
            View Available Terms
            </a>
        </div>
        </div>
      </section>
      
      <section className="grid-2-bottom section">


        {/* 
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

        
        <div className="card">
            <div className="section-header">
                <h2 className="card-title">Notifications</h2>
                <a href="#" className="view-all">View All &gt;</a>
            </div>

            <div className="notif-list">
                <div className="notif-item">
                    <div className="notif-icon notif-success">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    </div>
                    <p className="notif-text">
                    Your definition for <strong>&apos;Algorithm&apos;</strong> was approved.
                    </p>
                    <span className="notif-time">4h ago</span>
                </div>

                <div className="notif-item">
                    <div className="notif-icon notif-warning">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    </div>
                    <p className="notif-text">
                    The term <strong>&apos;API&apos;</strong> has reached its submission cap.
                    </p>
                    <span className="notif-time">1d ago</span>
                </div>
            </div>
        </div>
        */}
      </section>
    </main>
  );
}