import api from './api';
import { addNotification } from '../utils/notifications';

export const tradingService = {
  getStocks:       () => api.get('/stocks/public/list').then(r => r.data?.data || r.data),
  getStock:        (sym) => api.get(`/stocks/public/${sym}`).then(r => r.data?.data || r.data),
  getHistory:      (sym, days = 30) => api.get(`/stocks/public/${sym}/history?days=${days}`).then(r => r.data?.data || r.data),
  getPortfolio:    () => api.get('/trading/portfolio').then(r => r.data?.data || r.data),
  getTransactions: () => api.get('/trading/transactions').then(r => r.data?.data || r.data),
  getWallet:       () => api.get('/trading/wallet').then(r => r.data?.data ?? r.data),

  executeTrade: async (symbol, stockName, quantity, price, type) => {
    const res = await api.post('/trading/trade', { symbol, stockName, quantity, price, type });
    const tx = res.data?.data || res.data;
    if (type === 'BUY') {
      addNotification('buy', `Bought ${symbol}`,
        `Bought ${quantity} share${quantity > 1 ? 's' : ''} of ${stockName} @ ₹${Number(price).toLocaleString('en-IN')} · Total: ₹${(quantity * price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`);
    } else {
      addNotification('sell', `Sold ${symbol}`,
        `Sold ${quantity} share${quantity > 1 ? 's' : ''} of ${stockName} @ ₹${Number(price).toLocaleString('en-IN')}`);
    }
    return tx;
  },
};
