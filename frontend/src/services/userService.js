import api from './api';

export const userService = {
  getProfile: () => api.get('/user/profile').then(r => r.data?.data || r.data),
  updateProfile: (name) => api.put('/user/profile', { name }).then(r => r.data?.data || r.data),
};
