import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Account created! Welcome to FinLearnX 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Signup failed. Please try again.');
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
        <div className="auth-left">
          <div className="auth-brand">
            <div className="brand-logo">FX</div>
            <span className="brand-name">FinLearnX</span>
          </div>
          <h2 className="auth-tagline">Start Your<br /><span className="gradient-text">Financial Journey</span><br />Today — Free!</h2>
          <div className="auth-features">
            {['✅ Free virtual trading with ₹1,00,000', '✅ 6 comprehensive finance courses', '✅ Real-time simulated market data', '✅ SIP & Budget planning tools', '✅ Quizzes & completion certificates'].map(f => (
              <div key={f} className="feature-item">{f}</div>
            ))}
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join 50,000+ learners on FinLearnX</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input type="text" name="name" placeholder="Arjun Sharma" value={form.name} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>
                  <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input type="password" name="confirm" placeholder="Repeat password" value={form.confirm} onChange={handleChange} />
                </div>
              </div>

              <button type="submit" className="auth-btn primary" disabled={loading}>
                {loading ? <span className="btn-spinner"></span> : 'Create Free Account'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
