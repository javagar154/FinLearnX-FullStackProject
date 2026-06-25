import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchService } from '../../services/searchService';
import './GlobalSearch.css';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(0);
  const inputRef = useRef(null);
  const dropRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') { setOpen(false); setQuery(''); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const search = (q) => {
    setQuery(q);
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    const lower = q.toLowerCase();

    // Use backend API (debounced via setTimeout)
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(async () => {
      try {
        const data = await searchService.publicSearch(q);
        const courseResults = (data.courses || []).slice(0, 4).map(c => ({
          id: c.id, title: c.title,
          subtitle: (c.type === 'premium' ? 'Premium' : c.type === 'basic' ? 'Basic' : 'Intermediate') + ' Course',
          icon: c.icon || '📚', type: c.type, path: c.path,
          badge: c.type === 'premium' ? '👑' : '📚',
        }));
        const stockResults = (data.stocks || []).slice(0, 4).map(s => ({
          id: s.symbol, title: s.symbol, subtitle: s.name,
          icon: '📈', type: 'stock', path: `/stocks/${s.symbol}`,
          badge: '', badgeColor: '#00ff88',
        }));
        const combined = [...courseResults, ...stockResults];
        setResults(combined);
        setOpen(combined.length > 0);
        setFocused(0);
      } catch {
        // Fallback to empty — don't crash on network error
        setResults([]); setOpen(false);
      }
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(f + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
    if (e.key === 'Enter' && results[focused]) { goTo(results[focused]); }
  };

  const goTo = (result) => {
    navigate(result.path);
    setQuery(''); setOpen(false);
  };

  const highlight = (text, q) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="gs-highlight">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div className="gs-wrapper" ref={dropRef}>
      <div className={`gs-input-wrap ${open ? 'active' : ''}`}>
        <span className="gs-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="gs-input"
          placeholder="Search courses, stocks... (Press /)"
          value={query}
          onChange={e => search(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setOpen(results.length > 0)}
        />
        {query && (
          <button className="gs-clear" onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus(); }}>✕</button>
        )}
        <span className="gs-shortcut">/</span>
      </div>

      {open && results.length > 0 && (
        <div className="gs-dropdown">
          {results.some(r => r.type === 'course' || r.type === 'premium') && (
            <div className="gs-section-label">📚 Courses</div>
          )}
          {results.filter(r => r.type === 'course' || r.type === 'premium').map((r, i) => (
            <button key={r.id} className={`gs-item ${focused === i ? 'focused' : ''}`}
              onClick={() => goTo(r)} onMouseEnter={() => setFocused(i)}>
              <span className="gs-item-icon">{r.icon}</span>
              <div className="gs-item-info">
                <div className="gs-item-title">{highlight(r.title, query)}</div>
                <div className="gs-item-sub">{r.subtitle}</div>
              </div>
              <span className="gs-item-badge"
                style={{
                  background: r.type === 'premium' ? 'rgba(245,158,11,.2)' : 'rgba(99,102,241,.15)',
                  color: r.type === 'premium' ? '#f59e0b' : 'var(--accent-blue)'
                }}>
                {r.badge}
              </span>
            </button>
          ))}

          {results.some(r => r.type === 'stock') && (
            <div className="gs-section-label">📈 Stocks</div>
          )}
          {results.filter(r => r.type === 'stock').map((r, i) => {
            const idx = results.filter(x => x.type === 'course' || x.type === 'premium').length + i;
            return (
              <button key={r.id} className={`gs-item ${focused === idx ? 'focused' : ''}`}
                onClick={() => goTo(r)} onMouseEnter={() => setFocused(idx)}>
                <span className="gs-item-icon">{r.icon}</span>
                <div className="gs-item-info">
                  <div className="gs-item-title">{highlight(r.title, query)}</div>
                  <div className="gs-item-sub">{highlight(r.subtitle, query)}</div>
                </div>
                <span className="gs-item-badge" style={{ color: r.badgeColor, background: `${r.badgeColor}20` }}>
                  {r.badge}
                </span>
              </button>
            );
          })}

          <div className="gs-footer">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
        </div>
      )}

      {open && query && results.length === 0 && (
        <div className="gs-dropdown">
          <div className="gs-no-results">
            <span>🔍</span>
            <span>No results for "<strong>{query}</strong>"</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
