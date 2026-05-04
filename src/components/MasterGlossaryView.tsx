'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from 'react-bootstrap';
import '@/styles/student-course.css';

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


  return (
    <Container fluid className="course-page">
      <div className="course-breadcrumb">
        <Link href="/student-dashboard">Dashboard</Link>
        <span> / </span>
        <span>{mode === 'approved' ? 'Official Glossary' : 'All Glossary Terms'}</span>
      </div>

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

          {filteredTerms.length === 0 ? (
            <p className="no-terms">No terms match your filters.</p>
          ) : (
            <div className="term-grid">
              {filteredTerms.map((term) => {
                const approved = term.submissions.find(
                  (submission) => submission.wasReviewed && submission.points > 0
                );

                return (
                  <div key={term.id} className="term-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 className="term-name">{term.word}</h3>
                      <span className="term-status-badge approved" style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
                        {term.course.code}
                      </span>
                    </div>

                    {mode === 'approved' ? (
                      <p className="official-definition">{approved?.definition}</p>
                    ) : approved ? (
                      <p className="official-definition">{approved.definition}</p>
                    ) : (
                      <p className="term-submissions">Submissions: {term.submissions.length}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </Container>
  );
}
