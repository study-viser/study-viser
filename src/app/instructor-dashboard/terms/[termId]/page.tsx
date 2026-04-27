import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getTermById, getSubmissionsByTerm } from '@/lib/dbActions';
import { CheckCircle2, Lock, Clock, BookOpen } from 'lucide-react';
import SubmissionReviewCard from '@/components/SubmissionReviewCard';

export default async function TermReviewPage({ params }: { params: Promise<{ termId: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return <p>Not logged in.</p>;

  const { termId } = await params;
  const term = await getTermById(termId);
  if (!term) return <p>Term not found.</p>;

  const submissions = await getSubmissionsByTerm(termId) ?? [];
  const status = term.bestSubmissionId ? 'approved' : submissions.length >= term.maxSubmissions ? 'cap-reached' : 'pending';

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <Link
        href={`/instructor-dashboard/courses/${term.courseCRN}`}
        style={{ color: '#2f5da8', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
      >
        ← Back to Course
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0 4px' }}>
        <BookOpen size={24} style={{ color: '#6DB089' }} />
        <h1 style={{ fontFamily: 'Belanosima, sans-serif', fontSize: '36px', color: '#2E7D32', margin: 0 }}>
          {term.word}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <span style={{ color: '#6B7280', fontSize: '15px' }}>
          {term.week ? `Week ${term.week}` : 'No week assigned'} — {submissions.length}/{term.maxSubmissions} submissions
        </span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '999px',
          ...(status === 'approved' ? { background: '#DCFCE7', color: '#15803D' } :
            status === 'cap-reached' ? { background: '#FEF9C3', color: '#A16207' } :
            { background: '#F1F5F9', color: '#64748B' })
        }}>
          {status === 'approved' && <><CheckCircle2 size={12} /> Approved</>}
          {status === 'cap-reached' && <><Lock size={12} /> Cap Reached</>}
          {status === 'pending' && <><Clock size={12} /> Pending</>}
        </span>
      </div>

      <h2 style={{ fontFamily: 'Belanosima, sans-serif', fontSize: '20px', color: '#1F2937', marginBottom: '16px' }}>
        Submissions
      </h2>

      {submissions.length === 0 && (
        <p style={{ color: '#6B7280' }}>No submissions yet for this term.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {submissions.map(submission => (
          <SubmissionReviewCard
            key={submission.id}
            submission={submission}
            termId={term.id}
            isWinner={submission.id === term.bestSubmissionId}
          />
        ))}
      </div>
    </main>
  );
}