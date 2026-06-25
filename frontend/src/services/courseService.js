import api from './api';

export const courseService = {
  // Returns { courseId: { percent, pagesRead, completed, quizScore } }
  getProgressMap: () => api.get('/courses/progress').then(r => r.data?.data || r.data),

  getProgressList: () => api.get('/courses/progress/list').then(r => r.data?.data || r.data),

  saveProgress: (courseId, percent, pagesRead) =>
    api.post(`/courses/progress/${courseId}`, { percent, pagesRead })
       .then(r => r.data?.data || r.data),

  saveQuizScore: (courseId, score) =>
    api.post(`/courses/quiz/${courseId}`, { score })
       .then(r => r.data),
};
