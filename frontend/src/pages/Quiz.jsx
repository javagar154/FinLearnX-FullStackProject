import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASIC_COURSES, INTERMEDIATE_COURSES } from '../data/courses';
import { FREE_QUIZZES } from '../data/freeQuizzes';
import { quizService } from '../services/quizService';
import { courseService } from '../services/courseService';
import { toast } from 'react-toastify';
import './Quiz.css';

const ALL_FREE_COURSES = [...BASIC_COURSES, ...INTERMEDIATE_COURSES];
const TIMER = 30;

const Quiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = ALL_FREE_COURSES.find(c => c.id === courseId);
  const questions = FREE_QUIZZES[courseId] || [];
  const isBasic = !!BASIC_COURSES.find(c => c.id === courseId);
  const levelColor = isBasic ? '#10b981' : '#f59e0b';

  const [phase, setPhase] = useState('intro');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIMER);

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
      // Save locally
      const prog = JSON.parse(localStorage.getItem('flx_progress') || '{}');
      prog[`quiz_${courseId}`] = pct;
      if (pct === 100) prog[courseId] = 100;
      localStorage.setItem('flx_progress', JSON.stringify(prog));
      // Submit to backend (fire-and-forget)
      quizService.submitQuiz(courseId, score, questions.length).catch(() => {});
      courseService.saveQuizScore(courseId, pct).catch(() => {});
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

  const resetQuiz = () => {
    setPhase('intro'); setCurrent(0); setAnswers([]);
    setSelected(null); setAnswered(false); setTimeLeft(TIMER);
  };

  if (!course) { navigate('/learn'); return null; }

  if (questions.length === 0) return (
    <div className="page-container quiz-page">
      <div className="quiz-empty glass-card">
        <div style={{ fontSize: 48 }}>🧠</div>
        <h2>Quiz Coming Soon</h2>
        <p>Quiz for {course.title} is being prepared.</p>
        <button className="btn-primary" onClick={() => navigate('/learn')}>Back to Courses</button>
      </div>
    </div>
  );

  const score = answers.filter((a, i) => a === questions[i]?.ans).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = pct >= 60;
  const timerColor = timeLeft > 18 ? '#10b981' : timeLeft > 9 ? '#f59e0b' : '#ef4444';

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="page-container quiz-page">
      <button className="quiz-back-btn" onClick={() => navigate(`/learn/${courseId}`)}>← Back to Course</button>
      <div className="quiz-intro glass-card">
        <div className="qi-banner" style={{ background: course.gradient }}>
          <span className="qi-icon">{course.icon}</span>
          <div className="qi-badge">{isBasic ? '🌱 Basic' : '📈 Intermediate'} Quiz · FREE</div>
          <h2>{course.title}</h2>
          <p>Test your knowledge and earn your completion badge</p>
        </div>
        <div className="qi-body">
          <div className="qi-stats">
            <div className="qi-stat"><span>📝</span><span>{questions.length} Questions</span></div>
            <div className="qi-stat"><span>⏱️</span><span>{TIMER}s per question</span></div>
            <div className="qi-stat"><span>🎯</span><span>60% to pass</span></div>
            <div className="qi-stat"><span>🏆</span><span>Badge on completion</span></div>
          </div>
          <div className="qi-rules">
            <h4>Quiz Rules</h4>
            <ul>
              <li>Each question has a {TIMER}-second timer</li>
              <li>Select the best answer from 4 options</li>
              <li>You cannot go back to previous questions</li>
              <li>Score 60% or above to earn your badge</li>
              <li>You can retry the quiz to improve your score</li>
            </ul>
          </div>
          <button className="qi-start-btn" style={{ background: course.gradient }} onClick={() => setPhase('quiz')}>
            Start Quiz →
          </button>
        </div>
      </div>
    </div>
  );

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (phase === 'result') return (
    <div className="page-container quiz-page">
      <div className="quiz-result glass-card">
        <div className="qr-banner" style={{ background: course.gradient }}>
          <span style={{ fontSize: 52 }}>{pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 60 ? '✅' : '📚'}</span>
          <h2>{passed ? 'Congratulations!' : 'Keep Learning!'}</h2>
          <p>{course.title} · {isBasic ? 'Basic' : 'Intermediate'} Quiz</p>
        </div>
        <div className="qr-body">
          <div className="qr-score-ring" style={{ borderColor: passed ? levelColor : '#ef4444' }}>
            <div className="qr-score-val" style={{ color: passed ? levelColor : '#ef4444' }}>{pct}%</div>
            <div className="qr-score-label">{score}/{questions.length} correct</div>
          </div>
          <div className="qr-analytics">
            <div className="qra-item"><span>✅ Correct</span><span>{score}</span></div>
            <div className="qra-item"><span>❌ Wrong</span><span>{questions.length - score}</span></div>
            <div className="qra-item"><span>📊 Score</span><span>{pct}%</span></div>
            <div className="qra-item"><span>🎯 Status</span>
              <span style={{ color: passed ? levelColor : '#ef4444', fontWeight: 800 }}>{passed ? 'PASSED' : 'FAILED'}</span>
            </div>
          </div>
          {passed && (
            <div className="qr-badge-earned" style={{ borderColor: `${levelColor}40`, background: `${levelColor}10` }}>
              <span style={{ fontSize: 32 }}>{pct === 100 ? '🏆' : '🎖️'}</span>
              <div>
                <div className="qrb-title" style={{ color: levelColor }}>
                  {isBasic ? 'Basic' : 'Intermediate'} Badge Earned!
                </div>
                <div className="qrb-sub">{course.title} · {new Date().toLocaleDateString('en-IN')}</div>
              </div>
            </div>
          )}
          <div className="qr-review">
            <h4>Answer Review</h4>
            <div className="qr-review-list">
              {questions.map((q, i) => (
                <div key={i} className={`qrr-item ${answers[i] === q.ans ? 'correct' : 'wrong'}`}>
                  <div className="qrr-q">{i + 1}. {q.q}</div>
                  <div className="qrr-a">
                    <span className={answers[i] === q.ans ? 'ca' : 'wa'}>
                      Your answer: {answers[i] >= 0 ? q.opts[answers[i]] : 'Timed out'}
                    </span>
                    {answers[i] !== q.ans && <span className="ca">✓ Correct: {q.opts[q.ans]}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="qr-actions">
            <button className="btn-secondary" onClick={resetQuiz}>🔄 Retry Quiz</button>
            <button className="btn-secondary" onClick={() => navigate(`/learn/${courseId}`)}>📖 Review Course</button>
            <button className="btn-primary" onClick={() => navigate('/learn')}>🏠 All Courses</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── QUIZ ───────────────────────────────────────────────────────────────────
  const q = questions[current];
  return (
    <div className="page-container quiz-page">
      <div className="quiz-container glass-card">
        <div className="qz-header" style={{ background: course.gradient }}>
          <div className="qz-header-top">
            <span className="qz-course-label">{course.icon} {course.title} · {isBasic ? '🌱 Basic' : '📈 Intermediate'}</span>
            <div className="qz-timer" style={{ color: timerColor, borderColor: timerColor }}>
              <span className="qz-timer-val">{timeLeft}</span>
              <span className="qz-timer-s">sec</span>
            </div>
          </div>
          <div className="qz-dots">
            {questions.map((_, i) => (
              <div key={i} className="qz-dot" style={{
                background: i < current ? 'rgba(255,255,255,.7)' : i === current ? 'white' : 'rgba(255,255,255,.2)',
                transform: i === current ? 'scale(1.4)' : 'scale(1)'
              }}></div>
            ))}
          </div>
        </div>
        <div className="qz-timer-bar">
          <div style={{ width: `${(timeLeft / TIMER) * 100}%`, background: timerColor, height: '100%', transition: 'width 1s linear, background .3s' }}></div>
        </div>
        <div className="qz-body">
          <div className="qz-counter">Question {current + 1} of {questions.length}</div>
          <h3 className="qz-question">{q.q}</h3>
          <div className="qz-options">
            {q.opts.map((opt, i) => {
              let cls = 'qz-opt';
              if (answered) { if (i === q.ans) cls += ' correct'; else if (i === selected) cls += ' wrong'; }
              else if (i === selected) cls += ' selected';
              return (
                <button key={i} className={cls} onClick={() => handleSelect(i)}>
                  <span className="qz-opt-letter" style={
                    answered && i === q.ans ? { background: levelColor, color: '#0a0a1a' } :
                    answered && i === selected && i !== q.ans ? { background: '#ef4444' } : {}
                  }>{String.fromCharCode(65 + i)}</span>
                  <span className="qz-opt-text">{opt}</span>
                  {answered && i === q.ans && <span>✅</span>}
                  {answered && i === selected && i !== q.ans && <span>❌</span>}
                </button>
              );
            })}
          </div>
          <div className="qz-footer">
            <span>Score: {answers.filter((a, i) => a === questions[i]?.ans).length}/{current + (answered ? 1 : 0)}</span>
            <span>{questions.length - current - 1} remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
