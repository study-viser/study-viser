'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import '@/styles/study-guide.css';

type Term = {
  id: string;
  word: string;
  difficulty: 'Basic' | 'Moderate' | 'Advanced';
  week: number | null;
  referenceDefinition: string | null;
  bestSubmission: {
    id: string;
    definition: string;
    creator: { name: string };
  } | null;
};

type StudyGuideProps = {
  course: {
    crn: number;
    code: string;
    title: string;
    terms: Term[];
  };
};

type KnowledgeState = 'known' | 'learning';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function StudyGuide({ course }: StudyGuideProps) {
  const allTerms = course.terms;

  const weeks = Array.from(new Set(allTerms.map((t) => t.week ?? 0)))
    .filter((w) => w > 0)
    .sort((a, b) => a - b);

  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [displayTerms, setDisplayTerms] = useState<Term[]>(allTerms);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knowledge, setKnowledge] = useState<Record<string, KnowledgeState>>({});

  const currentTerm = displayTerms[currentIndex] ?? null;
  const definition =
    currentTerm?.bestSubmission?.definition ?? currentTerm?.referenceDefinition ?? null;
  const definitionAuthor = currentTerm?.bestSubmission?.creator.name ?? null;
  const isApproved = !!currentTerm?.bestSubmission;
  const currentKnowledge = currentTerm ? knowledge[currentTerm.id] ?? null : null;

  const knownCount = Object.values(knowledge).filter((v) => v === 'known').length;
  const learningCount = Object.values(knowledge).filter((v) => v === 'learning').length;

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setFlipped(false);
  }, []);

  const prev = () =>
    goTo((currentIndex - 1 + displayTerms.length) % displayTerms.length);

  const next = () =>
    goTo((currentIndex + 1) % displayTerms.length);

  const markKnowledge = (state: KnowledgeState) => {
    if (!currentTerm) return;
    setKnowledge((prev) => ({ ...prev, [currentTerm.id]: state }));
    if (currentIndex < displayTerms.length - 1) {
      setTimeout(() => goTo(currentIndex + 1), 250);
    }
  };

  const handleWeekSelect = (week: number | null) => {
    const base =
      week === null ? allTerms : allTerms.filter((t) => (t.week ?? 0) === week);
    setDisplayTerms(isShuffled ? shuffleArray(base) : base);
    setSelectedWeek(week);
    goTo(0);
  };

  const handleShuffle = () => {
    const base =
      selectedWeek === null
        ? allTerms
        : allTerms.filter((t) => (t.week ?? 0) === selectedWeek);
    if (!isShuffled) {
      setDisplayTerms(shuffleArray(base));
      setIsShuffled(true);
    } else {
      setDisplayTerms(base);
      setIsShuffled(false);
    }
    goTo(0);
  };

  const resetProgress = () => {
    setKnowledge({});
    goTo(0);
  };

  const progress = displayTerms.length > 0
    ? ((currentIndex + 1) / displayTerms.length) * 100
    : 0;

  return (
    <div className="sg-page">
      {/* Sticky toolbar */}
      <div className="sg-toolbar">
        <Link href={`/student-course/${course.crn}`} className="sg-back-link">
          ← {course.code}
        </Link>
        <Link href={`/student-course/${course.crn}/glossary`} className="sg-nav-link">
          Glossary
        </Link>
        <div className="sg-toolbar-right">
          <button className="sg-icon-btn" onClick={resetProgress} title="Reset progress">
            ↺ Reset
          </button>
          <button
            className={`sg-icon-btn ${isShuffled ? 'sg-icon-btn--active' : ''}`}
            onClick={handleShuffle}
            title="Shuffle cards"
          >
            ⇄ Shuffle
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="sg-header">
        <div>
          <span className="sg-label">Study Guide</span>
          <h1 className="sg-title">{course.code} — {course.title}</h1>
        </div>
        <div className="sg-summary-pills">
          <span className="sg-pill sg-pill--known">{knownCount} known</span>
          <span className="sg-pill sg-pill--learning">{learningCount} still learning</span>
          <span className="sg-pill sg-pill--unseen">
            {displayTerms.filter((t) => !knowledge[t.id]).length} unseen
          </span>
        </div>
      </header>

      {/* Week filter */}
      <div className="sg-week-filter">
        <button
          className={`sg-week-btn ${selectedWeek === null ? 'sg-week-btn--active' : ''}`}
          onClick={() => handleWeekSelect(null)}
        >
          All
        </button>
        {weeks.map((w) => (
          <button
            key={w}
            className={`sg-week-btn ${selectedWeek === w ? 'sg-week-btn--active' : ''}`}
            onClick={() => handleWeekSelect(w)}
          >
            Week {w}
          </button>
        ))}
      </div>

      {/* Flashcard area */}
      {currentTerm ? (
        <div className="sg-flashcard-area">
          {/* Progress bar */}
          <div className="sg-progress-track">
            <div className="sg-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Card */}
          <div
            className={`sg-flashcard ${flipped ? 'sg-flashcard--flipped' : ''}`}
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === ' ' && setFlipped((f) => !f)}
          >
            <div className="sg-flashcard-inner">
              {/* Front — term */}
              <div className="sg-face sg-face--front">
                <div className="sg-face-badges">
                  <span className="sg-badge-week">
                    {currentTerm.week ? `Week ${currentTerm.week}` : 'Unassigned'}
                  </span>
                  <span className={`sg-badge-diff difficulty-${currentTerm.difficulty.toLowerCase()}`}>
                    {currentTerm.difficulty}
                  </span>
                </div>
                <p className="sg-face-word">{currentTerm.word}</p>
                <p className="sg-face-hint">click to reveal definition</p>
              </div>

              {/* Back — definition */}
              <div className="sg-face sg-face--back">
                <div className="sg-face-badges">
                  <span className="sg-badge-week">
                    {currentTerm.week ? `Week ${currentTerm.week}` : 'Unassigned'}
                  </span>
                  {isApproved && (
                    <span className="sg-badge-approved">✓ Approved</span>
                  )}
                </div>
                <p className="sg-face-back-word">{currentTerm.word}</p>
                {definition ? (
                  <>
                    <p className="sg-face-definition">{definition}</p>
                    {definitionAuthor && (
                      <p className="sg-face-author">— {definitionAuthor}</p>
                    )}
                  </>
                ) : (
                  <p className="sg-face-no-def">No definition yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Self-assessment */}
          <div className="sg-assessment">
            <button
              className={`sg-assess-btn sg-assess-btn--learning ${currentKnowledge === 'learning' ? 'sg-assess-btn--active' : ''}`}
              onClick={() => markKnowledge('learning')}
            >
              ✗ Still learning
            </button>
            <span className="sg-counter">
              {currentIndex + 1} <span className="sg-counter-sep">/</span> {displayTerms.length}
            </span>
            <button
              className={`sg-assess-btn sg-assess-btn--known ${currentKnowledge === 'known' ? 'sg-assess-btn--active' : ''}`}
              onClick={() => markKnowledge('known')}
            >
              ✓ Know it
            </button>
          </div>

          {/* Navigation */}
          <div className="sg-nav">
            <button className="sg-nav-btn" onClick={prev}>← Prev</button>
            <button className="sg-nav-btn" onClick={next}>Next →</button>
          </div>
        </div>
      ) : (
        <p className="sg-empty">No terms for this selection.</p>
      )}

      {/* Term overview grid */}
      <div className="sg-overview">
        <h2 className="sg-overview-title">All cards</h2>
        <div className="sg-overview-grid">
          {displayTerms.map((term, i) => (
            <button
              key={term.id}
              className={`sg-chip ${
                knowledge[term.id] === 'known'
                  ? 'sg-chip--known'
                  : knowledge[term.id] === 'learning'
                  ? 'sg-chip--learning'
                  : i === currentIndex
                  ? 'sg-chip--current'
                  : ''
              }`}
              onClick={() => goTo(i)}
            >
              {term.word}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
