import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { toast } from 'react-toastify';
import { expenseService } from '../services/expenseService';
import './BudgetTracker.css';

const CATEGORIES = [
  { name: 'Food', icon: '🍔', color: '#6366f1', budget: 8000 },
  { name: 'Travel', icon: '✈️', color: '#8b5cf6', budget: 5000 },
  { name: 'Education', icon: '📚', color: '#06b6d4', budget: 3000 },
  { name: 'Shopping', icon: '🛍️', color: '#10b981', budget: 7000 },
  { name: 'Entertainment', icon: '🎬', color: '#f59e0b', budget: 3000 },
  { name: 'Health', icon: '💊', color: '#ec4899', budget: 2000 },
  { name: 'Utilities', icon: '💡', color: '#84cc16', budget: 4000 },
  { name: 'Others', icon: '📦', color: '#94a3b8', budget: 2000 },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const defaultExpenses = [
  { id: 1, category: 'Food', description: 'Grocery shopping', amount: 2400, date: '2026-05-20' },
  { id: 2, category: 'Travel', description: 'Uber rides', amount: 1200, date: '2026-05-19' },
  { id: 3, category: 'Entertainment', description: 'Netflix + Spotify', amount: 800, date: '2026-05-18' },
  { id: 4, category: 'Food', description: 'Restaurant dinner', amount: 1800, date: '2026-05-17' },
  { id: 5, category: 'Shopping', description: 'Clothes', amount: 3200, date: '2026-05-16' },
  { id: 6, category: 'Education', description: 'Online course', amount: 1500, date: '2026-05-15' },
  { id: 7, category: 'Health', description: 'Gym membership', amount: 1200, date: '2026-05-14' },
  { id: 8, category: 'Utilities', description: 'Electricity bill', amount: 1800, date: '2026-05-13' },
];

const BudgetTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(() => parseInt(localStorage.getItem('flx_monthly_income') || '60000'));
  const [incomeInput, setIncomeInput] = useState('');
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [form, setForm] = useState({ category: 'Food', description: '', amount: '', date: new Date().toISOString().split('T')[0] });

  // Load expenses from backend on mount
  useEffect(() => {
    expenseService.getExpenses()
      .then(data => setExpenses(Array.isArray(data) ? data : []))
      .catch(() => {
        // Fallback to localStorage / defaults — never crash on API error
        try {
          const cached = localStorage.getItem('finlearnx_expenses');
          setExpenses(cached ? JSON.parse(cached) : defaultExpenses);
        } catch {
          setExpenses(defaultExpenses);
        }
      })
      .finally(() => setApiLoading(false));
  }, []);

  const openIncomeModal = () => {
    setIncomeInput(income.toString());
    setShowIncomeModal(true);
  };

  const saveIncome = () => {
    const val = parseInt(incomeInput.replace(/[^0-9]/g, ''));
    if (!val || val < 1000) { toast.error('Please enter a valid income (minimum ₹1,000)'); return; }
    if (val > 10000000) { toast.error('Please enter a realistic income amount'); return; }
    setIncome(val);
    localStorage.setItem('flx_monthly_income', val.toString());
    setShowIncomeModal(false);
    setIncomeInput('');
    toast.success(`✅ Monthly income updated to ₹${val.toLocaleString('en-IN')}`);
  };

  const handleIncomeKey = (e) => {
    if (e.key === 'Enter') saveIncome();
    if (e.key === 'Escape') setShowIncomeModal(false);
  };
  const [activeMonth, setActiveMonth] = useState(4); // May (0-indexed)

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savings = income - totalExpenses;
  const savingsRate = ((savings / income) * 100).toFixed(1);

  const categoryTotals = CATEGORIES.map(cat => ({
    ...cat,
    spent: expenses.filter(e => e.category === cat.name).reduce((sum, e) => sum + e.amount, 0)
  }));

  const pieData = categoryTotals.filter(c => c.spent > 0).map(c => ({ name: c.name, value: c.spent, color: c.color }));

  const monthlyData = MONTHS.map((month, i) => ({
    month,
    income: income,
    expense: i === activeMonth ? totalExpenses : Math.floor(Math.random() * 20000) + 25000,
    savings: i === activeMonth ? savings : Math.floor(Math.random() * 15000) + 10000,
  }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) { toast.error('Fill all fields'); return; }
    try {
      const saved = await expenseService.addExpense(
        form.category, form.description,
        parseFloat(form.amount), form.date
      );
      setExpenses(prev => [saved, ...prev]);
      setForm({ category: 'Food', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      toast.success('Expense added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    try {
      await expenseService.deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      toast.success('Expense deleted');
    } catch {
      toast.error('Failed to delete expense');
    }
  };

  return (
    <div className="page-container budget-page">
      {/* Summary Cards */}
      <div className="budget-summary">
        <div className="summary-card glass-card income-card">
          <div className="summary-icon">💰</div>
          <div style={{ flex: 1 }}>
            <div className="summary-label">Monthly Income</div>
            <div className="income-display-row">
              <div className="summary-value">₹{income.toLocaleString('en-IN')}</div>
              <button className="income-edit-btn" onClick={openIncomeModal} title="Update monthly income">✏️</button>
            </div>
            <div className="summary-sub">per month · click ✏️ to update</div>
          </div>
        </div>
        <div className="summary-card glass-card expense-card">
          <div className="summary-icon">💸</div>
          <div>
            <div className="summary-label">Total Expenses</div>
            <div className="summary-value loss">₹{totalExpenses.toLocaleString('en-IN')}</div>
            <div className="summary-sub">{((totalExpenses / income) * 100).toFixed(1)}% of income</div>
          </div>
        </div>
        <div className="summary-card glass-card savings-card">
          <div className="summary-icon">🏦</div>
          <div>
            <div className="summary-label">Net Savings</div>
            <div className={`summary-value ${savings >= 0 ? 'profit' : 'loss'}`}>₹{savings.toLocaleString('en-IN')}</div>
            <div className="summary-sub">{savingsRate}% savings rate</div>
          </div>
        </div>
        <div className="summary-card glass-card progress-card">
          <div style={{ width: 80, height: 80 }}>
            <CircularProgressbar
              value={parseFloat(savingsRate)}
              text={`${savingsRate}%`}
              styles={buildStyles({
                textSize: '20px',
                pathColor: savings >= 0 ? '#00ff88' : '#ff4757',
                textColor: '#f1f5f9',
                trailColor: 'rgba(255,255,255,0.1)',
              })}
            />
          </div>
          <div>
            <div className="summary-label">Savings Rate</div>
            <div className="summary-sub">Target: 20%+</div>
          </div>
        </div>
      </div>

      <div className="budget-grid">
        {/* Category Breakdown */}
        <div className="category-section glass-card">
          <div className="section-header">
            <h3>Category Breakdown</h3>
            <button className="add-expense-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '+ Add Expense'}
            </button>
          </div>

          {showForm && (
            <form className="expense-form" onSubmit={handleAdd}>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
              </select>
              <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <input type="number" placeholder="Amount (₹)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              <button type="submit" className="submit-btn">Add</button>
            </form>
          )}

          <div className="categories-list">
            {categoryTotals.map(cat => {
              const pct = Math.min((cat.spent / cat.budget) * 100, 100);
              const over = cat.spent > cat.budget;
              return (
                <div key={cat.name} className="category-item">
                  <div className="cat-header">
                    <span className="cat-icon">{cat.icon}</span>
                    <span className="cat-name">{cat.name}</span>
                    <span className={`cat-amount ${over ? 'loss' : ''}`}>₹{cat.spent.toLocaleString('en-IN')}</span>
                    <span className="cat-budget">/ ₹{cat.budget.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="cat-progress-bar">
                    <div className="cat-progress-fill" style={{
                      width: `${pct}%`,
                      background: over ? 'var(--loss-red)' : cat.color
                    }}></div>
                  </div>
                  {over && <div className="over-budget">⚠️ Over budget by ₹{(cat.spent - cat.budget).toLocaleString('en-IN')}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="pie-section glass-card">
          <h3>Spending Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgba(15,15,45,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#f1f5f9' }}
                formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend-grid">
            {pieData.map(d => (
              <div key={d.name} className="pie-legend-item">
                <span className="legend-dot" style={{ background: d.color }}></span>
                <span>{d.name}</span>
                <span className="legend-pct">{((d.value / totalExpenses) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="monthly-chart glass-card">
        <h3>Monthly Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
            <Tooltip
              contentStyle={{ background: 'rgba(15,15,45,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#f1f5f9' }}
              formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']}
            />
            <Legend />
            <Bar dataKey="income" fill="#10b981" radius={[4,4,0,0]} name="Income" />
            <Bar dataKey="expense" fill="#6366f1" radius={[4,4,0,0]} name="Expense" />
            <Bar dataKey="savings" fill="#06b6d4" radius={[4,4,0,0]} name="Savings" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Expenses */}
      <div className="expenses-list-section glass-card">
        <h3>Recent Expenses</h3>
        <div className="expenses-table-wrapper">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.slice(0, 15).map(exp => {
                const cat = CATEGORIES.find(c => c.name === exp.category);
                return (
                  <tr key={exp.id}>
                    <td>
                      <span className="cat-tag" style={{ background: `${cat?.color}20`, color: cat?.color }}>
                        {cat?.icon} {exp.category}
                      </span>
                    </td>
                    <td>{exp.description}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{exp.date}</td>
                    <td className="text-right loss" style={{ fontWeight: 700 }}>-₹{exp.amount.toLocaleString('en-IN')}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(exp.id)}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Income Update Modal */}
      {showIncomeModal && (
        <div className="income-modal-overlay" onClick={() => setShowIncomeModal(false)}>
          <div className="income-modal" onClick={e => e.stopPropagation()}>
            <div className="im-header">
              <div className="im-icon">💰</div>
              <h3 className="im-title">Update Monthly Income</h3>
              <p className="im-subtitle">Enter your net take-home salary per month</p>
            </div>

            <div className="im-body">
              <div className="im-current">
                <span className="im-current-label">Current Income</span>
                <span className="im-current-val">₹{income.toLocaleString('en-IN')}</span>
              </div>

              <div className="im-input-group">
                <label className="im-label">New Monthly Income</label>
                <div className="im-input-wrap">
                  <span className="im-prefix">₹</span>
                  <input
                    type="number"
                    className="im-input"
                    placeholder="e.g. 75000"
                    value={incomeInput}
                    onChange={e => setIncomeInput(e.target.value)}
                    onKeyDown={handleIncomeKey}
                    autoFocus
                    min="1000"
                    max="10000000"
                  />
                </div>
                {incomeInput && parseInt(incomeInput) >= 1000 && (
                  <div className="im-preview">
                    Preview: ₹{parseInt(incomeInput).toLocaleString('en-IN')} / month
                  </div>
                )}
              </div>

              <div className="im-quick-amounts">
                <span className="im-quick-label">Quick select:</span>
                {[25000, 50000, 75000, 100000, 150000, 200000].map(v => (
                  <button key={v} className={`im-quick-btn ${incomeInput === v.toString() ? 'active' : ''}`}
                    onClick={() => setIncomeInput(v.toString())}>
                    ₹{v >= 100000 ? `${v / 100000}L` : `${v / 1000}K`}
                  </button>
                ))}
              </div>

              <div className="im-actions">
                <button className="im-cancel-btn" onClick={() => setShowIncomeModal(false)}>
                  Cancel
                </button>
                <button className="im-save-btn" onClick={saveIncome}
                  disabled={!incomeInput || parseInt(incomeInput) < 1000}>
                  ✅ Save Income
                </button>
              </div>

              <p className="im-note">
                💡 Your income is saved locally and used to calculate savings rate and budget analytics.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTracker;
