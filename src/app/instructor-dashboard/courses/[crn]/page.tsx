import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getCourseBycrn, getTermsByCourse } from '@/lib/dbActions';
import { ChevronRight, BookOpen, CheckCircle2, Lock, Clock, PlusCircle } from 'lucide-react';

function getTermStatus(term: { submissions: any[]; maxSubmissions: number; bestSubmissionId: string | null }) {
  if (term.bestSubmissionId) return 'approved';
  if (term.submissions.length >= term.maxSubmissions) return 'cap-reached';
  return 'pending';
}

export default async function CoursePage({ params }: { params: Promise<{ crn: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return <p>Not logged in.</p>;

  const { crn: crnParam } = await params;
  const crn = parseInt(crnParam);

  const course = await getCourseBycrn(crn);
  if (!course) return <p>Course not found.</p>;

  const terms = await getTermsByCourse(crn) ?? [];

  // Group terms by week
  const termsByWeek = terms.reduce((acc, term) => {
    const week = term.week ?? 0;
    if (!acc[week]) acc[week] = [];
    acc[week].push(term);
    return acc;
  }, {} as Record<number, typeof terms>);

  const sortedWeeks = Object.keys(termsByWeek).map(Number).sort((a, b) => a - b);

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', fontFamily: 'Inter, sans-serif' }}>
      <Link href="/instructor-dashboard" style={{ color: '#2f5da8', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
        ← Back to Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '16px 0 4px' }}>
        <div>
            <h1 style={{ fontFamily: 'Belanosima, sans-serif', fontSize: '36px', color: '#2E7D32', margin: '0 0 4px' }}>
            {course.code}
            </h1>
            <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '32px' }}>{course.title}</p>
        </div>
        <Link
            href={`/add-term?crn=${crn}`}
            style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#6DB089', color: '#ffffff',
            border: 'none', borderRadius: '8px',
            fontSize: '13px', fontWeight: 600, padding: '8px 16px',
            textDecoration: 'none', marginTop: '16px'
            }}
        >
            <PlusCircle size={13} /> Add Term
        </Link>
        </div>

      {sortedWeeks.length === 0 && (
        <p style={{ color: '#6B7280' }}>No terms added yet for this course.</p>
      )}

      {sortedWeeks.map(week => (
        <div key={week} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2 style={{ fontFamily: 'Belanosima, sans-serif', fontSize: '20px', color: '#1F2937', margin: 0 }}>
              {week === 0 ? 'Unassigned' : `Week ${week}`}
            </h2>
          </div>

          <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1.2fr',
              padding: '8px 14px', background: '#F9FAFB',
              borderBottom: '1px solid #E5E7EB', fontSize: '13px',
              fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em'
            }}>
              <span>Term</span>
              <span>Submissions</span>
              <span>Status</span>
              <span></span>
            </div>

            {termsByWeek[week].map(term => {
              const status = getTermStatus(term);
              return (
                <div key={term.id} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1.2fr',
                  padding: '12px 14px', alignItems: 'center',
                  borderBottom: '1px solid #F3F4F6', fontSize: '15px'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 600, color: '#1F2937' }}>
                    <BookOpen size={13} style={{ color: '#6DB089' }} />
                    {term.word}
                  </span>
                  <span style={{ color: '#6B7280' }}>{term.submissions.length}/{term.maxSubmissions}</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '999px',
                    width: 'fit-content',
                    ...(status === 'approved' ? { background: '#DCFCE7', color: '#15803D' } :
                      status === 'cap-reached' ? { background: '#FEF9C3', color: '#A16207' } :
                      { background: '#F1F5F9', color: '#64748B' })
                  }}>
                    {status === 'approved' && <><CheckCircle2 size={12} /> Approved</>}
                    {status === 'cap-reached' && <><Lock size={12} /> Cap Reached</>}
                    {status === 'pending' && <><Clock size={12} /> Pending</>}
                  </span>
                  <Link
                    href={`/instructor-dashboard/terms/${term.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                      gap: '4px', color: '#2f5da8', fontSize: '13px', fontWeight: 600, textDecoration: 'none'
                    }}
                  >
                    Review <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </main>
  );
}