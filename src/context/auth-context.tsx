'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types';

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateUser: (updatedProfile: Partial<UserProfile>) => void;
  isAuthLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'roktoprobaho_user_profile';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false); // To prevent UI flicker
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsedUser: UserProfile = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
        setIsAuthLoaded(true);
    }
  }, []);

  const login = (userData: UserProfile) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setIsLoggedIn(false);
    router.push('/login');
  };

  const updateUser = (updatedProfile: Partial<UserProfile>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedProfile };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      return newUser;
    });
  };
  
  const value = { isLoggedIn, user, login, logout, updateUser, isAuthLoaded };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
