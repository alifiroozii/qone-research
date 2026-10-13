"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Role } from "@/types";
import { getRepository } from "@/server/providers/repository";
import { readStore, writeStore } from "@/lib/storage";
import { AUTH_KEY } from "@/types/db";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextValue {
  user: SessionUser | null;
  login: (loginId: string, password: string) => { ok: boolean; error?: string };
  demoLogin: (role: Role) => { ok: boolean; error?: string };
  logout: () => void;
  isDemo: boolean;
  hydrated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Demo-only auth. Passwords are matched against seeded demo accounts in
 * the browser store. This is NOT secure authentication — when a real
 * database is connected, replace this with server-side sessions, password
 * hashing and rate limiting.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStore<SessionUser | null>(AUTH_KEY, null);
    setUser(stored);
    setHydrated(true);
  }, []);

  const persist = useCallback((next: SessionUser | null) => {
    setUser(next);
    writeStore(AUTH_KEY, next);
  }, []);

  const login = useCallback(
    (loginId: string, password: string) => {
      const repo = getRepository();
      const found = repo.findUserByLogin(loginId);
      if (!found) return { ok: false, error: "کاربری با این نام کاربری یا ایمیل یافت نشد." };
      // Demo mode: accept the seeded demo password for any known user.
      if (password !== "demo1234") {
        return { ok: false, error: "رمز عبور نادرست است. (در حالت آزمایشی: demo1234)" };
      }
      persist({ id: found.id, name: found.fullName, email: found.email, role: found.role });
      return { ok: true };
    },
    [persist]
  );

  const demoLogin = useCallback(
    (role: Role) => {
      const repo = getRepository();
      const found = repo.users().find((u: User) => u.role === role);
      if (!found) return { ok: false, error: "حساب آزمایشی برای این نقش یافت نشد." };
      persist({ id: found.id, name: found.fullName, email: found.email, role: found.role });
      return { ok: true };
    },
    [persist]
  );

  const logout = useCallback(() => persist(null), [persist]);

  return (
    <AuthContext.Provider value={{ user, login, demoLogin, logout, isDemo: true, hydrated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
