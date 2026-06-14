import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PREMIUM_COURSES } from '../data/premiumCourses';
import { PREMIUM_QUIZZES } from '../data/premiumContent';
import { toast } from 'react-toastify';
import './PremiumQuiz.css';

const TIMER = 35;

const PremiumQuiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isPremium = localStorage.getItem('flx_premium') === 'true';
  const getUnlocked = () => { try { return JSON.parse(localStorage.getItem('flx_unlocked_courses') || '[]'); } catch { return []; } };
  const isUnlocked = getUnlocked().includes(courseId) || isPremium;
  const course = PREMIUM_COURSES.find(c => c.id === courseId);
  const questions = PREMIUM_QUIZZES[courseId] || [];

  const [phase, setPhase] = useState('intro');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIMER);

  useEffect(() => { if (!isUnlocked) navigate('/premium'); }, []);

  const handleTimeout = useCallback(() => {
    if (!answered) {
      const na = [...answers, -1];
      setAnswers(na); setAnswered(true);
      setTimeout(() => goNext(na), 1200);
    }
  }, [answered, answers]);

  useEffect(() => {
    if (phase !== 'quiz' || answered) return;
    if (timeLeft <= 0) { handleTimeout(); return; }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, answered, handleTimeout]);

  const goNext = (ans) => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1); setSelected(null); setAnswered(false); setTimeLeft(TIMER);
    } else {
      const score = ans.filter((a, i) => a === questions[i]?.ans).length;
      const pct = Math.round((score / questions.length) * 100);
      const prog = JSON.parse(localStorage.getItem('flx_progress') || '{}');
      prog[`premium_quiz_${courseId}`] = pct;
      localStorage.setItem('flx_progress', JSON.stringify(prog));
      setPhase('result');
    }
  };

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx); setAnswered(true);
    const na = [...answers, idx];
    setAnswers(na);
    setTimeout(() => goNext(na), 1000);
  };

  if (!isUnlocked || !course) return null;

  const score = answers.filter((a, i) => a === questions[i]?.ans).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = pct >= 60;
  const timerColor = timeLeft > 20 ? '#10b981' : timeLeft > 10 ? '#f59e0b' : '#ef4444';

  if (phase === 'intro') return (
    <div className="pq-page">
      <div className="pq-intro">
        <div className="pqi-banner" style={{ background: course.gradient }}>
          <span className="pqi-icon">{course.icon}</span>
          <div className="pqi-badge">👑 PREMIUM QUIZ</div>
          <h2>{course.title}</h2>
          <p>Advanced Investment Knowledge Assessment</p>
        </div>
        <div className="pqi-body">
          <div className="pqi-stats">
            <div className="pqi-stat"><span>📝</span><span>{questions.length} Questions</span></div>
            <div className="pqi-stat"><span>⏱️</span><span>{TIMER}s per question</span></div>
            <div className="pqi-stat"><span>🎯</span><span>60% to pass</span></div>
            <div className="pqi-stat"><span>🏆</span><span>{course.badge}</span></div>
          </div>
          <div className="pqi-info">
            <h4>About This Quiz</h4>
            <p>This advanced quiz tests your understanding of professional investing concepts inspired by {course.books?.join(' and ')}. Questions include case studies, scenario analysis, and real-world investment decisions.</p>
          </div>
          <button className="pqi-start" style={{ background: course.gradient }} onClick={() => setPhase('quiz')}>
            Start Advanced Quiz →
          </button>
          <button className="pqi-back" onClick={() => navigate(`/premium/${courseId}`)}>
            ← Continue Reading First
          </button>
        </div>
      </div>
    </div>
  );

  if (phase === 'result') return (
    <div className="pq-page">
      <div className="pq-result">
        <div className="pqr-banner" style={{ background: course.gradient }}>
          <span style={{ fontSize: 52 }}>{pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 60 ? '✅' : '📚'}</span>
          <h2>{passed ? 'Excellent Work!' : 'Keep Studying!'}</h2>
          <p>{course.title} · Advanced Quiz</p>
        </div>
        <div className="pqr-body">
          <div className="pqr-score" style={{ borderColor: passed ? '#f59e0b' : '#ef4444' }}>
            <div className="pqr-score-val" style={{ color: passed ? '#f59e0b' : '#ef4444' }}>{pct}%</div>
            <div className="pqr-score-sub">{score}/{questions.length} correct</div>
          </div>
          <div className="pqr-grid">
            <div className="pqr-stat"><span>✅ Correct</span><span>{score}</span></div>
            <div className="pqr-stat"><span>❌ Wrong</span><span>{questions.length - score}</span></div>
            <div className="pqr-stat"><span>📊 Score</span><span>{pct}%</span></div>
            <div className="pqr-stat"><span>🎯 Status</span><span style={{ color: passed ? '#f59e0b' : '#ef4444' }}>{passed ? 'PASSED' : 'FAILED'}</span></div>
          </div>
          {passed && (
            <div className="pqr-badge-earned">
              <span style={{ fontSize: 36 }}>{course.badge.split(' ')[0]}</span>
              <div>
                <div className="pqrb-title">{course.badge} Earned!</div>
                <div className="pqrb-sub">{course.title} · {new Date().toLocaleDateString('en-IN')}</div>
              </div>
            </div>
          )}
          <div className="pqr-review">
            <h4>Answer Review</h4>
            <div className="pqr-review-list">
              {questions.map((q, i) => (
                <div key={i} className={`pqrr-item ${answers[i] === q.ans ? 'correct' : 'wrong'}`}>
                  <div className="pqrr-q">{i + 1}. {q.q}</div>
                  <div className="pqrr-a">
                    <span className={answers[i] === q.ans ? 'ca' : 'wa'}>
                      Your answer: {answers[i] >= 0 ? q.opts[answers[i]] : 'Timed out'}
                    </span>
                    {answers[i] !== q.ans && <span className="ca">✓ {q.opts[q.ans]}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pqr-actions">
            <button className="btn-secondary" onClick={() => { setPhase('intro'); setCurrent(0); setAnswers([]); setSelected(null); setAnswered(false); }}>🔄 Retry</button>
            <button className="btn-secondary" onClick={() => navigate(`/premium/${courseId}`)}>📖 Continue Reading</button>
            <button className="btn-primary" onClick={() => navigate('/premium')}>👑 Premium Hub</button>
          </div>
        </div>
      </div>
    </div>
  );

  const q = questions[current];
  return (
    <div className="pq-page">
      <div className="pq-container">
        <div className="pq-header" style={{ background: course.gradient }}>
          <div className="pq-header-top">
            <span className="pq-course-label">{course.icon} {course.title} · 👑 Premium</span>
            <div className="pq-timer" style={{ color: timerColor, borderColor: timerColor }}>
              <span className="pq-timer-val">{timeLeft}</span>
              <span className="pq-timer-s">sec</span>
            </div>
          </div>
          <div className="pq-dots">
            {questions.map((_, i) => (
              <div key={i} className="pq-dot" style={{ background: i < current ? 'rgba(255,255,255,.7)' : i === current ? 'white' : 'rgba(255,255,255,.2)', transform: i === current ? 'scale(1.4)' : 'scale(1)' }}></div>
            ))}
          </div>
        </div>
        <div className="pq-timer-bar">
          <div style={{ width: `${(timeLeft / TIMER) * 100}%`, background: timerColor, height: '100%', transition: 'width 1s linear, background .3s' }}></div>
        </div>
        <div className="pq-body">
          <div className="pq-counter">Question {current + 1} of {questions.length} · Advanced Level</div>
          <h3 className="pq-question">{q.q}</h3>
          <div className="pq-options">
            {q.opts.map((opt, i) => {
              let cls = 'pq-opt';
              if (answered) { if (i === q.ans) cls += ' correct'; else if (i === selected) cls += ' wrong'; }
              else if (i === selected) cls += ' selected';
              return (
                <button key={i} className={cls} onClick={() => handleSelect(i)}>
                  <span className="pq-letter" style={answered && i === q.ans ? { background: '#f59e0b', color: '#0a0a1a' } : answered && i === selected && i !== q.ans ? { background: '#ef4444' } : {}}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="pq-opt-text">{opt}</span>
                  {answered && i === q.ans && <span>✅</span>}
                  {answered && i === selected && i !== q.ans && <span>❌</span>}
                </button>
              );
            })}
          </div>
          <div className="pq-footer">
            <span>Score: {answers.filter((a, i) => a === questions[i]?.ans).length}/{current + (answered ? 1 : 0)}</span>
            <span>{questions.length - current - 1} remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumQuiz;
