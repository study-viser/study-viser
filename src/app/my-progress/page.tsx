import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import BackButton from '@/components/BackButton';
import '@/styles/progress.css';

export default async function MyProgressPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const submissions = await prisma.submission.findMany({
    where: {
      creatorId: userId,
      termId: {
        not: null,
      },
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

  const totalSubmissions = submissions.length;
  const approvedSubmissions = submissions.filter((s) => s.wasReviewed && s.points > 0).length;
  const pendingSubmissions = submissions.filter((s) => !s.wasReviewed).length;
  const totalPoints = submissions.reduce((sum, s) => sum + s.points, 0);

  // Per-course extra credit breakdown
  const pointsByCourse = submissions
    .filter((s) => s.wasReviewed && s.points > 0 && s.term?.course)
    .reduce((acc, s) => {
      const course = s.term!.course;
      const key = course.crn;
      if (!acc[key]) {
        acc[key] = { code: course.code, name: course.title, points: 0, approved: 0 };
      }
      acc[key].points += s.points;
      acc[key].approved += 1;
      return acc;
    }, {} as Record<number, { code: string; name: string; points: number; approved: number }>);

  const coursePointsList = Object.values(pointsByCourse);

  return (
    <main className="progress-page">
      <BackButton />

      <section className="progress-header">
        <p className="progress-eyebrow">Student Progress</p>
        <h1>My Progress</h1>
        <p>
          Track your submitted definitions, approval status, and extra credit points.
        </p>
      </section>

      <section className="progress-stats-grid">
        <div className="progress-stat-card">
          <p>Total Submissions</p>
          <h2>{totalSubmissions}</h2>
        </div>

        <div className="progress-stat-card approved">
          <p>Approved</p>
          <h2>{approvedSubmissions}</h2>
        </div>

        <div className="progress-stat-card pending">
          <p>Pending Review</p>
          <h2>{pendingSubmissions}</h2>
        </div>

        <div className="progress-stat-card points">
          <p>Total Extra Credit</p>
          <h2>{totalPoints}</h2>
        </div>
      </section>

      <section className="progress-section" style={{ marginBottom: '24px' }}>
        <div className="progress-section-header">
          <div>
            <h2>Extra Credit by Course</h2>
            <p>Your extra credit points broken down per enrolled course.</p>
          </div>
        </div>

        {coursePointsList.length === 0 ? (
          <div className="progress-empty">
            <h3>No extra credit yet</h3>
            <p>Get a definition approved to start earning points.</p>
          </div>
        ) : (
          <div className="ec-course-list">
            {coursePointsList.map((course) => (
              <div key={course.code} className="ec-course-row">
                <div className="ec-course-info">
                  <span className="ec-course-code">{course.code}</span>
                  <span className="ec-course-name">{course.name}</span>
                </div>
                <div className="ec-course-right">
                  <span className="ec-course-approved">
                    {course.approved} approved submission{course.approved !== 1 ? 's' : ''}
                  </span>
                  <span className="ec-course-points">
                    {course.points} pt{course.points !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
            <div className="ec-course-row ec-total-row">
              <div className="ec-course-info">
                <span className="ec-course-code">All Courses</span>
              </div>
              <div className="ec-course-right">
                <span className="ec-course-points ec-total-points">
                  {totalPoints} pt{totalPoints !== 1 ? 's' : ''} total
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="progress-section">
        <div className="progress-section-header">
          <div>
            <h2>Submission History</h2>
            <p>Your most recent definition submissions.</p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="progress-empty">
            <h3>No submissions yet</h3>
            <p>Submit a definition from a course page to start earning points.</p>
          </div>
        ) : (
          <div className="progress-list">
            {submissions.map((submission) => {
              if (!submission.term) return null;

              const isApproved = submission.wasReviewed && submission.points > 0;
              const isNotApproved = submission.wasReviewed && submission.points === 0;
              const isPending = !submission.wasReviewed;

              return (
                <div key={submission.id} className="progress-submission-card">
                  <div className="progress-submission-main">
                    <div>
                      <p className="progress-course-label">
                        {submission.term.course.code}
                      </p>

                      <h3>{submission.term.word}</h3>

                      <p className="progress-definition">
                        {submission.definition}
                      </p>
                    </div>

                    <div className="progress-status-area">
                      {isApproved && (
                        <span className="term-status-badge approved">Approved</span>
                      )}

                      {isNotApproved && (
                        <span className="term-status-badge full">Not Approved</span>
                      )}

                      {isPending && (
                        <span className="term-status-badge submitted">Pending</span>
                      )}

                      <span className="progress-points">
                        {submission.points} pts
                      </span>
                    </div>
                  </div>

                  <div className="progress-card-footer">
                    <span>
                      Submitted {new Date(submission.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}