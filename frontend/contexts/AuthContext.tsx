import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/api';

interface User {
  id: number;
  email: string;
  full_name?: string;
  is_admin: boolean;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and load user on mount
    const token = localStorage.getItem('access_token');
    console.log('AuthContext: Initializing, token found:', !!token);
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = useCallback(async () => {
    console.log('AuthContext: loadUser called');
    try {
      const token = localStorage.getItem('access_token');
      console.log('AuthContext: loadUser - token from localStorage:', token ? 'exists' : 'does not exist');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await apiClient.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('AuthContext: loadUser - /api/auth/me response:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('AuthContext: Failed to load user:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
      console.log('AuthContext: loadUser finished, user:', user); // Note: user might be stale here
    }
  }, []); // Depend on nothing for now, will re-evaluate after debugging

  const login = async (email: string, password: string) => {
    console.log('AuthContext: login called for email:', email);
    const response = await apiClient.post('/api/auth/login', { email, password });
    const { access_token, refresh_token } = response.data;
    console.log('AuthContext: login successful, access_token received.');

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    console.log('AuthContext: tokens stored in localStorage.');

    await loadUser();
    console.log('AuthContext: loadUser completed after login.');
  };

  const register = async (email: string, password: string, fullName?: string) => {
    console.log('AuthContext: register called for email:', email);
    await apiClient.post('/api/auth/register', {
      email,
      password,
      full_name: fullName,
    });
    console.log('AuthContext: registration successful.');

    // Auto-login after registration
    await login(email, password);
    console.log('AuthContext: auto-login completed after registration.');
  };

  const logout = () => {
    console.log('AuthContext: logout called.');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const refreshToken = async () => {
    console.log('AuthContext: refreshToken called.');
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      logout();
      return;
    }

    try {
      const response = await apiClient.post('/api/auth/refresh', {
        refresh_token: refresh,
      });
      const { access_token, refresh_token: new_refresh } = response.data;
      console.log('AuthContext: token refresh successful.');

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', new_refresh);
    } catch (error) {
      console.error('AuthContext: Token refresh failed:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
