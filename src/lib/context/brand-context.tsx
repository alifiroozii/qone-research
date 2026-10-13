"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { BrandConfig } from "@/types";
import { DEFAULT_BRAND_CONFIG } from "@/lib/constants/brand";
import { readStore, writeStore } from "@/lib/storage";
import { BRAND_KEY } from "@/types/db";

interface BrandContextValue {
  brand: BrandConfig;
  updateBrand: (patch: Partial<BrandConfig>) => void;
  resetBrand: () => void;
}

const BrandContext = createContext<BrandContextValue | undefined>(undefined);

/**
 * Central branding source. All brand name, slogan, contact and color
 * values flow from here so rebranding never requires code changes.
 * Colors are applied to :root as CSS variables (Design Tokens).
 */
export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<BrandConfig>(DEFAULT_BRAND_CONFIG);

  useEffect(() => {
    const stored = readStore<BrandConfig>(BRAND_KEY, DEFAULT_BRAND_CONFIG);
    setBrand(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (brand.primaryColor) root.style.setProperty("--brand-primary", brand.primaryColor);
    if (brand.secondaryColor) root.style.setProperty("--brand-secondary", brand.secondaryColor);
    if (brand.accentColor) root.style.setProperty("--brand-accent", brand.accentColor);
  }, [brand]);

  const updateBrand = useCallback((patch: Partial<BrandConfig>) => {
    setBrand((prev) => {
      const next = { ...prev, ...patch };
      writeStore(BRAND_KEY, next);
      return next;
    });
  }, []);

  const resetBrand = useCallback(() => {
    setBrand(DEFAULT_BRAND_CONFIG);
    writeStore(BRAND_KEY, DEFAULT_BRAND_CONFIG);
  }, []);

  return <BrandContext.Provider value={{ brand, updateBrand, resetBrand }}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used within BrandProvider");
  return ctx;
}
