import './dashboard.css';
import { Book, Award, Users, ClipboardList, BookOpen, BarChart2, PlusCircle, FileOutput } from 'lucide-react'

export default function InstructorDashboardPage() {
  return (
    <main className="dashboard-container">
      <section className="section">
        <h1 className="page-title">Instructor Dashboard</h1>
        <p className="page-subtitle">
          Manage your courses, track submissions, and review glossaries.
        </p>
      </section>

      {/* Course Overview Stats */}
      <section className="stats-grid section">
        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-green">
            <Users size={18} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Students Enrolled</p>
            <p className="stat-value">245</p>
          </div>
          <a href="#" className="stat-link">View All</a>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-yellow">
            <ClipboardList size={18} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Pending Reviews</p>
            <p className="stat-value">5</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-green">
            <Award size={18} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Approved Entries</p>
            <p className="stat-value">38</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap stat-icon-blue">
            <Book size={18} />
          </div>
          <div className="stat-body">
            <p className="stat-label">Terms This Week</p>
            <p className="stat-value">4</p>
          </div>
          <a href="#" className="stat-link">View Terms</a>
        </div>
      </section>

      {/* Middle Row */}
      <section className="grid-3 section">
        {/* Pending Submissions */}
        <div className="card">
          <div className="section-header">
            <h2 className="card-title">Pending Submissions</h2>
            <a href="#" className="view-all">View All Submissions &gt;</a>
          </div>

          <div className="submission-list">
            <div className="pending-row">
              <div className="pending-left">
                <div className="pending-icon">
                  <BookOpen size={14} />
                </div>
                <div>
                  <p className="pending-term">Encapsulation</p>
                  <p className="pending-count">3 submissions pending</p>
                </div>
              </div>
              <button className="review-btn">Review</button>
            </div>

            <div className="pending-row">
              <div className="pending-left">
                <div className="pending-icon">
                  <BookOpen size={14} />
                </div>
                <div>
                  <p className="pending-term">Inheritance</p>
                  <p className="pending-count">2 submissions pending</p>
                </div>
              </div>
              <button className="review-btn">Review</button>
            </div>

            <div className="pending-row">
              <div className="pending-left">
                <div className="pending-icon">
                  <BookOpen size={14} />
                </div>
                <div>
                  <p className="pending-term">Design Patterns</p>
                  <p className="pending-count">2 submissions pending</p>
                </div>
              </div>
              <button className="review-btn">Review</button>
            </div>
          </div>
        </div>

        {/* Glossary Management */}
        <div className="card">
          <h2 className="card-title">Glossary Management</h2>

          <div className="glossary-list">
            <a href="#" className="glossary-item">
              <PlusCircle size={15} className="glossary-icon glossary-icon-green" />
              <span>Add New Term</span>
            </a>
            <a href="#" className="glossary-item">
              <BookOpen size={15} className="glossary-icon glossary-icon-green" />
              <span>Manage Glossary</span>
            </a>
            <a href="#" className="glossary-item glossary-item-warning">
              <ClipboardList size={15} className="glossary-icon glossary-icon-yellow" />
              <span>Visual Annotation required: <strong>Encapsulation</strong></span>
            </a>
            <a href="#" className="glossary-item">
              <Award size={15} className="glossary-icon glossary-icon-green" />
              <span>Definition added: Polymorphism</span>
            </a>
          </div>

          <button className="manage-glossary-btn">Manage Full Glossary</button>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="section-header">
            <h2 className="card-title">Recent Activity</h2>
            <a href="#" className="view-all">View All Notifications</a>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon activity-icon-blue">
                <ClipboardList size={13} />
              </div>
              <div>
                <p className="activity-text">2 new submissions added for <strong className="highlight-green">Algorithm</strong></p>
                <p className="activity-time">2 minutes ago</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon activity-icon-green">
                <Award size={13} />
              </div>
              <div>
                <p className="activity-text">&apos;Encapsulation&apos; reached submission cap</p>
                <p className="activity-time">5 hours ago</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon activity-icon-green">
                <Award size={13} />
              </div>
              <div>
                <p className="activity-text">1 glossary entry approved today</p>
                <p className="activity-time">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Row */}
      <section className="grid-3 section">
        {/* Quick Actions */}
        <div className="card">
          <h2 className="card-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <a href="#" className="quick-action-item">
              <div className="quick-action-icon">
                <PlusCircle size={18} />
              </div>
              <div>
                <p className="quick-action-title">Add Term</p>
              </div>
            </a>

            <a href="#" className="quick-action-item">
              <div className="quick-action-icon">
                <ClipboardList size={18} />
              </div>
              <div>
                <p className="quick-action-title">Review Pending</p>
              </div>
            </a>

            <a href="#" className="quick-action-item">
              <div className="quick-action-icon">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="quick-action-title">View Glossary</p>
              </div>
            </a>

            <a href="#" className="quick-action-item">
              <div className="quick-action-icon">
                <FileOutput size={18} />
              </div>
              <div>
                <p className="quick-action-title">Export Resources</p>
              </div>
            </a>
          </div>
        </div>

        {/* Course Analytics 1 */}
        <div className="card">
          <h2 className="card-title">Course Analytics</h2>
          <div className="analytics-row">
            <div className="analytics-icon">
              <Users size={15} />
            </div>
            <span className="analytics-label">Active Student Contributors</span>
            <span className="analytics-value">48</span>
          </div>
          <a href="#" className="analytics-link">View Detailed Analytics &gt;</a>
        </div>

        {/* Course Analytics 2 */}
        <div className="card">
          <h2 className="card-title">Course Analytics</h2>
          <div className="analytics-row">
            <div className="analytics-icon">
              <BarChart2 size={15} />
            </div>
            <span className="analytics-label">Avg Submissions per Term</span>
            <span className="analytics-value">7.2</span>
          </div>
        </div>
      </section>
    </main>
  );
}
