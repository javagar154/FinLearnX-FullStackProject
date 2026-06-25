import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'finlearnx_token';
const USER_KEY  = 'finlearnx_user';

const saveSession = (token, userData) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Detect stale demo tokens that will never work with the real backend
const isValidJwt = (token) => {
  if (!token) return false;
  // Demo tokens start with 'demo_token_' — always invalid for real backend
  if (token.startsWith('demo_token_')) return false;
  // A real JWT has exactly 3 dot-separated parts
  const parts = token.split('.');
  return parts.length === 3;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const token  = localStorage.getItem(TOKEN_KEY);
      const stored = localStorage.getItem(USER_KEY);

      if (token && isValidJwt(token) && stored) {
        // Token looks like a real JWT — restore session
        const parsed = JSON.parse(stored);
        setUser(parsed);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else if (token && !isValidJwt(token)) {
        // Stale demo token — clear it so user is sent to login
        clearSession();
      }
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for 401 events dispatched by api.js interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    };
    window.addEventListener('flx_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('flx_unauthorized', handleUnauthorized);
  }, []);

  // ── login ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res  = await api.post('/auth/login', { email, password });
    const data = res.data?.data || res.data;
    const token = data.token;

    if (!token || !isValidJwt(token)) {
      throw new Error('Server returned an invalid token');
    }

    const userData = {
      id:            data.userId,
      name:          data.name,
      email:         data.email,
      role:          data.role,
      walletBalance: data.walletBalance ?? 100000,
    };

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    saveSession(token, userData);
    setUser(userData);
    return userData;
  };

  // ── signup ─────────────────────────────────────────────────────────────────
  const signup = async (name, email, password) => {
    const res  = await api.post('/auth/register', { name, email, password });
    const data = res.data?.data || res.data;
    const token = data.token;

    if (!token || !isValidJwt(token)) {
      throw new Error('Server returned an invalid token');
    }

    const userData = {
      id:            data.userId,
      name:          data.name,
      email:         data.email,
      role:          data.role,
      walletBalance: data.walletBalance ?? 100000,
    };

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    saveSession(token, userData);
    setUser(userData);
    return userData;
  };

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    delete api.defaults.headers.common['Authorization'];
    clearSession();
    setUser(null);
  };

  // ── getUser — safe accessor used by components ────────────────────────────
  const getUser = () => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : user;
    } catch {
      return user;
    }
  };

  // ── refreshWallet — sync balance after trades ─────────────────────────────
  const refreshWallet = async () => {
    try {
      const res     = await api.get('/trading/wallet');
      const balance = res.data?.data ?? res.data;
      const current = getUser();
      if (current && typeof balance === 'number') {
        const updated = { ...current, walletBalance: balance };
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        setUser(updated);
      }
    } catch {
      // non-fatal — wallet badge may show stale value
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, getUser, refreshWallet }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
