import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      toast.success('Reset link sent to your email!');
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb orb1"></div>
        <div className="auth-orb orb2"></div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, margin: '0 24px' }}>
        <div className="auth-card" style={{ background: 'rgba(10,10,26,0.9)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-2xl)', padding: '48px 40px', backdropFilter: 'blur(20px)' }}>
          <div className="auth-brand" style={{ marginBottom: 24 }}>
            <div className="brand-logo">FX</div>
            <span className="brand-name">FinLearnX</span>
          </div>

          {!sent ? (
            <>
              <h1 className="auth-title">Reset Password</h1>
              <p className="auth-subtitle">Enter your email and we'll send a reset link</p>
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">✉️</span>
                    <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="auth-btn primary" disabled={loading}>
                  {loading ? <span className="btn-spinner"></span> : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h2 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>Check Your Email</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                We've sent a password reset link to <strong style={{ color: 'var(--accent-blue)' }}>{email}</strong>
              </p>
            </div>
          )}

          <p className="auth-switch" style={{ marginTop: 24 }}>
            <Link to="/login">← Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
