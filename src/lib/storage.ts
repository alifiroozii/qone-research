/**
 * Safe localStorage wrapper for demo mode.
 * localStorage is NOT a real database — it is a browser-only,
 * per-device, non-shared store used purely to persist demo data
 * across refreshes. It is explicitly NOT used for security.
 */

const PREFIX = "qone:";

export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — ignore in demo mode */
  }
}

export function removeStore(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

export function clearStore(): void {
  if (typeof window === "undefined") return;
  try {
    const keys = Object.keys(window.localStorage);
    keys.forEach((k) => {
      if (k.startsWith(PREFIX)) window.localStorage.removeItem(k);
    });
  } catch {
    /* ignore */
  }
}
