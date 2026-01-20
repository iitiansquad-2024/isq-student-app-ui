"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserProfile, logout as apiLogout, UserProfile } from '@/lib/authApi';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (user: UserProfile) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const profile = await getUserProfile();
      setUser(profile);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: UserProfile) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      setLoading(true);
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
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
