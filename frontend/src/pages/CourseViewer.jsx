import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASIC_COURSES, INTERMEDIATE_COURSES } from '../data/courses';
import { FREE_CONTENT } from '../data/freeContent';
import { courseService } from '../services/courseService';
import { toast } from 'react-toastify';
import './CourseViewer.css';

const ALL_FREE_COURSES = [...BASIC_COURSES, ...INTERMEDIATE_COURSES];

function genPlaceholderPages(course, count) {
  return Array.from({ length: count }, (_, i) => ({
    pg: i + 1,
    title: course.topics[i % course.topics.length] || `Topic ${i + 1}`,
    sub: `${course.title} — Page ${i + 1}`,
    body: `This section covers ${course.topics[i % course.topics.length] || 'key concepts'} in depth.\n\nAs a learner, you will gain practical knowledge that you can apply immediately to your financial decisions.\n\nEach concept is explained with real-world Indian market examples, making it easy to understand and apply.\n\nBy the end of this page, you will have a clear understanding of this topic and how it fits into your overall financial education journey.`,
    points: [
      `Understand the core principles of ${course.topics[i % course.topics.length] || 'this topic'}`,
      'Apply concepts to real-world financial decisions',
      'Learn from practical Indian market examples',
      'Build systematic knowledge for long-term success',
      'Prepare for the quiz at the end of this module',
    ],
    highlight: `💡 "${course.title} is one of the most important topics in personal finance. Master it and you will be ahead of 90% of people."`,
    example: `Real-world application: Investors who master ${course.topics[i % course.topics.length] || 'these concepts'} consistently make better financial decisions and build more wealth over time.`,
  }));
}

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = ALL_FREE_COURSES.find(c => c.id === courseId);
  const isBasic = !!BASIC_COURSES.find(c => c.id === courseId);
  const levelColor = isBasic ? '#10b981' : '#f59e0b';

  useEffect(() => { if (!course) navigate('/learn'); }, []);

  const rawPages = FREE_CONTENT[courseId] || [];
  const totalPages = course?.pages || 15;
  const pages = rawPages.length >= totalPages
    ? rawPages.slice(0, totalPages)
    : [...rawPages, ...genPlaceholderPages(course || { title: '', topics: [] }, totalPages - rawPages.length)];

  const [currentPage, setCurrentPage] = useState(0);
  const [animDir, setAnimDir] = useState('none');
  const [isAnimating, setIsAnimating] = useState(false);
  const [readPages, setReadPages] = useState(() => new Set(JSON.parse(localStorage.getItem(`flx_read_${courseId}`) || '[]')));
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem(`flx_bm_${courseId}`) || '[]'));
  const [progress, setProgress] = useState(() => JSON.parse(localStorage.getItem('flx_progress') || '{}'));
  const [showTOC, setShowTOC] = useState(false);
  const [zoom, setZoom] = useState(100);
  const readerRef = useRef(null);

  const goToPage = useCallback((idx, dir = 'right') => {
    if (isAnimating || idx === currentPage || idx < 0 || idx >= pages.length) return;
    setAnimDir(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(idx);
      setAnimDir('none');
      setIsAnimating(false);
      if (readerRef.current) readerRef.current.scrollTop = 0;
    }, 300);
  }, [isAnimating, currentPage, pages.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') goToPage(currentPage + 1, 'right');
      if (e.key === 'ArrowLeft') goToPage(currentPage - 1, 'left');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentPage, goToPage]);

  const markRead = () => {
    const updated = new Set(readPages);
    updated.add(currentPage);
    setReadPages(updated);
    localStorage.setItem(`flx_read_${courseId}`, JSON.stringify([...updated]));
    const pct = Math.round((updated.size / pages.length) * 100);
    const newProg = { ...progress, [courseId]: pct };
    setProgress(newProg);
    localStorage.setItem('flx_progress', JSON.stringify(newProg));
    // Sync to backend (fire-and-forget)
    courseService.saveProgress(courseId, pct, updated.size).catch(() => {});
    if (currentPage < pages.length - 1) goToPage(currentPage + 1, 'right');
    else toast.success('🎉 Course complete! Take the quiz to earn your badge.');
  };

  const toggleBookmark = () => {
    const updated = bookmarks.includes(currentPage)
      ? bookmarks.filter(b => b !== currentPage)
      : [...bookmarks, currentPage];
    setBookmarks(updated);
    localStorage.setItem(`flx_bm_${courseId}`, JSON.stringify(updated));
    toast.success(bookmarks.includes(currentPage) ? 'Bookmark removed' : '🔖 Bookmarked!');
  };

  const handleDownload = () => {
    const lines = [];
    lines.push(`╔${'═'.repeat(66)}╗`);
    lines.push(`║  FinLearnX — ${course.title}${' '.repeat(Math.max(0, 52 - course.title.length))}║`);
    lines.push(`║  ${isBasic ? 'Basic' : 'Intermediate'} Course · ${pages.length} Pages · FREE${' '.repeat(Math.max(0, 40))}║`);
    lines.push(`╚${'═'.repeat(66)}╝\n`);
    pages.forEach((p, i) => {
      lines.push(`${'─'.repeat(68)}`);
      lines.push(`PAGE ${i + 1} / ${pages.length}  |  ${p.title}`);
      lines.push(`${p.sub}\n`);
      p.body.split('\n\n').forEach(para => { lines.push(para); lines.push(''); });
      lines.push('KEY POINTS:');
      p.points.forEach(pt => lines.push(`  • ${pt}`));
      lines.push(`\nHIGHLIGHT: ${p.highlight}`);
      lines.push(`\nEXAMPLE: ${p.example}\n`);
    });
    lines.push(`${'═'.repeat(68)}`);
    lines.push(`Downloaded from FinLearnX · ${new Date().toLocaleDateString('en-IN')}`);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FinLearnX_${courseId}.txt`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    toast.success('📄 Course notes downloaded!');
  };

  if (!course) return null;

  const page = pages[currentPage];
  const pct = Math.round((readPages.size / pages.length) * 100);
  const animClass = animDir === 'right' ? 'cv-slide-right' : animDir === 'left' ? 'cv-slide-left' : '';

  return (
    <div className="page-container cv-page">
      {/* Top Bar */}
      <div className="cv-topbar">
        <button className="cv-back" onClick={() => navigate('/learn')}>← Learning Hub</button>
        <div className="cv-title-area">
          <span>{course.icon}</span>
          <span className="cv-course-name">{course.title}</span>
          <span className="cv-level-pill" style={{ background: `${levelColor}20`, color: levelColor, border: `1px solid ${levelColor}40` }}>
            {isBasic ? '🌱 Basic' : '📈 Intermediate'}
          </span>
          <span className="cv-free-pill">FREE</span>
        </div>
        <div className="cv-topbar-right">
          <div className="cv-page-counter">
            <span style={{ color: levelColor, fontWeight: 800, fontSize: 16 }}>{currentPage + 1}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}> / {pages.length}</span>
          </div>
          <button className={`cv-icon-btn ${bookmarks.includes(currentPage) ? 'active' : ''}`} onClick={toggleBookmark} title="Bookmark">🔖</button>
          <button className="cv-icon-btn" onClick={() => setShowTOC(s => !s)} title="Table of Contents">📋</button>
          <button className="cv-icon-btn" onClick={() => setZoom(z => Math.min(z + 10, 130))} title="Zoom In">🔍+</button>
          <button className="cv-icon-btn" onClick={() => setZoom(z => Math.max(z - 10, 80))} title="Zoom Out">🔍-</button>
          <button className="cv-dl-btn" onClick={handleDownload}>📄 Download PDF</button>
          <button className="cv-quiz-btn" style={{ background: course.gradient }}
            onClick={() => navigate(`/quiz/${courseId}`)}>🧠 Quiz</button>
        </div>
      </div>

      {/* Progress Strip */}
      <div className="cv-progress-strip">
        <div style={{ width: `${((currentPage + 1) / pages.length) * 100}%`, background: levelColor, height: '100%', transition: 'width .4s ease' }}></div>
      </div>

      <div className="cv-layout">
        {/* TOC */}
        <aside className={`cv-toc ${showTOC ? 'open' : ''}`}>
          <div className="cv-toc-head" style={{ background: course.gradient }}>
            <span style={{ fontSize: 22 }}>{course.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{course.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', marginTop: 2 }}>{pages.length} pages · {course.duration}</div>
            </div>
          </div>
          <div className="cv-toc-scroll">
            <div className="cv-toc-label">PAGES</div>
            {pages.map((p, i) => (
              <button key={i} className={`cv-toc-item ${currentPage === i ? 'active' : ''} ${readPages.has(i) ? 'read' : ''}`}
                style={{ borderLeft: currentPage === i ? `3px solid ${levelColor}` : '3px solid transparent' }}
                onClick={() => { goToPage(i, i > currentPage ? 'right' : 'left'); setShowTOC(false); }}>
                <span className="cv-toc-num" style={currentPage === i ? { background: levelColor, color: '#0a0a1a' } : readPages.has(i) ? { background: `${levelColor}40` } : {}}>
                  {readPages.has(i) ? '✓' : i + 1}
                </span>
                <span className="cv-toc-title">{p.title}</span>
              </button>
            ))}
            <button className="cv-toc-item quiz-item" onClick={() => navigate(`/quiz/${courseId}`)}>
              <span className="cv-toc-num">🧠</span>
              <span className="cv-toc-title">Final Quiz (20 Qs)</span>
            </button>
            {bookmarks.length > 0 && (
              <>
                <div className="cv-toc-label" style={{ marginTop: 12 }}>BOOKMARKS</div>
                {bookmarks.map(b => (
                  <button key={b} className="cv-toc-item" onClick={() => { goToPage(b, b > currentPage ? 'right' : 'left'); setShowTOC(false); }}>
                    <span className="cv-toc-num">🔖</span>
                    <span className="cv-toc-title">Page {b + 1}</span>
                  </button>
                ))}
              </>
            )}
          </div>
          <div className="cv-toc-footer">
            <div className="cv-toc-prog"><div style={{ width: `${pct}%`, background: levelColor, height: '100%', borderRadius: 2, transition: 'width .5s' }}></div></div>
            <span>{pct}% read · {readPages.size}/{pages.length} pages</span>
          </div>
        </aside>

        {/* Reader */}
        <div className="cv-reader" ref={readerRef}>
          {/* Page Dots */}
          <div className="cv-dots">
            {pages.map((_, i) => (
              <button key={i} className="cv-dot"
                style={{ background: i === currentPage ? levelColor : readPages.has(i) ? `${levelColor}50` : 'rgba(255,255,255,.12)', transform: i === currentPage ? 'scale(1.5)' : 'scale(1)' }}
                onClick={() => goToPage(i, i > currentPage ? 'right' : 'left')} title={`Page ${i + 1}`} />
            ))}
          </div>

          {/* Document */}
          <div className={`cv-doc ${animClass}`} style={{ fontSize: `${zoom}%` }}>
            <div className="cvd-header">
              <div className="cvd-breadcrumb">
                <span style={{ color: course.color }}>{course.icon} {course.title}</span>
                <span>›</span>
                <span style={{ color: levelColor }}>{isBasic ? '🌱 Basic' : '📈 Intermediate'}</span>
                <span>›</span>
                <span style={{ color: 'var(--text-muted)' }}>Page {currentPage + 1} of {pages.length}</span>
              </div>
              <div className="cvd-page-num">Page {currentPage + 1}</div>
            </div>

            <div className="cvd-title-block" style={{ borderLeft: `5px solid ${levelColor}` }}>
              <h1 className="cvd-title">{page.title}</h1>
              <p className="cvd-subtitle">{page.sub}</p>
            </div>

            <div className="cvd-highlight" style={{ borderColor: `${levelColor}50`, background: `${levelColor}0d` }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: 14, color: '#fbbf24', lineHeight: 1.7, fontStyle: 'italic', fontWeight: 500 }}>{page.highlight}</p>
            </div>

            <div className="cvd-body">
              {page.body.split('\n\n').map((para, i) => (
                <p key={i} className="cvd-para">{para}</p>
              ))}
            </div>

            <div className="cvd-keypoints">
              <div className="cvd-kp-title" style={{ color: levelColor }}>📌 Key Points</div>
              <ul className="cvd-kp-list">
                {page.points.map((pt, i) => (
                  <li key={i} className="cvd-kp-item">
                    <span className="cvd-kp-dot" style={{ background: levelColor }}></span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cvd-example">
              <div className="cvd-ex-label" style={{ color: levelColor }}>📊 Real-World Example</div>
              <p>{page.example}</p>
            </div>

            <div className="cvd-footer">
              <span>{course.title} · {isBasic ? 'Basic' : 'Intermediate'} · FinLearnX · FREE</span>
              <span>Page {currentPage + 1} / {pages.length}</span>
            </div>

            <div className="cvd-nav">
              <button className="cvd-nav-btn" onClick={() => goToPage(currentPage - 1, 'left')} disabled={currentPage === 0}>← Previous</button>
              <button className="cvd-mark-btn" onClick={markRead}
                style={{ background: readPages.has(currentPage) ? 'rgba(16,185,129,.2)' : levelColor, color: readPages.has(currentPage) ? '#10b981' : 'white' }}>
                {readPages.has(currentPage) ? '✅ Read — Next →' : '✓ Mark Read & Continue →'}
              </button>
              {currentPage === pages.length - 1
                ? <button className="cvd-nav-btn quiz" style={{ borderColor: levelColor, color: levelColor }} onClick={() => navigate(`/quiz/${courseId}`)}>Take Quiz 🧠</button>
                : <button className="cvd-nav-btn" onClick={() => goToPage(currentPage + 1, 'right')}>Next →</button>
              }
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="cv-bottom-nav">
            <button className="cv-bottom-btn" onClick={() => goToPage(currentPage - 1, 'left')} disabled={currentPage === 0}>‹ Prev</button>
            <div className="cv-bottom-info">
              <span style={{ color: levelColor, fontWeight: 800, fontSize: 20 }}>{currentPage + 1}</span>
              <span style={{ color: 'var(--text-muted)' }}> / {pages.length}</span>
              <div className="cv-bottom-bar"><div style={{ width: `${((currentPage + 1) / pages.length) * 100}%`, background: levelColor, height: '100%', borderRadius: 2, transition: 'width .3s' }}></div></div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct}% complete</span>
            </div>
            <button className="cv-bottom-btn" onClick={() => goToPage(currentPage + 1, 'right')} disabled={currentPage === pages.length - 1}>Next ›</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
