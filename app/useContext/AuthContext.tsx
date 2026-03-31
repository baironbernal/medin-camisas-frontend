'use client';

import React, { createContext, useContext, useState, useTransition } from 'react';
import { logout as serverLogout } from '@/app/services/auth';
import { AuthUser } from '@/types/auth';

interface AuthContextValue {
  isLoggedIn: boolean;
  user: AuthUser | null;
  setLoggedIn: (v: boolean) => void;
  setUser: (u: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  user: null,
  setLoggedIn: () => {},
  setUser: () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
  initialSession: {
    isAuthenticated: boolean;
    user: AuthUser | null;
  };
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialSession.isAuthenticated);
  const [user, setUser] = useState<AuthUser | null>(initialSession.user);
  const [, startTransition] = useTransition();

  const logout = async () => {
    await serverLogout();
    startTransition(() => {
      setIsLoggedIn(false);
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setLoggedIn: setIsLoggedIn, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
