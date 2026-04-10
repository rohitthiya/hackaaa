// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { login as apiLogin, signup as apiSignup, getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (!storedToken) { setLoading(false); return; }
      try {
        const res = await getMe();
        setUser(res.data?.user || res.data);
        setToken(storedToken);
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await apiLogin(credentials);
    const { session, user: userData } = res.data;
    const accessToken = session?.access_token;
    if (accessToken) {
      localStorage.setItem('authToken', accessToken);
      setToken(accessToken);
    }
    setUser(userData);
    return res;
  }, []);

  const signup = useCallback(async (data) => {
    const res = await apiSignup(data);
    const { session, user: userData } = res.data;
    if (session?.access_token) {
      localStorage.setItem('authToken', session.access_token);
      setToken(session.access_token);
      setUser(userData);
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
