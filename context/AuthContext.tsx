"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, backend } from '@/lib/mock-backend';

interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = backend.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = (username: string) => {
    const user = backend.login(username);
    setUser(user);
  };

  const logout = () => {
    backend.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
