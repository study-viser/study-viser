'use client';

import { useState } from 'react';
import { CheckCircle2, Award, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Submission = {
  id: string;
  definition: string;
  wasReviewed: boolean;
  points: number;
  creator: { name: string; email: string };
};

type Props = {
  submission: Submission;
  termId: string;
  isWinner: boolean;
};

export default function SubmissionReviewCard({ submission, termId, isWinner }: Props) {
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

      if (!res.ok) {
        throw new Error('Action failed.');
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleReview = () => {
    postAction('/api/submissions/review', {
      submissionId: submission.id,
    });
  };

  const handleApprove = () => {
    postAction('/api/submissions/approve', {
      termId,
      submissionId: submission.id,
    });
  };

  const handleClear = () => {
    postAction('/api/submissions/clear-approval', {
      termId,
      submissionId: submission.id,
    });
  };

  return (
    <div style={{
      border: `2px solid ${isWinner ? '#6DB089' : submission.wasReviewed ? '#E5E7EB' : '#F3F4F6'}`,
      borderRadius: '12px',
      padding: '20px',
      background: isWinner ? '#F0FFF4' : '#ffffff',
      position: 'relative',
    }}>
      {isWinner && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: '#DCFCE7',
          color: '#15803D',
          fontSize: '12px',
          fontWeight: 600,
          padding: '4px 10px',
          borderRadius: '999px',
        }}>
          <Award size={12} /> Winner
        </div>
      )}

      <p style={{
        fontSize: '15px',
        color: '#374151',
        lineHeight: '1.6',
        marginBottom: '16px',
        whiteSpace: 'pre-wrap',
      }}>
        {submission.definition}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {submission.wasReviewed ? (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#15803D',
              fontSize: '13px',
              fontWeight: 600,
            }}>
              <CheckCircle2 size={14} /> Reviewed — {submission.points} pts
            </span>
          ) : (
            <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Not yet reviewed</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {!submission.wasReviewed && (
            <button onClick={handleReview} disabled={loading}>
              Mark Reviewed
            </button>
          )}

          {submission.wasReviewed && !isWinner && (
            <button onClick={handleApprove} disabled={loading}>
              Set as Winner
            </button>
          )}

          {isWinner && (
            <button onClick={handleClear} disabled={loading}>
              <RotateCcw size={13} /> Undo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}