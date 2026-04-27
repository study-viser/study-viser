'use client';

import { useState } from 'react';
import { reviewSubmission, approveSubmission, clearTermApproval } from '@/lib/dbActions';
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

  const handleReview = async () => {
    setLoading(true);
    await reviewSubmission(submission.id);
    router.refresh();
    setLoading(false);
  };

  const handleApprove = async () => {
    setLoading(true);
    await approveSubmission(termId, submission.id);
    router.refresh();
    setLoading(false);
  };

  const handleClear = async () => {
    setLoading(true);
    await clearTermApproval(termId, submission.id);
    router.refresh();
    setLoading(false);
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
          position: 'absolute', top: '12px', right: '12px',
          display: 'flex', alignItems: 'center', gap: '5px',
          background: '#DCFCE7', color: '#15803D',
          fontSize: '12px', fontWeight: 600,
          padding: '4px 10px', borderRadius: '999px',
        }}>
          <Award size={12} /> Winner
        </div>
      )}

      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontWeight: 700, fontSize: '15px', color: '#1F2937' }}>
          {submission.creator.name}
        </span>
        <span style={{ color: '#9CA3AF', fontSize: '13px', marginLeft: '8px' }}>
          {submission.creator.email}
        </span>
      </div>

      <p style={{
        fontSize: '15px', color: '#374151', lineHeight: '1.6',
        marginBottom: '16px', whiteSpace: 'pre-wrap'
      }}>
        {submission.definition}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {submission.wasReviewed ? (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              color: '#15803D', fontSize: '13px', fontWeight: 600
            }}>
              <CheckCircle2 size={14} /> Reviewed — {submission.points} pts
            </span>
          ) : (
            <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Not yet reviewed</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {!submission.wasReviewed && (
            <button
              onClick={handleReview}
              disabled={loading}
              style={{
                background: '#F1F5F9', color: '#374151',
                border: '1px solid #E5E7EB', borderRadius: '8px',
                padding: '7px 14px', fontSize: '13px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              Mark Reviewed
            </button>
          )}

          {submission.wasReviewed && !isWinner && (
            <button
              onClick={handleApprove}
              disabled={loading}
              style={{
                background: '#6DB089', color: '#ffffff',
                border: 'none', borderRadius: '8px',
                padding: '7px 14px', fontSize: '13px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              Set as Winner
            </button>
          )}

          {isWinner && (
            <button
              onClick={handleClear}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'none', color: '#C65A5A',
                border: '1px solid #C65A5A', borderRadius: '8px',
                padding: '7px 14px', fontSize: '13px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              <RotateCcw size={13} /> Undo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}