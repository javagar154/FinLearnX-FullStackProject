import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { STOCKS } from '../data/stocks';
import { getTimeGreeting, getNotifications } from '../utils/notifications';
import './Dashboard.css';

const portfolioGrowth = [
  { month: 'Jan', value: 85000 }, { month: 'Feb', value: 92000 },
  { month: 'Mar', value: 88000 }, { month: 'Apr', value: 97000 },
  { month: 'May', value: 105000 }, { month: 'Jun', value: 112000 },
  { month: 'Jul', value: 108000 }, { month: 'Aug', value: 118000 },
  { month: 'Sep', value: 125000 }, { month: 'Oct', value: 132000 },
  { month: 'Nov', value: 128000 }, { month: 'Dec', value: 142500 },
];

const expenseData = [
  { name: 'Food', value: 8000, color: '#6366f1' },
  { name: 'Travel', value: 4500, color: '#8b5cf6' },
  { name: 'Shopping', value: 6200, color: '#10b981' },
  { name: 'Education', value: 3000, color: '#06b6d4' },
  { name: 'Entertainment', value: 2800, color: '#f59e0b' },
  { name: 'Others', value: 1500, color: '#ec4899' },
];

const recentTransactions = [
  { id: 1, type: 'buy', stock: 'RELIANCE', qty: 5, price: 2847.50, total: 14237.50, time: '10:32 AM', date: 'Today' },
  { id: 2, type: 'sell', stock: 'TCS', qty: 2, price: 3912.75, total: 7825.50, time: '11:15 AM', date: 'Today' },
  { id: 3, type: 'buy', stock: 'AAPL', qty: 3, price: 189.84, total: 569.52, time: '2:45 PM', date: 'Yesterday' },
  { id: 4, type: 'buy', stock: 'INFY', qty: 10, price: 1678.40, total: 16784.00, time: '9:30 AM', date: 'Yesterday' },
  { id: 5, type: 'sell', stock: 'TSLA', qty: 1, price: 248.42, total: 248.42, time: '3:20 PM', date: '2 days ago' },
];

const monthlyData = [
  { month: 'Aug', income: 60000, expense: 32000 },
  { month: 'Sep', income: 60000, expense: 28000 },
  { month: 'Oct', income: 65000, expense: 35000 },
  { month: 'Nov', income: 60000, expense: 30000 },
  { month: 'Dec', income: 72000, expense: 26000 },
];

