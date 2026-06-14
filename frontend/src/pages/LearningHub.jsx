import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASIC_COURSES, INTERMEDIATE_COURSES } from '../data/courses';
import './LearningHub.css';

const LearningHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [search, setSearch] = useState('');
  const progress = JSON.parse(localStorage.getItem('flx_progress') || '{}');

  const getProgress = (id) => progress[id] || 0;
  const getQuizDone = (id) => (progress[`quiz_${id}`] || 0) >= 60;

  const courses = activeTab === 'basic' ? BASIC_COURSES : INTERMEDIATE_COURSES;
  const filtered = courses.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalBasicDone = BASIC_COURSES.filter(c => getProgress(c.id) === 100).length;
  const totalIntDone = INTERMEDIATE_COURSES.filter(c => getProgress(c.id) === 100).length;
  const totalQuizzes = Object.keys(progress).filter(k => k.startsWith('quiz_')).length;

  return (
    <div className="page-container lh-page">
      {/* Hero */}
      <div className="lh-hero">
        <div className="lh-hero-content">
          <div className="lh-free-banner">
            <span>✅</span>
            <span>All Basic & Intermediate Courses are 100% Free — No Credit Card Required</span>
          </div>
          <h1 className="lh-hero-title">Finance Learning <span className="gradient-text">Academy</span></h1>
          <p className="lh-hero-desc">Professional finance education with 15 pages per course, 20-question quizzes, and downloadable PDF notes. Free for all learners.</p>
          <div className="lh-hero-stats">
            <div className="lh-stat"><span className="lh-stat-val">{BASIC_COURSES.length + INTERMEDIATE_COURSES.length}</span><span className="lh-stat-label">Free Courses</span></div>
            <div className="lh-stat"><span className="lh-stat-val">240</span><span className="lh-stat-label">Free Pages</span></div>
            <div className="lh-stat"><span className="lh-stat-val">{totalBasicDone + totalIntDone}</span><span className="lh-stat-label">Completed</span></div>
            <div className="lh-stat"><span className="lh-stat-val">{totalQuizzes}</span><span className="lh-stat-label">Quizzes Done</span></div>
          </div>
        </div>
        <div className="lh-hero-right">
          <div className="lh-tier-cards">
            <div className="lh-tier-card free-tier">
              <div className="ltc-header">
                <span className="ltc-icon">🆓</span>
                <span className="ltc-badge free">FREE</span>
              </div>
              <div className="ltc-title">Basic + Intermediate</div>
              <div className="ltc-items">
                <div>✓ {BASIC_COURSES.length} Basic Courses</div>
                <div>✓ {INTERMEDIATE_COURSES.length} Intermediate Courses</div>
                <div>✓ 15 pages per course</div>
                <div>✓ 20 quiz questions each</div>
                <div>✓ PDF download</div>
              </div>
            </div>
            <div className="lh-tier-card premium-tier" onClick={() => navigate('/premium')}>
              <div className="ltc-header">
                <span className="ltc-icon">👑</span>
                <span className="ltc-badge premium">$100</span>
              </div>
              <div className="ltc-title">Advanced Courses</div>
              <div className="ltc-items">
                <div>✓ 6 Advanced Courses</div>
                <div>✓ 25 pages per course</div>
                <div>✓ Book-inspired content</div>
                <div>✓ Expert badges</div>
                <div>✓ Lifetime access</div>
              </div>
              <button className="ltc-unlock-btn">Unlock Premium →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab + Search */}
      <div className="lh-controls">
        <div className="lh-tabs">
          <button className={`lh-tab ${activeTab === 'basic' ? 'active basic' : ''}`} onClick={() => setActiveTab('basic')}>
            🌱 Basic Courses
            <span className="lh-tab-count">{BASIC_COURSES.length}</span>
            <span className="lh-tab-free">FREE</span>
          </button>
          <button className={`lh-tab ${activeTab === 'intermediate' ? 'active intermediate' : ''}`} onClick={() => setActiveTab('intermediate')}>
            📈 Intermediate Courses
            <span className="lh-tab-count">{INTERMEDIATE_COURSES.length}</span>
            <span className="lh-tab-free">FREE</span>
          </button>
          <button className="lh-tab premium-tab" onClick={() => navigate('/premium')}>
            👑 Advanced (Premium)
            <span className="lh-tab-premium">$100</span>
          </button>
        </div>
        <div className="lh-search">
          <span>🔍</span>
          <input placeholder={`Search ${activeTab} courses...`} value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')}>✕</button>}
        </div>
      </div>

      {/* Section Header */}
      <div className="lh-section-header">
        <div>
          <h2 className="lh-section-title">
            {activeTab === 'basic' ? '🌱 Basic Courses' : '📈 Intermediate Courses'}
          </h2>
          <p className="lh-section-desc">
            {activeTab === 'basic'
              ? 'Perfect for beginners with no financial background. Build your foundation.'
              : 'For learners with basic knowledge. Dive deeper into investing and finance.'}
          </p>
        </div>
        <div className="lh-section-progress">
          <span>{activeTab === 'basic' ? totalBasicDone : totalIntDone} / {courses.length} completed</span>
          <div className="lh-section-bar">
            <div style={{ width: `${((activeTab === 'basic' ? totalBasicDone : totalIntDone) / courses.length) * 100}%`, background: activeTab === 'basic' ? '#10b981' : '#f59e0b', height: '100%', borderRadius: 3, transition: 'width .5s' }}></div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="lh-grid">
        {filtered.map(course => {
          const pct = getProgress(course.id);
          const quizDone = getQuizDone(course.id);
          const levelColor = activeTab === 'basic' ? '#10b981' : '#f59e0b';
          return (
            <div key={course.id} className="lh-card glass-card">
              {/* Banner */}
              <div className="lhc-banner" style={{ background: course.gradient }}>
                <div className="lhc-top-row">
                  <span className="lhc-icon">{course.icon}</span>
                  <div className="lhc-badges">
                    <span className="lhc-free-badge">FREE</span>
                    {quizDone && <span className="lhc-done-badge">🏆 Done</span>}
                  </div>
                </div>
                <h3 className="lhc-title">{course.title}</h3>
                <p className="lhc-desc">{course.description}</p>
                <div className="lhc-meta-row">
                  <span>📄 {course.pages} pages</span>
                  <span>⏱️ {course.duration}</span>
                  <span>⭐ {course.rating}</span>
                  <span>👥 {(course.enrolled / 1000).toFixed(0)}K+</span>
                </div>
              </div>

              {/* Topics */}
              <div className="lhc-topics">
                {course.topics.slice(0, 5).map(t => (
                  <span key={t} className="lhc-topic">{t}</span>
                ))}
                {course.topics.length > 5 && <span className="lhc-topic more">+{course.topics.length - 5}</span>}
              </div>

              {/* Progress */}
              <div className="lhc-progress-section">
                <div className="lhc-progress-row">
                  <span className="lhc-progress-label">Progress</span>
                  <span className="lhc-progress-pct" style={{ color: levelColor }}>{pct}%</span>
                </div>
                <div className="lhc-progress-bar">
                  <div className="lhc-progress-fill" style={{ width: `${pct}%`, background: levelColor }}></div>
                </div>
              </div>

              {/* Actions */}
              <div className="lhc-actions">
                <button className="lhc-btn-primary" style={{ background: course.gradient }}
                  onClick={() => navigate(`/learn/${course.id}`)}>
                  {pct > 0 ? '📖 Continue Reading' : '🚀 Start Course'}
                </button>
                <button className="lhc-btn-quiz" onClick={() => navigate(`/quiz/${course.id}`)}>
                  🧠 Quiz {quizDone ? '✅' : ''}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Premium CTA */}
      <div className="lh-premium-cta" onClick={() => navigate('/premium')}>
        <div className="lhpc-left">
          <span className="lhpc-crown">👑</span>
          <div>
            <div className="lhpc-title">Unlock Advanced Investing Courses — Premium Access $100</div>
            <div className="lhpc-desc">6 advanced courses · 25 pages each · Inspired by The Intelligent Investor, Psychology of Money, Rich Dad Poor Dad & more · Lifetime access</div>
          </div>
        </div>
        <button className="lhpc-btn">Unlock Premium →</button>
      </div>

      {/* Learning Path */}
      <div className="lh-path glass-card">
        <h3>🗺️ Recommended Free Learning Path</h3>
        <p className="lh-path-desc">Follow this sequence for the best learning experience</p>
        <div className="lhp-track">
          {[
            { id:'personal-finance', label:'Personal Finance', step:1 },
            { id:'saving-strategies', label:'Saving Strategies', step:2 },
            { id:'budget-basics', label:'Budget Planning', step:3 },
            { id:'financial-discipline', label:'Financial Discipline', step:4 },
            { id:'intro-stocks', label:'Intro to Stocks', step:5 },
            { id:'sip-basics', label:'SIP Basics', step:6 },
            { id:'investment-planning', label:'Investment Planning', step:7 },
            { id:'portfolio-basics', label:'Portfolio Basics', step:8 },
          ].map((step, i) => {
            const course = [...BASIC_COURSES, ...INTERMEDIATE_COURSES].find(c => c.id === step.id);
            const done = getProgress(step.id) === 100;
            return (
              <React.Fragment key={i}>
                <div className={`lhp-node ${done ? 'done' : ''}`}
                  style={{ borderColor: course?.color || '#6366f1' }}
                  onClick={() => navigate(`/learn/${step.id}`)}>
                  <div className="lhpn-step" style={{ background: course?.gradient || 'var(--gradient-primary)' }}>{step.step}</div>
                  <div className="lhpn-icon">{course?.icon}</div>
                  <div className="lhpn-label">{step.label}</div>
                  {done && <div className="lhpn-done">✅</div>}
                </div>
                {i < 7 && <div className="lhp-arrow">→</div>}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningHub;
