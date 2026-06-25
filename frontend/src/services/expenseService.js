import api from './api';

export const expenseService = {
  addExpense:      (category, description, amount, date) =>
    api.post('/expenses', { category, description, amount, date }).then(r => r.data?.data || r.data),

  getExpenses:     () => api.get('/expenses').then(r => r.data?.data || r.data),

  getByDateRange:  (start, end) =>
    api.get(`/expenses/range?start=${start}&end=${end}`).then(r => r.data?.data || r.data),

  getCategoryTotals: () => api.get('/expenses/categories').then(r => r.data?.data || r.data),

  getTotalExpenses:  () => api.get('/expenses/total').then(r => r.data?.data ?? r.data),

  deleteExpense:   (id) => api.delete(`/expenses/${id}`).then(r => r.data),
};
