import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import './SIPCalculator.css';

const SIPCalculator = () => {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [mode, setMode] = useState('sip'); // sip or lumpsum
  const [lumpsum, setLumpsum] = useState(100000);

  const sipResult = useMemo(() => {
    const n = years * 12;
    const r = rate / 100 / 12;
    const fv = monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const invested = monthly * n;
    const gains = fv - invested;
    return { fv, invested, gains, n };
  }, [monthly, rate, years]);

  const lumpsumResult = useMemo(() => {
    const fv = lumpsum * Math.pow(1 + rate / 100, years);
    const gains = fv - lumpsum;
    return { fv, invested: lumpsum, gains };
  }, [lumpsum, rate, years]);

  const result = mode === 'sip' ? sipResult : lumpsumResult;

  const chartData = useMemo(() => {
    const data = [];
    for (let y = 1; y <= years; y++) {
      if (mode === 'sip') {
        const n = y * 12;
        const r = rate / 100 / 12;
        const fv = monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
        const invested = monthly * n;
        data.push({ year: `Year ${y}`, invested: Math.round(invested), corpus: Math.round(fv), gains: Math.round(fv - invested) });
      } else {
        const fv = lumpsum * Math.pow(1 + rate / 100, y);
        data.push({ year: `Year ${y}`, invested: lumpsum, corpus: Math.round(fv), gains: Math.round(fv - lumpsum) });
      }
    }
    return data;
  }, [monthly, rate, years, mode, lumpsum]);

  const presets = [
    { label: 'Conservative', rate: 8, icon: '🛡️', color: '#06b6d4' },
    { label: 'Moderate', rate: 12, icon: '⚖️', color: '#6366f1' },
    { label: 'Aggressive', rate: 18, icon: '🚀', color: '#10b981' },
  ];

  const formatCrore = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="page-container sip-page">
      <div className="sip-header">
        <h2>SIP & Investment Calculator</h2>
        <p>Plan your financial future with our powerful calculator</p>
      </div>

      <div className="mode-tabs">
        <button className={`mode-tab ${mode === 'sip' ? 'active' : ''}`} onClick={() => setMode('sip')}>
          📅 SIP (Monthly)
        </button>
        <button className={`mode-tab ${mode === 'lumpsum' ? 'active' : ''}`} onClick={() => setMode('lumpsum')}>
          💰 Lump Sum
        </button>
      </div>

      <div className="sip-grid">
        {/* Controls */}
        <div className="sip-controls glass-card">
          <h3>Investment Parameters</h3>

          {mode === 'sip' ? (
            <div className="control-group">
              <div className="control-label">
                <span>Monthly Investment</span>
                <span className="control-value">₹{monthly.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min="500" max="100000" step="500" value={monthly} onChange={e => setMonthly(+e.target.value)} className="slider" />
              <div className="slider-marks">
                <span>₹500</span><span>₹50K</span><span>₹1L</span>
              </div>
              <div className="quick-amounts">
                {[1000, 5000, 10000, 25000, 50000].map(v => (
                  <button key={v} className={`quick-btn ${monthly === v ? 'active' : ''}`} onClick={() => setMonthly(v)}>
                    ₹{v >= 1000 ? `${v/1000}K` : v}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="control-group">
              <div className="control-label">
                <span>Lump Sum Amount</span>
                <span className="control-value">₹{lumpsum.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min="10000" max="10000000" step="10000" value={lumpsum} onChange={e => setLumpsum(+e.target.value)} className="slider" />
              <div className="quick-amounts">
                {[50000, 100000, 500000, 1000000].map(v => (
                  <button key={v} className={`quick-btn ${lumpsum === v ? 'active' : ''}`} onClick={() => setLumpsum(v)}>
                    {v >= 100000 ? `₹${v/100000}L` : `₹${v/1000}K`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="control-group">
            <div className="control-label">
              <span>Expected Annual Return</span>
              <span className="control-value">{rate}% p.a.</span>
            </div>
            <input type="range" min="4" max="30" step="0.5" value={rate} onChange={e => setRate(+e.target.value)} className="slider green" />
            <div className="preset-btns">
              {presets.map(p => (
                <button key={p.label} className={`preset-btn ${rate === p.rate ? 'active' : ''}`}
                  style={{ '--preset-color': p.color }}
                  onClick={() => setRate(p.rate)}>
                  {p.icon} {p.label} ({p.rate}%)
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Investment Duration</span>
              <span className="control-value">{years} Years</span>
            </div>
            <input type="range" min="1" max="40" step="1" value={years} onChange={e => setYears(+e.target.value)} className="slider purple" />
            <div className="quick-amounts">
              {[5, 10, 15, 20, 30].map(v => (
                <button key={v} className={`quick-btn ${years === v ? 'active' : ''}`} onClick={() => setYears(v)}>
                  {v}Y
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="sip-results">
          <div className="result-cards">
            <div className="result-card glass-card invested">
              <div className="result-icon">💸</div>
              <div className="result-label">Total Invested</div>
              <div className="result-value">{formatCrore(result.invested)}</div>
            </div>
            <div className="result-card glass-card gains">
              <div className="result-icon">📈</div>
              <div className="result-label">Wealth Gained</div>
              <div className="result-value profit">{formatCrore(result.gains)}</div>
            </div>
            <div className="result-card glass-card corpus">
              <div className="result-icon">🏆</div>
              <div className="result-label">Future Corpus</div>
              <div className="result-value gradient-text">{formatCrore(result.fv)}</div>
            </div>
          </div>

          <div className="returns-ratio glass-card">
            <div className="ratio-label">Returns Ratio</div>
            <div className="ratio-bar">
              <div className="ratio-invested" style={{ width: `${(result.invested / result.fv) * 100}%` }}>
                <span>Invested {((result.invested / result.fv) * 100).toFixed(0)}%</span>
              </div>
              <div className="ratio-gains" style={{ width: `${(result.gains / result.fv) * 100}%` }}>
                <span>Returns {((result.gains / result.fv) * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="ratio-legend">
              <span><span className="dot blue"></span>Invested: {formatCrore(result.invested)}</span>
              <span><span className="dot green"></span>Returns: {formatCrore(result.gains)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="growth-chart glass-card">
        <h3>Wealth Growth Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => v >= 10000000 ? `₹${(v/10000000).toFixed(1)}Cr` : v >= 100000 ? `₹${(v/100000).toFixed(0)}L` : `₹${(v/1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ background: 'rgba(15,15,45,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#f1f5f9' }}
              formatter={(v, name) => [formatCrore(v), name === 'corpus' ? 'Total Corpus' : 'Amount Invested']}
            />
            <Legend formatter={v => v === 'corpus' ? 'Total Corpus' : 'Amount Invested'} />
            <Area type="monotone" dataKey="corpus" stroke="#6366f1" strokeWidth={2} fill="url(#corpusGrad)" />
            <Area type="monotone" dataKey="invested" stroke="#10b981" strokeWidth={2} fill="url(#investedGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Table */}
      <div className="comparison-section glass-card">
        <h3>Investment Comparison at {rate}% Returns</h3>
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Duration</th>
                <th>Monthly SIP</th>
                <th>Total Invested</th>
                <th>Expected Returns</th>
                <th>Future Value</th>
                <th>Gain Multiple</th>
              </tr>
            </thead>
            <tbody>
              {[5, 10, 15, 20, 25, 30].map(y => {
                const n = y * 12;
                const r = rate / 100 / 12;
                const fv = monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
                const inv = monthly * n;
                const gains = fv - inv;
                return (
                  <tr key={y} className={y === years ? 'highlighted' : ''}>
                    <td>{y} Years</td>
                    <td>₹{monthly.toLocaleString('en-IN')}</td>
                    <td>₹{inv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td className="profit">₹{gains.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td className="gradient-text" style={{ fontWeight: 700 }}>{formatCrore(fv)}</td>
                    <td className="profit">{(fv / inv).toFixed(1)}x</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;
