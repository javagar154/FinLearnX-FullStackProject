import api from './api';

export const quizService = {
  submitQuiz: (courseId, score, totalQuestions) =>
    api.post('/quiz/submit', { courseId, score, totalQuestions })
       .then(r => r.data),

  getAllResults: () => api.get('/quiz/results').then(r => r.data?.data || r.data),

  getBestResult: (courseId) =>
    api.get(`/quiz/results/${courseId}`).then(r => r.data),
};
