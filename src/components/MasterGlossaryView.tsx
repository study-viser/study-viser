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
  bestSubmission: {
    id: string;
    definition: string;
  } | null;
};

type Props = {
  terms: GlossaryTerm[];
};

const DIFFICULTIES: Difficulty[] = ['Basic', 'Moderate', 'Advanced'];

export default function MasterGlossaryView({ terms }: Props) {
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
    if (!term.bestSubmission) return false;

    if (search && !term.word.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(term.difficulty)) {
      return false;
    }

    if (selectedCourses.length > 0 && !selectedCourses.includes(term.course.code)) {
      return false;
    }

    return true;
  });

  return (
    <Container fluid className="course-page">
      <div className="course-breadcrumb">
        <Link href="/student-dashboard">Dashboard</Link>
        <span> / </span>
        <span>Official Glossary</span>
      </div>

      <div className="course-header">
        <h1 className="course-title">Official Glossary</h1>
        <p className="course-subtitle">Study approved definitions from all courses.</p>
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
                  onChange={() => setSelectedCourses(toggleItem(selectedCourses, course.code))}
                />
                {course.code}
              </label>
            ))}
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-label">📊 Difficulty</h3>
            {DIFFICULTIES.map((difficulty) => (
              <label key={difficulty} className={`sidebar-checkbox difficulty-${difficulty.toLowerCase()}`}>
                <input
                  type="checkbox"
                  checked={selectedDifficulties.includes(difficulty)}
                  onChange={() => setSelectedDifficulties(toggleItem(selectedDifficulties, difficulty))}
                />
                {difficulty}
              </label>
            ))}
          </div>
        </aside>

        <main className="course-main">
          <div className="course-main-header">
            <h2 className="glossary-title">Terms</h2>
            <input
              className="glossary-search"
              placeholder="Search terms"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredTerms.length === 0 ? (
            <p className="no-terms">No approved terms found.</p>
          ) : (
            /* Changed class to term-stack */
            <div className="term-stack">
              {filteredTerms.map((term) => (
                <div key={term.id} className="term-list-card">
                  <div className="term-list-header">
                    <div className="term-list-title-area">
                      <h3 className="term-name">{term.word}</h3>
                      <span className={`term-difficulty difficulty-${term.difficulty.toLowerCase()}`}>
                        {term.difficulty}
                      </span>
                    </div>
                    <span className="term-status-badge approved">
                      {term.course.code}
                    </span>
                  </div>
                  <p className="official-definition">
                    {term.bestSubmission?.definition}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </Container>
  );
}
