'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { getSession, removeSession } from '@/app/lib/session';
import { AuthUser } from '@/types/auth';

interface AuthContextValue {
  isLoggedIn: boolean;
  user: AuthUser | null;
  setLoggedIn: (v: boolean) => void;
  setUser: (u: AuthUser | null) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  user: null,
  setLoggedIn: () => {},
  setUser: () => {},
  logout: async () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getSession();
        startTransition(() => {
          setIsLoggedIn(session.isAuthenticated);
          setUser(session.user);
          setIsLoading(false);
        });
      } catch {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const logout = async () => {
    await removeSession();
    startTransition(() => {
      setIsLoggedIn(false);
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setLoggedIn: setIsLoggedIn, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
