import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back to FinLearnX!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid credentials. Try demo@finlearnx.com');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await login('demo@finlearnx.com', 'demo123');
      toast.success('Logged in with demo account!');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb orb1"></div>
        <div className="auth-orb orb2"></div>
        <div className="auth-orb orb3"></div>
      </div>

      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="brand-logo">FX</div>
            <span className="brand-name">FinLearnX</span>
          </div>
          <h2 className="auth-tagline">Your Complete<br /><span className="gradient-text">Finance Learning</span><br />& Trading Platform</h2>
          <div className="auth-features">
            {['📈 50+ Virtual Stocks to Trade', '📚 6 Finance Learning Courses', '🧮 SIP & Budget Calculator', '🏆 Quizzes & Progress Tracking'].map(f => (
              <div key={f} className="feature-item">{f}</div>
            ))}
          </div>
          <div className="auth-stats">
            <div className="stat"><div className="stat-value">50K+</div><div className="stat-label">Learners</div></div>
            <div className="stat"><div className="stat-value">₹10Cr+</div><div className="stat-label">Simulated</div></div>
            <div className="stat"><div className="stat-value">4.9★</div><div className="stat-label">Rating</div></div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-card">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your FinLearnX account</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-footer">
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>

              <button type="submit" className="auth-btn primary" disabled={loading}>
                {loading ? <span className="btn-spinner"></span> : 'Sign In'}
              </button>

              <div className="auth-divider"><span>or</span></div>

              <button type="button" className="auth-btn demo" onClick={handleDemo} disabled={loading}>
                🚀 Try Demo Account
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/signup">Create one free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
