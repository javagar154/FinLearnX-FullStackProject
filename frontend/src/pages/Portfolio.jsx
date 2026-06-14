import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { STOCKS, generatePriceHistory } from '../data/stocks';
import './Portfolio.css';

const Portfolio = () => {
  const navigate = useNavigate();
  const [portfolio] = useState(JSON.parse(localStorage.getItem('finlearnx_portfolio') || '[]'));
  const wallet = parseFloat(localStorage.getItem('finlearnx_wallet') || '100000');

  const holdings = portfolio.map(h => {
    const stock = STOCKS.find(s => s.symbol === h.symbol);
    if (!stock) return null;
    const currentValue = stock.price * h.qty;
    const investedValue = h.avgPrice * h.qty;
    const pnl = currentValue - investedValue;
    const pnlPct = ((pnl / investedValue) * 100);
    return { ...h, stock, currentValue, investedValue, pnl, pnlPct };
  }).filter(Boolean);

  const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalCurrent = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPct = totalInvested > 0 ? ((totalPnL / totalInvested) * 100) : 0;

  const sectorAllocation = holdings.reduce((acc, h) => {
    const sector = h.stock.sector;
    acc[sector] = (acc[sector] || 0) + h.currentValue;
    return acc;
  }, {});

  const pieData = Object.entries(sectorAllocation).map(([name, value], i) => ({
    name, value: Math.round(value),
    color: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#84cc16'][i % 7]
  }));

  const growthData = generatePriceHistory(totalCurrent || 100000, 30).map(d => ({
    ...d,
    value: d.price
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#84cc16'];

  if (holdings.length === 0) {
    return (
      <div className="page-container portfolio-page">
        <div className="empty-portfolio glass-card">
          <div style={{ fontSize: 64 }}>📊</div>
          <h2>Your Portfolio is Empty</h2>
          <p>Start trading to build your virtual portfolio</p>
          <button className="btn-primary" onClick={() => navigate('/stocks')}>
            Start Trading →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container portfolio-page">
      {/* Summary */}
      <div className="portfolio-summary">
        <div className="summary-main glass-card">
          <div className="summary-label">Total Portfolio Value</div>
          <div className="summary-big-value">₹{totalCurrent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div className={`summary-pnl ${totalPnL >= 0 ? 'profit' : 'loss'}`}>
            {totalPnL >= 0 ? '▲' : '▼'} ₹{Math.abs(totalPnL).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            ({Math.abs(totalPnLPct).toFixed(2)}%) Overall
          </div>
        </div>
        <div className="summary-stats">
          <div className="stat-item glass-card">
            <div className="stat-label">Invested</div>
            <div className="stat-val">₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="stat-item glass-card">
            <div className="stat-label">P&L</div>
            <div className={`stat-val ${totalPnL >= 0 ? 'profit' : 'loss'}`}>
              {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="stat-item glass-card">
            <div className="stat-label">Wallet</div>
            <div className="stat-val">₹{wallet.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="stat-item glass-card">
            <div className="stat-label">Holdings</div>
            <div className="stat-val">{holdings.length} stocks</div>
          </div>
        </div>
      </div>

      <div className="portfolio-grid">
        {/* Growth Chart */}
        <div className="portfolio-chart glass-card">
          <h3>Portfolio Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,15,45,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#f1f5f9' }}
                formatter={(v) => [`₹${v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 'Value']}
              />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#portGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sector Allocation */}
        <div className="sector-chart glass-card">
          <h3>Sector Allocation</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'rgba(15,15,45,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#f1f5f9' }}
                    formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="sector-legend">
                {pieData.map(d => (
                  <div key={d.name} className="sector-item">
                    <span className="sector-dot" style={{ background: d.color }}></span>
                    <span className="sector-name">{d.name}</span>
                    <span className="sector-pct">{((d.value / totalCurrent) * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>No data</p>}
        </div>
      </div>

      {/* Holdings Table */}
      <div className="holdings-table-section glass-card">
        <div className="table-header">
          <h3>Holdings</h3>
          <button className="btn-primary" onClick={() => navigate('/stocks')}>+ Add Position</button>
        </div>
        <div className="table-wrapper">
          <table className="holdings-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Sector</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Avg Price</th>
                <th className="text-right">Current Price</th>
                <th className="text-right">Invested</th>
                <th className="text-right">Current Value</th>
                <th className="text-right">P&L</th>
                <th className="text-right">P&L %</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map(h => (
                <tr key={h.symbol} className="holding-row" onClick={() => navigate(`/stocks/${h.symbol}`)}>
                  <td>
                    <div className="holding-stock">
                      <div className="holding-avatar" style={{ background: `hsl(${h.symbol.charCodeAt(0) * 15}, 60%, 40%)` }}>
                        {h.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="holding-symbol">{h.symbol}</div>
                        <div className="holding-name">{h.stock.name.split(' ').slice(0, 2).join(' ')}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="sector-badge">{h.stock.sector}</span></td>
                  <td className="text-right">{h.qty}</td>
                  <td className="text-right">₹{h.avgPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="text-right">₹{h.stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="text-right">₹{h.investedValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td className="text-right">₹{h.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td className={`text-right ${h.pnl >= 0 ? 'profit' : 'loss'}`} style={{ fontWeight: 700 }}>
                    {h.pnl >= 0 ? '+' : ''}₹{h.pnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                  <td className={`text-right ${h.pnlPct >= 0 ? 'profit' : 'loss'}`}>
                    <span className={`pnl-badge ${h.pnlPct >= 0 ? 'up' : 'down'}`}>
                      {h.pnlPct >= 0 ? '▲' : '▼'} {Math.abs(h.pnlPct).toFixed(2)}%
                    </span>
                  </td>
                  <td>
                    <button className="trade-btn" onClick={e => { e.stopPropagation(); navigate(`/stocks/${h.symbol}`); }}>
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
