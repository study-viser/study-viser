import Link from 'next/link';
import '@/styles/glossary-view.css';

type GlossaryViewProps = {
  course: {
    crn: number;
    code: string;
    title: string;
    terms: {
      id: string;
      word: string;
      difficulty: 'Basic' | 'Moderate' | 'Advanced';
      week: number | null;
      bestSubmission: {
        id: string;
        definition: string;
        creator: {
          name: string;
        };
      } | null;
    }[];
  };
};

export default function GlossaryView({ course }: GlossaryViewProps) {
  const sorted = [...course.terms].sort((a, b) => {
    const wa = a.week ?? Infinity;
    const wb = b.week ?? Infinity;
    if (wa !== wb) return wa - wb;
    return a.word.localeCompare(b.word);
  });

  const weeks = Array.from(
    new Set(sorted.map((t) => t.week ?? 0))
  ).sort((a, b) => a - b);

  const byWeek = new Map<number, typeof sorted>();
  for (const term of sorted) {
    const key = term.week ?? 0;
    if (!byWeek.has(key)) byWeek.set(key, []);
    byWeek.get(key)!.push(term);
  }

  return (
    <div className="glossary-view-page">
      <Link href={`/student-course/${course.crn}`} className="glossary-back-link">
        ← Back to {course.code}
      </Link>

      <div className="glossary-view-header">
        <div className="glossary-view-heading-row">
          <div>
            <h1 className="glossary-view-title">
              {course.code} — {course.title}
            </h1>
            <p className="glossary-view-subtitle">Full Glossary</p>
          </div>
          <Link
            href={`/student-course/${course.crn}/study-guide`}
            className="glossary-study-guide-btn"
          >
            Study Guide →
          </Link>
        </div>
      </div>

      {weeks.map((week) => (
        <section key={week} className="glossary-week-section">
          <h2 className="glossary-week-heading">
            {week === 0 ? 'Unassigned' : `Week ${week}`}
          </h2>

          <div className="glossary-term-list">
            {byWeek.get(week)!.map((term) => (
              <div key={term.id} className="glossary-term-item">
                <div className="glossary-term-top">
                  <span className="glossary-term-word">{term.word}</span>
                  <span className={`glossary-term-difficulty difficulty-${term.difficulty.toLowerCase()}`}>
                    {term.difficulty}
                  </span>
                </div>

                {term.bestSubmission ? (
                  <div className="glossary-approved-definition">
                    <p className="glossary-definition-text">
                      {term.bestSubmission.definition}
                    </p>
                    <span className="glossary-definition-author">
                      — {term.bestSubmission.creator.name}
                    </span>
                  </div>
                ) : (
                  <p className="glossary-no-definition">No approved definition yet.</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
