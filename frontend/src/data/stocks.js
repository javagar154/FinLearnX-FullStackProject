export const STOCKS = [
  // Indian Stocks
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', exchange: 'NSE', price: 2847.50, change: 34.20, changePercent: 1.22, marketCap: '19.2T', volume: '8.4M', high52: 3024.90, low52: 2220.30, pe: 28.4, country: 'IN' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', exchange: 'NSE', price: 3912.75, change: -28.50, changePercent: -0.72, marketCap: '14.1T', volume: '3.2M', high52: 4255.00, low52: 3311.00, pe: 32.1, country: 'IN' },
  { symbol: 'INFY', name: 'Infosys Limited', sector: 'IT', exchange: 'NSE', price: 1678.40, change: 22.10, changePercent: 1.34, marketCap: '6.9T', volume: '6.1M', high52: 1953.90, low52: 1351.00, pe: 27.8, country: 'IN' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', exchange: 'NSE', price: 1589.30, change: -12.40, changePercent: -0.77, marketCap: '12.1T', volume: '9.8M', high52: 1794.00, low52: 1363.55, pe: 19.2, country: 'IN' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', exchange: 'NSE', price: 1124.60, change: 18.90, changePercent: 1.71, marketCap: '7.9T', volume: '11.2M', high52: 1196.00, low52: 899.00, pe: 18.7, country: 'IN' },
  { symbol: 'WIPRO', name: 'Wipro Limited', sector: 'IT', exchange: 'NSE', price: 487.25, change: 5.60, changePercent: 1.16, marketCap: '2.5T', volume: '7.3M', high52: 572.65, low52: 362.65, pe: 22.4, country: 'IN' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'Finance', exchange: 'NSE', price: 7234.80, change: -89.40, changePercent: -1.22, marketCap: '4.4T', volume: '1.8M', high52: 8192.00, low52: 6187.80, pe: 35.6, country: 'IN' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'FMCG', exchange: 'NSE', price: 2456.70, change: 14.30, changePercent: 0.59, marketCap: '5.8T', volume: '2.4M', high52: 2859.00, low52: 2172.00, pe: 58.3, country: 'IN' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', exchange: 'NSE', price: 812.45, change: 9.80, changePercent: 1.22, marketCap: '7.2T', volume: '18.6M', high52: 912.00, low52: 543.20, pe: 11.4, country: 'IN' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', sector: 'Auto', exchange: 'NSE', price: 12456.30, change: 234.50, changePercent: 1.92, marketCap: '3.8T', volume: '0.9M', high52: 13680.00, low52: 9832.00, pe: 31.2, country: 'IN' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto', exchange: 'NSE', price: 987.60, change: -15.30, changePercent: -1.53, marketCap: '3.6T', volume: '14.2M', high52: 1179.00, low52: 601.45, pe: 14.8, country: 'IN' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', sector: 'Conglomerate', exchange: 'NSE', price: 2987.40, change: 67.80, changePercent: 2.32, marketCap: '3.4T', volume: '3.7M', high52: 3743.90, low52: 1900.00, pe: 89.4, country: 'IN' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Pharma', exchange: 'NSE', price: 1678.90, change: 23.40, changePercent: 1.41, marketCap: '4.0T', volume: '3.1M', high52: 1960.00, low52: 1124.00, pe: 42.1, country: 'IN' },
  { symbol: 'LTIM', name: 'LTIMindtree', sector: 'IT', exchange: 'NSE', price: 5234.60, change: -45.20, changePercent: -0.86, marketCap: '1.5T', volume: '0.8M', high52: 6767.00, low52: 4301.00, pe: 38.7, country: 'IN' },
  { symbol: 'AXISBANK', name: 'Axis Bank', sector: 'Banking', exchange: 'NSE', price: 1123.40, change: 12.60, changePercent: 1.13, marketCap: '3.5T', volume: '8.9M', high52: 1339.65, low52: 877.00, pe: 16.3, country: 'IN' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking', exchange: 'NSE', price: 1876.50, change: -8.90, changePercent: -0.47, marketCap: '3.7T', volume: '4.2M', high52: 2063.00, low52: 1543.85, pe: 24.1, country: 'IN' },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', sector: 'Energy', exchange: 'NSE', price: 287.45, change: 4.30, changePercent: 1.52, marketCap: '3.6T', volume: '22.4M', high52: 345.00, low52: 155.35, pe: 8.9, country: 'IN' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation', sector: 'Utilities', exchange: 'NSE', price: 312.80, change: 2.10, changePercent: 0.68, marketCap: '2.9T', volume: '12.1M', high52: 366.25, low52: 213.00, pe: 17.8, country: 'IN' },
  { symbol: 'NTPC', name: 'NTPC Limited', sector: 'Utilities', exchange: 'NSE', price: 378.90, change: 5.60, changePercent: 1.50, marketCap: '3.7T', volume: '15.8M', high52: 448.45, low52: 155.35, pe: 19.2, country: 'IN' },
  { symbol: 'HCLTECH', name: 'HCL Technologies', sector: 'IT', exchange: 'NSE', price: 1567.30, change: 18.40, changePercent: 1.19, marketCap: '4.2T', volume: '4.6M', high52: 1929.00, low52: 1074.00, pe: 26.4, country: 'IN' },
  { symbol: 'TECHM', name: 'Tech Mahindra', sector: 'IT', exchange: 'NSE', price: 1456.70, change: -22.30, changePercent: -1.51, marketCap: '1.4T', volume: '3.8M', high52: 1762.00, low52: 1000.00, pe: 31.8, country: 'IN' },
  { symbol: 'DRREDDY', name: "Dr. Reddy's Laboratories", sector: 'Pharma', exchange: 'NSE', price: 6234.50, change: 89.30, changePercent: 1.45, marketCap: '1.0T', volume: '0.7M', high52: 7090.00, low52: 4500.00, pe: 22.7, country: 'IN' },
  { symbol: 'CIPLA', name: 'Cipla Limited', sector: 'Pharma', exchange: 'NSE', price: 1456.80, change: 12.40, changePercent: 0.86, marketCap: '1.2T', volume: '2.3M', high52: 1694.00, low52: 1000.00, pe: 28.9, country: 'IN' },
  { symbol: 'TITAN', name: 'Titan Company', sector: 'Consumer', exchange: 'NSE', price: 3456.70, change: 45.60, changePercent: 1.34, marketCap: '3.1T', volume: '1.4M', high52: 3886.00, low52: 2530.00, pe: 87.4, country: 'IN' },
  { symbol: 'NESTLEIND', name: 'Nestle India', sector: 'FMCG', exchange: 'NSE', price: 24567.80, change: 234.50, changePercent: 0.96, marketCap: '2.4T', volume: '0.2M', high52: 27468.00, low52: 19800.00, pe: 78.2, country: 'IN' },

  // Global Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', exchange: 'NASDAQ', price: 189.84, change: 2.34, changePercent: 1.25, marketCap: '$2.9T', volume: '52.3M', high52: 199.62, low52: 124.17, pe: 31.2, country: 'US' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Auto/EV', exchange: 'NASDAQ', price: 248.42, change: -8.76, changePercent: -3.41, marketCap: '$789B', volume: '98.4M', high52: 299.29, low52: 101.81, pe: 78.4, country: 'US' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'E-Commerce', exchange: 'NASDAQ', price: 178.25, change: 3.45, changePercent: 1.97, marketCap: '$1.85T', volume: '34.7M', high52: 189.77, low52: 101.26, pe: 62.1, country: 'US' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', exchange: 'NASDAQ', price: 141.80, change: 1.92, changePercent: 1.37, marketCap: '$1.78T', volume: '21.8M', high52: 153.78, low52: 83.34, pe: 25.8, country: 'US' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', exchange: 'NASDAQ', price: 378.91, change: 5.67, changePercent: 1.52, marketCap: '$2.81T', volume: '18.9M', high52: 420.82, low52: 213.43, pe: 36.4, country: 'US' },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Social Media', exchange: 'NASDAQ', price: 484.10, change: 12.34, changePercent: 2.62, marketCap: '$1.24T', volume: '14.2M', high52: 531.49, low52: 197.16, pe: 24.7, country: 'US' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Semiconductors', exchange: 'NASDAQ', price: 875.39, change: 34.56, changePercent: 4.11, marketCap: '$2.15T', volume: '42.1M', high52: 974.00, low52: 180.00, pe: 68.9, country: 'US' },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Entertainment', exchange: 'NASDAQ', price: 628.45, change: -9.23, changePercent: -1.45, marketCap: '$271B', volume: '4.8M', high52: 700.99, low52: 271.56, pe: 42.3, country: 'US' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Banking', exchange: 'NYSE', price: 198.34, change: 2.78, changePercent: 1.42, marketCap: '$572B', volume: '8.9M', high52: 220.82, low52: 127.00, pe: 12.4, country: 'US' },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Fintech', exchange: 'NYSE', price: 278.56, change: 3.45, changePercent: 1.25, marketCap: '$567B', volume: '6.7M', high52: 290.96, low52: 213.00, pe: 31.8, country: 'US' },
  { symbol: 'BRK', name: 'Berkshire Hathaway', sector: 'Conglomerate', exchange: 'NYSE', price: 356789.00, change: 1234.00, changePercent: 0.35, marketCap: '$780B', volume: '0.01M', high52: 362000.00, low52: 270000.00, pe: 22.1, country: 'US' },
  { symbol: 'DIS', name: 'The Walt Disney Company', sector: 'Entertainment', exchange: 'NYSE', price: 112.34, change: -1.23, changePercent: -1.08, marketCap: '$205B', volume: '9.4M', high52: 123.74, low52: 78.73, pe: 68.4, country: 'US' },
  { symbol: 'BABA', name: 'Alibaba Group', sector: 'E-Commerce', exchange: 'NYSE', price: 78.45, change: 1.23, changePercent: 1.59, marketCap: '$200B', volume: '18.7M', high52: 121.00, low52: 57.00, pe: 14.2, country: 'CN' },
  { symbol: 'TSM', name: 'Taiwan Semiconductor', sector: 'Semiconductors', exchange: 'NYSE', price: 145.67, change: 4.56, changePercent: 3.23, marketCap: '$755B', volume: '12.3M', high52: 167.00, low52: 71.00, pe: 22.8, country: 'TW' },
  { symbol: 'SAMSUNG', name: 'Samsung Electronics', sector: 'Technology', exchange: 'KRX', price: 71200, change: 800, changePercent: 1.14, marketCap: '₩425T', volume: '14.2M', high52: 88800, low52: 55800, pe: 18.4, country: 'KR' },
  { symbol: 'SONY', name: 'Sony Group Corporation', sector: 'Technology', exchange: 'NYSE', price: 89.34, change: 1.23, changePercent: 1.40, marketCap: '$112B', volume: '2.1M', high52: 102.00, low52: 67.00, pe: 16.7, country: 'JP' },
  { symbol: 'SPOT', name: 'Spotify Technology', sector: 'Entertainment', exchange: 'NYSE', price: 234.56, change: 5.67, changePercent: 2.48, marketCap: '$45B', volume: '1.8M', high52: 267.00, low52: 71.00, pe: 0, country: 'SE' },
  { symbol: 'UBER', name: 'Uber Technologies', sector: 'Transport', exchange: 'NYSE', price: 67.89, change: 1.34, changePercent: 2.01, marketCap: '$139B', volume: '14.5M', high52: 82.14, low52: 25.00, pe: 0, country: 'US' },
  { symbol: 'PYPL', name: 'PayPal Holdings', sector: 'Fintech', exchange: 'NASDAQ', price: 67.45, change: -0.89, changePercent: -1.30, marketCap: '$73B', volume: '8.9M', high52: 98.00, low52: 50.25, pe: 18.9, country: 'US' },
  { symbol: 'SQ', name: 'Block Inc. (Square)', sector: 'Fintech', exchange: 'NYSE', price: 78.34, change: 2.34, changePercent: 3.08, marketCap: '$47B', volume: '6.7M', high52: 98.00, low52: 37.00, pe: 0, country: 'US' },
  { symbol: 'COIN', name: 'Coinbase Global', sector: 'Crypto/Fintech', exchange: 'NASDAQ', price: 189.45, change: 12.34, changePercent: 6.97, marketCap: '$47B', volume: '8.9M', high52: 283.00, low52: 31.00, pe: 0, country: 'US' },
  { symbol: 'SHOP', name: 'Shopify Inc.', sector: 'E-Commerce', exchange: 'NYSE', price: 78.90, change: 1.23, changePercent: 1.58, marketCap: '$100B', volume: '7.8M', high52: 98.00, low52: 23.00, pe: 0, country: 'CA' },
  { symbol: 'PLTR', name: 'Palantir Technologies', sector: 'AI/Data', exchange: 'NYSE', price: 23.45, change: 0.89, changePercent: 3.95, marketCap: '$49B', volume: '34.5M', high52: 27.50, low52: 5.92, pe: 0, country: 'US' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Semiconductors', exchange: 'NASDAQ', price: 178.34, change: 8.90, changePercent: 5.25, marketCap: '$288B', volume: '45.6M', high52: 227.30, low52: 60.00, pe: 0, country: 'US' },
  { symbol: 'INTC', name: 'Intel Corporation', sector: 'Semiconductors', exchange: 'NASDAQ', price: 34.56, change: -0.45, changePercent: -1.29, marketCap: '$146B', volume: '28.9M', high52: 51.28, low52: 18.84, pe: 0, country: 'US' },
  { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Cloud/SaaS', exchange: 'NYSE', price: 278.90, change: 4.56, changePercent: 1.66, marketCap: '$270B', volume: '5.6M', high52: 318.71, low52: 127.00, pe: 56.7, country: 'US' },
];

export const generatePriceHistory = (basePrice, days = 30) => {
  const data = [];
  let price = basePrice * 0.85;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.48) * price * 0.025;
    price = Math.max(price + change, basePrice * 0.5);
    data.push({
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000
    });
  }
  // Ensure last price is close to current
  data[data.length - 1].price = basePrice;
  return data;
};

export const generateIntradayData = (basePrice) => {
  const data = [];
  let price = basePrice * 0.98;
  const hours = ['9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00',
    '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00',
    '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30'];

  for (const time of hours) {
    const change = (Math.random() - 0.47) * price * 0.008;
    price = Math.max(price + change, basePrice * 0.9);
    data.push({ time, price: parseFloat(price.toFixed(2)) });
  }
  data[data.length - 1].price = basePrice;
  return data;
};
