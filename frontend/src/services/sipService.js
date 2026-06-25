import api from './api';

export const sipService = {
  calculate: (monthlyAmount, annualRate, durationYears) =>
    api.post('/sip/calculate', { monthlyAmount, annualRate, durationYears })
       .then(r => r.data?.data || r.data),

  saveCalculation: (monthlyAmount, annualRate, durationYears) =>
    api.post('/sip/save', { monthlyAmount, annualRate, durationYears })
       .then(r => r.data?.data || r.data),

  getHistory: () => api.get('/sip/history').then(r => r.data?.data || r.data),
};
