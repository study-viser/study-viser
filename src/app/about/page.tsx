"use client";
 
import { useState } from "react";

const roles = [
  {
    id: "instructor",
    title: "Instructors",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#024731"/>
        <path d="M16 7L26 12.5V20.5L16 26L6 20.5V12.5L16 7Z" stroke="#E8F5E9" strokeWidth="1.5" fill="none"/>
        <circle cx="16" cy="16" r="3" fill="#E8F5E9"/>
      </svg>
    ),
    color: "#024731",
    points: [
      "Define course study material structures",
      "Set extra credit point values for contributions",
      "Control access to previous semester materials",
      "Export compiled resources as open educational resources",
    ],
  },
  {
    id: "ta",
    title: "Teaching Assistants",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#024731"/>
        <path d="M8 22L14 10L20 18L24 14L26 22H8Z" stroke="#E8F5E9" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#2d6a44",
    points: [
      "Review and select highest-quality student submissions",
      "Approve entries for the course glossary",
      "Provide feedback on the selection process",
      "Maintain academic quality standards",
    ],
  },
  {
    id: "student",
    title: "Students",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#024731"/>
        <path d="M16 8L24 12.5L16 17L8 12.5L16 8Z" fill="#E8F5E9" opacity="0.9"/>
        <path d="M11 15v5c0 2 2.2 3.5 5 3.5s5-1.5 5-3.5v-5" stroke="#E8F5E9" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    color: "#4a9b65",
    points: [
      "Enroll in courses and view structured study materials",
      "Submit content for assigned course topics",
      "Earn extra credit for approved submissions",
      "Highlight, annotate, and bookmark materials interactively",
    ],
  },
];
 
const phases = [
  {
    number: "01",
    title: "Glossary Terms",
    desc: "Instructors define terminology needs. Students submit definitions, TAs approve the best ones. A living, course-specific glossary is born.",
    status: "Phase 1",
  },
  {
    number: "02",
    title: "Worked Solutions",
    desc: "Students contribute worked problem solutions and analyses. Peer-reviewed content builds a comprehensive problem bank.",
    status: "Coming Soon",
  },
  {
    number: "03",
    title: "Open Exports",
    desc: "Cross-course sharing and open educational resource exports make StudyViser a lasting academic commons.",
    status: "Future",
  },
];
 
