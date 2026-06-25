import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('FinLearnX Crash:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: '#0a0a1a', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#f1f5f9', fontFamily: 'Inter, sans-serif', padding: 24, textAlign: 'center'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: '#ef4444', marginBottom: 12 }}>Application Error</h2>
          <pre style={{
            background: 'rgba(255,0,0,.1)', border: '1px solid rgba(255,71,87,.3)',
            borderRadius: 12, padding: '16px 24px', fontSize: 13, color: '#fca5a5',
            maxWidth: 700, textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
          }}>
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/login'; }}
            style={{
              marginTop: 20, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px',
              fontSize: 14, fontWeight: 700, cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
