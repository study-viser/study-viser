'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import '@/styles/student-course.css';

// --- Type definitions ---
type Difficulty = 'Basic' | 'Moderate' | 'Advanced';
type Status = 'available' | 'submitted' | 'approved' | 'full';

interface Term {
  id: string;
  name: string;
  difficulty: Difficulty;
  requiresVisual: boolean;
  submissionsCount: number;
  submissionsCap: number;
  week: number;
  status: Status;
}

type StudentCourseViewProps = {
  userId?: string;
  course: {
    crn: number;
    code: string;
    title: string;
    description: string | null;
    instructor: {
      name: string;
    } | null;
    terms: {
      id: string;
      word: string;
      difficulty: 'Basic' | 'Moderate' | 'Advanced';
      imageRequired: boolean;
      maxSubmissions: number;
      week: number | null;
      submissions: {
        id: string;
        creatorId: string;
        wasReviewed: boolean;
        createdAt: Date;
      }[];
    }[];
  };
};

const DIFFICULTIES: Difficulty[] = ['Basic', 'Moderate', 'Advanced'];

function TermCard({
  term,
  crn,
  hasReachedWeeklyLimit,
}: {
  term: Term;
  crn: number;
  hasReachedWeeklyLimit: boolean;
}) {
  const isFull = term.status === 'full';
  const isApproved = term.status === 'approved';
  const isSubmitted = term.status === 'submitted';

  return (
    <div className={`term-card ${isFull ? 'term-card--full' : ''}`}>
      {/* Term name */}
      <h3 className="term-name">{term.name}</h3>

      {/* Submission count */}
      <p className="term-submissions">
        Submissions: {term.submissionsCount} / {term.submissionsCap}
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
        <Link href={`/student-course/${crn}/terms/${term.id}`} className="btn-view-term">
          View Term →
        </Link>

        {term.status === 'available' && !hasReachedWeeklyLimit && (
          <Link href={`/add-definition?termId=${term.id}`} className="btn-submit-term">
            Submit Definition
          </Link>
        )}
        {term.status === 'available' && hasReachedWeeklyLimit && (
          <span className="term-status-badge full">
            Weekly limit reached
          </span>
        )}
      </div>
    </div>
  );
}

export default function StudentCourseView({ course, userId }: StudentCourseViewProps) {
const weeklyLimit = 2;

const startOfWeek = new Date();
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
startOfWeek.setHours(0, 0, 0, 0);

const weeklySubmissionCount = course.terms
  .flatMap((term) => term.submissions)
  .filter(
    (submission) =>
      submission.creatorId === userId &&
      submission.createdAt >= startOfWeek
  ).length;

const hasReachedWeeklyLimit = weeklySubmissionCount >= weeklyLimit;

const dbTerms: Term[] = course.terms.map((term) => {
  const userSubmission = term.submissions.find(
    (s) => s.creatorId === userId
  );

  let status: Status = 'available';

if (term.submissions.length >= term.maxSubmissions) {
  status = 'full';
} else if (userSubmission) {
  status = userSubmission.wasReviewed ? 'approved' : 'submitted';
}

  return {
    id: term.id,
    name: term.word,
    difficulty: term.difficulty,
    requiresVisual: term.imageRequired,
    submissionsCount: term.submissions.length,
    submissionsCap: term.maxSubmissions,
    week: term.week ?? 0,
    status,
  };
});

  const WEEKS = Array.from(
    new Set(dbTerms.map((term) => term.week).filter((week) => week > 0))
  ).sort((a, b) => a - b);

  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  // const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [search, setSearch] = useState('');

  // Helper to toggle an item in a filter list
  function toggleItem<T>(list: T[], item: T): T[] {
    return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
  }

  // Apply all active filters
const filteredTerms = dbTerms.filter((term) => {
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
        <span>
          <span>{course.code}: {course.title}</span>
        </span>
      </div>

      {/* Header */}
      <div className="course-header">
        <h1 className="course-title">
          {course.code} — {course.title} (CRN: {course.crn})
        </h1>
        {/*<p className="course-instructor">{COURSE_INFO.instructor}</p>*/}
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

          {/* Bookmarks 
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
          </div> */}
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
                <TermCard key=
                  {term.id} 
                  term={term} 
                  crn={course.crn}   
                  hasReachedWeeklyLimit={hasReachedWeeklyLimit}/>
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