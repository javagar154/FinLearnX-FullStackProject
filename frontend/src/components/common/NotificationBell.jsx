import React, { useState, useEffect, useRef } from 'react';
import { getNotifications, markAllRead, clearNotifications, getUnreadCount } from '../../utils/notifications';
import { notificationApiService } from '../../services/notificationApiService';
import './NotificationBell.css';

const typeConfig = {
  buy:     { icon: '📈', color: '#00ff88', bg: 'rgba(0,255,136,.1)'  },
  sell:    { icon: '📉', color: '#f59e0b', bg: 'rgba(245,158,11,.1)' },
  profit:  { icon: '💰', color: '#00ff88', bg: 'rgba(0,255,136,.1)'  },
  loss:    { icon: '⚠️', color: '#ff4757', bg: 'rgba(255,71,87,.1)'  },
  info:    { icon: '🔔', color: '#6366f1', bg: 'rgba(99,102,241,.1)' },
  warning: { icon: '⚡', color: '#f59e0b', bg: 'rgba(245,158,11,.1)' },
};

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const NotificationBell = () => {
  const [open, setOpen]     = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [pulse, setPulse]   = useState(false);
  const panelRef = useRef(null);

  const refresh = () => {
    const n = getNotifications();
    setNotifs(n);
    setUnread(n.filter(x => !x.read).length);
  };

  useEffect(() => {
    refresh();
    const onNew = () => { refresh(); setPulse(true); setTimeout(() => setPulse(false), 600); };
    const onRead = () => refresh();
    window.addEventListener('flx_notification', onNew);
    window.addEventListener('flx_notifications_read', onRead);
    return () => {
      window.removeEventListener('flx_notification', onNew);
      window.removeEventListener('flx_notifications_read', onRead);
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen(o => !o);
    if (!open && unread > 0) {
      markAllRead();
      // Also sync to backend (fire-and-forget)
      notificationApiService.markAllRead().catch(() => {});
    }
  };

  return (
    <div className="nb-wrapper" ref={panelRef}>
      <button className={`nb-btn ${pulse ? 'pulse' : ''}`} onClick={handleOpen} aria-label="Notifications">
        <span className="nb-icon">🔔</span>
        {unread > 0 && (
          <span className="nb-badge">{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {open && (
        <div className="nb-panel">
          <div className="nb-header">
            <span className="nb-title">Notifications</span>
            <div className="nb-header-actions">
              {notifs.length > 0 && (
                <button className="nb-clear" onClick={() => { clearNotifications(); setOpen(false); }}>
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="nb-list">
            {notifs.length === 0 ? (
              <div className="nb-empty">
                <span>🔔</span>
                <p>No notifications yet</p>
                <span className="nb-empty-sub">Trade stocks to see activity here</span>
              </div>
            ) : (
              notifs.map(n => {
                const cfg = typeConfig[n.type] || typeConfig.info;
                return (
                  <div key={n.id} className={`nb-item ${!n.read ? 'unread' : ''}`}
                    style={{ borderLeft: `3px solid ${cfg.color}` }}>
                    <div className="nb-item-icon" style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.icon}
                    </div>
                    <div className="nb-item-content">
                      <div className="nb-item-title">{n.title}</div>
                      <div className="nb-item-msg">{n.message}</div>
                      <div className="nb-item-time">{timeAgo(n.timestamp)}</div>
                    </div>
                    {!n.read && <div className="nb-unread-dot"></div>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
