'use client';

import Link from 'next/link';
import '@/styles/term-view.css';

type TermViewProps = {
  crn: number;
  term: {
    id: string;
    word: string;
    difficulty: 'Basic' | 'Moderate' | 'Advanced';
    imageRequired: boolean;
    maxSubmissions: number;
    week: number | null;
    referenceDefinition: string | null;
    course: {
      code: string;
      title: string;
    };
    bestSubmission: {
      id: string;
      definition: string;
      points: number;
      creator: {
        name: string;
      };
    } | null;
    submissions: {
      id: string;
      definition: string;
      wasReviewed: boolean;
      points: number;
      creator: {
        name: string;
      };
    }[];
  };
};

export default function TermView({ term, crn }: TermViewProps) {
  const approvedSubmission = term.bestSubmission;
  const otherSubmissions = term.submissions.filter(
    (submission) => submission.id !== term.bestSubmission?.id
  );

  const isFull = term.submissions.length >= term.maxSubmissions;
  const canSubmit = !isFull;

  return (
    <div className="term-view-page">
      <Link href={`/student-course/${crn}`} className="term-back-link">
        ← Back to {term.course.code}
      </Link>

      <div className="term-view-header">
        <div className="term-view-meta">
          <span className="term-view-week">
            Week {term.week ?? 'N/A'}
          </span>

          <span className={`term-view-difficulty difficulty-${term.difficulty.toLowerCase()}`}>
            {term.difficulty}
          </span>

          {term.imageRequired && (
            <span className="term-view-visual">🖼 Requires Visual</span>
          )}
        </div>

        <h1 className="term-view-title">{term.word}</h1>

        {term.referenceDefinition && (
          <div className="reference-box">
            <p className="reference-title">Instructor Reference / Context</p>
            <p className="reference-text">{term.referenceDefinition}</p>
          </div>
        )}

        <div className="term-view-cap">
          <div className="term-cap-bar-wrap">
            <div
              className="term-cap-bar-fill"
              style={{
                width: `${Math.min(
                  (term.submissions.length / term.maxSubmissions) * 100,
                  100
                )}%`,
              }}
            />
          </div>

          <span className="term-cap-text">
            {term.submissions.length} / {term.maxSubmissions} submissions
          </span>
        </div>

        {canSubmit ? (
          <Link href={`/add-definition?termId=${term.id}`} className="term-submit-btn">
            Submit Definition
          </Link>
        ) : (
          <span className="term-status-notice full">
            Submissions are closed for this term
          </span>
        )}
      </div>

      <hr className="term-divider" />

      <section className="term-section">
        <h2 className="term-section-title">✅ Approved Definition</h2>

        {approvedSubmission ? (
          <div className="submission-card submission-card--approved">
            <p className="submission-definition">{approvedSubmission.definition}</p>
            <div className="submission-footer">
              <span className="submission-author">
                — {approvedSubmission.creator.name}
              </span>
              <span className="submission-points">
                {approvedSubmission.points} pts
              </span>
            </div>
          </div>
        ) : (
          <p className="term-no-approved">No approved definition yet.</p>
        )}
      </section>

      {otherSubmissions.length > 0 && (
        <section className="term-section">
          <h2 className="term-section-title">
            Other Submissions ({otherSubmissions.length})
          </h2>

          <div className="submission-list">
            {otherSubmissions.map((submission) => (
              <div key={submission.id} className="submission-card">
                <p className="submission-definition">{submission.definition}</p>
                <div className="submission-footer">
                  <span className="submission-author">
                    — {submission.creator.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}