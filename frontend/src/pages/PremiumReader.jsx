import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PREMIUM_COURSES } from '../data/premiumCourses';
import { COURSE_PAGES, getPages } from '../data/premiumPages';
import { courseService } from '../services/courseService';
import { toast } from 'react-toastify';
import './PremiumReader.css';

const PremiumReader = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isPremium = localStorage.getItem('flx_premium') === 'true';
  const course = PREMIUM_COURSES.find(c => c.id === courseId);
  const rawPages = getPages(courseId);

  // Check individual course unlock
  const getUnlocked = () => {
    try { return JSON.parse(localStorage.getItem('flx_unlocked_courses') || '[]'); } catch { return []; }
  };
  const isUnlocked = getUnlocked().includes(courseId) || isPremium;

  // Pad to 25 pages if needed
  const pages = rawPages.length >= 25 ? rawPages.slice(0, 25) : [
    ...rawPages,
    ...Array.from({ length: 25 - rawPages.length }, (_, i) => ({
      ch: Math.floor((rawPages.length + i) / 3) + 1,
      pg: ((rawPages.length + i) % 3) + 1,
      title: course?.chapters?.[Math.min(Math.floor((rawPages.length + i) / 3), (course?.chapters?.length || 1) - 1)]?.title || `Chapter ${Math.floor((rawPages.length + i) / 3) + 1}`,
      sub: `${course?.title || ''} — Advanced Concepts`,
      body: `This section covers advanced professional concepts in ${course?.title || 'this topic'}. As a premium student, you have access to the most comprehensive finance education available.\n\nThe concepts here are drawn from the world's best investing books and professional frameworks. Each principle has been tested and refined by the greatest investors of our time.\n\nApplying these concepts consistently over time will give you a significant edge in building long-term wealth and achieving financial freedom.`,
      points: ['Master the core principles of this chapter', 'Apply professional frameworks to real decisions', 'Understand the psychological aspects', 'Learn from real-world case studies', 'Build systematic habits for consistent application'],
      highlight: '💡 "The secret to investing is to figure out the value of something and then pay a lot less." — Joel Greenblatt',
      example: `Professional investors who master these concepts consistently outperform the market by 3–5% annually. Over 20 years, this compounds to 2–3x more wealth than average market returns.`,
    }))
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [animDir, setAnimDir] = useState('none'); // 'left' | 'right' | 'none'
  const [isAnimating, setIsAnimating] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem(`flx_bm_${courseId}`) || '[]'));
  const [showTOC, setShowTOC] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [readPages, setReadPages] = useState(() => new Set(JSON.parse(localStorage.getItem(`flx_read_${courseId}`) || '[]')));
  const [progress, setProgress] = useState(() => JSON.parse(localStorage.getItem('flx_progress') || '{}'));
  const pageRef = useRef(null);

  useEffect(() => { if (!isUnlocked || !course) navigate('/premium'); }, []);

  const goToPage = useCallback((idx, dir = 'right') => {
    if (isAnimating || idx === currentPage) return;
    setAnimDir(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(idx);
      setAnimDir('none');
      setIsAnimating(false);
      if (pageRef.current) pageRef.current.scrollTop = 0;
    }, 320);
  }, [isAnimating, currentPage]);

  const nextPage = () => { if (currentPage < pages.length - 1) goToPage(currentPage + 1, 'right'); };
  const prevPage = () => { if (currentPage > 0) goToPage(currentPage - 1, 'left'); };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentPage, isAnimating]);

  const markRead = () => {
    const updated = new Set(readPages);
    updated.add(currentPage);
    setReadPages(updated);
    localStorage.setItem(`flx_read_${courseId}`, JSON.stringify([...updated]));
    const pct = Math.round((updated.size / pages.length) * 100);
    const newProg = { ...progress, [`premium_${courseId}`]: pct };
    setProgress(newProg);
    localStorage.setItem('flx_progress', JSON.stringify(newProg));
    // Sync to backend (fire-and-forget)
    courseService.saveProgress(`premium_${courseId}`, pct, updated.size).catch(() => {});
    if (currentPage < pages.length - 1) { nextPage(); }
    else toast.success('🎉 Course complete! Take the quiz to earn your badge.');
  };

  const toggleBookmark = () => {
    const updated = bookmarks.includes(currentPage)
      ? bookmarks.filter(b => b !== currentPage)
      : [...bookmarks, currentPage];
    setBookmarks(updated);
    localStorage.setItem(`flx_bm_${courseId}`, JSON.stringify(updated));
    toast.success(bookmarks.includes(currentPage) ? 'Bookmark removed' : '🔖 Page bookmarked!');
  };

  const handleDownload = () => {
    const lines = [];
    lines.push(`╔${'═'.repeat(68)}╗`);
    lines.push(`║  FinLearnX PREMIUM COURSE${' '.repeat(42)}║`);
    lines.push(`║  ${course.title}${' '.repeat(Math.max(0, 66 - course.title.length))}║`);
    lines.push(`║  ${course.subtitle}${' '.repeat(Math.max(0, 66 - course.subtitle.length))}║`);
    lines.push(`╚${'═'.repeat(68)}╝`);
    lines.push('');
    pages.forEach((p, i) => {
      lines.push(`${'─'.repeat(70)}`);
      lines.push(`PAGE ${i + 1} / ${pages.length}  |  CHAPTER ${p.ch}`);
      lines.push(`${p.title}`);
      lines.push(`${p.sub}`);
      lines.push('');
      p.body.split('\n\n').forEach(para => { lines.push(para); lines.push(''); });
      lines.push('KEY POINTS:');
      p.points.forEach(pt => lines.push(`  • ${pt}`));
      lines.push('');
      lines.push(`HIGHLIGHT: ${p.highlight}`);
      lines.push('');
      lines.push(`EXAMPLE: ${p.example}`);
      lines.push('');
    });
    lines.push(`${'═'.repeat(70)}`);
    lines.push(`Downloaded from FinLearnX Premium Academy`);
    lines.push(`Date: ${new Date().toLocaleDateString('en-IN')}`);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FinLearnX_${courseId}_Premium_Course.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('📄 Course notes downloaded successfully!');
  };

  if (!isUnlocked || !course) return null;

  const page = pages[currentPage];
  const pct = Math.round((readPages.size / pages.length) * 100);
  const chapterPages = course.chapters?.map((ch, i) => ({
    ...ch, startPage: course.chapters.slice(0, i).reduce((s, c) => s + c.pages, 0)
  })) || [];

  const animClass = animDir === 'right' ? 'slide-out-left' : animDir === 'left' ? 'slide-out-right' : '';

  return (
    <div className="pr-page">
      {/* Top Bar */}
      <div className="pr-topbar">
        <button className="pr-back-btn" onClick={() => navigate('/premium')}>← Premium Hub</button>
        <div className="pr-title-area">
          <span className="pr-course-icon">{course.icon}</span>
          <span className="pr-course-name">{course.title}</span>
          <span className="pr-premium-pill">👑 PREMIUM</span>
        </div>
        <div className="pr-topbar-right">
          <div className="pr-page-indicator">
            <span className="pr-page-current">{currentPage + 1}</span>
            <span className="pr-page-sep">/</span>
            <span className="pr-page-total">{pages.length}</span>
          </div>
          <button className={`pr-icon-btn ${bookmarks.includes(currentPage) ? 'bookmarked' : ''}`} onClick={toggleBookmark} title="Bookmark this page">🔖</button>
          <button className="pr-icon-btn" onClick={() => setShowTOC(s => !s)} title="Table of Contents">📋</button>
          <button className="pr-icon-btn" onClick={() => setZoom(z => Math.min(z + 10, 130))} title="Zoom In">🔍+</button>
          <button className="pr-icon-btn" onClick={() => setZoom(z => Math.max(z - 10, 80))} title="Zoom Out">🔍-</button>
          <button className="pr-dl-btn" onClick={handleDownload}>📄 Download PDF</button>
          <button className="pr-quiz-btn" style={{ background: course.gradient }} onClick={() => navigate(`/premium-quiz/${courseId}`)}>🧠 Quiz</button>
        </div>
      </div>

      {/* Reading Progress Bar */}
      <div className="pr-reading-bar">
        <div className="pr-reading-fill" style={{ width: `${((currentPage + 1) / pages.length) * 100}%`, background: course.color }}></div>
      </div>

      <div className="pr-layout">
        {/* TOC Sidebar */}
        <aside className={`pr-toc-panel ${showTOC ? 'open' : ''}`}>
          <div className="pr-toc-head" style={{ background: course.gradient }}>
            <span style={{ fontSize: 24 }}>{course.icon}</span>
            <div>
              <div className="pr-toc-course">{course.title}</div>
              <div className="pr-toc-meta">{pages.length} pages · {course.duration}</div>
            </div>
          </div>
          <div className="pr-toc-scroll">
            <div className="pr-toc-label">CHAPTERS</div>
            {chapterPages.map((ch, i) => {
              const isActive = currentPage >= ch.startPage && currentPage < ch.startPage + ch.pages;
              return (
                <button key={i} className={`pr-toc-item ${isActive ? 'active' : ''}`}
                  style={{ borderLeft: isActive ? `3px solid ${course.color}` : '3px solid transparent' }}
                  onClick={() => { goToPage(ch.startPage, ch.startPage > currentPage ? 'right' : 'left'); setShowTOC(false); }}>
                  <span className="pr-toc-num" style={{ background: isActive ? course.color : 'rgba(255,255,255,.08)', color: isActive ? '#0a0a1a' : 'inherit' }}>{i + 1}</span>
                  <span className="pr-toc-ch-name">{ch.title}</span>
                  <span className="pr-toc-ch-pg">{ch.pages}p</span>
                </button>
              );
            })}
            {bookmarks.length > 0 && (
              <>
                <div className="pr-toc-label" style={{ marginTop: 16 }}>BOOKMARKS</div>
                {bookmarks.map(b => (
                  <button key={b} className="pr-toc-item" onClick={() => { goToPage(b, b > currentPage ? 'right' : 'left'); setShowTOC(false); }}>
                    <span className="pr-toc-num">🔖</span>
                    <span className="pr-toc-ch-name">Page {b + 1}</span>
                    {readPages.has(b) && <span style={{ color: '#10b981', fontSize: 12 }}>✓</span>}
                  </button>
                ))}
              </>
            )}
          </div>
          <div className="pr-toc-footer">
            <div className="pr-toc-prog-bar"><div style={{ width: `${pct}%`, background: course.color, height: '100%', borderRadius: 3, transition: 'width .5s' }}></div></div>
            <span>{pct}% read · {readPages.size}/{pages.length} pages</span>
          </div>
        </aside>

        {/* Main Reader */}
        <div className="pr-reader-area" ref={pageRef}>
          {/* Page Dots Navigation */}
          <div className="pr-dots-nav">
            {pages.map((_, i) => (
              <button key={i} className={`pr-dot-btn ${i === currentPage ? 'active' : ''} ${readPages.has(i) ? 'read' : ''}`}
                style={i === currentPage ? { background: course.color, transform: 'scale(1.4)' } : readPages.has(i) ? { background: `${course.color}60` } : {}}
                onClick={() => goToPage(i, i > currentPage ? 'right' : 'left')}
                title={`Page ${i + 1}`} />
            ))}
          </div>

          {/* Book Page */}
          <div className={`pr-book ${animClass}`} style={{ fontSize: `${zoom}%` }}>
            {/* Page Header */}
            <div className="prb-header">
              <div className="prb-chapter-tag" style={{ color: course.color, borderColor: `${course.color}40` }}>
                Chapter {page.ch} · {course.title}
              </div>
              <div className="prb-page-tag">Page {currentPage + 1} of {pages.length}</div>
            </div>

            {/* Title Block */}
            <div className="prb-title-block" style={{ borderLeft: `5px solid ${course.color}` }}>
              <h1 className="prb-title">{page.title}</h1>
              <p className="prb-subtitle">{page.sub}</p>
            </div>

            {/* Gold Callout */}
            <div className="prb-callout" style={{ borderColor: `${course.color}60`, background: `${course.color}0d` }}>
              <span className="prb-callout-icon">💡</span>
              <p className="prb-callout-text">{page.highlight}</p>
            </div>

            {/* Body Content */}
            <div className="prb-body">
              {page.body.split('\n\n').map((para, i) => (
                <p key={i} className="prb-para">{para}</p>
              ))}
            </div>

            {/* Key Points */}
            <div className="prb-keypoints">
              <div className="prb-kp-title" style={{ color: course.color }}>📌 Key Points</div>
              <ul className="prb-kp-list">
                {page.points.map((pt, i) => (
                  <li key={i} className="prb-kp-item">
                    <span className="prb-kp-bullet" style={{ background: course.color }}></span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Case Study */}
            <div className="prb-case-study">
              <div className="prb-cs-label" style={{ color: course.color }}>📊 Real-World Case Study</div>
              <p className="prb-cs-text">{page.example}</p>
            </div>

            {/* Page Footer */}
            <div className="prb-footer">
              <span>{course.title} · 👑 FinLearnX Premium</span>
              <span>Page {currentPage + 1} / {pages.length}</span>
            </div>

            {/* Navigation */}
            <div className="prb-nav">
              <button className="prb-nav-prev" onClick={prevPage} disabled={currentPage === 0}>
                ← Previous
              </button>
              <button className="prb-mark-btn" onClick={markRead}
                style={{ background: readPages.has(currentPage) ? 'rgba(16,185,129,.25)' : course.gradient, color: readPages.has(currentPage) ? '#10b981' : 'white' }}>
                {readPages.has(currentPage) ? '✅ Read — Next Page →' : '✓ Mark Read & Continue →'}
              </button>
              {currentPage === pages.length - 1 ? (
                <button className="prb-nav-quiz" style={{ borderColor: course.color, color: course.color }}
                  onClick={() => navigate(`/premium-quiz/${courseId}`)}>
                  Take Quiz 🧠
                </button>
              ) : (
                <button className="prb-nav-next" onClick={nextPage}>
                  Next →
                </button>
              )}
            </div>
          </div>

          {/* Bottom Page Counter */}
          <div className="pr-bottom-nav">
            <button className="pr-bottom-btn" onClick={prevPage} disabled={currentPage === 0}>‹ Prev</button>
            <div className="pr-bottom-counter">
              <span className="pr-bc-current" style={{ color: course.color }}>{currentPage + 1}</span>
              <span className="pr-bc-sep"> / </span>
              <span className="pr-bc-total">{pages.length}</span>
              <div className="pr-bc-bar">
                <div style={{ width: `${((currentPage + 1) / pages.length) * 100}%`, background: course.color, height: '100%', borderRadius: 2, transition: 'width .3s' }}></div>
              </div>
            </div>
            <button className="pr-bottom-btn" onClick={nextPage} disabled={currentPage === pages.length - 1}>Next ›</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumReader;
