import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import BackButton from '@/components/BackButton';

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

  const approvedSubmissions = submissions.filter(
    (submission) => submission.wasReviewed && submission.points > 0
  ).length;

  const pendingSubmissions = submissions.filter(
    (submission) => !submission.wasReviewed
  ).length;

  const totalPoints = submissions.reduce(
    (sum, submission) => sum + submission.points,
    0
  );

  return (
    <main className="page-container">
      <BackButton />

      <section className="section">
        <div className="card">
          <h1 className="card-title">My Progress</h1>
          <p>Track your submissions, approvals, and extra credit points.</p>
        </div>
      </section>

      <section className="section">
        <div className="dashboard-stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Submissions</p>
            <h2 className="stat-value">{totalSubmissions}</h2>
          </div>

          <div className="stat-card">
            <p className="stat-label">Approved</p>
            <h2 className="stat-value">{approvedSubmissions}</h2>
          </div>

          <div className="stat-card">
            <p className="stat-label">Pending Review</p>
            <h2 className="stat-value">{pendingSubmissions}</h2>
          </div>

          <div className="stat-card">
            <p className="stat-label">Extra Credit Points</p>
            <h2 className="stat-value">{totalPoints}</h2>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="card">
          <h2 className="card-title">Submission History</h2>

          {submissions.length === 0 ? (
            <p>You have not submitted any definitions yet.</p>
          ) : (
            <div className="term-grid">
              {submissions.map((submission) => {
                if (!submission.term) {
                  return null;
                }

                const isApproved = submission.wasReviewed && submission.points > 0;
                const isReviewedButNotApproved =
                  submission.wasReviewed && submission.points === 0;
                const isPending = !submission.wasReviewed;

                return (
                  <div key={submission.id} className="term-card">
                    <p className="term-submissions">
                      {submission.term.course.code}
                    </p>

                    <h3 className="term-name">{submission.term.word}</h3>

                    <p>{submission.definition}</p>

                    {isApproved && (
                      <span className="term-status-badge approved">
                        Approved
                      </span>
                    )}

                    {isReviewedButNotApproved && (
                      <span className="term-status-badge full">
                        Not Approved
                      </span>
                    )}

                    {isPending && (
                      <span className="term-status-badge submitted">
                        Pending Review
                      </span>
                    )}

                    <p style={{ marginTop: '10px' }}>
                      Points: {submission.points}
                    </p>

                    <div className="term-card-actions">
                      <Link
                        href={`/courses/${submission.term.course.crn}/terms/${submission.term.id}`}
                        className="btn-view-term"
                      >
                        View Term →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}