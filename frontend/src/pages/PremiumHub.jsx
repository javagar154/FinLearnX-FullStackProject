import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PREMIUM_COURSES } from '../data/premiumCourses';
import { premiumService } from '../services/premiumService';
import { toast } from 'react-toastify';
import './PremiumHub.css';

// Individual course unlock helpers
const getUnlocked = () => {
  try { return JSON.parse(localStorage.getItem('flx_unlocked_courses') || '[]'); }
  catch { return []; }
};
const unlockCourse = (id) => {
  const u = getUnlocked();
  if (!u.includes(id)) { u.push(id); localStorage.setItem('flx_unlocked_courses', JSON.stringify(u)); }
};
// Migrate legacy global unlock
const migrateLegacy = () => {
  if (localStorage.getItem('flx_premium') === 'true') {
    const ids = PREMIUM_COURSES.map(c => c.id);
    localStorage.setItem('flx_unlocked_courses', JSON.stringify(ids));
    localStorage.removeItem('flx_premium');
  }
};

const PremiumHub = () => {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState([]);
  const [modal, setModal] = useState(null); // courseId being unlocked
  const progress = JSON.parse(localStorage.getItem('flx_progress') || '{}');

  useEffect(() => {
    migrateLegacy();
    // Load unlocked courses from backend
    premiumService.getUnlocked()
      .then(ids => {
        setUnlocked(Array.isArray(ids) ? ids : []);
        // Keep localStorage in sync for PremiumReader access checks
        localStorage.setItem('flx_unlocked_courses', JSON.stringify(Array.isArray(ids) ? ids : []));
      })
      .catch(() => {
        // Fallback to localStorage if backend unreachable
        setUnlocked(getUnlocked());
      });
  }, []);

  const handleUnlock = async (courseId) => {
    try {
      await premiumService.unlockCourse(courseId);
      // Refresh full unlocked list from backend
      const ids = await premiumService.getUnlocked();
      const list = Array.isArray(ids) ? ids : [];
      setUnlocked(list);
      localStorage.setItem('flx_unlocked_courses', JSON.stringify(list));
      setModal(null);
      navigate(`/premium/${courseId}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to unlock course';
      toast.error(msg);
    }
  };

  const handleCourseClick = (course) => {
    if (unlocked.includes(course.id)) {
      navigate(`/premium/${course.id}`);
    } else {
      setModal(course);
    }
  };

  const getProgress = (id) => progress[`premium_${id}`] || 0;

  return (
    <div className="page-container premium-page">
      {/* Hero */}
      <div className="premium-hero">
        <div className="ph-left">
          <div className="ph-badge">👑 PREMIUM ACADEMY</div>
          <h1 className="ph-title">Advanced Investing &<br /><span className="gold-text">Wealth Building</span><br />Masterclass</h1>
          <p className="ph-desc">Inspired by the world's greatest investing books. Each course unlocked individually for $100.</p>
          <div className="ph-books">
            {['Rich Dad Poor Dad','The Intelligent Investor','Psychology of Money','Think & Grow Rich','One Up On Wall Street'].map(b => (
              <span key={b} className="ph-book-tag">📖 {b}</span>
            ))}
          </div>
          <div className="ph-unlock-info">
            <span className="ph-unlock-icon">🔓</span>
            <span>Each course unlocked <strong>individually</strong> — pay only for what you want</span>
          </div>
        </div>
        <div className="ph-right">
          <div className="ph-stats-grid">
            <div className="ph-stat"><div className="ph-stat-val">{PREMIUM_COURSES.length}</div><div className="ph-stat-label">Premium Courses</div></div>
            <div className="ph-stat"><div className="ph-stat-val">150</div><div className="ph-stat-label">Pages of Content</div></div>
            <div className="ph-stat"><div className="ph-stat-val">120</div><div className="ph-stat-label">Quiz Questions</div></div>
            <div className="ph-stat"><div className="ph-stat-val">{unlocked.length}</div><div className="ph-stat-label">Unlocked</div></div>
          </div>
        </div>
      </div>

      {/* What You Get */}
      <div className="premium-features glass-card">
        <h3>What's Included in Each Premium Course</h3>
        <div className="pf-grid">
          {[
            { icon: '📚', title: '25 Pages Per Course', desc: 'Deep-dive content inspired by world\'s best investing books' },
            { icon: '🧠', title: '20 Advanced Quiz Questions', desc: 'Case-study based questions with timer and score analytics' },
            { icon: '📄', title: 'PDF Download', desc: 'Download all course materials for offline study' },
            { icon: '🏆', title: 'Expert Badge', desc: 'Earn a professional badge for each completed course' },
            { icon: '📖', title: 'Book-Style Reader', desc: 'Kindle-inspired reading experience with bookmarks' },
            { icon: '♾️', title: 'Lifetime Access', desc: 'One-time payment per course, access forever' },
          ].map(f => (
            <div key={f.title} className="pf-item">
              <span className="pf-icon">{f.icon}</span>
              <div><div className="pf-title">{f.title}</div><div className="pf-desc">{f.desc}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Cards */}
      <h2 className="section-title">Premium Courses — Unlock Individually</h2>
      <div className="premium-courses-grid">
        {PREMIUM_COURSES.map(course => {
          const isUnlocked = unlocked.includes(course.id);
          const pct = getProgress(course.id);
          return (
            <div key={course.id} className={`pc-card glass-card ${!isUnlocked ? 'locked' : 'unlocked'}`}
              onClick={() => handleCourseClick(course)}>
              {/* Lock Overlay */}
              {!isUnlocked && (
                <div className="pc-lock-overlay">
                  <div className="pc-lock-icon">🔒</div>
                  <div className="pc-lock-text">Premium Course</div>
                  <div className="pc-lock-price">$100 · Lifetime Access</div>
                  <button className="pc-unlock-btn"
                    onClick={e => { e.stopPropagation(); setModal(course); }}>
                    Unlock This Course →
                  </button>
                </div>
              )}

              {/* Banner */}
              <div className="pc-banner" style={{ background: course.gradient }}>
                <div className="pc-banner-top">
                  <span className="pc-icon">{course.icon}</span>
                  <div className="pc-status-badge">
                    {isUnlocked ? <span className="pc-unlocked-badge">✅ Unlocked</span> : <span className="pc-premium-badge">👑 $100</span>}
                  </div>
                </div>
                <h3 className="pc-title">{course.title}</h3>
                <p className="pc-subtitle">{course.subtitle}</p>
              </div>

              {/* Body */}
              <div className="pc-body">
                <p className="pc-desc">{course.description}</p>
                <div className="pc-books">
                  {course.books?.map(b => <span key={b} className="pc-book">📖 {b}</span>)}
                </div>
                <div className="pc-meta">
                  <span>📄 {course.pages} pages</span>
                  <span>⏱️ {course.duration}</span>
                  <span>⭐ {course.rating}</span>
                  <span>👥 {course.enrolled?.toLocaleString()}</span>
                </div>
                <div className="pc-chapters">
                  <div className="pc-chapters-label">Chapters</div>
                  {course.chapters?.slice(0, 4).map((ch, i) => (
                    <div key={i} className="pc-chapter-item">
                      <span className="pc-ch-num">{i + 1}</span>
                      <span className="pc-ch-title">{ch.title}</span>
                      <span className="pc-ch-pages">{ch.pages}p</span>
                    </div>
                  ))}
                  {(course.chapters?.length || 0) > 4 && (
                    <div className="pc-more-chapters">+{course.chapters.length - 4} more chapters</div>
                  )}
                </div>
                {isUnlocked && (
                  <div className="pc-progress-section">
                    <div className="pc-progress-bar">
                      <div className="pc-progress-fill" style={{ width: `${pct}%`, background: course.color }}></div>
                    </div>
                    <div className="pc-progress-row">
                      <span className="pc-progress-text">{pct}% complete</span>
                      {pct === 100 && <span className="pc-badge-earned">{course.badge}</span>}
                    </div>
                  </div>
                )}
                <button className="pc-cta-btn"
                  style={{ background: isUnlocked ? course.gradient : 'rgba(255,255,255,0.08)', border: isUnlocked ? 'none' : '1px solid rgba(255,255,255,0.15)' }}>
                  {!isUnlocked ? '🔒 Unlock This Course — $100' : pct > 0 ? '📖 Continue Reading' : '🚀 Start Course'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Testimonials */}
      <div className="premium-testimonials glass-card">
        <h3>What Premium Students Say</h3>
        <div className="pt-grid">
          {[
            { name: 'Rahul Sharma', role: 'Software Engineer', text: 'The Value Investing course completely changed how I analyze stocks. Made 40% returns in my first year applying these principles.', rating: 5 },
            { name: 'Priya Nair', role: 'MBA Graduate', text: 'Psychology of Money course was eye-opening. I finally understand why I was making emotional investment decisions.', rating: 5 },
            { name: 'Arjun Mehta', role: 'Entrepreneur', text: 'Financial Freedom Blueprint gave me a clear roadmap. I\'ve already started 2 passive income streams after completing it.', rating: 5 },
          ].map(t => (
            <div key={t.name} className="pt-card">
              <div className="pt-stars">{'⭐'.repeat(t.rating)}</div>
              <p className="pt-text">"{t.text}"</p>
              <div className="pt-author">
                <div className="pt-avatar">{t.name.charAt(0)}</div>
                <div><div className="pt-name">{t.name}</div><div className="pt-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Unlock Modal */}
      {modal && (
        <div className="premium-modal-overlay" onClick={() => setModal(null)}>
          <div className="premium-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            <div className="modal-header">
              <div style={{ fontSize: 48 }}>{modal.icon}</div>
              <h2>Unlock This Course</h2>
              <p>{modal.title}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{modal.subtitle}</p>
            </div>
            <div className="modal-price">
              <span className="modal-price-val">$100</span>
              <span className="modal-price-label">One-time · Lifetime Access to this course</span>
            </div>
            <div className="modal-includes">
              {[`25 pages of advanced content`,`20 expert quiz questions`,`PDF download`,`${modal.badge} badge`,`Lifetime access`].map(item => (
                <div key={item} className="modal-include-item"><span>✅</span><span>{item}</span></div>
              ))}
            </div>
            <div className="modal-course-preview" style={{ borderColor: modal.color, background: `${modal.color}10` }}>
              <span style={{ fontSize: 24 }}>{modal.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{modal.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{modal.books?.[0]}</div>
              </div>
            </div>
            <button className="modal-unlock-btn" onClick={() => handleUnlock(modal.id)}>
              👑 Unlock "{modal.title}" — $100
            </button>
            <p className="modal-demo-note">
              🎮 Demo Mode: Click to simulate purchase (no real payment)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumHub;
