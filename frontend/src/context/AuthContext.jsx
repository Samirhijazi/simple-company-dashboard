import { createContext, useContext, useState, useCallback } from 'react';
import {authApi} from '../api/client'

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('dashboard_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email, password) => {
    console.log("AWAW")
    const {token, user: loggedInUser} = await authApi.login(email, password);
    localStorage.setItem('dashboard_token', token);
    localStorage.setItem('dashboard_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dashboard_token');
    localStorage.removeItem('dashboard_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
