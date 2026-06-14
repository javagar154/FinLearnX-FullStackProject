import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { STOCKS } from '../data/stocks';
import './StockMarket.css';

const SECTORS = ['All', 'IT', 'Banking', 'Energy', 'Pharma', 'Auto', 'FMCG', 'Finance', 'Technology', 'Semiconductors'];
const EXCHANGES = ['All', 'NSE', 'NASDAQ', 'NYSE'];

const StockMarket = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sector, setSector] = useState('All');
  const [exchange, setExchange] = useState('All');
  const [sortBy, setSortBy] = useState('marketCap');
  const [stocks, setStocks] = useState(STOCKS);
  const [watchlist, setWatchlist] = useState(JSON.parse(localStorage.getItem('finlearnx_watchlist') || '[]'));

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const fluctuation = (Math.random() - 0.5) * s.price * 0.002;
        const newPrice = parseFloat((s.price + fluctuation).toFixed(2));
        const newChange = parseFloat((s.change + fluctuation).toFixed(2));
        const newChangePercent = parseFloat(((newChange / (newPrice - newChange)) * 100).toFixed(2));
        return { ...s, price: newPrice, change: newChange, changePercent: newChangePercent };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = stocks.filter(s => {
    const matchSearch = !search || s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase());
    const matchSector = sector === 'All' || s.sector === sector;
    const matchExchange = exchange === 'All' || s.exchange === exchange;
    return matchSearch && matchSector && matchExchange;
  }).sort((a, b) => {
    if (sortBy === 'change') return b.changePercent - a.changePercent;
    if (sortBy === 'price') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const toggleWatchlist = (symbol, e) => {
    e.stopPropagation();
    const updated = watchlist.includes(symbol)
      ? watchlist.filter(s => s !== symbol)
      : [...watchlist, symbol];
    setWatchlist(updated);
    localStorage.setItem('finlearnx_watchlist', JSON.stringify(updated));
  };

  const nifty50 = 22456.80;
  const sensex = 73876.45;

  return (
    <div className="page-container stocks-page">
      {/* Market Indices */}
      <div className="indices-bar">
        <div className="index-item">
          <span className="index-name">NIFTY 50</span>
          <span className="index-value">{nifty50.toLocaleString('en-IN')}</span>
          <span className="profit index-change">▲ +234.50 (+1.05%)</span>
        </div>
        <div className="index-divider"></div>
        <div className="index-item">
          <span className="index-name">SENSEX</span>
          <span className="index-value">{sensex.toLocaleString('en-IN')}</span>
          <span className="profit index-change">▲ +678.30 (+0.93%)</span>
        </div>
        <div className="index-divider"></div>
        <div className="index-item">
          <span className="index-name">NASDAQ</span>
          <span className="index-value">16,742.39</span>
          <span className="profit index-change">▲ +89.45 (+0.54%)</span>
        </div>
        <div className="index-divider"></div>
        <div className="index-item">
          <span className="index-name">S&P 500</span>
          <span className="index-value">5,234.18</span>
          <span className="loss index-change">▼ -12.34 (-0.24%)</span>
        </div>
        <div className="index-spacer"></div>
        <div className="market-time">
          <span className="status-dot live"></span>
          <span>NSE Live · {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="stocks-filters glass-card">
        <div className="search-bar">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')}>✕</button>}
        </div>

        <div className="filter-group">
          <label>Sector</label>
          <select value={sector} onChange={e => setSector(e.target.value)}>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Exchange</label>
          <select value={exchange} onChange={e => setExchange(e.target.value)}>
            {EXCHANGES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="marketCap">Market Cap</option>
            <option value="change">% Change</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="results-count">{filtered.length} stocks</div>
      </div>

      {/* Stock Table */}
      <div className="stocks-table-wrapper glass-card">
        <table className="stocks-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Company</th>
              <th>Sector</th>
              <th>Exchange</th>
              <th className="text-right">Price</th>
              <th className="text-right">Change</th>
              <th className="text-right">% Change</th>
              <th className="text-right">Market Cap</th>
              <th className="text-right">P/E</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(stock => (
              <tr key={stock.symbol} className="stock-row" onClick={() => navigate(`/stocks/${stock.symbol}`)}>
                <td>
                  <div className="symbol-cell">
                    <button
                      className={`watchlist-btn ${watchlist.includes(stock.symbol) ? 'active' : ''}`}
                      onClick={(e) => toggleWatchlist(stock.symbol, e)}
                      title={watchlist.includes(stock.symbol) ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      {watchlist.includes(stock.symbol) ? '★' : '☆'}
                    </button>
                    <span className="symbol-text">{stock.symbol}</span>
                  </div>
                </td>
                <td>
                  <div className="company-cell">
                    <div className="company-avatar" style={{ background: `hsl(${stock.symbol.charCodeAt(0) * 15}, 60%, 40%)` }}>
                      {stock.symbol.charAt(0)}
                    </div>
                    <span className="company-name">{stock.name}</span>
                  </div>
                </td>
                <td><span className="sector-badge">{stock.sector}</span></td>
                <td><span className="exchange-badge">{stock.exchange}</span></td>
                <td className="text-right price-cell">
                  {stock.country === 'US' ? '$' : stock.country === 'KR' ? '₩' : '₹'}
                  {stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </td>
                <td className={`text-right ${stock.change >= 0 ? 'profit' : 'loss'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                </td>
                <td className={`text-right change-cell ${stock.changePercent >= 0 ? 'profit' : 'loss'}`}>
                  <span className={`change-badge ${stock.changePercent >= 0 ? 'up' : 'down'}`}>
                    {stock.changePercent >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                  </span>
                </td>
                <td className="text-right">{stock.marketCap}</td>
                <td className="text-right">{stock.pe > 0 ? stock.pe.toFixed(1) : 'N/A'}</td>
                <td className="text-center">
                  <button
                    className="trade-btn"
                    onClick={(e) => { e.stopPropagation(); navigate(`/stocks/${stock.symbol}`); }}
                  >
                    Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>🔍</div>
            <p>No stocks found matching your criteria</p>
            <button className="btn-secondary" onClick={() => { setSearch(''); setSector('All'); setExchange('All'); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockMarket;
