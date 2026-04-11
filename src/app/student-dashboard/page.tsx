import './dashboard.css';
import { Book, Award } from 'lucide-react'

export default function StudentDashboardPage() {
  return (
    <main className="dashboard-container">
      <section className="section">
        <h1 className="page-title">
          Student Dashboard
        </h1>
        <p className="page-subtitle">
          Track your submissions, earn extra credit, and study course glossary terms.
        </p>
      </section>

      <section className="grid-2 section">
        <div className="card">
            <div className="section-header">
                <h2 className="card-title">My Recent Submissions</h2>
                <a href="#" className="view-all">View All</a>
            </div>

            <div className="terms-table">
                <div className="terms-table-head">
                    <span>Term</span>
                    <span>Course</span>
                    <span>Difficulty</span>
                    <span>Status</span>
                </div>

                <div className="terms-row">
                    <span className="term-name">• Encapsulation</span>
                    <span className="course-pill">ICS 314</span>
                    <span>Moderate</span>
                    <span className="status-pill status-approved">Approved</span>
                </div>

                <div className="terms-row">
                    <span className="term-name">• Algorithm</span>
                    <span className="course-pill">ICS 314</span>
                    <span>Hard</span>
                    <span className="status-pill status-rejected">Not Selected</span>
                </div>
            </div>

            <div className="terms-footer">
                <span>You can submit 1 more definition this week.</span>

                <div className="progress-wrap">
                    <div className="progress-bar">
                        <div className="progress-fill" />
                    </div>
                    <span className="progress-text">1 / 2</span>
                </div>
            </div>
        </div>

        <div className="card">
            <div className="section-header">
                <h2 className="card-title">Available Terms to Submit</h2>
            </div>

            <div className="submission-table">
                <div className="submission-table-head">
                <span>Term</span>
                <span>Course</span>
                <span>Status</span>
                <span></span>
                </div>

                <div className="submission-row">
                <span className="term-name">• Agile</span>
                <span className="course-pill">ICS 314</span>
                <span className="slot-status">
                    <span className="slot-dot slot-green"></span>
                    3 / 3
                </span>
                <button className="submit-button">Submit Definition</button>
                </div>

                <div className="submission-row">
                <span className="term-name">• Encapsulation</span>
                <span className="course-pill">ICS 314</span>
                <span className="slot-status">
                    <span className="slot-dot slot-gray"></span>
                    0 / 5
                </span>
                <button className="submit-button">Submit Definition</button>
                </div>

                <div className="submission-row">
                <span className="term-name">• Algorithm</span>
                <span className="course-pill">ICS 314</span>
                <span className="slot-status">
                    <span className="slot-dot slot-gray"></span>
                    0 / 2
                </span>
                <button className="submit-button">Submit Definition</button>
                </div>
            </div>
        </div>
      </section>

      <section className="grid-3 section">
        <div className="card">
            <div className="course-card-header">
                <div className="course-icon-circle">
                    <Book size={18} />
                </div>
                <h2 className="card-title course-title">Enrolled Courses</h2>
            </div>

            <div className="course-divider"></div>

            <div className="course-content">
                <p className="course-item">
                <span className="course-bullet">•</span>
                <span>
                    <strong>ICS 314: Software Engineering</strong><br />
                    David Brook
                </span>
                </p>

                <p className="course-item">
                <span className="course-bullet">•</span>
                <span>
                    <strong>FIN 307: Corporate Financial Management</strong><br />
                    Joonho Kim
                </span>
                </p>
            </div>
        </div>

        <div className="card extra-card">
            <div className="extra-header">
                <div className="extra-title-wrap">
                <div className="extra-icon">
                    <Award size={18} />
                </div>
                <h2 className="card-title">Extra Credit Earned</h2>
                </div>
            </div>

            <p className="extra-points">8 points</p>
            <p className="extra-sub">2 approved submissions</p>
        </div>

        <div className="card weekly-card">
            <div className="weekly-header">
                <div className="weekly-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="6" x2="12" y2="12"/>
                    <line x1="12" y1="12" x2="16" y2="14"/>
                </svg>
                </div>
                <h2 className="card-title weekly-title">Weekly Submission Progress</h2>
            </div>

            <div className="weekly-progress-bar-wrap">
                <div className="weekly-progress-bar">
                <div className="weekly-progress-fill" style={{ width: '50%' }} />
                </div>
            </div>

            <p className="weekly-desc">
                <strong>1 of 2</strong> definitions submitted this week.
            </p>
            <p className="weekly-sub">You can submit 1 more definition this week.</p>

            <div className="weekly-footer">
                <button className="weekly-submit-btn">
                Submit Definition
                </button>
            </div>
        </div>
      </section>
    </main>
  );
}