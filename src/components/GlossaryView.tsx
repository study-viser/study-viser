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

  // unique courses
  const courses = Array.from(
    new Map(terms.map((t) => [t.course.code, t.course])).values()
  );

  // filtering
  const filteredTerms = terms.filter((term) => {
    if (search && !term.word.toLowerCase().includes(search.toLowerCase())) return false;

    if (
      selectedDifficulties.length > 0 &&
      !selectedDifficulties.includes(term.difficulty)
    ) return false;

    if (
      selectedCourses.length > 0 &&
      !selectedCourses.includes(term.course.code)
    ) return false;

    return true;
  });

  // group by course
  const grouped = courses
    .map((course) => ({
      course,
      terms: filteredTerms.filter((t) => t.course.code === course.code),
    }))
    .filter((group) => group.terms.length > 0);

  return (
    <Container fluid className="course-page">
      {/* Breadcrumb */}
      <div className="course-breadcrumb">
        <Link href="/student-dashboard">Dashboard</Link>
        <span> / </span>
        <span>{mode === 'approved' ? 'Official Glossary' : 'All Glossary Terms'}</span>
      </div>

      {/* Header */}
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
        {/* Sidebar */}
        <aside className="course-sidebar">

          {/* Course filter */}
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

          {/* Difficulty filter */}
          <div className="sidebar-section">
            <h3 className="sidebar-label">📊 Difficulty</h3>

            {DIFFICULTIES.map((d) => (
              <label
                key={d}
                className={`sidebar-checkbox difficulty-${d.toLowerCase()}`}
              >
                <input
                  type="checkbox"
                  checked={selectedDifficulties.includes(d)}
                  onChange={() =>
                    setSelectedDifficulties(toggleItem(selectedDifficulties, d))
                  }
                />
                {d}
              </label>
            ))}
          </div>
        </aside>

        {/* Main content */}
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
              {grouped.map(({ course, terms }) => (
                <div key={course.crn} className="official-course-box">

                  {/* Course header */}
                  <div className="official-course-header">
                    <div>
                      <h3>{course.code}</h3>
                      <p>{course.title}</p>
                    </div>

                    <span className="term-status-badge approved">
                      {terms.length} approved
                    </span>
                  </div>

                  {/* Terms */}
                  <div className="term-grid">
                  {terms.map((term) => {
                    const approved = term.submissions.find(
                      (submission) => submission.wasReviewed && submission.points > 0
                    );

                    // ONLY skip if we're in approved mode
                    if (mode === 'approved' && !approved) {
                      return null;
                    }

                    return (
                      <div key={term.id} className="term-card">
                        <h3 className="term-name">{term.word}</h3>

                        {mode === 'approved' ? (
                          <p className="official-definition">
                            {approved?.definition}
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
          )}
        </main>
      </div>
    </Container>
  );
}