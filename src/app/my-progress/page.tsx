import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import BackButton from '@/components/BackButton';
import '@/styles/student-course.css';

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
          <p>Extra Credit Points</p>
          <h2>{totalPoints}</h2>
        </div>
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