const StatCard = ({ icon, label, value, sub, subColor, gradient }) => (
  <div className="stat-card glass-card" style={{ background: gradient || undefined }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub" style={{ color: subColor }}>{sub}</div>}
    </div>
  </div>
);

const Dashboard = () => {
  const { getUser } = useAuth();
  const navigate = useNavigate();
  const user = getUser();
  const [portfolio] = useState(JSON.parse(localStorage.getItem('finlearnx_portfolio') || '[]'));
  const [greeting, setGreeting] = useState(getTimeGreeting());
  const [recentNotifs, setRecentNotifs] = useState([]);

  useEffect(() => {
    // Update greeting every minute
    const t = setInterval(() => setGreeting(getTimeGreeting()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const refresh = () => setRecentNotifs(getNotifications().slice(0, 5));
    refresh();
    window.addEventListener('flx_notification', refresh);
    return () => window.removeEventListener('flx_notification', refresh);
  }, []);

  const topGainers = STOCKS.filter(s => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const topLosers = STOCKS.filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);

  const portfolioValue = portfolio.reduce((sum, h) => {
    const stock = STOCKS.find(s => s.symbol === h.symbol);
    return sum + (stock ? stock.price * h.qty : 0);
  }, 0);

  const walletBalance = parseFloat(localStorage.getItem('finlearnx_wallet') || '100000');

  return (
    <div className="page-container dashboard-page">
      {/* Welcome */}
      <div className="welcome-section">
        <div>
          <h2 className="welcome-title">
            {greeting.emoji} {greeting.greeting}, {user?.name?.split(' ')[0] || 'Trader'}!
          </h2>
          <p className="welcome-sub">Here's your financial overview for today · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="welcome-actions">
          <button className="btn-primary" onClick={() => navigate('/stocks')}>Trade Now</button>
          <button className="btn-secondary" onClick={() => navigate('/learn')}>Learn</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard icon="💼" label="Portfolio Value" value={`₹${portfolioValue > 0 ? portfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '1,42,500'}`} sub="↑ +12.4% this month" subColor="var(--profit-green)" />
        <StatCard icon="💰" label="Wallet Balance" value={`₹${walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} sub="Virtual trading funds" subColor="var(--text-muted)" />
        <StatCard icon="📊" label="Total P&L" value="₹+18,340" sub="↑ +14.8% overall" subColor="var(--profit-green)" />
        <StatCard icon="💸" label="Monthly Savings" value="₹34,000" sub="56.7% of income" subColor="var(--accent-cyan)" />
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Portfolio Growth */}
        <div className="chart-card glass-card">
          <div className="chart-header">
            <h3>Portfolio Growth</h3>
            <span className="profit">+67.6% YTD</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={portfolioGrowth}>
              <defs>
                <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,15,45,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#f1f5f9' }}
                formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Portfolio']}
              />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#portfolioGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="chart-card glass-card">
          <div className="chart-header">
            <h3>Expense Breakdown</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>This Month</span>
          </div>
          <div className="pie-container">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={expenseData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {expenseData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'rgba(15,15,45,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#f1f5f9' }}
                  formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {expenseData.map(e => (
                <div key={e.name} className="legend-item">
                  <span className="legend-dot" style={{ background: e.color }}></span>
                  <span className="legend-name">{e.name}</span>
                  <span className="legend-val">₹{e.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Income vs Expense */}
      <div className="charts-row">
        <div className="chart-card glass-card">
          <div className="chart-header">
            <h3>Income vs Expense</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Last 5 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip
                contentStyle={{ background: 'rgba(15,15,45,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#f1f5f9' }}
                formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']}
              />
              <Bar dataKey="income" fill="#10b981" radius={[4,4,0,0]} name="Income" />
              <Bar dataKey="expense" fill="#6366f1" radius={[4,4,0,0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className="chart-card glass-card">
          <div className="chart-header">
            <h3>Recent Transactions</h3>
            <button className="view-all-btn" onClick={() => navigate('/portfolio')}>View All</button>
          </div>
          <div className="transactions-list">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="tx-item">
                <div className={`tx-badge ${tx.type}`}>{tx.type === 'buy' ? '↑' : '↓'}</div>
                <div className="tx-info">
                  <div className="tx-stock">{tx.stock}</div>
                  <div className="tx-meta">{tx.qty} shares · {tx.date}</div>
                </div>
                <div className="tx-amount">
                  <div className={tx.type === 'buy' ? 'loss' : 'profit'}>
                    {tx.type === 'buy' ? '-' : '+'}₹{tx.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                  <div className="tx-price">@ ₹{tx.price.toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Movers */}
      <div className="movers-section">
        <div className="movers-card glass-card">
          <h3 className="movers-title">🚀 Top Gainers</h3>
          <div className="movers-list">
            {topGainers.map(s => (
              <div key={s.symbol} className="mover-item" onClick={() => navigate(`/stocks/${s.symbol}`)}>
                <div className="mover-symbol">{s.symbol}</div>
                <div className="mover-name">{s.name.split(' ').slice(0,2).join(' ')}</div>
                <div className="mover-price">₹{s.price.toLocaleString('en-IN')}</div>
                <div className="profit mover-change">+{s.changePercent.toFixed(2)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="movers-card glass-card">
          <h3 className="movers-title">📉 Top Losers</h3>
          <div className="movers-list">
            {topLosers.map(s => (
              <div key={s.symbol} className="mover-item" onClick={() => navigate(`/stocks/${s.symbol}`)}>
                <div className="mover-symbol">{s.symbol}</div>
                <div className="mover-name">{s.name.split(' ').slice(0,2).join(' ')}</div>
                <div className="mover-price">₹{s.price.toLocaleString('en-IN')}</div>
                <div className="loss mover-change">{s.changePercent.toFixed(2)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity from Notifications */}
      {recentNotifs.length > 0 && (
        <div className="recent-activity glass-card">
          <div className="chart-header">
            <h3>🔔 Recent Activity</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Live trade updates</span>
          </div>
          <div className="activity-list">
            {recentNotifs.map(n => {
              const colors = { buy: '#00ff88', sell: '#f59e0b', loss: '#ff4757', profit: '#00ff88', info: '#6366f1' };
              const icons  = { buy: '📈', sell: '📉', loss: '⚠️', profit: '💰', info: '🔔' };
              const c = colors[n.type] || '#6366f1';
              return (
                <div key={n.id} className="activity-item">
                  <div className="activity-icon" style={{ background: `${c}18`, color: c }}>{icons[n.type] || '🔔'}</div>
                  <div className="activity-info">
                    <div className="activity-title">{n.title}</div>
                    <div className="activity-msg">{n.message}</div>
                  </div>
                  <div className="activity-time">{new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