export default function AboutPage() {
  const [activeRole, setActiveRole] = useState("instructor");
 
  const activeRoleData = roles.find((r) => r.id === activeRole)!;
 
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Belanosima:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
 
        :root {
          --green-dark: #024731;
          --green-mid: #2d6a44;
          --green-light: #4a9b65;
          --green-pale: #a8d5b5;
          --green-muted: #E8F5E9;
          --white: #ffffff;
          --gray-text: #4a5568;
          --text-dark: #1a2e22;
        }
 
        * { box-sizing: border-box; margin: 0; padding: 0; }
 
        body { font-family: 'Inter', sans-serif; }
 
        /* ── NAV ── */
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          position: relative;
          z-index: 50;
          background: white;
          border-bottom: 1px solid #e8f0eb;
        }
 
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
 
        .logo-text {
          font-family: 'Belanosima', sans-serif;
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--green-dark);
          letter-spacing: -0.5px;
        }
 
        .nav-links {
          display: flex;
          align-items: center;
          gap: 40px;
          list-style: none;
        }
 
        .nav-links a {
          text-decoration: none;
          color: var(--green-dark);
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s;
          position: relative;
        }
 
        .nav-links a.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0; right: 0;
          height: 2px;
          background: var(--green-dark);
          border-radius: 2px;
        }
 
        .nav-links a:hover { color: var(--green-mid); }
 
        .courses-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
 
        .courses-wrapper span {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--green-dark);
        }
 
        .dropdown-arrow {
          width: 18px; height: 18px;
          color: var(--green-dark);
          transition: transform 0.2s;
        }
 
        .dropdown-arrow.open { transform: rotate(180deg); }
 
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          min-width: 180px;
          padding: 8px 0;
          z-index: 100;
        }
 
        .dropdown-menu a {
          display: block;
          padding: 10px 20px;
          color: var(--green-dark);
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          transition: background 0.15s;
        }
 
        .dropdown-menu a:hover { background: #f0faf4; }
 
        .nav-auth { display: flex; align-items: center; gap: 20px; }
 
        .login-btn {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--green-dark);
          text-decoration: underline;
          text-underline-offset: 3px;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
 
        .login-btn:hover { color: var(--green-mid); }
 
        .register-btn {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          color: white;
          background: var(--green-dark);
          border: none;
          border-radius: 8px;
          padding: 10px 24px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
 
        .register-btn:hover {
          background: var(--green-mid);
          transform: translateY(-1px);
        }
 
        /* ── HERO BAND ── */
        .about-hero {
          background: var(--green-dark);
          padding: 80px 48px 90px;
          position: relative;
          overflow: hidden;
        }
 
        .about-hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 48px;
          background: white;
          clip-path: polygon(0 100%, 100% 100%, 100% 0);
        }
 
        .about-hero-inner {
          max-width: 760px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 2;
        }
 
        .about-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--green-pale);
          margin-bottom: 16px;
        }
 
        .about-hero h1 {
          font-family: 'Belanosima', sans-serif;
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 700;
          color: white;
          line-height: 1.15;
          margin-bottom: 24px;
        }
 
        .about-hero p {
          font-family: 'Inter', sans-serif;
          font-size: 1.05rem;
          color: var(--green-muted);
          line-height: 1.75;
          opacity: 0.9;
        }
 
        /* ── PROBLEM / SOLUTION ── */
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          max-width: 1100px;
          margin: 72px auto;
          padding: 0 48px;
        }
 
        .two-col-card {
          padding: 40px 44px;
          border-radius: 16px;
        }
 
        .two-col-card.problem {
          background: #f7faf8;
          border: 1px solid #d4e8da;
          margin-right: 16px;
        }
 
        .two-col-card.solution {
          background: var(--green-dark);
          color: white;
        }
 
        .card-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
 
        .problem .card-eyebrow { color: var(--green-light); }
        .solution .card-eyebrow { color: var(--green-pale); }
 
        .two-col-card h2 {
          font-family: 'Belanosima', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.2;
        }
 
        .problem h2 { color: var(--green-dark); }
        .solution h2 { color: white; }
 
        .two-col-card p {
          font-family: 'Inter', sans-serif;
          font-size: 0.96rem;
          line-height: 1.75;
        }
 
        .problem p { color: var(--gray-text); }
        .solution p { color: #c8e6d0; }
 
        /* ── HOW IT WORKS ── */
        .section {
          padding: 72px 48px;
        }
 
        .section-label {
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--green-light);
          margin-bottom: 12px;
        }
 
        .section-title {
          font-family: 'Belanosima', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 700;
          color: var(--green-dark);
          text-align: center;
          margin-bottom: 56px;
        }
 
        .phases-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }
 
        .phase-card {
          border: 1.5px solid #d4e8da;
          border-radius: 16px;
          padding: 36px 32px;
          position: relative;
          transition: box-shadow 0.2s, transform 0.2s;
          background: white;
        }
 
        .phase-card:hover {
          box-shadow: 0 8px 32px rgba(2,71,49,0.10);
          transform: translateY(-3px);
        }
 
        .phase-number {
          font-family: 'Belanosima', sans-serif;
          font-size: 3rem;
          font-weight: 700;
          color: var(--green-muted);
          line-height: 1;
          margin-bottom: 4px;
        }
 
        .phase-status {
          display: inline-block;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--green-light);
          background: var(--green-muted);
          border-radius: 20px;
          padding: 3px 10px;
          margin-bottom: 14px;
        }
 
        .phase-card h3 {
          font-family: 'Belanosima', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--green-dark);
          margin-bottom: 10px;
        }
 
        .phase-card p {
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          color: var(--gray-text);
          line-height: 1.7;
        }
 
        /* ── ROLES ── */
        .roles-section {
          background: #f7faf8;
          padding: 80px 48px;
        }
 
        .roles-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 48px;
        }
 
        .role-tab {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 10px 24px;
          border-radius: 50px;
          border: 1.5px solid #d4e8da;
          background: white;
          color: var(--green-dark);
          cursor: pointer;
          transition: all 0.2s;
        }
 
        .role-tab.active, .role-tab:hover {
          background: var(--green-dark);
          color: white;
          border-color: var(--green-dark);
        }
 
        .role-content {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 44px 48px;
          border: 1.5px solid #d4e8da;
          box-shadow: 0 4px 24px rgba(2,71,49,0.07);
        }
 
        .role-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
        }
 
        .role-title {
          font-family: 'Belanosima', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--green-dark);
        }
 
        .role-points {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
 
        .role-points li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 0.96rem;
          color: var(--gray-text);
          line-height: 1.6;
        }
 
        .role-points li::before {
          content: '';
          width: 8px;
          height: 8px;
          min-width: 8px;
          border-radius: 50%;
          background: var(--green-light);
          margin-top: 7px;
        }
 
        .multi-role-note {
          margin-top: 28px;
          padding: 16px 20px;
          background: var(--green-muted);
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          color: var(--green-dark);
          line-height: 1.6;
        }
 
        /* ── CTA ── */
        .cta-section {
          padding: 80px 48px;
          text-align: center;
        }
 
        .cta-section h2 {
          font-family: 'Belanosima', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 700;
          color: var(--green-dark);
          margin-bottom: 16px;
        }
 
        .cta-section p {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: var(--gray-text);
          max-width: 480px;
          margin: 0 auto 36px;
          line-height: 1.7;
        }
 
        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
 
        .cta-primary {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          color: white;
          background: var(--green-dark);
          border: none;
          border-radius: 8px;
          padding: 14px 36px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(2,71,49,0.2);
        }
 
        .cta-primary:hover {
          background: var(--green-mid);
          transform: translateY(-2px);
        }
 
        .cta-secondary {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          color: var(--green-dark);
          background: white;
          border: 1.5px solid var(--green-dark);
          border-radius: 8px;
          padding: 14px 36px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
 
        .cta-secondary:hover {
          background: var(--green-muted);
          transform: translateY(-2px);
        }
 
        /* ── FOOTER ── */
        .footer-bar {
          background: var(--green-dark);
          color: white;
          text-align: center;
          padding: 28px 20px 24px;
        }
 
        .footer-university {
          font-family: 'Belanosima', sans-serif;
          font-size: clamp(1.1rem, 2.5vw, 1.6rem);
          font-weight: 600;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }
 
        .footer-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          opacity: 0.8;
          font-weight: 400;
        }
 
        @media (max-width: 768px) {
          .nav { padding: 16px 20px; }
          .nav-links { display: none; }
          .two-col { grid-template-columns: 1fr; padding: 0 20px; }
          .two-col-card.problem { margin-right: 0; margin-bottom: 16px; }
          .phases-grid { grid-template-columns: 1fr; }
          .section, .roles-section, .cta-section { padding: 48px 20px; }
          .about-hero { padding: 56px 20px 72px; }
          .role-content { padding: 28px 24px; }
        }
      `}</style>
 
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <p className="about-eyebrow">About StudyViser</p>
          <h1>Study smarter,<br />together.</h1>
          <p>
            A collaborative platform where instructors, TAs, and students work together
            to build verified, course-specific study materials — and earn credit doing it.
          </p>
        </div>
      </section>
 
      {/* Problem / Solution */}
      <div className="two-col">
        <div className="two-col-card problem">
          <p className="card-eyebrow">The Problem</p>
          <h2>Students are left piecing it together alone.</h2>
          <p>
            Study materials are scattered across textbooks, lecture notes, and forums — with no quality
            assurance or institutional backing. Every course has different learning needs, yet students
            receive no guidance on what to prioritize. Worse, students can&apos;t preview what a course
            demands until they&apos;re already enrolled.
          </p>
        </div>
        <div className="two-col-card solution">
          <p className="card-eyebrow">The Solution</p>
          <h2>Structured, verified, community-built resources.</h2>
          <p>
            StudyViser lets instructors define exactly what their course needs, students earn extra
            credit by contributing quality materials, and TAs ensure every approved entry meets
            the bar. The result: a living, institution-verified study resource that grows better
            every semester.
          </p>
        </div>
      </div>
 
      {/* How It Works */}
      <section className="section">
        <p className="section-label">Our Approach</p>
        <h2 className="section-title">Built to grow, phase by phase.</h2>
        <div className="phases-grid">
          {phases.map((phase) => (
            <div className="phase-card" key={phase.number}>
              <div className="phase-number">{phase.number}</div>
              <span className="phase-status">{phase.status}</span>
              <h3>{phase.title}</h3>
              <p>{phase.desc}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* Roles */}
      <section className="roles-section">
        <p className="section-label">User Roles</p>
        <h2 className="section-title">Everyone has a part to play.</h2>
 
        <div className="roles-tabs">
          {roles.map((role) => (
            <button
              key={role.id}
              className={`role-tab ${activeRole === role.id ? "active" : ""}`}
              onClick={() => setActiveRole(role.id)}
            >
              {role.title}
            </button>
          ))}
        </div>
 
        <div className="role-content">
          <div className="role-header">
            {activeRoleData.icon}
            <span className="role-title">{activeRoleData.title}</span>
          </div>
          <ul className="role-points">
            {activeRoleData.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
          <div className="multi-role-note">
            💡 <strong>Multi-role support:</strong> Any user can hold multiple roles. A graduate student, for example, can be both a TA in one course and a student in another.
          </div>
        </div>
      </section>
 
      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to study better together?</h2>
        <p>Join StudyViser and help build the study resources your courses actually need.</p>
        <div className="cta-buttons">
          <button className="cta-primary">Get Started</button>
          <button className="cta-secondary">Visit Courses</button>
        </div>
      </section>
 
      {/* Footer */}
      <footer className="footer-bar">
        <p className="footer-university">University <em>of</em> Hawai&#x02BB;i&#174; <em>at</em> M&#x101;noa</p>
        <p className="footer-subtitle">Ke Kulanui o Hawai&#x02BB;i ma M&#x101;noa</p>
      </footer>
    </main>
  );
}
 