'use client';

import { useState } from 'react';
import { Container } from 'react-bootstrap';
import '@/styles/student-course.css';
import Link from 'next/link';

type Difficulty = 'Basic' | 'Moderate' | 'Advanced';

type GlossaryTerm = {
  id: string;
  word: string;
  difficulty: Difficulty;
  imageRequired: boolean;
  week: number | null;
  course: {
    crn: number;
    code: string;
    title: string;
  };
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

type Props = {
  terms: GlossaryTerm[];
  mode: 'all' | 'approved';
};

const DIFFICULTIES: Difficulty[] = ['Basic', 'Moderate', 'Advanced'];

export default function ApprovedGlossaryView({ terms, mode }: Props) {
  const [search, setSearch] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  function toggleItem<T>(list: T[], item: T): T[] {
    return list.includes(item)
      ? list.filter((i) => i !== item)
      : [...list, item];
  }

  const courses = Array.from(
    new Map(terms.map((term) => [term.course.code, term.course])).values()
  );

  const filteredTerms = terms.filter((term) => {
    const approved = term.submissions.find(
      (submission) => submission.wasReviewed && submission.points > 0
    );

    if (mode === 'approved' && !approved) return false;

    if (
      search &&
      !term.word.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    if (
      selectedDifficulties.length > 0 &&
      !selectedDifficulties.includes(term.difficulty)
    ) {
      return false;
    }

    if (
      selectedCourses.length > 0 &&
      !selectedCourses.includes(term.course.code)
    ) {
      return false;
    }

    return true;
  });

  const grouped = courses
    .map((course) => {
      const courseTerms = filteredTerms.filter((term) => term.course.code === course.code);

      // Sub-group by week (0 = unassigned/null)
      const byWeek = new Map<number, typeof courseTerms>();
      for (const term of courseTerms) {
        const key = term.week ?? 0;
        if (!byWeek.has(key)) byWeek.set(key, []);
        byWeek.get(key)!.push(term);
      }
      const weekKeys = Array.from(byWeek.keys()).sort((a, b) => a - b);

      return {
        course,
        terms: courseTerms,
        weeks: weekKeys.map((week) => ({ week, terms: byWeek.get(week)! })),
      };
    })
    .filter((group) => group.terms.length > 0);

    return (
    <Container fluid className="course-page">

      <div className="course-header">
        <h1 className="course-title">
          {mode === 'approved' ? 'Official Glossary' : 'All Glossary Terms'}
        </h1>

        <p className="course-subtitle">
          {mode === 'approved'
            ? 'Study approved definitions from all courses.'
            : 'View all glossary terms from your enrolled courses.'}
        </p>
      </div>

      <div className="course-body">
        <aside className="course-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-label">📚 Course</h3>

            {courses.map((course) => (
              <label key={course.crn} className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course.code)}
                  onChange={() =>
                    setSelectedCourses(toggleItem(selectedCourses, course.code))
                  }
                />
                {course.code}
              </label>
            ))}
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-label">📊 Difficulty</h3>

            {DIFFICULTIES.map((difficulty) => (
              <label
                key={difficulty}
                className={`sidebar-checkbox difficulty-${difficulty.toLowerCase()}`}
              >
                <input
                  type="checkbox"
                  checked={selectedDifficulties.includes(difficulty)}
                  onChange={() =>
                    setSelectedDifficulties(
                      toggleItem(selectedDifficulties, difficulty)
                    )
                  }
                />
                {difficulty}
              </label>
            ))}
          </div>
        </aside>

        <main className="course-main">
          <div className="course-main-header">
            <h2 className="glossary-title">
              {mode === 'approved' ? 'Approved Terms' : 'All Terms'}
            </h2>

            <input
              className="glossary-search"
              placeholder="Search terms"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {grouped.length === 0 ? (
            <p className="no-terms">No terms match your filters.</p>
          ) : (
            <div className="official-course-list">
              {grouped.map(({ course, terms: courseTerms, weeks }) => (
                <div key={course.crn} className="official-course-box">
                  <div className="official-course-header">
                    <Link
                      href={`/student-course/${course.crn}`}
                      className="official-course-link"
                    >
                      <h3>{course.code}</h3>
                      <p>{course.title}</p>
                    </Link>
                    <span className="term-status-badge approved">
                      {courseTerms.length} {mode === 'approved' ? 'approved' : 'term'}
                    </span>
                  </div>

                {weeks.map(({ week, terms: weekTerms }) => (
                  <div key={week} style={{ marginTop: '1.25rem' }}>
                    <h4 style={{
                      fontFamily: "'Belanosima', sans-serif",
                      fontSize: '17px',
                      fontWeight: 600,
                      color: '#1a4731',
                      margin: '0 0 0.6rem 0',
                      paddingBottom: '0.3rem',
                      borderBottom: '1px solid #d9ede3',
                    }}>
                      {week === 0 ? 'Unassigned' : `Week ${week}`}
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#6B7280', marginLeft: '0.5rem' }}>
                        ({weekTerms.length} {weekTerms.length === 1 ? 'term' : 'terms'})
                      </span>
                    </h4>
                    <div className="term-grid">
                      {weekTerms.map((term) => {
                        const approved = term.submissions.find(
                          (submission) =>
                            submission.wasReviewed && submission.points > 0
                        );

                        return (
                          <div key={term.id} className="term-card">
                            <h3 className="term-name">{term.word}</h3>

                            {mode === 'approved' ? (
                              <p className="official-definition">
                                {approved?.definition}
                              </p>
                            ) : approved ? (
                              <p className="official-definition">
                                {approved.definition}
                              </p>
                            ) : (
                              <p className="term-submissions">
                                Submissions: {term.submissions.length}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </Container>
  );
}