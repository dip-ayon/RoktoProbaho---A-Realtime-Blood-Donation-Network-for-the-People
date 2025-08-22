'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, User, LoginCredentials, RegisterData } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  toggleDonorStatus: () => Promise<{ success: boolean; error?: string }>;
  toggleAvailability: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await apiClient.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data.user);
          } else {
            // Token is invalid, clear it
            apiClient.clearToken();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        apiClient.clearToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.login(credentials);
      if (response.success && response.data) {
        apiClient.setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiClient.register(data);
      if (response.success && response.data) {
        apiClient.setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      const response = await apiClient.updateProfile(updates);
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Update failed' };
      }
    } catch (error) {
      return { success: false, error: 'Update failed' };
    }
  };

  const toggleDonorStatus = async () => {
    try {
      const response = await apiClient.toggleDonorStatus();
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to toggle donor status' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to toggle donor status' };
    }
  };

  const toggleAvailability = async () => {
    try {
      const response = await apiClient.toggleAvailability();
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to toggle availability' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to toggle availability' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    toggleDonorStatus,
    toggleAvailability,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
