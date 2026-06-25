import React from 'react';
import { useLocation } from 'react-router-dom';
import GlobalSearch from '../common/GlobalSearch';
import NotificationBell from '../common/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import './Topbar.css';

const pageTitles = {
  '/dashboard':     'Dashboard',
  '/stocks':        'Stock Market Simulator',
  '/portfolio':     'My Portfolio',
  '/sip-calculator':'SIP Calculator',
  '/budget':        'Budget Tracker',
  '/learn':         'Learning Hub',
  '/premium':       'Premium Academy',
};

const Topbar = ({ onMenuClick }) => {
  const location = useLocation();
  const { getUser } = useAuth();
  const user = getUser();

  const getTitle = () => {
    const path = location.pathname;
    if (pageTitles[path]) return pageTitles[path];
    if (path.startsWith('/learn/'))        return 'Course Viewer';
    if (path.startsWith('/quiz/'))         return 'Quiz';
    if (path.startsWith('/stocks/'))       return 'Stock Detail';
    if (path.startsWith('/premium/'))      return 'Premium Course';
    if (path.startsWith('/premium-quiz/')) return 'Premium Quiz';
    return 'FinLearnX';
  };

  // Live wallet: prefer auth context (updated after trades), fallback to localStorage
  const walletBalance = user?.walletBalance
    ?? parseFloat(localStorage.getItem('finlearnx_wallet') || '100000');

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
        <h1 className="page-title">{getTitle()}</h1>
      </div>

      <div className="topbar-center">
        <GlobalSearch />
      </div>

      <div className="topbar-right">
        <div className="market-status">
          <span className="status-dot live"></span>
          <span className="status-text">Market Live</span>
        </div>
        <NotificationBell />
        <div className="wallet-badge">
          <span>💰</span>
          <span>₹{walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
