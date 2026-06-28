import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import { STOCKS, generatePriceHistory, generateIntradayData } from '../data/stocks';
import { tradingService } from '../services/tradingService';
import { useAuth } from '../context/AuthContext';
import './StockDetail.css';

const StockDetail = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('1D');
  const { refreshWallet } = useAuth();
  const [tradeType, setTradeType] = useState('buy');
  const [qty, setQty] = useState(1);
  const [tradeLoading, setTradeLoading] = useState(false);
  // wallet shown from auth context; portfolio from API
  const [wallet, setWallet] = useState(parseFloat(localStorage.getItem('finlearnx_wallet') || '100000'));
  const [portfolio, setPortfolio] = useState(JSON.parse(localStorage.getItem('finlearnx_portfolio') || '[]'));

  useEffect(() => {
    const found = STOCKS.find(s => s.symbol === symbol);
    if (!found) { navigate('/stocks'); return; }
    setStock(found);
    loadChart(found, '1D');
  }, [symbol]);

  const loadChart = (s, tf) => {
    if (tf === '1D') setChartData(generateIntradayData(s.price).map(d => ({ ...d, label: d.time })));
    else if (tf === '1W') setChartData(generatePriceHistory(s.price, 7).map(d => ({ ...d, label: d.date })));
    else if (tf === '1M') setChartData(generatePriceHistory(s.price, 30).map(d => ({ ...d, label: d.date })));
    else if (tf === '3M') setChartData(generatePriceHistory(s.price, 90).map(d => ({ ...d, label: d.date })));
    else if (tf === '1Y') setChartData(generatePriceHistory(s.price, 365).map(d => ({ ...d, label: d.date })));
  };

  const handleTimeframe = (tf) => {
    setTimeframe(tf);
    if (stock) loadChart(stock, tf);
  };

  const holding = portfolio.find(h => h.symbol === symbol);
  const totalCost = qty * (stock?.price || 0);
  const isProfit = chartData.length > 1 && chartData[chartData.length - 1].price >= chartData[0].price;

  const handleTrade = async () => {
    if (!stock || tradeLoading) return;
    setTradeLoading(true);
    try {
      await tradingService.executeTrade(
        symbol, stock.name, qty, stock.price,
        tradeType === 'buy' ? 'BUY' : 'SELL'
      );
      const label = tradeType === 'buy' ? 'Bought' : 'Sold';
      toast.success(`✅ ${label} ${qty} share${qty > 1 ? 's' : ''} of ${symbol} @ ₹${stock.price.toLocaleString('en-IN')}`);

      // Refresh wallet balance from backend and persist locally
      const newBalance = await tradingService.getWallet();
      setWallet(newBalance);
      localStorage.setItem('finlearnx_wallet', String(newBalance));
      refreshWallet();

      // Refresh portfolio from backend so Portfolio page shows updated holdings
      const newPortfolio = await tradingService.getPortfolio();
      const mapped = newPortfolio.map(h => ({
        symbol:   h.symbol,
        name:     h.stockName,
        qty:      h.quantity,
        avgPrice: h.averagePrice,
      }));
      setPortfolio(mapped);
      localStorage.setItem('finlearnx_portfolio', JSON.stringify(mapped));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Trade failed';
      toast.error(msg);
    } finally {
      setTradeLoading(false);
    }
  };

  if (!stock) return <div className="page-container"><p style={{ color: 'var(--text-secondary)' }}>Loading...</p></div>;

  const priceChange = chartData.length > 1 ? chartData[chartData.length - 1].price - chartData[0].price : stock.change;
  const priceChangePct = chartData.length > 1 ? ((priceChange / chartData[0].price) * 100) : stock.changePercent;
  const chartColor = isProfit ? '#00ff88' : '#ff4757';

  return (
    <div className="page-container stock-detail-page">
      <button className="back-btn" onClick={() => navigate('/stocks')}>← Back to Markets</button>

      <div className="stock-detail-grid">
        {/* Left: Chart */}
        <div className="chart-section">
          {/* Stock Header */}
          <div className="stock-header glass-card">
            <div className="stock-title-row">
              <div className="stock-avatar" style={{ background: `hsl(${symbol.charCodeAt(0) * 15}, 60%, 40%)` }}>
                {symbol.charAt(0)}
              </div>
              <div>
                <h1 className="stock-symbol">{stock.symbol}</h1>
                <p className="stock-full-name">{stock.name}</p>
              </div>
              <div className="stock-badges">
                <span className="sector-badge">{stock.sector}</span>
                <span className="exchange-badge">{stock.exchange}</span>
              </div>
            </div>

            <div className="stock-price-row">
              <div className="current-price">
                {stock.country === 'US' ? '$' : '₹'}{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
              <div className={`price-change ${priceChange >= 0 ? 'profit' : 'loss'}`}>
                {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)} ({Math.abs(priceChangePct).toFixed(2)}%)
              </div>
            </div>

            <div className="stock-meta-row">
              <div className="meta-item"><span>52W High</span><span className="profit">₹{stock.high52.toLocaleString('en-IN')}</span></div>
              <div className="meta-item"><span>52W Low</span><span className="loss">₹{stock.low52.toLocaleString('en-IN')}</span></div>
              <div className="meta-item"><span>Market Cap</span><span>{stock.marketCap}</span></div>
              <div className="meta-item"><span>P/E Ratio</span><span>{stock.pe > 0 ? stock.pe : 'N/A'}</span></div>
              <div className="meta-item"><span>Volume</span><span>{stock.volume}</span></div>
            </div>
          </div>

          {/* Chart */}
          <div className="chart-wrapper glass-card">
            <div className="timeframe-tabs">
              {['1D', '1W', '1M', '3M', '1Y'].map(tf => (
                <button key={tf} className={`tf-btn ${timeframe === tf ? 'active' : ''}`} onClick={() => handleTimeframe(tf)}>
                  {tf}
                </button>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                  interval={Math.floor(chartData.length / 6)} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                  domain={['auto', 'auto']}
                  tickFormatter={v => `₹${v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15,15,45,0.95)', border: `1px solid ${chartColor}40`, borderRadius: 12, color: '#f1f5f9' }}
                  formatter={(v) => [`₹${v.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, 'Price']}
                />
                <Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2} fill="url(#stockGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Trade Panel */}
        <div className="trade-section">
          <div className="trade-panel glass-card">
            <h3 className="trade-title">Trade {stock.symbol}</h3>

            <div className="trade-tabs">
              <button className={`trade-tab ${tradeType === 'buy' ? 'active-buy' : ''}`} onClick={() => setTradeType('buy')}>Buy</button>
              <button className={`trade-tab ${tradeType === 'sell' ? 'active-sell' : ''}`} onClick={() => setTradeType('sell')}>Sell</button>
            </div>

            <div className="trade-form">
              <div className="trade-field">
                <label>Current Price</label>
                <div className="trade-price">₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              </div>

              <div className="trade-field">
                <label>Quantity</label>
                <div className="qty-input">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                  <input type="number" min="1" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} />
                  <button onClick={() => setQty(qty + 1)}>+</button>
                </div>
              </div>

              <div className="trade-field">
                <label>Total Value</label>
                <div className="trade-total">₹{totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              </div>

              <div className="trade-field">
                <label>Wallet Balance</label>
                <div className="wallet-balance">₹{wallet.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>

              {holding && (
                <div className="holding-info">
                  <div className="holding-row">
                    <span>Holdings</span>
                    <span>{holding.qty} shares</span>
                  </div>
                  <div className="holding-row">
                    <span>Avg. Price</span>
                    <span>₹{holding.avgPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="holding-row">
                    <span>P&L</span>
                    <span className={stock.price >= holding.avgPrice ? 'profit' : 'loss'}>
                      {stock.price >= holding.avgPrice ? '+' : ''}
                      ₹{((stock.price - holding.avgPrice) * holding.qty).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              )}

              <button
                className={`execute-btn ${tradeType}`}
                onClick={handleTrade}
                disabled={tradeLoading}
              >
                {tradeLoading ? <span className="btn-spinner"></span> :
                  tradeType === 'buy' ? `Buy ${qty} Share${qty > 1 ? 's' : ''}` : `Sell ${qty} Share${qty > 1 ? 's' : ''}`}
              </button>

              <p className="trade-disclaimer">
                🎮 This is a virtual trading simulator. No real money involved.
              </p>
            </div>
          </div>

          {/* About */}
          <div className="about-card glass-card">
            <h4>About {stock.name}</h4>
            <div className="about-grid">
              <div className="about-item"><span>Sector</span><span>{stock.sector}</span></div>
              <div className="about-item"><span>Exchange</span><span>{stock.exchange}</span></div>
              <div className="about-item"><span>Country</span><span>{stock.country}</span></div>
              <div className="about-item"><span>Volume</span><span>{stock.volume}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
