import api from './api';

export const searchService = {
  // public — no auth required
  publicSearch: (q) =>
    api.get(`/search/public?q=${encodeURIComponent(q)}`).then(r => r.data?.data || r.data),

  // authenticated
  search: (q) =>
    api.get(`/search?q=${encodeURIComponent(q)}`).then(r => r.data?.data || r.data),
};
