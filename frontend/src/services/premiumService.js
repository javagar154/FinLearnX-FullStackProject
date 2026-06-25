import api from './api';

export const premiumService = {
  getUnlocked: () =>
    api.get('/premium/unlocked').then(r => r.data?.data || r.data),

  checkAccess: (courseId) =>
    api.get(`/premium/check/${courseId}`).then(r => r.data?.data || r.data),

  unlockCourse: (courseId) =>
    api.post(`/premium/unlock/${courseId}`).then(r => r.data?.data || r.data),
};
