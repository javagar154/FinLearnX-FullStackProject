// FinLearnX – Notification System
const KEY = 'flx_notifications';

export const getNotifications = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
};

export const addNotification = (type, title, message, extra = {}) => {
  const notifs = getNotifications();
  const notif = {
    id: Date.now() + Math.random(),
    type,        // 'buy' | 'sell' | 'profit' | 'loss' | 'info' | 'warning'
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    ...extra,
  };
  const updated = [notif, ...notifs].slice(0, 50); // keep last 50
  localStorage.setItem(KEY, JSON.stringify(updated));
  // Dispatch custom event so components can react
  window.dispatchEvent(new CustomEvent('flx_notification', { detail: notif }));
  return notif;
};

export const markAllRead = () => {
  const notifs = getNotifications().map(n => ({ ...n, read: true }));
  localStorage.setItem(KEY, JSON.stringify(notifs));
  window.dispatchEvent(new CustomEvent('flx_notifications_read'));
};

export const clearNotifications = () => {
  localStorage.setItem(KEY, '[]');
  window.dispatchEvent(new CustomEvent('flx_notifications_read'));
};

export const getUnreadCount = () => getNotifications().filter(n => !n.read).length;

export const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 12) return { greeting: 'Good Morning',   emoji: '🌅' };
  if (hour >= 12 && hour < 17) return { greeting: 'Good Afternoon', emoji: '☀️' };
  if (hour >= 17 && hour < 21) return { greeting: 'Good Evening',   emoji: '🌆' };
  return { greeting: 'Good Night', emoji: '🌙' };
};
