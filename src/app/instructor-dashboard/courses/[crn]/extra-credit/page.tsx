import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getCourseByCrn, getExtraCreditByCourse } from '@/lib/dbActions';
import { Award } from 'lucide-react';
import '../../../dashboard.css';

export default async function ExtraCreditPage({ params }: { params: Promise<{ crn: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return <p>Not logged in.</p>;

  const { crn: crnParam } = await params;
  const crn = parseInt(crnParam);

  const course = await getCourseByCrn(crn);
  if (!course) return <p>Course not found.</p>;

  const extraCredit = await getExtraCreditByCourse(crn) ?? [];

  const sorted = [...extraCredit].sort((a, b) => b.total - a.total);
  const totalAwarded = sorted.reduce((sum, s) => sum + s.total, 0);
  const studentsWithCredit = sorted.filter((s) => s.total > 0).length;

  return (
    <main className="ec-page">

      <Link href={`/instructor-dashboard/courses/${crn}`} className="ec-back-link">
        ← Back to {course.code}
      </Link>

      <div className="ec-header">
        <div className="ec-title-row">
          <div className="ec-icon">
            <Award size={18} />
          </div>
          <h1 className="ec-title">Extra Credit</h1>
        </div>
        <p className="ec-subtitle">{course.code} — {course.title}</p>
      </div>

      <div className="ec-stats-grid">
        <div className="ec-stat-card">
          <p>Students Enrolled</p>
          <span>{course.students.length}</span>
        </div>
        <div className="ec-stat-card">
          <p>Students with Credit</p>
          <span>{studentsWithCredit}</span>
        </div>
        <div className="ec-stat-card">
          <p>Total Points Awarded</p>
          <span>{totalAwarded}</span>
        </div>
      </div>

      <div className="ec-table">
        <div className="ec-table-head">
          <span>Student</span>
          <span>Email</span>
          <span>Approved</span>
          <span>Points</span>
        </div>

        {sorted.length === 0 ? (
          <div className="ec-empty">
            <p>No students enrolled yet.</p>
          </div>
        ) : (
          sorted.map(({ student, total, breakdown }) => (
            <div key={student.id} className="ec-table-row">
              <span className="ec-student-name">{student.name}</span>
              <span className="ec-student-email">{student.email}</span>
              <span className="ec-approved-count">{breakdown.length}</span>
              <span>
                {total > 0 ? (
                  <span className="ec-points-badge">{total} pts</span>
                ) : (
                  <span className="ec-points-empty">—</span>
                )}
              </span>
            </div>
          ))
        )}
      </div>

      <p className="ec-footer-note">
        Points are awarded only for approved submissions.
      </p>
    </main>
  );
}