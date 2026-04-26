'use client';

import Link from 'next/link';
import '@/styles/term-view.css';

// --- Type definitions ---
type Difficulty = 'Basic' | 'Intermediate' | 'Advanced';
type Status = 'available' | 'submitted' | 'approved' | 'full';

interface Submission {
  id: number;
  studentName: string;
  definition: string;
  isApproved: boolean;
  points?: number;
}

interface Term {
  id: number;
  name: string;
  difficulty: Difficulty;
  requiresVisual: boolean;
  submissionsCount: number;
  submissionsCap: number;
  week: number;
  status: Status;
  courseCode: string;
  courseName: string;
  submissions: Submission[];
}

// --- Static data for now; will be fetched from DB by termId once wired up ---
const STATIC_TERMS: Term[] = [
  {
    id: 1,
    name: 'Cranial Nerves',
    difficulty: 'Basic',
    requiresVisual: true,
    submissionsCount: 1,
    submissionsCap: 3,
    week: 1,
    status: 'available',
    courseCode: 'BIO 141',
    courseName: 'Human Anatomy and Physiology',
    submissions: [
      {
        id: 101,
        studentName: 'Student A',
        definition:
          'The cranial nerves are 12 pairs of nerves that emerge directly from the brain, passing through foramina in the skull to innervate structures of the head, neck, and trunk.',
        isApproved: false,
        points: undefined,
      },
    ],
  },
  {
    id: 2,
    name: 'Thorax',
    difficulty: 'Basic',
    requiresVisual: false,
    submissionsCount: 3,
    submissionsCap: 3,
    week: 1,
    status: 'full',
    courseCode: 'BIO 141',
    courseName: 'Human Anatomy and Physiology',
    submissions: [
      {
        id: 201,
        studentName: 'Student B',
        definition:
          'The thorax is the region of the body between the neck and the abdomen, enclosed by the rib cage and containing the heart, lungs, and major blood vessels.',
        isApproved: true,
        points: 5,
      },
      {
        id: 202,
        studentName: 'Student C',
        definition:
          'The thorax forms the chest cavity and houses the thoracic organs including the heart and lungs, bounded by the sternum, ribs, and thoracic vertebrae.',
        isApproved: false,
      },
      {
        id: 203,
        studentName: 'Student D',
        definition:
          'The thorax is the chest portion of the trunk, protected by the thoracic cage and containing vital organs such as the heart, lungs, esophagus, and trachea.',
        isApproved: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Pulmonary Circulation',
    difficulty: 'Intermediate',
    requiresVisual: true,
    submissionsCount: 2,
    submissionsCap: 3,
    week: 2,
    status: 'available',
    courseCode: 'BIO 141',
    courseName: 'Human Anatomy and Physiology',
    submissions: [
      {
        id: 301,
        studentName: 'Student E',
        definition:
          'Pulmonary circulation is the movement of blood from the heart to the lungs for oxygenation, and back to the heart, driven by the right ventricle pumping deoxygenated blood to the lungs.',
        isApproved: false,
      },
      {
        id: 302,
        studentName: 'Student F',
        definition:
          'The pulmonary circuit carries deoxygenated blood from the right side of the heart to the lungs where gas exchange occurs, then returns oxygenated blood to the left side of the heart.',
        isApproved: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Endocrine Gland',
    difficulty: 'Intermediate',
    requiresVisual: false,
    submissionsCount: 2,
    submissionsCap: 2,
    week: 2,
    status: 'submitted',
    courseCode: 'BIO 141',
    courseName: 'Human Anatomy and Physiology',
    submissions: [
      {
        id: 401,
        studentName: 'You',
        definition:
          'An endocrine gland is a ductless gland that secretes hormones directly into the bloodstream to regulate body functions such as metabolism, growth, and reproduction.',
        isApproved: false,
      },
      {
        id: 402,
        studentName: 'Student G',
        definition:
          'Endocrine glands release chemical messengers called hormones directly into the blood, which transport them to target organs to produce a physiological response.',
        isApproved: false,
      },
    ],
  },
  {
    id: 5,
    name: 'Anterior/Posterior',
    difficulty: 'Intermediate',
    requiresVisual: false,
    submissionsCount: 1,
    submissionsCap: 2,
    week: 3,
    status: 'available',
    courseCode: 'BIO 141',
    courseName: 'Human Anatomy and Physiology',
    submissions: [
      {
        id: 501,
        studentName: 'Student H',
        definition:
          'Anterior refers to the front of the body or structure, while posterior refers to the back. These directional terms are used in anatomical descriptions to indicate relative position.',
        isApproved: false,
      },
    ],
  },
  {
    id: 6,
    name: 'Excitation-Contraction Coupling',
    difficulty: 'Advanced',
    requiresVisual: true,
    submissionsCount: 3,
    submissionsCap: 3,
    week: 3,
    status: 'approved',
    courseCode: 'BIO 141',
    courseName: 'Human Anatomy and Physiology',
    submissions: [
      {
        id: 601,
        studentName: 'Student I',
        definition:
          'Excitation-contraction coupling is the process by which an action potential in a muscle cell triggers the release of calcium from the sarcoplasmic reticulum, leading to myofilament interaction and muscle contraction.',
        isApproved: true,
        points: 5,
      },
      {
        id: 602,
        studentName: 'Student J',
        definition:
          'The sequence of events linking electrical excitation of a muscle fiber to the mechanical response of contraction, involving calcium ion release from internal stores.',
        isApproved: false,
      },
      {
        id: 603,
        studentName: 'Student K',
        definition:
          'A physiological process that converts an electrical signal (action potential) into a mechanical response (muscle contraction) through calcium-mediated pathways.',
        isApproved: false,
      },
    ],
  },
];

interface TermViewProps {
  termId: number;
}

export default function TermView({ termId }: TermViewProps) {
  // Find term by id — replace with DB fetch once wired up
  const term = STATIC_TERMS.find((t) => t.id === termId);

  if (!term) {
    return (
      <div className="term-view-page">
        <p className="term-not-found">Term not found.</p>
      </div>
    );
  }

  const approvedSubmission = term.submissions.find((s) => s.isApproved);
  const otherSubmissions = term.submissions.filter((s) => !s.isApproved);

  const isFull = term.status === 'full';
  const isSubmitted = term.status === 'submitted';
  const isApproved = term.status === 'approved';
  const canSubmit = !isFull && !isSubmitted && !isApproved;

  return (
    <div className="term-view-page">
      {/* Back link */}
      <Link href="/student-course" className="term-back-link">
        ← Back to {term.courseCode}
      </Link>

      {/* Term header */}
      <div className="term-view-header">
        <div className="term-view-meta">
          <span className="term-view-week">Week {term.week}</span>
          <span className={`term-view-difficulty difficulty-${term.difficulty.toLowerCase()}`}>
            {term.difficulty}
          </span>
          {term.requiresVisual && (
            <span className="term-view-visual">🖼 Requires Visual</span>
          )}
        </div>
        <h1 className="term-view-title">{term.name}</h1>
        <p className="term-view-course">
          {term.courseCode} — {term.courseName}
        </p>

        {/* Submission count bar */}
        <div className="term-view-cap">
          <div className="term-cap-bar-wrap">
            <div
              className="term-cap-bar-fill"
              style={{ width: `${(term.submissionsCount / term.submissionsCap) * 100}%` }}
            />
          </div>
          <span className="term-cap-text">
            {term.submissionsCount} / {term.submissionsCap} submissions
          </span>
        </div>

        {/* Submit button */}
        {canSubmit && (
          <Link
            href={`/add-definition?termId=${term.id}`}
            className="term-submit-btn"
          >
            Submit Definition
          </Link>
        )}
        {isSubmitted && (
          <span className="term-status-notice submitted">You have submitted a definition</span>
        )}
        {isFull && (
          <span className="term-status-notice full">Submissions are closed for this term</span>
        )}
      </div>

      <hr className="term-divider" />

      {/* Approved definition */}
      {approvedSubmission ? (
        <section className="term-section">
          <h2 className="term-section-title">
            ✅ Approved Definition
          </h2>
          <div className="submission-card submission-card--approved">
            <p className="submission-definition">{approvedSubmission.definition}</p>
            <div className="submission-footer">
              <span className="submission-author">— {approvedSubmission.studentName}</span>
              {approvedSubmission.points && (
                <span className="submission-points">{approvedSubmission.points} pts</span>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="term-section">
          <h2 className="term-section-title">✅ Approved Definition</h2>
          <p className="term-no-approved">No approved definition yet.</p>
        </section>
      )}

      {/* Other submissions */}
      {otherSubmissions.length > 0 && (
        <section className="term-section">
          <h2 className="term-section-title">
            Other Submissions ({otherSubmissions.length})
          </h2>
          <div className="submission-list">
            {otherSubmissions.map((sub) => (
              <div key={sub.id} className="submission-card">
                <p className="submission-definition">{sub.definition}</p>
                <div className="submission-footer">
                  <span className="submission-author">— {sub.studentName}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}