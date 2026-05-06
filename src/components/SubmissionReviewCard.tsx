'use client';

import { useState } from 'react';
import { CheckCircle2, Award, RotateCcw, UserCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '@/app/instructor-dashboard/dashboard.css';

type Submission = {
  id: string;
  definition: string;
  wasReviewed: boolean;
  points: number;
};

type Props = {
  submission: Submission;
  termId: string;
  isWinner: boolean;
  /** 1-based display index shown in place of the student's name */
  index: number;
};

export default function SubmissionReviewCard({ submission, termId, isWinner, index }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const postAction = async (url: string, body: object) => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Action failed.');

      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleReview = () =>
    postAction('/api/submissions/review', { submissionId: submission.id });

  const handleApprove = () =>
    postAction('/api/submissions/approve', { termId, submissionId: submission.id });

  const handleClear = () =>
    postAction('/api/submissions/clear-approval', { termId, submissionId: submission.id });

  const cardVariant = isWinner
    ? 'review-card-winner'
    : submission.wasReviewed
    ? 'review-card-reviewed'
    : 'review-card-pending';

  return (
    <div className={`review-card ${cardVariant}`}>

      {/* Winner badge */}
      {isWinner && (
        <div className="review-card-winner-badge">
          <Award size={12} /> Winner
        </div>
      )}

      {/* Anonymous label */}
      <div className="review-card-anon-label">
        <UserCircle2 size={14} />
        <span>Submission {index}</span>
      </div>

      {/* Definition */}
      <p className="review-card-definition">
        {submission.definition}
      </p>

      {/* Footer */}
      <div className="review-card-footer">
        <div>
          {submission.wasReviewed ? (
            <span className="review-card-status-reviewed">
              <CheckCircle2 size={14} /> Reviewed — {submission.points} pts
            </span>
          ) : (
            <span className="review-card-status-pending">Not yet reviewed</span>
          )}
        </div>

        <div className="review-card-actions">
          {!submission.wasReviewed && (
            <button
              className="review-btn review-btn-mark"
              onClick={handleReview}
              disabled={loading}
            >
              Mark Reviewed
            </button>
          )}

          {submission.wasReviewed && !isWinner && (
            <button
              className="review-btn review-btn-approve"
              onClick={handleApprove}
              disabled={loading}
            >
              Set as Winner
            </button>
          )}

          {isWinner && (
            <button
              className="review-btn review-btn-undo"
              onClick={handleClear}
              disabled={loading}
            >
              <RotateCcw size={13} /> Undo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}