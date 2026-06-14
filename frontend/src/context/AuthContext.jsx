import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('finlearnx_token');
      const stored = localStorage.getItem('finlearnx_user');
      if (token && stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem('finlearnx_token');
      localStorage.removeItem('finlearnx_user');
    }
    setLoading(false);
  }, []);

  const login = async (email, _password) => {
    const demoUser = {
      id: 1,
      name: 'Arjun Sharma',
      email: email,
      role: 'USER',
    };
    const fakeToken = 'demo_token_' + Date.now();
    localStorage.setItem('finlearnx_token', fakeToken);
    localStorage.setItem('finlearnx_user', JSON.stringify(demoUser));
    setUser(demoUser);
    return demoUser;
  };

  const signup = async (name, email, _password) => {
    const demoUser = { id: 1, name, email, role: 'USER' };
    const fakeToken = 'demo_token_' + Date.now();
    localStorage.setItem('finlearnx_token', fakeToken);
    localStorage.setItem('finlearnx_user', JSON.stringify(demoUser));
    setUser(demoUser);
    return demoUser;
  };

  const logout = () => {
    localStorage.removeItem('finlearnx_token');
    localStorage.removeItem('finlearnx_user');
    setUser(null);
  };

  const getUser = () => {
    try {
      const stored = localStorage.getItem('finlearnx_user');
      return stored ? JSON.parse(stored) : user;
    } catch {
      return user;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
