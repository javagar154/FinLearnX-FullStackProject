import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { path: '/stocks', icon: '📈', label: 'Stock Market' },
  { path: '/portfolio', icon: '💼', label: 'Portfolio' },
  { path: '/sip-calculator', icon: '🧮', label: 'SIP Calculator' },
  { path: '/budget', icon: '💳', label: 'Budget Tracker' },
  { path: '/learn', icon: '📚', label: 'Learning Hub' },
  { path: '/premium', icon: '👑', label: 'Premium Academy', premium: true },
];

const Sidebar = ({ isOpen, onToggle }) => {
  const { logout, getUser } = useAuth();
  const navigate = useNavigate();
  const user = getUser();
  const isPremium = localStorage.getItem('flx_premium') === 'true';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">FX</div>
        {isOpen && <span className="logo-text">FinLearnX</span>}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${item.premium ? 'premium-nav' : ''}`}
            title={!isOpen ? item.label : ''}>
            <span className="nav-icon">{item.icon}</span>
            {isOpen && (
              <span className="nav-label">
                {item.label}
                {item.premium && !isPremium && <span className="nav-lock">🔒</span>}
                {item.premium && isPremium && <span className="nav-active-badge">✓</span>}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {isOpen && user && (
          <div className="user-info">
            <div className="user-avatar">{user.name?.charAt(0) || 'U'}</div>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <span>🚪</span>
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
