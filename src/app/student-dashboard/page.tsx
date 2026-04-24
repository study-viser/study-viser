import './dashboard.css';
import { Book, Award, FolderPlus } from 'lucide-react'

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
                    0 / 3
                </span>
                <button className="submit-button">Submit Definition</button>
                </div>

                <div className="submission-row">
                <span className="term-name">• Asset</span>
                <span className="course-pill">FIN 307</span>
                <span className="slot-status">
                    <span className="slot-dot slot-gray"></span>
                    0 / 3
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

            <div className="course-actions">
                    <a href="#" className="course-btn course-btn-add">+ add courses</a>
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

            <p className="extra-points">10 points</p>
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

      <section className="grid-2-bottom section">
        {/* Quick Study Actions */}
        <div className="card">
            <h2 className="card-title">Quick Study Actions</h2>
            <div className="quick-actions-grid">
                <a href="#" className="quick-action-item">
                    <div className="quick-action-icon">
                    <Book size={18} />
                    </div>
                    <div>
                        <p className="quick-action-title">View Official Glossary</p>
                        <p className="quick-action-sub">The top 5% definitions | refreshed every week</p>
                    </div>
                </a>

                <a href="#" className="quick-action-item">
                    <div className="quick-action-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                    </div>
                    <div>
                        <p className="quick-action-title">Open Flashcards</p>
                    </div>
                </a>

                <a href="#" className="quick-action-item">
                    <div className="quick-action-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                    </div>
                    <div>
                        <p className="quick-action-title">View Bookmarks</p>
                        <p className="quick-action-sub">You have 1 definition bookmarked this week</p>
                    </div>
                </a>

                <a href="#" className="quick-action-item">
                    <div className="quick-action-icon">
                        <FolderPlus size={18} />
                    </div>
                    <div>
                        <p className="quick-action-title">Create Study Set</p>
                        <p className="quick-action-sub">Organize terms into your own study sets</p>
                    </div>
                </a>
            </div>
        </div>

        {/* Notifications */}
        <div className="card">
            <div className="section-header">
                <h2 className="card-title">Notifications</h2>
                <a href="#" className="view-all">View All &gt;</a>
            </div>

            <div className="notif-list">
                <div className="notif-item">
                    <div className="notif-icon notif-success">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    </div>
                    <p className="notif-text">
                    Your definition for <strong>&apos;Algorithm&apos;</strong> was approved.
                    </p>
                    <span className="notif-time">4h ago</span>
                </div>

                <div className="notif-item">
                    <div className="notif-icon notif-warning">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    </div>
                    <p className="notif-text">
                    The term <strong>&apos;API&apos;</strong> has reached its submission cap.
                    </p>
                    <span className="notif-time">1d ago</span>
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}