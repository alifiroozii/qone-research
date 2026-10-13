"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AppDatabase } from "@/types/db";
import { getRepository } from "@/server/providers/repository";
import { DemoRepository } from "@/server/repositories/demo-repository";

interface DataContextValue {
  db: AppDatabase;
  repo: DemoRepository;
  refresh: () => void;
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

/**
 * Provides the live demo database snapshot + a way to trigger re-renders
 * after mutations. A single shared repo instance ensures every dashboard
 * reflects the same source of truth and stays in sync after any action.
 */
export function DataProvider({ children }: { children: React.ReactNode }) {
  const repoRef = React.useRef<DemoRepository | null>(null);
  if (!repoRef.current) repoRef.current = getRepository();
  const [db, setDb] = useState<AppDatabase>(() => repoRef.current!.snapshot());

  const refresh = useCallback(() => {
    // snapshot() returns the same object reference; shallow clone to notify React.
    const snap = repoRef.current!.snapshot();
    setDb({ ...snap });
  }, []);

  const resetDemoData = useCallback(() => {
    repoRef.current!.resetToSeed();
    setDb({ ...repoRef.current!.snapshot() });
  }, []);

  return (
    <DataContext.Provider value={{ db, repo: repoRef.current, refresh, resetDemoData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
