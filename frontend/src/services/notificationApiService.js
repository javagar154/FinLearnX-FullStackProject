import api from './api';

// Bridge between backend API and local notifications util
export const notificationApiService = {
  getAll:       () => api.get('/notifications').then(r => r.data?.data || r.data),
  getUnread:    () => api.get('/notifications/unread').then(r => r.data?.data || r.data),
  getCount:     () => api.get('/notifications/count').then(r => r.data?.data?.unreadCount ?? 0),
  markAllRead:  () => api.put('/notifications/read-all').then(r => r.data),
  markRead:     (id) => api.put(`/notifications/${id}/read`).then(r => r.data),
  clearAll:     () => api.delete('/notifications').then(r => r.data),
};
