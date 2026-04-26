'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import '@/styles/student-course.css';

// --- Type definitions ---
type Difficulty = 'Basic' | 'Intermediate' | 'Advanced';
type Status = 'available' | 'submitted' | 'approved' | 'full';

interface Term {
  id: number;
  name: string;
  difficulty: Difficulty;
  requiresVisual: boolean;
  submissionsCount: number;
  submissionsCap: number;
  week: number;
  status: Status;
}

// --- Static data for now; will be received as props once DB is wired up ---
const COURSE_INFO = {
  code: 'BIO 141',
  name: 'Human Anatomy and Physiology',
  instructor: 'Professor Philip M Johnson',
};

const STATIC_TERMS: Term[] = [
  { id: 1, name: 'Cranial Nerves',               difficulty: 'Basic',        requiresVisual: true,  submissionsCount: 1, submissionsCap: 3, week: 1, status: 'available' },
  { id: 2, name: 'Thorax',                        difficulty: 'Basic',        requiresVisual: false, submissionsCount: 3, submissionsCap: 3, week: 1, status: 'full' },
  { id: 3, name: 'Pulmonary Circulation',         difficulty: 'Intermediate', requiresVisual: true,  submissionsCount: 2, submissionsCap: 3, week: 2, status: 'available' },
  { id: 4, name: 'Endocrine Gland',               difficulty: 'Intermediate', requiresVisual: false, submissionsCount: 2, submissionsCap: 2, week: 2, status: 'submitted' },
  { id: 5, name: 'Anterior/Posterior',            difficulty: 'Intermediate', requiresVisual: false, submissionsCount: 1, submissionsCap: 2, week: 3, status: 'available' },
  { id: 6, name: 'Excitation-Contraction Coupling', difficulty: 'Advanced',  requiresVisual: true,  submissionsCount: 3, submissionsCap: 3, week: 3, status: 'approved' },
];

const WEEKS = [1, 2, 3];
const DIFFICULTIES: Difficulty[] = ['Basic', 'Intermediate', 'Advanced'];

// --- Inline term card (static only) ---
// TODO: Replace with DB-wired TermItem once Khloe wires up the submission flow
function TermCard({ term }: { term: Term }) {
  const isFull = term.status === 'full';
  const isApproved = term.status === 'approved';
  const isSubmitted = term.status === 'submitted';

  return (
    <div className={`term-card ${isFull ? 'term-card--full' : ''}`}>
      {/* Term name */}
      <h3 className="term-name">{term.name}</h3>

      {/* Submission count */}
      <p className="term-submissions">
        Status: {term.submissionsCount} / {term.submissionsCap}
      </p>

      {/* Requires visual badge */}
      {term.requiresVisual && (
        <p className="term-visual-badge">🖼 Requires Visual</p>
      )}

      {/* Difficulty badge */}
      <span className={`term-difficulty difficulty-${term.difficulty.toLowerCase()}`}>
        {term.difficulty}
      </span>

      {/* Status badge */}
      {isApproved && <span className="term-status-badge approved">Approved</span>}
      {isSubmitted && <span className="term-status-badge submitted">Submitted</span>}
      {isFull && <span className="term-status-badge full">Full</span>}

      {/* Action buttons */}
      <div className="term-card-actions">
        <Link href={`/student-course/terms/${term.id}`} className="btn-view-term">
          View Term →
        </Link>

        {/* Temporary link — replace with a server action once DB is wired up */}
        {!isFull && !isSubmitted && !isApproved && (
          <Link href={`/add-definition?termId=${term.id}`} className="btn-submit-term">
            Submit Definition
          </Link>
        )}
      </div>
    </div>
  );
}

export default function StudentCourseView() {
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [search, setSearch] = useState('');

  // Helper to toggle an item in a filter list
  function toggleItem<T>(list: T[], item: T): T[] {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  }

  // Apply all active filters
  const filteredTerms = STATIC_TERMS.filter((term) => {
    if (selectedWeeks.length > 0 && !selectedWeeks.includes(term.week)) return false;
    if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(term.difficulty)) return false;
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(term.status)) return false;
    if (search && !term.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Container fluid className="course-page">
      {/* Breadcrumb */}
      <div className="course-breadcrumb">
        <Link href="/student-dashboard">Dashboard</Link>
        <span> / </span>
        <span>{COURSE_INFO.code}: {COURSE_INFO.name}</span>
      </div>

      {/* Header */}
      <div className="course-header">
        <h1 className="course-title">{COURSE_INFO.code} — {COURSE_INFO.name}</h1>
        <p className="course-instructor">{COURSE_INFO.instructor}</p>
      </div>

      <div className="course-body">
        {/* Sidebar */}
        <aside className="course-sidebar">
          {/* Week filter */}
          <div className="sidebar-section">
            <h3 className="sidebar-label">
              <span className="sidebar-icon">📅</span> Week
            </h3>
            {WEEKS.map((week) => (
              <label key={week} className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={selectedWeeks.includes(week)}
                  onChange={() => setSelectedWeeks(toggleItem(selectedWeeks, week))}
                />
                Week {week}
              </label>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="sidebar-section">
            <h3 className="sidebar-label">
              <span className="sidebar-icon">📊</span> Difficulty
            </h3>
            {DIFFICULTIES.map((diff) => (
              <label key={diff} className={`sidebar-checkbox difficulty-${diff.toLowerCase()}`}>
                <input
                  type="checkbox"
                  checked={selectedDifficulties.includes(diff)}
                  onChange={() => setSelectedDifficulties(toggleItem(selectedDifficulties, diff))}
                />
                {diff}
              </label>
            ))}
          </div>

          {/* Status filter */}
          <div className="sidebar-section">
            <h3 className="sidebar-label">
              <span className="sidebar-icon">📋</span> Status
            </h3>
            {(['available', 'submitted', 'approved', 'full'] as Status[]).map((s) => (
              <label key={s} className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(s)}
                  onChange={() => setSelectedStatuses(toggleItem(selectedStatuses, s))}
                />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </label>
            ))}
          </div>

          {/* Bookmarks */}
          <div className="sidebar-section">
            <h3 className="sidebar-label">
              <span className="sidebar-icon">🔖</span> Bookmarks
            </h3>
            <label className="sidebar-checkbox">
              <input
                type="checkbox"
                checked={bookmarksOnly}
                onChange={() => setBookmarksOnly(!bookmarksOnly)}
              />
              Bookmarked Only
            </label>
          </div>
        </aside>

        {/* Main content area */}
        <main className="course-main">
          {/* Search bar and section title */}
          <div className="course-main-header">
            <h2 className="glossary-title">Glossary Terms</h2>
            <input
              type="text"
              className="glossary-search"
              placeholder="Search glossary terms"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Term grid */}
          {filteredTerms.length > 0 ? (
            <div className="term-grid">
              {filteredTerms.map((term) => (
                <TermCard key={term.id} term={term} />
              ))}
            </div>
          ) : (
            <p className="no-terms">No terms match the selected filters.</p>
          )}
        </main>
      </div>
    </Container>
  );
}